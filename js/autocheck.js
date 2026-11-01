/* ══════════════════════════════════════════════════════════════
   Autodiagnóstico (heredado de S&S Companion).
   Se carga siempre pero NO hace nada salvo que la URL lleve `?check=1`.
   Sirve para responder en el móvil, antes de una partida, a la única
   pregunta que importa tras actualizar: ¿esta versión está sana?

     · Los elementos que la ficha y la Mesa necesitan existen
     · El bestiario (Manual y Guía) sale de las fórmulas: atributos, PV,
       Guardia, ataque, daño, CD, Iniciativa y Moral impresos
     · El NA de encuentro de cada criatura es el de su línea «Encuentro»
     · NA del encuentro: los ejemplos de la Guía; jefe +3/+4; cuatro esbirros
     · Dificultad del encuentro por nivel y tamaño del grupo
     · Texto que se sale de su caja · texto por debajo de 12 px
     · Desbordamiento horizontal · tarjetas plegables · consola

   No toca nada guardado: monta una amenaza del bestiario en memoria y al
   terminar deja la app en la pantalla de Inicio.

   OJO al leer el resultado: «texto que se sale» da falsos positivos si
   el panel del navegador está oculto o no tiene el ancho del móvil. Fija
   el tamaño de la ventana antes de lanzarlo.
══════════════════════════════════════════════════════════════ */
(function () {
  const PARAM = new URLSearchParams(location.search);
  if (PARAM.get('check') !== '1') return;

  const $ = id => document.getElementById(id);
  const esperar = ms => new Promise(r => setTimeout(r, ms));

  const errores = [];
  const _error = console.error;
  console.error = function (...a) { errores.push(a.join(' ').slice(0, 120)); return _error.apply(this, a); };
  addEventListener('error', e => errores.push(String(e.message).slice(0, 120)));

  const pruebas = [];
  const comprobar = (nombre, ok, detalle) => pruebas.push({ nombre, ok: !!ok, detalle: detalle || '' });

  /** Texto más ancho que su caja. Descuenta dos falsos positivos conocidos:
      lo truncado a propósito con ellipsis y los pseudoelementos absolutos
      que dan área táctil. */
  function textoDesbordado(raiz) {
    const malos = [];
    (raiz || document).querySelectorAll('*').forEach(e => {
      if (!e.offsetParent || !e.textContent.trim() || e.children.length) return;
      const c = getComputedStyle(e);
      if (c.textOverflow === 'ellipsis' || /auto|scroll/.test(c.overflowX)) return;
      if (e.scrollWidth - e.clientWidth <= 1) return;
      const b = getComputedStyle(e, '::before'), a = getComputedStyle(e, '::after');
      if ((b.content !== 'none' && b.position === 'absolute') ||
          (a.content !== 'none' && a.position === 'absolute')) {
        const s = document.createElement('span');
        s.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font:${c.font};letter-spacing:${c.letterSpacing}`;
        s.textContent = e.textContent.trim();
        document.body.appendChild(s);
        const ancho = Math.ceil(s.getBoundingClientRect().width);
        s.remove();
        if (ancho <= e.clientWidth + 1) return;
      }
      malos.push(`${(e.className || e.tagName).toString().split(' ')[0]}: «${e.textContent.trim().slice(0, 18)}»`);
    });
    return malos;
  }

  function textoPequeno(raiz) {
    const malos = new Set();
    (raiz || document).querySelectorAll('*').forEach(e => {
      if (!e.offsetParent || !e.textContent.trim() || e.children.length) return;
      const px = parseFloat(getComputedStyle(e).fontSize);
      if (px < 12) malos.add(`${(e.className || e.tagName).toString().split(' ')[0]} ${px}px`);
    });
    return [...malos];
  }

  const IDS_CRITICOS = [
    'home-roster', 'char_name', 'char_concept', 'char_img', 'char_img_summary', 'cur_pv', 'max_pv', 'res_fill_pv',
    'id_fila', 'stats_summary_view', 'stats_edit_view', 'defensa_summary_view', 'defensa_edit_view', 'attack_summary_view', 'saves_summary_view', 'rasgos_list',
    'peso_bar', 'peso_txt', 'senal_summary_view', 'revision_list', 'char_notes', 'rest_list',
    'grupo_body', 'encuentro_body', 'combate_body', 'botin_body', 'objeto_body', 'tesoro_body',
    'tiradas_body', 'zonas_body', 'peligros_body', 'facciones_body', 'conflicto_body', 'turno_body',
    'lib_panel', 'lib_list', 'sel_panel', 'wiz_panel', 'db_panel', 'settings_modal', 'crop_modal', 'dice-overlay',
  ];

  async function correr() {
    const t0 = performance.now();

    // ── 1 · ids críticos ──
    const faltan = IDS_CRITICOS.filter(i => !$(i));
    comprobar('Los elementos que la app necesita existen', !faltan.length,
      faltan.length ? 'faltan: ' + faltan.join(', ') : IDS_CRITICOS.length + ' comprobados');

    // ── 2 · el bestiario sale de las fórmulas (Manual de Monstruos, Cap. 1) ──
    const B = DEFAULT_DB.bestiario;
    const DBprev = app.DB;
    app.DB = structuredClone(DEFAULT_DB); app._libCache = null;   // reglas de fábrica para la pasada
    const malos = [], malPeso = [];
    let n = 0;
    Object.values(B).forEach(c => {
      const imp = c.impreso; if (!imp) return;
      n++;
      const S = app.calcCr(app.normalizarCr(c));
      // La Guardia impresa no lleva los Rasgos (Evasiva, Formación…); la calculada, sí.
      const gSinRasgos = S.calc.guardia - S.infos.reduce((a, x) => a + ((x.i.mod && x.i.mod.g) || 0), 0);
      const dif = [];
      app.ATTRS.forEach(a => { if (S.mod[a] !== imp.attrs[a]) dif.push(`${a} ${S.mod[a]}/${imp.attrs[a]}`); });
      [['PV', S.calc.pv, imp.pv], ['Guardia', S.aMano.includes('guardia') ? S.guardia : gSinRasgos, imp.g], ['Ataque', S.aMano.includes('ataque') ? S.ataque : S.calc.ataque, imp.atk], ['Daño', S.aMano.includes('dano') ? S.dano : S.calc.dano, imp.dano],
       ['CD', S.cd, imp.cd], ['Iniciativa', S.calc.ini, imp.ini],
       // Armadura y velocidad: con lo que suman los Rasgos (Piel Gruesa, Lenta) y el equipo
       ['Armadura', S.armadura, imp.a], ['Velocidad', S.vel, imp.vel]].forEach(([k, sale, debe]) => { if (sale !== debe) dif.push(`${k} ${sale}/${debe}`); });
      if (imp.moral == null ? !S.noMoral : (S.noMoral || S.calc.moral !== imp.moral)) dif.push(`Moral ${S.noMoral ? '—' : S.calc.moral}/${imp.moral == null ? '—' : imp.moral}`);
      if (dif.length) malos.push(`${c.nombre}: ${dif.join(', ')}`);
      // Su línea «Encuentro» (o su NA, si no la lleva): Potencial, jefe, área, tamaño y Axiomas
      if (imp.enc != null && S.naEnc !== imp.enc) malPeso.push(`${c.nombre}: NA ${S.naEnc}/${imp.enc} (Potencial ${S.pesoGastado}/${S.pesoMax})`);
    });
    comprobar('El bestiario sale de las fórmulas: atributos, PV, Guardia, ataque, daño, CD', !malos.length,
      malos.slice(0, 3).join(' | ') || `${n} criaturas del Manual y la Guía coinciden con lo impreso`);
    comprobar('Su NA de encuentro es el de su línea «Encuentro»: Potencial, jefe, área, tamaño', !malPeso.length,
      malPeso.slice(0, 4).join(' | ') || `${n} criaturas, con sus Rasgos de especie y su exceso de Potencial`);

    // ── 3 · NA del encuentro (Manual de Monstruos, Cap. 4, y los ejemplos de la Guía) ──
    const base = app.nuevaCr();
    const lin = (cambios, cuantas) => {
      const S = app.calcCr(app.normalizarCr({ ...base, rasgos: [], ...cambios }));
      return { na: S.naEnc, cuenta: S.cuenta * cuantas };
    };
    const enc = (...lineas) => app._naDeLineas(lineas).na;
    const E = {
      'ogro + lobo alfa': [enc(lin({ na: 4 }, 1), lin({ na: 2 }, 1)), 6],
      'ogro + 2 lobos alfa': [enc(lin({ na: 4 }, 1), lin({ na: 2 }, 2)), 7],
      '2×NA0': [enc(lin({ na: 0 }, 2)), 3],
      '2×NA1': [enc(lin({ na: 1 }, 2)), 4],
      '4×NA1': [enc(lin({ na: 1 }, 4)), 7],
      '4×NA5': [enc(lin({ na: 5 }, 4)), 11],
      '2×NA9': [enc(lin({ na: 9 }, 2)), 12],
      '2×NA10': [enc(lin({ na: 10 }, 2)), 13],
      'jefe NA3': [enc(lin({ na: 3, estructura: 'jefe' }, 1)), 6],
      'jefe NA6': [enc(lin({ na: 6, estructura: 'jefe' }, 1)), 10],
      'Enorme NA5': [enc(lin({ na: 5, tam: 'enorme' }, 1)), 6],
      '4 esbirros NA2': [enc(lin({ na: 2, rol: 'esbirro' }, 4)), 2],
      'grupo de 6 NA1': [enc(lin({ na: 1, estructura: 'horda', miembros: 6 }, 1)), 3],
      'NA6 + 6×NA1': [enc(lin({ na: 6 }, 1), lin({ na: 1 }, 6)), 6],
    };
    const malEnc = Object.entries(E).filter(([, [sale, debe]]) => sale !== debe);
    comprobar('NA del encuentro: 1 · ½ · ¼ según la distancia, jefe +3/+4, cuatro esbirros = uno', !malEnc.length,
      malEnc.map(([k, [sale, debe]]) => `${k}: NA ${sale}, debía ser ${debe}`).join(' | ') ||
      Object.entries(E).slice(0, 5).map(([k, [sale]]) => `${k} → NA ${sale}`).join(' · '));

    // ── 4 · dificultad por nivel y tamaño del grupo ──
    const gPrev = { ...app.mesa.grupo };
    app.mesa.grupo = { nivel: 3, pjs: 4 }; const p4 = app.umbrales();
    app.mesa.grupo = { nivel: 3, pjs: 6 }; const p6 = app.umbrales();
    app.mesa.grupo = { nivel: 9, pjs: 2 }; const p2 = app.umbrales();
    app.mesa.grupo = gPrev;
    comprobar('Dificultad por nivel y tamaño del grupo',
      p4.f === 4 && p4.e === 5 && p4.p === 7 && p4.m === 8 && p6.p === 8 && p2.p === 11 &&
      app._dificultad(7, p4).k === 'p' && app._dificultad(8, p4).k === 'm' && app._dificultad(3, p4).k === 't',
      `Nv 3 ×4: NA ${p4.f}/${p4.e}/${p4.p}/${p4.m}+ · ×6 Peligroso NA ${p6.p} · Nv 9 ×2 Peligroso NA ${p2.p}`);

    // ── 5 · recorrido visual: la ficha y la Mesa ──
    app.asistenteActivo = false;
    app._abrirFicha(structuredClone(B.tejedora_del_techo), '');
    await esperar(500);
    const desbordes = [], pequenos = [];
    const recorrer = async (nombres) => {
      const pags = app._paginas();
      for (let p = 0; p < pags.length; p++) {
        app.goToPage(p);
        await esperar(380);
        textoDesbordado(pags[p]).forEach(x => desbordes.push(nombres[p] + ' · ' + x));
        textoPequeno(pags[p]).forEach(x => pequenos.push(nombres[p] + ' · ' + x));
        pags[p].scrollTop = 0;
      }
    };
    await recorrer(['Perfil', 'Combate', 'Rasgos', 'Notas']);
    // Las vistas de edición también cuentan
    ['identity', 'stats', 'defensa', 'attack', 'saves', 'senal'].forEach(s => app.editSection(s));
    await esperar(200);
    await recorrer(['Perfil (edición)', 'Combate (edición)', 'Rasgos', 'Notas (edición)']);
    app.limpiarFicha();
    app.abrirMesa();
    await esperar(400);
    await recorrer(['Encuentro', 'Botín', 'Zonas', 'Facciones']);
    comprobar('Ningún texto se sale de su caja', !desbordes.length,
      desbordes.slice(0, 4).join(' | ') || '12 páginas revisadas');
    comprobar('Ningún texto por debajo de 12 px', !pequenos.length,
      pequenos.slice(0, 4).join(' | ') || 'suelo tipográfico respetado');

    // ── 6 · la página no se desplaza en horizontal ──
    comprobar('Sin desbordamiento horizontal',
      document.documentElement.scrollWidth <= innerWidth,
      `${document.documentElement.scrollWidth} vs ${innerWidth}`);

    // ── 7 · las tarjetas plegables responden ──
    const folds = [...document.querySelectorAll('.panel.fold[data-fold]')];
    let plegables = 0;
    folds.forEach(d => { const abierto = d.open; d.open = !abierto; if (d.open !== abierto) plegables++; d.open = abierto; });
    comprobar('Las tarjetas plegables abren y cierran', plegables === folds.length,
      `${plegables} de ${folds.length}`);

    // ── 8 · consola ──
    comprobar('Sin errores de consola', !errores.length,
      errores.slice(0, 3).join(' | ') || 'ninguno');

    app.DB = DBprev; app._libCache = null;
    pintar(Math.round(performance.now() - t0));
    app.showScreen('home');
  }

  function pintar(ms) {
    const fallan = pruebas.filter(p => !p.ok);
    const caja = document.createElement('div');
    caja.id = 'autocheck_report';
    caja.style.cssText = `position:fixed;inset:0;z-index:9999;overflow:auto;
      background:var(--deep,#0a0810);color:var(--text,#cfc0e4);
      font-family:var(--fb,Georgia,serif);padding:22px 18px 40px`;
    const h = document.createElement('div');
    h.style.cssText = `font-family:var(--fd,Georgia,serif);font-size:21px;letter-spacing:.06em;
      color:${fallan.length ? '#e07a88' : '#5cb684'};margin-bottom:4px`;
    h.textContent = fallan.length ? `${fallan.length} de ${pruebas.length} fallan` : `Todo en orden · ${pruebas.length} comprobaciones`;
    const sub = document.createElement('div');
    sub.style.cssText = 'font-family:var(--fm,monospace);font-size:12px;color:var(--muted,#8c7ea1);margin-bottom:18px';
    sub.textContent = `${STORAGE.RULES_DATA_VERSION} · ${innerWidth}×${innerHeight} · ${ms} ms`;
    caja.append(h, sub);
    pruebas.forEach(p => {
      const f = document.createElement('div');
      f.style.cssText = `display:flex;gap:10px;align-items:flex-start;padding:10px 0;
        border-top:1px solid rgba(61,50,84,.5)`;
      const marca = document.createElement('span');
      marca.style.cssText = `font-family:var(--fm,monospace);font-weight:700;flex:0 0 auto;
        color:${p.ok ? '#5cb684' : '#e07a88'}`;
      marca.textContent = p.ok ? '✓' : '✕';
      const cuerpo = document.createElement('div');
      cuerpo.style.cssText = 'min-width:0;flex-grow:1';
      const n = document.createElement('div');
      n.style.cssText = 'font-size:15px;line-height:1.4';
      n.textContent = p.nombre;
      const d = document.createElement('div');
      d.style.cssText = 'font-family:var(--fm,monospace);font-size:12px;color:var(--muted,#8c7ea1);margin-top:3px;word-break:break-word';
      d.textContent = p.detalle;
      cuerpo.append(n, d);
      f.append(marca, cuerpo);
      caja.appendChild(f);
    });
    const salir = document.createElement('button');
    salir.textContent = 'Volver a la app';
    salir.style.cssText = `margin-top:22px;width:100%;min-height:52px;border-radius:10px;
      background:var(--gold,#c9aa6f);border:none;color:var(--deep,#0a0810);
      font-family:var(--fd,Georgia,serif);font-size:14px;letter-spacing:.12em;
      text-transform:uppercase;cursor:pointer`;
    salir.onclick = () => { location.search = ''; };
    caja.appendChild(salir);
    document.body.appendChild(caja);
  }

  const _init = app.init;
  app.init = function () {
    const r = _init.apply(this, arguments);
    setTimeout(() => correr().catch(e => {
      errores.push('la pasada se interrumpió: ' + e.message);
      comprobar('El autodiagnóstico llega hasta el final', false, e.message);
      pintar(0);
    }), 900);
    return r;
  };
})();
