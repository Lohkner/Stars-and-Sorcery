/* ══════════════════════════════════════════════════════════════
   Tarjetas plegables (heredado de S&S Companion).
   Van ABIERTAS por defecto. El estado se guarda en localStorage y no en
   la amenaza: plegar una tarjeta es una preferencia de quien dirige en
   esa mesa, no un dato de la ficha, así que no viaja en el JSON ni marca
   la amenaza como no guardada.

   Algunas muestran plegadas un resumen de una línea con lo esencial,
   para que plegar no signifique perder el dato de vista. Basta con NO
   darles entrada en RESUMEN para que su cabecera enseñe solo el título.
══════════════════════════════════════════════════════════════ */
(function () {
  const CLAVE = 'ssd_folds';
  const $ = id => document.getElementById(id);
  const txt = (id, def = '—') => $(id)?.textContent?.trim() || def;
  const val = (id, def = '—') => $(id)?.value?.trim() || def;

  function leerPrefs() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; }
    catch (e) { return {}; }
  }
  function guardarPrefs(p) {
    try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch (e) { /* cuota */ }
  }

  const S = () => app._S;
  const RESUMEN = {
    estado: () => `PV ${val('cur_pv', '0')}/${txt('max_pv', '0')}`,
    stats: () => S() ? `${S().vel} pies · Ini ${app._signo(S().ini)}` : '—',
    defensa: () => S() ? `G: ${S().guardia} | A: ${S().armadura}` : '—',
    ataques: () => S() ? `${app._signo(S().ataque)} · ${S().dano}` : '—',
    salv: () => S() ? (S().noMoral ? 'Sin Moral' : 'Moral ' + S().moral) : '—',
    grupo: () => app.mesa ? `${app.mesa.grupo.pjs} PJ · Nv ${app.mesa.grupo.nivel}` : '—',
    encuentro: () => { if (!app.mesa) return '—'; const { na } = app._naEncuentro(); return app._dificultad(na, app.umbrales()).n + (na == null ? '' : ' · NA ' + na); },
    combate: () => app.mesa?.combate ? 'Ronda ' + app.mesa.combate.ronda : '',
  };

  function pintarPeek(det) {
    const clave = det.dataset.fold;
    const sum = det.querySelector(':scope > summary');
    if (!sum || !RESUMEN[clave]) return;
    let peek = sum.querySelector('.fold-peek');
    if (!peek) {
      peek = document.createElement('span');
      peek.className = 'fold-peek';
      // Antes del lápiz, que va al extremo derecho.
      const pen = sum.querySelector('.edit-pen');
      if (pen) sum.insertBefore(peek, pen); else sum.appendChild(peek);
    }
    // Solo cuesta calcularlo cuando se ve
    if (!det.open) peek.textContent = RESUMEN[clave]();
  }

  function refrescar() {
    document.querySelectorAll('.panel.fold[data-fold]').forEach(pintarPeek);
  }

  function init() {
    const prefs = leerPrefs();
    document.querySelectorAll('.panel.fold[data-fold]').forEach(det => {
      const clave = det.dataset.fold;
      if (clave in prefs) det.open = !!prefs[clave];
      pintarPeek(det);
      det.addEventListener('toggle', () => {
        const p = leerPrefs();
        p[clave] = det.open;
        guardarPrefs(p);
        pintarPeek(det);
      });
    });
  }

  const _init = app.init;
  app.init = function () {
    const r = _init.apply(this, arguments);
    init();
    return r;
  };

  // pintarFicha() y pintarMesa() lo llaman al terminar: sin esto, una
  // tarjeta plegada enseñaría cifras rancias.
  app._refrescarPlegables = refrescar;
})();
