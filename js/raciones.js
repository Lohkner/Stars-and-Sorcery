/* ══════════════════════════════════════════════════════════════
   Raciones.
   Módulo aparte; se carga entre app.js y boot.js, y DESPUÉS de
   progresion.js —envuelve app.doRest(), que se define allí—.

   Reglas (Manual Básico 1.0):
     · Glosario: «Ración — Unidad de suministro que se consume en cada
       Respiro y en cada Descanso Largo. Sin ella no hay recuperación, y
       su ausencia durante 24 horas genera Fatiga.»
     · Cap. 10, coste mínimo por tipo: Respiro 1 · Largo Inseguro 1 ·
       Largo Seguro 1 + entorno · Largo Confortable «posada de calidad o
       camarote». El Confortable NO gasta Ración: la comida caliente va
       incluida en la posada, y así lo dice su fila de la tabla.
     · Tabla de equipo de aventurero: «Raciones (×5) · 5 pp · 1 Slot ·
       Ud: —». Las Raciones NO tienen Dado de Uso: se cuentan una a una.
     · La Fatiga por 24 h sin comer es cosa de mesa (tiempo
       transcurrido), no de la ficha: aquí no se simula.

   Modelo: el inventario fija el MÁXIMO —las Raciones que el jugador se
   ha establecido en Equipo y Tesoro— y la tarjeta lleva la cuenta de
   las que quedan, igual que cur_pv contra max_pv. La tarjeta nunca crea
   comida: para llevar más, se añade en Equipo.
══════════════════════════════════════════════════════════════ */
(function () {
  const $ = id => document.getElementById(id);

  /** Raciones por espacio de carga (tabla de equipo: «×5» ocupa 1 Slot). */
  const POR_SLOT = 5;
  /** Más latas que esto no caben en pantalla; se resumen con una cifra. */
  const TOPE_LATAS = 30;

  /** Coste en Raciones de cada descanso. El Confortable y el reposo
      prolongado no aparecen: no gastan. */
  const COSTE = { respiro: 1, largo_inseg: 1, largo_seg: 1 };

  /* ── Identificar las Raciones del inventario ──────────────────
     `racion:true` es la marca fiable: sobrevive a que el jugador
     renombre el objeto, cosa que `dbKey` no hace (updateInvItem lo
     borra al renombrar). Los otros dos criterios solo sirven para
     reconocer objetos anteriores a este módulo. */
  const esRacion = it => !!it && (
    it.racion === true ||
    it.dbKey === 'raciones' ||
    /^\s*raciones\b/i.test(String(it.name || ''))
  );

  const items = () => (app.inventory || []).filter(esRacion);

  /** Máximo: lo que hay establecido en Equipo y Tesoro. */
  const maximo = () => items().reduce((n, it) => n + (parseInt(it.qty, 10) || 0), 0);

  /** Restantes. Vive en un input numérico con id, así que gatherCharData
      lo guarda solo, como cualquier otro recurso de la ficha. */
  function actual() {
    const el = $('rac_cur');
    const n = el ? parseInt(el.value, 10) : 0;
    return Math.max(0, Math.min(maximo(), isFinite(n) ? n : 0));
  }
  function ponerActual(n) {
    const el = $('rac_cur');
    if (!el) return 0;
    const v = Math.max(0, Math.min(maximo(), Math.trunc(n) || 0));
    if (String(v) !== el.value) {
      el.value = String(v);
      app._markUnsaved && app._markUnsaved();
    }
    return v;
  }

  /** Migración: la cantidad vivía dentro del nombre («Raciones (×5)»), y
      el nombre arrastraba un «Ud8» que la tabla de equipo del Manual 1.0
      no le da —las Raciones no van por Dado de Uso—. Se extrae la cifra
      a `qty` y se limpia lo demás. */
  function normalizar() {
    (app.inventory || []).forEach(it => {
      if (!esRacion(it)) return;
      if (typeof it.qty !== 'number' || !isFinite(it.qty) || it.qty < 0) {
        const m = String(it.name || '').match(/\(\s*[×x]\s*(\d+)\s*\)/i);
        it.qty = m ? parseInt(m[1], 10) : POR_SLOT;
      }
      const limpio = String(it.name || '')
        .replace(/\(\s*[×x]\s*\d+\s*\)/i, '')
        .replace(/[·|-]?\s*\bUd\s*\d+\b/i, '')
        .replace(/\s*·\s*$/, '')
        .replace(/\s{2,}/g, ' ').trim();
      if (limpio && limpio !== it.name) it.name = limpio;
      if (!it.name) it.name = 'Raciones';
      if (it.racion !== true) it.racion = true;
      it.slots = Math.ceil((parseInt(it.qty, 10) || 0) / POR_SLOT);
    });
  }

  /** Campo en blanco = «nadie ha llevado aún la cuenta». Pasa con los
      personajes guardados antes de esta tarjeta y con los recién
      creados; en ambos casos lo razonable es dar por llenas las
      Raciones que el jugador acaba de establecer en Equipo. */
  const sinEstrenar = () => {
    const el = $('rac_cur');
    return !el || String(el.value).trim() === '';
  };

  /** Cuando cambia lo establecido en Equipo, las restantes lo siguen:
      comprar comida se lleva encima, y tirar la mochila no deja raciones
      fantasma. En la primera pasada tras cargar un personaje solo se
      recorta, porque el valor guardado ya es el bueno. */
  function sincronizar() {
    const max = maximo();
    if (sinEstrenar()) { ponerActual(max); app._racMaxPrev = max; return; }
    const prev = app._racMaxPrev;
    if (typeof prev === 'number' && max > prev) ponerActual(actual() + (max - prev));
    else ponerActual(actual());
    app._racMaxPrev = max;
  }

  app._racionesMax    = maximo;
  app._racionesTotal  = actual;

  /* ── Pintado ──────────────────────────────────────────────── */

  /** Una latica: tapa, cuerpo y banda de etiqueta. Se dibuja por partes
      con clases propias porque llena y gastada no son el mismo icono en
      otro color —la gastada es contorno punteado, sin relleno—, y eso no
      se le puede pedir a un solo <use> del sprite. */
  const SVG_NS = 'http://www.w3.org/2000/svg';
  function lata() {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'rac-lata');
    svg.setAttribute('viewBox', '0 0 14 19');
    svg.setAttribute('aria-hidden', 'true');
    const cuerpo = document.createElementNS(SVG_NS, 'path');
    cuerpo.setAttribute('class', 'rac-lata__cuerpo');
    cuerpo.setAttribute('d', 'M1.6 3.6 L1.6 14.8 Q1.6 17.2 7 17.2 Q12.4 17.2 12.4 14.8 L12.4 3.6 Z');
    const tapa = document.createElementNS(SVG_NS, 'ellipse');
    tapa.setAttribute('class', 'rac-lata__tapa');
    tapa.setAttribute('cx', '7'); tapa.setAttribute('cy', '3.6');
    tapa.setAttribute('rx', '5.4'); tapa.setAttribute('ry', '2.3');
    const banda = document.createElementNS(SVG_NS, 'rect');
    banda.setAttribute('class', 'rac-lata__banda');
    banda.setAttribute('x', '1.6'); banda.setAttribute('y', '7.6');
    banda.setAttribute('width', '10.8'); banda.setAttribute('height', '3.4');
    svg.append(cuerpo, tapa, banda);
    return svg;
  }

  function pintar() {
    const val = $('rac_val');
    if (!val) return;
    const max = maximo();
    const t   = actual();

    val.textContent = t;
    const cnt = $('rac_count'); if (cnt) cnt.textContent = `${t}/${max}`;
    const sub = $('rac_sub');
    if (sub) sub.textContent = max ? `de ${max}` : 'sin existencias';

    const menos = $('rac_minus'); if (menos) menos.disabled = t <= 0;
    const mas   = $('rac_plus');  if (mas)   mas.disabled   = t >= max;

    // Se pintan TODAS las establecidas en Equipo: las llenas son las que
    // quedan y las punteadas, las ya gastadas. Así el hueco es el dato.
    const host = $('rac_pips');
    if (host) {
      host.textContent = '';
      const pintables = Math.min(max, TOPE_LATAS);
      for (let n = 1; n <= pintables; n++) {
        const llena = n <= t;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'rac-pip' + (llena ? ' rac-pip--llena' : ' rac-pip--hueco');
        b.setAttribute('aria-label', `Dejar ${n} ${n === 1 ? 'ración' : 'raciones'}`);
        b.appendChild(lata());
        // Tocar la última llena gasta una: si no, no habría forma de
        // bajar a cero desde las latas.
        b.addEventListener('click', () => fijar(llena && n === t ? n - 1 : n));
        host.appendChild(b);
      }
    }

    const extra = $('rac_extra');
    if (extra) {
      const oculto = max <= TOPE_LATAS;
      extra.style.display = oculto ? 'none' : '';
      if (!oculto) extra.textContent = `y ${max - TOPE_LATAS} más`;
    }

    const nota = $('rac_note');
    if (nota) {
      nota.textContent = !max
        ? 'No llevas Raciones. Añádelas en Equipo y Tesoro: ellas fijan el máximo de esta tarjeta.'
        : t === 0
          ? 'Sin Raciones no hay recuperación: el Respiro y el Descanso Largo no curan nada. El Confortable sí, porque no cuesta Ración.'
          : 'Cada Respiro y cada Descanso Largo gasta 1. El Confortable no: la posada te da de comer.';
      nota.classList.toggle('rac-note--vacio', t === 0);
    }
    const panel = $('rac_panel');
    if (panel) panel.classList.toggle('rac-panel--vacio', t === 0 && max > 0);
  }

  function fijar(n) {
    const antes = actual();
    const ahora = ponerActual(n);
    pintar();
    if (ahora !== antes && navigator.vibrate) navigator.vibrate(8);
    return ahora;
  }

  app._racionesFijar = fijar;

  function enlazar() {
    const m = $('rac_minus'), p = $('rac_plus');
    if (m && !m.dataset.listo) { m.dataset.listo = '1'; m.addEventListener('click', () => fijar(actual() - 1)); }
    if (p && !p.dataset.listo) { p.dataset.listo = '1'; p.addEventListener('click', () => fijar(actual() + 1)); }
  }

  /* ── Enganches ────────────────────────────────────────────── */
  const _init = app.init;
  app.init = function () {
    const r = _init.apply(this, arguments);
    enlazar();
    normalizar();
    sincronizar();
    pintar();
    return r;
  };

  /** Al cargar otro personaje, el máximo anterior no dice nada del
      nuevo: se olvida para que la primera pasada solo recorte. */
  const _applyCharData = app.applyCharData;
  app.applyCharData = function (data) {
    app._racMaxPrev = null;
    const r = _applyCharData.apply(this, arguments);
    // Una ficha anterior a esta tarjeta no trae el recuento: se deja en
    // blanco para que sincronizar() la dé por llena, en vez de heredar
    // las raciones a medio comer del personaje que estaba abierto.
    const guardado = data && data.inputs ? data.inputs.rac_cur : undefined;
    const el = $('rac_cur');
    if (el && (guardado === undefined || guardado === null || guardado === '')) el.value = '';
    normalizar();
    sincronizar();
    pintar();
    return r;
  };

  const _clearCharData = app.clearCharData;
  if (typeof _clearCharData === 'function') {
    app.clearCharData = function () {
      app._racMaxPrev = null;
      const el = $('rac_cur');
      if (el) el.value = '';
      return _clearCharData.apply(this, arguments);
    };
  }

  const _renderInventory = app.renderInventory;
  app.renderInventory = function () {
    normalizar();
    const r = _renderInventory.apply(this, arguments);
    // Antes de escribir la fila, no después: si no, una compra pintaría
    // el recuento anterior al ajuste.
    sincronizar();
    // El resumen de la mochila no tiene columna de cantidad; para las
    // Raciones el número es el dato, así que se cuelga del nombre. Aquí
    // va SOLO el total: Equipo y Tesoro dice cuántas se llevan —el
    // límite—, y quien rastrea las que quedan es la tarjeta de Raciones.
    const sum = $('inv_summary_list');
    if (sum) {
      let i = 0;
      (app.inventory || []).forEach(it => {
        const fila = sum.children[i++];
        if (!fila || !esRacion(it)) return;
        // El nombre va en el último hijo: el primero puede ser el icono
        // del objeto, y escribir en la fila entera lo borraba.
        const nm = fila.firstChild;
        const txt = nm && nm.lastElementChild ? nm.lastElementChild : nm;
        if (txt) txt.textContent = `${it.name} ×${parseInt(it.qty, 10) || 0}`;
      });
    }
    pintar();
    return r;
  };

  const _calc = app.calc;
  app.calc = function () {
    const r = _calc.apply(this, arguments);
    pintar();
    return r;
  };

  /** Comprar Raciones apila sobre las que ya llevas en vez de dejar dos
      filas «Raciones» en la mochila. sincronizar() se encarga de que las
      recién compradas cuenten también como restantes. */
  const _addFromDB = app.addFromDB;
  app.addFromDB = function () {
    const cat = $('inv_db_category')?.value;
    const key = $('inv_db_item')?.value;
    const pila = items()[0];
    if (cat === 'misc' && key === 'raciones' && pila) {
      pila.qty = (parseInt(pila.qty, 10) || 0) + POR_SLOT;
      this.renderInventory();
      this.calc();
      this.toast(`+${POR_SLOT} Raciones · llevas ${actual()} de ${maximo()}`, 'ok');
      return;
    }
    const r = _addFromDB.apply(this, arguments);
    normalizar();
    sincronizar();
    pintar();
    return r;
  };

  /** Sin Ración no hay recuperación: el descanso no se aplica en
      absoluto —ni PV, ni Reservas, ni Fatiga— y el menú se queda
      abierto, porque la acción no ha llegado a ocurrir. */
  const _doRest = app.doRest;
  app.doRest = function (id) {
    const coste = COSTE[id] || 0;
    if (coste && actual() < coste) {
      const det = $('rest_panel');
      if (det) det.open = true;
      this.toast('Sin Raciones: no hay recuperación. Consigue comida, o descansa Confortable en una posada.', 'err');
      if (navigator.vibrate) navigator.vibrate([8, 40, 8]);
      return;
    }
    if (!coste) return _doRest.apply(this, arguments);

    const quedan = ponerActual(actual() - coste);
    // doRest ya avisa con su propio toast; se le añade el gasto en vez de
    // apilar un segundo aviso encima.
    const _toast = this.toast;
    this.toast = function (msg, tipo, accion, opts) {
      return _toast.call(this, `${msg} · −${coste} Ración (quedan ${quedan})`, tipo, accion, opts);
    };
    try {
      return _doRest.apply(this, arguments);
    } finally {
      this.toast = _toast;
      pintar();
    }
  };
})();
