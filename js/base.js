/* ══════════════════════════════════════════════════════════════
   BASE — piezas genéricas heredadas de S&S Companion v59.0, sin cambios
   de comportamiento: gestos de páginas, dados, avisos, recorte de
   retrato, temas, letra, fondos, actualización y Ajustes.
   La lógica propia de S&S Director vive en app.js y en los módulos que
   se cargan después (amenaza, biblioteca, mesa, asistente, editor).
══════════════════════════════════════════════════════════════ */
const app = {

  _esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  },

  /* Strip HTML tags from imported JSON text — prevents XSS from malicious rule files */
  _sanitize(str) {
    return String(str || '').replace(/<[^>]*>/g, '').replace(/javascript:/gi, '');
  },

  /** Escudo anti-traspaso: absorbe el toque fantasma que sigue a abrir o
      cerrar una capa (modal, panel, FAB). Invisible y se autodestruye. */
  _tapShield(ms = 320) {
    const now = Date.now();
    // Singleton: si ya hay un escudo vivo, solo se extiende su fecha
    // límite — nunca se apilan velos.
    if (this._shieldEl && this._shieldEl.isConnected) {
      this._shieldDeadline = now + ms;
      return;
    }
    const s = document.createElement('div');
    s.className = 'tap-shield';
    this._shieldEl = s;
    this._shieldDeadline = now + ms;
    const remove = () => { s.remove(); if (this._shieldEl === s) this._shieldEl = null; };
    const kill = e => {
      // Autodefensa anti-congelación: si el temporizador quedó estrangulado
      // (pestaña en segundo plano), el primer toque tras la fecha límite
      // retira el velo en lugar de tragarse la interacción para siempre.
      if (Date.now() >= this._shieldDeadline) { remove(); return; }
      e.stopPropagation(); e.preventDefault();
    };
    ['touchstart', 'touchend', 'pointerdown', 'pointerup', 'click'].forEach(t =>
      s.addEventListener(t, kill, { capture: true, passive: false }));
    document.body.appendChild(s);
    const tick = () => {
      if (!s.isConnected) return;
      if (Date.now() >= this._shieldDeadline) remove();
      else setTimeout(tick, 60);
    };
    setTimeout(tick, ms);
    // Cinturón extra: al volver a la pestaña, fuera el velo
    document.addEventListener('visibilitychange', remove, { once: true });
  },

  /* ── CONFIRM HELPER ──
   * @param {string}      title
   * @param {string}      body
   * @param {string}      confirmLabel
   * @param {Function}    onConfirm
   * @param {Element}     [container=document.body]  Pass an open <dialog> when
   *                      calling from inside one so the overlay renders above it.
   */
  _confirm(title, body, confirmLabel, onConfirm, container = document.body, onCancel = null) {
    // Delegado en UI.confirm (js/ui-dialogs.js): diálogo accesible con
    // escudo anti ghost-click — el toque sobre "Confirmar" ya no puede
    // traspasar y activar lo que esté detrás del diálogo.
    this._confirmOpen = true;            // pausa el dispatcher [data-action]
    UI.confirm(title, body, confirmLabel, onConfirm, container, onCancel);
  },

  /** Sustituye el grano SVG (feTurbulence) por un PNG generado en canvas.
      El filtro SVG se re-rasteriza en cada repintado — carísimo en móvil y
      una de las causas del lag del swipe; un PNG es un raster cacheado. */

  /** Golden noise sutil pre-rasterizado (PNG vía canvas): coste de pintado
      trivial, sin filtros SVG. Grano dorado con media de opacidad ~4%;
      el CSS lo desvanece a cero en el 40% superior de cada tarjeta. */
  _initGrainTexture() {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 160;
      const ctx = c.getContext('2d');
      const img = ctx.createImageData(160, 160);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        // Ruido púrpura claro, muy ligero: luminancia suave sobre lavanda,
        // alpha media ~2% (presencia apenas perceptible, sin destellos)
        const v = 0.8 + Math.random() * 0.4;
        d[i]   = Math.min(255, 178 * v) | 0;
        d[i+1] = Math.min(255, 158 * v) | 0;
        d[i+2] = Math.min(255, 214 * v) | 0;
        d[i+3] = (Math.random() * 0.045 * 255) | 0;
      }
      ctx.putImageData(img, 0, 0);
      document.documentElement.style.setProperty('--gnoise', `url("${c.toDataURL('image/png')}")`);
    } catch (e) { /* sin ruido: el CSS cae a none */ }
  },

  setupSwipe() {
    const w     = document.getElementById('pages_wrapper');
    const track = document.getElementById('pages_track');

    // ── Tuning — matches native iOS/Android feel ──
    const DEAD_PX     = 6;     // px before ANY axis locks
    const V_BIAS      = 1.5;   // H/V ratio for axis lock (1.5 = diagonal amable)
    const MIN_DIST    = 38;    // px minimum travel to count a slow drag
    const FLICK_DIST  = 22;    // px minimum travel to count a fast flick
    const FLICK_VEL   = 0.25;  // px/ms velocity threshold for flick
    const DRAG_RATIO  = 0.30;  // fraction of page width for slow drag commit
    const SNAP_MS     = 320;   // ms for snap animation
    const SNAP_EASE   = 'cubic-bezier(.25,.46,.45,.94)'; // iOS ease-out
    const SCROLL_SEL  = '.skill-area,.tms,.dbs,.tmct,.dbct,.mbd,[data-scroll]';

    // ── Velocity window — track last N samples, use peak ──
    const VEL_SAMPLES = 4;
    let velSamples = [];
    const peakVel = () => {
      if (!velSamples.length) return 0;
      return velSamples.reduce((a,b) => Math.abs(a)>Math.abs(b)?a:b, 0);
    };
    const addVelSample = (v) => {
      velSamples.push(v);
      if (velSamples.length > VEL_SAMPLES) velSamples.shift();
    };

    // ── State ──
    let startX=0, startY=0, startT=0, lastX=0, lastT=0;
    let dragging=false, locked=false, totalDist=0;

    // ── Ghost-click suppression ──
    // NOTE: inputs, textareas and selects are always excluded so the user
    // can tap, select text, and position the cursor without interference.
    let _suppress = false;
    const GUARD_EVENTS = ['touchstart','pointerdown','mousedown','click'];
    const _guard = e => {
      if (!_suppress) return;
      if (e.target.closest('input,textarea,select')) return; // never suppress text fields
      e.stopPropagation(); e.preventDefault();
    };
    GUARD_EVENTS.forEach(t => w.addEventListener(t, _guard, {capture:true,passive:false}));
    const suppressFor = (ms = TIMING.SWIPE_SUPPRESS) => {
      _suppress = true; setTimeout(() => { _suppress = false; }, ms);
    };

    const pageW = () => w.clientWidth || window.innerWidth;

    // ── Continuación desde snap en vuelo ──
    // Si el dedo atrapa la pista a mitad de una animación, el arrastre debe
    // continuar desde donde ESTÁ, no saltar a la posición de reposo.
    // originOffset = desplazamiento congelado respecto al reposo de la página.
    let originOffset = 0;
    const currentTx = () => {
      try { return new DOMMatrixReadOnly(getComputedStyle(track).transform).m41 || 0; }
      catch (e) { return -this.currentPage * pageW(); }
    };

    // ── Rubber-band asintótico (curva iOS) ──
    // Resistencia progresiva: cuanto más arrastras más cuesta, con límite
    // suave en ~40% del ancho. Mucho más natural que un factor lineal.
    const rubber = (x, w2) => {
      const d = w2 * 0.4;
      return (1 - 1 / ((Math.abs(x) * 0.55 / d) + 1)) * d * Math.sign(x);
    };

    // ── Live drag with rubber-band ──
    const setLive = rawDx => {
      const base   = -this.currentPage * pageW();
      const dx     = originOffset + rawDx;
      const atEdge = (this.currentPage === 0 && dx > 0) ||
                     (this.currentPage === this.totalPages-1 && dx < 0);
      track.style.transition = 'none';
      track.style.transform  = `translateX(${base + (atEdge ? rubber(dx, pageW()) : dx)}px)`;
    };


    // ── Snap decision ──
    const decide = (dx, vel) => {
      const pW   = pageW();
      const cur  = this.currentPage;
      const max  = this.totalPages - 1;
      const dist = Math.abs(dx);
      const dir  = dx < 0 ? 1 : -1; // +1 = forward, -1 = back

      const isFlick = Math.abs(vel) >= FLICK_VEL && dist >= FLICK_DIST;
      const isDrag  = dist >= MIN_DIST && dist/pW >= DRAG_RATIO;

      if (isFlick) {
        if (vel < 0 && cur < max) return cur + 1;
        if (vel > 0 && cur > 0)   return cur - 1;
      }
      if (isDrag) {
        if (dir > 0 && cur < max) return cur + 1;
        if (dir < 0 && cur > 0)   return cur - 1;
      }
      return cur;
    };

    // ── Snap to target ──
    // Duración proporcional a lo que queda por recorrer y a la velocidad de
    // soltado: un flick rápido asienta antes; un soltado lento, con más peso.
    const snapTo = (target, vel = 0) => {
      suppressFor();
      setTimeout(() => track.classList.remove('is-dragging'), TIMING.SWIPE_SUPPRESS);
      const remaining = Math.abs((-target * pageW()) - currentTx());
      const ms = Math.round(Math.max(160, Math.min(320, remaining / Math.max(Math.abs(vel), 0.9))));
      this.goToPage(target, ms);
    };

    // ══ TOUCH ══
    w.addEventListener('touchstart', e => {
      if (e.touches.length > 1) return;
      // Never hijack touches that begin on a text field
      if (e.target.closest('input,textarea,select')) return;
      const t = e.touches[0];
      startX = lastX = t.clientX;
      startY = t.clientY;
      startT = lastT = Date.now();
      dragging = false; locked = false;
      totalDist = 0; velSamples = [];
      // Congelar el snap SOLO si hay uno en vuelo: getComputedStyle fuerza
      // un reflow y en touchstart eso congelaba el primer frame del gesto.
      if (Date.now() < (this._snapUntil || 0)) {
        const cur = getComputedStyle(track).transform;
        track.style.transition = 'none';
        track.style.transform  = cur;
        originOffset = currentTx() - (-this.currentPage * pageW());
      } else {
        track.style.transition = 'none';
        originOffset = 0;
      }
      // Only steal focus away from non-text elements (never blur inputs/textareas)
      const focused = w.querySelector(':focus');
      if (focused && !focused.matches('input,textarea,select')) focused.blur();
    }, {passive:true});

    w.addEventListener('touchmove', e => {
      if (!e.cancelable || e.touches.length > 1) return;
      const t  = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (!locked) {
        // Never intercept swipes that started on a text field
        if (e.target.closest('input,textarea,select')) { locked = true; return; }
        if (e.target.closest(SCROLL_SEL)) { locked = true; return; }
        if (Math.abs(dx) < DEAD_PX && Math.abs(dy) < DEAD_PX) return;
        if (Math.abs(dx) > Math.abs(dy) * V_BIAS) {
          locked = true; dragging = true;
          track.classList.add('is-dragging');
        } else {
          locked = true; return;
        }
      }
      if (!dragging) return;
      e.preventDefault();

      const now = Date.now();
      const dt  = Math.max(now - lastT, 1);
      const iv  = (t.clientX - lastX) / dt;
      addVelSample(iv);
      totalDist += Math.abs(t.clientX - lastX);
      lastX = t.clientX; lastT = now;
      setLive(dx);
    }, {passive:false});

    w.addEventListener('touchend', e => {
      track.classList.remove('is-dragging');
      if (!dragging) {
        dragging=false; locked=false; velSamples=[];
        // Un tap que atrapó una animación en vuelo la dejó congelada entre
        // páginas: re-asentar en la página actual.
        if (Math.abs(originOffset) > 1) this.goToPage(this.currentPage);
        return;
      }
      // La decisión usa el desplazamiento EFECTIVO (incluye el offset de una
      // animación atrapada en vuelo), igual que lo que se ve en pantalla.
      const dx = originOffset + (e.changedTouches[0].clientX - startX);
      const vel = peakVel();
      dragging = false; locked = false;
      snapTo(decide(dx, vel), vel);
    }, {passive:true});

    w.addEventListener('touchcancel', () => {
      track.classList.remove('is-dragging');
      dragging=false; locked=false; velSamples=[];
      this.goToPage(this.currentPage);
    }, {passive:true});

    // ══ MOUSE ══
    let ms = null;
    w.addEventListener('mousedown', e => {
      if (e.target.closest('input,select,textarea,button,label')) return;
      ms = {x:e.clientX, lx:e.clientX, lt:Date.now(), samples:[], drag:false, dist:0};
      track.style.transition = 'none';
      originOffset = (Date.now() < (this._snapUntil || 0)) ? currentTx() - (-this.currentPage * pageW()) : 0;
    });
    w.addEventListener('mousemove', e => {
      if (!ms) return;
      if (!ms.drag && Math.abs(e.clientX-ms.x)>8) {
        ms.drag=true; track.classList.add('is-dragging');
      }
      if (ms.drag) {
        const dt=Math.max(Date.now()-ms.lt,1);
        const iv=(e.clientX-ms.lx)/dt;
        ms.samples.push(iv); if(ms.samples.length>VEL_SAMPLES) ms.samples.shift();
        ms.dist += Math.abs(e.clientX-ms.lx);
        ms.lx=e.clientX; ms.lt=Date.now();
        setLive(e.clientX-ms.x);
      }
    });
    const endMouse = cx => {
      track.classList.remove('is-dragging');
      if (!ms) return;
      const {x,drag,samples,dist} = ms; ms=null;
      if (!drag) return;
      const vel = samples.reduce((a,b)=>Math.abs(a)>Math.abs(b)?a:b, 0);
      snapTo(decide(originOffset + (cx-x), vel), vel);
    };
    w.addEventListener('mouseup',    e=>endMouse(e.clientX));
    w.addEventListener('mouseleave', e=>endMouse(e.clientX));

    // ══ RESIZE/ROTATION ══
    const _reSnap = this._debounce(() => {
      if (document.getElementById('app-screen')?.classList.contains('hidden')) return;
      track.style.transition='none';
      track.style.transform=`translateX(-${this.currentPage*pageW()}px)`;
    }, 100);
    window.addEventListener('resize',            _reSnap, {passive:true});
    window.addEventListener('orientationchange', _reSnap, {passive:true});
  },

  /** Fires success animation on the confirm button before collapsing the section. */
  _flashConfirm(sec) {
    const ev = document.getElementById(`${sec}_edit_view`);
    const btn = ev?.querySelector('.bcnf');
    if (!btn) return;
    btn.classList.add('success');
    if (navigator.vibrate) navigator.vibrate([6, 40, 10]);
    setTimeout(() => btn.classList.remove('success'), TIMING.CONFIRM_FLASH);
  },

  setAdvantage(v) {
    this._advantage = (v === 1 || v === -1) ? v : 0;
    document.querySelectorAll('#adv_fab .adv-opt').forEach(b => {
      const on = String(this._advantage) === b.dataset.adv;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const fab = document.getElementById('adv_fab');
    const main = document.getElementById('adv_fab_main');
    if (fab) fab.dataset.state = String(this._advantage);
    if (main) {
      main.innerHTML = this._advantage > 0 ? '<svg class="ico ico-solo" aria-hidden="true"><use href="#i-adv-up"/></svg>' : this._advantage < 0 ? '<svg class="ico ico-solo" aria-hidden="true"><use href="#i-adv-down"/></svg>' : '<svg class="ico ico-solo" aria-hidden="true"><use href="#i-adv-eq"/></svg>';
      const lbl = this._advantage > 0 ? 'Ventaja' : this._advantage < 0 ? 'Desventaja' : 'Normal';
      main.setAttribute('aria-label', `Tirada: ${lbl}. Tocar para cambiar Ventaja/Desventaja`);
    }
    this._closeAdvFab();
  },

  /** Despliega/colapsa el menú flotante de Ventaja/Desventaja. */
  toggleAdvFab() {
    this._tapShield();  // anti-traspaso de toques
    const fab = document.getElementById('adv_fab');
    if (!fab) return;
    const open = fab.classList.toggle('open');
    document.getElementById('adv_fab_main')?.setAttribute('aria-expanded', String(open));
    if (open) {
      // Cerrar al tocar fuera (una sola vez).
      this._advFabOutside = (e) => { if (!fab.contains(e.target)) this._closeAdvFab(); };
      setTimeout(() => document.addEventListener('pointerdown', this._advFabOutside, true), 0);
    }
  },

  /** El flotante de Ventaja/Desventaja está fijo sobre el contenido: medido
      a 375 px, en Normal llega a sentarse sobre 4 controles en Perfil (8 con
      el menú abierto), campos de texto y desplegables incluidos. Pero en
      Normal está el 95 % del tiempo, así que en ese estado se aparta:
      encoge, se apaga y se va al desplazar hacia abajo. Activo —Ventaja o
      Desventaja— nunca se esconde: olvidarse de que está puesto falsearía
      todas las tiradas siguientes. */
  _initAdvFabAutoOcultar() {
    const fab = document.getElementById('adv_fab');
    if (!fab) return;
    let ultimo = 0, temporizador = 0;

    const mostrar = () => {
      fab.classList.remove('adv-fab--fuera');
      clearTimeout(temporizador);
    };
    const esconder = () => {
      // Solo en Normal, y nunca con el menú desplegado.
      if (this._advantage || fab.classList.contains('open')) return;
      fab.classList.add('adv-fab--fuera');
    };

    const alDesplazar = (e) => {
      const y = (e.target && e.target.scrollTop) || 0;
      const baja = y > ultimo + 4;
      const sube = y < ultimo - 4;
      ultimo = y;
      if (baja) esconder(); else if (sube) mostrar();
      // Al parar de desplazar siempre vuelve: nunca queda fuera de alcance.
      clearTimeout(temporizador);
      temporizador = setTimeout(mostrar, 900);
    };

    // Cada página tiene su propio contenedor con scroll, y `scroll` no
    // burbujea: hay que escuchar en fase de captura.
    document.addEventListener('scroll', alDesplazar, true);
    // Cambiar de página o de estado lo devuelve a la vista.
    ['goToPage', 'setAdvantage'].forEach(m => {
      const orig = this[m];
      if (typeof orig !== 'function') return;
      this[m] = function () { const r = orig.apply(this, arguments); mostrar(); return r; };
    });
  },

  _closeAdvFab() {
    this._tapShield();  // anti-traspaso de toques
    const fab = document.getElementById('adv_fab');
    if (fab) fab.classList.remove('open');
    document.getElementById('adv_fab_main')?.setAttribute('aria-expanded', 'false');
    if (this._advFabOutside) {
      document.removeEventListener('pointerdown', this._advFabOutside, true);
      this._advFabOutside = null;
    }
  },

  rollCheck(label, mod) {
    const adv = this._advantage || 0;
    const r20 = () => Math.floor(Math.random()*20)+1;
    let used, faces;
    if (adv === 0) { used = r20(); faces = [used]; }
    else { const a = r20(), b = r20(); used = adv > 0 ? Math.max(a,b) : Math.min(a,b); faces = [a, b]; }
    const total = used + mod;
    const isCrit = used===20, isFail = used===1;
    const modStr = (mod>=0?'+':'')+mod;
    const advTxt = adv>0?' · Ventaja':adv<0?' · Desventaja':'';
    const facesTxt = adv===0 ? `d20: ${used}` : `2d20: [${faces.join(', ')}] → ${used}`;
    const detailTxt = `${facesTxt}${modStr !== '+0' ? `  (${modStr})` : ''}${advTxt}`;
    this.showDiceRoll({
      label, die: 20, finalFaces: faces, isCrit, isFail,
      detail: detailTxt, total, totalLabel: 'Total'
    });
  },

  rollDice(formula, label) {
    const match = formula.match(/(\d+)d(\d+)([+-]\d+)?/i);
    if (!match) { this.toast(`${label}: ${formula}`, 'info'); return; }
    const num = parseInt(match[1]), die = parseInt(match[2]), bonus = parseInt(match[3] || 0);
    const rolls = [];
    let total = 0;
    for (let i = 0; i < num; i++) { const r = Math.floor(Math.random() * die) + 1; rolls.push(r); total += r; }
    total += bonus;
    let bonusStr = '';
    if      (bonus > 0) bonusStr = `+${bonus}`;
    else if (bonus < 0) bonusStr = String(bonus);
    // Format mirrors rollCheck: "2d6: [4 + 3]  (+2)"
    const rollsPart = num > 1 ? `[${rolls.join(' + ')}]` : `${rolls[0]}`;
    const detailTxt = `${num}d${die}: ${rollsPart}${bonusStr !== '' ? '  (' + bonusStr + ')' : ''}`;
    this.showDiceRoll({
      label,
      die,
      finalFaces: rolls,       // pass all rolls — overlay shows one face per die
      isCrit: false, isFail: false,
      detail: detailTxt,
      total,
      totalLabel: 'Daño'
    });
  },

  /**
   * Show the dice overlay.
   * @param {object} opts
   * @param {string}   opts.label
   * @param {number}   opts.die          - die type (d6, d20…)
   * @param {number[]} opts.finalFaces   - one value per die (NEW: array)
   * @param {number}   opts.finalFace    - legacy single-die fallback
   * @param {boolean}  opts.isCrit
   * @param {boolean}  opts.isFail
   * @param {string}   opts.detail
   * @param {number}   opts.total
   * @param {string}   opts.totalLabel
   */
  showDiceRoll({label, die, finalFaces, finalFace, isCrit, isFail, detail, total, totalLabel}) {
    this._tapShield();  // anti-traspaso de toques
    // Normalise: support both old finalFace (single) and new finalFaces (array)
    const faces = finalFaces ?? [finalFace ?? 1];
    const numDice = faces.length;

    const overlay   = document.getElementById('dice-overlay');
    const facesRow  = document.getElementById('dice-faces-row');
    const labelEl   = document.getElementById('dice-label');
    const detailEl  = document.getElementById('dice-detail');
    const totalRow  = document.getElementById('dice-total-row');
    const totalEl   = document.getElementById('dice-total');
    const badgeEl   = document.getElementById('dice-badge');
    const hintEl    = document.getElementById('dice-close-btn');
    const cardEl    = document.getElementById('dice-card');

    // ── Reset ──
    overlay.classList.remove('closing');
    cardEl.classList.remove('crit', 'fail');
    detailEl.className  = 'dice-detail';
    totalRow.className  = 'dice-total-row';
    totalEl.className   = 'dice-total';
    badgeEl.style.display = 'none';
    hintEl.className    = 'dice-close-btn';
    detailEl.textContent = '';
    totalEl.textContent  = '';

    // ── Build N die faces ──
    facesRow.innerHTML = '';
    facesRow.className = 'dice-faces-row'
      + (numDice >= 5 ? ' many5' : numDice >= 3 ? ' many' : '');

    const numEls = faces.map((_, i) => {
      if (i > 0) {
        const plus = document.createElement('span');
        plus.className = 'dice-face-plus';
        plus.textContent = '+';
        facesRow.appendChild(plus);
      }
      const face = document.createElement('div');
      face.className = 'dice-face';
      const span = document.createElement('span');
      span.className = 'dice-num';
      span.textContent = Math.floor(Math.random() * die) + 1;
      face.appendChild(span);
      facesRow.appendChild(face);
      return span;
    });

    labelEl.textContent = label;
    overlay.classList.add('active');
    if (navigator.vibrate) navigator.vibrate(12);

    // ── Animate each die, staggered ──
    const TICKS = 7;
    let settled = 0;

    numEls.forEach((numEl, dieIdx) => {
      const finalVal = faces[dieIdx];
      const staggerDelay = dieIdx * 55; // each die starts slightly later

      const doTick = (tick) => {
        numEl.classList.remove('rolling');
        void numEl.offsetWidth;
        numEl.classList.add('rolling');
        if (tick < TICKS) {
          numEl.textContent = Math.floor(Math.random() * die) + 1;
          setTimeout(() => doTick(tick + 1), staggerDelay * (tick === 0 ? 1 : 0) + 35 + tick * 12);
        } else {
          numEl.textContent = finalVal;
          numEl.classList.remove('rolling');
          numEl.classList.add('result-pop');
          // Crit/fail glow only on single d20 rolls
          if (numDice === 1 && isCrit) numEl.classList.add('crit-glow');
          if (numDice === 1 && isFail) numEl.classList.add('fail-glow');
          settled++;
          // Once all dice have settled, show summary
          if (settled === numDice) {
            setTimeout(() => {
              detailEl.textContent = detail;
              detailEl.classList.add('show');
              totalEl.textContent = (total >= 0 && totalLabel !== 'Daño' ? '+' : '') + total;
              if (isCrit) totalEl.classList.add('crit');
              if (isFail) totalEl.classList.add('fail');
              totalRow.classList.add('show');
              if (isCrit) { badgeEl.textContent = '✦ Crítico ✦'; badgeEl.className = 'dice-badge crit'; badgeEl.style.display = ''; cardEl.classList.add('crit'); }
              if (isFail) { badgeEl.textContent = 'Fallo Total'; badgeEl.className = 'dice-badge fail'; badgeEl.style.display = ''; cardEl.classList.add('fail'); }
              hintEl.classList.add('show');
            }, 160);
          }
        }
      };
      setTimeout(() => doTick(0), staggerDelay);
    });
  },

  closeDiceOverlay() {
    this._tapShield();  // anti-traspaso de toques
    const overlay = document.getElementById('dice-overlay');
    if (!overlay.classList.contains('active')) return;
    overlay.classList.add('closing');
    setTimeout(() => overlay.classList.remove('active','closing'), TIMING.DICE_CLOSE);
  },

  _initDiceSwipe() {
    const card = document.getElementById('dice-card');
    if (!card || card._swipeInit) return;
    card._swipeInit = true;
    let startY = 0, startX = 0;
    card.addEventListener('touchstart', e => { startY = e.touches[0].clientY; startX = e.touches[0].clientX; }, {passive:true});
    card.addEventListener('touchend', e => {
      const dy = e.changedTouches[0].clientY - startY;
      const dx = Math.abs(e.changedTouches[0].clientX - startX);
      if (dy > 55 && dx < 60) this.closeDiceOverlay();
    }, {passive:true});
  },

  /** Barras de fracción de la sección Estado (PV/ADR/ING).
      Se refrescan desde calc(), adjustRes() y el tecleo directo. */
  _updateResBars() {
    const pairs = [
      ['res_fill_pv',  'cur_pv',  'max_pv'],
      ['res_fill_adr', 'cur_adr', 'max_adr'],
      ['res_fill_ing', 'cur_ing', 'max_ing'],
      ['res_fill_carne', 'cur_carne', 'res_carne'],
    ];
    pairs.forEach(([fillId, curId, maxId]) => {
      const fill = document.getElementById(fillId);
      if (!fill) return;
      const cur = parseInt(document.getElementById(curId)?.value) || 0;
      const max = parseInt(document.getElementById(maxId)?.textContent) || 0;
      fill.style.width = (max > 0 ? Math.max(0, Math.min(100, cur / max * 100)) : 0) + '%';
      if (fillId === 'res_fill_pv') fill.classList.toggle('res-low', max > 0 && cur / max <= .25);
      // Botones ± en su tope: el − a 0 y el + lleno se atenúan (v57.3).
      document.querySelectorAll(`.e4-btn[data-cur="${curId}"]`).forEach(b => {
        const baja = String(b.dataset.delta || '').startsWith('-');
        b.classList.toggle('is-tope', baja ? cur <= 0 : cur >= max);
      });
    });
  },

  adjustRes(curId, maxId, delta) {
    const cur = document.getElementById(curId);
    const max = document.getElementById(maxId);
    if (!cur) return;
    let val = parseInt(cur.value, 10) || 0;
    // Ojo con el truco «|| 999»: con máximo 0 (personaje recién creado) el
    // fallback dejaba subir el recurso hasta 999. NaN → sin tope; 0 → tope 0.
    const parsedMax = parseInt(max?.textContent, 10);
    const maxVal = Number.isNaN(parsedMax) ? 999 : parsedMax;
    val = Math.max(0, Math.min(maxVal, val + delta));
    cur.value = val;
    // Flash feedback
    cur.style.transition = 'color .15s';
    cur.style.color = delta > 0 ? 'var(--sage)' : 'var(--blood)';
    // Bump animation
    cur.classList.remove('bump');
    void cur.offsetWidth;
    cur.classList.add('bump');
    setTimeout(() => { cur.style.color = ''; cur.classList.remove('bump'); }, TIMING.RES_FLASH);
    // Haptic feedback on supported devices
    if (navigator.vibrate) navigator.vibrate(8);
    // Mark unsaved
    this._markUnsaved();
    // Barras de fracción de Estado
    this._updateResBars();
  },

  /** Pulsación y repetición por mantenido de los botones ± (.res-btn).
   *  Se llama una vez desde init(). Lee data-cur / data-max / data-delta.
   *
   *  Un clic suma 1, y solo 1. Antes sumaba 2: el atributo `onclick` del
   *  HTML y este `mousedown` llamaban los dos a adjustRes(), y el
   *  `preventDefault()` del listener de `click` no cancela un manejador
   *  inline (ya se registró antes y se ejecuta igual). Los onclick se
   *  retiraron del HTML y el teclado se atiende aquí abajo, que si no
   *  Enter/Espacio dejaban de funcionar al quitarlos. */
  _initResLongPress() {
    document.querySelectorAll('.res-btn').forEach(btn => {
      const { cur: curId, max: maxId, delta: deltaStr } = btn.dataset;
      // Skip buttons that don't carry the required data attributes
      if (!curId || !maxId || deltaStr === undefined) return;
      const delta = parseInt(deltaStr, 10);

      let _t    = null;
      let active = false;

      const fire = () => this.adjustRes(curId, maxId, delta);

      const start = () => {
        if (active) return;
        active = true;
        fire(); // immediate first fire
        let speed = 350; // initial repeat delay ms
        const tick = () => {
          if (!active) return;
          fire();
          speed = Math.max(TIMING.LONGPRESS_MIN, speed * 0.8); // accelerate: 350→280→224…→60
          _t = setTimeout(tick, speed);
        };
        _t = setTimeout(tick, TIMING.LONGPRESS_HOLD); // hold threshold before repeat starts
      };

      const stop = () => {
        active = false;
        clearTimeout(_t);
        _t = null;
      };

      btn.addEventListener('mousedown',   e => { e.preventDefault(); start(); });
      btn.addEventListener('touchstart',  e => { e.preventDefault(); start(); }, {passive:false});
      btn.addEventListener('mouseup',     stop);
      btn.addEventListener('mouseleave',  stop);
      btn.addEventListener('touchend',    stop);
      btn.addEventListener('touchcancel', stop);
      // El puntero ya disparó en mousedown/touchstart: el click posterior
      // no debe volver a sumar.
      btn.addEventListener('click',       e => e.preventDefault());
      // Teclado: Enter/Espacio suman 1. Se ignora la repetición automática
      // del sistema (e.repeat) para que dejar la tecla pulsada no dispare
      // una ráfaga; para eso está el mantenido con el dedo o el ratón.
      btn.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
        e.preventDefault();
        if (!e.repeat) fire();
      });
    });
  },

  toast(msg, type = 'info', action = null, opts = {}) {
    const t = { 'ok':'ok','OK':'ok','✦':'ok','Error':'err','error':'err' }[type] ?? 'info';

    // ── Deduplication: if an identical message is already visible, skip ──
    const containerId = (t === 'err') ? 'toast-ct-err' : 'toast-ct';
    const c = document.getElementById(containerId) || document.getElementById('toast-ct');
    const msgStr = String(msg);
    const existing = Array.from(c.querySelectorAll('.t-msg')).find(el => el.textContent === msgStr);
    if (existing) {
      // Bump opacity to full to give visual feedback that it was triggered again
      const existingToast = existing.closest('.toast');
      if (existingToast) {
        existingToast.style.transition = 'none';
        existingToast.style.opacity = '1';
      }
      return;
    }

    const icon = document.createElement('span');
    icon.className = 't-icon';
    if      (t === 'ok')  { icon.textContent = '✦'; icon.classList.add('gold'); }
    else if (t === 'err') { icon.textContent = '✕'; icon.classList.add('err'); }
    else                  { icon.textContent = '·'; icon.classList.add('dim'); }

    const m = document.createElement('span');
    m.className = 't-msg';
    m.textContent = msgStr;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:9px';
    wrap.appendChild(icon);
    wrap.appendChild(m);

    // Cap visible toasts at 2 in the polite container; 1 in the assertive one.
    // Los toasts sticky (avisos que no deben perderse) no se expulsan por el
    // tope: sin esto, dos toasts posteriores echaban el aviso de actualización.
    const cap = (t === 'err') ? 1 : 2;
    while (c.children.length >= cap) {
      const victim = [...c.children].find(el => !el.classList.contains('t-sticky')) || c.firstChild;
      c.removeChild(victim);
    }

    const toast = document.createElement('div');
    toast.className = `toast${t === 'err' ? ' terror' : ''}`;
    // Position the error container identically to the main toast container
    if (t === 'err') {
      toast.style.cssText = 'position:relative;left:auto;transform:none';
    }
    toast.appendChild(wrap);
    // Optional action: make the toast tappable and keep it on screen longer.
    if (typeof action === 'function') {
      toast.classList.add('t-action');   // pointer-events:auto + estilo pulsable (CSS)
      toast.setAttribute('role', 'button');
      toast.setAttribute('tabindex', '0');
      const fire = () => { try { action(); } catch(e){} toast.remove(); };
      toast.addEventListener('click', fire);
      toast.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
    }
    c.appendChild(toast);

    // opts.sticky: el toast no se autodescarta — queda hasta que el usuario
    // lo toque (avisos que no deben perderse, p. ej. "Nueva versión").
    if (opts.sticky) toast.classList.add('t-sticky');
    if (!opts.sticky) {
      // opts.hold: duración a medida en ms. La usa el aviso posterior a una
      // actualización, que aparece justo cuando la app se está repintando
      // tras recargar — con los 3,2 s normales se lo perdía casi siempre.
      const visibleFor = opts.hold ? opts.hold
        : (typeof action === 'function')
          ? TIMING.TOAST_VISIBLE * 4   // give the user time to act on prompts
          : TIMING.TOAST_VISIBLE;
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = '.3s';
        setTimeout(() => toast.remove(), TIMING.TOAST_FADE);
      }, visibleFor);
    }
  },

  /** Attaches swipe-back gesture to a fullscreen panel.
   *  Primary close = ← button in header (always works).
   *  Swipe-back = wider zone (40%), velocity-aware, cleans up all listeners. */
  _attachPanelSwipeBack(panel, closeFn) {
    // Tear down all previous listeners
    if (panel._swipeHandlers) {
      panel.removeEventListener('touchstart', panel._swipeHandlers.start, {passive:true});
      panel.removeEventListener('touchmove',  panel._swipeHandlers.move,  {passive:true});
      panel.removeEventListener('touchend',   panel._swipeHandlers.end);
      panel.removeEventListener('touchcancel',panel._swipeHandlers.cancel);
    }

    let startX = 0, startY = 0, lastX = 0, lastT = 0;
    let tracking = false, dragging = false;
    const W          = () => panel.offsetWidth || window.innerWidth;
    const EDGE_FRAC  = 0.40;   // 40% of screen — easy to reach
    const VEL_THRESH = 0.4;    // px/ms — flick velocity to trigger close
    const DIST_THRESH = 0.35;  // 35% of screen width to trigger close by distance

    const reset = () => {
      if (!dragging) return;
      dragging = false;
      tracking = false;
      panel.style.transition = 'transform .24s cubic-bezier(.25,.46,.45,.94)';
      panel.style.transform  = 'translateX(0)';
      // Clean transition after snap
      setTimeout(() => { panel.style.transition = ''; panel.style.transform = ''; }, 260);
    };

    const doClose = () => {
      dragging = false; tracking = false;
      panel.classList.add('swipe-used'); // hide hint strip after first use
      panel.style.transition = 'transform .24s cubic-bezier(.25,.46,.45,.94)';
      panel.style.transform  = `translateX(${W()}px)`;
      setTimeout(() => {
        panel.style.transition = '';
        panel.style.transform  = '';
        closeFn();
      }, 240);
    };

    const onStart = e => {
      if (e.touches.length > 1) return;
      const t = e.touches[0];
      if (t.clientX > W() * EDGE_FRAC) return;
      // Don't interfere with inputs or scrollable areas
      if (e.target.closest('input,textarea,select,.apt-col-body,.dbct,.tms,.dbs,.tmct')) return;
      startX = lastX = t.clientX;
      startY = t.clientY;
      lastT  = Date.now();
      tracking = true; dragging = false;
      panel.style.transition = 'none';
    };

    const onMove = e => {
      if (!tracking || e.touches.length > 1) return;
      const t  = e.touches[0];
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      // Cancel if predominantly vertical
      if (!dragging && dy > Math.abs(dx) * 1.5 && dy > 8) { reset(); return; }
      if (dx <= 0) return; // Only right-swipe
      dragging = true;
      // Track velocity
      const now = Date.now();
      lastX = t.clientX; lastT = now;
      const clamped = Math.min(dx, W());
      panel.style.transform = `translateX(${clamped}px)`;
      // Visual resistance — panel darkens as it moves
      panel.style.opacity = String(Math.max(0.85, 1 - (clamped / W()) * 0.15));
    };

    const onEnd = e => {
      if (!tracking) return;
      if (!dragging) { tracking = false; panel.style.transition = ''; return; }
      const t  = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dt = Date.now() - lastT;
      const vel = dt > 0 ? (t.clientX - lastX) / dt : 0; // px/ms
      panel.style.opacity = '';
      // Close if flick OR dragged past threshold
      if (vel >= VEL_THRESH || dx >= W() * DIST_THRESH) {
        doClose();
      } else {
        reset();
      }
    };

    const onCancel = () => { panel.style.opacity = ''; reset(); };

    panel.addEventListener('touchstart',  onStart, {passive:true});
    panel.addEventListener('touchmove',   onMove,  {passive:true});
    panel.addEventListener('touchend',    onEnd,   {passive:false});
    panel.addEventListener('touchcancel', onCancel,{passive:true});

    // Store all 4 handlers for future cleanup
    panel._swipeHandlers = { start:onStart, move:onMove, end:onEnd, cancel:onCancel };
  },

  /** Filtra las entradas del Editor de Reglas por nombre (sin acentos). */
  _dbFilterList(q) {
    const lc = document.getElementById('db_list_container');
    if (!lc) return;
    const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const query = norm(q.trim());
    let visible = 0;
    lc.querySelectorAll('.dbitem').forEach(row => {
      const name = row.querySelector('.dbitem-name')?.textContent || '';
      const hit = !query || norm(name).includes(query);
      row.style.display = hit ? '' : 'none';
      if (hit) visible++;
    });
    // Grupos de talentos: ocultar encabezados sin resultados visibles
    lc.querySelectorAll('.db-group-hdr').forEach(h => {
      let el = h.nextElementSibling, any = false;
      while (el && !el.classList.contains('db-group-hdr')) {
        if (el.classList.contains('dbitem') && el.style.display !== 'none') { any = true; break; }
        el = el.nextElementSibling;
      }
      h.style.display = any ? '' : 'none';
    });
    const empty = document.getElementById('db_search_empty');
    if (empty) empty.style.display = visible ? 'none' : 'block';
  },

  _dbListItem(container, name, key) {
    const row = document.createElement('div');
    row.className = 'dbitem';
    row.setAttribute('data-key', key);
    row.title = 'Editar "' + String(name||'') + '"';
    // Clicking anywhere on the row opens edit
    row.addEventListener('click', (e) => {
      if (e.target.closest('button')) return; // let buttons handle themselves
      container.querySelectorAll('.dbitem').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      this.dbEditEntry(key);
    });
    const nm = document.createElement('span');
    nm.className = 'dbitem-name';
    nm.textContent = String(name||'—');
    const acts = document.createElement('div'); acts.className = 'dbitem-actions';
    const editBtn = document.createElement('button'); editBtn.className='bmini bl'; editBtn.innerHTML='<svg class="ico ico-solo" aria-hidden="true"><use href="#i-quill"/></svg>';
    editBtn.title = 'Editar ' + String(name||'');
    editBtn.setAttribute('aria-label', 'Editar '+String(name||''));
    editBtn.addEventListener('click', () => {
      container.querySelectorAll('.dbitem').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      this.dbEditEntry(key);
    });
    const delBtn = document.createElement('button'); delBtn.className='bmini br'; delBtn.innerHTML='<svg class="ico ico-solo" aria-hidden="true"><use href="#i-x"/></svg>';
    delBtn.title = 'Eliminar';
    delBtn.setAttribute('aria-label', 'Eliminar '+String(name||''));
    delBtn.addEventListener('click', () => this.dbDeleteEntry(key));
    acts.appendChild(editBtn); acts.appendChild(delBtn);
    row.appendChild(nm); row.appendChild(acts);
    container.appendChild(row);
  },

  /** Guarda un archivo en el dispositivo (v58). Antes cada exportación
      creaba un enlace data: y lo pulsaba: con retratos el enlace pasaba del
      tamaño que admiten los navegadores móviles, y en la app instalada
      (sin barra del navegador) la descarga no llegaba a ocurrir. Ahora, en
      pantallas táctiles, se abre el menú Compartir del sistema («Guardar
      en Archivos», Drive, WhatsApp…); en el ordenador, o si Compartir no
      admite el archivo, se descarga con un Blob. Devuelve cómo acabó. */
  guardarArchivo(nombre, texto, tipo = 'application/json') {
    const blob = new Blob([texto], { type: tipo });
    const tactil = matchMedia('(pointer: coarse)').matches;
    if (tactil && navigator.share && navigator.canShare) {
      // Algunos Android no aceptan application/json al compartir; como
      // texto sí, y el nombre conserva la extensión .json.
      const candidatos = [new File([blob], nombre, { type: tipo }), new File([blob], nombre, { type: 'text/plain' })];
      const file = candidatos.find(f => { try { return navigator.canShare({ files: [f] }); } catch (e) { return false; } });
      if (file) {
        return navigator.share({ files: [file], title: nombre })
          .then(() => 'compartido')
          .catch(err => (err && err.name === 'AbortError') ? 'cancelado' : this._descargarBlob(nombre, blob));
      }
    }
    return Promise.resolve(this._descargarBlob(nombre, blob));
  },
  _descargarBlob(nombre, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = nombre; a.rel = 'noopener'; a.style.display = 'none';
    document.body.appendChild(a);   // Firefox y algunos móviles ignoran el clic en un enlace suelto
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 15000);
    return 'descargado';
  },

  /* ══ CROPPER ══
     Coordinate model:
       cs.x / cs.y = pixels the image center is offset from the workspace center.
       x=0, y=0 → image perfectly centered.
       Clamp limit: |x| ≤ max(0, scaledW/2 − FW/2)
                    |y| ≤ max(0, scaledH/2 − FH/2)
     UX behaviour:
       • Drag: rubber-band resistance beyond limits (not hard stop)
       • Release: spring-animated snap back into bounds
       • Zoom: always keeps minZoom = fill-frame (no empty corners)
       • Pinch: zooms towards the midpoint between two fingers
  */

  _cropFrameSize() {
    const ws = document.getElementById('crop_ws');
    if (!ws) return {w:171, h:228};
    const maxW = ws.clientWidth * 0.88, maxH = ws.clientHeight * 0.88;
    const CROP_W = 308, CROP_H = 441;
    let fw = maxW, fh = fw * (CROP_H / CROP_W);
    if (fh > maxH) { fh = maxH; fw = fh * (CROP_W / CROP_H); }
    return {w: Math.round(fw), h: Math.round(fh)};
  },

  _cropPositionFrame() {
    const {w, h} = this._cropFrameSize();
    const frame = document.getElementById('crop_frame');
    if (frame) {
      frame.style.width  = w + 'px';
      frame.style.height = h + 'px';
      frame.style.left   = '50%';
      frame.style.top    = '50%';
      frame.style.transform = 'translate(-50%,-50%)';
    }
    // Apply current portrait shape to frame so editor previews correctly
    const shapeData = {
      rect:    {r:'2px',  clip:'none', cls:''},
      rounded: {r:'14px', clip:'none', cls:''},
      arch:    {r:'0',    clip:'none', cls:'arch'},
      circle:  {r:'50%',  clip:'none', cls:''},

    };
    const s = shapeData[this._portShape || 'rounded'] || shapeData['rounded'];
    if (frame) {
      frame.style.setProperty('--crfr-r',    s.r);
      frame.style.setProperty('--crfr-clip', s.clip);
      frame.className = 'crfr' + (s.cls ? ' ' + s.cls : '');
    }
    const grid = document.getElementById('cr_grid');
    const svg  = document.getElementById('cr_grid_svg');
    if (grid && svg) {
      grid.style.cssText = `position:absolute;left:50%;top:50%;width:${w}px;height:${h}px;transform:translate(-50%,-50%);pointer-events:none;opacity:0;transition:opacity .18s;z-index:11`;
      const t = n => `<line x1="${n}" y1="0" x2="${n}" y2="${h}" stroke="rgba(255,255,255,.22)" stroke-width="1"/>`;
      const l = n => `<line x1="0" y1="${n}" x2="${w}" y2="${n}" stroke="rgba(255,255,255,.22)" stroke-width="1"/>`;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.innerHTML = t(w/3)+t(w*2/3)+l(h/3)+l(h*2/3);
    }
  },

  /** Returns the max allowed |offset| for one axis so the image always covers the frame */
  _cropMaxOffset(axis) {
    const cs = this.cropState;
    const {w: FW, h: FH} = this._cropFrameSize();
    const isRot = cs.rot % 180 !== 0;
    const natW  = isRot ? cs.img.naturalHeight : cs.img.naturalWidth;
    const natH  = isRot ? cs.img.naturalWidth  : cs.img.naturalHeight;
    if (axis === 'x') return Math.max(0, (natW * cs.zoom - FW) / 2);
    else              return Math.max(0, (natH * cs.zoom - FH) / 2);
  },

  /** Hard clamp — used only at applyCrop() to guarantee canvas coverage */
  _cropClamp(axis) {
    const max = this._cropMaxOffset(axis);
    const v   = axis === 'x' ? this.cropState.x : this.cropState.y;
    return Math.min(max, Math.max(-max, v));
  },

  /** Rubber-band: beyond the limit, movement is dampened not stopped */
  _cropRubber(v, max) {
    if (Math.abs(v) <= max) return v;
    const over = Math.abs(v) - max;
    const sign = v > 0 ? 1 : -1;
    // Logarithmic resistance: each extra pixel costs more than the last
    return sign * (max + over * 0.28 / (1 + over * 0.012));
  },

  /** Apply transform to DOM — no clamping, reflects cs.x/y exactly */
  _cropApply(animated = false) {
    const cs  = this.cropState;
    if (!cs.img) return;
    const img = document.getElementById('crop_preview');
    if (animated) {
      img.style.transition = `transform .${TIMING.CROP_SPRING}ms cubic-bezier(.25,.46,.45,.94)`;
      setTimeout(() => { if (img) img.style.transition = ''; }, TIMING.CROP_SPRING + 8);
    } else {
      img.style.transition = '';
    }
    img.style.transform = `translate(${cs.x}px,${cs.y}px) rotate(${cs.rot}deg) scale(${cs.zoom})`;
  },

  /** Spring-snap cs.x/y into bounds with a CSS transition */
  _cropSpringSnap() {
    const cs = this.cropState;
    cs.x = this._cropClamp('x');
    cs.y = this._cropClamp('y');
    this._cropApply(true); // animated
  },

  _cropUpdateSlider() {
    const cs  = this.cropState;
    const sl  = document.getElementById('crop_zoom');
    if (sl)  { sl.min = cs.minZoom; sl.value = cs.zoom; }
    const lbl = document.getElementById('cr_zoom_lbl');
    if (lbl) lbl.textContent = Math.round(cs.zoom * 100) + '%';
  },

  /** Reset zoom to exactly fill the frame, centered */
  _cropResetZoom() {
    const cs = this.cropState;
    const {w: FW, h: FH} = this._cropFrameSize();
    const isRot = cs.rot % 180 !== 0;
    const natW  = isRot ? cs.img.naturalHeight : cs.img.naturalWidth;
    const natH  = isRot ? cs.img.naturalWidth  : cs.img.naturalHeight;
    // minZoom = fit inside frame (image fully visible, may leave empty space)
    cs.minZoom = Math.min(FW / natW, FH / natH);
    // Default zoom = fill frame (cover), user can zoom out further
    cs.zoom = Math.max(FW / natW, FH / natH);
    cs.x = 0; cs.y = 0;
  },

  startCrop(input) {
    if (!input.files?.[0]) return;
    const r = new FileReader();
    r.onload = e => {
      const img = new Image();
      img.onerror = () => this.toast('Imagen inválida','err');
      img.onload = () => {
        this.cropState.img = img;
        this.cropState.rot = 0;
        document.getElementById('crop_preview').src = img.src;
        document.getElementById('crop_modal').showModal();
        requestAnimationFrame(() => requestAnimationFrame(() => {
          this._cropPositionFrame();
          this._cropResetZoom();
          this._cropApply();
          this._cropUpdateSlider();
        }));
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(input.files[0]);
    input.value = '';
  },

  cropFit() {
    const cs = this.cropState;
    if (!cs.img) return;
    this._cropPositionFrame();
    this._cropResetZoom();
    this._cropApply(true);
    this._cropUpdateSlider();
  },

  cropZoomStep(delta) {
    const cs   = this.cropState;
    const prev = cs.zoom;
    cs.zoom    = Math.max(cs.minZoom, Math.min(8, cs.zoom + delta));
    // Scale offsets proportionally so the visual center stays put
    const ratio = cs.zoom / prev;
    cs.x *= ratio; cs.y *= ratio;
    this._cropSpringSnap();
    this._cropUpdateSlider();
  },

  cropZoomSlider(val) {
    const cs   = this.cropState;
    const prev = cs.zoom;
    cs.zoom    = Math.max(cs.minZoom, Math.min(8, parseFloat(val)));
    const ratio = cs.zoom / prev;
    cs.x *= ratio; cs.y *= ratio;
    this._cropSpringSnap();
    this._cropUpdateSlider();
  },

  cropRotate(deg) {
    const cs = this.cropState;
    cs.rot = (cs.rot + deg + 360) % 360;
    this._cropPositionFrame();
    // Re-calculate minZoom for new orientation and fit
    this._cropResetZoom();
    this._cropApply(true);
    this._cropUpdateSlider();
  },

  cancelCrop() {
    document.getElementById('crop_modal').close();
    this.cropState = {img:null, x:0, y:0, zoom:1, rot:0, minZoom:.05,
      isDragging:false, lastX:0, lastY:0, pinch:null, velX:0, velY:0};
  },

  // ── Drag / Pinch ──
  cropDragStart(e) {
    const cs = this.cropState;
    if (!cs.img) return;
    e.preventDefault();
    const ws = document.getElementById('crop_ws');
    ws.classList.add('dragging');

    const getTouches = ev => ev.touches ? Array.from(ev.touches) : null;
    const dist  = t => Math.hypot(t[1].clientX-t[0].clientX, t[1].clientY-t[0].clientY);
    const mid   = t => ({x:(t[0].clientX+t[1].clientX)/2, y:(t[0].clientY+t[1].clientY)/2});

    let mode = 'drag', lastX = 0, lastY = 0, pinchRef = null;
    cs.velX = 0; cs.velY = 0; cs._lastT = Date.now();

    const touches = getTouches(e);
    if (touches?.length >= 2) {
      mode = 'pinch';
      pinchRef = {dist:dist(touches), zoom:cs.zoom, mx:mid(touches).x, my:mid(touches).y, ix:cs.x, iy:cs.y};
    } else {
      const p = touches?.[0] || e;
      lastX = p.clientX; lastY = p.clientY;
    }

    let raf = false;
    const draw = () => {
      if (raf) return; raf = true;
      requestAnimationFrame(() => { raf = false; this._cropApply(); });
    };

    const onMove = ev => {
      ev.preventDefault();
      const ts = getTouches(ev);

      if (ts?.length >= 2 && mode === 'drag') {
        mode = 'pinch';
        pinchRef = {dist:dist(ts), zoom:cs.zoom, mx:mid(ts).x, my:mid(ts).y, ix:cs.x, iy:cs.y};
        cs.velX = cs.velY = 0;
        return;
      }
      if (ts?.length === 1 && mode === 'pinch') {
        mode = 'drag'; pinchRef = null;
        lastX = ts[0].clientX; lastY = ts[0].clientY;
        cs.velX = cs.velY = 0;
        return;
      }

      if (mode === 'pinch' && ts?.length >= 2) {
        const r   = dist(ts) / pinchRef.dist;
        const nz  = Math.max(cs.minZoom, Math.min(8, pinchRef.zoom * r));
        const m   = mid(ts);
        cs.zoom   = nz;
        // Keep the pinch midpoint anchored: offset = original_offset * ratio + finger_pan
        cs.x = pinchRef.ix * r + (m.x - pinchRef.mx);
        cs.y = pinchRef.iy * r + (m.y - pinchRef.my);
        // Apply rubber-band so fingers feel natural even when pushing limits
        cs.x = this._cropRubber(cs.x, this._cropMaxOffset('x'));
        cs.y = this._cropRubber(cs.y, this._cropMaxOffset('y'));
        draw();
        this._cropUpdateSlider();

      } else if (mode === 'drag') {
        const pt = ts?.[0] || ev;
        const now = Date.now(), dt = Math.max(now - cs._lastT, 1);
        const dx = pt.clientX - lastX, dy = pt.clientY - lastY;
        cs.velX = cs.velX * 0.5 + (dx / dt) * 0.5;
        cs.velY = cs.velY * 0.5 + (dy / dt) * 0.5;
        lastX = pt.clientX; lastY = pt.clientY; cs._lastT = now;
        cs.x += dx; cs.y += dy;
        // Rubber-band: drag is free inside bounds, resists outside
        cs.x = this._cropRubber(cs.x, this._cropMaxOffset('x'));
        cs.y = this._cropRubber(cs.y, this._cropMaxOffset('y'));
        draw();
      }
    };

    const onEnd = ev => {
      const ts = getTouches(ev);
      if (ts?.length === 1 && mode === 'pinch') {
        mode = 'drag'; pinchRef = null;
        lastX = ts[0].clientX; lastY = ts[0].clientY;
        cs.velX = cs.velY = 0;
        return;
      }
      if (!ts?.length) {
        mode = 'idle';
        ws.classList.remove('dragging');
        this._cropInertia();
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('mouseup',   onEnd);
        window.removeEventListener('touchend',  onEnd);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('mouseup',   onEnd);
    window.addEventListener('touchend',  onEnd);
  },

  _cropInertia() {
    const cs = this.cropState;
    // Scale velocity to pixels — lower multiplier = less slide-past
    let vx = cs.velX * 55, vy = cs.velY * 55;
    const step = () => {
      if (!cs.img) return;
      if (Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5) {
        // Inertia done — spring-snap back if outside bounds
        this._cropSpringSnap();
        return;
      }
      cs.x += vx; cs.y += vy;
      // Rubber-band during inertia too
      cs.x = this._cropRubber(cs.x, this._cropMaxOffset('x'));
      cs.y = this._cropRubber(cs.y, this._cropMaxOffset('y'));
      vx *= 0.86; vy *= 0.86;
      this._cropApply();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  _cropWheel(e) {
    e.preventDefault();
    this.cropZoomStep(e.deltaY > 0 ? -0.04 : 0.04);
  },

  applyCrop() {
    const cs = this.cropState;
    if (!cs.img) return;
    const {w: FW, h: FH} = this._cropFrameSize();
    // Cap portrait size — see MAX_PORTRAIT_W constant
    const MAX_W = MAX_PORTRAIT_W;
    const SC = Math.min(2, MAX_W / FW);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(FW * SC); canvas.height = Math.round(FH * SC);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(cs.rot * Math.PI / 180);
    ctx.scale(cs.zoom * SC, cs.zoom * SC);
    ctx.translate(cs.x / cs.zoom, cs.y / cs.zoom);
    ctx.drawImage(cs.img, -cs.img.naturalWidth/2, -cs.img.naturalHeight/2);
    const src = canvas.toDataURL('image/jpeg', .92);
    this._syncPortrait(src);
    document.getElementById('crop_modal').close();
    // Reset crop state so next image starts clean
    this.cropState = {img:null, x:0, y:0, zoom:1, rot:0, minZoom:.05,
      isDragging:false, lastX:0, lastY:0, pinch:null, velX:0, velY:0};
    this.toast('Retrato actualizado','ok');
  },

  setFontSize(size, persist = true) {
    // Normal = 16px (1rem base estándar del navegador). Pasos de ~9 % entre
    // opciones, pensados para móvil (v57.9): con Pequeña a 13 px los
    // rótulos bajaban a 9,75 px; ahora hay suelo de 12 px en los tokens y
    // Muy grande se queda en 19 para que nada desborde a 360-390 px.
    const map = {small:'14.5px', normal:'16px', large:'17.5px', xlarge:'19px'};
    const NOMBRES = {small:'Pequeña', normal:'Normal', large:'Grande', xlarge:'Muy grande'};
    const px = map[size] || '16px';
    // Cambiar el font-size del <html> escala todos los rem de la UI de golpe
    document.documentElement.style.fontSize = px;
    if (persist) localStorage.setItem(STORAGE.KEYS.font, size);
    ['small','normal','large','xlarge'].forEach(s=>{
      const el = document.getElementById('fs_'+s);
      if (el) {
        el.classList.toggle('active', s===size);
        el.setAttribute('aria-pressed', String(s===size));
      }
    });
    const eco = document.getElementById('fs_eco');
    if (eco) eco.textContent = `${NOMBRES[size] || 'Normal'} · ${px} · toda la app`;
    // Sin aviso al restaurar al arrancar: solo cuando lo toca una persona.
    if (persist && this._fontSizeListo) this.toast(`Tamaño de fuente: ${NOMBRES[size] || size}`, 'ok');
  },

  _restoreFontSize() {
    const saved = localStorage.getItem(STORAGE.KEYS.font)||'normal';
    this.setFontSize(saved);
    this._fontSizeListo = true;   // a partir de ahora los cambios son del usuario
  },

  _restoreScrollPreserve() {
    this.scrollPreserve = localStorage.getItem(STORAGE.KEYS.scrollPreserve) === '1';
    this._syncScrollPreserveBtn();
  },

  /* ── PORTRAIT SIZE ── */
  setPortraitSize(size) {
    // size: 'xs'|'s'|'m'|'l'|'xl'
    // Escala con pasos suaves y parejos (~+26 px) para que M/L/XL no se
    // disparen respecto a XS/S; mantiene el aspecto ~0.70 (w/h) y XL cabe en
    // el ancho de móvil. (XS/S sin cambios como referencia.)
    const map = {
      xs: {w:'218px', h:'310px'},
      s:  {w:'248px', h:'353px'},
      m:  {w:'276px', h:'393px'},
      l:  {w:'302px', h:'430px'},
      xl: {w:'328px', h:'467px'}
    };
    const d = map[size] || map['m'];
    const root = document.documentElement;
    root.style.setProperty('--port-w', d.w);
    root.style.setProperty('--port-h', d.h);
    this._portSize = size;
    // Sync UI buttons
    document.querySelectorAll('.ps-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.size === size)
    );
    // Con un personaje abierto esto es solo VISTA PREVIA: el valor se
    // confirma con "✓ Aplicar al Personaje" y viaja en _prefs del
    // personaje. Solo sin personaje abierto (ajustes desde Inicio) se
    // persiste como predeterminado global de la app.
    localStorage.setItem(STORAGE.KEYS.portSize, size);
  },

  /* ── PORTRAIT SHAPE ── */
  setPortraitShape(shape) {
    const shapes = {
      rect:    {r:'var(--r)',    clip:'none',                                                         poly:false},
      rounded: {r:'14px',        clip:'none',                                                         poly:false},
      arch:    {r:'140px 140px 8px 8px / 160px 160px 8px 8px', clip:'none',                          poly:false},
      circle:  {r:'50%',         clip:'none',                                                         poly:false},

    };
    const d = shapes[shape] || shapes['rounded'];
    const root = document.documentElement;
    root.style.setProperty('--port-r',    d.r);
    root.style.setProperty('--port-clip', d.clip);
    // For polygon shapes, port-card border is clipped away — hide it,
    // the ::after pseudo (which shares the clip-path) renders the gold border instead
    this._portShape  = shape;
    this._portIsPoly = d.poly;
    // Apply shape to crop frame so editor previews the shape
    this._syncCropFrameShape(d);
    // Force immediate repaint on port-card-edit (prevents lag after shape change)
    const pce = document.querySelector('.port-card-edit');
    if (pce) { void pce.getBoundingClientRect(); }
    // Sync UI buttons
    document.querySelectorAll('.psh-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.shape === shape)
    );
    // Vista previa con personaje abierto; global solo desde Inicio.
    localStorage.setItem(STORAGE.KEYS.portShape, shape);
  },

  /** Syncs crop frame appearance to the current portrait shape */
  _syncCropFrameShape(d) {
    const frame   = document.getElementById('crop_frame');
    const overlay = document.getElementById('crop_overlay');
    if (!frame) return;
    const crClips = {
      rect:    {r:'2px',   clip:'none', cls:''},
      rounded: {r:'14px',  clip:'none', cls:''},
      arch:    {r:'0',     clip:'none', cls:'arch'},
      circle:  {r:'50%',   clip:'none', cls:''},

    };
    const shape = this._portShape || 'rounded';
    const cr = crClips[shape] || crClips['rounded'];
    frame.style.setProperty('--crfr-r',    cr.r);
    frame.style.setProperty('--crfr-clip', cr.clip);
    frame.className = 'crfr' + (cr.cls ? ' ' + cr.cls : '');
    // Punch a matching hole in the overlay for non-rect shapes
    if (overlay) {
      if (cr.clip !== 'none') {
        // SVG clip on overlay to cut matching shape hole
        overlay.style.clipPath = 'none'; // handled via CSS on frame
      }
    }
  },

  /** Temas vigentes. «Sangre» y «Pergamino» se retiraron: quien los tuviera
      guardados vuelve al predeterminado en vez de quedarse sin tema, que
      dejaba la app con los tokens del :root y los botones sin marcar. */
  TEMAS: ['cripta', 'forja', 'muerte'],

  setTheme(id) {
    const tid = this.TEMAS.includes(id) ? id : 'cripta';
    document.documentElement.setAttribute('data-theme', tid);
    this._theme = tid;
    document.querySelectorAll('.theme-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.theme === tid)
    );
    localStorage.setItem('ssd_theme', tid);
  },

  /** Estilo de letra: un pack coherente de títulos, texto, cifras y
      rótulos. «moderno» (Cinzel + Spectral + JetBrains Mono) es el del
      :root y no pone atributo; «clasico» (IM Fell English + EB Garamond)
      redefine las cuatro familias con [data-estilo] en <html>.
      Sustituye a la «Familia de letra» y a la «Letra de los títulos» de
      v56.6, que se podían mezclar y dejaban Fell sobre un cuerpo moderno. */
  setEstiloLetra(id) {
    const eid = id === 'clasico' ? 'clasico' : 'moderno';
    const root = document.documentElement;
    if (eid === 'moderno') root.removeAttribute('data-estilo');
    else root.setAttribute('data-estilo', eid);
    document.querySelectorAll('.estilo-btn').forEach(b => {
      const on = b.dataset.estilo === eid;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    try { localStorage.setItem('ssd_estilo_letra', eid); } catch (e) {}
  },

  _restoreEstiloLetra() {
    let v = null;
    try {
      v = localStorage.getItem('ssd_estilo_letra');
      // Migración desde v56.6: quien tenía IM Fell en los títulos pasa al
      // Clásico. Las familias Sobria y Legible desaparecen: van al Moderno.
      if (!v) v = localStorage.getItem('ssd_titulos') === 'fell' ? 'clasico' : 'moderno';
      localStorage.removeItem('ssd_titulos');
      localStorage.removeItem('ssd_font_family');
    } catch (e) {}
    document.documentElement.removeAttribute('data-font');
    document.documentElement.removeAttribute('data-titulos');
    this.setEstiloLetra(v || 'moderno');
  },

  _restoreTheme() {
    this.setTheme(localStorage.getItem('ssd_theme') || 'cripta');
  },

  /** Fondo de Inicio o de la ficha. `src` = data URL, o '' para quitarlo.
      Devuelve si quedó guardado.
      localStorage tiene un cupo por origen (≈5 MB) que comparte con los
      personajes, y `setItem` lanza al llenarse. Antes esa excepción cortaba
      la función ANTES de mostrar el botón de quitar y el aviso: el fondo se
      veía, pero se perdía al recargar y el panel no daba ninguna señal.
      `guardar:false` es para la restauración al arrancar, que no reescribe. */
  setBgImage(target, src, { guardar = true } = {}) {
    const prop = target === 'home' ? '--bg-home' : '--bg-app';
    const root = document.documentElement.style;
    let guardado = true;
    if (src) {
      root.setProperty(prop, 'url("' + src + '")');
      root.setProperty('--bg-overlay-op', '1');
      if (guardar) {
        // STORAGE.setBg suelta primero la imagen anterior (en localStorage,
        // su hueco es el que necesita la nueva) y, desde v58, guarda en
        // IndexedDB, donde un fondo ya no compite con los personajes.
        guardado = STORAGE.setBg(target, src);
      }
    } else {
      root.setProperty(prop, 'none');
      // Only remove overlay if both are clear
      if (!this._bgGuardado(target === 'home' ? 'app' : 'home')) {
        root.setProperty('--bg-overlay-op', '0');
      }
      STORAGE.setBg(target, '');
    }
    this._pintarBgEstado(target, src, guardado ? 'ok' : 'sin-espacio');
    return guardado;
  },

  _bgGuardado(target) { return STORAGE.getBg(target); },

  /** Estado del fondo DENTRO del panel de Ajustes: miniatura, botón de
      quitar y una línea de texto. El panel es un <dialog> modal y los
      avisos flotantes quedan por debajo de él, así que confirmar solo con
      un toast era no confirmar nada mientras el panel está abierto. */
  _pintarBgEstado(target, src, estado = 'ok') {
    const btn = document.getElementById('bg_' + target + '_clear');
    if (btn) btn.style.display = src ? 'inline-flex' : 'none';
    const prev = document.getElementById('bg_' + target + '_prev');
    if (prev) {
      prev.hidden = !src;
      prev.style.backgroundImage = src ? 'url("' + src + '")' : '';
    }
    const est = document.getElementById('bg_' + target + '_estado');
    if (!est) return;
    const TXT = { procesando: 'Procesando imagen…', error: 'No se pudo leer esa imagen',
                  'sin-espacio': 'Sin espacio: se verá hasta cerrar la app' };
    est.textContent = TXT[estado] || (src ? 'Guardada en este dispositivo' : 'Sin imagen');
    est.classList.toggle('is-ok',  estado === 'ok' && !!src);
    est.classList.toggle('is-err', estado === 'error' || estado === 'sin-espacio');
  },

  loadBgImage(target, input) {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this._pintarBgEstado(target, this._bgGuardado(target), 'procesando');
    const r = new FileReader();
    r.onload = e => {
      const img = new Image();
      img.onload = () => {
        // De mayor a menor calidad hasta que quepa en el cupo. El primer
        // paso es el de siempre (1400 px, JPEG 72 %); los siguientes solo
        // se usan si el almacenamiento va lleno.
        const PASOS = [[1400, .72], [1100, .66], [860, .6], [640, .55]];
        let ok = false;
        for (const [MAX, q] of PASOS) {
          let w = img.naturalWidth, h = img.naturalHeight;
          if (w > MAX || h > MAX) {
            if (w >= h) { h = Math.round(h * MAX / w); w = MAX; }
            else        { w = Math.round(w * MAX / h); h = MAX; }
          }
          const cv = document.createElement('canvas');
          cv.width = w; cv.height = h;
          cv.getContext('2d').drawImage(img, 0, 0, w, h);
          if (this.setBgImage(target, cv.toDataURL('image/jpeg', q))) { ok = true; break; }
        }
        this.toast(ok ? 'Fondo guardado' : 'Sin espacio para guardar el fondo', ok ? 'ok' : 'err');
      };
      img.onerror = () => {
        this._pintarBgEstado(target, this._bgGuardado(target), 'error');
        this.toast('No se pudo cargar la imagen', 'err');
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  },

  _restoreBgImages() {
    ['home', 'app'].forEach(t => {
      const src = this._bgGuardado(t);
      if (src) this.setBgImage(t, src, { guardar: false });
    });
  },

  /* ══════════════════════════════════════════
     AJUSTES & DATOS — apertura/cierre seguros
  ══════════════════════════════════════════ */

  /** Abre el modal de Ajustes sincronizando antes el estado de la UI. */
  /** Ajustes → "Buscar actualización": fuerza reg.update() y, si hay un SW
      nuevo (instalándose o ya en espera), ofrece activarlo con el mismo
      aviso persistente del arranque. */
  /** Escribe en Ajustes la versión de la app realmente en uso: el nombre del
      caché que sirve el service worker. Es el único dato que distingue "la
      app está al día" de "el despliegue no llegó a este dispositivo". */
  async _stampAppVersion() {
    const el = document.getElementById('set_app_ver');
    if (!el) return;
    if (!('serviceWorker' in navigator) || !('caches' in window)) {
      el.textContent = 'sin service worker';
      return;
    }
    try {
      const keys = await caches.keys();
      const mine = keys.filter(k => k.startsWith('ss-director-'));
      if (!mine.length) { el.textContent = 'sin caché (¿primera visita?)'; return; }
      // Si hay más de uno, hay una actualización a medio aplicar.
      el.textContent = mine.length === 1 ? mine[0] : mine.join(' → ') + ' (pendiente de aplicar)';
    } catch (e) {
      el.textContent = 'no disponible';
    }
    // La versión que el SERVIDOR publica ahora mismo, al lado de la que
    // usa este dispositivo. Es el par de datos que separa los dos fallos
    // que se sienten idénticos: "no subí los archivos" y "los subí pero
    // este móvil sigue con la copia vieja".
    const sv = document.getElementById('set_srv_ver');
    if (!sv) return;
    sv.textContent = 'comprobando…';
    const remota = await this._versionServida();
    sv.textContent = remota || 'no se pudo leer (¿sin conexión?)';
  },

  /** Lee del servidor la CACHE_VERSION que sw.js publica en este momento,
      saltándose toda caché HTTP. No instala nada: solo mira. */
  async _versionServida() {
    try {
      const r = await fetch('sw.js?_=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) return null;
      const m = (await r.text()).match(/CACHE_VERSION\s*=\s*['"]([^'"]+)['"]/);
      return m ? m[1] : null;
    } catch (e) { return null; }
  },

  /** Nombre del caché en uso, sin adornos, para comparar con el servidor. */
  async _versionLocal() {
    try {
      const mine = (await caches.keys()).filter(k => k.startsWith('ss-director-'));
      return mine.length ? mine[mine.length - 1] : null;
    } catch (e) { return null; }
  },

  /** Último recurso cuando "Buscar actualización" dice que todo está al día
      pero la app sigue vieja: borra la copia local, da de baja el service
      worker y recarga desde red con la URL marcada, para que ni el
      navegador ni un CDN intermedio puedan devolver la versión rancia.
      NO toca los datos: amenazas, mesa y reglas se conservan. */
  async forceUpdate() {
    this.closeSettings();
    this._confirm(
      'Forzar actualización',
      'Se borra la copia local de la app y se descarga de nuevo desde el servidor. '
      + 'Tus amenazas, tu mesa y tus reglas NO se tocan. Hace falta conexión a internet.',
      'Forzar',
      () => this._forzarDescarga()
    );
  },

  /** Activa el worker en espera y recarga. El respaldo por temporizador existe
      porque en algunos navegadores controllerchange no llega a disparar. */
  _aplicarWorker(worker) {
    this._buscandoActualizacion = false;
    this.toast('Actualizando…', 'ok');
    try { sessionStorage.setItem('ssd_update_aplicada', '1'); } catch (e) {}
    worker.postMessage({ type: 'SKIP_WAITING' });
    setTimeout(() => location.reload(), 1400);
  },

  /** Borra la copia local y recarga desde red con la URL marcada, para que ni
      el navegador ni un CDN intermedio puedan devolver la versión rancia.
      NO toca los datos: amenazas, mesa y reglas se conservan. */
  async _forzarDescarga() {
    try { sessionStorage.setItem('ssd_update_forzada', '1'); } catch (e) {}
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister().catch(() => {})));
      }
      if ('caches' in window) {
        const ks = await caches.keys();
        await Promise.all(
          ks.filter(k => k.startsWith('ss-director-')).map(k => caches.delete(k))
        );
      }
    } catch (e) { /* se recarga igual: sin SW, la red manda */ }
    location.replace(location.pathname + '?_fresh=' + Date.now());
  },

  /** Tras recargar por una actualización, decir en qué versión se ha quedado.
      Sin esto la app se reinicia y parece que no ha pasado nada — que es
      justo lo que se sentía al pulsar los botones de Ajustes. */
  async _avisoTrasActualizar() {
    let clave = null;
    try {
      if (sessionStorage.getItem('ssd_update_forzada')) clave = 'forzada';
      else if (sessionStorage.getItem('ssd_update_aplicada')) clave = 'aplicada';
      sessionStorage.removeItem('ssd_update_forzada');
      sessionStorage.removeItem('ssd_update_aplicada');
    } catch (e) { return; }
    if (!clave) return;
    const v = await this._versionLocal() || await this._versionServida();
    const etiqueta = v ? ' — ' + v : '';
    const msg = (clave === 'forzada' ? 'App descargada de nuevo' : 'Actualizada') + etiqueta;
    // Esperar a que la pantalla de carga se haya ido: si no, el aviso nace
    // debajo del velo y se consume su tiempo sin que nadie lo vea.
    setTimeout(() => this.toast(msg, 'ok', null, { hold: TIMING.TOAST_VISIBLE * 3 }),
               TIMING.LOADER_DISMISS * 3);
  },

  async checkForUpdate() {
    // Los toasts se renderizan DEBAJO del top-layer del <dialog> de Ajustes:
    // con el modal abierto serían invisibles e intocables. Cerrarlo primero.
    this.closeSettings();
    if (!('serviceWorker' in navigator)) {
      this.toast('Este navegador no soporta actualizaciones automáticas', 'err');
      return;
    }
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) {
      this.toast('Sin service worker (¿abriste la app por file:// o en modo incógnito?)', 'err');
      return;
    }
    this.toast('Buscando actualización…');
    // Silencia el aviso automático de boot.js mientras dura esta comprobación:
    // reg.update() dispara su 'updatefound' y salían dos avisos superpuestos.
    this._buscandoActualizacion = true;
    try { await reg.update(); } catch (e) {
      this._buscandoActualizacion = false;
      this.toast('No se pudo comprobar (¿sin conexión?)', 'err');
      return;
    }
    // update() resuelve antes de que reg.installing se pueble: dar un margen
    // a que el worker nuevo aparezca, o el «estás al día» sería un falso
    // negativo justo cuando SÍ hay actualización.
    for (let i = 0; i < 12 && !reg.installing && !reg.waiting; i++) {
      await new Promise(r => setTimeout(r, 250));
    }
    // Esperar a que una instalación en curso termine (máx ~10 s)
    for (let i = 0; i < 40 && reg.installing; i++) {
      await new Promise(r => setTimeout(r, 250));
    }
    if (reg.waiting) {
      // Se APLICA, no se ofrece. Pedir un segundo toque sobre un toast era el
      // fallo: quien pulsa un botón llamado "Buscar actualización" ya ha dicho
      // que sí, y si tocaba fuera —o no veía el aviso— la actualización se
      // quedaba en espera y el botón parecía no hacer nada. El aviso del
      // arranque sí sigue siendo tocable: ese no lo pidió nadie.
      this._aplicarWorker(reg.waiting);
      return;
    }
    // Sin worker en espera hay DOS situaciones que se sentían iguales y
    // que el aviso "ya estás al día" confundía: que de verdad no haya nada
    // nuevo, o que el servidor publique una versión que este navegador se
    // niega a ver (CDN cacheando sw.js, proxy, copia sin subir). Se
    // resuelve preguntando al servidor qué versión sirve.
    const [remota, local] = await Promise.all([this._versionServida(), this._versionLocal()]);
    this._buscandoActualizacion = false;
    if (remota && local && remota !== local) {
      // El servidor publica otra versión pero el navegador no la ve: forzar es
      // la única salida, así que se fuerza en vez de proponerlo.
      this.toast(`El servidor sirve ${remota} y tú tienes ${local} — forzando…`, 'info');
      this._forzarDescarga();
      return;
    }
    if (remota && local) {
      this.toast(`Ya tienes la última versión (${remota})`, 'ok');
      return;
    }
    this.toast('Ya tienes la última versión', 'ok');
  },

  /** Cierra el <dialog> de Ajustes tolerando entornos sin close(). */
  _closeSettingsDlg() {
    const dlg = document.getElementById('settings_modal');
    if (!dlg) return;
    if (typeof dlg.close === 'function') { try { dlg.close(); return; } catch (_) {} }
    dlg.removeAttribute('open');
  },

  /** Cierra Ajustes con escudo: el toque de cierre no traspasa a la hoja. */
  /** Línea de espacio en «Copias y datos»: cuánto ocupa la app y si el
      almacenamiento está protegido (persistente) en este dispositivo. */
  _pintarEspacio() {
    const el = document.getElementById('espacio_estado');
    if (!el) return;
    STORAGE.espacio().then(e => {
      if (!e) { el.textContent = ''; return; }
      const mb = b => (b / 1048576).toFixed(b < 10485760 ? 1 : 0).replace('.', ',');
      el.textContent = `Espacio: ${mb(e.usado)} MB usados`
        + (e.cupo ? ` de ${mb(e.cupo)} MB` : '')
        + (e.persistente ? ' · protegido' : '')
        + (e.idb ? '' : ' · modo básico (≈5 MB)');
    });
  },

  closeSettings() {
    this._tapShield();  // anti-traspaso de toques
    if (typeof UI !== 'undefined') this._settingsShieldRelease = UI.ghostShield();
    this._closeSettingsDlg();
    // Descarta la vista previa del retrato aquí mismo y no solo en el evento
    // «close» del <dialog>: ese evento va ligado al pintado y hay entornos
    // (pestaña en segundo plano, WebViews) en los que llega tarde o no llega.
    // Si llega, la segunda llamada no encuentra nada que descartar.
  },

  /** Secciones plegables de Ajustes: se abren como se dejaron. Por defecto
      solo Apariencia, que es lo que más se toca. */
  _syncSeccionesAjustes() {
    let est = {};
    try { est = JSON.parse(localStorage.getItem('ssd_set_secs') || '{}') || {}; } catch (e) {}
    document.querySelectorAll('#settings_modal .set-sec').forEach(d => {
      const k = d.dataset.sec;
      if (k in est) d.open = !!est[k];
      if (!d._secListo) {
        d._secListo = true;
        d.addEventListener('toggle', () => {
          let e2 = {};
          try { e2 = JSON.parse(localStorage.getItem('ssd_set_secs') || '{}') || {}; } catch (e) {}
          e2[k] = d.open;
          try { localStorage.setItem('ssd_set_secs', JSON.stringify(e2)); } catch (e) {}
        });
      }
    });
  },

  togglePortraitBorder() {
    // Cycles: premium → subtle (old look) → back
    // _portBorderMode: 'premium' | 'subtle'
    this._portBorderMode = (this._portBorderMode === 'premium') ? 'subtle' : 'premium';
    this._applyPortraitBorder();
    // Vista previa con personaje abierto; global solo desde Inicio.
    localStorage.setItem('ssd_port_border', this._portBorderMode);
  },

  _applyPortraitBorder() {
    const mode = this._portBorderMode || 'premium';
    document.body.classList.remove('port-border-subtle', 'port-border-none');
    if (mode === 'subtle') document.body.classList.add('port-border-subtle');
    // Fraseo positivo en la UI: pressed=true ⇒ "Borde Premium" ACTIVO.
    const btn = document.getElementById('port_border_btn');
    if (btn) btn.setAttribute('aria-pressed', mode === 'premium' ? 'true' : 'false');
  },

  toggleScrollPreserve() {
    this.scrollPreserve = !this.scrollPreserve;
    this._pageScrolls = {}; // reset saved positions when toggling
    localStorage.setItem(STORAGE.KEYS.scrollPreserve, this.scrollPreserve ? '1' : '0');
    this._syncScrollPreserveBtn();
  },

  _syncScrollPreserveBtn() {
    const btn = document.getElementById('scroll_preserve_btn');
    const lbl = document.getElementById('scroll_preserve_lbl');
    if (btn) btn.setAttribute('aria-pressed', String(this.scrollPreserve));
    if (lbl) lbl.textContent = 'Recordar posición';
  },

  toggleDial() {
    const menu = document.getElementById('sdial_menu');
    const btn  = document.querySelector('.sdial-btn');
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      const _closeDial = () => {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      };
      // Close on click OR touchstart outside the dial — covers both desktop and mobile
      const _guard = (e) => {
        const dialEl = document.getElementById('sdial');
        if (!dialEl?.contains(e.target)) { _closeDial(); }
      };
      setTimeout(() => {
        document.addEventListener('click',      _guard, {once:true});
        document.addEventListener('touchstart', _guard, {once:true, passive:true});
      }, 10);
    }
  },

  /* ── DEBOUNCE HELPER ──
   * Returns a debounced version of fn that delays invocation by ms.
   * Uses an arrow function so it inherits the enclosing `this` from
   * the app object — no .bind() needed at the call site.            */
  _debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  },

};
