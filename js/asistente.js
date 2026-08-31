/* ══════════════════════════════════════════════════════════════
   ASISTENTE DE CREACIÓN GUIADA
   Módulo aparte: se carga entre app.js y boot.js. Envuelve newChar()
   para que crear un personaje sea un recorrido guiado en vez de abrir las
   ocho secciones de la ficha a la vez.

   El ORDEN y los tiempos son los del Manual Básico Cap.3 —«El proceso
   tiene seis pasos que se completan en orden»—: Atributos · Descriptor ·
   Arquetipo · Trasfondo · Talentos · Ficha, más el Equipo, que el manual
   deja para el final del Cap.6 («la última decisión de la creación»). No
   es el orden en que la ficha muestra las secciones, y es a propósito: los
   atributos van primero porque el Arquetipo se elige sabiendo ya qué PV te
   da tu CON.

   El asistente NO calcula nada por su cuenta ni guarda nada: al terminar
   vuelca sus decisiones en los mismos campos que rellenaría una persona
   a mano y deja que app.calc() haga el resto. Por eso «A mano» puede
   abandonarlo en cualquier momento sin perder lo ya elegido.
══════════════════════════════════════════════════════════════ */
(function () {
  const $ = id => document.getElementById(id);
  const ATTRS = ['FUE', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
  const ATTR_N = { FUE:'Fuerza', DES:'Destreza', CON:'Constitución',
                   INT:'Inteligencia', SAB:'Sabiduría', CAR:'Carisma' };
  /* Los seis pasos del Manual Cap.3 más el Equipo, que el manual coloca al
     final del Cap.6: «Después eliges con qué sales por la puerta, que es la
     última decisión de la creación». */
  const PASOS   = ['Atributos','Descriptor','Arquetipo','Trasfondo','Talentos','Ficha','Equipo'];
  const MINUTOS = ['5 min','5 min','3 min','5 min','10 min','5 min','5 min'];
  const ULTIMO  = PASOS.length - 1;

  /* Paquete de equipo inicial — Manual Cap.6. Lo mismo para todos, más una
     elección por Arquetipo. Las claves son las de DEFAULT_DB. */
  const PAQUETE = ['morral', 'raciones', 'antorchas', 'cantimplora', 'cuerda'];
  const MONEDAS = { audaz: 5, sutil: 4, sagaz: 3 };   // Nd6 × 10 pp
  const EQUIPO_ARQ = {
    audaz: { etiqueta: 'Armadura inicial', fijo: { shields: 'escudo' }, opciones: [
      { v: 'cota_malla',   t: 'Cota de malla — Armadura 3', armor: 'cota_malla' },
      { v: 'cota_escamas', t: 'Cota de escamas — Armadura 2, los Críticos no la deterioran', armor: 'cota_escamas' },
    ]},
    sutil: { etiqueta: 'Además del Cuero tachonado', fijo: { armors: 'cuero_tachonado' }, opciones: [
      { v: 'ganzuas',   t: 'Herramientas de Ladrón con ganzúas', misc: 'ganzuas' },
      { v: 'arma_extra', t: 'Un arma ligera adicional', armaLigera: true },
    ]},
    sagaz: { etiqueta: 'Tu apoyo de partida', fijo: {}, opciones: [
      { v: 'foco', t: 'Un Foco Mixto Desalineado — realinearlo es tu primera misión personal', custom: 'Foco Mixto Desalineado' },
      { v: 'botiquin', t: 'Un Kit de primeros auxilios', misc: 'kit_primeros_auxilios' },
    ]},
  };

  /* Métodos de generación — Manual Cap.3. El D reparte en orden estricto,
     así que no admite reasignación; el C no usa pool sino compra. */
  const ESTANDAR = [15, 14, 13, 12, 10, 8];
  const METODOS = [
    { id:'B', n:'Arreglo Estándar',       d:'Reparte 15 · 14 · 13 · 12 · 10 · 8.' },
    { id:'C', n:'Compra de puntos',        d:'Todos a 8 y 24 puntos. Máximo 18.' },
    { id:'A', n:'4d6, descarta el menor',  d:'Seis tiradas, las repartes tú.' },
    { id:'D', n:'3d6 en orden',            d:'Seis tiradas en orden. Sin redistribuir.' },
  ];
  const PUNTOS_COMPRA = 24, TOPE_COMPRA = 18;

  let S = null;
  const nuevoEstado = () => ({
    paso: 0, metodo: 'B', pool: ESTANDAR.slice(), pick: null, asign: {},
    desc: '', arq: '', bg: '', descPick: [], descExps: [], descTruco: '',
    arqSkills: [], bgSkills: [], talentos: [], nombre: '', cat: '', q: '',
    savCom: '', savPoco: '', guardAttr: 'DES',
    armas: [], opcArq: '', armaExtra: '', monedas: null,
  });

  /* Paso 6 — «Salvaciones con PB» y «Guardia» del Manual Cap.6: dos
     Salvaciones ganan el PB y la Guardia toma un atributo defensivo. Las
     tres son elecciones permanentes de creación, no números derivados. */
  const SAV_COMUN = ['DES', 'CON', 'SAB'];
  const SAV_POCO  = ['FUE', 'INT', 'CAR'];
  const GUARD_ATTR = ['DES', 'SAB', 'CON'];

  /** La entrada de `grant` que ofrece a elegir, en los dos formatos que
      conviven en los datos: «Elección de Experiencia: A / B» (una) y
      «Elige DOS Expresiones Mutantes: A / B / …» (varias del mismo grupo).
      Mismo criterio que origen.js, que es quien pinta esto en la ficha. */
  const NUMEROS = { un:1, una:1, dos:2, tres:3, cuatro:4 };
  function grupoEleccion(d) {
    for (const g of (d?.grant || [])) {
      let m = g.match(/^Elecci[óo]n\s*(?:de Experiencia)?\s*[:—–-]\s*(.+)$/i);
      if (m) return { n: 1, etiqueta: 'Elección de Experiencia', opciones: m[1] };
      m = g.match(/^Elige\s+(\S+)\s+([^:]+):\s*(.+)$/i);
      if (m) return {
        n: NUMEROS[m[1].toLowerCase()] || parseInt(m[1], 10) || 1,
        etiqueta: m[2].trim(), opciones: m[3],
      };
    }
    return null;
  }

  const el = (t, c, txt) => { const e = document.createElement(t);
    if (c) e.className = c; if (txt != null) e.textContent = txt; return e; };
  // La tabla de S&S NO es floor((v−10)/2) —va de −3 a +4, con tramos de dos
  // y de tres puntos—. Se usa la de la app para que la vista previa del
  // asistente no discrepe de la ficha: aquí salía Guardia 15 y en la ficha 14.
  const mod  = v => app.getMod(v);
  const sign = v => (v >= 0 ? '+' : '') + v;
  const d6   = () => 1 + Math.floor(Math.random() * 6);

  function poolInicial(m) {
    if (m === 'B') return ESTANDAR.slice();
    if (m === 'A') return Array.from({ length: 6 }, () => {
      const t = [d6(), d6(), d6(), d6()].sort((a, b) => b - a);
      return t[0] + t[1] + t[2];
    }).sort((a, b) => b - a);
    if (m === 'D') return Array.from({ length: 6 }, () => d6() + d6() + d6());
    return null;
  }

  /* Bonos del Descriptor: fijos + los que el jugador elige. Mismo criterio
     que app._descMods, pero leyendo del borrador y no del DOM de la ficha,
     que durante el asistente todavía no existe. */
  function modsDesc() {
    const d = app.DB.descriptors[S.desc];
    const out = {};
    if (!d) return out;
    Object.entries(d.mods || {}).forEach(([k, v]) => out[k] = (out[k] || 0) + v);
    S.descPick.forEach(a => { if (a) out[a] = (out[a] || 0) + (d.pick?.val || 1); });
    return out;
  }
  const base  = k => S.asign[k] != null ? S.asign[k] : (S.metodo === 'C' ? 8 : null);
  const total = k => (base(k) || 0) + (modsDesc()[k] || 0);

  /** La Fuente que abre la Afinidad del Linaje del borrador, o ''. */
  function fuenteAfinidad() {
    const d = app.DB.descriptors[S.desc];
    if (!d) return '';
    if (d.afinidad) return d.afinidad;
    const op = d.afinidadOpcional;
    return (op && S.descExps.includes(op.opcion)) ? op.fuente : '';
  }

  /* ── Paso 1 · Atributos ───────────────────────────────────────── */
  function pasoAtributos(b) {
    b.appendChild(el('p', 'wiz-hint',
      'Elige un método y repártelos. Los bonos de tu Linaje se suman después, en el Paso 2.'));
    const mm = el('div', 'wiz-metodos');
    METODOS.forEach(m => {
      const btn = el('button', 'wiz-met' + (S.metodo === m.id ? ' sel' : ''));
      btn.type = 'button';
      btn.appendChild(el('strong', null, m.id + ' · ' + m.n));
      btn.appendChild(el('span', null, ' — ' + m.d));
      btn.onclick = () => { S.metodo = m.id; S.pool = poolInicial(m.id);
        S.asign = {}; S.pick = null; pintar(); };
      mm.appendChild(btn);
    });
    b.appendChild(mm);

    if (S.metodo === 'C') {
      const gastado = ATTRS.reduce((a, k) => a + ((S.asign[k] || 8) - 8), 0);
      b.appendChild(el('p', 'wiz-hint',
        `Puntos restantes: ${PUNTOS_COMPRA - gastado} de ${PUNTOS_COMPRA}.`));
      ATTRS.forEach(k => {
        const v = S.asign[k] || 8;
        const row = el('div', 'wiz-attr' + (v > 8 ? ' on' : ''));
        row.appendChild(el('span', 'wiz-attr-n', ATTR_N[k]));
        const menos = el('button', 'res-btn', '−'); menos.type = 'button';
        menos.disabled = v <= 8;
        menos.onclick = () => { S.asign[k] = v - 1; pintar(); };
        const mas = el('button', 'res-btn', '+'); mas.type = 'button';
        mas.disabled = v >= TOPE_COMPRA || gastado >= PUNTOS_COMPRA;
        mas.onclick = () => { S.asign[k] = v + 1; pintar(); };
        row.appendChild(menos);
        row.appendChild(el('span', 'wiz-attr-b', String(v)));
        row.appendChild(mas);
        row.appendChild(el('span', 'wiz-attr-m', sign(mod(v))));
        b.appendChild(row);
      });
      return;
    }

    if (!S.pool) S.pool = poolInicial(S.metodo);
    if (S.metodo === 'D') {
      b.appendChild(el('p', 'wiz-hint', 'En orden estricto, sin redistribuir.'));
      ATTRS.forEach((k, i) => { S.asign[k] = S.pool[i]; });
    } else {
      const usados = Object.values(S.asign);
      const fila = el('div', 'wiz-pool');
      S.pool.forEach((v, i) => {
        const libre = usados.filter(u => u === v).length < S.pool.filter(x => x === v).length;
        const c = el('button', 'wiz-chip' + (S.pick === i ? ' sel' : '') + (libre ? '' : ' used'), String(v));
        c.type = 'button';
        if (libre) c.onclick = () => { S.pick = (S.pick === i ? null : i); pintar(); };
        fila.appendChild(c);
      });
      b.appendChild(fila);
      b.appendChild(el('p', 'wiz-hint', 'Toca un valor y luego el atributo donde lo quieres.'));
    }

    ATTRS.forEach(k => {
      const v = S.asign[k];
      const row = el('button', 'wiz-attr' + (v != null ? ' on' : ''));
      row.type = 'button';
      row.appendChild(el('span', 'wiz-attr-n', ATTR_N[k]));
      row.appendChild(el('span', 'wiz-attr-t', v != null ? String(v) : '—'));
      row.appendChild(el('span', 'wiz-attr-m', v != null ? sign(mod(v)) : ''));
      if (S.metodo !== 'D') row.onclick = () => {
        if (S.pick == null) { delete S.asign[k]; pintar(); return; }
        const val = S.pool[S.pick];
        Object.keys(S.asign).forEach(kk => { if (S.asign[kk] === val && kk !== k) delete S.asign[kk]; });
        S.asign[k] = val; S.pick = null; pintar();
      };
      b.appendChild(row);
    });
    if (S.metodo === 'A' || S.metodo === 'D') {
      const re = el('button', 'btn btn-g', 'Volver a tirar'); re.type = 'button';
      re.style.cssText = 'width:100%;margin-top:8px';
      re.onclick = () => { S.pool = poolInicial(S.metodo); S.asign = {}; S.pick = null; pintar(); };
      b.appendChild(re);
    }
  }

  /* ── Tarjeta de opción: lo que sustituye al desplegable ────────── */
  function tarjeta(nombre, etiqueta, texto, sub, sel, onClick) {
    const btn = el('button', 'wiz-opt' + (sel ? ' sel' : '')); btn.type = 'button';
    const h = el('div', 'wiz-opt-h');
    h.appendChild(el('span', 'wiz-opt-n', nombre));
    if (etiqueta) h.appendChild(el('span', 'wiz-opt-tag', etiqueta));
    btn.appendChild(h);
    if (texto) btn.appendChild(el('span', 'wiz-opt-t', texto));
    if (sub)   btn.appendChild(el('span', 'wiz-opt-sub', sub));
    btn.onclick = onClick;
    return btn;
  }

  /* ── Paso 2 · Descriptor ──────────────────────────────────────── */
  function pasoDescriptor(b) {
    b.appendChild(el('p', 'wiz-hint',
      'Tu herencia. Inclina los atributos que acabas de repartir y, en seis linajes, abre una Fuente de poder.'));
    Object.entries(app.DB.descriptors).forEach(([k, d]) => {
      let sub = '';
      if (d.afinidad) sub = '◆ Afinidad — Acceso a ' + d.afinidad;
      else if (d.afinidadOpcional)
        sub = '◇ Puede abrir ' + d.afinidadOpcional.fuente + ' gastando una Expresión';
      b.appendChild(tarjeta(d.name, d.bonus || '', d.txt || '', sub, S.desc === k,
        () => { S.desc = k; S.descPick = []; S.descExps = []; S.descTruco = ''; pintar(); }));
      // Las elecciones del Linaje cuelgan de SU tarjeta, igual que las
      // habilidades del Arquetipo y del Trasfondo: al fondo de once linajes
      // no se veía que lo elegido arriba tuviera nada pendiente debajo.
      if (S.desc === k) b.appendChild(subDescriptor(d));
    });
  }

  function subDescriptor(d) {
    const sub = el('div', 'wiz-sub wiz-inline');

    if (d.pick) {
      const n = d.pick.n || 1, origen = d.pick.from || ATTRS;
      for (let i = 0; i < n; i++) {
        sub.appendChild(el('span', 'wiz-lbl',
          (n > 1 ? `Bono de Linaje ${i + 1}` : 'Bono de Linaje') + ` (+${d.pick.val || 1})`));
        const s = el('select');
        s.appendChild(new Option('— Elegir —', ''));
        origen.filter(a => d.pick.distinct ? !S.descPick.some((x, j) => j !== i && x === a) : true)
              .forEach(a => s.appendChild(new Option(ATTR_N[a], a)));
        s.value = S.descPick[i] || '';
        s.onchange = () => { S.descPick[i] = s.value; pintar(); };
        sub.appendChild(s);
      }
    }
    const grupo = grupoEleccion(d);
    if (grupo) {
      const opciones = grupo.opciones.split(' / ')
        .map(o => ({ v: o.split('(')[0].trim(), t: o }));
      for (let i = 0; i < grupo.n; i++) {
        sub.appendChild(el('span', 'wiz-lbl',
          grupo.n > 1 ? `${grupo.etiqueta} ${i + 1}` : grupo.etiqueta));
        const s = el('select');
        s.appendChild(new Option('— Elegir —', ''));
        // Las del mismo grupo han de ser distintas: no se reofrece la ya usada.
        opciones.filter(o => !S.descExps.some((x, j) => j !== i && x === o.v))
                .forEach(o => s.appendChild(new Option(o.t, o.v)));
        s.value = S.descExps[i] || '';
        s.onchange = () => { S.descExps[i] = s.value; pintar(); };
        sub.appendChild(s);
      }
    }
    const fuente = fuenteAfinidad();
    if (fuente) {
      sub.appendChild(el('span', 'wiz-lbl', 'Truco de ' + fuente));
      const s = el('select');
      s.appendChild(new Option('— Elegir —', ''));
      Object.values(app.DB.spells).filter(x => x.type === 'trick')
        .map(x => x.name).sort((a, b) => a.localeCompare(b, 'es'))
        .forEach(n => s.appendChild(new Option(n, n)));
      s.value = S.descTruco;
      // pie(), no pintar(): elegir el Truco no cambia ninguna otra opción,
      // pero SÍ desbloquea «Continuar», y sin refrescar el pie el botón se
      // quedaba apagado con todo elegido.
      s.onchange = () => { S.descTruco = s.value; pie(); };
      sub.appendChild(s);
    }
    return sub;
  }

  /** Habilidades que el Descriptor ya concede: las que nombra una línea con
      «Grado» en sus Rasgos fijos o en la Experiencia elegida. Se reconocen
      contra la lista canónica de SKILL_ATTR en vez de intentar analizar la
      frase, que cambia de redacción de un Linaje a otro. */
  function skillsDelLinaje() {
    const d = app.DB.descriptors[S.desc];
    if (!d) return [];
    const nombres = Object.keys(typeof SKILL_ATTR === 'object' ? SKILL_ATTR : {});
    // Rasgos fijos que ya nombran un Grado (la línea de Elección se excluye:
    // de ella solo cuenta la opción escogida, que se añade justo después).
    const textos = (d.grant || []).filter(g => /Grado\s*\d/i.test(g) && !/^Elige|^Elecci/i.test(g));
    const grupo = grupoEleccion(d);
    if (grupo) {
      // Se parte la lista de opciones YA SIN su etiqueta —«Elección de
      // Experiencia: …»—: con ella delante, la primera opción no empieza por
      // su propio nombre y no se reconocía nunca.
      const trozos = grupo.opciones.split(' / ').map(o => o.trim());
      S.descExps.filter(Boolean).forEach(v => {
        const t = trozos.find(o => o.startsWith(v));
        if (t && /Grado\s*\d/i.test(t)) textos.push(t);
      });
    }
    const out = [];
    textos.forEach(t => nombres.forEach(n => {
      if (t.includes(n) && !out.includes(n)) out.push(n);
    }));
    return out;
  }

  /** Lista de habilidades elegibles con su procedencia ya marcada.
      `fuentes` es [{ etiqueta, lista }] de lo que el personaje YA tiene. */
  function listaHabilidades(host, skills, elegidas, tope, fuentes, onToggle) {
    (skills || []).forEach(n => {
      const on = elegidas.includes(n);
      const previa = fuentes.find(f => f.lista.includes(n));
      let etiqueta = '', nota = '';
      if (on) etiqueta = previa ? 'Grado 1' : 'Grado 0';
      else if (previa) etiqueta = 'ya la tienes';
      if (previa) nota = `Ya la tienes por ${previa.etiqueta}: elegirla aquí la sube a Grado 1.`;
      host.appendChild(tarjeta(n, etiqueta, nota, '', on, () => onToggle(n, on)));
    });
  }

  /* ── Paso 3 · Arquetipo ───────────────────────────────────────── */
  /* Las habilidades se despliegan DEBAJO de la tarjeta elegida, no al final
     de la lista: si van al fondo hay que recorrer los tres Arquetipos para
     encontrar lo que acabas de abrir. */
  function pasoArquetipo(b) {
    b.appendChild(el('p', 'wiz-hint',
      'Tu chasis táctico: qué gastas para forzar el mundo. Ninguno cierra puertas — decide el punto de partida.'));
    const con = total('CON');
    const delLinaje = skillsDelLinaje();
    Object.entries(app.DB.archetypes).forEach(([k, a]) => {
      b.appendChild(tarjeta(a.name, 'PV ' + (a.pv + con), a.txt || '',
        `Adr +${a.adr_bonus} · Ing +${a.ing_bonus} · ${a.skills_count} habilidades · ${a.sustrato_nombre} / ${a.permiso_nombre}`,
        S.arq === k, () => { S.arq = k; S.arqSkills = []; pintar(); }));
      if (S.arq !== k) return;
      const sub = el('div', 'wiz-sub wiz-inline');
      sub.appendChild(el('span', 'wiz-lbl',
        `Habilidades del Arquetipo — elige ${a.skills_count} (${S.arqSkills.length} elegidas)`));
      listaHabilidades(sub, a.skills, S.arqSkills, a.skills_count,
        [{ etiqueta: 'tu Linaje', lista: delLinaje }],
        (n, on) => {
          if (on) S.arqSkills = S.arqSkills.filter(x => x !== n);
          else if (S.arqSkills.length < a.skills_count) S.arqSkills.push(n);
          pintar();
        });
      b.appendChild(sub);
    });
  }

  /* ── Paso 4 · Trasfondo ───────────────────────────────────────── */
  function pasoTrasfondo(b) {
    b.appendChild(el('p', 'wiz-hint',
      'De dónde vienes: dos habilidades, un Vínculo con su Dado de Uso y un Defecto que el Director puede usar.'));
    const fuentes = [
      { etiqueta: 'tu Arquetipo', lista: S.arqSkills },
      { etiqueta: 'tu Linaje',    lista: skillsDelLinaje() },
    ];
    Object.entries(app.DB.backgrounds).forEach(([k, g]) => {
      const ud = ((g.grant || []).find(x => /Ud\d/.test(x)) || '').match(/Ud\d+/);
      // En la propia tarjeta, las que ya tienes salen marcadas: así se ve de
      // un vistazo qué Trasfondo te repite habilidades y cuál te amplía.
      const lista = (g.skills || [])
        .map(n => fuentes.some(f => f.lista.includes(n)) ? '✓ ' + n : n).join(' · ');
      b.appendChild(tarjeta(g.name, ud ? ud[0] : '', g.defecto || '', lista, S.bg === k,
        () => { S.bg = k; S.bgSkills = []; pintar(); }));
      if (S.bg !== k) return;
      const sub = el('div', 'wiz-sub wiz-inline');
      sub.appendChild(el('span', 'wiz-lbl',
        `Habilidades del Trasfondo — elige 2 (${S.bgSkills.length} elegidas)`));
      listaHabilidades(sub, g.skills, S.bgSkills, 2, fuentes, (n, on) => {
        if (on) S.bgSkills = S.bgSkills.filter(x => x !== n);
        else if (S.bgSkills.length < 2) S.bgSkills.push(n);
        pintar();
      });
      b.appendChild(sub);
    });
  }

  /* ── Paso 5 · Talentos ────────────────────────────────────────── */
  /* Se usa el evaluador REAL de la app —no una copia—, prestándole el
     borrador por `_wizCtx`: si no, leería el DOM de la ficha, que durante
     el asistente está vacío o con los restos del personaje anterior.
     Incluye los Talentos ya elegidos, así que tomar «Iniciado en Pacto»
     desbloquea al momento los que lo exigen. */
  function conContexto(fn) {
    app._wizCtx = {
      stats: ATTRS.reduce((o, k) => (o[k] = total(k), o), {}),
      lvl: 1,
      afinidad: fuenteAfinidad(),
      talentos: S.talentos,
    };
    try { return fn(); } finally { app._wizCtx = null; }
  }
  const requisitosOk = req => conContexto(() => app._parseTalentReq(req).met);
  /* La lista vive en su propio contenedor y se refresca sola: si repintase
     todo el paso, el buscador perdería el foco a cada tecla y la página
     saltaría arriba en cada selección. */
  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function pintarListaTalentos() {
    const host = document.getElementById('wiz_tal_list');
    if (!host) return;
    host.textContent = '';
    const q = norm(S.q).split(/\s+/).filter(Boolean);
    let n = 0;
    conContexto(() => {
      Object.keys(app.DB.talents)
        .filter(c => !S.cat || c === S.cat)
        .forEach(c => app.DB.talents[c].forEach(t => {
          if (!app._parseTalentReq(t.req).met) return;
          // Se busca en nombre, leyenda y Grados, como el Gestor de Talentos.
          if (q.length) {
            const heno = norm(t.name + ' ' + (t.desc || '') + ' ' +
              (t.grades || []).map(g => g.d).join(' '));
            if (!q.every(w => heno.includes(w))) return;
          }
          n++;
          const on = S.talentos.some(x => x.name === t.name);
          host.appendChild(tarjeta(t.name, on ? '✓ elegido' : c, t.desc || '',
            t.grades?.[0] ? 'G1: ' + t.grades[0].d.split('\n')[0] : '', on, () => {
              if (on) S.talentos = S.talentos.filter(x => x.name !== t.name);
              else if (S.talentos.length < 3)
                S.talentos.push({ name: t.name, id: t.id || '', desc: t.desc || '' });
              pintarListaTalentos();   // solo la lista: no se mueve el scroll
              pie();
            }));
        }));
    });
    const cuenta = document.getElementById('wiz_tal_count');
    if (cuenta) cuenta.textContent = n + (n === 1 ? ' disponible' : ' disponibles');
    if (!n) host.appendChild(el('p', 'wiz-hint',
      S.q ? 'Ningún Talento disponible coincide con la búsqueda.'
          : 'Ninguno disponible con estos atributos en esta Senda.'));
  }

  function pasoTalentos(b) {
    b.appendChild(el('p', 'wiz-hint',
      'Elige 3. Solo salen los que puedes tomar ahora, con tus atributos y a Nivel 1.'));

    const busca = el('input');
    busca.type = 'search'; busca.placeholder = 'Buscar por nombre o efecto…';
    busca.value = S.q; busca.className = 'wiz-buscar';
    busca.addEventListener('input', () => { S.q = busca.value; pintarListaTalentos(); });
    b.appendChild(busca);

    const cats = Object.keys(app.DB.talents);
    const sel = el('select');
    sel.appendChild(new Option('Todas las Sendas', ''));
    cats.forEach(c => sel.appendChild(new Option(c[0].toUpperCase() + c.slice(1), c)));
    sel.value = S.cat;
    sel.onchange = () => { S.cat = sel.value; pintarListaTalentos(); };
    b.appendChild(sel);

    const cuenta = el('span', 'wiz-cuenta'); cuenta.id = 'wiz_tal_count';
    b.appendChild(cuenta);
    const lista = el('div'); lista.id = 'wiz_tal_list';
    b.appendChild(lista);
    pintarListaTalentos();
  }

  /* ── Paso 6 · Ficha ───────────────────────────────────────────── */
  function pasoFicha(b) {
    const a = app.DB.archetypes[S.arq] || {};
    const d = app.DB.descriptors[S.desc] || {};
    const pb = 2, con = total('CON');
    const pv  = (a.pv || 0) + con;
    const adr = Math.max(total('FUE'), total('DES')) + 1 + (a.adr_bonus || 0);
    const ing = Math.max(total('INT'), total('SAB'), total('CAR')) + 1 + (a.ing_bonus || 0);
    const guardia = 10 + pb + mod(total(S.guardAttr));

    b.appendChild(el('span', 'wiz-lbl', 'Nombre'));
    const inp = el('input'); inp.type = 'text'; inp.placeholder = 'Ej. Vorath el Audaz';
    inp.value = S.nombre;
    inp.oninput = () => { S.nombre = inp.value; pie(); };
    b.appendChild(inp);

    /* Fila de opciones excluyentes: la elección permanente se ve entera y de
       un toque, sin desplegar. Muestra el MOD de cada una porque es lo que se
       está comparando al elegir. */
    const eleccionAttr = (etiqueta, opciones, valor, onPick, extra) => {
      b.appendChild(el('span', 'wiz-lbl', etiqueta));
      const fila = el('div', 'wiz-attrpick');
      opciones.forEach(k => {
        const btn = el('button', 'wiz-apick' + (valor === k ? ' sel' : ''));
        btn.type = 'button';
        btn.appendChild(el('span', 'wiz-apick-n', ATTR_N[k]));
        btn.appendChild(el('span', 'wiz-apick-v',
          extra ? extra(k) : sign(mod(total(k)) + pb)));
        btn.onclick = () => { onPick(k); pintar(); };
        fila.appendChild(btn);
      });
      b.appendChild(fila);
    };
    eleccionAttr('Salvación Común — con Bono de Competencia',
      SAV_COMUN, S.savCom, k => S.savCom = k);
    eleccionAttr('Salvación Poco Común — con Bono de Competencia',
      SAV_POCO, S.savPoco, k => S.savPoco = k);
    eleccionAttr('Atributo defensivo de la Guardia',
      GUARD_ATTR, S.guardAttr, k => S.guardAttr = k,
      k => String(10 + pb + mod(total(k))));
    b.appendChild(el('p', 'wiz-hint',
      'Las dos Salvaciones elegidas suman el PB al 1d20; las demás, solo el MOD. Las tres son permanentes.'));

    const der = el('div', 'wiz-derived');
    [['PV', pv], ['Flesh', con], ['Adrenalina', adr],
     ['Ingenio', ing], ['Guardia', guardia], ['PB', sign(pb)]]
      .forEach(([l, v]) => {
        const c = el('div', 'wiz-der');
        c.appendChild(el('span', 'wiz-der-l', l));
        c.appendChild(el('span', 'wiz-der-v', String(v)));
        der.appendChild(c);
      });
    b.appendChild(der);

    const dl = el('dl', 'wiz-sum');
    const fila = (k, v) => { dl.appendChild(el('dt', null, k)); dl.appendChild(el('dd', null, v || '—')); };
    fila('Atributos', ATTRS.map(k => k + ' ' + total(k)).join('   '));
    fila('Linaje', d.name);
    const fuente = fuenteAfinidad();
    if (fuente) fila('Fuente', fuente + (S.descTruco ? ' · Truco: ' + S.descTruco : ''));
    const grupo = grupoEleccion(d);
    if (grupo && S.descExps.filter(Boolean).length)
      fila(grupo.etiqueta, S.descExps.filter(Boolean).join(', '));
    fila('Arquetipo', a.name);
    fila('Trasfondo', (app.DB.backgrounds[S.bg] || {}).name);
    // Una habilidad en Arquetipo Y Trasfondo no se lista dos veces: sube de
    // Grado (Manual Cap.5, «o suben de Grado 0 a Grado 1 si ya las tenías»).
    const cuenta = {};
    S.arqSkills.concat(S.bgSkills).forEach(x => cuenta[x] = (cuenta[x] || 0) + 1);
    fila('Habilidades', Object.keys(cuenta).map(x => x + ' · Grado ' + (cuenta[x] - 1)).join(', '));
    fila('Talentos', S.talentos.map(t => t.name).join(', '));
    fila('Salvaciones con PB', [S.savCom, S.savPoco].filter(Boolean).join(' · '));
    fila('Guardia con', ATTR_N[S.guardAttr]);
    b.appendChild(dl);
  }

  /* ── Paso 7 · Equipo ──────────────────────────────────────────── */
  /* «1 arma de su competencia (o 2 armas simples)» — Manual Cap.6. La
     competencia sale del Arquetipo: el Audaz las lleva todas, el Sagaz solo
     simples, y el Versátil ligeras más una mediana a elección. */
  const esSimple  = w => /simple/i.test(w.notes || '');
  const esLigera  = w => w.type === 'light';

  function armasPermitidas() {
    const k = S.arq;
    return Object.entries(app.DB.weapons || {})
      .filter(([id, w]) => id !== 'desarmado')
      .filter(([, w]) => {
        if (k === 'audaz') return true;
        if (k === 'sagaz') return esSimple(w);
        return esLigera(w) || w.type === 'medium';   // Versátil
      });
  }
  const topeArmas = () => S.armas.length && esSimple(app.DB.weapons[S.armas[0]]) ? 2 : 1;

  function pasoEquipo(b) {
    const arq = app.DB.archetypes[S.arq] || {};
    b.appendChild(el('p', 'wiz-hint',
      'Con lo que sales por la puerta. El equipo pesado —Coraza, Placas, armas de fuego— se gana en juego, no en la creación.'));

    // 1 · Armas
    const dos = S.armas.length === 1 && esSimple(app.DB.weapons[S.armas[0]]);
    b.appendChild(el('span', 'wiz-lbl',
      dos ? 'Arma — has elegido una simple, puedes llevar una segunda'
          : `Arma de tu competencia (${S.armas.length} de ${topeArmas()})`));
    armasPermitidas().forEach(([id, w]) => {
      const on = S.armas.includes(id);
      const lleno = !on && S.armas.length >= topeArmas();
      const card = tarjeta(w.name, w.dmg, w.notes || '', '', on, () => {
        if (on) S.armas = S.armas.filter(x => x !== id);
        else if (!lleno) S.armas.push(id);
        pintar();
      });
      if (lleno) card.disabled = true;
      b.appendChild(card);
    });

    // 2 · Elección propia del Arquetipo
    const eq = EQUIPO_ARQ[S.arq];
    if (eq) {
      const sub = el('div', 'wiz-sub');
      sub.appendChild(el('span', 'wiz-lbl', eq.etiqueta));
      eq.opciones.forEach(o => {
        sub.appendChild(tarjeta(o.t.split(' — ')[0], '', o.t.split(' — ')[1] || '', '',
          S.opcArq === o.v, () => { S.opcArq = o.v; S.armaExtra = ''; pintar(); }));
      });
      // «un arma ligera adicional» del Versátil: hay que decir cuál.
      if (S.opcArq === 'arma_extra') {
        sub.appendChild(el('span', 'wiz-lbl', 'Arma ligera adicional'));
        const s = el('select');
        s.appendChild(new Option('— Elegir —', ''));
        Object.entries(app.DB.weapons).filter(([id, w]) => id !== 'desarmado' && esLigera(w))
          .forEach(([id, w]) => s.appendChild(new Option(`${w.name} (${w.dmg})`, id)));
        s.value = S.armaExtra;
        s.onchange = () => { S.armaExtra = s.value; pie(); };
        sub.appendChild(s);
      }
      b.appendChild(sub);
    }

    // 3 · Monedas iniciales
    const nd = MONEDAS[S.arq] || 3;
    const sub2 = el('div', 'wiz-sub');
    sub2.appendChild(el('span', 'wiz-lbl', `Monedas iniciales — ${nd}d6 × 10 pp`));
    const fila = el('div', 'wiz-attrpick');
    const caja = el('div', 'wiz-apick sel');
    caja.appendChild(el('span', 'wiz-apick-n', 'Piezas de plata'));
    caja.appendChild(el('span', 'wiz-apick-v',
      S.monedas == null ? '—' : String(S.monedas)));
    fila.appendChild(caja);
    const tirar = el('button', 'wiz-apick', S.monedas == null ? 'Tirar' : 'Volver a tirar');
    tirar.type = 'button';
    tirar.onclick = () => {
      let t = 0; for (let i = 0; i < nd; i++) t += d6();
      S.monedas = t * 10; pintar();
    };
    fila.appendChild(tirar);
    sub2.appendChild(fila);
    b.appendChild(sub2);

    // 4 · Lo que llevan todos, sin elección
    const sub3 = el('div', 'wiz-sub');
    sub3.appendChild(el('span', 'wiz-lbl', 'Incluido para todos'));
    const lista = PAQUETE.map(k => (app.DB.misc[k] || {}).name || k).concat(['Ropa de viaje']);
    if (eq && eq.fijo.armors)  lista.push(app.DB.armors[eq.fijo.armors].name);
    if (eq && eq.fijo.shields) lista.push(app.DB.shields[eq.fijo.shields].name);
    sub3.appendChild(el('p', 'wiz-hint', lista.join(' · ')));
    b.appendChild(sub3);
  }

  const PINTORES = [pasoAtributos, pasoDescriptor, pasoArquetipo,
                    pasoTrasfondo, pasoTalentos, pasoFicha, pasoEquipo];

  /* ── Validación: qué falta para poder continuar ───────────────── */
  function queFalta() {
    const d = app.DB.descriptors[S.desc];
    const a = app.DB.archetypes[S.arq];
    switch (S.paso) {
      case 0:
        if (S.metodo === 'C') {
          const g = ATTRS.reduce((x, k) => x + ((S.asign[k] || 8) - 8), 0);
          return g === PUNTOS_COMPRA ? '' : `Te quedan ${PUNTOS_COMPRA - g} puntos por repartir`;
        }
        return Object.keys(S.asign).length === 6 ? '' : 'Reparte los seis valores';
      case 1:
        if (!S.desc) return 'Elige un Linaje';
        if (d.pick && S.descPick.filter(Boolean).length < (d.pick.n || 1))
          return 'Elige tu bono de atributo';
        {
          const g = grupoEleccion(d);
          if (g && S.descExps.filter(Boolean).length < g.n)
            return g.n > 1 ? `Elige ${g.n} ${g.etiqueta}` : 'Elige tu ' + g.etiqueta;
        }
        if (fuenteAfinidad() && !S.descTruco) return 'Elige tu Truco';
        return '';
      case 2:
        if (!S.arq) return 'Elige un Arquetipo';
        return S.arqSkills.length === a.skills_count ? ''
          : `Elige ${a.skills_count - S.arqSkills.length} habilidad(es) más`;
      case 3:
        if (!S.bg) return 'Elige un Trasfondo';
        return S.bgSkills.length === 2 ? '' : `Elige ${2 - S.bgSkills.length} habilidad(es) más`;
      case 4:
        return S.talentos.length === 3 ? '' : `Elige ${3 - S.talentos.length} Talento(s) más`;
      case 5:
        if (!S.savCom)  return 'Elige tu Salvación Común';
        if (!S.savPoco) return 'Elige tu Salvación Poco Común';
        return S.nombre.trim() ? '' : 'Ponle un nombre';
      case 6:
        if (!S.armas.length) return 'Elige tu arma';
        if (EQUIPO_ARQ[S.arq] && !S.opcArq) return 'Elige el equipo de tu Arquetipo';
        if (S.opcArq === 'arma_extra' && !S.armaExtra) return 'Elige el arma ligera adicional';
        return S.monedas == null ? 'Tira tus monedas iniciales' : '';
    }
    return '';
  }

  function pie() {
    const falta = queFalta();
    $('wiz_next').disabled = !!falta;
    $('wiz_next').textContent = S.paso === ULTIMO ? 'Crear personaje' : 'Continuar';
    $('wiz_why').textContent = falta;
  }

  function pintar() {
    $('wiz_ttl').textContent = PASOS[S.paso];
    $('wiz_sub').textContent = `Paso ${S.paso + 1} de ${PASOS.length} · ${MINUTOS[S.paso]}`;
    const bars = $('wiz_bars'); bars.textContent = '';
    PASOS.forEach((_, i) => bars.appendChild(
      el('span', 'wiz-bar' + (i === S.paso ? ' on' : (i < S.paso ? ' done' : '')))));
    const b = $('wiz_body');
    // Elegir una opción repinta el paso entero, y devolver el scroll a 0
    // mandaba la vista arriba en cada toque: para elegir el Trasfondo número
    // once había que volver a bajar once veces. Solo se reinicia al CAMBIAR
    // de paso, que es cuando el contenido es otro.
    const mismoPaso = S._pintado === S.paso;
    const y = mismoPaso ? b.scrollTop : 0;
    b.textContent = '';
    PINTORES[S.paso](b);
    b.scrollTop = y;
    S._pintado = S.paso;
    pie();
  }

  /* ── Volcado final a la ficha real ────────────────────────────── */
  /* No se inventa ningún cálculo: se rellenan los mismos campos que
     rellenaría una persona y se deja que calc() derive lo demás. */
  function crear() {
    app.newCharManual();                       // ficha limpia y en edición

    ATTRS.forEach(k => {
      const e = $('base_' + k);
      if (e) { e.value = base(k) || 8; e.dispatchEvent(new Event('input', { bubbles: true })); }
    });

    // Las habilidades se aplican por _skillsSel: updateOptions reconstruye
    // las casillas marcando lo que haya en esos Sets.
    app._skillsSel = { arq: new Set(S.arqSkills), bg: new Set(S.bgSkills) };

    const set = (id, v) => { const e = $(id); if (e && v != null) e.value = v; };
    set('sel_desc', S.desc); set('sel_arq', S.arq); set('sel_bg', S.bg);
    app.updateOptions(false);                  // crea las elecciones del Linaje

    // origen.js numera las elecciones del mismo grupo desc_eleccion,
    // desc_eleccion__2, desc_eleccion__3…
    const volcarElecciones = () => {
      S.descPick.forEach((v, i) => set('desc_pick_' + (i + 1), v));
      S.descExps.forEach((v, i) => set('desc_eleccion' + (i ? '__' + (i + 1) : ''), v));
    };
    volcarElecciones();
    // El bloque de Afinidad del Mutante solo aparece DESPUÉS de elegir su
    // Expresión, así que hace falta repintar antes de poder fijar su Truco.
    app._repintarOrigen && app._repintarOrigen();
    volcarElecciones();
    set('desc_eleccion_afinidad', S.descTruco);

    S.talentos.forEach(t => {
      const h = document.createElement('input');
      h.type = 'hidden'; h.name = 'chk_talents_hidden';
      h.value = t.name;
      h.setAttribute('data-desc', t.desc || '');
      h.setAttribute('data-grade', '1');
      if (t.id) h.setAttribute('data-id', t.id);
      document.body.appendChild(h);
    });

    // Salvaciones con PB y atributo defensivo de la Guardia: las tres son
    // elecciones de creación, así que se marcan como lo haría el jugador.
    const radio = (grupo, v) =>
      document.querySelector(`input[name="${grupo}"][value="${v}"]`);
    const rc = radio('save_common', S.savCom);     if (rc) rc.checked = true;
    const ru = radio('save_uncommon', S.savPoco);  if (ru) ru.checked = true;
    set('sel_guard_attr', S.guardAttr);

    /* Equipo. Los desplegables de combate se rellenan desde el INVENTARIO y
       su value es el uid del objeto, no la clave de la base: primero se
       añaden las cosas, luego se sincronizan las listas, y solo entonces se
       puede equipar. */
    const meter = (cat, key) => {
      const data = app.DB[cat]?.[key];
      if (!data) return null;
      const item = {
        uid: app._nextUid(), name: data.name, slots: data.slots || 1,
        type: cat === 'shields' ? 'shields' : cat, dbKey: key, dbData: data,
      };
      app.inventory.push(item);
      return item;
    };
    const armasItems = S.armas.map(k => meter('weapons', k)).filter(Boolean);
    const eq = EQUIPO_ARQ[S.arq];
    let armorItem = null, shieldItem = null;
    if (eq) {
      if (eq.fijo.armors)  armorItem  = meter('armors',  eq.fijo.armors);
      if (eq.fijo.shields) shieldItem = meter('shields', eq.fijo.shields);
      const o = eq.opciones.find(x => x.v === S.opcArq);
      if (o) {
        if (o.armor) armorItem = meter('armors', o.armor);
        if (o.misc)  meter('misc', o.misc);
        if (o.custom) app.inventory.push({
          uid: app._nextUid(), name: o.custom, slots: 1, type: 'misc',
        });
        if (o.armaLigera && S.armaExtra) armasItems.push(meter('weapons', S.armaExtra));
      }
    }
    PAQUETE.forEach(k => meter('misc', k));
    app.inventory.push({ uid: app._nextUid(), name: 'Ropa de viaje', slots: 1, type: 'misc' });
    app.gold = S.monedas || 0;

    app.renderInventory();
    app.syncCombatOptions();
    if (armasItems[0]) set('sel_weapon', armasItems[0].uid);
    if (armasItems[1]) set('sel_weapon_sec', armasItems[1].uid);
    if (armorItem)  set('sel_armor',  armorItem.uid);
    if (shieldItem) set('sel_shield', shieldItem.uid);
    app.onWeaponChange && app.onWeaponChange('w1');

    set('char_name', S.nombre.trim());
    app.updateOptions(false);                  // refleja habilidades y Pericias
    app.calc();
    app.showTalentSummary(); app.updateTalentCount();
    app.buildDetailPage && app.buildDetailPage();
    // «personal» no está en confirmSection: tiene su propio confirmPersonal,
    // y sin él la ficha quedaba cerrada pero con el nombre sin pintar.
    app.confirmPersonal();
    ['identity','stats','saves','skills','guard','combat','equipment']
      .forEach(s => app.confirmSection(s));
    cerrar();
    app.goToPage(0);
    app.toast(`${S.nombre.trim()} listo — revisa la ficha y guarda`, 'ok');
  }

  /* ── Abrir / cerrar ───────────────────────────────────────────── */
  function cerrar() {
    const p = $('wiz_panel');
    p.classList.remove('fs-open');
    document.body.style.overflow = '';
  }
  function abrir() {
    S = nuevoEstado();
    const p = $('wiz_panel');
    p.classList.add('fs-open');
    document.body.style.overflow = 'hidden';
    pintar();
  }

  $('wiz_back').onclick = () => {
    if (S && S.paso > 0) { S.paso--; pintar(); return; }
    cerrar();
    app.showScreen('home');
  };
  $('wiz_next').onclick = () => {
    if (queFalta()) return;
    if (S.paso === ULTIMO) { crear(); return; }
    S.paso++; pintar();
  };
  // Salida de emergencia: quien prefiera la ficha entera abierta de golpe
  // —o quiera cambiar algo que el asistente no pregunta— no queda atrapado.
  $('wiz_manual').onclick = () => { cerrar(); app.newCharManual(); };

  /* ── Interruptor en Ajustes & Datos ───────────────────────────── */
  /* Preferencia de quien juega, no del personaje: vive en localStorage y no
     viaja en el JSON de la ficha. Por defecto ACTIVADO — quien no lo toque
     recibe el asistente, que es lo que se quiere para una ficha nueva. */
  const CLAVE_PREF = 'ss_asistente';

  function leerPref() {
    try { return localStorage.getItem(CLAVE_PREF) !== '0'; }
    catch (e) { return true; }
  }
  function sincronizarBoton() {
    const btn = $('wiz_toggle_btn');
    if (btn) btn.setAttribute('aria-pressed', String(app.asistenteActivo));
  }

  app.asistenteActivo = leerPref();

  app.toggleAsistente = function () {
    this.asistenteActivo = !this.asistenteActivo;
    try { localStorage.setItem(CLAVE_PREF, this.asistenteActivo ? '1' : '0'); }
    catch (e) { /* cuota o modo privado: la sesión sigue funcionando */ }
    sincronizarBoton();
    this.toast(this.asistenteActivo
      ? 'Asistente activado — «Nuevo personaje» te guiará por los siete pasos'
      : 'Asistente desactivado — «Nuevo personaje» abrirá la ficha entera', 'ok');
  };

  // El botón se pinta con su estado al abrir Ajustes, no solo al arrancar:
  // el modal existe desde el principio pero puede abrirse en cualquier momento.
  const _openSettings = app.openSettings;
  app.openSettings = function () {
    const r = _openSettings.apply(this, arguments);
    sincronizarBoton();
    return r;
  };

  /* newChar pasa a ser el asistente; el flujo antiguo queda accesible tanto
     desde aquí como desde el botón «A mano» de la propia cabecera. */
  const _newChar = app.newChar;
  app.newCharManual = function () { return _newChar.apply(this, arguments); };
  app.newChar = function () {
    if (!app.asistenteActivo) return app.newCharManual();
    abrir();
  };

  const _init = app.init;
  app.init = function () {
    const r = _init.apply(this, arguments);
    sincronizarBoton();
    return r;
  };
})();
