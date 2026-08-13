/* ══════════════════════════════════════════════════════════════
   Tarjetas plegables de Perfil: Estado · Guardia · Ataques.
   Módulo aparte; se carga entre app.js y boot.js.

   Van ABIERTAS por defecto —se usan cada turno, al contrario que las
   aptitudes de Arquetipo, que son consulta—. El estado se guarda en
   localStorage y no en el personaje: plegar una tarjeta es una
   preferencia de quien juega en esa mesa, no un dato de la ficha, así
   que no debe viajar en el JSON ni marcar el personaje como no guardado.

   Plegada, cada cabecera muestra un resumen de una línea con lo esencial
   de la tarjeta, para que plegar no signifique perder el dato de vista.
══════════════════════════════════════════════════════════════ */
(function () {
  const CLAVE = 'ss_folds';
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

  /** Resumen de una línea por tarjeta. */
  const RESUMEN = {
    estado: () => `PV ${val('cur_pv', '0')}/${txt('max_pv', '0')}`
                + ` · Adr ${val('cur_adr', '0')}/${txt('max_adr', '0')}`
                + ` · Ing ${val('cur_ing', '0')}/${txt('max_ing', '0')}`,
    guardia: () => `Guardia ${txt('guard_total_live', txt('res_guardia', '—'))}`,
    ataques: () => {
      const a = txt('atk_bonus_1', ''), d = txt('atk_dmg_1', '');
      return a || d ? `Ataque ${a} · Daño ${d}` : '—';
    },
  };

  function pintarPeek(det) {
    const clave = det.dataset.fold;
    const sum = det.querySelector(':scope > summary');
    if (!sum || !RESUMEN[clave]) return;
    let peek = sum.querySelector('.fold-peek');
    if (!peek) {
      peek = document.createElement('span');
      peek.className = 'fold-peek';
      sum.appendChild(peek);
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

  // Los resúmenes salen de valores que recalcula calc(); si no se
  // refrescan aquí, una tarjeta plegada enseñaría cifras rancias.
  const _calc = app.calc;
  app.calc = function () {
    const r = _calc.apply(this, arguments);
    refrescar();
    return r;
  };

  const _adjustRes = app.adjustRes;
  app.adjustRes = function () {
    const r = _adjustRes.apply(this, arguments);
    refrescar();
    return r;
  };
})();
