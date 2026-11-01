/* ══════════════════════════════════════════════════════════════
   Autodiagnóstico.
   Se carga siempre pero NO hace nada salvo que la URL lleve `?check=1`.
   Sirve para responder en el móvil, antes de una partida, a la única
   pregunta que importa tras actualizar: ¿esta versión está sana?

   Las comprobaciones no son decorativas: cada una corresponde a algo que
   se rompió de verdad durante el desarrollo y que se descubrió tarde.

     · Guardia y PV contra su fórmula      — se falseaban con «Otro Bono»
     · Texto que se sale de su caja        — los rótulos de la Guardia
     · Texto por debajo de 12 px           — el suelo tipográfico de v55.2
     · Ids que el JS busca y no existen    — al mover marcado de sitio
     · Desbordamiento horizontal del cuerpo
     · Errores de consola durante la pasada

   No toca ningún personaje guardado: monta uno de prueba en memoria y al
   terminar deja la app en la pantalla de Inicio.
══════════════════════════════════════════════════════════════ */
(function () {
  const PARAM = new URLSearchParams(location.search);
  if (PARAM.get('check') !== '1') return;

  const $ = id => document.getElementById(id);
  const esperar = ms => new Promise(r => setTimeout(r, ms));
  const num = t => parseInt(t, 10) || 0;

  /* Los errores de consola se recogen desde el principio: si la pasada
     los provoca, el informe tiene que verlos. */
  const errores = [];
  const _error = console.error;
  console.error = function (...a) { errores.push(a.join(' ').slice(0, 120)); return _error.apply(this, a); };
  addEventListener('error', e => errores.push(String(e.message).slice(0, 120)));

  const pruebas = [];
  const comprobar = (nombre, ok, detalle) => pruebas.push({ nombre, ok: !!ok, detalle: detalle || '' });

  /** Texto más ancho que su caja. Descuenta dos falsos positivos conocidos:
      lo truncado a propósito con ellipsis y los pseudoelementos absolutos
      que dan área táctil —los ± de Estado inflan scrollWidth sin que su
      texto se salga—. */
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

  /** Ids que el código pide con getElementById y no existen en el documento.
      Se mira solo la lista fija de los que la ficha necesita para calcular:
      buscarlos todos exigiría analizar el JS, y eso no es trabajo de tiempo
      de ejecución. */
  const IDS_CRITICOS = [
    'base_FUE','base_DES','base_CON','base_INT','base_SAB','base_CAR',
    'max_pv','cur_pv','max_adr','cur_adr','max_ing','cur_ing','res_carne','cur_carne',
    'guard_total_live','guard_base_val','guard_prof_val','guard_shield_val',
    'guard_attr_val','guard_attr2_val','sel_guard_attr','sel_guard_attr2','sel_guard_magic',
    'sel_guard_other','sel_desc','sel_arq','sel_bg','char_name','char_lvl','char_xp',
    'res_carga','rac_cur','rest_list','traits_list','detail_desc_title','detail_arq_title',
  ];

  async function correr() {
    const t0 = performance.now();
    // ── personaje de prueba, en memoria ──
    app.asistenteActivo = false;
    app.newChar();
    await esperar(600);
    const set = (id, v) => { const e = $(id); if (e) { e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); } };
    set('sel_desc', 'elfo'); await esperar(250);
    set('sel_arq', 'sagaz'); set('sel_bg', 'erudito'); await esperar(450);
    ['FUE','DES','CON','INT','SAB','CAR'].forEach((k, i) => {
      const e = $('base_' + k);
      if (e) { e.value = [10, 14, 15, 17, 12, 8][i]; e.dispatchEvent(new Event('input', { bubbles: true })); }
    });
    await esperar(500);
    set('sel_guard_attr', 'DES'); set('sel_guard_attr2', 'SAB');
    set('sel_guard_magic', '1'); set('sel_guard_other', '0');
    await esperar(500);
    app.calc();
    await esperar(400);

    // ── 1 · ids críticos ──
    const faltan = IDS_CRITICOS.filter(i => !$(i));
    comprobar('Los elementos que la ficha necesita existen', !faltan.length,
      faltan.length ? 'faltan: ' + faltan.join(', ') : IDS_CRITICOS.length + ' comprobados');

    // ── 2 · Guardia contra su fórmula ──
    const mods = app._finalMods || {};
    const pb = num($('res_pb')?.textContent) || num($('guard_prof_val')?.textContent);
    const esperada = 10 + pb + num($('guard_shield_val')?.textContent) +
      (mods.DES || 0) + (mods.SAB || 0) + 1;
    const real = num($('guard_total_live').textContent);
    comprobar('Guardia = 10 + PB + escudo + atributos + bonos', esperada === real,
      `esperada ${esperada}, muestra ${real}`);

    // ── 3 · Carne = puntuación completa de CON ──
    const con = app._statFinal('CON').final;
    comprobar('Carne = puntuación de CON', num($('res_carne').textContent) === con,
      `CON ${con}, Carne ${$('res_carne').textContent}`);

    // ── 4 · PV = base del Arquetipo + puntuación CON ──
    const pvBase = (app.DB.archetypes?.[$('sel_arq').value]?.pv) || 0;
    const nivel = num($('char_lvl').value) || 1;
    const pvReal = num($('max_pv').textContent);
    comprobar('PV incluyen la base del Arquetipo y CON', pvReal >= pvBase + con - 2,
      `base ${pvBase} + CON ${con} · nivel ${nivel} → ${pvReal}`);

    // ── 5 · recorrido visual de las cinco páginas ──
    const nombres = ['Perfil','Stats','Aptitudes','Equipo','Detalle'];
    const desbordes = [], pequenos = [];
    for (let p = 0; p < 5; p++) {
      app.goToPage(p);
      await esperar(380);
      const pag = document.querySelectorAll('.page')[p];
      textoDesbordado(pag).forEach(x => desbordes.push(nombres[p] + ' · ' + x));
      textoPequeno(pag).forEach(x => pequenos.push(nombres[p] + ' · ' + x));
      pag.scrollTop = 0;
    }
    comprobar('Ningún texto se sale de su caja', !desbordes.length,
      desbordes.slice(0, 4).join(' | ') || '5 páginas revisadas');
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

    pintar(Math.round(performance.now() - t0));
    app.showScreen('home');
  }

  function pintar(ms) {
    const fallan = pruebas.filter(p => !p.ok);
    const caja = document.createElement('div');
    /* id propio y no role="status": ese rol ya lo usa el contenedor de
       avisos de la app, y buscarlo devolvía el toast en vez del informe. */
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
    sub.textContent = `${app._appVersion || ''} · ${ms} ms`;
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
    // Tras el arranque completo, para no medir una app a medio montar.
    setTimeout(() => correr().catch(e => {
      errores.push('la pasada se interrumpió: ' + e.message);
      comprobar('El autodiagnóstico llega hasta el final', false, e.message);
      pintar(0);
    }), 900);
    return r;
  };
})();
