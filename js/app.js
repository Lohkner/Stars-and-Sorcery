/* ══════════════════════════════════════════════════════════════
   S&S DIRECTOR — núcleo
   Pantallas, roster de amenazas, secciones editar/confirmar, guardado,
   exportación e importación. Se apoya en base.js (piezas genéricas
   heredadas de S&S Companion) y lo completan amenaza.js, biblioteca.js,
   mesa.js, asistente.js y editor.js.

   A diferencia de Companion, la ficha NO vive en los campos del DOM: la
   amenaza abierta es un objeto (`app.cr`) y las tarjetas se pintan a
   partir de él. Editar una tarjeta escribe en ese objeto; «Cancelar»
   restaura la foto que se tomó al abrirla.
══════════════════════════════════════════════════════════════ */
Object.assign(app, {
  DB: {},
  cr: null,                     // la amenaza abierta
  modo: 'ficha',                // 'ficha' (una amenaza) | 'mesa' (Mesa del Director)
  currentPage: 0,
  totalPages: 4,
  scrollPreserve: false,
  _pageScrolls: {},
  cropState: {img:null, x:0, y:0, zoom:1, rot:0, minZoom:.05, isDragging:false, lastX:0, lastY:0, pinch:null, velX:0, velY:0},
  _charLoading: false,          // silencia _markUnsaved mientras se carga o se limpia
  _nombreOriginal: '',          // clave del roster de la que salió la amenaza abierta
  _fotos: {},                   // sección → foto de sus campos al entrar en edición

  /* Qué campos de la amenaza toca cada tarjeta editable: es lo que
     «Cancelar» devuelve a como estaba. */
  SECS: {
    personal: { card: 'card_personal', campos: ['nombre', 'idea', 'retrato'] },
    identity: { card: 'card_identity', campos: ['na', 'tipo', 'tam', 'rol', 'estructura', 'miembros', 'rasgos', 'fuertes', 'debiles', 'moralNoTira', 'pvAct'] },
    stats:    { card: 'fold_stats',    campos: ['manual', 'pvAct'] },
    defensa:  { card: 'fold_defensa',  campos: ['manual', 'resisteTodo'] },
    attack:   { card: 'fold_ataques',  campos: ['ataqueNombre', 'danoTipo', 'manual'] },
    saves:    { card: 'fold_salv',     campos: ['fuertes', 'debiles', 'moralNoTira', 'pvAct'] },
    senal:    { card: 'fold_senal',    campos: ['senal', 'contexto', 'habitat', 'quiere', 'pelea', 'botin'] },
    jefe:     { card: 'fold_jefe',     campos: ['jefe'] },
  },

  init() {
    STORAGE.alFallarEscritura = () => this.toast('No se pudo guardar en el dispositivo: crea una copia en Ajustes', 'err');
    // Un solo oyente reparte los [data-action] sin argumentos.
    document.addEventListener('click', e => {
      if (this._confirmOpen) return;
      const el = e.target.closest('[data-action]');
      if (!el) return;
      const fn = el.getAttribute('data-action');
      if (fn && typeof this[fn] === 'function') this[fn]();
    });
    // Al enfocar un campo numérico se selecciona su contenido.
    document.addEventListener('focusin', e => {
      const el = e.target;
      if (el.tagName !== 'INPUT') return;
      if (el.type !== 'number' && el.getAttribute('inputmode') !== 'numeric') return;
      requestAnimationFrame(() => { try { el.select(); } catch (_) {} });
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const el = e.target;
      if (el.tagName === 'INPUT' && (el.type === 'number' || el.getAttribute('inputmode') === 'numeric')) el.blur();
    });

    try { this.DB = STORAGE.loadRules(); }
    catch (e) { this.DB = structuredClone(DEFAULT_DB); }
    this._asegurarDB();

    this.cr = this.nuevaCr();
    this.renderHome();
    this.setupSwipe();
    this._initDiceSwipe();
    this._setupEscapeKey();
    this._initGrainTexture();
    const ws = document.getElementById('crop_ws');
    if (ws) ws.addEventListener('wheel', e => this._cropWheel(e), { passive: false });
    this._restoreFontSize();
    this._restoreScrollPreserve();
    this._restorePortraitSettings();
    this._restoreTheme();
    this._restoreEstiloLetra();
    this._restoreBgImages();
    this._initResLongPress();
    this._initAdvFabAutoOcultar();
    this._montarSecciones();
    this._enlazarFicha();
    this.initMesa();
  },

  /** Si unas reglas importadas o antiguas no traen alguna categoría, se
      completa con la de fábrica: la app nunca se queda sin una tabla. */
  _asegurarDB() {
    Object.keys(DEFAULT_DB).forEach(k => {
      const v = this.DB[k];
      if (v == null || typeof v !== 'object') this.DB[k] = structuredClone(DEFAULT_DB[k]);
    });
    Object.keys(DEFAULT_DB.tablas).forEach(k => {
      if (!this.DB.tablas[k] || !Array.isArray(this.DB.tablas[k].filas)) this.DB.tablas[k] = structuredClone(DEFAULT_DB.tablas[k]);
    });
  },

  /* ── Utilidades ───────────────────────────────────────────────── */
  h(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  },
  _el(id) { return document.getElementById(id); },
  _signo(n) { return (n >= 0 ? '+' : '−') + Math.abs(n); },
  _azar(lista) { return lista[Math.floor(Math.random() * lista.length)]; },
  _d(caras) { return 1 + Math.floor(Math.random() * caras); },
  _norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); },
  _slug(s) { return this._norm(s).replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); },
  _ico(id) { return `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`; },
  _uidSeq: 0,
  _uid() { this._uidSeq = Math.max(this._uidSeq + 1, Date.now()); return String(this._uidSeq); },

  /** Tira en una tabla de la base de reglas y la enseña en la tarjeta del
      dado. Devuelve el texto de la fila. */
  tirarTabla(clave, etiqueta) {
    const t = this.DB.tablas[clave];
    if (!t || !t.filas.length) return '';
    const n = t.filas.length;
    const r = this._d(n);
    this.showDiceRoll({ label: etiqueta || t.name, die: n, finalFaces: [r], isCrit: false, isFail: false,
      detail: t.filas[r - 1], total: r, totalLabel: 'Daño' });
    return t.filas[r - 1];
  },

  /* ── Pantallas ────────────────────────────────────────────────── */
  showScreen(id) {
    document.getElementById('home-screen').classList.toggle('hidden', id !== 'home');
    document.getElementById('app-screen').classList.toggle('hidden', id !== 'app');
    if (id === 'home') {
      // iOS: un translateX distinto de cero en el carril desplaza los fixed.
      const track = document.getElementById('pages_track');
      if (track) { track.style.transition = 'none'; track.style.transform = 'translateX(0)'; }
      this.currentPage = 0;
    }
    if (id !== 'home') {
      const el = document.getElementById('home-roster');
      if (el?._swipeCloseHandler) {
        document.removeEventListener('touchstart', el._swipeCloseHandler);
        el._swipeCloseHandler = null;
      }
    }
  },

  /** La ficha y la Mesa comparten armazón (cabecera, carril de páginas y
      barra inferior): `data-modo` decide qué páginas y qué barra se ven. */
  _ponerModo(modo) {
    this.modo = modo;
    const s = document.getElementById('app-screen');
    s.dataset.modo = modo;
    this.totalPages = this._paginas().length;
    this._pageScrolls = {};
    const track = document.getElementById('pages_track');
    if (track) { track.style.transition = 'none'; track.style.transform = 'translateX(0)'; }
    this.currentPage = 0;
  },
  _paginas() {
    return [...document.querySelectorAll('#pages_track .page')].filter(p => p.dataset.modo === this.modo);
  },
  _nav() { return document.querySelector(`.bnav[data-modo="${this.modo}"]`); },

  goToPage(n, snapMs) {
    if (n !== this.currentPage && navigator.vibrate) navigator.vibrate(4);
    const pags = this._paginas();
    if (this.scrollPreserve && pags[this.currentPage]) this._pageScrolls[this.currentPage] = pags[this.currentPage].scrollTop;
    this.currentPage = n;
    const w = document.getElementById('pages_wrapper');
    const track = document.getElementById('pages_track');
    const pageW = w ? w.clientWidth : window.innerWidth;
    track.style.transition = `transform ${snapMs || 220}ms cubic-bezier(.25,.46,.45,.94)`;
    this._snapUntil = Date.now() + (snapMs || 220) + 60;
    track.style.transform = `translateX(-${n * pageW}px)`;
    const nav = this._nav();
    if (nav) {
      nav.querySelectorAll('.nbtn').forEach((b, i) => b.classList.toggle('active', i === n));
      const thread = nav.querySelector('.nav-thread');
      if (thread) thread.style.transform = `translateX(${n * 100}%)`;
    }
    const dest = pags[n];
    if (dest) {
      const saved = this._pageScrolls[n];
      if (this.scrollPreserve && saved != null) requestAnimationFrame(() => { dest.scrollTop = saved; });
      else dest.scrollTop = 0;
    }
  },

  goHome() {
    const salir = () => { this._salirModoEdicion(); this.renderHome(); this.showScreen('home'); };
    const lbl = document.getElementById('last_saved_lbl');
    if (this.modo === 'ficha' && lbl?.classList.contains('unsaved')) {
      const n = this.cr?.nombre || 'Esta amenaza';
      this._confirm('¿Salir sin guardar?', `«${n}» tiene cambios sin guardar. Se perderán.`, 'Salir', salir);
    } else salir();
  },

  /* ── Amenazas: crear, abrir, ordenar, borrar ──────────────────── */
  /** «Nueva amenaza». asistente.js lo envuelve para abrir los pasos guiados. */
  newChar() { this.nuevaAmenazaManual(); },

  nuevaAmenazaManual() {
    this._abrirFicha(this.nuevaCr(), '');
    this._bulk = true;
    this.editSection('personal');
    this.editSection('identity');
    this._bulk = false;
    requestAnimationFrame(() => document.getElementById('char_name')?.focus());
  },

  /** Pone una amenaza en la ficha (sin guardarla) y enseña la pantalla. */
  _abrirFicha(cr, nombreOriginal) {
    this._charLoading = true;
    this.limpiarFicha();
    this.cr = this.normalizarCr(cr);
    this._nombreOriginal = nombreOriginal || '';
    this._ponerModo('ficha');
    this.showScreen('app');
    this.pintarFicha(true);
    this.goToPage(0);
    const lbl = document.getElementById('last_saved_lbl');
    if (lbl) { lbl.textContent = ''; lbl.className = 'last-saved'; }
    const ttl = document.getElementById('app_hdr_ttl');
    if (ttl) ttl.textContent = 'Stars & Sorcery';
    this._charLoading = false;
  },

  loadCharToApp(name) {
    const roster = STORAGE.loadRoster();
    const data = roster[name];
    if (!data) return;
    this._abrirFicha(data, name);
    this.toast(`Cargada: ${name}`, 'ok');
  },

  /** Deja la ficha sin amenaza: cierra ediciones y olvida las fotos. */
  limpiarFicha() {
    Object.keys(this._fotos).forEach(k => delete this._fotos[k]);
    Object.keys(this.SECS).forEach(s => this._verSeccion(s, false));
    this._salirModoEdicion();
  },

  moveChar(name, dir) {
    const roster = STORAGE.loadRoster();
    const keys = Object.keys(roster);
    const i = keys.indexOf(name);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= keys.length) return;
    [keys[i], keys[j]] = [keys[j], keys[i]];
    const reordered = {};
    keys.forEach(k => { reordered[k] = roster[k]; });
    STORAGE.saveRoster(reordered);
    if (navigator.vibrate) navigator.vibrate(6);
    this.renderHome();
  },

  /** Retrato fiable: solo data-URL de imagen (viene de JSON importado y se
      interpola en un src). */
  _retratoOk(src) {
    return typeof src === 'string' && src !== DEFAULT_PORTRAIT &&
      /^data:image\/(png|jpe?g|webp|gif|avif);base64,[A-Za-z0-9+/=]+$/.test(src);
  },

  /** Línea corta de una amenaza: «Bestia grande · Acechador». */
  _lineaCr(cr) {
    const tipo = this.DB.tipos[cr.tipo]?.name || '';
    const tam = this.DB.tamanos[cr.tam]?.name || '';
    const rol = this.DB.roles[cr.rol]?.name || 'Sin Rol';
    const cuerpo = [tipo, tam && tam !== 'Mediano' ? tam.toLowerCase() : ''].filter(Boolean).join(' ');
    return [cuerpo, rol].filter(Boolean).join(' · ');
  },
  _etiquetaNA(cr) {
    // Una horda es una sola criatura de su NA efectivo: ese es el que se enseña
    const horda = cr.estructura === 'horda';
    const na = horda ? Math.min(15, cr.na + this._horda(cr.miembros).na) : cr.na;
    return 'NA ' + na + (cr.estructura === 'jefe' ? ' · Jefe' : horda ? ' · Horda' : '');
  },

  renderHome() {
    const el = document.getElementById('home-roster');
    if (el._swipeCloseHandler) {
      document.removeEventListener('touchstart', el._swipeCloseHandler);
      el._swipeCloseHandler = null;
    }
    const roster = STORAGE.loadRoster();
    const keys = Object.keys(roster);
    if (!keys.length) {
      el.innerHTML = `
        <div class="home-empty">
          <div class="home-empty-icon">✦</div>
          <div class="home-empty-title">Sin amenazas guardadas</div>
          <div class="home-empty-sub">Crea una nueva o tráela<br>del Bestiario para comenzar.</div>
        </div>`;
      return;
    }
    el.innerHTML = '';
    const SNAP = 'transform .2s cubic-bezier(.25,.46,.45,.94)';
    const BTN_W = 80, ORD_W = 80;

    keys.forEach((name, i) => {
      const data = this.normalizarCr(roster[name]);
      const portHtml = this._retratoOk(data.retrato)
        ? `<img class="char-port" src="${data.retrato}" alt="">`
        : `<div class="char-port-ph">✦</div>`;

      const wrap = this.h('div', 'char-card-wrap');
      wrap.style.animationDelay = `${i * 50}ms`;

      const delBtn = this.h('button', 'char-card-delete');
      delBtn.setAttribute('aria-label', `Eliminar ${name}`);
      delBtn.innerHTML = `<span class="del-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></span><span>Borrar</span>`;

      const card = this.h('div', 'char-card');
      card.innerHTML = `
        ${portHtml}
        <div class="char-ci">
          <div class="char-cn">${this._esc(name)}</div>
          <div class="char-cs">${this._esc(this._lineaCr(data))}</div>
          <div style="margin-top:3px"><span class="char-lvl-badge">${this._esc(this._etiquetaNA(data))}</span></div>
        </div>
        <span class="char-card-arrow">›</span>`;

      wrap.appendChild(delBtn);
      wrap.appendChild(card);
      el.appendChild(wrap);

      const ordPanel = this.h('div', 'char-card-order');
      [[-1, 'Subir'], [1, 'Bajar']].forEach(([dir, lbl]) => {
        const b = this.h('button', 'char-ord-btn');
        b.type = 'button';
        b.setAttribute('aria-label', `${lbl} a ${name}`);
        b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${dir < 0 ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'}"/></svg>`;
        b.disabled = (dir < 0 && i === 0) || (dir > 0 && i === keys.length - 1);
        b.addEventListener('pointerup', ev => ev.stopPropagation());
        b.addEventListener('click', ev => { ev.stopPropagation(); this.moveChar(name, dir); });
        ordPanel.appendChild(b);
      });
      wrap.appendChild(ordPanel);

      const setPos = (x, animated) => {
        const t = animated ? SNAP : 'none';
        card.style.transition = t; delBtn.style.transition = t; ordPanel.style.transition = t;
        card.style.transform = `translateX(${x}px)`;
        delBtn.style.transform = `translateX(${100 + (Math.min(x, 0) / BTN_W) * 100}%)`;
        ordPanel.style.transform = `translateX(${-100 + (Math.max(x, 0) / ORD_W) * 100}%)`;
      };
      const reveal  = () => { setPos(-BTN_W, true); card._swiped = true;  card._swipedR = false; };
      const revealR = () => { setPos(ORD_W,  true); card._swipedR = true; card._swiped  = false; };
      const conceal = () => { setPos(0,      true); card._swiped = false; card._swipedR = false; };
      card._conceal = conceal;

      let startX = 0, startY = 0, curX = 0, axisLocked = false, isHoriz = false;
      card.addEventListener('touchstart', e => {
        const t = e.touches[0];
        startX = curX = t.clientX; startY = t.clientY;
        axisLocked = false; isHoriz = false;
        card.style.transition = 'none'; delBtn.style.transition = 'none';
      }, { passive: true });
      card.addEventListener('touchmove', e => {
        const t = e.touches[0];
        const ddx = t.clientX - startX, ddy = t.clientY - startY;
        if (!axisLocked) {
          if (Math.abs(ddx) < 4 && Math.abs(ddy) < 4) return;
          isHoriz = Math.abs(ddx) > Math.abs(ddy);
          axisLocked = true;
        }
        if (!isHoriz) return;
        e.preventDefault();
        curX = t.clientX;
        const base = card._swiped ? -BTN_W : card._swipedR ? ORD_W : 0;
        setPos(Math.max(-BTN_W, Math.min(ORD_W, base + (curX - startX))), false);
      }, { passive: false });
      card.addEventListener('touchend', () => {
        if (!axisLocked || !isHoriz) return;
        const delta = curX - startX;
        if (card._swiped) delta > 20 ? conceal() : reveal();
        else if (card._swipedR) delta < -20 ? conceal() : revealR();
        else if (delta < -30) reveal();
        else if (delta > 30) revealR();
        else conceal();
      }, { passive: true });

      delBtn.addEventListener('pointerup', e => { e.stopPropagation(); this._borrarAmenaza(name); });
      card.addEventListener('click', () => {
        if (card._swiped || card._swipedR) { conceal(); return; }
        this.loadCharToApp(name);
      });
    });

    el._swipeCloseHandler = e => {
      el.querySelectorAll('.char-card').forEach(c => {
        if (!c._swiped && !c._swipedR) return;
        if (!c.closest('.char-card-wrap').contains(e.target) && c._conceal) c._conceal();
      });
    };
    document.addEventListener('touchstart', el._swipeCloseHandler, { passive: true });
  },

  _borrarAmenaza(name) {
    this._confirm('¿Eliminar amenaza?', `«${name}» se eliminará de este dispositivo.`, 'Eliminar', () => {
      STORAGE.deleteChar(name);
      this.renderHome();
      this.toast(`«${name}» eliminada`, 'ok');
    });
  },

  deleteCurrentChar() {
    const name = this._nombreOriginal;
    if (!name || !STORAGE.loadRoster()[name]) { this.toast('Esta amenaza aún no está guardada', 'err'); return; }
    this._confirm('¿Eliminar amenaza?', `«${name}» se eliminará de este dispositivo.`, 'Eliminar', () => {
      STORAGE.deleteChar(name);
      this.renderHome();
      this.showScreen('home');
      this.toast(`«${name}» eliminada`, 'ok');
    });
  },

  /** Nombre libre en el roster a partir de uno base: «Lobo», «Lobo 2»… */
  _nombreLibre(base, roster) {
    roster = roster || STORAGE.loadRoster();
    if (!roster[base]) return base;
    let n = 2;
    while (roster[`${base} ${n}`]) n++;
    return `${base} ${n}`;
  },

  duplicarAmenaza() {
    const copia = structuredClone(this.cr);
    copia.nombre = this._nombreLibre((this.cr.nombre || 'Amenaza') + ' (copia)');
    this._abrirFicha(copia, '');
    this._markUnsaved();
    this.toast('Copia abierta: guárdala para conservarla', 'info');
  },

  /* ── Secciones: editar · confirmar · cancelar ─────────────────── */
  _vista(sec, cual) { return document.getElementById(`${sec}_${cual}_view`); },
  _enEdicion(sec) {
    const v = this._vista(sec, 'edit');
    return !!v && v.style.display !== 'none';
  },
  /** Enseña la vista de edición o la de resumen de una tarjeta. */
  _verSeccion(sec, editar) {
    const ev = this._vista(sec, 'edit'), sv = this._vista(sec, 'summary');
    if (ev) ev.style.display = editar ? 'block' : 'none';
    if (sv) sv.style.display = editar ? 'none' : 'block';
    const card = document.getElementById(this.SECS[sec].card);
    if (card) {
      card.classList.toggle('editando', !!editar);
      if (sec === 'identity') card.classList.toggle('identity-editing', !!editar);
      const pen = card.querySelector(`.edit-pen[data-sec="${sec}"]`);
      if (pen) pen.hidden = !!editar;
    }
  },

  editSection(sec) {
    if (!this.SECS[sec] || this._enEdicion(sec)) return;
    const foto = {};
    this.SECS[sec].campos.forEach(c => { foto[c] = structuredClone(this.cr[c]); });
    this._fotos[sec] = foto;
    const pintar = this['_editar_' + sec];
    if (typeof pintar === 'function') pintar.call(this);
    this._verSeccion(sec, true);
    const ev = this._vista(sec, 'edit');
    if (ev) { ev.classList.remove('section-reveal'); void ev.offsetWidth; ev.classList.add('section-reveal'); }
    const card = document.getElementById(this.SECS[sec].card);
    if (card && card.tagName === 'DETAILS') card.open = true;
  },

  confirmSection(sec) {
    if (!this.SECS[sec]) return;
    this._flashConfirm(sec);
    delete this._fotos[sec];
    this._verSeccion(sec, false);
    this.pintarFicha();
    const sv = this._vista(sec, 'summary');
    if (sv) { sv.classList.remove('sum-reveal'); void sv.offsetWidth; sv.classList.add('sum-reveal'); }
    if (this._modoEdicion && !Object.keys(this.SECS).some(s => this._enEdicion(s))) this._salirModoEdicion();
  },

  cancelarEdicion(sec) {
    const foto = this._fotos[sec];
    if (foto) Object.keys(foto).forEach(c => { this.cr[c] = foto[c]; });
    delete this._fotos[sec];
    this._verSeccion(sec, false);
    this.pintarFicha(true);
    this.toast('Cambios descartados', 'info');
    if (this._modoEdicion && !Object.keys(this.SECS).some(s => this._enEdicion(s))) this._salirModoEdicion();
  },

  /** Lápiz en la cabecera de cada tarjeta editable y «Cancelar» junto a
      «Confirmar». Las vistas de edición se pintan al abrirse, así que los
      botones de pie los pone _pieEdicion() cada vez. */
  _montarSecciones() {
    Object.keys(this.SECS).forEach(sec => {
      const card = document.getElementById(this.SECS[sec].card);
      if (!card || card.querySelector(`.edit-pen[data-sec="${sec}"]`)) return;
      const b = this.h('button', 'edit-pen');
      b.type = 'button';
      b.dataset.sec = sec;
      b.title = 'Editar';
      b.setAttribute('aria-label', 'Editar esta tarjeta');
      b.innerHTML = '<svg class="ico ico-solo" aria-hidden="true"><use href="#i-quill"/></svg>';
      b.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        this.editSection(sec);
      });
      const sum = card.tagName === 'DETAILS' ? card.querySelector(':scope > summary') : null;
      if (sum) sum.appendChild(b);
      else { b.classList.add('edit-pen--esquina'); card.appendChild(b); card.classList.add('con-lapiz'); }
    });
    // La tarjeta del retrato tiene su vista de edición en el HTML: su
    // «Confirmar» recibe aquí a su compañero «Cancelar».
    const cnf = document.querySelector('#personal_edit_view .bcnf');
    if (cnf && !cnf.closest('.edit-acc')) {
      const fila = this.h('div', 'edit-acc');
      cnf.parentNode.insertBefore(fila, cnf);
      fila.append(this._botonCancelar('personal'), cnf);
    }
    const t = this.h('button', 'edit-terminar');
    t.type = 'button'; t.id = 'edit_terminar'; t.hidden = true;
    t.innerHTML = this._ico('i-check') + 'Terminar edición';
    t.addEventListener('click', () => this.terminarEdicion());
    document.getElementById('app-screen').appendChild(t);
  },
  _botonCancelar(sec) {
    const can = this.h('button', 'edit-cancel');
    can.type = 'button';
    can.innerHTML = this._ico('i-x') + 'Cancelar';
    can.addEventListener('click', () => this.cancelarEdicion(sec));
    return can;
  },
  /** Fila «Cancelar | Confirmar» al pie de una vista de edición. */
  _pieEdicion(sec) {
    const fila = this.h('div', 'edit-acc');
    const cnf = this.h('button', 'bcnf');
    cnf.type = 'button';
    cnf.innerHTML = this._ico('i-check') + 'Confirmar';
    cnf.addEventListener('click', () => this.confirmSection(sec));
    fila.append(this._botonCancelar(sec), cnf);
    return fila;
  },

  /* Modo edición: todas las tarjetas a la vez y un único «Terminar». */
  _modoEdicion: false,
  modoEdicion() {
    if (this._modoEdicion) { this.terminarEdicion(); return; }
    this._modoEdicion = true;
    document.body.classList.add('modo-edicion');
    Object.keys(this.SECS).forEach(s => {
      const card = document.getElementById(this.SECS[s].card);
      if (card && !card.hidden) this.editSection(s);
    });
    document.getElementById('edit_terminar').hidden = false;
    document.getElementById('sdial_modo_edicion')?.classList.add('is-on');
    this.toast('Modo edición: todas las tarjetas abiertas', 'info');
  },
  terminarEdicion() {
    Object.keys(this.SECS).forEach(s => { if (this._enEdicion(s)) this.confirmSection(s); });
    this._salirModoEdicion();
  },
  _salirModoEdicion() {
    this._modoEdicion = false;
    document.body.classList.remove('modo-edicion');
    const b = document.getElementById('edit_terminar'); if (b) b.hidden = true;
    document.getElementById('sdial_modo_edicion')?.classList.remove('is-on');
  },

  /* ── Guardado ─────────────────────────────────────────────────── */
  _markUnsaved() {
    if (this._charLoading || this.modo !== 'ficha') return;
    const lbl = document.getElementById('last_saved_lbl');
    if (!lbl || lbl.classList.contains('unsaved')) return;
    lbl.classList.remove('fresh');
    lbl.classList.add('unsaved');
    lbl.textContent = 'sin guardar';
  },

  saveChar() {
    if (this._saving || this.modo !== 'ficha') return;
    const name = (this.cr.nombre || '').trim();
    if (!name) { this.toast('Ponle un nombre antes de guardar', 'err'); this.editSection('personal'); return; }
    this._saving = true;
    const soltar = () => { this._saving = false; };
    const roster = STORAGE.loadRoster();
    // Pisar OTRA amenaza con el mismo nombre pide confirmación; guardar la
    // misma (o renombrarla) no.
    if (roster[name] && name !== this._nombreOriginal) {
      this._confirm('¿Sobrescribir amenaza?', `Ya existe «${name}» y será reemplazada.`, 'Sobrescribir',
        () => { this._doSaveChar(name, roster); soltar(); }, document.body, soltar);
    } else { this._doSaveChar(name, roster); soltar(); }
  },

  _doSaveChar(name, roster) {
    roster = roster || STORAGE.loadRoster();
    const datos = structuredClone(this.cr);
    datos.nombre = name;
    const viejo = this._nombreOriginal;
    let nuevo = roster;
    if (viejo && viejo !== name && roster[viejo]) {
      // Renombrada: conserva su sitio en la lista.
      nuevo = {};
      Object.keys(roster).forEach(k => { if (k === viejo) nuevo[name] = datos; else if (k !== name) nuevo[k] = roster[k]; });
    } else nuevo[name] = datos;
    const ok = STORAGE.saveRoster(nuevo);
    if (!ok) { this.toast('¡Almacenamiento lleno! Exporta la amenaza.', 'err'); return; }
    this._nombreOriginal = name;
    const ts = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });
    const lbl = document.getElementById('last_saved_lbl');
    if (lbl) {
      lbl.classList.remove('unsaved');
      lbl.textContent = `guardado ${ts}`;
      lbl.classList.add('fresh');
      setTimeout(() => lbl.classList.remove('fresh'), TIMING.SAVED_FRESH);
    }
    const saveBtn = document.querySelector('.app-hdr-save');
    if (saveBtn) {
      saveBtn.classList.remove('saved'); void saveBtn.offsetWidth; saveBtn.classList.add('saved');
      setTimeout(() => saveBtn.classList.remove('saved'), 750);
    }
    this.toast('Amenaza guardada', 'ok');
  },

  /** ¿Hay una amenaza abierta (ficha visible)? */
  _charOpen() {
    const s = document.getElementById('app-screen');
    return !!s && !s.classList.contains('hidden') && this.modo === 'ficha';
  },

  exportJSON() {
    if (!this._charOpen()) {
      this.toast('Abre una amenaza para exportarla, o usa «Crear copia» para todo', 'info');
      const est = document.getElementById('respaldo_estado');
      if (est) { est.textContent = 'Abre una amenaza para exportarla, o usa «Crear copia» para todo.'; est.classList.remove('is-ok'); est.classList.add('is-err'); }
      return;
    }
    const name = ((this.cr.nombre || '').trim() || 'amenaza').replace(/ /g, '_');
    const datos = { tipo: 'ss-director-amenaza', version: 1, amenaza: this.cr };
    this.guardarArchivo(name + '.json', JSON.stringify(datos, null, 2)).then(r => {
      if (r === 'descargado') this.toast('Amenaza exportada', 'ok');
      if (r === 'compartido') this.toast('Amenaza compartida', 'ok');
    });
  },

  triggerLoadJSON() { document.getElementById('json_char_input').click(); },

  loadJSON(input) {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (file.size > MAX_JSON_BYTES * 4) { this.toast('El archivo es demasiado grande', 'err'); return; }
    const r = new FileReader();
    r.onload = e => {
      try {
        const raw = JSON.parse(e.target.result);
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Formato inválido');
        if (raw.tipo === 'ss-director-respaldo') throw new Error('Es una copia completa: restáurala desde Ajustes → Copias y datos');
        const cr = raw.tipo === 'ss-director-amenaza' ? raw.amenaza : raw;
        if (!cr || typeof cr !== 'object' || !('na' in cr)) throw new Error('No es una amenaza de S&S Director');
        if (document.getElementById('settings_modal')?.open) this._closeSettingsDlg();
        this._abrirFicha(cr, '');
        this._markUnsaved();
        this.toast('Amenaza importada: guárdala para conservarla', 'ok');
      } catch (err) { this.toast(err.message || 'JSON inválido', 'err'); }
    };
    r.readAsText(file);
  },

  /* ── Reglas ───────────────────────────────────────────────────── */
  saveRulesToLocal() {
    const ok = STORAGE.saveRules(this.DB);
    if (!ok) this.toast('No se pudieron guardar las reglas: almacenamiento lleno.', 'err');
    return ok;
  },
  exportRulesDB() {
    this.guardarArchivo('ss_director_reglas.json', JSON.stringify(this.DB, null, 2));
  },
  loadRulesFile(input) {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const r = new FileReader();
    r.onload = e => {
      try {
        const raw = JSON.parse(e.target.result);
        if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !raw.na || !raw.rasgos) {
          throw new Error('No son reglas de S&S Director (faltan la tabla por NA o la Biblioteca)');
        }
        // Texto de terceros: fuera etiquetas HTML antes de usarlo.
        const limpiar = v => typeof v === 'string' ? this._sanitize(v)
          : Array.isArray(v) ? v.map(limpiar)
          : (v && typeof v === 'object') ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, limpiar(x)])) : v;
        this.DB = limpiar(raw);
        this._asegurarDB();
        this.saveRulesToLocal();
        if (this._charOpen()) this.pintarFicha(true);
        this.toast('Reglas importadas', 'ok');
        const est = document.getElementById('respaldo_estado');
        if (est) { est.textContent = 'Reglas importadas.'; est.classList.add('is-ok'); est.classList.remove('is-err'); }
      } catch (err) { this.toast(err.message || 'JSON de reglas inválido', 'err'); }
    };
    r.readAsText(file);
  },

  /* ── Retrato ──────────────────────────────────────────────────── */
  /** Punto único: el recorte (base.js) y la carga de la ficha pasan por aquí. */
  _syncPortrait(src) {
    const ok = this._retratoOk(src);
    const s = ok ? src : DEFAULT_PORTRAIT;
    const a = document.getElementById('char_img');
    const b = document.getElementById('char_img_summary');
    if (a) a.src = s;
    if (b) b.setAttribute('src', s);
    if (this.cr && !this._pintando) {
      const nuevo = ok ? src : '';
      if ((this.cr.retrato || '') !== nuevo) { this.cr.retrato = nuevo; this._markUnsaved(); }
    }
    // El asistente recorta su retrato con el mismo cuadro.
    if (typeof this._retratoRecortado === 'function' && ok) this._retratoRecortado(src);
  },

  _restorePortraitSettings() {
    this._portBorderMode = localStorage.getItem('ssd_port_border') || 'premium';
    this._applyPortraitBorder();
    this.setPortraitSize(localStorage.getItem(STORAGE.KEYS.portSize) || 'm');
    this.setPortraitShape(localStorage.getItem(STORAGE.KEYS.portShape) || 'rounded');
  },

  /* ── Ajustes ──────────────────────────────────────────────────── */
  openSettings() {
    this._tapShield();
    const exp = document.getElementById('set_export_char');
    if (exp) { exp.disabled = false; exp.classList.toggle('is-apagado', !this._charOpen()); }
    this._pintarEspacio();
    this._syncSeccionesAjustes();
    const rv = document.getElementById('set_rules_ver');
    if (rv) rv.textContent = STORAGE.RULES_DATA_VERSION;
    this._stampAppVersion();
    const dlg = document.getElementById('settings_modal');
    if (!dlg) return;
    if (!dlg.open) {
      if (typeof dlg.showModal === 'function') {
        try { dlg.showModal(); } catch (_) { dlg.setAttribute('open', ''); }
      } else dlg.setAttribute('open', '');
    }
  },

  _setupEscapeKey() {
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (this._charOpen()) this.saveChar();
        return;
      }
      if (e.key !== 'Escape') return;
      const menu = document.getElementById('sdial_menu');
      const btn = document.querySelector('.sdial-btn');
      if (menu?.classList.contains('open')) {
        menu.classList.remove('open');
        btn?.classList.remove('open');
        btn?.setAttribute('aria-expanded', 'false');
        return;
      }
      const dice = document.getElementById('dice-overlay');
      if (dice?.classList.contains('active')) { this.closeDiceOverlay(); return; }
      const panel = [...document.querySelectorAll('.fs-panel.fs-open')].pop();
      if (panel) panel.querySelector('.fs-hdr-back')?.click();
    });
  },

  /* ── Selector genérico a pantalla completa ────────────────────── */
  /** opts: { titulo, sub, buscar, items:[{k,nombre,etiqueta,texto,sub,sel}],
              alElegir(k, item) → se repinta la lista si devuelve true,
              info() → texto del pie, alCerrar() } */
  abrirSelector(opts) {
    this._tapShield();
    this._sel = opts;
    const p = document.getElementById('sel_panel');
    document.getElementById('sel_ttl').textContent = opts.titulo || 'Elegir';
    document.getElementById('sel_sub').textContent = opts.sub || '';
    const s = document.getElementById('sel_search');
    s.value = '';
    s.placeholder = opts.buscar || 'Buscar…';
    p.classList.add('fs-open');
    document.body.style.overflow = 'hidden';
    this._selPintar();
    this._attachPanelSwipeBack(p, () => this.cerrarSelector());
  },
  cerrarSelector() {
    this._tapShield();
    const p = document.getElementById('sel_panel');
    if (!p.classList.contains('fs-open')) return;
    p.style.transform = ''; p.style.opacity = '';
    p.classList.remove('fs-open');
    document.body.style.overflow = '';
    const o = this._sel; this._sel = null;
    if (o && typeof o.alCerrar === 'function') o.alCerrar();
  },
  _selFiltro() {
    if (!this._selDeb) this._selDeb = this._debounce(() => this._selPintar(), 90);
    this._selDeb();
  },
  _selPintar() {
    const o = this._sel; if (!o) return;
    const host = document.getElementById('sel_list');
    const q = this._norm(document.getElementById('sel_search').value).split(/\s+/).filter(Boolean);
    const items = (typeof o.items === 'function' ? o.items() : o.items)
      .filter(it => !q.length || q.every(w => this._norm(it.nombre + ' ' + (it.etiqueta || '') + ' ' + (it.texto || '')).includes(w)));
    const y = host.scrollTop;
    host.textContent = '';
    if (!items.length) host.appendChild(this.h('p', 'tm-empty', o.vacio || 'Nada que mostrar.'));
    items.forEach(it => {
      const b = this.tarjetaOpcion(it.nombre, it.etiqueta, it.texto, it.sub, it.sel, () => {
        const repintar = o.alElegir && o.alElegir(it.k, it);
        if (repintar && this._sel === o) this._selPintar();
      });
      host.appendChild(b);
    });
    host.scrollTop = y;
    const info = document.getElementById('sel_info');
    if (info) info.textContent = typeof o.info === 'function' ? o.info() : (o.info || '');
  },

  /** Tarjeta de opción (la del asistente de Companion): nombre, etiqueta,
      texto y línea secundaria. */
  tarjetaOpcion(nombre, etiqueta, texto, sub, sel, onClick) {
    const btn = this.h('button', 'wiz-opt' + (sel ? ' sel' : ''));
    btn.type = 'button';
    const cab = this.h('div', 'wiz-opt-h');
    cab.appendChild(this.h('span', 'wiz-opt-n', nombre));
    if (etiqueta) cab.appendChild(this.h('span', 'wiz-opt-tag', etiqueta));
    btn.appendChild(cab);
    if (texto) btn.appendChild(this.h('span', 'wiz-opt-t', texto));
    if (sub) btn.appendChild(this.h('span', 'wiz-opt-sub', sub));
    btn.onclick = onClick;
    return btn;
  },

  /* ── Bestiario ────────────────────────────────────────────────── */
  abrirBestiario() {
    const claves = () => Object.keys(this.DB.bestiario)
      .sort((a, b) => (this.DB.bestiario[a].na - this.DB.bestiario[b].na) || this.DB.bestiario[a].nombre.localeCompare(this.DB.bestiario[b].nombre));
    this.abrirSelector({
      titulo: 'Bestiario',
      sub: 'Toca una criatura para traerla a tus amenazas',
      buscar: 'Buscar criatura…',
      items: () => {
        const roster = STORAGE.loadRoster();
        return claves().map(k => {
          const c = this.normalizarCr(this.DB.bestiario[k]);
          const ya = !!roster[c.nombre];
          return { k, nombre: c.nombre, etiqueta: ya ? '✓ en tus amenazas' : this._etiquetaNA(c),
            texto: (c.contexto || '').split('\n')[0], sub: this._lineaCr(c) + ' · ' + (c.fuente || ''), sel: ya };
        });
      },
      alElegir: k => {
        const c = this.normalizarCr(this.DB.bestiario[k]);
        const roster = STORAGE.loadRoster();
        if (roster[c.nombre]) { this.toast(`«${c.nombre}» ya está en tus amenazas`, 'info'); return false; }
        delete c.impreso;
        roster[c.nombre] = c;
        if (!STORAGE.saveRoster(roster)) { this.toast('Sin espacio para guardarla', 'err'); return false; }
        this.toast(`«${c.nombre}» añadida a tus amenazas`, 'ok');
        return true;
      },
      info: () => `${Object.keys(STORAGE.loadRoster()).length} en tus amenazas`,
      alCerrar: () => { if (this.modo === 'mesa' && !document.getElementById('app-screen').classList.contains('hidden')) this.pintarMesa(); else this.renderHome(); },
    });
  },
});
