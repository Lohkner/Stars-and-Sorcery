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
    for (let i = 1; i <= pickN(d.pick); i++) {
      const a = $('desc_pick_' + i)?.value;
      if (a) out.push({ a, v: pickVal(d.pick, i - 1) });
    }
    return out;
  };

  /* ── Mutaciones del Mutante (Manual v1) ─────────────────────────
     No son desplegables: se compran con Potencial (3, más 1 por cada
     Deformidad, hasta dos). Son casillas `desc_mut` / `desc_def`, así que
     gatherCharData las guarda sin código propio. */
  function estadoMutaciones() {
    const m = descActual()?.mutaciones;
    if (!m) return null;
    const coste = n => (m.opciones.find(o => o[0] === n) || [0, 0])[1];
    const muts = [...document.querySelectorAll('#desc_mutaciones input[name="desc_mut"]:checked')].map(c => c.value);
    const defs = [...document.querySelectorAll('#desc_mutaciones input[name="desc_def"]:checked')].map(c => c.value);
    const total = (m.potencial || 0) + defs.length;
    const gastado = muts.reduce((t, n) => t + coste(n), 0);
    return { m, muts, defs, total, gastado, coste };
  }

  /** Apaga lo que ya no cabe y pinta el contador. */
  function limitarMutaciones() {
    const e = estadoMutaciones();
    if (!e) return;
    const libre = e.total - e.gastado;
    document.querySelectorAll('#desc_mutaciones input[name="desc_mut"]').forEach(cb => {
      cb.disabled = !cb.checked && e.coste(cb.value) > libre;
      cb.closest('.mut-op')?.classList.toggle('is-off', cb.disabled);
    });
    document.querySelectorAll('#desc_mutaciones input[name="desc_def"]').forEach(cb => {
      // Quitar una Deformidad no puede dejar el Potencial en negativo.
      cb.disabled = cb.checked ? libre < 1 : e.defs.length >= (e.m.maxDeformidades ?? 2);
      cb.closest('.mut-op')?.classList.toggle('is-off', cb.disabled);
    });
    const c = $('mut_potencial');
    if (c) {
      c.textContent = `Potencial ${e.gastado} / ${e.total}`;
      c.classList.toggle('mut-cont--falta', libre > 0);
    }
  }

  function pintarMutaciones(m, host, marcados) {
    const wrap = document.createElement('div');
    wrap.className = 'mut-wrap';
    const cab = document.createElement('div');
    cab.className = 'mut-cab';
    const l = document.createElement('span');
    l.className = 'fl';
    l.textContent = 'Mutaciones';
    const cont = document.createElement('span');
    cont.className = 'mut-cont';
    cont.id = 'mut_potencial';
    cab.append(l, cont);
    wrap.appendChild(cab);
    const lista = (arr, nombre, rotulo) => {
      if (rotulo) {
        const r = document.createElement('div');
        r.className = 'mut-sub';
        r.textContent = rotulo;
        wrap.appendChild(r);
      }
      arr.forEach(([n, c, t]) => {
        const lab = document.createElement('label');
        lab.className = 'mut-op';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.name = nombre;
        cb.value = n;
        cb.id = nombre + '_' + slugId(n);
        cb.checked = marcados.has(cb.id);
        cb.addEventListener('change', () => {
          app._markUnsaved && app._markUnsaved();
          limitarMutaciones();
          app.calc();
          app._renderTraits && app._renderTraits();
        });
        const nm = document.createElement('span');
        nm.className = 'mut-n';
        nm.textContent = n;
        const co = document.createElement('span');
        co.className = 'mut-c' + (c < 0 ? ' mut-c--def' : '');
        co.textContent = (c > 0 ? '' : '+') + Math.abs(c);
        co.title = c > 0 ? `Cuesta ${c} de Potencial` : `Da ${-c} de Potencial`;
        const tx = document.createElement('span');
        tx.className = 'mut-t';
        tx.textContent = t;
        lab.append(cb, nm, co, tx);
        wrap.appendChild(lab);
      });
    };
    lista(m.opciones, 'desc_mut', '');
    lista(m.deformidades || [], 'desc_def', `Deformidades — hasta ${m.maxDeformidades ?? 2}, cada una da 1 de Potencial`);
    host.appendChild(wrap);
    limitarMutaciones();
  }

  /** {muts, defs, libre} del Mutante en la ficha, o null. */
  app._mutaciones = function () {
    const e = estadoMutaciones();
    return e ? { muts: e.muts, defs: e.defs, libre: e.total - e.gastado } : null;
  };

  /** Elecciones resueltas: [{etiqueta:'Mutaciones 1', valor:'Garras'}, …] */
  app._descEleccionesElegidas = function () {
    const out = [];
    document.querySelectorAll('#desc_choices select[id^="desc_eleccion"]').forEach(s => {
      if (!s.value) return;
      const et = s.previousSibling?.textContent || 'Elección';
      out.push({ etiqueta: et, valor: s.value });
    });
    const e = estadoMutaciones();
    if (e) {
      const efecto = (arr, n) => (arr.find(o => o[0] === n) || [])[2] || '';
      e.muts.forEach(n => out.push({ etiqueta: 'Mutación', valor: n, texto: efecto(e.m.opciones, n) }));
      e.defs.forEach(n => out.push({ etiqueta: 'Deformidad', valor: n, texto: efecto(e.m.deformidades || [], n) }));
    }
    return out;
  };

  function pintar() {
    const host = $('desc_choices');
    if (!host) return;
    const d = descActual();
    // Se conservan los valores para que repintar no borre lo elegido
    const previos = {};
    host.querySelectorAll('select').forEach(s => { previos[s.id] = s.value; });
    // Las Mutaciones van en su propio bloque, a todo el ancho de la tarjeta:
    // en la columna del Linaje (la mitad) la lista medía cuatro pantallas.
    const hostMut = $('desc_mutaciones');
    const marcados = new Set([...(hostMut || host).querySelectorAll('input[type="checkbox"]:checked')].map(c => c.id));
    if (hostMut) hostMut.textContent = '';
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
      const n = pickN(d.pick);
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
        const val = pickVal(d.pick, i - 1);
        const etiqueta = n > 1
          ? `Bono de Linaje ${i} (+${val})`
          : `Bono de Linaje (+${val})`;
        host.appendChild(mkSelect(id, etiqueta, opts, previos[id]));
      }
    }

    /* Bloque de Afinidad. La Fuente que concede no se elige —la fija el
       Linaje—, pero la Afinidad SÍ trae una elección real: «además, aprendes
       1 Truco de <Fuente>». Los Trucos son transversales a todas las Fuentes
       (Catálogo: «la Fuente cambia cómo se manifiestan, no su mecánica»), así
       que se ofrecen los 24.
       La del Mutante no es fija: es una de sus dos Expresiones Mutantes, así
       que este bloque solo aparece si la ha escogido — y va DESPUÉS de los
       desplegables de Expresión, porque es consecuencia de ellos. */
    const pintarAfinidad = fuente => {
      const chip = document.createElement('div');
      chip.style.marginTop = '6px';
      const l = document.createElement('span');
      l.className = 'fl';
      l.textContent = 'Afinidad de Linaje';
      const v = document.createElement('div');
      v.className = 'desc-fijos';
      const c = document.createElement('span');
      c.className = 'desc-fijo afin-chip';
      c.textContent = fuente;
      v.appendChild(c);
      chip.appendChild(l);
      chip.appendChild(v);
      host.appendChild(chip);

      const trucos = Object.values(app.DB.spells || {})
        .filter(s => s.type === 'trick')
        .map(s => s.name)
        .sort((a, b) => a.localeCompare(b, 'es'));
      if (trucos.length) {
        host.appendChild(mkSelect('desc_eleccion_afinidad',
          `Truco de ${fuente}`, trucos, previos['desc_eleccion_afinidad']));
      }
    };
    if (d.afinidad) pintarAfinidad(d.afinidad);

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

    // 2b. Mutaciones (Mutante, Manual v1): con Potencial, no con desplegables
    if (d.mutaciones) pintarMutaciones(d.mutaciones, hostMut || host, marcados);

    // 3. Afinidad condicionada a una elección (Mutante): se pinta al final,
    //    ya con las Expresiones delante, y solo si una de ellas la concede.
    //    Se consulta con `previos` porque los selects recién creados aún no
    //    tienen valor asignado en el DOM en este punto del repintado.
    if (!d.afinidad && d.afinidadOpcional) {
      const fuente = app._afinidadFuente(previos);
      if (fuente) pintarAfinidad(fuente);
    }
    app._sincronizarFuenteAfinidad();
  }

  /** Repintado bajo demanda. Lo usa applyCharData: al cargar un personaje,
      los desplegables de elección se crean ANTES de que se apliquen sus
      valores guardados, así que los que dependen de otra elección —el bloque
      de Afinidad del Mutante— aún no existen en la primera pasada. */
  app._repintarOrigen = pintar;

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

  /* Al cargar una ficha, las casillas de Mutación se marcan DESPUÉS de
     pintarse: el contador y la tarjeta Rasgos se ponen al día aquí. */
  let firmaMut = '';
  const _calc = app.calc;
  app.calc = function () {
    const r = _calc.apply(this, arguments);
    const e = estadoMutaciones();
    if (e) limitarMutaciones();
    const firma = e ? e.muts.concat(e.defs).join('|') : '';
    if (firma !== firmaMut) { firmaMut = firma; app._renderTraits && app._renderTraits(); }
    return r;
  };

})();
