/* ══════════════════════════════════════════════════════════════
   Historial de tiradas.
   Módulo aparte; se carga entre app.js y boot.js.

   Todas las tiradas de la ficha —atributos, salvaciones, habilidades,
   iniciativa, ataque y daño— pasan por app.showDiceRoll(). Se envuelve
   esa función y se apunta cada tirada antes de animarla: ninguna tirada
   cambia, y una nueva queda registrada sin tocar nada más.

   Se guardan las 10 últimas del personaje abierto, solo en memoria: al
   crear, cargar o importar otro personaje (todo pasa por clearCharData)
   la lista empieza de cero. Se ven en dos sitios:
     · en la tarjeta del dado, en el desplegable «Últimas tiradas»;
     · desde el menú de acciones, sin tirar (app.verHistorialTiradas).
══════════════════════════════════════════════════════════════ */
(function () {
  const MAX = 10;
  let tiradas = [];
  const $ = id => document.getElementById(id);

  const hora = d => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  function registrar(o) {
    const total = Number(o.total);
    tiradas.unshift({
      label: String(o.label || 'Tirada'),
      detalle: String(o.detail || ''),
      total: isFinite(total) ? total : o.total,
      danio: o.totalLabel === 'Daño',
      crit: !!o.isCrit, fallo: !!o.isFail,
      cuando: new Date(),
    });
    if (tiradas.length > MAX) tiradas.length = MAX;
  }

  /** El total se escribe como en la tarjeta: con signo salvo el daño. */
  const totalTxt = t => (typeof t.total === 'number' && t.total >= 0 && !t.danio ? '+' : '') + t.total;

  function pintar(ocultarPrimera) {
    const lista = $('dice_hist_list');
    const cuenta = $('dice_hist_n');
    const caja = $('dice_hist');
    if (!lista || !caja) return;
    if (cuenta) cuenta.textContent = tiradas.length;
    caja.hidden = tiradas.length === 0;
    const vacia = $('dice_hist_vacia');
    if (vacia) vacia.hidden = tiradas.length > 0;
    lista.textContent = '';
    tiradas.forEach((t, i) => {
      const li = document.createElement('li');
      li.className = 'dice-hist-it' + (t.crit ? ' is-crit' : '') + (t.fallo ? ' is-fallo' : '') + (i === 0 && ocultarPrimera ? ' is-actual' : '');
      const cab = document.createElement('div');
      cab.className = 'dice-hist-cab';
      const nm = document.createElement('span');
      nm.className = 'dice-hist-nm';
      nm.textContent = t.label;
      const tot = document.createElement('span');
      tot.className = 'dice-hist-tot';
      tot.textContent = totalTxt(t);
      cab.append(nm, tot);
      const det = document.createElement('div');
      det.className = 'dice-hist-det';
      det.textContent = `${hora(t.cuando)} · ${t.detalle}${t.crit ? ' · Crítico' : ''}${t.fallo ? ' · Fallo total' : ''}`;
      li.append(cab, det);
      lista.appendChild(li);
    });
  }

  // ── Tiradas: se apuntan y la lista se refresca, plegada para no
  //    adelantar el resultado mientras ruedan los dados.
  const _show = app.showDiceRoll;
  app.showDiceRoll = function (o) {
    registrar(o || {});
    $('dice-card')?.classList.remove('solo-hist');
    const caja = $('dice_hist');
    if (caja) caja.open = false;
    pintar(true);
    return _show.apply(this, arguments);
  };

  // ── Otro personaje, otra lista.
  const _clear = app.clearCharData;
  app.clearCharData = function () {
    // «Cancelar» de una tarjeta recarga la ficha por esta misma vía, pero
    // sigue siendo el mismo personaje: su historial se conserva.
    if (!app._restaurandoFicha) { tiradas = []; pintar(false); }
    return _clear.apply(this, arguments);
  };

  /** Abre la tarjeta del dado solo con la lista, sin tirar nada. */
  app.verHistorialTiradas = function () {
    const overlay = $('dice-overlay');
    const card = $('dice-card');
    if (!overlay || !card) return;
    this._tapShield && this._tapShield();
    card.classList.remove('crit', 'fail');
    card.classList.add('solo-hist');
    overlay.classList.remove('closing');
    $('dice-label').textContent = 'Últimas tiradas';
    $('dice-close-btn')?.classList.add('show');
    pintar(false);
    const caja = $('dice_hist');
    if (caja) { caja.hidden = false; caja.open = true; }
    overlay.classList.add('active');
  };

  // La lista se desplaza dentro de la tarjeta: sin esto, arrastrarla hacia
  // abajo contaba como el gesto de «desliza para cerrar». (El script es
  // defer: cuando corre, el marcado ya está.)
  const lista = $('dice_hist_list');
  ['touchstart', 'touchend'].forEach(t =>
    lista?.addEventListener(t, e => e.stopPropagation(), { passive: true }));
})();
