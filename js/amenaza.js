/* ══════════════════════════════════════════════════════════════
   LA FICHA DE AMENAZA
   Cálculo (Manual de Monstruos, Cap. 1 y Apéndice B) y las tarjetas de
   las cuatro pestañas: Perfil · Combate · Rasgos · Notas.

   Una criatura se construye como un personaje: su NA hace de Nivel y da
   la Competencia y el dado de daño; sus atributos (Fuerte, Normal o
   Débil) dan el ataque, el daño, la Guardia, los PV, las Salvaciones, la
   CD y la Iniciativa. Toda cifra sale de calcCr(). Nada se guarda
   calculado: la amenaza solo recuerda sus decisiones (NA, tipo, tamaño,
   Rol, atributos, Rasgos…) y los valores fijados a mano.

   El «Potencial» del Manual se llama `peso` en el código y en los datos:
   es el nombre que tenía, y cambiarlo rompería las amenazas guardadas.
══════════════════════════════════════════════════════════════ */
Object.assign(app, {
  ATTRS: ['FUE', 'DES', 'CON', 'INT', 'SAB', 'CAR'],
  ATTR_N: { FUE: 'Fuerza', DES: 'Destreza', CON: 'Constitución', INT: 'Inteligencia', SAB: 'Sabiduría', CAR: 'Carisma' },
  /* «La criatura en ocho tiradas» (Manual de Monstruos, Cap. 9) */
  AZAR_TIPO: ['bestia', 'bestia', 'bestia', 'humanoide', 'gigante', 'monstruosidad', 'monstruosidad', 'dragon', 'no_muerto', 'no_muerto',
    'espiritu', 'constructo', 'maquina', 'elemental', 'extraplanar', 'feerico', 'aberracion', 'planta_u_hongo', 'cieno', 'mutante'],
  AZAR_ROL: ['arrollador', 'hostigador', 'represor', 'comandante', 'soporte', 'explorador', 'artillero', 'acechador', 'guardian', ''],
  /* Roles que cambiaron de nombre en el Manual: las amenazas guardadas antes siguen abriendo */
  ROL_ANTES: { bruto: 'arrollador', controlador: 'represor', emboscador: 'acechador' },
  /* Rasgos que cambiaron de nombre en el Manual (Estúpida → Crédula, 2-10-2026) */
  RASGO_ANTES: { estupida: 'credula' },
  ORDEN_TAM: ['diminuto', 'pequeno', 'mediano', 'grande', 'enorme', 'colosal'],
  UD: ['Ud12', 'Ud10', 'Ud8', 'Ud6', 'Ud4'],

  /* ── Modelo ───────────────────────────────────────────────────── */
  nuevaCr() {
    const cr = {
      v: 2, nombre: '', idea: '', retrato: '',
      na: 1, tipo: 'bestia', tam: 'mediano', rol: '', estructura: 'normal', miembros: 6,
      fuertes: [], debiles: [], manual: {}, ataqueNombre: '', danoTipo: '',
      rasgos: [], moralNoTira: false, pvAct: null,
      senal: '', contexto: '', proteccion: '', habitat: '', quiere: '', pelea: '', botin: '', notas: '',
      jefe: { fases: '', guarida: '', victoria: '' }, revision: [false, false, false, false],
    };
    this._ponerRasgosDeTipo(cr);
    Object.assign(cr, this._atributosDe(cr));
    return cr;
  },

  /** Los atributos que dan el tipo y el Rol (Cap. 1 y 2, 23-10-2026): el tipo
      decide los dos Fuertes; la clave del Rol es siempre Fuerte y, si el tipo no
      la tiene, sustituye al Fuerte que menos encaja con su táctica (la app
      conserva el que pide el Rol, `afin`). El dragón no sustituye: su clave se
      suma como cuarto Fuerte en calcCr. Los Débiles del Rol se suman a los del
      tipo, salvo si caen sobre un Fuerte. */
  _atributosDe(cr) {
    const rol = this.DB.roles[cr.rol] || {}, tipo = this.DB.tipos[cr.tipo] || {};
    const fuertes = (tipo.fuertesDef || ['FUE', 'CON']).slice(0, 2);
    const clave = rol.clave || [];
    if (!tipo.fuerteExtra && clave.length && !clave.some(a => fuertes.includes(a))) {
      const afin = rol.afin || [];
      const i = fuertes.findIndex(a => !afin.includes(a));
      fuertes[i >= 0 ? i : 1] = clave[0];
    }
    return { fuertes, debiles: this._debilesDe(cr, fuertes) };
  },
  _debilesDe(cr, fuertes) {
    const rol = this.DB.roles[cr.rol] || {}, tipo = this.DB.tipos[cr.tipo] || {};
    return [...new Set([...(rol.debiles || []), ...(tipo.debiles || [])])].filter(a => !fuertes.includes(a));
  },
  /** Tras cambiar de Rol o de tipo: los dos deciden los Fuertes, así que se
      vuelven a poner los suyos (luego se pueden cambiar a mano). */
  _reponerAtributos(cr) {
    Object.assign(cr, this._atributosDe(cr));
  },

  /** Deja cualquier amenaza —guardada, importada o del bestiario— con
      todos sus campos, del tipo correcto y sin HTML dentro. */
  normalizarCr(d) {
    const base = {
      v: 2, nombre: '', idea: '', retrato: '', na: 1, tipo: 'bestia', tam: 'mediano', rol: '', estructura: 'normal',
      miembros: 6, fuertes: [], debiles: [], manual: {}, ataqueNombre: '', danoTipo: '', rasgos: [], moralNoTira: false, pvAct: null,
      senal: '', contexto: '', habitat: '', quiere: '', pelea: '', botin: '', notas: '',
      jefe: { fases: '', guarida: '', victoria: '' }, revision: [false, false, false, false],
    };
    d = (d && typeof d === 'object' && !Array.isArray(d)) ? d : {};
    const txt = v => this._sanitize(typeof v === 'string' ? v : '').slice(0, 6000);
    const cr = { ...base };
    ['nombre', 'idea', 'ataqueNombre', 'danoTipo', 'senal', 'contexto', 'proteccion', 'habitat', 'quiere', 'pelea', 'botin', 'notas',
     'fuente', 'equipo', 'rolNota', 'salvTxt', 'encuentroTxt'].forEach(k => { if (d[k] != null) cr[k] = txt(d[k]); });
    cr.nombre = cr.nombre.slice(0, 80);
    cr.retrato = this._retratoOk(d.retrato) ? d.retrato : '';
    const na = parseInt(d.na, 10);
    cr.na = Number.isFinite(na) ? Math.max(0, Math.min(15, na)) : 1;
    cr.tipo = this.DB.tipos[d.tipo] ? d.tipo : 'bestia';
    cr.tam = this.DB.tamanos[d.tam] ? d.tam : 'mediano';
    const rol = this.DB.roles[d.rol] ? d.rol : this.ROL_ANTES[d.rol];
    cr.rol = this.DB.roles[rol] ? rol : '';
    cr.estructura = ['normal', 'jefe', 'horda'].includes(d.estructura) ? d.estructura : 'normal';
    const m = parseInt(d.miembros, 10);
    cr.miembros = Number.isFinite(m) ? Math.max(2, Math.min(999, m)) : 6;
    // Atributos. Las amenazas de antes (v1) solo guardaban sus dos Salvaciones
    // fuertes: valen como Fuertes; si no hay, los de su tipo y su Rol.
    const lista = l => Array.isArray(l) ? [...new Set(l.filter(a => this.ATTRS.includes(a)))] : [];
    // Solo las guardadas con las reglas anteriores llevan v: 1; las del
    // bestiario de fábrica no llevan versión y sus ajustes a mano valen.
    const antigua = parseInt(d.v, 10) === 1;
    cr.fuertes = lista(d.fuertes).slice(0, 2);
    if (cr.fuertes.length < 2) {
      const salv = lista(d.salv).slice(0, 2);
      cr.fuertes = salv.length === 2 ? salv : this._atributosDe(cr).fuertes;
    }
    cr.debiles = Array.isArray(d.debiles) ? lista(d.debiles).filter(a => !cr.fuertes.includes(a)) : this._debilesDe(cr, cr.fuertes);
    cr.moralNoTira = !!d.moralNoTira;
    cr.resisteTodo = !!d.resisteTodo;
    cr.pvAct = !antigua && Number.isFinite(parseInt(d.pvAct, 10)) ? Math.max(0, parseInt(d.pvAct, 10)) : null;
    cr.manual = {};
    // Las cifras impresas del bestiario antiguo no valen con las fórmulas nuevas;
    // lo que el Director fijó a mano en sus propias amenazas, sí se conserva.
    if (d.manual && typeof d.manual === 'object' && !(antigua && d.fuente)) {
      ['pv', 'guardia', 'armadura', 'ataque', 'pa', 'vel', 'ini', 'moral', 'cd'].forEach(k => {
        const n = parseInt(d.manual[k], 10);
        if (Number.isFinite(n)) cr.manual[k] = n;
      });
      if (typeof d.manual.dano === 'string' && this._parseDanos(d.manual.dano)) cr.manual.dano = d.manual.dano.replace(/−/g, '-');
    }
    cr.rasgos = (Array.isArray(d.rasgos) ? d.rasgos : []).slice(0, 60).map(r => this._normalizarRasgo(r)).filter(Boolean);
    const j = d.jefe && typeof d.jefe === 'object' ? d.jefe : {};
    cr.jefe = { fases: txt(j.fases), guarida: txt(j.guarida), victoria: txt(j.victoria) };
    cr.revision = [0, 1, 2, 3].map(i => !!(Array.isArray(d.revision) && d.revision[i]));
    if (d.impreso && typeof d.impreso === 'object') cr.impreso = d.impreso;
    return cr;
  },

  _normalizarRasgo(r) {
    if (!r || typeof r !== 'object') return null;
    const s = v => this._sanitize(typeof v === 'string' ? v : '').slice(0, 1500);
    const o = { uid: typeof r.uid === 'string' && r.uid ? r.uid : this._uid() };
    if (r.custom || !r.id) {
      o.custom = true;
      o.name = s(r.name) || 'Rasgo propio';
      o.tipo = ['Rasgo', 'Aptitud', 'Reacción', 'Modificador', 'Aura', 'Debilidad'].includes(r.tipo) ? r.tipo : 'Rasgo';
      const p = parseInt(r.peso, 10);
      o.peso = Number.isFinite(p) ? Math.max(-1, Math.min(3, p)) : 0;
      o.txt = s(r.txt);
      if (r.coste) o.coste = s(r.coste).slice(0, 40);
      if (r.frec) o.frec = s(r.frec).slice(0, 40);
      if (r.mod && typeof r.mod === 'object') {
        o.mod = {};
        ['a', 'g', 'vel', 'pa', 'moral'].forEach(k => { const n = parseInt(r.mod[k], 10); if (Number.isFinite(n)) o.mod[k] = n; });
      }
      const ar = parseInt(r.area, 10);
      if (Number.isFinite(ar) && ar > 0) o.area = Math.min(3, ar);   // Aptitud de área de la Guía: lo que suma al encuentro
      if (r.axiomas) o.axiomas = true;
    } else {
      o.id = String(r.id).slice(0, 60);
      const pz = parseInt(r.peso, 10);
      if (Number.isFinite(pz)) o.peso = Math.max(-1, Math.min(3, pz));   // Uso de Axiomas de Nivel 4 o más: 3
      if (this.RASGO_ANTES[o.id] && !this._libIdx()[o.id]) o.id = this.RASGO_ANTES[o.id];
      if (r.txt) o.txt = s(r.txt);
    }
    if (r.nota) o.nota = s(r.nota).slice(0, 160);
    if (r.gratis) { o.gratis = true; o.origen = r.origen === 'plantilla' ? 'plantilla' : 'tipo'; }
    // Rasgos de especie (Cap. 2): la Aptitud definitoria es la más fuerte de ellos;
    // el racial mayor es la segunda pieza gratuita de un jefe.
    if (r.especie || r.definitoria || r.racial) o.especie = true;
    if (r.definitoria) o.definitoria = true;
    if (r.racial) o.racial = true;
    if (typeof r.udAct === 'string' && (this.UD.includes(r.udAct) || r.udAct === 'agotada')) o.udAct = r.udAct;
    if (r.usada) o.usada = true;
    return o;
  },

  /* ── Biblioteca: índice por id ────────────────────────────────── */
  _libIdx() {
    if (this._libCache && this._libCacheDB === this.DB.rasgos) return this._libCache;
    const idx = {};
    Object.entries(this.DB.rasgos || {}).forEach(([fam, lista]) => (lista || []).forEach(e => { if (e && e.id) idx[e.id] = { fam, e }; }));
    this._libCache = idx; this._libCacheDB = this.DB.rasgos;
    return idx;
  },

  /** Lo que un Rasgo ES en este momento: la pieza de la Biblioteca más lo
      que la amenaza le haya puesto encima (nota, texto concreto). */
  rasgoInfo(r) {
    if (r.custom) {
      return { name: r.name, tipo: r.tipo, peso: r.peso || 0, txt: r.txt || '', coste: r.coste || '', frec: r.frec || '',
               fam: '', mod: r.mod || null, custom: true };
    }
    const hit = this._libIdx()[r.id];
    if (!hit) return { name: r.id, tipo: 'Rasgo', peso: 0, txt: r.txt || '', coste: '', frec: '', fam: '', mod: null, perdido: true };
    const e = hit.e;
    return { name: e.name, tipo: e.tipo, peso: r.peso != null ? r.peso : (e.peso || 0), txt: r.txt || e.txt || '', txtBase: e.txt || '', coste: e.coste || '',
             frec: e.frec || '', fam: hit.fam, mod: e.mod || null, pide: e.pide || '', multi: !!e.multi,
             narrativa: !!e.narrativa, area: !!e.area };
  },

  /** Rasgos gratuitos del tipo: fuera los del tipo anterior, dentro los nuevos. */
  _ponerRasgosDeTipo(cr) {
    const t = this.DB.tipos[cr.tipo] || {};
    cr.rasgos = (cr.rasgos || []).filter(r => !(r.gratis && r.origen === 'tipo'));
    const nuevos = [];
    (t.gratis || []).forEach(g => nuevos.push({ uid: this._uid(), id: g.id, gratis: true, origen: 'tipo', ...(g.nota ? { nota: g.nota } : {}) }));
    (t.elige || []).forEach(grupo => { if (grupo && grupo[0]) nuevos.push({ uid: this._uid(), id: grupo[0], gratis: true, origen: 'tipo' }); });
    cr.rasgos = nuevos.concat(cr.rasgos);
  },

  /* ── Cálculo ──────────────────────────────────────────────────── */
  _parseDano(s) {
    const m = String(s || '').replace('−', '-').match(/^\s*(\d+)d(\d+)\s*([+-]\s*\d+)?\s*$/i);
    if (!m) return null;
    return { n: +m[1], caras: +m[2], bono: m[3] ? parseInt(m[3].replace(/\s/g, ''), 10) : 0 };
  },
  _fmtDano(d) { return `${d.n}d${d.caras}${d.bono > 0 ? '+' + d.bono : d.bono < 0 ? d.bono : ''}`; },
  /** «3d6+2 y 2d6+2» → [{…}, {…}]; un solo ataque → [{…}]. */
  _parseDanos(s) {
    const partes = String(s || '').split(/\s+y\s+/).map(x => this._parseDano(x));
    return partes.length && partes.length <= 2 && partes.every(Boolean) ? partes : null;
  },
  _mediaDano(d) { return d.n * (d.caras + 1) / 2 + d.bono; },

  /** Tamaño de horda (Manual de Monstruos, Cap. 6): cuánto sube el NA. */
  _horda(miembros) {
    const lista = Object.values(this.DB.hordas || {});
    const h = lista.find(x => miembros <= x.max) || lista[lista.length - 1] || { name: 'Turba', na: 6 };
    return { n: h.name, na: h.marea ? 6 : (h.na || 0), marea: !!h.marea };
  },

  calcCr(cr) {
    const rol = this.DB.roles[cr.rol] || {};
    const tam = this.DB.tamanos[cr.tam] || {};
    const tipo = this.DB.tipos[cr.tipo] || {};
    const jefe = cr.estructura === 'jefe', horda = cr.estructura === 'horda', esbirro = !!rol.esbirro;
    // Una horda se construye como una sola criatura de su NA efectivo (Cap. 6)
    const H = horda ? this._horda(cr.miembros) : null;
    const na = Math.min(15, cr.na + (H ? H.na : 0));
    const B = this.DB.na[na] || this.DB.na[1];

    // Rasgos: qué son y cuáles salen gratis (Cap. 2): los de tipo, el de Forma de
    // la Monstruosidad y el Mutante, los de especie de narrativa, un Rasgo de especie
    // de combate dentro del tope de su NA (en un dragón, su Aliento) y, en un jefe,
    // su racial mayor.
    const infos = cr.rasgos.map(r => ({ r, i: this.rasgoInfo(r) }));
    let autoGratis = null;
    if (tipo.gratisFam) {
      autoGratis = infos.find(x => !x.r.gratis && x.i.fam === tipo.gratisFam.fam && x.i.peso > 0 &&
        (tipo.gratisFam.peso == null || x.i.peso === tipo.gratisFam.peso)) || null;
    }
    const tope = na <= 4 ? 1 : na <= 9 ? 2 : 3;
    let especieLibre = tipo.alientoGratis ? (infos.find(x => x.r.id === 'aliento') || null) : null;
    if (!especieLibre) especieLibre = infos.filter(x => x.r.especie && !x.r.gratis && !x.r.racial && !x.i.narrativa && x.i.peso > 0 && x.i.peso <= tope)
      .sort((a, b) => b.i.peso - a.i.peso)[0] || null;
    const motivoGratis = x => x.r.gratis ? (x.r.origen === 'plantilla' ? 'plantilla' : 'de tipo') : x === autoGratis ? 'de tipo'
      : x === especieLibre || (x.r.especie && x.i.narrativa) ? 'especie' : (jefe && x.r.racial) ? 'racial mayor' : '';
    const esGratis = x => !!motivoGratis(x);
    const suma = k => infos.reduce((a, x) => a + ((x.i.mod && Number(x.i.mod[k])) || 0), 0);

    // Atributos: Fuerte = PB, Normal y Débil de la fila de su NA. El tamaño
    // suma o resta en FUE, DES y CON, o los deja en Débil («D») sin más.
    const fragil = infos.some(x => x.i.mod && x.i.mod.conDebil);
    // El dragón tiene además INT Fuerte, con su Salvación, y la clave de su Rol
    // se suma como cuarto Fuerte si no es uno de ellos (Cap. 2)
    const fuertes = cr.fuertes.concat(tipo.fuerteExtra && !cr.fuertes.includes(tipo.fuerteExtra) ? [tipo.fuerteExtra] : []);
    if (tipo.fuerteExtra && (rol.clave || []).length && !rol.clave.some(a => fuertes.includes(a))) fuertes.push(rol.clave[0]);
    const mod = {}, cat = {}, salv = {};
    this.ATTRS.forEach(a => {
      const t = tam[a.toLowerCase()];
      let c = fuertes.includes(a) ? 'F' : cr.debiles.includes(a) ? 'D' : 'N';
      if (t === 'D' || (a === 'CON' && fragil)) c = 'D';
      cat[a] = c;
      mod[a] = (c === 'F' ? B.fuerte : c === 'D' ? B.debil : B.normal) + (Number(t) || 0);
      // Salvación: en sus Fuertes, MOD + PB; en las demás, MOD + ½ NA (12-10-2026)
      salv[a] = mod[a] + (fuertes.includes(a) ? B.pb : Math.floor(na / 2));
    });
    const pega = Math.max(mod.FUE, mod.DES);            // «el mayor de FUE o DES»

    // Las fórmulas (Cap. 1). PV: (20 + NA × (8 + CON)) × 1,5 hacia abajo; NA 0: 1–4;
    // esbirro: NA × 2; jefe: el doble.
    const pvUno = esbirro ? Math.max(1, cr.na * 2) : na === 0 ? 4 : Math.max(1, Math.floor((20 + na * (8 + mod.CON)) * 3 / 2));
    // PA: los de su NA y sus Rasgos; un Arrollador Grande o mayor, al menos 4 desde NA 5
    let pa = B.pa + suma('pa');
    if (rol.danoDados && ['grande', 'enorme', 'colosal'].includes(cr.tam) && na >= 5) pa = Math.max(pa, 4);
    // Daño por turno: dado de su NA (+1d6 el Arrollador) + su ajuste + el MOD con que
    // ataca. Con 4 PA o más son dos Ataques Normales que se reparten los dados (el
    // primero lleva el impar), cada uno con su ajuste y su MOD.
    const dBase = this._parseDano(B.dano) || { n: 1, caras: 6, bono: 0 };
    const nDados = dBase.n + (rol.danoDados || 0), bono = (B.ajuste || 0) + pega;
    const ataques = pa >= 4 ? [Math.ceil(nDados / 2), Math.floor(nDados / 2)] : [nDados];
    const calc = {
      pv: pvUno * (jefe ? 2 : 1),
      guardia: 10 + B.pb + mod.DES + suma('g'),
      armadura: Math.max(0, Math.min(B.a + (rol.a || 0) + suma('a'), na + 3)),
      ataque: B.pb + pega,
      dano: ataques.map(n => this._fmtDano({ n, caras: dBase.caras, bono })).join(' y '),
      pa, vel: Math.max(0, 30 + (rol.vel || 0) + suma('vel')), ini: mod.DES + (rol.ini || 0),
      moral: 10 + na + suma('moral'),
      cd: 8 + B.pb + Math.floor(na / 2) + Math.max(...(fuertes.length ? fuertes : this.ATTRS).map(a => mod[a])),
    };

    // Lo que el Director haya fijado a mano manda sobre las fórmulas
    const M = cr.manual || {};
    const S = { calc, na, naEf: na, naMiembro: cr.na, B, pb: B.pb, mod, cat, salv, fuertes, rol, tam, tipo, jefe, horda, esbirro, H, pvUno,
      infos, autoGratis, especieLibre, tope, esGratis, motivoGratis };
    ['pv', 'guardia', 'armadura', 'ataque', 'dano', 'pa', 'vel', 'ini', 'moral', 'cd'].forEach(k => {
      S[k] = (M[k] != null && M[k] !== '') ? M[k] : calc[k];
    });
    S.aMano = Object.keys(calc).filter(k => M[k] != null && M[k] !== '' && String(M[k]) !== String(calc[k]));
    S.danoBase = B.dano;
    S.danoAtaques = (this._parseDanos(S.dano) || []).map(d => this._fmtDano(d));
    S.noMoral = !!cr.moralNoTira || tipo.noMoral === 'nunca' || esbirro || cat.INT === 'D' ||
      infos.some(x => x.i.mod && x.i.mod.noMoral) || (horda && cr.rasgos.some(r => r.id === 'enjambre'));

    // Potencial (Cap. 3): presupuesto por NA, +2 el jefe; cada Debilidad devuelve 1, hasta 2
    const debs = infos.filter(x => !esGratis(x) && (x.i.tipo === 'Debilidad' || x.i.peso < 0));
    S.pesoBase = esbirro ? 0 : B.peso + (jefe ? 2 : 0);
    S.devuelto = Math.min(2, debs.length);
    S.pesoMax = S.pesoBase + S.devuelto;
    S.pesoGastado = infos.reduce((a, x) => a + (!esGratis(x) && x.i.peso > 0 ? x.i.peso : 0), 0);
    S.exceso = Math.max(0, S.pesoGastado - S.pesoMax);
    S.nDebs = debs.length;

    // NA de encuentro (Cap. 4): su NA (la horda, el efectivo) + 1 por cada 2 de
    // exceso de Potencial + jefe 3 (4 desde NA 6) + su Aptitud de daño en área
    // (3 si es de Potencial 3, 2 si es de menos; en un jefe, uno menos; solo la
    // mayor) + 1 si es Enorme o Colosal + 1 si usa Axiomas.
    let area = 0;
    infos.forEach(x => { area = Math.max(area, x.i.area ? (x.i.peso >= 3 ? 3 : 2) : (Number(x.r.area) || 0)); });
    S.area = jefe ? Math.max(0, area - 1) : area;
    S.axiomas = infos.some(x => x.r.id === 'uso_de_axiomas' || x.r.axiomas);
    // +1 si resiste casi todo el daño del grupo y el grupo no tiene cómo evitarlo (lo decide el Director)
    S.naEnc = na + Math.floor(S.exceso / 2) + (jefe ? (na >= 6 ? 4 : 3) : 0) + S.area + (tam.naEnc || 0) + (S.axiomas ? 1 : 0) + (cr.resisteTodo ? 1 : 0);
    S.cuenta = esbirro ? .25 : 1;
    return S;
  },
  /** «NA 5», o «¼ de NA 2» si es un esbirro: lo que pesa al calibrar. */
  _txtCalibrar(S) { return (S.esbirro ? '¼ de ' : '') + 'NA ' + S.naEnc; },

  /** Avisos de «lejos de las fórmulas» (Guía, Cap. 16). `solo`: las claves
      de la tarjeta que los enseña; sin él, todos (la revisión final). */
  _avisosCurva(S, solo) {
    const av = [];
    const c = S.calc;
    if (S.aMano.includes('ataque') && S.ataque > c.ataque + 1)
      av.push(['ataque', `Ataque ${this._signo(S.ataque)} frente a ${this._signo(c.ataque)} de la fórmula: la amenaza vive en el daño, no en acertar más.`]);
    if (S.armadura > S.na + 3) av.push(['armadura', `Armadura ${S.armadura}: nunca más de NA + 3 (${S.na + 3}).`]);
    if (S.aMano.includes('pv') && c.pv && Math.abs(S.pv - c.pv) / c.pv > .25) av.push(['pv', `PV ${S.pv}: la fórmula da ${c.pv}.`]);
    if (S.aMano.includes('guardia') && Math.abs(S.guardia - c.guardia) >= 3) av.push(['guardia', `Guardia ${S.guardia}: la fórmula da ${c.guardia}.`]);
    if (S.aMano.includes('dano')) {
      const a = (this._parseDanos(S.dano) || [])[0], b = (this._parseDanos(c.dano) || [])[0];
      if (a && b && Math.abs(this._mediaDano(a) - this._mediaDano(b)) / this._mediaDano(b) > .3) av.push(['dano', `Daño ${S.dano}: la fórmula da ${c.dano}.`]);
    }
    return av.filter(([k]) => !solo || solo.includes(k)).map(([, t]) => t);
  },

  /* ── Pintado general ──────────────────────────────────────────── */
  /** Repinta la ficha desde app.cr. `todo` reescribe también los campos de
      texto (al abrir una amenaza o al cancelar una edición). */
  pintarFicha(todo) {
    const cr = this.cr; if (!cr) return;
    this._pintando = true;
    const S = this._S = this.calcCr(cr);
    try {
      this._pintarPersonal(S, todo);
      this._pintarIdentidad(S);
      this._pintarEstado(S);
      this._pintarStats(S);
      this._pintarDefensa(S);
      this._pintarAtaque(S);
      this._pintarSalv(S);
      this._pintarRasgos(S);
      this._pintarSenal(S);
      this._pintarJefe(S);
      this._pintarRevision(S);
      if (todo) {
        const n = document.getElementById('char_notes'); if (n) n.value = cr.notas || '';
        Object.keys(this.SECS).forEach(s => {
          if (this._enEdicion(s) && typeof this['_editar_' + s] === 'function') this['_editar_' + s]();
        });
      }
    } finally { this._pintando = false; }
    if (typeof this._refrescarPlegables === 'function') this._refrescarPlegables();
  },

  /** Un cambio hecho desde la ficha: marca «sin guardar» y repinta. */
  cambio(todo) {
    this._markUnsaved();
    this.pintarFicha(todo);
  },

  /** Campos fijos del HTML (nombre, idea, notas, PV actuales). */
  _enlazarFicha() {
    const on = (id, ev, fn) => document.getElementById(id)?.addEventListener(ev, fn);
    on('char_name', 'input', e => { this.cr.nombre = e.target.value; this._markUnsaved(); this._pintarPersonal(this._S, false); });
    on('char_concept', 'input', e => { this.cr.idea = e.target.value; this._markUnsaved(); this._pintarPersonal(this._S, false); });
    on('char_notes', 'input', e => { this.cr.notas = e.target.value; this._markUnsaved(); });
    on('cur_pv', 'input', e => {
      const n = parseInt(e.target.value, 10);
      this.cr.pvAct = Number.isFinite(n) ? Math.max(0, n) : 0;
      this._anchoPV();
      this._markUnsaved(); this._updateResBars(); this._notaEstado(this._S);
    });
    // Los ± de PV escriben en el campo; aquí se recoge en la amenaza.
    const _adj = this.adjustRes;
    this.adjustRes = function (curId) {
      const r = _adj.apply(this, arguments);
      if (curId === 'cur_pv' && this.cr) {
        this.cr.pvAct = parseInt(document.getElementById('cur_pv').value, 10) || 0;
        this._notaEstado(this._S);
        if (typeof this._refrescarPlegables === 'function') this._refrescarPlegables();
      }
      return r;
    };
  },

  /* ── Perfil ───────────────────────────────────────────────────── */
  _editar_personal() {
    const n = document.getElementById('char_name'), c = document.getElementById('char_concept');
    if (n && document.activeElement !== n) n.value = this.cr.nombre || '';
    if (c && document.activeElement !== c) c.value = this.cr.idea || '';
  },

  _pintarPersonal(S, todo) {
    const cr = this.cr;
    const a = document.getElementById('char_img'), b = document.getElementById('char_img_summary');
    const src = this._retratoOk(cr.retrato) ? cr.retrato : DEFAULT_PORTRAIT;
    if (a && a.getAttribute('src') !== src) a.src = src;
    if (b && b.getAttribute('src') !== src) b.setAttribute('src', src);
    if (todo) this._editar_personal();
    const set = (id, t) => { const e = document.getElementById(id); if (e) e.textContent = t; };
    set('sum_name_ov', cr.nombre || 'Sin nombre');
    set('sum_lvl_ov', [this._etiquetaNA(cr), this.DB.roles[cr.rol]?.name].filter(Boolean).join(' · '));
    set('sum_bio_ov', cr.idea || '');
  },

  nombreAlAzar() {
    this.cr.nombre = this._nombreAzar();
    const n = document.getElementById('char_name'); if (n) n.value = this.cr.nombre;
    this.cambio();
  },
  /** «el Tejedor del Pozo», «Mórdax Carroñera», «la Madre de las Horas». */
  _nombreAzar() {
    const T = this.DB.tablas;
    const epi = this._azar(T.nomEpiteto.filas);
    if (Math.random() < .5) return `${this._azar(T.nomNucleo.filas)} ${epi}`.replace(/^./, c => c.toUpperCase());
    const raiz = this._azar(T.nomRaiz.filas).replace(/-$/, '');
    return `${raiz}${this._azar(T.nomFin.filas)} ${epi}`;
  },

  _pintarIdentidad(S) {
    const cr = this.cr;
    const fila = document.getElementById('id_fila'); if (!fila) return;
    fila.textContent = '';
    const badge = (cls, t) => { const s = this.h('span', 'ibadge ' + cls); s.appendChild(this.h('span', null, t)); return s; };
    const tipo = this.DB.tipos[cr.tipo]?.name || '—';
    const tam = this.DB.tamanos[cr.tam]?.name || '';
    fila.append(badge('ib-desc', 'NA ' + S.na), badge('ib-arq', `${tipo} ${tam.toLowerCase()}`.trim()),
      badge('ib-bg', this.DB.roles[cr.rol]?.name || 'Sin Rol'));
    // Solo las medallas: lo que cuentan el jefe, la horda o el NA al calibrar
    // se ve al editar la tarjeta y en Combate → Estadísticas («Al calibrar»).
  },

  /** Campo con rótulo. */
  _campo(rotulo, control, nota) {
    const d = this.h('div', 'dir-campo');
    const l = this.h('span', 'fl', rotulo);
    if (nota) { l.appendChild(document.createTextNode(' ')); l.appendChild(this.h('span', 'is-field-note', '— ' + nota)); }
    d.append(l, control);
    return d;
  },
  _select(opciones, valor, alCambiar, etiqueta) {
    const s = document.createElement('select');
    if (etiqueta) s.setAttribute('aria-label', etiqueta);
    opciones.forEach(([v, t]) => s.appendChild(new Option(t, v)));
    s.value = valor;
    s.addEventListener('change', () => alCambiar(s.value));
    return s;
  },
  /** − valor + */
  _paso(valor, min, max, alCambiar, etiqueta, texto) {
    const w = this.h('span', 'dir-paso');
    const mk = (t, d) => {
      const b = this.h('button', 'dir-pm', t);
      b.type = 'button';
      b.setAttribute('aria-label', `${d < 0 ? 'Bajar' : 'Subir'} ${etiqueta || ''}`.trim());
      b.disabled = d < 0 ? valor <= min : valor >= max;
      b.addEventListener('click', () => alCambiar(Math.max(min, Math.min(max, valor + d))));
      return b;
    };
    w.append(mk('−', -1), this.h('span', 'dir-paso-v', texto != null ? texto : String(valor)), mk('+', 1));
    return w;
  },
  _seg(opciones, valor, alCambiar, etiqueta) {
    const g = this.h('div', 'seg seg-n' + opciones.length);
    g.setAttribute('role', 'group');
    if (etiqueta) g.setAttribute('aria-label', etiqueta);
    opciones.forEach(([v, t]) => {
      const b = this.h('button', 'seg-btn' + (v === valor ? ' active' : ''), t);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(v === valor));
      b.addEventListener('click', () => alCambiar(v));
      g.appendChild(b);
    });
    return g;
  },
  _info(texto) { const d = this.h('div', 'infobox'); d.textContent = texto; return d; },
  /** Botón pequeño de dado para tirar en una tabla. */
  _botonDado(etiqueta, alPulsar) {
    const b = this.h('button', 'btn btn-g dir-dado');
    b.type = 'button';
    b.setAttribute('aria-label', etiqueta);
    b.title = etiqueta;
    b.innerHTML = '<svg class="ico ico-solo" aria-hidden="true"><use href="#i-d20"/></svg>';
    b.addEventListener('click', alPulsar);
    return b;
  },

  _editar_identity() {
    const cr = this.cr, S = this._S || this.calcCr(cr);
    const v = this._vista('identity', 'edit');
    v.textContent = '';
    const repintar = () => { this.cambio(); this._editar_identity(); };

    // NA
    const B = S.B, etq = (this.DB.na[cr.na] || {}).etiqueta;
    v.appendChild(this._campo('Nivel de Amenaza', this._paso(cr.na, 0, 15, n => { cr.na = n; cr.pvAct = null; repintar(); },
      'el Nivel de Amenaza', 'NA ' + cr.na + (etq ? ' · ' + etq : '')),
      S.horda ? 'el de cada miembro' : 'cuánto pesa en la escena'));
    v.appendChild(this._info((S.horda ? `Como horda, NA ${S.na}. ` : '') +
      `Competencia ${this._signo(B.pb)} · Fuerte ${this._signo(B.fuerte)} · Normal ${this._signo(B.normal)} · Débil ${this._signo(B.debil)}\nDado de daño ${B.dano} · Armadura ${B.a} · PA ${B.pa} · Potencial ${B.peso}`));

    // Tipo
    const tipos = Object.entries(this.DB.tipos).map(([k, t]) => [k, t.name]);
    v.appendChild(this._campo('Tipo', this._select(tipos, cr.tipo, k => {
      cr.tipo = k;
      this._ponerRasgosDeTipo(cr);
      this._reponerAtributos(cr);
      const t = this.DB.tipos[k];
      if (t.tamMin && this.ORDEN_TAM.indexOf(cr.tam) < this.ORDEN_TAM.indexOf(t.tamMin)) cr.tam = t.tamMin;
      cr.pvAct = null;
      repintar();
    }, 'Tipo de criatura'), 'Rasgos gratuitos y atributos Débiles'));
    const t = this.DB.tipos[cr.tipo] || {};
    v.appendChild(this._info(`${t.txt || 'Sin Rasgos de tipo.'}\nFuertes: ${t.fuertesTxt || '—'} · Débiles: ${t.atrDeb || '—'} · Debilidad coherente: ${t.deb || '—'}`));
    (t.elige || []).forEach(grupo => {
      const actual = cr.rasgos.find(r => r.gratis && r.origen === 'tipo' && grupo.includes(r.id));
      const ops = grupo.map(id => [id, this._libIdx()[id]?.e.name || id]);
      v.appendChild(this._campo('Rasgo de tipo a elegir', this._seg(ops, actual?.id || grupo[0], id => {
        if (actual) actual.id = id; else cr.rasgos.unshift({ uid: this._uid(), id, gratis: true, origen: 'tipo' });
        repintar();
      }, 'Rasgo de tipo')));
    });

    // Tamaño
    const tams = Object.entries(this.DB.tamanos).map(([k, x]) => [k, x.name]);
    v.appendChild(this._campo('Tamaño', this._select(tams, cr.tam, k => { cr.tam = k; cr.pvAct = null; repintar(); }, 'Tamaño'), 'cambia FUE, DES y CON'));
    const tm = this.DB.tamanos[cr.tam] || {};
    v.appendChild(this._info(`${tm.atrTxt || 'Sin cambios'} · Alcance ${tm.alcance || '—'} · Espacio ${tm.espacio || '—'}` +
      (tm.naEnc ? `\nAl calibrar el encuentro, ${this._signo(tm.naEnc)} NA.` : '')));

    // Rol
    const roles = [['', 'Sin Rol']].concat(Object.entries(this.DB.roles).map(([k, x]) => [k, x.name]));
    v.appendChild(this._campo('Rol', this._select(roles, cr.rol, k => { cr.rol = k; this._reponerAtributos(cr); cr.pvAct = null; repintar(); }, 'Rol'), 'su atributo clave es siempre Fuerte'));
    const r = this.DB.roles[cr.rol];
    v.appendChild(this._info(r ? `${r.mod}\n${r.hab}: ${r.habTxt}` : 'Sin Rol: se queda con los Fuertes de su tipo y no recibe ajuste ni habilidad de Rol.'));

    // Estructura
    v.appendChild(this._campo('Estructura', this._seg([['normal', 'Normal'], ['jefe', 'Jefe'], ['horda', 'Horda']], cr.estructura,
      k => { cr.estructura = k; cr.pvAct = null; repintar(); }, 'Estructura')));
    if (cr.estructura === 'jefe') v.appendChild(this._info('PV ×2 y +2 de Potencial, un Rasgo racial mayor gratis y un objeto mágico de la rareza de su NA. Usa al menos una: Acción de Jefe, Turno Doble o un séquito. Sus Aptitudes de Potencial 3 se anuncian; la definitoria, no. Al calibrar el encuentro suma 3 (4 desde NA 6).'));
    if (cr.estructura === 'horda') {
      const inp = document.createElement('input');
      inp.type = 'number'; inp.min = 2; inp.max = 999; inp.value = cr.miembros; inp.inputMode = 'numeric';
      inp.setAttribute('aria-label', 'Miembros de la horda');
      inp.addEventListener('change', () => { cr.miembros = Math.max(2, Math.min(999, parseInt(inp.value, 10) || 2)); cr.pvAct = null; repintar(); });
      v.appendChild(this._campo('Miembros', inp, 'de 4 a 30'));
      const H = this._horda(cr.miembros);
      v.appendChild(this._info(H.marea
        ? 'Marea (31 o más): ya es una entidad de registro Planetario (Guía, Cap. 9).'
        : `${H.n}: se construye como una sola criatura de NA ${S.na} (el de sus miembros + ${H.na}). Un solo turno; el doble de daño de los efectos de área; a mitad de sus PV se divide en dos hordas de NA ${Math.max(0, S.na - 2)}; pierde un dado de daño por cada cuarto de PV perdido.`));
    }
    v.appendChild(this._pieEdicion('identity'));
  },

  /* ── Estado ───────────────────────────────────────────────────── */
  _pintarEstado(S) {
    const cr = this.cr;
    const max = document.getElementById('max_pv'), cur = document.getElementById('cur_pv');
    if (!max || !cur) return;
    max.textContent = S.pv;
    if (cr.pvAct != null && cr.pvAct > S.pv) cr.pvAct = S.pv;
    if (document.activeElement !== cur) cur.value = cr.pvAct == null ? S.pv : cr.pvAct;
    this._anchoPV();
    this._updateResBars();
    this._notaEstado(S);
    const host = document.getElementById('rest_list');
    if (host && !host.childElementCount) {
      const op = (t, m, d, fn) => {
        const b = this.h('button', 'rest-opt'); b.type = 'button';
        b.append(this.h('span', 'rest-opt-t', t), this.h('span', 'rest-opt-m', m), this.h('span', 'rest-opt-d', d));
        b.addEventListener('click', fn);
        return b;
      };
      host.append(
        op('Como nueva', 'PV y Aptitudes', 'PV al máximo y todos los Dados de Uso recargados.', () => this.restablecer(true)),
        op('Recargar Aptitudes', 'tras un descanso', 'Los Dados de Uso vuelven a su valor y las de 1/combate quedan disponibles.', () => this.restablecer(false)));
    }
  },
  /** El campo de PV mide tantas cifras como el máximo (o lo que se esté
      escribiendo): 9, 150 o 1460 caben enteros y el número no baila al bajar. */
  _anchoPV() {
    const cur = document.getElementById('cur_pv'), max = document.getElementById('max_pv');
    if (!cur || !max) return;
    cur.style.setProperty('--pv-ch', Math.max(2, cur.value.trim().length, max.textContent.trim().length));
  },
  _notaEstado(S) {
    const el = document.getElementById('estado_nota'); if (!el || !S) return;
    const cr = this.cr;
    const act = cr.pvAct == null ? S.pv : cr.pvAct;
    const t = [];
    if (S.horda && !S.H.marea) {
      const cuartos = S.pv ? Math.min(4, Math.floor((S.pv - act) / (S.pv / 4))) : 0;
      const ds = this._parseDanos(S.dano);
      const dados = ds ? ds.reduce((a, d) => a + d.n, 0) : 0;
      if (ds && cuartos > 0) t.push(`Ha perdido ${cuartos} cuarto${cuartos > 1 ? 's' : ''} de sus PV: le quedan ${Math.max(1, dados - cuartos)} dados de daño de los ${dados} (nunca menos de uno).`);
      if (act <= S.pv / 2) t.push(`A mitad de vida: se divide en dos hordas de NA ${Math.max(0, S.na - 2)}, cada una con la mitad de los PV que le queden y la mitad de sus dados de daño, redondeando hacia arriba.`);
    }
    if (S.esbirro) t.push(`Esbirro: a 0 PV queda derrotado (muerto, inconsciente, huido o rendido, a elección de quien lo derribó); no se desangra. Refriega: quien sea de Nivel ${S.na} o más tira cada turno en que ataca su Dado de Refriega (Audaz 1d8, Versátil 1d6, Sagaz 1d4) como daño a un esbirro a su alcance, sin tirada ni Armadura.`);
    if (act === 0) t.push(S.esbirro ? 'A 0 PV: derrotado.' : 'A 0 PV.');
    else if (!S.esbirro && act <= S.pv / 2) t.push('Por debajo de la mitad: comprueba la Moral' + (cr.rasgos.some(r => r.id === 'fases') ? ' y cambia de Fase' : '') + '.');
    el.textContent = t.join(' ');
    el.hidden = !t.length;
  },
  restablecer(conPV) {
    if (conPV) this.cr.pvAct = null;
    this.cr.rasgos.forEach(r => { delete r.udAct; delete r.usada; });
    this.cambio();
    this.toast(conPV ? 'PV y Aptitudes restablecidos' : 'Aptitudes recargadas', 'ok');
  },

  /* ── Cifras: Estadísticas (Perfil) y Defensa (Combate) ─────────── */
  _stat(rotulo, valor, alPulsar, etiqueta) {
    const e = this.h(alPulsar ? 'button' : 'div', 'dir-stat' + (alPulsar ? ' dir-stat-btn' : ''));
    if (alPulsar) { e.type = 'button'; e.addEventListener('click', alPulsar); if (etiqueta) e.setAttribute('aria-label', etiqueta); }
    e.append(this.h('span', 'dir-slbl', rotulo), this.h('span', 'dir-sval', valor));
    return e;
  },
  CIFRAS_N: { pv: 'PV', guardia: 'Guardia', armadura: 'Armadura', ataque: 'Ataque', dano: 'Daño', pa: 'PA', vel: 'Velocidad', ini: 'Iniciativa', moral: 'Moral', cd: 'CD' },
  /** «Ajustado a mano: …» y los avisos, solo de las cifras de esa tarjeta. */
  _notasAMano(v, S, claves) {
    const propias = S.aMano.filter(k => claves.includes(k));
    if (propias.length) v.appendChild(this.h('p', 'dir-nota', 'Ajustado a mano: ' + propias.map(k => `${this.CIFRAS_N[k]} (fórmula ${S.calc[k]})`).join(' · ')));
    this._avisosCurva(S, claves).forEach(a => v.appendChild(this.h('p', 'dir-aviso', a)));
  },

  /* Estadísticas: Velocidad, Alcance, Iniciativa y Moral */
  CAMPOS_STATS: ['vel', 'ini', 'moral', 'pv', 'pa', 'cd'],
  _pintarStats(S) {
    const v = this._vista('stats', 'summary'); if (!v) return;
    v.textContent = '';
    const g = this.h('div', 'dir-stats dir-stats-cifras');
    g.append(
      this._stat('Velocidad', S.vel + ' pies'),
      this._stat('Alcance', (S.tam.alcance || '5 pies').replace(/\s*\(.*\)/, '')),
      this._stat('Iniciativa', this._signo(S.ini), () => this.rollCheck('Iniciativa', S.ini), 'Tirar Iniciativa'),
      S.noMoral ? this._stat('Moral', 'no tira') : this._stat('Moral', String(S.moral), () => this.tirarMoral(S.moral), 'Tirar Moral'));
    v.appendChild(g);
    this._notasAMano(v, S, this.CAMPOS_STATS);
  },

  /* Defensa: Guardia, Armadura y la Guardia Desprevenida (Manual Básico:
     sin el Bono de Competencia ni el escudo; conserva DES y Armadura). */
  CAMPOS_DEFENSA: ['guardia', 'armadura'],
  _pintarDefensa(S) {
    const v = this._vista('defensa', 'summary'); if (!v) return;
    const cr = this.cr;
    v.textContent = '';
    const nunca = cr.rasgos.some(r => r.id === 'nunca_desprevenida');
    const grid = this.h('div', 'def-grid');
    const celda = (rot, val, cls) => { const c = this.h('div', 'def-cell' + (cls ? ' ' + cls : '')); c.append(this.h('span', 'def-lbl', rot), this.h('span', 'def-val', String(val))); return c; };
    grid.append(celda('Guardia', S.guardia, 'def-cell--guardia'), celda('Armadura', S.armadura),
      celda('Desprevenido', nunca ? '—' : S.guardia - S.pb));
    v.appendChild(grid);
    if (nunca) v.appendChild(this.h('p', 'dir-nota', 'Nunca Desprevenida: no pierde su Competencia ante un ataque por sorpresa.'));

    // Resistencias, inmunidades y debilidades: salen de los Rasgos, que son la única fuente
    const def = { resistencia: [], inmunidad: [], inmunidad_a_estados: [], vulnerabilidad: [] };
    S.infos.forEach(x => { if (def[x.r.id]) def[x.r.id].push(x.r.nota || '—'); });
    const otras = S.infos.filter(x => ['resistencia_sobrenatural', 'incorporeo', 'aversion'].includes(x.r.id));
    const lineas = [
      ['Resistencia', def.resistencia.concat(otras.filter(x => x.r.id !== 'aversion').map(x => 'daño no mágico'))],
      ['Inmunidad', def.inmunidad], ['Inmune a estados', def.inmunidad_a_estados],
      ['Vulnerabilidad', def.vulnerabilidad.map(x => x + ' (×1,5)')],
      ['Aversión', otras.filter(x => x.r.id === 'aversion').map(x => x.r.nota || '—')],
    ].filter(l => l[1].length);
    if (lineas.length) {
      const box = this.h('div', 'dir-lineas');
      lineas.forEach(([k, vals]) => { const p = this.h('div', 'dir-linea'); p.append(this.h('span', 'dir-linea-k', k), this.h('span', 'dir-linea-v', [...new Set(vals)].join(' · '))); box.appendChild(p); });
      v.appendChild(box);
    }
    this._notasAMano(v, S, this.CAMPOS_DEFENSA);
    if (cr.equipo) v.appendChild(this.h('p', 'dir-nota', 'Equipo: ' + cr.equipo));
  },

  /** Campos «a mano» de una tarjeta: vacío vuelve a la fórmula. */
  _editorManual(v, campos, alVolver) {
    const cr = this.cr;
    const S = this.calcCr(cr);
    const g = this.h('div', 'g2 dir-g2');
    campos.forEach(k => {
      const n = this.CIFRAS_N[k];
      const inp = document.createElement('input');
      const esDano = k === 'dano';
      inp.type = esDano ? 'text' : 'number';
      if (!esDano) inp.inputMode = 'numeric';
      inp.placeholder = String(S.calc[k]);
      inp.value = cr.manual[k] != null ? cr.manual[k] : '';
      inp.setAttribute('aria-label', `${n} a mano (la fórmula da ${S.calc[k]})`);
      inp.autocomplete = 'off';
      inp.addEventListener('input', () => {
        const t = inp.value.trim();
        if (t === '') delete cr.manual[k];
        else if (esDano) { if (this._parseDanos(t)) cr.manual[k] = t.replace(/−/g, '-').replace(/\s*y\s*/g, ' y ').replace(/(\d)\s+([+-])/g, '$1$2'); else return; }
        else { const num = parseInt(t, 10); if (Number.isFinite(num)) cr.manual[k] = num; else return; }
        if (k === 'pv') cr.pvAct = null;
        this.cambio();
      });
      g.appendChild(this._campo(n, inp, 'fórmula ' + S.calc[k]));
    });
    v.appendChild(g);
    if (campos.some(k => cr.manual[k] != null)) {
      const b = this.h('button', 'btn btn-g dir-ancho'); b.type = 'button';
      b.innerHTML = this._ico('i-rot-l') + 'Volver a las fórmulas';
      b.addEventListener('click', () => {
        campos.forEach(k => delete cr.manual[k]);
        if (campos.includes('pv')) cr.pvAct = null;
        this.cambio(); alVolver();
        this.toast('De vuelta en las fórmulas', 'ok');
      });
      v.appendChild(b);
    }
  },
  _editar_stats() {
    const v = this._vista('stats', 'edit');
    v.textContent = '';
    v.appendChild(this.h('p', 'wiz-hint', 'Lo que dan las fórmulas para su NA, sus atributos, su Rol y sus Rasgos. Escribe un valor solo si quieres apartarte de ellas; vacío vuelve a la fórmula. Los PV se llevan en Estado.'));
    this._editorManual(v, this.CAMPOS_STATS, () => this._editar_stats());
    v.appendChild(this._pieEdicion('stats'));
  },
  _editar_defensa() {
    const v = this._vista('defensa', 'edit');
    v.textContent = '';
    v.appendChild(this.h('p', 'wiz-hint', 'Guardia = 10 + Competencia + DES; Armadura, la de su NA más Rasgos y equipo. Desprevenida, su Guardia pierde la Competencia. Vacío vuelve a la fórmula.'));
    this._editorManual(v, this.CAMPOS_DEFENSA, () => this._editar_defensa());
    // Encuentro +1 si resiste casi todo el daño del grupo y el grupo no tiene cómo evitarlo (Cap. 4)
    const cr = this.cr;
    const fila = this.h('div', 'set-row dir-fila-toggle');
    const txt = this.h('div', 'set-row-txt');
    txt.append(this.h('span', 'set-lbl', 'Resiste casi todo su daño'),
      this.h('span', 'set-hint', 'Enjambre, Incorpórea… y este grupo no tiene cómo evitarlo: +1 a su NA de encuentro.'));
    const tg = this.h('button', 'toggle-btn'); tg.type = 'button';
    tg.setAttribute('aria-pressed', String(!!cr.resisteTodo));
    tg.setAttribute('aria-label', 'Resiste casi todo el daño del grupo');
    tg.addEventListener('click', () => { cr.resisteTodo = !cr.resisteTodo; this.cambio(); this._editar_defensa(); });
    fila.append(txt, tg);
    v.append(fila, this._pieEdicion('defensa'));
  },

  /* ── Combate: ataque ──────────────────────────────────────────── */
  _nombreAtaque() { return this.cr.ataqueNombre || 'Ataque'; },
  _pintarAtaque(S) {
    const v = this._vista('attack', 'summary'); if (!v) return;
    const cr = this.cr;
    v.textContent = '';
    // Con 4 PA o más, dos Ataques Normales: una tarjeta para cada uno
    const lista = S.danoAtaques.length ? S.danoAtaques : [S.dano];
    lista.forEach((dano, i) => {
      const card = this.h('div', 'atk-card');
      card.innerHTML = `
        <div class="atk-hdr">
          <span class="atk-nm"></span>
          <span class="atk-role-badge"></span>
        </div>
        <div class="atk-btns">
          <button class="abtn abtn-a" type="button">
            <span class="abtn-icon" aria-hidden="true"><svg class="ico ico-solo"><use href="#i-sword"/></svg></span>
            <span class="abtn-text"><span class="asub">Atacar</span><span class="aval"></span></span>
          </button>
          <div class="atk-btn-sep"></div>
          <button class="abtn abtn-d" type="button">
            <span class="abtn-icon" aria-hidden="true"><svg class="ico ico-solo"><use href="#i-d20"/></svg></span>
            <span class="abtn-text"><span class="asub">Daño</span><span class="aval"></span></span>
          </button>
        </div>`;
      const nombre = this._nombreAtaque() + (lista.length > 1 ? (i ? ' · 2.º' : ' · 1.º') : '');
      card.querySelector('.atk-nm').textContent = nombre;
      card.querySelector('.atk-role-badge').textContent = cr.danoTipo || 'sin tipo';
      const [ba, bd] = card.querySelectorAll('.abtn');
      ba.querySelector('.aval').textContent = this._signo(S.ataque);
      bd.querySelector('.aval').textContent = dano;
      ba.setAttribute('aria-label', 'Tirar ataque: ' + nombre);
      bd.setAttribute('aria-label', 'Tirar daño: ' + nombre);
      ba.addEventListener('click', () => this.rollCheck('Ataque: ' + nombre, S.ataque));
      bd.addEventListener('click', () => this.rollDice(dano, 'Daño: ' + nombre));
      v.appendChild(card);
    });
    v.appendChild(this.h('p', 'dir-nota', (lista.length > 1
      ? `Con ${S.pa} PA, dos Ataques Normales. Es su tope por turno: no lo supera aunque le sobren PA.`
      : 'Daño por turno: un Ataque Normal con todos los dados; el PA que sobra es para moverse o una Aptitud de 1 PA.') +
      ` Un ataque de Reacción o de 1 PA hace la mitad de los dados. Daño base de su NA: ${S.danoBase}.`));
    this._notasAMano(v, S, ['ataque', 'dano']);
  },
  _editar_attack() {
    const cr = this.cr;
    const v = this._vista('attack', 'edit');
    v.textContent = '';
    const n = document.createElement('input');
    n.type = 'text'; n.value = cr.ataqueNombre || ''; n.placeholder = 'ej. Quelíceros'; n.autocomplete = 'off';
    n.addEventListener('input', () => { cr.ataqueNombre = n.value; this.cambio(); });
    const t = document.createElement('input');
    t.type = 'text'; t.value = cr.danoTipo || ''; t.placeholder = 'ej. Perforante'; t.autocomplete = 'off';
    t.setAttribute('list', 'dir_danos');
    t.addEventListener('input', () => { cr.danoTipo = t.value; this.cambio(); });
    const dl = document.createElement('datalist'); dl.id = 'dir_danos';
    (this.DB.tablas.danos?.filas || []).forEach(x => dl.appendChild(new Option(x)));
    v.append(this._campo('Nombre del ataque', n), this._campo('Tipo de daño', t), dl,
      this.h('p', 'wiz-hint', 'Ataca con el mayor de FUE o DES (a distancia, DES). El arma no cambia el daño: cambia el tipo y sus propiedades.'));
    this._editorManual(v, ['ataque', 'dano'], () => this._editar_attack());
    v.appendChild(this._pieEdicion('attack'));
  },

  /* ── Combate: atributos, Salvaciones y Moral ──────────────────── */
  _pintarSalv(S) {
    const v = this._vista('saves', 'summary'); if (!v) return;
    const cr = this.cr;
    v.textContent = '';
    const grid = this.h('div', 'saves-grid dir-sin-filete');
    this.ATTRS.forEach(a => {
      const box = this.h('button', 'svsbox' + (cr.fuertes.includes(a) ? ' prof' : ''));
      box.type = 'button';
      box.setAttribute('aria-label', `${this.ATTR_N[a]} ${this._signo(S.mod[a])}. Tirar Salvación, ${this._signo(S.salv[a])}`);
      box.append(this.h('span', 'svslbl', a), document.createTextNode(this._signo(S.mod[a])));
      box.addEventListener('click', () => this.rollCheck('Salvación ' + a, S.salv[a]));
      grid.appendChild(box);
    });
    v.appendChild(grid);
    v.appendChild(this.h('p', 'dir-nota', `Salvaciones fuertes: ${S.fuertes.map(a => a + ' ' + this._signo(S.salv[a])).join(' · ') || '—'}. En las demás, el modificador + ${Math.floor(S.na / 2)} (½ NA). Toca un atributo para tirar su Salvación.`));
    const g = this.h('div', 'dir-stats dir-stats-1');
    g.appendChild(S.noMoral ? this._stat('Moral', 'no tira') : this._stat('Moral', String(S.moral), () => this.tirarMoral(S.moral), 'Tirar Moral'));
    v.appendChild(g);
    v.appendChild(this.h('p', 'dir-nota', S.noMoral
      ? 'No tira Moral: huye o se detiene cuando la pelea deja de tener sentido para ella.'
      : 'Moral: tira 2d10; si supera la Puntuación, rompe. Compruébala al caer su líder, al perder la mitad del grupo o tras un golpe que le quite media vida.'));
  },
  tirarMoral(puntuacion, etiqueta) {
    const a = this._d(10), b = this._d(10);
    const rompe = a + b > puntuacion;
    this.showDiceRoll({ label: `${etiqueta || 'Moral'} · Puntuación ${puntuacion}`, die: 10, finalFaces: [a, b], isCrit: false, isFail: false,
      detail: rompe ? 'Supera la Puntuación: rompen. Huyen, se rinden o se dispersan.' : 'No la supera: aguantan y siguen luchando.',
      total: a + b, totalLabel: 'Daño' });
    return rompe;
  },
  /** Seis filas Fuerte · Normal · Débil. Dos Fuertes: el tercero desplaza al
      más antiguo. La usan la ficha y el asistente. */
  _editorAtributos(host, alCambiar) {
    const cr = this.cr, S = this.calcCr(cr);
    const filas = this.h('div', 'dir-tres dir-atr');
    this.ATTRS.forEach(a => {
      const val = cr.fuertes.includes(a) ? 'F' : cr.debiles.includes(a) ? 'D' : 'N';
      const seg = this._seg([['F', 'Fuerte'], ['N', 'Normal'], ['D', 'Débil']], val, v => {
        cr.fuertes = cr.fuertes.filter(x => x !== a);
        cr.debiles = cr.debiles.filter(x => x !== a);
        if (v === 'F') { cr.fuertes.push(a); if (cr.fuertes.length > 2) cr.fuertes.shift(); }
        if (v === 'D') cr.debiles.push(a);
        cr.pvAct = null;
        alCambiar();
      }, this.ATTR_N[a]);
      filas.appendChild(this._campo(`${a} ${this._signo(S.mod[a])}`, seg));
    });
    host.appendChild(filas);
    const forzados = this.ATTRS.filter(a => S.tam[a.toLowerCase()] === 'D').map(a => `${a} es Débil por su tamaño (${S.tam.name})`);
    if (S.cat.CON === 'D' && !cr.debiles.includes('CON') && S.tam.con !== 'D') forzados.push('CON es Débil por el Rasgo Frágil');
    if (forzados.length) host.appendChild(this.h('p', 'dir-nota', forzados.join('. ') + ', elijas lo que elijas.'));
    if (cr.fuertes.length < 2) host.appendChild(this.h('p', 'dir-aviso', 'Elige dos atributos Fuertes.'));
    const def = this._atributosDe(cr);
    if (String(def.fuertes) !== String(cr.fuertes) || String(def.debiles.slice().sort()) !== String(cr.debiles.slice().sort())) {
      const b = this.h('button', 'btn btn-g dir-ancho'); b.type = 'button';
      b.innerHTML = this._ico('i-rot-l') + 'Los de su tipo y su Rol';
      b.addEventListener('click', () => { Object.assign(cr, this._atributosDe(cr)); cr.pvAct = null; alCambiar(); });
      host.appendChild(b);
    }
  },
  _editar_saves() {
    const cr = this.cr;
    const v = this._vista('saves', 'edit');
    v.textContent = '';
    const S = this.calcCr(cr);
    v.appendChild(this.h('p', 'wiz-hint', `Fuerte ${this._signo(S.B.fuerte)} · Normal ${this._signo(S.B.normal)} · Débil ${this._signo(S.B.debil)}. Su tipo da como Fuertes ${S.tipo.fuertesTxt || '—'} y sugiere como Débiles ${S.tipo.atrDeb || '—'}; la clave del Rol siempre es Fuerte.`));
    this._editorAtributos(v, () => { this.cambio(); this._editar_saves(); });
    const forzada = S.tipo.noMoral === 'nunca' || S.esbirro || S.cat.INT === 'D';
    const fila = this.h('div', 'set-row dir-fila-toggle');
    const txt = this.h('div', 'set-row-txt');
    txt.append(this.h('span', 'set-lbl', 'No tira Moral'),
      this.h('span', 'set-hint', forzada ? 'Con INT Débil, por su tipo o por ser esbirro, nunca la tira.' : 'Para la que huye o se detiene sin tirada cuando la pelea deja de compensar.'));
    const tg = this.h('button', 'toggle-btn'); tg.type = 'button';
    tg.setAttribute('aria-pressed', String(forzada || cr.moralNoTira));
    tg.setAttribute('aria-label', 'No tira Moral');
    tg.disabled = forzada;
    tg.addEventListener('click', () => { cr.moralNoTira = !cr.moralNoTira; this.cambio(); this._editar_saves(); });
    fila.append(txt, tg);
    v.append(fila, this._pieEdicion('saves'));
  },

  /* ── Rasgos y Aptitudes ───────────────────────────────────────── */
  /** Símbolo y clave de color del tipo de pieza (los de los Talentos). */
  _tipoPieza(tipo) {
    return { Rasgo: ['◆', 'pasivo'], Aura: ['◆', 'pasivo'], Aptitud: ['✦', 'habilitador'], 'Reacción': ['⚡', 'disparador'],
             Modificador: ['◈', 'modificador'], Debilidad: ['▽', 'debilidad'] }[tipo] || ['◆', 'pasivo'];
  },
  _lineaTipo(i) {
    const [sim] = this._tipoPieza(i.tipo);
    return [sim + ' ' + i.tipo, i.coste, i.frec].filter(Boolean).join(' · ');
  },
  /** Cifras concretas de un efecto escrito en función del NA. */
  _concretar(txt, S) {
    const out = [];
    const t = String(txt || '');
    const menos = t.match(/su CD − (\d+)/);
    if (menos) out.push(`CD − ${menos[1]} = ${S.cd - parseInt(menos[1], 10)}`);
    else if (/contra (la|su) CD/.test(t) && !/CD \d/.test(t)) out.push('CD ' + S.cd);
    if (/daño base/.test(t)) {
      const d = this._parseDano(S.danoBase);
      out.push('Daño base ' + S.danoBase + (d && /mitad del daño base/.test(t) ? ` (la mitad ≈ ${Math.max(1, Math.floor(this._mediaDano(d) / 2))})` : ''));
    }
    const m = t.match(/NA × (\d+)/g);
    if (m) [...new Set(m)].forEach(x => out.push(`${x} = ${S.na * parseInt(x.slice(5), 10)}`));
    if (/recupera NA PV|Recupera NA PV/.test(t)) out.push('NA = ' + S.na);
    return out;
  },

  _pintarRasgos(S) {
    const cr = this.cr;
    const set = (id, t) => { const e = document.getElementById(id); if (e) e.textContent = t; };
    set('peso_gastado', S.pesoGastado); set('peso_max', '/' + S.pesoMax);
    set('peso_txt', `${S.pesoGastado}/${S.pesoMax}`);
    const bar = document.getElementById('peso_bar');
    if (bar) {
      bar.style.width = (S.pesoMax ? Math.min(100, S.pesoGastado / S.pesoMax * 100) : (S.pesoGastado ? 100 : 0)) + '%';
      bar.classList.toggle('dir-exceso', S.exceso > 0);
    }
    const warn = document.getElementById('peso_warn');
    if (warn) {
      const t = [];
      if (S.esbirro && S.pesoGastado) t.push('Un esbirro no tiene Rasgos propios, solo los de su tipo');
      else if (S.exceso) t.push(`Excede en ${S.exceso}` + (S.exceso >= 2 ? `: al calibrar cuenta como NA ${S.naEnc}` : ': con 2 de exceso contará como +1 NA'));
      else if (S.devuelto) t.push(`Presupuesto ${S.pesoBase} + ${S.devuelto} por Debilidad${S.devuelto > 1 ? 'es' : ''}`);
      warn.textContent = t.join(' · ');
      warn.style.display = t.length ? 'block' : 'none';
      warn.classList.toggle('dir-ok', !S.exceso && !(S.esbirro && S.pesoGastado));
    }

    const host = document.getElementById('rasgos_list'); if (!host) return;
    const abiertos = new Set([...host.querySelectorAll('.dc.open')].map(d => d.dataset.uid));
    host.textContent = '';
    // 1 · la habilidad del Rol, que no gasta Potencial
    if (S.rol && S.rol.hab) {
      host.appendChild(this._tarjetaRasgo({ uid: 'rol', fijo: true }, { name: S.rol.hab, tipo: S.rol.habTipo, coste: S.rol.habCoste, frec: '', peso: 0,
        txt: S.rol.habTxt + (cr.rolNota ? '\n' + cr.rolNota : '') }, 'de Rol', S, abiertos.has('rol')));
    }
    // 2 · gratis · 3 · pagados · 4 · debilidades
    const orden = x => x.r.definitoria ? -1 : this._esGratisVisible(x, S) ? 0 : (x.i.tipo === 'Debilidad' || x.i.peso < 0) ? 2 : 1;
    S.infos.slice().sort((a, b) => orden(a) - orden(b)).forEach(x => {
      const motivo = S.motivoGratis(x);
      const etiqueta = motivo || (x.i.peso < 0 ? '−1' : x.i.custom && !x.i.peso ? '0' : 'Pot. ' + x.i.peso);
      host.appendChild(this._tarjetaRasgo(x.r, x.i, etiqueta, S, abiertos.has(x.r.uid)));
    });
    if (!host.childElementCount) {
      host.innerHTML = '<div class="empty-state"><span class="es-rune">✦</span><span class="es-line">Aún sin Rasgos</span><div class="es-hint">Empieza por la pieza que sostiene la idea</div></div>';
    }
  },
  _esGratisVisible(x, S) { return S.esGratis(x); },

  _tarjetaRasgo(r, i, etiqueta, S, abierta) {
    const card = this.h('div', 'dc' + (abierta ? ' open' : ''));
    card.dataset.uid = r.uid;
    const dch = this.h('div', 'dch');
    dch.addEventListener('click', () => card.classList.toggle('open'));
    const [sim, clave] = this._tipoPieza(i.tipo);
    const dct = this.h('span', 'dct');
    const s = this.h('span', 'dir-sim', sim); s.dataset.tipo = clave;
    dct.append(s, document.createTextNode(' ' + i.name + (r.nota ? ` (${r.nota})` : '')));
    dch.appendChild(dct);
    const ud = this._udDe(r, i);
    if (ud) dch.appendChild(this.h('span', 'dc-gbadge dir-ud' + (ud === 'agotada' ? ' is-agotada' : ''), ud === 'agotada' ? 'agotada' : ud));
    dch.appendChild(this.h('span', 'dc-gbadge dir-peso', etiqueta));
    dch.appendChild(this.h('span', 'dca', '▾'));
    const dcb = this.h('div', 'dcb');
    const marcas = [r.especie && (r.racial ? 'racial mayor' : 'especie'), r.definitoria && 'Aptitud definitoria'].filter(Boolean);
    const tp = this.h('div', 'tc-tipo', this._lineaTipo(i) + (marcas.length ? ' · ' + marcas.join(' · ') : '')); tp.dataset.tipo = clave;
    dcb.appendChild(tp);
    if (i.perdido) dcb.appendChild(this.h('div', 'js-grade-block grade-off', 'No está en la versión actual de las reglas: se conserva su nombre y el texto guardado.'));
    const desc = this.h('div', 'u-pre-wrap', i.txt || 'Sin descripción.'); desc.style.marginBottom = '6px';
    dcb.appendChild(desc);
    const cifras = this._concretar(i.txt, S);
    if (cifras.length) dcb.appendChild(this.h('div', 'js-grade-block grade-on', cifras.join(' · ')));
    if (r.id === 'uso_de_axiomas') dcb.appendChild(this.h('div', 'js-grade-block grade-on',
      `Axiomas de hasta Nivel ${Math.min(9, Math.ceil(S.na / 2))} · CD ${S.cd} · Reserva ${S.na * 5} puntos · Esfuerzo hasta ${(S.na <= 6 ? 1 : S.na <= 12 ? 2 : 3) + (S.jefe ? 1 : 0)} (3 puntos cada uno)`));
    if (r.fijo) { card.append(dch, dcb); return card; }

    if (i.pide || r.nota) {
      const inp = document.createElement('input');
      inp.type = 'text'; inp.value = r.nota || ''; inp.placeholder = i.pide || 'Detalle'; inp.autocomplete = 'off';
      inp.setAttribute('aria-label', i.pide || 'Detalle del Rasgo');
      inp.addEventListener('change', () => { r.nota = inp.value.trim(); if (!r.nota) delete r.nota; this.cambio(); });
      inp.addEventListener('click', e => e.stopPropagation());
      dcb.appendChild(this._campo(i.pide || 'Detalle', inp));
    }
    // Marcas de especie (Cap. 2 y 3): de especie, Aptitud definitoria y, en un jefe, racial mayor
    const fila = this.h('div', 'dir-marcas');
    const marca = (clave, rot, ayuda) => {
      const b = this.h('button', 'tm-fchip' + (r[clave] ? ' active' : '')); b.type = 'button';
      b.append(this.h('span', 'tm-fchip-dot'), document.createTextNode(rot));
      b.setAttribute('aria-pressed', String(!!r[clave]));
      b.title = ayuda;
      b.addEventListener('click', e => {
        e.stopPropagation();
        if (r[clave]) { delete r[clave]; if (clave === 'especie') { delete r.definitoria; delete r.racial; } }
        else { r[clave] = true; if (clave !== 'especie') r.especie = true; }
        this.cambio();
      });
      return b;
    };
    if (!r.gratis) {
      fila.append(marca('especie', 'De especie', 'Lo que la hace ser lo que es. Uno de combate es gratis si cabe en el tope de su NA.'),
        marca('definitoria', 'Definitoria', 'Desde NA 3: la que decide el combate. Escribe su «Protección» en Notas.'));
      if (S.jefe) fila.appendChild(marca('racial', 'Racial mayor', 'La segunda pieza gratuita de un jefe: de Potencial 3, o 2.'));
      dcb.appendChild(fila);
    }
    const acc = this.h('div', 'dir-acc');
    if (ud) {
      const usar = this.h('button', 'btn btn-g'); usar.type = 'button';
      usar.innerHTML = this._ico('i-d20') + (ud === 'agotada' ? 'Agotada' : `Usar · tira ${ud}`);
      usar.disabled = ud === 'agotada';
      usar.addEventListener('click', e => { e.stopPropagation(); this.usarAptitud(r.uid); });
      acc.appendChild(usar);
    } else if (/1\/combate/.test(i.frec)) {
      const usar = this.h('button', 'btn btn-g'); usar.type = 'button';
      usar.textContent = r.usada ? 'Usada en este combate' : 'Marcar como usada';
      usar.addEventListener('click', e => { e.stopPropagation(); if (r.usada) delete r.usada; else r.usada = true; this.cambio(); });
      acc.appendChild(usar);
    }
    const quitar = this.h('button', 'bmini br'); quitar.type = 'button';
    quitar.innerHTML = this._ico('i-x') + 'Quitar';
    quitar.setAttribute('aria-label', 'Quitar ' + i.name);
    quitar.addEventListener('click', e => { e.stopPropagation(); this.quitarRasgo(r.uid); });
    acc.appendChild(quitar);
    dcb.appendChild(acc);
    card.append(dch, dcb);
    return card;
  },

  /** Dado de Uso actual de una Aptitud («Ud6» → al degradar, «Ud4» → «agotada»). */
  _udDe(r, i) {
    const m = String(i.frec || '').match(/Ud(\d+)/);
    if (!m) return '';
    return r.udAct || ('Ud' + m[1]);
  },
  usarAptitud(uid) {
    const r = this.cr.rasgos.find(x => x.uid === uid); if (!r) return;
    const i = this.rasgoInfo(r);
    const ud = this._udDe(r, i);
    if (!ud || ud === 'agotada') return;
    const caras = parseInt(ud.slice(2), 10);
    const t = this._d(caras);
    let detalle = `${ud}: ${t} — se mantiene en ${ud}.`;
    if (t <= 2) {
      const sig = this.UD[this.UD.indexOf(ud) + 1];
      r.udAct = sig || 'agotada';
      detalle = sig ? `${ud}: ${t} — baja a ${sig}.` : `${ud}: ${t} — queda agotada hasta que descanse.`;
    }
    this.showDiceRoll({ label: `${i.name} · Dado de Uso`, die: caras, finalFaces: [t], isCrit: false, isFail: t <= 2, detail: detalle, total: t, totalLabel: 'Daño' });
    this.cambio();
  },
  quitarRasgo(uid) {
    this.cr.rasgos = this.cr.rasgos.filter(r => r.uid !== uid);
    this.cambio();
  },
  /** Añade una pieza de la Biblioteca. Devuelve false si no se puede. */
  ponerRasgo(id, silencio) {
    const hit = this._libIdx()[id]; if (!hit) return false;
    if (!hit.e.multi && this.cr.rasgos.some(r => r.id === id)) return false;
    this.cr.rasgos.push({ uid: this._uid(), id });
    if (!silencio) this.cambio();
    return true;
  },

  /* ── Notas: señal y contexto ──────────────────────────────────── */
  CAMPOS_SENAL: [
    ['senal', 'La señal', 'senal', 'Lo que el grupo percibe antes de verla: huellas, olor, un silencio, restos.'],
    ['contexto', 'Contexto táctico', '', '¿Qué problema le plantea al grupo? Una o dos frases.'],
    ['proteccion', 'Protección', '', 'Qué rebaja su Aptitud definitoria: da Ventaja o baja un escalón, nunca la anula.'],
    ['quiere', 'Qué quiere', 'quiere', ''],
    ['pelea', 'Cómo pelea', 'pelea', ''],
    ['habitat', 'Hábitat', 'habitat', ''],
    ['botin', 'Lo que deja al caer', 'botinCae', ''],
  ],
  _pintarSenal() {
    const v = this._vista('senal', 'summary'); if (!v) return;
    const cr = this.cr;
    v.textContent = '';
    const hay = this.CAMPOS_SENAL.filter(([k]) => (cr[k] || '').trim());
    if (!hay.length) {
      v.innerHTML = '<div class="empty-state"><span class="es-rune">✦</span><span class="es-line">Sin señal ni contexto</span><div class="es-hint">Si no sabes escribir el contexto, la criatura aún no está terminada</div></div>';
      return;
    }
    hay.forEach(([k, rot]) => {
      const b = this.h('div', 'dir-bloque');
      b.append(this.h('span', 'fl', rot), this.h('div', 'u-pre-wrap dir-texto', cr[k]));
      v.appendChild(b);
    });
  },
  _editar_senal() {
    const cr = this.cr;
    const v = this._vista('senal', 'edit');
    v.textContent = '';
    this.CAMPOS_SENAL.forEach(([k, rot, tabla, ayuda]) => {
      const ta = document.createElement('textarea');
      ta.value = cr[k] || '';
      ta.style.minHeight = (k === 'contexto' || k === 'senal') ? '64px' : '44px';
      ta.setAttribute('aria-label', rot);
      if (ayuda) ta.placeholder = ayuda;
      ta.addEventListener('input', () => { cr[k] = ta.value; this._markUnsaved(); this._pintarRevision(this._S); });
      const caja = this.h('div', 'dir-con-dado');
      caja.appendChild(ta);
      if (tabla) caja.appendChild(this._botonDado(`Tirar ${rot.toLowerCase()} al azar`, () => {
        let t = this._azar(this.DB.tablas[tabla].filas);
        if (k === 'botin') t = t.replace(/NA × (\d+)/g, (_, n) => String(cr.na * parseInt(n, 10)));
        ta.value = cr[k] = t;
        this._markUnsaved(); this._pintarRevision(this._S);
      }));
      v.appendChild(this._campo(rot, caja));
    });
    v.appendChild(this._pieEdicion('senal'));
  },

  /* ── Notas: jefe, fases y guarida ─────────────────────────────── */
  _esJefe(S) { return S.jefe || this.cr.rasgos.some(r => ['fases', 'guarida', 'victoria_alternativa', 'accion_de_jefe', 'turno_doble'].includes(r.id)); },
  _pintarJefe(S) {
    const card = document.getElementById('fold_jefe'); if (!card) return;
    const es = this._esJefe(S);
    card.hidden = !es;
    if (!es) { if (this._enEdicion('jefe')) this._verSeccion('jefe', false); return; }
    const v = this._vista('jefe', 'summary');
    const cr = this.cr;
    v.textContent = '';
    const ids = cr.rasgos.map(r => r.id);
    const eco = ids.includes('accion_de_jefe') ? 'Acción de Jefe' : ids.includes('turno_doble') ? 'Turno Doble' : '';
    v.appendChild(this.h('p', S.jefe && !eco ? 'dir-aviso' : 'dir-nota', eco
      ? `Economía de acciones: ${eco}.`
      : 'Economía de acciones: sin Acción de Jefe ni Turno Doble, necesita un séquito que le compre tiempo.'));
    [['fases', 'Fases'], ['victoria', 'Victoria alternativa'], ['guarida', 'Su guarida']].forEach(([k, rot]) => {
      if (!(cr.jefe[k] || '').trim()) return;
      const b = this.h('div', 'dir-bloque');
      b.append(this.h('span', 'fl', rot), this.h('div', 'u-pre-wrap dir-texto', cr.jefe[k]));
      v.appendChild(b);
    });
    const acc = this.h('div', 'dir-acc dir-acc-centro');
    const g = this.h('button', 'btn btn-g'); g.type = 'button';
    g.innerHTML = this._ico('i-d20') + 'Acción de Guarida';
    g.addEventListener('click', () => this.tirarTabla('guarida', 'Acción de Guarida'));
    acc.appendChild(g);
    v.appendChild(acc);
    v.appendChild(this.h('p', 'dir-nota', 'La guarida actúa al final de cada ronda, sin gastar PA ni Reacción, y no repite la misma dos rondas seguidas. Toda Aptitud de Potencial 3 se anuncia una ronda antes.'));
  },
  _editar_jefe() {
    const cr = this.cr;
    const v = this._vista('jefe', 'edit');
    v.textContent = '';
    [['fases', 'Fases', 'fases', 'Qué cambia al bajar de la mitad de sus PV.'],
     ['victoria', 'Victoria alternativa', 'victoria', 'El combate termina si el grupo…'],
     ['guarida', 'Su guarida', '', 'Cómo es el lugar y qué hace cuando actúa.']].forEach(([k, rot, tabla, ayuda]) => {
      const ta = document.createElement('textarea');
      ta.value = cr.jefe[k] || ''; ta.placeholder = ayuda; ta.style.minHeight = '56px';
      ta.setAttribute('aria-label', rot);
      ta.addEventListener('input', () => { cr.jefe[k] = ta.value; this._markUnsaved(); });
      const caja = this.h('div', 'dir-con-dado');
      caja.appendChild(ta);
      if (tabla) caja.appendChild(this._botonDado(`Tirar ${rot.toLowerCase()} al azar`, () => {
        const t = this._azar(this.DB.tablas[tabla].filas);
        ta.value = cr.jefe[k] = (tabla === 'victoria' ? 'El combate termina si el grupo ' + t.replace(/^…/, '') : t);
        this._markUnsaved();
      }));
      v.appendChild(this._campo(rot, caja));
    });
    v.appendChild(this._pieEdicion('jefe'));
  },

  /* ── Notas: revisión final ────────────────────────────────────── */
  _pintarRevision(S) {
    const host = document.getElementById('revision_list'); if (!host || !S) return;
    const cr = this.cr;
    host.textContent = '';
    const ids = cr.rasgos.map(r => r.id);
    const pistas = [
      (cr.senal || '').trim() ? 'Señal escrita.' : 'Falta la señal.',
      (cr.contexto || '').trim() ? 'Contexto táctico escrito.' : 'Falta el contexto táctico.',
      S.nDebs ? `Tiene ${S.nDebs} Debilidad${S.nDebs > 1 ? 'es' : ''}: ¿cómo puede averiguarla${S.nDebs > 1 ? 's' : ''} el grupo?` : 'Sin Debilidades: nada que descubrir.',
      S.noMoral ? 'No tira Moral: anota cuándo deja de pelear.' : `Moral ${S.moral}.`,
    ];
    this.DB.tablas.revision.filas.forEach((q, n) => {
      const fila = this.h('label', 'dir-check');
      const chk = document.createElement('input');
      chk.type = 'checkbox'; chk.checked = !!cr.revision[n];
      chk.addEventListener('change', () => { cr.revision[n] = chk.checked; this._markUnsaved(); });
      const t = this.h('span', 'dir-check-t');
      const [preg, resto] = q.split('? ');
      t.append(this.h('strong', null, preg + (resto ? '?' : '')), document.createTextNode(resto ? ' ' + resto : ''), this.h('span', 'dir-check-p', pistas[n] || ''));
      fila.append(chk, t);
      host.appendChild(fila);
    });
    // Comprobaciones de las reglas
    const av = [];
    if (S.exceso) av.push(`Potencial ${S.pesoGastado} de ${S.pesoMax}: ${S.exceso >= 2 ? `cuenta como NA ${S.naEnc} al calibrar el encuentro` : 'un punto por encima del presupuesto'}.`);
    if (S.esbirro && S.pesoGastado) av.push('Un esbirro no tiene Rasgos propios, solo los de su tipo.');
    const p3 = S.infos.filter(x => !S.esGratis(x) && x.i.peso === 3).length;
    if (S.na < 5 && p3 > 1) av.push('Por debajo de NA 5, una sola pieza de Potencial 3 como máximo.');
    (S.tipo.exige || []).forEach(id => { if (!ids.includes(id)) av.push(`${S.tipo.name}: debe tener ${this._libIdx()[id]?.e.name || id}.`); });
    if (S.tipo.tamMin && this.ORDEN_TAM.indexOf(cr.tam) < this.ORDEN_TAM.indexOf(S.tipo.tamMin)) av.push(`${S.tipo.name}: tamaño Grande o mayor.`);
    if (S.jefe && !ids.includes('accion_de_jefe') && !ids.includes('turno_doble')) av.push('Jefe sin Acción de Jefe ni Turno Doble: dale un séquito.');
    if (S.jefe && S.infos.filter(x => x.i.tipo !== 'Rasgo' || x.i.peso >= 2).length === 0) av.push('Un jefe necesita al menos una mecánica que no sea «más daño».');
    if (S.nDebs > 2) av.push('Las Debilidades devuelven Potencial hasta un máximo de 2.');
    const def = S.infos.filter(x => x.r.definitoria);
    if (S.na >= 3 && !def.length && !S.esbirro) av.push('Desde NA 3 necesita una Aptitud definitoria: marca su Rasgo de especie más fuerte.');
    if (def.length && !(cr.proteccion || '').trim()) av.push('Su Aptitud definitoria necesita una línea «Protección» (Notas).');
    if (S.jefe && !S.infos.some(x => x.r.racial)) av.push('Un jefe tiene un Rasgo racial mayor gratuito: márcalo en sus Rasgos.');
    if (S.jefe && !(cr.equipo || '').trim()) av.push('Un jefe lleva un objeto mágico de la rareza de su NA: anótalo en su equipo, con sus bonos sumados a mano.');
    if (S.naEnc !== S.na) av.push(`Encuentro: cuenta como NA ${S.naEnc} al calcular el encuentro.`);
    this._avisosCurva(S).forEach(a => av.push(a));
    if (av.length) av.forEach(a => host.appendChild(this.h('p', 'dir-aviso', a)));
    else host.appendChild(this.h('p', 'dir-nota dir-ok', 'Dentro de las reglas: Potencial, tipo y fórmulas en orden.'));
  },

  /* ── Plantillas (Manual de Monstruos, Cap. 4) ─────────────────── */
  abrirPlantillas() {
    this.abrirSelector({
      titulo: 'Plantillas',
      sub: 'Convierte esta criatura en otra sin reescribirla',
      buscar: 'Buscar plantilla…',
      items: () => Object.entries(this.DB.plantillas).map(([k, p]) => ({ k, nombre: p.name, etiqueta: 'NA ' + p.naTxt, texto: p.txt })),
      alElegir: k => { this.aplicarPlantilla(k); this.cerrarSelector(); return false; },
    });
  },
  aplicarPlantilla(k) {
    const p = this.DB.plantillas[k]; if (!p) return;
    const cr = this.cr;
    cr.na = Math.max(0, Math.min(15, cr.na + (parseInt(p.na, 10) || 0)));
    if (p.tam) cr.tam = this.ORDEN_TAM[Math.max(0, Math.min(5, this.ORDEN_TAM.indexOf(cr.tam) + p.tam))];
    if (p.rol && this.DB.roles[p.rol]) cr.rol = p.rol;
    if (p.horda) { cr.estructura = 'horda'; cr.tam = 'diminuto'; }
    if (p.tipo && this.DB.tipos[p.tipo]) { cr.tipo = p.tipo; this._ponerRasgosDeTipo(cr); }
    if (p.rol || p.tipo) this._reponerAtributos(cr);
    const idx = this._libIdx();
    (p.pierdeFam || []).forEach(f => { cr.rasgos = cr.rasgos.filter(r => r.gratis || idx[r.id]?.fam !== f); });
    if (p.pierdeMayor) {
      const pagados = cr.rasgos.filter(r => !r.gratis).map(r => ({ r, peso: this.rasgoInfo(r).peso })).sort((a, b) => b.peso - a.peso);
      if (pagados[0] && pagados[0].peso > 0) cr.rasgos = cr.rasgos.filter(r => r !== pagados[0].r);
    }
    (p.gana || []).forEach(id => {
      if (!idx[id] || cr.rasgos.some(r => r.id === id)) return;
      const r = { uid: this._uid(), id };
      if (p.notas && p.notas[id]) r.nota = p.notas[id];
      cr.rasgos.push(r);
    });
    if (p.a) cr.rasgos.push({ uid: this._uid(), custom: true, name: 'Blindaje de plantilla', tipo: 'Rasgo', peso: 0,
      txt: `${this._signo(p.a)} de Armadura (plantilla ${p.name}).`, mod: { a: p.a }, gratis: true, origen: 'plantilla' });
    cr.manual = {}; cr.pvAct = null;
    cr.notas = (cr.notas ? cr.notas + '\n\n' : '') + `Plantilla ${p.name} (NA ${p.naTxt}): ${p.txt}`;
    this.cambio(true);
    this.toast(`Plantilla ${p.name} aplicada: revisa sus Rasgos`, 'ok');
  },

  /* ── Criatura al azar (Manual de Monstruos, Cap. 9) ───────────── */
  criaturaAlAzar(naFijo) {
    const T = this.DB.tablas;
    const cr = this.nuevaCr();
    cr.na = naFijo != null ? naFijo : this._azar([1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8]);
    cr.tipo = this._azar(this.AZAR_TIPO.filter(k => this.DB.tipos[k]));
    if (cr.tipo === 'dragon' && this.DB.tipos.draconido && this._d(6) >= 4) cr.tipo = 'draconido';   // «Dragón o dracónido (1–3 / 4–6)»
    cr.rol = this._azar(this.AZAR_ROL.filter(k => !k || this.DB.roles[k]));
    const t6 = this._d(6);
    cr.tam = t6 === 1 ? 'pequeno' : t6 <= 3 ? 'mediano' : t6 === 4 ? 'grande' : t6 === 5 ? 'enorme' : (this._d(6) <= 3 ? 'diminuto' : 'colosal');
    const tipo = this.DB.tipos[cr.tipo];
    if (tipo.tamMin && this.ORDEN_TAM.indexOf(cr.tam) < this.ORDEN_TAM.indexOf(tipo.tamMin)) cr.tam = tipo.tamMin;
    this._ponerRasgosDeTipo(cr);
    Object.assign(cr, this._atributosDe(cr));
    // Mutante: un atributo Débil al azar
    if (cr.tipo === 'mutante') cr.debiles = [...new Set(cr.debiles.concat(this._azar(this.ATTRS.filter(a => !cr.fuertes.includes(a)))))];
    // Lo que su tipo exige (Aliento, Aversión) va primero
    (tipo.exige || []).forEach(id => this._ponerEn(cr, id));
    // Rasgos: familia con d20, pieza con el dado de la familia, hasta gastar el Potencial
    const fams = Object.keys(this.DB.rasgos);
    for (let intento = 0; intento < 60; intento++) {
      const S = this.calcCr(cr);
      if (S.pesoGastado >= S.pesoMax) break;
      const d = this._d(20);
      const fam = d >= 16 ? 'debilidades' : fams[d - 1];
      const lista = this.DB.rasgos[fam] || [];
      if (!lista.length) continue;
      const e = this._azar(lista);
      if (cr.rasgos.some(r => r.id === e.id)) continue;
      if (fam === 'debilidades') { if (S.nDebs >= 2) continue; }
      else {
        if (e.peso > S.pesoMax - S.pesoGastado) continue;
        if (e.peso === 3 && S.na < 5 && S.infos.some(x => x.i.peso === 3 && !S.esGratis(x))) continue;
      }
      this._ponerEn(cr, e.id);
    }
    // Si lo que su tipo exige no cabe (un dragón de NA 1 con Aliento), una Debilidad lo compensa
    for (let k = 0; k < 2; k++) {
      const S = this.calcCr(cr);
      if (!S.exceso || S.nDebs >= 2) break;
      const libres = (this.DB.rasgos.debilidades || []).filter(e => !cr.rasgos.some(r => r.id === e.id));
      if (!libres.length) break;
      this._ponerEn(cr, this._azar(libres).id);
    }
    // La primera pieza que no es Debilidad es su Rasgo de especie; desde NA 3, también su Aptitud definitoria
    const propia = cr.rasgos.find(r => !r.gratis && this.rasgoInfo(r).peso > 0);
    if (propia) { propia.especie = true; if (cr.na >= 3) propia.definitoria = true; }
    const forma = this._azar(T.forma.filas), visible = this._azar(T.rasgoVisible.filas.filter(x => x !== 'Tira dos veces'));
    const mueve = this._azar(T.mueve.filas), ataca = this._azar(T.ataca.filas);
    cr.idea = `Forma ${forma.toLowerCase()}; ${visible.toLowerCase()}. Se mueve ${mueve} y ataca con ${ataca.replace(/^no ataca: /, 'nada: ')}.`;
    cr.ataqueNombre = /no ataca/.test(ataca) ? 'Presa' : ataca.replace(/^(un|una|la|el) /, '').replace(/^./, c => c.toUpperCase());
    cr.quiere = this._azar(T.quiere.filas);
    cr.pelea = this._azar(T.pelea.filas);
    cr.habitat = this._azar(T.habitat.filas);
    cr.senal = this._azar(T.senal.filas);
    cr.botin = this._azar(T.botinCae.filas).replace(/NA × (\d+)/g, (_, n) => String(cr.na * parseInt(n, 10)));
    cr.nombre = this._nombreAzar();
    return cr;
  },
  _ponerEn(cr, id) {
    if (!this._libIdx()[id] || cr.rasgos.some(r => r.id === id)) return;
    cr.rasgos.push({ uid: this._uid(), id });
  },
});
