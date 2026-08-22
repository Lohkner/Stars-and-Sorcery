/* ══════════════════════════════════════════════════════════════
   Pericias con grado.
   Módulo aparte: se carga entre app.js y boot.js y envuelve calc(),
   updateOptions() e init() en lugar de dispersar el código por app.js.
   Todo lo que toca vive aquí, así que la función se quita quitando el
   <script> — pero el orden de carga importa: DEBE ir tras app.js
   (necesita el objeto `app`) y ANTES de boot.js (que llama a init()).

   Modelo (Manual Básico §Pericia y glosario):
   · Grados 0–3. 0 = «Sin Pericia». El tope es 3, no más.
   · Coste por NE: Sin Pericia 5 · 1 → 4 · 2 → 3 · 3 → 2 (mínimo 2).
   · Física y Mental las adquiere cualquiera con PD, sin importar el
     Arquetipo — el Arquetipo solo decide la Pericia INICIAL.
   · Flexible sigue siendo exclusiva del Versátil (el Arquetipo que las
     Reglas Esenciales llamaban «Sutil»), así que solo se ofrece a los
     Arquetipos que la listan en sus edges.
   La tarjeta Estado muestra todas las de grado ≥1 ("Físico 1", "Mental 2").

   `sel_filo` NO es una elección del jugador: está oculto y es un campo
   DERIVADO, sincronizado con la Pericia de mayor grado. Existe solo como
   puente de compatibilidad — fichas guardadas antes de los grados, el
   respaldo de buildDetailPage y randomize()— y nada de lo que se ve en
   pantalla depende de él: el coste por NE sale del grado de cada Pericia,
   y la tarjeta Estado las lista todas. No hay «Pericia activa» única: el
   Manual da un grado por dominio, y solo el Versátil declara cada turno a
   cuál de los dos aplica su Flexible.
   Los grados se guardan solos: gatherCharData serializa todo <select> con id.
══════════════════════════════════════════════════════════════ */
(function () {
  const EDGE_MAX = 3;                       // Sin Pericia · 1 · 2 · 3
  const NE_COST  = { 0: 5, 1: 4, 2: 3, 3: 2 };
  // Única Pericia atada al Arquetipo. El resto son libres.
  const EXCLUSIVE = ['Flexible'];
  const $ = id => document.getElementById(id);
  // "Físico" → "fisico": los ids deben ser estables y sin acentos porque
  // viajan al JSON del personaje como claves de data.selects.
  const slug = e => e.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                     .toLowerCase().replace(/[^a-z0-9]+/g, '_');

  /** Pericias que este personaje puede tener. No se leen solo de su
      Arquetipo: se recorre toda la DB para no cablear "Físico"/"Mental"
      (el Editor de Reglas puede renombrarlas). Las exclusivas se filtran
      por el Arquetipo actual; las demás quedan abiertas a todos. */
  function edgesOf() {
    const arqs = app.DB?.archetypes || {};
    const mine = Array.isArray(arqs[$('sel_arq')?.value]?.edges)
      ? arqs[$('sel_arq').value].edges : [];
    const all = [];
    Object.keys(arqs).forEach(k => (arqs[k].edges || []).forEach(e => {
      if (!all.includes(e)) all.push(e);
    }));
    if (!all.length) return [];
    return all.filter(e => !EXCLUSIVE.includes(e) || mine.includes(e));
  }

  function readGrades() {
    const g = {};
    edgesOf().forEach(e => {
      const s = $('filo_g_' + slug(e));
      g[e] = s ? (parseInt(s.value, 10) || 0) : 0;
    });
    return g;
  }

  /** Reconstruye las filas al cambiar de Arquetipo, conservando los grados
      de las Pericias que sigan disponibles (mismo criterio que sel_filo). */
  function buildRows() {
    const host = $('filo_grades');
    if (!host) return;
    const prev = readGrades();
    host.textContent = '';
    const edges = edgesOf();
    if (!edges.length) {
      const p = document.createElement('span');
      p.className = 'per-empty';
      p.textContent = 'Elige un Arquetipo';
      host.appendChild(p);
      return;
    }
    edges.forEach(e => {
      const row = document.createElement('div');
      row.className = 'per-row';
      const lbl = document.createElement('span');
      lbl.className = 'per-lbl';
      lbl.textContent = e;
      const cost = document.createElement('span');
      cost.className = 'per-cost';
      const sel = document.createElement('select');
      sel.className = 'per-sel';
      sel.id = 'filo_g_' + slug(e);
      sel.setAttribute('aria-label', 'Grado de Pericia ' + e);
      for (let i = 0; i <= EDGE_MAX; i++) {
        const o = document.createElement('option');
        o.value = String(i);
        o.textContent = i ? String(i) : '—';
        sel.appendChild(o);
      }
      sel.value = String(prev[e] || 0);
      sel.addEventListener('change', () => {
        // Tocar un grado cierra la ventana de migración: a partir de aquí los
        // grados son la fuente de verdad y `sel_filo` no puede reimponerse.
        app._periciasMigrar = false;
        app._markUnsaved && app._markUnsaved();
        app.calc();
      });
      row.appendChild(lbl);
      row.appendChild(cost);
      row.appendChild(sel);
      host.appendChild(row);
    });
  }

  /** sel_filo = la Pericia de mayor grado (desempate: orden del Arquetipo). */
  function syncPrimary(grades) {
    const sel = $('sel_filo');
    if (!sel) return;
    const want = edgesOf()
      .filter(e => grades[e] > 0)
      .sort((a, b) => grades[b] - grades[a])[0] || '';
    if (sel.value !== want && [...sel.options].some(o => o.value === want)) sel.value = want;
  }

  function render(grades) {
    const cell = $('res_filo_val');
    if (!cell) return;
    cell.textContent = '';
    const taken = edgesOf().filter(e => grades[e] > 0);
    if (!taken.length) { cell.textContent = '—'; return; }
    taken.forEach(e => {
      const s = document.createElement('span');
      s.className = 'e4-per';
      s.textContent = e + ' ' + grades[e];
      cell.appendChild(s);
    });
  }

  const _calc = app.calc;
  app.calc = function () {
    const r = _calc.apply(this, arguments);
    const grades = readGrades();
    // Migración: fichas guardadas antes de los grados —y randomize()— sólo
    // fijan sel_filo. Si no hay ningún grado, la Pericia elegida vale 1.
    // SOLO durante la ventana que abre clearCharData: sin esa guarda, la
    // condición «no hay ningún grado» se volvía a cumplir cada vez que el
    // jugador bajaba sus Pericias a cero, y `sel_filo` —que conserva la
    // última que tuvo grado— le devolvía un 1 que no había pedido. Poner las
    // Pericias a cero era imposible.
    const primary = $('sel_filo')?.value;
    if (app._periciasMigrar && primary && !edgesOf().some(e => grades[e] > 0)) {
      const s = $('filo_g_' + slug(primary));
      if (s) { s.value = '1'; grades[primary] = 1; app._periciasMigrar = false; }
    }
    syncPrimary(grades);
    render(grades);
    // Panel de Identidad: realce de las adquiridas + coste por NE, que es
    // lo que la Pericia realmente compra (Manual: 5/4/3/2 puntos por NE).
    edgesOf().forEach(e => {
      const row = $('filo_g_' + slug(e))?.closest('.per-row');
      if (!row) return;
      row.classList.toggle('per-on', grades[e] > 0);
      const cost = row.querySelector('.per-cost');
      if (cost) cost.textContent = (NE_COST[grades[e]] ?? 5) + ' pts/NE';
    });
    return r;
  };

  const _updateOptions = app.updateOptions;
  app.updateOptions = function () {
    const r = _updateOptions.apply(this, arguments);
    buildRows();       // _updateOptions ya llamó a calc() con las filas viejas…
    app.calc();        // …así que se repinta con las nuevas
    return r;
  };

  const _init = app.init;
  app.init = function () {
    const r = _init.apply(this, arguments);
    buildRows();
    app.calc();
    return r;
  };
})();
