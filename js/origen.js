/* ══════════════════════════════════════════════════════════════
   Elecciones del Linaje: bonos de atributo y Elección de Experiencia.
   Módulo aparte; se carga entre app.js y boot.js y envuelve
   updateOptions() e init(). El orden importa: DEBE ir tras app.js y
   ANTES de boot.js.

   Dos cosas que el Descriptor deja abiertas y la ficha no recogía:

   1. El bono de atributo cuando el Linaje da a elegir («+1 a dos
      Atributos a elección», «+2 FUE o DES»…). Se pinta un desplegable
      por elección y el resultado entra en app._descMods(), que es lo que
      leen _statFinal, _buildStatsSummary y calc() — así que al confirmar
      Identidad y Origen los atributos ya salen aplicados en Stats.

   2. La Elección de Experiencia, que vivía dentro de `grant` como una
      línea de texto corrido «Elección: A o B / C». Se convierte en un
      desplegable con sus opciones.

   Ambas se guardan solas: gatherCharData serializa todo <select> con id.
══════════════════════════════════════════════════════════════ */
(function () {
  const $ = id => document.getElementById(id);
  const ATRIBUTOS = ['FUE', 'DES', 'CON', 'INT', 'SAB', 'CAR'];

  const descActual = () => app.DB.descriptors?.[$('sel_desc')?.value];

  /** Parte «A (…) o B» / «A / B / C» respetando los paréntesis: Cambiante
      tiene un « o » DENTRO de un paréntesis y partirlo lo rompía. */
  function opciones(txt) {
    const sep = txt.includes(' / ') ? '/' : 'o';
    const out = [];
    let buf = '', prof = 0;
    for (let i = 0; i < txt.length; i++) {
      const c = txt[i];
      if (c === '(') prof++;
      else if (c === ')') prof--;
      if (prof === 0) {
        if (sep === '/' && c === '/') { out.push(buf); buf = ''; continue; }
        if (sep === 'o' && txt.startsWith(' o ', i)) { out.push(buf); buf = ''; i += 2; continue; }
      }
      buf += c;
    }
    out.push(buf);
    return out.map(x => x.trim()).filter(Boolean);
  }

  const NUMEROS = { un: 1, una: 1, dos: 2, tres: 3, cuatro: 4 };

  /** Entradas de `grant` que ofrecen a elegir. Dos formatos conviven en los
      datos: «Elección: A o B» (una opción) y «Elige DOS Mutaciones: A / B»
      (varias del mismo conjunto, como el Mutante). */
  function elecciones(d) {
    return (d?.grant || []).map(g => {
      let m = g.match(/^Elecci[óo]n\s*(?:de Experiencia)?\s*[:—–-]\s*(.+)$/i);
      if (m) return { n: 1, txt: m[1], etiqueta: 'Elección de Experiencia' };
      m = g.match(/^Elige\s+(\S+)\s+([^:]+):\s*(.+)$/i);
      if (m) {
        const n = NUMEROS[m[1].toLowerCase()] || parseInt(m[1], 10) || 1;
        return { n, txt: m[3], etiqueta: m[2].trim() };
      }
      return null;
    }).filter(Boolean);
  }

  /** Opciones que, por su propio texto, consumen todas las elecciones de su
      grupo (Aberración Mística del Mutante: «ocupa las DOS elecciones»). */
  const ocupaTodas = t => /ocupa\s+(las|los)\s+\w+\s+elecc/i.test(t);

  function mkSelect(id, etiqueta, valores, previo) {
    const wrap = document.createElement('div');
    wrap.style.marginTop = '6px';
    const l = document.createElement('span');
    l.className = 'fl';
    l.textContent = etiqueta;
    const sel = document.createElement('select');
    sel.id = id;
    sel.setAttribute('aria-label', etiqueta);
    const vacio = document.createElement('option');
    vacio.value = '';
    vacio.textContent = '— Elegir —';
    sel.appendChild(vacio);
    valores.forEach(v => {
      const o = document.createElement('option');
      o.value = typeof v === 'string' ? v : v.v;
      o.textContent = typeof v === 'string' ? v : v.t;
      sel.appendChild(o);
    });
    if (previo && [...sel.options].some(o => o.value === previo)) sel.value = previo;
    sel.addEventListener('change', () => {
      app._markUnsaved && app._markUnsaved();
      app.calc();
      pintar();                       // para que las opciones distintas se excluyan
      app._renderTraits && app._renderTraits();  // Aptitudes → tarjeta Rasgos
    });
    wrap.appendChild(l);
    wrap.appendChild(sel);
    return wrap;
  }

  /* ── Lectores públicos: la pestaña Detalle pinta lo ELEGIDO ────── */

  /** Bonos de atributo que el jugador escogió: [{a:'CAR', v:1}, …] */
  app._descPicksElegidos = function () {
    const d = descActual();
    if (!d?.pick) return [];
    const out = [];
    for (let i = 1; i <= (d.pick.n || 1); i++) {
      const a = $('desc_pick_' + i)?.value;
      if (a) out.push({ a, v: d.pick.val || 1 });
    }
    return out;
  };

  /** Elecciones resueltas: [{etiqueta:'Mutaciones 1', valor:'Garras'}, …] */
  app._descEleccionesElegidas = function () {
    const out = [];
    document.querySelectorAll('#desc_choices select[id^="desc_eleccion"]').forEach(s => {
      if (!s.value) return;
      const et = s.previousSibling?.textContent || 'Elección';
      out.push({ etiqueta: et, valor: s.value });
    });
    return out;
  };

  function pintar() {
    const host = $('desc_choices');
    if (!host) return;
    const d = descActual();
    // Se conservan los valores para que repintar no borre lo elegido
    const previos = {};
    host.querySelectorAll('select').forEach(s => { previos[s.id] = s.value; });
    host.textContent = '';
    if (!d) return;

    // 0. Bonos FIJOS del Linaje, visibles junto a los que se eligen: si no,
    //    el jugador ve «Bono de Linaje (+1)» sin saber que además ya lleva
    //    un +2 CON puesto por su Descriptor.
    const fijos = Object.entries(d.mods || {});
    if (fijos.length) {
      const wrap = document.createElement('div');
      wrap.style.marginTop = '6px';
      const l = document.createElement('span');
      l.className = 'fl';
      l.textContent = 'Bonos de Linaje (fijos)';
      wrap.appendChild(l);
      const fila = document.createElement('div');
      fila.className = 'desc-fijos';
      fijos.forEach(([a, v]) => {
        const chip = document.createElement('span');
        chip.className = 'desc-fijo';
        chip.textContent = `${a} ${v > 0 ? '+' : ''}${v}`;
        fila.appendChild(chip);
      });
      wrap.appendChild(fila);
      host.appendChild(wrap);
    }

    // 1. Bonos de atributo a elección
    if (d.pick) {
      const n = d.pick.n || 1;
      const val = d.pick.val || 1;
      const base = d.pick.from || ATRIBUTOS;
      for (let i = 1; i <= n; i++) {
        const id = 'desc_pick_' + i;
        // «dos Atributos DISTINTOS»: no ofrecer el ya elegido en el otro
        let opts = base;
        if (d.pick.distinct) {
          const otros = [];
          for (let j = 1; j <= n; j++) if (j !== i && previos['desc_pick_' + j]) otros.push(previos['desc_pick_' + j]);
          opts = base.filter(a => !otros.includes(a));
        }
        const etiqueta = n > 1
          ? `Bono de Linaje ${i} (+${val})`
          : `Bono de Linaje (+${val})`;
        host.appendChild(mkSelect(id, etiqueta, opts, previos[id]));
      }
    }

    // 2. Elecciones (Experiencia, Mutaciones…)
    elecciones(d).forEach((el, k) => {
      const ops = opciones(el.txt).map(o => ({ v: o.split('(')[0].trim(), t: o }));
      const sufijo = k ? '_' + (k + 1) : '';
      // Una opción puede consumir todas las ranuras del grupo: si está
      // elegida en la primera, las demás no se ofrecen.
      const primera = previos['desc_eleccion' + sufijo];
      const bloquea = primera && ops.some(o => o.v === primera && ocupaTodas(o.t));
      for (let i = 1; i <= el.n; i++) {
        if (i > 1 && bloquea) break;
        const id = 'desc_eleccion' + sufijo + (i > 1 ? '__' + i : '');
        let opts = ops;
        if (el.n > 1) {
          const otros = [];
          for (let j = 1; j <= el.n; j++) {
            if (j === i) continue;
            const v = previos['desc_eleccion' + sufijo + (j > 1 ? '__' + j : '')];
            if (v) otros.push(v);
          }
          opts = ops.filter(o => !otros.includes(o.v));
          // Solo la primera ranura puede tomar una opción que las ocupe todas
          if (i > 1) opts = opts.filter(o => !ocupaTodas(o.t));
        }
        const etiqueta = el.n > 1 ? `${el.etiqueta} ${i}` : el.etiqueta;
        host.appendChild(mkSelect(id, etiqueta, opts, previos[id]));
      }
    });
  }

  const _updateOptions = app.updateOptions;
  app.updateOptions = function () {
    const r = _updateOptions.apply(this, arguments);
    pintar();
    app.calc();          // los bonos elegidos entran en los atributos
    // _updateOptions ya pintó la tarjeta Rasgos, pero con los desplegables
    // del Linaje ANTERIOR: al cambiar de Linaje arrastraba su elección.
    app._renderTraits && app._renderTraits();
    return r;
  };

  const _init = app.init;
  app.init = function () {
    const r = _init.apply(this, arguments);
    pintar();
    return r;
  };

  /* randomize() es anterior a estos campos, así que dejaba las elecciones
     en blanco: un Cambiante aleatorio se quedaba sin su +2 de atributo y
     sin Experiencia. Se rellenan al azar, respetando las exclusiones
     («distintos», opciones que ocupan varias ranuras) porque se hace a
     través de los mismos selects y repintando entre uno y otro. */
  const _randomize = app.randomize;
  app.randomize = function () {
    const r = _randomize.apply(this, arguments);
    pintar();
    let vueltas = 0;
    while (vueltas++ < 8) {
      const vacio = [...document.querySelectorAll('#desc_choices select')]
        .find(s => !s.value && s.options.length > 1);
      if (!vacio) break;
      const ops = [...vacio.options].filter(o => o.value);
      vacio.value = ops[Math.floor(Math.random() * ops.length)].value;
      pintar();
    }
    this.calc();
    this._renderTraits && this._renderTraits();
    return r;
  };
})();
