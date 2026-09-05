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
    armaQ: '', armaF: [],
    descUlt: '', arqUlt: '', bgUlt: '',
    alineamiento: '', retrato: '',
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

  /** Bono de atributos del Linaje, comprimido para la etiqueta de la tarjeta.
      El texto largo de `bonus` —«+1 a dos Atributos distintos a elección»— no
      cabe junto al nombre en un móvil y se le montaba encima. Se reduce a lo
      que hay que decidir:

        +1 a dos Atributos distintos a elección  →  Elegir +1, +1
        +2 a un Atributo a elección, +1 CON      →  Elegir +2 · +1 CON
        +2 CAR, +1 INT o DES                     →  +2 CAR · +1 INT/DES

      El orden importa: primero se separan las cláusulas con «·», y solo
      después se expanden las elecciones, que meten sus propias comas. */
  const CUANTOS = { un:1, una:1, dos:2, tres:3, cuatro:4 };
  function bonoCorto(txt) {
    if (!txt) return '';
    return String(txt)
      .replace(/,\s*\+/g, ' · +')
      .replace(/\+(\d+)\s+a\s+(un|una|dos|tres|cuatro)\s+Atributos?\s*(?:distintos?\s*)?a\s+elecci[oó]n/gi,
        (_, n, palabra) => {
          const veces = CUANTOS[palabra.toLowerCase()] || 1;
          return 'Elegir ' + Array.from({ length: veces }, () => '+' + n).join(', ');
        })
      .replace(/\b([A-Z]{3})\s+o\s+([A-Z]{3})\b/g, '$1/$2')
      .replace(/\s{2,}/g, ' ')
      .trim();
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

  /** Un toque abre la opción, otro la cierra. Cerrar NO borra lo que ya
      habías elegido dentro: volver a abrir la misma opción lo devuelve
      tal cual, y solo se reinicia al pasarte a otra distinta. Por eso
      hace falta recordar cuál fue la última (`<campo>Ult`): tras cerrar,
      `S[campo]` está vacío y no bastaría con compararlo. */
  function alternar(campo, k, reiniciar) {
    if (S[campo] === k) { S[campo] = ''; }
    else {
      if (S[campo + 'Ult'] !== k) reiniciar();
      S[campo] = k;
      S[campo + 'Ult'] = k;
    }
    pintar();
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
      b.appendChild(tarjeta(d.name, bonoCorto(d.bonus), d.txt || '', sub, S.desc === k,
        () => alternar('desc', k, () => {
          S.descPick = []; S.descExps = []; S.descTruco = '';
        })));
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
        S.arq === k, () => alternar('arq', k, () => { S.arqSkills = []; })));
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
        () => alternar('bg', k, () => { S.bgSkills = []; })));
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

    /* Retrato. Reutiliza el mismo <input type=file> y el mismo recorte que la
       ficha (#img_input → app.startCrop), así que no hay dos caminos que
       mantener. El diálogo de recorte es un <dialog> modal: sale en el top
       layer, por encima del panel del asistente, sin tocar z-index. */
    b.appendChild(el('span', 'wiz-lbl', 'Retrato'));
    const port = el('div', 'wiz-port');
    const img = el('img', 'wiz-port-img');
    img.alt = '';
    img.src = S.retrato || (typeof DEFAULT_PORTRAIT !== 'undefined' ? DEFAULT_PORTRAIT : '');
    const bot = el('button', 'btn btn-g', S.retrato ? 'Cambiar retrato' : 'Elegir retrato');
    bot.type = 'button';
    bot.onclick = () => {
      const inp = $('img_input');
      if (!inp) return;
      // El recorte escribe en #char_img; se recoge de ahí al cerrarse.
      const alCerrar = () => {
        const src = $('char_img')?.src || '';
        if (src && !src.startsWith('data:image/svg')) { S.retrato = src; pintar(); }
      };
      $('crop_modal')?.addEventListener('close', alCerrar, { once: true });
      inp.click();
    };
    port.appendChild(img);
    const cols = el('div', 'wiz-port-side');
    cols.appendChild(bot);
    if (S.retrato) {
      const quitar = el('button', 'btn btn-g', 'Quitar'); quitar.type = 'button';
      quitar.onclick = () => { S.retrato = ''; pintar(); };
      cols.appendChild(quitar);
    }
    port.appendChild(cols);
    b.appendChild(port);

    b.appendChild(el('span', 'wiz-lbl', 'Nombre'));
    const inp = el('input'); inp.type = 'text'; inp.placeholder = 'Ej. Vorath el Audaz';
    inp.value = S.nombre;
    inp.oninput = () => { S.nombre = inp.value; pie(); };
    b.appendChild(inp);

    /* Convicción — Manual Apéndice D. Las nueve etiquetas clásicas como
       coordenadas de dos ejes, no como veredicto moral. No cambia ninguna
       regla, pero es parte de quién es el personaje y faltaba. */
    b.appendChild(el('span', 'wiz-lbl', 'Convicción'));
    const conv = el('div', 'wiz-conv');
    (typeof ALIGNMENTS !== 'undefined' ? ALIGNMENTS : []).forEach(x => {
      const btn = el('button', 'wiz-conv-b' + (S.alineamiento === x ? ' sel' : ''), x);
      btn.type = 'button';
      btn.onclick = () => { S.alineamiento = (S.alineamiento === x ? '' : x); pintar(); };
      conv.appendChild(btn);
    });
    b.appendChild(conv);

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
    if (S.alineamiento) fila('Convicción', S.alineamiento);
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

  /* Las propiedades de un arma viven dentro de `notes`, separadas por «·»
     («Marcial · Versátil (2 manos: 1d10) · Cortante»). La lista es curada
     a mano y no sacada de los datos porque ahí hay ruido que no filtra
     nada —alcances como «150/600», «Munición Ud10», «Área 15 pies»—. */
  const FILTROS_ARMA = ['Simple', 'Marcial', 'Ligera', 'Pesada', 'Versátil',
                        'Dos Manos', 'Sutil', 'Arrojadiza', 'A distancia',
                        'Cortante', 'Perforante', 'Contundente', 'Magitec'];

  /** Propiedades de un arma, ya normalizadas y sin los paréntesis. */
  const propsArma = w => String(w.notes || '').split('·').map(t => norm(t).trim());
  const tieneProp = (w, tag) => propsArma(w).some(t => t.includes(norm(tag)));

  /** Las que pasan búsqueda y filtros. Los filtros suman condiciones: dos
      chips piden las dos cosas, no una u otra. */
  function armasFiltradas() {
    const q = norm(S.armaQ).split(/\s+/).filter(Boolean);
    return armasPermitidas().filter(([, w]) => {
      if (!S.armaF.every(tag => tieneProp(w, tag))) return false;
      if (!q.length) return true;
      const heno = norm(w.name + ' ' + (w.notes || '') + ' ' + (w.dmg || ''));
      return q.every(t => heno.includes(t));
    });
  }

  function pintarListaArmas() {
    const host = document.getElementById('wiz_arm_list');
    if (!host) return;
    host.textContent = '';
    const lista = armasFiltradas();
    lista.forEach(([id, w]) => {
      const on = S.armas.includes(id);
      const lleno = !on && S.armas.length >= topeArmas();
      const card = tarjeta(w.name, w.dmg, w.notes || '', '', on, () => {
        if (on) S.armas = S.armas.filter(x => x !== id);
        else if (!lleno) S.armas.push(id);
        // Solo la lista y el pie: repintar el paso entero le quitaría el
        // foco al buscador y mandaría la vista arriba.
        pintarListaArmas();
        pintarChipsArmas();
        pie();
      });
      if (lleno) card.disabled = true;
      host.appendChild(card);
    });
    if (!lista.length) host.appendChild(el('p', 'wiz-hint',
      'Ninguna arma de tu competencia cumple esos filtros.'));
    const cuenta = document.getElementById('wiz_arm_count');
    if (cuenta) cuenta.textContent = `${lista.length} de ${armasPermitidas().length}`;
    const lbl = document.getElementById('wiz_arm_lbl');
    if (lbl) lbl.textContent = etiquetaArmas();
  }

  function etiquetaArmas() {
    const dos = S.armas.length === 1 && esSimple(app.DB.weapons[S.armas[0]]);
    return dos ? 'Arma — has elegido una simple, puedes llevar una segunda'
               : `Arma de tu competencia (${S.armas.length} de ${topeArmas()})`;
  }

  function pintarChipsArmas() {
    const host = document.getElementById('wiz_arm_chips');
    if (!host) return;
    host.textContent = '';
    const pool = armasPermitidas();
    // Un chip que no puede encontrar nada en tu competencia no se pinta:
    // al Sagaz no le sirve un «Marcial» que siempre da cero.
    FILTROS_ARMA.filter(tag => pool.some(([, w]) => tieneProp(w, tag)))
      .forEach(tag => {
        const on = S.armaF.includes(tag);
        const c = el('button', 'wiz-fchip' + (on ? ' on' : ''), tag);
        c.type = 'button';
        c.setAttribute('aria-pressed', String(on));
        c.onclick = () => {
          S.armaF = on ? S.armaF.filter(x => x !== tag) : S.armaF.concat(tag);
          pintarChipsArmas();
          pintarListaArmas();
        };
        host.appendChild(c);
      });
    if (S.armaF.length) {
      const q = el('button', 'wiz-fchip wiz-fchip--limpiar', 'Quitar filtros');
      q.type = 'button';
      q.onclick = () => { S.armaF = []; pintarChipsArmas(); pintarListaArmas(); };
      host.appendChild(q);
    }
  }

  function pasoEquipo(b) {
    const arq = app.DB.archetypes[S.arq] || {};
    b.appendChild(el('p', 'wiz-hint',
      'Con lo que sales por la puerta. El equipo pesado —Coraza, Placas, armas de fuego— se gana en juego, no en la creación.'));

    // 1 · Armas. Con buscador y filtros: la lista completa son 31 entradas
    //     y bajarla entera para comparar dos dagas no es elegir, es hojear.
    const lbl = el('span', 'wiz-lbl', etiquetaArmas());
    lbl.id = 'wiz_arm_lbl';
    b.appendChild(lbl);

    const busca = el('input');
    busca.type = 'search';
    busca.placeholder = 'Buscar arma por nombre o propiedad…';
    busca.value = S.armaQ; busca.className = 'wiz-buscar';
    busca.addEventListener('input', () => { S.armaQ = busca.value; pintarListaArmas(); });
    b.appendChild(busca);

    const chips = el('div', 'wiz-chips'); chips.id = 'wiz_arm_chips';
    b.appendChild(chips);
    const cuenta = el('span', 'wiz-cuenta'); cuenta.id = 'wiz_arm_count';
    b.appendChild(cuenta);
    const listaArm = el('div'); listaArm.id = 'wiz_arm_list';
    b.appendChild(listaArm);
    pintarChipsArmas();
    pintarListaArmas();

    // 2 · Armadura. Se nombra SIEMPRE, aunque el Arquetipo no dé a elegir:
    //     antes el Sagaz no veía la palabra «armadura» por ninguna parte y
    //     parecía que faltaba el control, cuando la regla es que no lleva.
    const eq = EQUIPO_ARQ[S.arq];
    const arm = el('div', 'wiz-sub');
    arm.appendChild(el('span', 'wiz-lbl', 'Armadura'));
    if (eq && eq.fijo.armors) {
      const a = app.DB.armors[eq.fijo.armors];
      arm.appendChild(tarjeta(a.name, 'Armadura ' + a.rd, a.notes || '',
        'Fija para tu Arquetipo — no se elige.', true, () => {}));
    }
    if (eq && eq.opciones.some(o => o.armor)) {
      eq.opciones.filter(o => o.armor).forEach(o => {
        const a = app.DB.armors[o.armor];
        arm.appendChild(tarjeta(a.name, 'Armadura ' + a.rd, a.notes || '', '',
          S.opcArq === o.v, () => { S.opcArq = o.v; S.armaExtra = ''; pintar(); }));
      });
    }
    if (!eq || (!eq.fijo.armors && !eq.opciones.some(o => o.armor))) {
      arm.appendChild(el('p', 'wiz-hint',
        (arq.name || 'Tu Arquetipo') + ' no tiene competencia con armadura y empieza sin ella. '
        + 'Podrás llevarla más adelante con los Talentos que la otorguen.'));
    }
    if (eq && eq.fijo.shields) {
      const s = app.DB.shields[eq.fijo.shields];
      arm.appendChild(el('span', 'wiz-lbl', 'Escudo'));
      arm.appendChild(tarjeta(s.name, '+' + s.guardia + ' Guardia', s.notes || '',
        'Incluido para tu Arquetipo.', true, () => {}));
    }
    b.appendChild(arm);

    // 3 · Elección propia del Arquetipo que no sea de armadura
    if (eq && eq.opciones.some(o => !o.armor)) {
      const sub = el('div', 'wiz-sub');
      sub.appendChild(el('span', 'wiz-lbl', eq.etiqueta));
      // Las de armadura ya se han pintado arriba, en su propio bloque.
      eq.opciones.filter(o => !o.armor).forEach(o => {
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
        if (EQUIPO_ARQ[S.arq] && !S.opcArq) {
          // El aviso nombra lo que falta de verdad: al Audaz le falta la
          // armadura, no «el equipo de tu Arquetipo».
          const soloArmadura = EQUIPO_ARQ[S.arq].opciones.every(o => o.armor);
          return soloArmadura ? 'Elige tu armadura' : 'Elige ' + EQUIPO_ARQ[S.arq].etiqueta.toLowerCase();
        }
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
  /** `completo` = se ha terminado el asistente: la ficha se cierra en modo
      resumen. Si se sale «a mano» a medias, se vuelca lo mismo pero las
      secciones quedan ABIERTAS, que es justo lo que se ha pedido al salir:
      seguir rellenando a mano. */
  function volcar(completo) {
    app.newCharManual();                       // ficha limpia y en edición

    // Sin nada repartido no se toca: dejar ochos por todas partes sería
    // peor que el estado inicial de una ficha nueva.
    if (Object.keys(S.asign).length) ATTRS.forEach(k => {
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
        // Copia de los datos de juego, no referencia a la entrada de la base
        // (mismo criterio que addFromDB).
        type: cat === 'shields' ? 'shields' : cat, dbKey: key, dbData: { ...data },
      };
      app.inventory.push(item);
      return item;
    };
    // Solo si se llegó al paso de Equipo: a quien se sale en el Arquetipo
    // no se le mete en la mochila un macuto que no ha visto.
    const hayEquipo = S.paso >= 6;
    const armasItems = hayEquipo ? S.armas.map(k => meter('weapons', k)).filter(Boolean) : [];
    const eq = hayEquipo ? EQUIPO_ARQ[S.arq] : null;
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
    if (hayEquipo) {
      PAQUETE.forEach(k => meter('misc', k));
      app.inventory.push({ uid: app._nextUid(), name: 'Ropa de viaje', slots: 1, type: 'misc' });
      app.gold = S.monedas || 0;
    }

    app.renderInventory();
    app.syncCombatOptions();
    if (armasItems[0]) set('sel_weapon', armasItems[0].uid);
    if (armasItems[1]) set('sel_weapon_sec', armasItems[1].uid);
    if (armorItem)  set('sel_armor',  armorItem.uid);
    if (shieldItem) set('sel_shield', shieldItem.uid);
    app.onWeaponChange && app.onWeaponChange('w1');

    set('char_name', S.nombre.trim());
    if (S.alineamiento) { app.alignment = S.alineamiento; app._syncAlignmentUI(); }
    // El retrato se reaplica DESPUÉS de newCharManual, que lo devolvió al
    // marcador por defecto al limpiar la ficha.
    if (S.retrato) app._syncPortrait(S.retrato);
    app.updateOptions(false);                  // refleja habilidades y Pericias
    app.calc();
    /* Un personaje recién creado empieza entero. calc() deja los máximos,
       pero los actuales se quedaban en el 0 con el que newCharManual() limpia
       la ficha, así que salía del asistente inconsciente. Se rellenan DESPUÉS
       de calc(), que es cuando los máximos ya están escritos. */
    [['cur_pv','max_pv'], ['cur_adr','max_adr'], ['cur_ing','max_ing']]
      .forEach(([cur, max]) => {
        const c = $(cur), m = $(max);
        if (c && m) c.value = parseInt(m.textContent, 10) || 0;
      });
    app._updateResBars && app._updateResBars();
    app.showTalentSummary(); app.updateTalentCount();
    app.buildDetailPage && app.buildDetailPage();
    if (completo) {
      // «personal» no está en confirmSection: tiene su propio confirmPersonal,
      // y sin él la ficha quedaba cerrada pero con el nombre sin pintar.
      app.confirmPersonal();
      ['identity','stats','saves','skills','guard','combat','equipment']
        .forEach(x => app.confirmSection(x));
    }
    cerrar();
    app.goToPage(0);
    if (completo) {
      app.toast(`${S.nombre.trim()} listo — revisa la ficha y guarda`, 'ok');
    } else {
      const hechos = PASOS.filter((_, i) => i < S.paso).length;
      app.toast(hechos
        ? `A mano — conservados los ${hechos} primeros pasos; sigue en la ficha`
        : 'A mano — ficha en blanco', 'ok');
    }
  }

  const crear = () => volcar(true);

  /* ══════════════════════════════════════════════════════════════
     Personaje aleatorio.
     No se sortea sobre la ficha: se rellena el MISMO borrador `S` que
     rellenaría una persona y se vuelca con volcar(). Así el aleatorio pasa
     por los mismos filtros que el asistente —competencia de arma según el
     Arquetipo, requisitos de Talento evaluados con app._parseTalentReq,
     elecciones de Linaje, tope de armas— en vez de tener su propia idea de
     qué es legal. Si el asistente no te deja tomar algo, el dado tampoco.
  ══════════════════════════════════════════════════════════════ */
  const NOMBRES = ['Aldric','Bryna','Castan','Delara','Elowen','Fendrel','Gwyn',
    'Hadria','Iskar','Jalinda','Kestrel','Lyara','Morden','Nyla','Oswin','Petra',
    'Quillon','Ressa','Solen','Tindra','Ulvar','Vessa','Wren','Xera','Ylan','Zora'];

  const CONVICCIONES = ['Legal Bueno','Neutral Bueno','Caótico Bueno',
    'Legal Neutral','Neutral','Caótico Neutral',
    'Legal Maligno','Neutral Maligno','Caótico Maligno'];

  /** Atributo de cada Fuente, para no dejar a un lanzador con su Fuente en 8. */
  const ATTR_FUENTE = { 'Erudición':'INT', 'Psiónica':'INT', 'Divinidad':'SAB',
    'Naturaleza':'SAB', 'Pacto':'CAR', 'Herencia':'CAR', 'Juramento':'CAR' };

  /** Orden en que cada Arquetipo quiere sus puntuaciones. */
  const PRIORIDAD = {
    audaz: ['FUE','CON','DES','SAB','CAR','INT'],
    sutil: ['DES','CON','CAR','SAB','INT','FUE'],
    sagaz: ['INT','DES','CON','SAB','CAR','FUE'],
  };

  const azar = a => a[Math.floor(Math.random() * a.length)];
  const barajar = a => a.slice().sort(() => Math.random() - .5);

  function aleatorio() {
    S = nuevoEstado();

    // 1 · Arquetipo y Linaje primero: mandan sobre el reparto de atributos.
    S.arq = azar(Object.keys(app.DB.archetypes));  S.arqUlt = S.arq;
    S.desc = azar(Object.keys(app.DB.descriptors)); S.descUlt = S.desc;
    const d = app.DB.descriptors[S.desc];
    const a = app.DB.archetypes[S.arq];

    // 2 · Elecciones del Linaje. Las Expresiones van ANTES del reparto porque
    //     una de ellas puede abrir Fuente (el Mutante).
    const g = grupoEleccion(d);
    if (g) {
      const trozos = barajar(g.opciones.split(' / ').map(o => o.trim()));
      S.descExps = trozos.slice(0, g.n).map(t => t.split(' (')[0].trim());
    }

    // 3 · Atributos: método A, repartidos por prioridad del Arquetipo con la
    //     Fuente colada en segundo lugar si el Linaje abre una.
    const pool = poolInicial('A');                    // ya viene de mayor a menor
    const orden = (PRIORIDAD[S.arq] || ATTRS).slice();
    const fu = ATTR_FUENTE[fuenteAfinidad()];
    if (fu) { const i = orden.indexOf(fu); if (i > 1) { orden.splice(i, 1); orden.splice(1, 0, fu); } }
    orden.forEach((k, i) => { S.asign[k] = pool[i]; });

    // 4 · Bono de atributo del Linaje: al que ya va primero, respetando
    //     `distinct` cuando el Linaje pide dos distintos.
    if (d.pick) {
      const n = d.pick.n || 1;
      const origen = d.pick.from || ATTRS;
      const cola = orden.filter(k => origen.includes(k));
      S.descPick = [];
      for (let i = 0; i < n; i++) {
        const libre = cola.length ? cola[0] : origen[0];
        S.descPick.push(libre);
        if (d.pick.distinct) cola.shift();
      }
    }

    // 5 · Truco de la Fuente que abra la Afinidad. El campo guarda el NOMBRE
    //     y el desplegable del paso ofrece `type === 'trick'`: se usa el mismo
    //     criterio, o el valor no casaría con ninguna opción. Hoy los 24
    //     Trucos son un fondo común (`source: "Trucos"`), así que la rama de
    //     preferencia no llega a activarse y se sortea sobre todos, igual que
    //     el desplegable; queda escrita por si el Catálogo los reparte por
    //     Fuente más adelante.
    const fuente = fuenteAfinidad();
    if (fuente) {
      const todos = Object.values(app.DB.spells || {}).filter(x => x.type === 'trick');
      const propios = todos.filter(x =>
        app._normSource(x.source || '') === app._normSource(fuente));
      const lista = propios.length ? propios : todos;
      if (lista.length) S.descTruco = azar(lista).name;
    }

    // 6 · Habilidades
    S.arqSkills = barajar(a.skills || []).slice(0, a.skills_count || 2);
    S.bg = azar(Object.keys(app.DB.backgrounds)); S.bgUlt = S.bg;
    S.bgSkills = barajar(app.DB.backgrounds[S.bg].skills || []).slice(0, 2);

    // 7 · Talentos: uno a uno y RE-EVALUANDO, porque tomar una Iniciación abre
    //     los Talentos que la exigen. Sortear los tres de golpe daba fichas
    //     con requisitos sin cumplir.
    S.talentos = [];
    for (let i = 0; i < 3; i++) {
      const posibles = [];
      conContexto(() => {
        Object.values(app.DB.talents).forEach(arr => arr.forEach(t => {
          if (S.talentos.some(x => x.name === t.name)) return;
          if (app._parseTalentReq(t.req).met) posibles.push(t);
        }));
      });
      if (!posibles.length) break;
      const t = azar(posibles);
      S.talentos.push({ name: t.name, id: t.id || '', desc: t.desc || '' });
    }

    // 8 · Salvaciones y Guardia. La Guardia no se sortea: se toma el mejor de
    //     los tres elegibles, que es lo que haría cualquiera al construir.
    S.savCom = azar(SAV_COMUN);
    S.savPoco = azar(SAV_POCO);
    S.guardAttr = GUARD_ATTR.slice().sort((x, y) => total(y) - total(x))[0];
    S.nombre = azar(NOMBRES);
    S.alineamiento = azar(CONVICCIONES);

    // 9 · Equipo. armasPermitidas() ya filtra por competencia del Arquetipo;
    //     aquí se añade el requisito de FUE del arma, que el Audaz ignora.
    const fuerza = total('FUE');
    const puede = w => a.ignoresGearReq || !w.req_FUE || fuerza >= w.req_FUE;
    const pool2 = barajar(armasPermitidas().filter(par => puede(par[1])));
    S.armas = [];
    if (pool2.length) {
      S.armas.push(pool2[0][0]);
      // El tope depende de si la primera es simple: se consulta, no se asume.
      if (topeArmas() > 1 && pool2[1]) S.armas.push(pool2[1][0]);
    }
    const eq = EQUIPO_ARQ[S.arq];
    if (eq && eq.opciones.length) {
      const o = azar(eq.opciones);
      S.opcArq = o.v;
      if (o.armaLigera) {
        const ligeras = Object.entries(app.DB.weapons)
          .filter(par => par[0] !== 'desarmado' && esLigera(par[1]) && puede(par[1]));
        if (ligeras.length) S.armaExtra = azar(ligeras)[0];
      }
    }
    let m = 0; const nd = MONEDAS[S.arq] || 3;
    for (let i = 0; i < nd; i++) m += d6();
    S.monedas = m * 10;

    // 10 · Antes de volcar se pasa por queFalta() paso a paso: el mismo juez
    //      que decide si el botón Continuar se enciende. Si algo no cuadra no
    //      se crea a medias — se abre el asistente donde falla, ya relleno.
    let falla = -1, motivo = '';
    for (let i = 0; i <= ULTIMO; i++) {
      S.paso = i;
      const f = queFalta();
      if (f) { falla = i; motivo = f; break; }
    }
    if (falla >= 0) {
      S.paso = falla;
      abrirConEstado();
      app.toast('Aleatorio incompleto — ' + motivo, 'info');
      return;
    }
    S.paso = ULTIMO;
    volcar(true);
  }

  /** Abre el panel sin reiniciar `S`, que es lo que hace abrir(). */
  function abrirConEstado() {
    const p = $('wiz_panel');
    p.classList.add('fs-open');
    document.body.style.overflow = 'hidden';
    pintar();
  }

  app.personajeAleatorio = aleatorio;

  /** Salida de emergencia a media creación: lo diligenciado se queda. */
  function pasarAMano() {
    volcar(false);
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
  $('wiz_manual').onclick = () => pasarAMano();
  const _dado = $('wiz_dado');
  if (_dado) _dado.onclick = () => aleatorio();

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
