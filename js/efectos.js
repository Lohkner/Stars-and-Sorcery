/* ══════════════════════════════════════════════════════════════
   Efectos de respuesta (v60).
   Módulo aparte: se carga tras app.js y progresion.js y ANTES de
   boot.js. Envuelve _updateResBars() y levelUp(); se quita quitando el
   <script>.

   1. Estado: al cambiar un recurso, la barra deja una ESTELA donde estaba
      (solo al bajar), y sobre la cifra sube el cambio acumulado («−5» tras
      cinco toques seguidos, «+16» tras un descanso).
   2. Subir de nivel: un destello breve con el nivel nuevo.

   Nada de esto guarda datos ni cambia valores: solo pinta. Con «reducir
   movimiento» la estela no se retrasa y la cifra y el nivel se muestran
   sin desplazarse.
══════════════════════════════════════════════════════════════ */
(function () {
  const $ = id => document.getElementById(id);
  const calma = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ── 1 · Barras de Estado ───────────────────────────────────────
  const BARRAS = [
    ['res_fill_pv', 'cur_pv'], ['res_fill_adr', 'cur_adr'],
    ['res_fill_ing', 'cur_ing'], ['res_fill_carne', 'cur_carne'],
  ];
  const ESPERA_ESTELA = 420;      // ms que la estela aguanta antes de recogerse
  const VIDA_CIFRA = 1300;        // ms; igual que la animación resDelta
  const previo = {};              // curId → último valor pintado
  const acumulado = {};           // curId → { total, t }

  function estela(fill) {
    const track = fill.parentElement;
    let g = track.querySelector('.res-ghost');
    if (!g) {
      g = document.createElement('div');
      g.className = 'res-ghost';
      track.insertBefore(g, fill);
    }
    return g;
  }

  /** Cifra flotante con el cambio ACUMULADO: los ± suman de uno en uno, y
      una ristra de «−1» no dice nada; «−5» sí. */
  function cifra(curId, delta) {
    const host = $(curId)?.closest('.e4-num');
    if (!host) return;
    const a = acumulado[curId] || (acumulado[curId] = { total: 0, t: 0 });
    a.total += delta;
    clearTimeout(a.t);
    let chip = host.querySelector('.res-delta');
    if (a.total === 0) { chip?.remove(); return; }
    if (!chip) {
      chip = document.createElement('span');
      chip.className = 'res-delta';
      chip.setAttribute('aria-hidden', 'true');
      host.appendChild(chip);
    }
    chip.textContent = (a.total > 0 ? '+' : '−') + Math.abs(a.total);
    chip.classList.toggle('res-delta--sube', a.total > 0);
    chip.classList.remove('res-delta--va');
    void chip.offsetWidth;                       // reinicia la animación
    chip.classList.add('res-delta--va');
    a.t = setTimeout(() => { chip.remove(); a.total = 0; }, VIDA_CIFRA);
  }

  function olvidar() {
    Object.keys(acumulado).forEach(k => { clearTimeout(acumulado[k].t); acumulado[k].total = 0; });
    document.querySelectorAll('.res-delta').forEach(c => c.remove());
  }

  /* Solo cuenta lo que hace el jugador: los botones ±, teclear la cifra o
     descansar. Crear un personaje, cargarlo o recalcular la ficha también
     mueven los valores, y pintarlos como «+20» era mentira. */
  let intencion = 0, tecleo = false;
  ['adjustRes', 'doRest'].forEach(nombre => {
    const orig = app[nombre];
    if (typeof orig !== 'function') return;
    app[nombre] = function () {
      intencion++;
      try { return orig.apply(this, arguments); }
      finally { intencion--; }
    };
  });
  document.addEventListener('input', e => {
    if (!e.target?.classList?.contains('res-fin')) return;
    tecleo = true;
    setTimeout(() => { tecleo = false; }, 0);
  }, true);

  const _upd = app._updateResBars;
  app._updateResBars = function () {
    const antes = {};
    BARRAS.forEach(([fillId]) => { const f = $(fillId); if (f) antes[fillId] = f.style.width || '0%'; });
    const r = _upd.apply(this, arguments);
    const cargando = !!this._charLoading;
    const delJugador = intencion > 0 || tecleo;
    if (cargando) olvidar();
    BARRAS.forEach(([fillId, curId]) => {
      const fill = $(fillId), cur = $(curId);
      if (!fill || !cur) return;
      const v = parseInt(cur.value, 10) || 0;
      const p = previo[curId];
      previo[curId] = v;
      const g = estela(fill);
      const igualar = () => { clearTimeout(g._t); g._t = 0; g.style.transition = 'none'; g.style.width = fill.style.width; };
      // Cargar otra ficha, crearla o recalcularla no es recibir daño.
      if (p === undefined || cargando) { igualar(); return; }
      if (v === p) { if (!g._t) igualar(); return; }      // solo cambió el máximo
      if (!delJugador) { igualar(); return; }
      cifra(curId, v - p);
      if (v < p && !calma()) {
        if (!g._t) { g.style.transition = 'none'; g.style.width = antes[fillId]; }
        clearTimeout(g._t);
        g._t = setTimeout(() => { g.style.transition = ''; g.style.width = fill.style.width; g._t = 0; }, ESPERA_ESTELA);
      } else {
        igualar();
        if (v > p && !calma()) {
          fill.classList.remove('res-sube');
          void fill.offsetWidth;
          fill.classList.add('res-sube');
        }
      }
    });
    return r;
  };

  // ── 2 · Subida de nivel ────────────────────────────────────────
  function celebrar(nivel) {
    document.querySelector('.lvl-fx')?.remove();
    const fx = document.createElement('div');
    fx.className = 'lvl-fx';
    fx.setAttribute('aria-hidden', 'true');      // el aviso de texto ya lo anuncia
    fx.innerHTML = '<span class="lvl-fx-ring"></span><span class="lvl-fx-ring lvl-fx-ring--2"></span>'
                 + '<span class="lvl-fx-lbl">Nivel</span><span class="lvl-fx-num"></span>';
    fx.querySelector('.lvl-fx-num').textContent = nivel;
    document.body.appendChild(fx);
    setTimeout(() => fx.remove(), 1700);
  }

  const _levelUp = app.levelUp;
  app.levelUp = function () {
    const antes = parseInt($('char_lvl')?.value, 10) || 1;
    const r = _levelUp.apply(this, arguments);
    const ahora = parseInt($('char_lvl')?.value, 10) || 1;
    if (ahora > antes) celebrar(ahora);
    return r;
  };
})();
