/* ══════════════════════════════════════════════════════════════
   Edición de tarjetas: lápiz en la cabecera, «Cancelar» y modo edición.
   Módulo aparte; se carga entre app.js y boot.js.

   · LÁPIZ. Sustituye al botón «Editar» del pie de cada tarjeta. En las
     tarjetas plegables va al extremo derecho del título: el título sigue
     plegando y el lápiz solo edita (si la tarjeta estaba plegada, la abre).
     En las dos tarjetas sin título —retrato e identidad— va en la esquina.
   · CANCELAR. Al entrar en edición se guarda una foto de la ficha. Cancelar
     devuelve SOLO los campos de esa tarjeta (y lo que arrastran: cambiar de
     Arquetipo cambia habilidades y Pericias) y deja intacto todo lo demás
     —PV gastados, raciones, otras tarjetas—. La restauración usa la misma
     ruta con la que se carga un personaje guardado (clearCharData +
     applyCharData), que es la que ya resuelve todas las dependencias.
   · MODO EDICIÓN. Desde el menú de acciones abre todas las tarjetas en
     edición a la vez; un único «Terminar edición» flotante las confirma.

   La edición de cada tarjeta no cambia: se siguen usando editSection,
   confirmSection, confirmPersonal, editCampana y confirmCampana.
══════════════════════════════════════════════════════════════ */
(function () {
  const $ = id => document.getElementById(id);
  const clon = o => JSON.parse(JSON.stringify(o));

  /* Qué pertenece a cada tarjeta: los campos que hay dentro de su vista de
     edición, más los datos de la ficha que no son campos del DOM (extra) y
     los que arrastra por dependencia (expresiones regulares por id/nombre). */
  const SEC = {
    personal:  { vista: 'personal_edit_view', abrir: () => app.editSection('personal'),  confirmar: () => app.confirmPersonal(),
                 extra: ['concept', 'alignment', 'portrait'] },
    identity:  { vista: 'identity_edit_view', abrir: () => app.editSection('identity'),  confirmar: () => app.confirmSection('identity'),
                 extra: ['skillBonus', 'skillAttr', 'powerSource'], checks: /^chk_(arq|bg)$/,
                 selects: /^(sel_desc|sel_arq|sel_bg|sel_filo|filo_g_.+|desc_.+)$/ },
    stats:     { vista: 'stats_edit_view',    abrir: () => app.editSection('stats'),     confirmar: () => app.confirmSection('stats') },
    saves:     { vista: 'saves_edit_view',    abrir: () => app.editSection('saves'),     confirmar: () => app.confirmSection('saves') },
    skills:    { vista: 'skills_edit_view',   abrir: () => app.editSection('skills'),    confirmar: () => app.confirmSection('skills'),
                 extra: ['skillBonus', 'skillAttr'], checks: /^chk_(arq|bg)$/ },
    guard:     { vista: 'guard_edit_view',    abrir: () => app.editSection('guard'),     confirmar: () => app.confirmSection('guard') },
    combat:    { vista: 'combat_edit_view',   abrir: () => app.editSection('combat'),    confirmar: () => app.confirmSection('combat') },
    equipment: { vista: 'equipment_edit_view', abrir: () => app.editSection('equipment'), confirmar: () => app.confirmSection('equipment'),
                 extra: ['inventory', 'gold'], selects: /^(sel_weapon|sel_weapon_sec|sel_armor|sel_shield)$/, inputs: /^rac_cur$/ },
    campana:   { vista: 'campana_edit',       abrir: () => app.editCampana(),            confirmar: () => app.confirmCampana(),
                 extra: ['lethality'] },
  };
  const NOMBRES = Object.keys(SEC);

  const fotos = {};          // sec → foto de la ficha al entrar en edición
  let modoGeneral = false;

  const vista = s => $(SEC[s].vista);
  const enEdicion = s => {
    const v = vista(s);
    return !!v && v.style.display !== 'none' && getComputedStyle(v).display !== 'none';
  };
  const tarjeta = s => vista(s)?.closest('details.panel, .panel');

  /* ── Envolturas: la foto se toma al ENTRAR en edición y se descarta al
        confirmar. Si ya estaba en edición, no se vuelve a tomar. ────── */
  function envolverAbrir(nombreFn, secDe) {
    const orig = app[nombreFn];
    app[nombreFn] = function (arg) {
      const s = secDe(arg);
      if (s && SEC[s] && !enEdicion(s) && !app._restaurandoFicha) fotos[s] = clon(app.gatherCharData());
      const r = orig.apply(this, arguments);
      refrescar();
      return r;
    };
  }
  function envolverConfirmar(nombreFn, secDe) {
    const orig = app[nombreFn];
    app[nombreFn] = function (arg) {
      const s = secDe(arg);
      const r = orig.apply(this, arguments);
      if (s) delete fotos[s];
      refrescar();
      return r;
    };
  }
  envolverAbrir('editSection', s => s);
  envolverAbrir('editCampana', () => 'campana');
  envolverConfirmar('confirmSection', s => s);
  envolverConfirmar('confirmPersonal', () => 'personal');
  envolverConfirmar('confirmCampana', () => 'campana');

  // Otro personaje: fuera fotos y fuera el modo general.
  const _clear = app.clearCharData;
  app.clearCharData = function () {
    if (!app._restaurandoFicha) {
      NOMBRES.forEach(s => delete fotos[s]);
      salirModoGeneral();
    }
    return _clear.apply(this, arguments);
  };

  /* ── Cancelar ─────────────────────────────────────────────────── */
  function mezclar(s, F, A) {
    const g = SEC[s], v = vista(s);
    const M = clon(A);
    const ids = new Set();
    v?.querySelectorAll('input[id],select[id],textarea[id]').forEach(el => ids.add(el.id));
    const toca = (id, rx) => ids.has(id) || (rx && rx.test(id));

    ['inputs', 'selects'].forEach(tipo => {
      const rx = tipo === 'inputs' ? g.inputs : g.selects;
      new Set([...Object.keys(F[tipo] || {}), ...Object.keys(A[tipo] || {})]).forEach(id => {
        if (!toca(id, rx)) return;
        if (id in (F[tipo] || {})) M[tipo][id] = F[tipo][id];
        else delete M[tipo][id];
      });
    });

    const casillas = v ? [...v.querySelectorAll('input[type=checkbox],input[type=radio]')] : [];
    const idsC = new Set(casillas.map(e => e.id).filter(Boolean));
    const nomC = new Set(casillas.map(e => e.name).filter(Boolean));
    const esSuya = c => (c.id && idsC.has(c.id)) || (c.name && nomC.has(c.name)) || (g.checks && g.checks.test(c.name || ''));
    M.checks = (A.checks || []).filter(c => !esSuya(c)).concat((F.checks || []).filter(esSuya));

    (g.extra || []).forEach(k => { M[k] = k in F ? clon(F[k]) : undefined; });
    return M;
  }

  function restaurar(M, reabrir) {
    const paginas = [...document.querySelectorAll('.page')];
    const scrolls = paginas.map(p => p.scrollTop);
    const pag = app.currentPage;
    const lbl = $('last_saved_lbl');
    const lblTxt = lbl?.textContent, lblCls = lbl?.className;
    const fotosPrev = { ...fotos };
    app._restaurandoFicha = true;
    app._charLoading = true;
    try {
      app.clearCharData();
      app.unlockApp();
      app.applyCharData(M);           // termina confirmando todas las tarjetas
      // _bulkEditing: sin él, reabrir Combate o Equipo desde otra página
      // lanza su scrollIntoView y descoloca el carril de páginas.
      app._bulkEditing = true;
      reabrir.forEach(s => { SEC[s].abrir(); if (fotosPrev[s]) fotos[s] = fotosPrev[s]; });
    } finally {
      app._bulkEditing = false;
      app._charLoading = false;
      app._restaurandoFicha = false;
    }
    if (typeof pag === 'number' && app.currentPage !== pag) app.goToPage(pag);
    paginas.forEach((p, i) => { p.scrollTop = scrolls[i]; });
    if (lbl) { lbl.textContent = lblTxt; lbl.className = lblCls; }
    refrescar();
  }

  app.cancelarEdicion = function (s) {
    const F = fotos[s];
    if (!F) { SEC[s].confirmar(); return; }
    const abiertas = NOMBRES.filter(x => x !== s && enEdicion(x));
    const M = mezclar(s, F, app.gatherCharData());
    delete fotos[s];
    restaurar(M, abiertas);
    app.toast('Cambios descartados', 'info');
  };

  /* ── Modo edición general ─────────────────────────────────────── */
  function salirModoGeneral() {
    modoGeneral = false;
    document.body.classList.remove('modo-edicion');
    const b = $('edit_terminar'); if (b) b.hidden = true;
    const it = $('sdial_modo_edicion'); if (it) it.classList.remove('is-on');
  }

  app.modoEdicion = function () {
    if (modoGeneral) { app.terminarEdicion(); return; }
    modoGeneral = true;
    document.body.classList.add('modo-edicion');
    // En bloque: Combate y Equipo harían scrollIntoView hacia su página
    // aunque estés en otra, y eso descoloca el carril (ver editSection).
    app._bulkEditing = true;
    try {
      NOMBRES.forEach(s => {
        const t = tarjeta(s);
        if (t && t.tagName === 'DETAILS') t.open = true;
        if (!enEdicion(s)) SEC[s].abrir();
      });
    } finally { app._bulkEditing = false; }
    const b = $('edit_terminar'); if (b) b.hidden = false;
    const it = $('sdial_modo_edicion'); if (it) it.classList.add('is-on');
    refrescar();
    app.toast('Modo edición: todas las tarjetas abiertas', 'info');
  };

  app.terminarEdicion = function () {
    NOMBRES.forEach(s => { if (enEdicion(s)) SEC[s].confirmar(); });
    salirModoGeneral();
    refrescar();
  };

  /* ── Montaje: lápices y botones de Cancelar ───────────────────── */
  function lapiz(s) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'edit-pen';
    b.dataset.sec = s;
    b.setAttribute('aria-label', 'Editar esta tarjeta');
    b.title = 'Editar';
    b.innerHTML = '<svg class="ico ico-solo" aria-hidden="true"><use href="#i-quill"/></svg>';
    b.addEventListener('click', e => {
      e.preventDefault();          // dentro de <summary>: que no pliegue
      e.stopPropagation();
      const t = tarjeta(s);
      if (t && t.tagName === 'DETAILS' && !t.open) t.open = true;
      if (!enEdicion(s)) SEC[s].abrir();
    });
    return b;
  }

  function montar() {
    NOMBRES.forEach(s => {
      const t = tarjeta(s);
      if (!t || t.querySelector(`.edit-pen[data-sec="${s}"]`)) return;
      const sum = t.tagName === 'DETAILS' ? t.querySelector(':scope > summary') : null;
      const pen = lapiz(s);
      if (sum) sum.appendChild(pen);
      else { pen.classList.add('edit-pen--esquina'); t.appendChild(pen); t.classList.add('con-lapiz'); }

      // Cancelar junto a Confirmar (el último .bcnf de la vista de edición)
      const v = vista(s);
      const cnf = v ? [...v.querySelectorAll('.bcnf')].pop() : null;
      if (cnf && !cnf.closest('.edit-acc')) {
        const fila = document.createElement('div');
        fila.className = 'edit-acc';
        const can = document.createElement('button');
        can.type = 'button';
        can.className = 'edit-cancel';
        can.dataset.sec = s;
        can.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-x"/></svg>Cancelar';
        can.addEventListener('click', () => app.cancelarEdicion(s));
        cnf.parentNode.insertBefore(fila, cnf);
        fila.append(can, cnf);
      }
    });

    // Botón flotante del modo general
    if (!$('edit_terminar')) {
      const b = document.createElement('button');
      b.type = 'button';
      b.id = 'edit_terminar';
      b.className = 'edit-terminar';
      b.hidden = true;
      b.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-check"/></svg>Terminar edición';
      b.addEventListener('click', () => app.terminarEdicion());
      ($('app-screen') || document.body).appendChild(b);
    }
    refrescar();
  }

  /** Lápiz oculto mientras la tarjeta se edita; Cancelar solo si hay foto. */
  function refrescar() {
    NOMBRES.forEach(s => {
      const t = tarjeta(s);
      if (!t) return;
      const ed = enEdicion(s);
      t.classList.toggle('editando', ed);
      const pen = t.querySelector(`.edit-pen[data-sec="${s}"]`);
      if (pen) pen.hidden = ed;
      const can = t.querySelector(`.edit-cancel[data-sec="${s}"]`);
      if (can) can.hidden = !fotos[s];
    });
    // Si ya no queda ninguna en edición, el modo general se da por terminado.
    if (modoGeneral && !NOMBRES.some(enEdicion)) salirModoGeneral();
  }

  montar();
  app._refrescarEdicion = refrescar;
})();
