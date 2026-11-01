/* ══════════════════════════════════════════════════════════════
   MESA DEL DIRECTOR
   Cuatro pestañas con las herramientas de la Guía del Director:
     · Encuentro — NA del encuentro y dificultad (Cap. 2), iniciativa
       y seguimiento de PV, estados y Moral.
     · Botín     — riqueza por nivel (Cap. 12) y generación modular de
       objetos mágicos (Cap. 13).
     · Zonas     — «la zona en una ficha», Etiquetas de Zona (Cap. 4),
       Dado de Riesgo y Reacción (Cap. 5), peligros y trampas.
     · Facciones — estadísticas, objetivos y conflicto (Cap. 11).

   Se guarda sola (IndexedDB, clave ssd_mesa): aquí no hay botón Guardar.
══════════════════════════════════════════════════════════════ */
Object.assign(app, {
  mesa: null,
  _mAbiertos: new Set(),     // tarjetas desplegadas (zonas, facciones, tesoro…)

  _mesaNueva() {
    return {
      v: 1, grupo: { nivel: 1, pjs: 4 },
      enc: { nombre: '', items: [] }, combate: null, guardados: [],
      botinUlt: '', objeto: null, objCfg: { zona: 0, rareza: '', maldito: false }, tesoro: [],
      riesgo: { nivel: 'normal', ult: '' }, reaccion: { mod: 0, ult: '' },
      zonas: [], trampaNa: 3, trampaUlt: '',
      facciones: [], conflicto: { a: '', d: '', attr: 'f', ult: '' }, noticias: '',
    };
  },

  initMesa() {
    const base = this._mesaNueva();
    const g = STORAGE.loadMesa() || {};
    const m = { ...base, ...g };
    m.grupo = { ...base.grupo, ...(g.grupo || {}) };
    m.enc = { ...base.enc, ...(g.enc || {}) };
    ['guardados', 'tesoro', 'zonas', 'facciones'].forEach(k => { if (!Array.isArray(m[k])) m[k] = []; });
    if (!Array.isArray(m.enc.items)) m.enc.items = [];
    m.objCfg = { ...base.objCfg, ...(g.objCfg || {}) };
    m.riesgo = { ...base.riesgo, ...(g.riesgo || {}) };
    m.reaccion = { ...base.reaccion, ...(g.reaccion || {}) };
    m.conflicto = { ...base.conflicto, ...(g.conflicto || {}) };
    this.mesa = m;
  },

  abrirMesa() {
    this.limpiarFicha();
    this._ponerModo('mesa');
    this.showScreen('app');
    const ttl = document.getElementById('app_hdr_ttl');
    if (ttl) ttl.textContent = 'Mesa del Director';
    const lbl = document.getElementById('last_saved_lbl');
    if (lbl) { lbl.className = 'last-saved'; lbl.textContent = 'se guarda sola'; }
    this.pintarMesa();
    this.goToPage(0);
  },

  /** Guarda la Mesa en segundo plano, sin interrumpir a quien escribe. */
  guardarMesa() {
    if (!this._guardarMesaDeb) this._guardarMesaDeb = this._debounce(() => {
      const ok = STORAGE.saveMesa(this.mesa);
      const lbl = document.getElementById('last_saved_lbl');
      if (!lbl || this.modo !== 'mesa') return;
      if (!ok) { lbl.className = 'last-saved unsaved'; lbl.textContent = 'sin espacio'; return; }
      const ts = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });
      lbl.className = 'last-saved';
      lbl.textContent = `guardado ${ts}`;
    }, 350);
    this._guardarMesaDeb();
  },
  /** Cambio de estructura: guarda y repinta. */
  mesaCambio() { this.guardarMesa(); this.pintarMesa(); },

  pintarMesa() {
    if (!this.mesa) return;
    this._pintarGrupo(); this._pintarEncuentro(); this._pintarCombate();
    this._pintarBotin(); this._pintarObjeto(); this._pintarTesoro(); this._pintarBotinRef();
    this._pintarTiradas(); this._pintarZonas(); this._pintarPeligros();
    this._pintarFacciones(); this._pintarConflicto(); this._pintarTurno();
    if (typeof this._refrescarPlegables === 'function') this._refrescarPlegables();
  },

  /* Tarjeta desplegable que recuerda si estaba abierta. */
  _dc(id, titulo, etiqueta, pintarCuerpo) {
    const card = this.h('div', 'dc' + (this._mAbiertos.has(id) ? ' open' : ''));
    const dch = this.h('div', 'dch');
    dch.append(this.h('span', 'dct', titulo));
    if (etiqueta) dch.appendChild(this.h('span', 'dc-gbadge dir-peso', etiqueta));
    dch.appendChild(this.h('span', 'dca', '▾'));
    const dcb = this.h('div', 'dcb');
    let pintado = false;
    const pintar = () => { if (!pintado) { pintado = true; pintarCuerpo(dcb); } };
    if (this._mAbiertos.has(id)) pintar();
    dch.addEventListener('click', () => {
      const abierta = card.classList.toggle('open');
      if (abierta) { this._mAbiertos.add(id); pintar(); } else this._mAbiertos.delete(id);
    });
    card.append(dch, dcb);
    return card;
  },
  _texto(valor, alEscribir, etiqueta, ayuda, larga) {
    const e = document.createElement(larga ? 'textarea' : 'input');
    if (!larga) { e.type = 'text'; e.autocomplete = 'off'; } else e.style.minHeight = '56px';
    e.value = valor || '';
    if (ayuda) e.placeholder = ayuda;
    if (etiqueta) e.setAttribute('aria-label', etiqueta);
    e.addEventListener('input', () => { alEscribir(e.value); this.guardarMesa(); });
    return e;
  },
  _boton(html, alPulsar, cls) {
    const b = this.h('button', cls || 'btn btn-g'); b.type = 'button';
    b.innerHTML = html;
    b.addEventListener('click', alPulsar);
    return b;
  },
  _quitar(etiqueta, alPulsar) {
    const b = this._boton(this._ico('i-x') + 'Quitar', alPulsar, 'bmini br');
    b.setAttribute('aria-label', etiqueta);
    return b;
  },

  /* ══════════ ENCUENTRO ══════════ */
  _filaEncuentro(nivel) {
    const k = nivel <= 2 ? '1-2' : nivel <= 4 ? '3-4' : nivel <= 6 ? '5-6' : nivel <= 8 ? '7-8' : '9-10';
    return this.DB.encuentros[k];
  },
  /** NA del encuentro que corresponde a cada dificultad para este grupo: la
      fila de su nivel, que es para cuatro personajes, ±1 según cuántos sean. */
  umbrales() {
    const g = this.mesa.grupo;
    const f = this._filaEncuentro(g.nivel);
    // Con jugadores que empiezan, la tabla baja un escalón: su Estándar les pesa
    // como un Peligroso (Manual de Monstruos, Cap. 4; entrega del 18-10-2026).
    const d = (Number(this.DB.grupoAjuste[g.pjs]) || 0) - (g.novatos ? 1 : 0);
    return { f: f.f + d, e: f.e + d, p: f.p + d, m: f.m + d, fila: f, ajuste: d };
  },

  _pintarGrupo() {
    const host = document.getElementById('grupo_body'); if (!host) return;
    const g = this.mesa.grupo;
    host.textContent = '';
    const fila = this.h('div', 'g2 dir-g2');
    fila.append(
      this._campo('Nivel', this._paso(g.nivel, 1, 10, n => { g.nivel = n; this.mesaCambio(); }, 'el nivel del grupo')),
      this._campo('Personajes', this._paso(g.pjs, 1, 6, n => { g.pjs = n; this.mesaCambio(); }, 'el número de personajes')));
    host.appendChild(fila);
    const nov = this.h('div', 'set-row dir-fila-toggle');
    const txt = this.h('div', 'set-row-txt');
    txt.append(this.h('span', 'set-lbl', 'Jugadores que empiezan'),
      this.h('span', 'set-hint', 'La tabla supone jugadores que conocen sus fichas y usan el Esfuerzo; si empiezan, −1 NA en cada dificultad.'));
    const tg = this.h('button', 'toggle-btn'); tg.type = 'button';
    tg.setAttribute('aria-pressed', String(!!g.novatos));
    tg.setAttribute('aria-label', 'Jugadores que empiezan');
    tg.addEventListener('click', () => { g.novatos = !g.novatos; this.mesaCambio(); });
    nov.append(txt, tg);
    host.appendChild(nov);
    if (g.pjs === 3 || g.pjs >= 5) host.appendChild(this.h('p', 'dir-nota',
      `La tabla es para cuatro personajes: con ${g.pjs}, ${g.pjs > 4 ? '+1' : '−1'} NA en cada dificultad.`));
    if (g.pjs <= 2) host.appendChild(this.h('p', 'dir-aviso', g.pjs === 1
      ? 'Un solo personaje: el Manual no da ajuste (aquí, −2 NA en cada dificultad). Aplica el Filo del Protagonista —todo el daño enemigo a la mitad— y el Barrido de secuaces.'
      : 'Dúo: −1 NA en cada dificultad. Aplica el Filo del Protagonista —el daño enemigo se reduce un tercio— y el Barrido de secuaces.'));
  },

  /** NA del encuentro (Manual de Monstruos, Cap. 4). Parte del NA de encuentro
      más alto: cada criatura cuenta 1 si está a 0 o 1 NA de él; ½ a 2 o 3; ¼ a 4;
      nada a 5 o más. Sube con lo que sumen: 1½, +2; 2, +3; 3, +4; 4 o 5, +6;
      6 o 7, +7; 8 o más, +9.
      `lineas` = [{ na, cuenta }]: el jefe, la Aptitud de área, el tamaño, los
      Axiomas, la horda y el exceso de Potencial ya vienen en el NA de cada
      criatura (calcCr → naEnc), y el esbirro cuenta ¼.
      Lo que el Manual no dice: entre 1 y 1½ el NA no sube; y si solo hay
      esbirros y no llegan a cuatro, el NA baja (dos esbirros, 3 menos; uno, 6). */
  _naDeLineas(lineas) {
    if (!lineas.length) return { na: null, max: null, suma: 0, sube: 0 };
    const max = Math.max(...lineas.map(l => l.na));
    const suma = lineas.reduce((a, l) => a + l.cuenta * this._pesoEnc(max - l.na), 0);
    const sube = suma >= 8 ? 9 : suma >= 6 ? 7 : suma >= 4 ? 6 : suma >= 3 ? 4 : suma >= 2 ? 3 : suma >= 1.5 ? 2
      : suma >= 1 ? 0 : suma >= .5 ? -3 : -6;
    return { na: Math.max(0, max + sube), max, suma, sube };
  },
  _pesoEnc(porDebajo) { return porDebajo <= 1 ? 1 : porDebajo <= 3 ? .5 : porDebajo === 4 ? .25 : 0; },
  _naEncuentro() {
    const roster = STORAGE.loadRoster();
    const lineas = [];
    let n = 0;
    this.mesa.enc.items.forEach(it => {
      const d = roster[it.ref]; if (!d) return;
      const S = this.calcCr(this.normalizarCr(d));
      lineas.push({ na: S.naEnc, cuenta: S.cuenta * it.n }); n += it.n;
    });
    return { ...this._naDeLineas(lineas), n };
  },
  /** 1½, ¼, 2… */
  _fmtSuma(x) {
    const ent = Math.floor(x), g = { 0: '', .125: '⅛', .25: '¼', .375: '⅜', .5: '½', .625: '⅝', .75: '¾', .875: '⅞' }[x - ent];
    if (g == null) return x.toLocaleString('es', { maximumFractionDigits: 2 });
    return (ent || !g ? String(ent) : '') + g;
  },
  _dificultad(na, U) {
    if (na == null) return { k: '', n: 'Sin amenazas' };
    if (na >= U.m) return { k: 'm', n: 'Mortal' };
    if (na >= U.p) return { k: 'p', n: 'Peligroso' };
    if (na >= U.e) return { k: 'e', n: 'Estándar' };
    if (na >= U.f) return { k: 'f', n: 'Fácil' };
    return { k: 't', n: 'Trivial' };
  },

  _pintarEncuentro() {
    const host = document.getElementById('encuentro_body'); if (!host) return;
    const enc = this.mesa.enc;
    const roster = STORAGE.loadRoster();
    const E = this._naEncuentro();
    host.textContent = '';
    host.appendChild(this._campo('Nombre del encuentro', this._texto(enc.nombre, v => { enc.nombre = v; }, 'Nombre del encuentro', 'ej. Emboscada en el vado')));

    const lista = this.h('div', 'dir-lista');
    enc.items.forEach((it, i) => {
      const d = roster[it.ref];
      const fila = this.h('div', 'dir-fila' + (d ? '' : ' is-rota'));
      const info = this.h('div', 'dir-fila-info');
      if (d) {
        const cr = this.normalizarCr(d);
        const S = this.calcCr(cr);
        info.append(this.h('span', 'dir-fila-n', it.ref),
          this.h('span', 'dir-fila-s', `${this._etiquetaNA(cr)} · ${this.DB.roles[cr.rol]?.name || 'Sin Rol'} · ${this._txtCuenta(S, it.n, E.max)}`));
      } else info.append(this.h('span', 'dir-fila-n', it.ref), this.h('span', 'dir-fila-s', 'Ya no está en tus amenazas'));
      const ctl = this.h('div', 'dir-fila-ctl');
      ctl.appendChild(this._paso(it.n, 1, 40, n => { it.n = n; this.mesaCambio(); }, `cuántos de ${it.ref}`, '×' + it.n));
      const x = this._boton('<svg class="ico ico-solo" aria-hidden="true"><use href="#i-x"/></svg>', () => { enc.items.splice(i, 1); this.mesaCambio(); }, 'bmini br');
      x.setAttribute('aria-label', 'Quitar ' + it.ref);
      ctl.appendChild(x);
      fila.append(info, ctl);
      lista.appendChild(fila);
    });
    if (!enc.items.length) lista.innerHTML = '<div class="empty-state"><span class="es-rune">✦</span><span class="es-line">Encuentro vacío</span><div class="es-hint">Diseña la composición antes que los individuos</div></div>';
    host.appendChild(lista);

    // Dificultad
    const U = this.umbrales();
    const dif = this._dificultad(E.na, U);
    const caja = this.h('div', 'dir-dif');
    const cab = this.h('div', 'dir-dif-cab');
    cab.append(this.h('span', 'dir-dif-n', dif.n), this.h('span', 'dir-dif-va', E.na == null ? '' : 'NA ' + E.na));
    caja.appendChild(cab);
    const bandas = this.h('div', 'dir-bandas');
    [['f', 'Fácil', U.f], ['e', 'Estándar', U.e], ['p', 'Peligroso', U.p], ['m', 'Mortal', U.m]].forEach(([k, n, v]) => {
      const b = this.h('div', 'dir-banda' + (dif.k === k ? ' on' : ''));
      b.dataset.k = k;
      b.append(this.h('span', 'dir-banda-n', n), this.h('span', 'dir-banda-v', v < 0 ? '—' : 'NA ' + v + (k === 'm' ? '+' : '')));
      bandas.appendChild(b);
    });
    caja.appendChild(bandas);
    host.appendChild(caja);
    if (E.na != null) host.appendChild(this.h('p', 'dir-nota dir-centro',
      `La más fuerte es NA ${E.max} y el encuentro suma ${this._fmtSuma(E.suma)}` + (E.sube ? `: ${this._signo(E.sube)} NA.` : '.')));
    host.appendChild(this.h('p', 'dir-nota', 'NA del encuentro: cada criatura cuenta 1 si está a 0 o 1 NA de la más fuerte; ½ a 2 o 3; ¼ a 4. Si suman 1½, +2 NA; 2, +3; 3, +4; 4 o 5, +6; 6 o 7, +7; 8 o más, +9. Cada criatura entra con su NA de encuentro (jefe, Aptitud de área, tamaño, Axiomas, exceso de Potencial); cuatro esbirros cuentan como una. Lo que pueda invocar, súmalo como si estuviera desde el principio, a mitad de valor.'));

    const acc = this.h('div', 'dir-acc dir-acc-centro');
    acc.append(
      this._boton(this._ico('i-mas') + 'Añadir amenaza', () => this._elegirParaEncuentro()),
      this._boton(this._ico('i-d20') + 'Composición', () => this.tirarTabla('bandas', 'Composición de la banda')),
      this._boton(this._ico('i-down') + 'Guardar', () => this._guardarEncuentro()),
      this._boton(this._ico('i-up') + `Guardados (${this.mesa.guardados.length})`, () => this._abrirGuardados()));
    host.appendChild(acc);
  },

  /** Lo que una línea del encuentro aporta al total: «cuenta 1½», «no cuenta». */
  _txtCuenta(S, n, max) {
    const v = S.cuenta * n * this._pesoEnc(max - S.naEnc);
    const como = S.naEnc !== S.na ? `como NA ${S.naEnc}, ` : '';
    return v ? `${como}cuenta ${this._fmtSuma(v)}` : `${como}no cuenta`;
  },
  _notaCalibrar(cr) {
    const S = this.calcCr(cr);
    return S.esbirro ? ' · cuatro cuentan como una' : (S.naEnc !== S.na ? ` · al calibrar, NA ${S.naEnc}` : '');
  },
  _elegirParaEncuentro() {
    const enc = this.mesa.enc;
    this.abrirSelector({
      titulo: 'Añadir amenaza',
      sub: 'Cada toque suma una al encuentro',
      buscar: 'Buscar entre tus amenazas…',
      vacio: 'Aún no tienes amenazas: créalas o tráelas del Bestiario.',
      items: () => {
        const roster = STORAGE.loadRoster();
        return Object.keys(roster).map(k => {
          const cr = this.normalizarCr(roster[k]);
          const it = enc.items.find(x => x.ref === k);
          return { k, nombre: k, etiqueta: it ? '×' + it.n : this._etiquetaNA(cr), texto: this._lineaCr(cr) + this._notaCalibrar(cr), sel: !!it };
        });
      },
      alElegir: k => {
        const it = enc.items.find(x => x.ref === k);
        if (it) it.n = Math.min(40, it.n + 1); else enc.items.push({ ref: k, n: 1 });
        this.guardarMesa();
        return true;
      },
      info: () => { const E = this._naEncuentro(); return E.na == null ? 'Encuentro vacío' : `${E.n} en el encuentro · NA ${E.na} · ${this._dificultad(E.na, this.umbrales()).n}`; },
      alCerrar: () => this.pintarMesa(),
    });
  },
  _guardarEncuentro() {
    const enc = this.mesa.enc;
    if (!enc.items.length) { this.toast('El encuentro está vacío', 'err'); return; }
    const nombre = (enc.nombre || '').trim() || 'Encuentro ' + (this.mesa.guardados.length + 1);
    const i = this.mesa.guardados.findIndex(g => g.nombre === nombre);
    const copia = { nombre, items: structuredClone(enc.items) };
    if (i >= 0) this.mesa.guardados[i] = copia; else this.mesa.guardados.push(copia);
    enc.nombre = nombre;
    this.mesaCambio();
    this.toast(`Encuentro «${nombre}» guardado`, 'ok');
  },
  _abrirGuardados() {
    if (!this.mesa.guardados.length) { this.toast('Aún no has guardado ningún encuentro', 'info'); return; }
    this.abrirSelector({
      titulo: 'Encuentros guardados',
      sub: 'Toca uno para cargarlo en la Mesa',
      items: () => this.mesa.guardados.map((g, i) => ({ k: String(i), nombre: g.nombre, etiqueta: g.items.reduce((a, x) => a + x.n, 0) + ' criaturas',
        texto: g.items.map(x => `${x.n}× ${x.ref}`).join(' · ') })),
      alElegir: k => {
        const g = this.mesa.guardados[+k];
        this.mesa.enc = { nombre: g.nombre, items: structuredClone(g.items) };
        this.cerrarSelector();
        this.toast(`«${g.nombre}» cargado`, 'ok');
        return false;
      },
      alCerrar: () => this.mesaCambio(),
    });
  },

  /* ── Combate en curso ─────────────────────────────────────────── */
  empezarCombate() {
    const roster = STORAGE.loadRoster();
    const filas = [];
    for (let i = 1; i <= this.mesa.grupo.pjs; i++) filas.push({ id: this._uid(), t: 'pj', nombre: 'PJ ' + i, ini: null });
    this.mesa.enc.items.forEach(it => {
      const d = roster[it.ref]; if (!d) return;
      const cr = this.normalizarCr(d);
      const S = this.calcCr(cr);
      const lenta = cr.rasgos.some(r => r.id === 'lenta');
      // Los enemigos del mismo tipo comparten iniciativa (Manual Básico, Cap. 9)
      const ini = lenta ? -99 : this._d(20) + S.ini;
      for (let k = 1; k <= it.n; k++) {
        filas.push({ id: this._uid(), t: 'cr', ref: it.ref, nombre: it.n > 1 ? `${it.ref} ${k}` : it.ref, ini, pv: S.pv, pvMax: S.pv,
          g: S.guardia, a: S.armadura, atk: S.ataque, dano: S.dano, moral: S.noMoral ? null : S.moral, na: S.na,
          lider: cr.rol === 'comandante' || cr.estructura === 'jefe', estados: [] });
      }
    });
    if (!filas.some(f => f.t === 'cr')) { this.toast('Añade al menos una amenaza al encuentro', 'err'); return; }
    this.mesa.combate = { ronda: 1, turno: 0, filas };
    this._ordenarCombate();
    this.mesaCambio();
    this.toast('Iniciativa tirada: anota la de los personajes', 'info');
  },
  _ordenarCombate() {
    const c = this.mesa.combate; if (!c) return;
    const actual = c.filas[c.turno]?.id;
    // Sin iniciativa anotada, el PJ queda arriba hasta que se escriba; en el
    // empate, los jugadores van antes que los PNJ.
    const val = f => f.ini == null ? 999 : f.ini;
    c.filas.sort((a, b) => (val(b) - val(a)) || ((a.t === 'pj' ? 0 : 1) - (b.t === 'pj' ? 0 : 1)));
    const i = c.filas.findIndex(f => f.id === actual);
    c.turno = i >= 0 ? i : 0;
  },
  siguienteTurno() {
    const c = this.mesa.combate; if (!c) return;
    const n = c.filas.length;
    for (let k = 1; k <= n; k++) {
      const i = (c.turno + k) % n;
      const f = c.filas[i];
      if (f.t === 'cr' && f.pv <= 0) continue;
      if (i <= c.turno) c.ronda++;
      c.turno = i;
      break;
    }
    this.mesaCambio();
    requestAnimationFrame(() => document.querySelector('#combate_body .dir-turno.on')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  },
  moralCombate() {
    const c = this.mesa.combate; if (!c) return;
    const vivos = c.filas.filter(f => f.t === 'cr' && f.pv > 0 && f.moral != null);
    if (!vivos.length) { this.toast('Ninguna de las que quedan tira Moral: huyen cuando deja de compensar', 'info'); return; }
    // La del líder o, si no hay, la del miembro de NA más alto (Guía, Cap. 2)
    const jefe = vivos.filter(f => f.lider).sort((a, b) => b.na - a.na)[0] || vivos.slice().sort((a, b) => b.na - a.na)[0];
    this.tirarMoral(jefe.moral, 'Moral de ' + jefe.ref);
  },
  terminarCombate() {
    this._confirm('¿Terminar el combate?', 'Se borra la iniciativa y los PV anotados. El encuentro se conserva.', 'Terminar', () => {
      this.mesa.combate = null;
      this.mesaCambio();
    });
  },

  _pintarCombate() {
    const host = document.getElementById('combate_body'); if (!host) return;
    const c = this.mesa.combate;
    host.textContent = '';
    if (!c) {
      host.appendChild(this.h('p', 'dir-nota', 'Tira la iniciativa de las amenazas (1d20 + su bono; las del mismo tipo comparten tirada) y lleva sus PV, estados y Moral.'));
      const acc = this.h('div', 'dir-acc dir-acc-centro');
      acc.appendChild(this._boton(this._ico('i-sword') + 'Empezar combate', () => this.empezarCombate(), 'btn btn-gold'));
      host.appendChild(acc);
      return;
    }
    const cab = this.h('div', 'dir-dif-cab');
    cab.append(this.h('span', 'dir-dif-n', 'Ronda ' + c.ronda), this.h('span', 'dir-dif-va', `${c.filas.filter(f => f.t === 'cr' && f.pv > 0).length} en pie`));
    host.appendChild(cab);

    const lista = this.h('div', 'dir-lista');
    c.filas.forEach((f, i) => {
      const caida = f.t === 'cr' && f.pv <= 0;
      const fila = this.h('div', 'dir-turno' + (i === c.turno ? ' on' : '') + (caida ? ' is-caida' : '') + (f.t === 'pj' ? ' is-pj' : ''));
      const l1 = this.h('div', 'dir-turno-l1');
      const ini = document.createElement('input');
      ini.type = 'text'; ini.inputMode = 'numeric'; ini.className = 'dir-ini';
      ini.value = f.ini == null ? '' : (f.ini === -99 ? 'últ.' : f.ini);
      ini.placeholder = 'ini';
      ini.setAttribute('aria-label', 'Iniciativa de ' + f.nombre);
      ini.addEventListener('change', () => {
        const n = parseInt(ini.value, 10);
        f.ini = Number.isFinite(n) ? n : null;
        // Las del mismo tipo comparten iniciativa: cambiar una cambia todas
        if (f.t === 'cr') c.filas.forEach(o => { if (o.t === 'cr' && o.ref === f.ref) o.ini = f.ini; });
        this._ordenarCombate(); this.mesaCambio();
      });
      l1.appendChild(ini);
      if (f.t === 'pj') {
        const nom = this._texto(f.nombre, v => { f.nombre = v; }, 'Nombre del personaje', 'Personaje');
        nom.className = 'dir-pj-n';
        l1.appendChild(nom);
      } else {
        const info = this.h('div', 'dir-fila-info');
        info.append(this.h('span', 'dir-fila-n', f.nombre),
          this.h('span', 'dir-fila-s', `G ${f.g} · A ${f.a} · ${this._signo(f.atk)} · ${f.dano}`));
        l1.appendChild(info);
        l1.appendChild(this.h('span', 'dir-pv' + (f.pv <= f.pvMax / 2 ? ' is-baja' : ''), caida ? 'caída' : `${f.pv}/${f.pvMax}`));
      }
      fila.appendChild(l1);
      if (f.t === 'cr') {
        const l2 = this.h('div', 'dir-turno-l2');
        const cant = document.createElement('input');
        cant.type = 'text'; cant.inputMode = 'numeric'; cant.className = 'dir-cant'; cant.placeholder = '1';
        cant.setAttribute('aria-label', 'Cantidad de daño o curación para ' + f.nombre);
        const aplicar = signo => {
          const n = Math.max(1, parseInt(cant.value, 10) || 1);
          f.pv = Math.max(0, Math.min(f.pvMax, f.pv + signo * n));
          this.mesaCambio();
        };
        const menos = this._boton('−', () => aplicar(-1), 'dir-pm'); menos.setAttribute('aria-label', 'Dañar a ' + f.nombre);
        const mas = this._boton('+', () => aplicar(1), 'dir-pm'); mas.setAttribute('aria-label', 'Curar a ' + f.nombre);
        const sel = this._select([['', '+ estado']].concat(Object.entries(this.DB.estados).map(([k, e]) => [k, e.name + (e.ud ? ' ' + e.ud : '')])), '', k => {
          if (k && !f.estados.includes(k)) f.estados.push(k);
          this.mesaCambio();
        }, 'Añadir un estado a ' + f.nombre);
        sel.className = 'dir-estado-sel';
        l2.append(menos, cant, mas, sel);
        fila.appendChild(l2);
        if (f.estados.length) {
          const chips = this.h('div', 'dir-chips');
          f.estados.forEach(k => {
            const e = this.DB.estados[k]; if (!e) return;
            const ch = this._boton(e.name + ' ×', () => { f.estados = f.estados.filter(x => x !== k); this.mesaCambio(); }, 'dir-chip');
            ch.title = e.txt;
            ch.setAttribute('aria-label', `Quitar ${e.name} de ${f.nombre}. ${e.txt}`);
            chips.appendChild(ch);
          });
          fila.appendChild(chips);
        }
      }
      lista.appendChild(fila);
    });
    host.appendChild(lista);

    const acc = this.h('div', 'dir-acc dir-acc-centro');
    acc.append(
      this._boton(this._ico('i-check') + 'Siguiente turno', () => this.siguienteTurno(), 'btn btn-gold'),
      this._boton(this._ico('i-d20') + 'Moral', () => this.moralCombate()),
      this._boton(this._ico('i-x') + 'Terminar', () => this.terminarCombate()));
    host.appendChild(acc);
    const mitad = c.filas.filter(f => f.t === 'cr');
    if (mitad.length && mitad.filter(f => f.pv <= 0).length * 2 >= mitad.length)
      host.appendChild(this.h('p', 'dir-aviso', 'La mitad o más ha caído: comprueba la Moral.'));
  },

  /* ══════════ BOTÍN ══════════ */
  _pintarBotin() {
    const host = document.getElementById('botin_body'); if (!host) return;
    const r = this.DB.riqueza[this.mesa.grupo.nivel] || this.DB.riqueza[1];
    host.textContent = '';
    const box = this.h('div', 'dir-lineas');
    [['Por sesión', r.sesion], ['Riqueza del grupo', r.acum], ['Objetos mágicos', r.objetos]].forEach(([k, v]) => {
      const p = this.h('div', 'dir-linea'); p.append(this.h('span', 'dir-linea-k', k), this.h('span', 'dir-linea-v', v)); box.appendChild(p);
    });
    host.appendChild(this.h('p', 'dir-nota', `Grupo de nivel ${this.mesa.grupo.nivel} (se cambia en Encuentro). Es una referencia, no una cuota.`));
    host.appendChild(box);
    if (this.mesa.botinUlt) host.appendChild(this.h('p', 'dir-resultado', this.mesa.botinUlt));
    const acc = this.h('div', 'dir-acc dir-acc-centro');
    acc.appendChild(this._boton(this._ico('i-d20') + 'Tirar el botín de la sesión', () => {
      const paso = r.sesMax >= 1000 ? 50 : 5;
      const pp = Math.round((r.sesMin + Math.random() * (r.sesMax - r.sesMin)) / paso) * paso;
      this.mesa.botinUlt = `Esta sesión: ${pp.toLocaleString('es')} cr`;
      this.mesaCambio();
    }));
    host.appendChild(acc);
    host.appendChild(this.h('p', 'dir-nota', 'El botín bien diseñado nunca alcanza para todo lo que el grupo quiere: mantenlo un escalón por debajo de sus ambiciones.'));
  },

  /** Generación modular de la Guía (Cap. 13): rareza → tipo → propiedades → historia. */
  generarObjeto() {
    const cfg = this.mesa.objCfg;
    const R = this.DB.rarezas;
    let rk = cfg.rareza, tirada = '';
    if (!rk || !R[rk]) {
      const d = this._d(6), total = d + cfg.zona;
      rk = Object.keys(R).find(k => {
        const nums = String(R[k].d6).match(/\d+/g).map(Number);
        return total >= nums[0] && total <= nums[nums.length - 1];
      }) || Object.keys(R)[0];
      tirada = `1d6 = ${d}${cfg.zona ? ' + ' + cfg.zona : ''}`;
    }
    const rar = R[rk];
    const tipo = this._azar(this.DB.tablas.objTipo.filas);
    const props = [];
    const claves = Object.keys(this.DB.propiedades);
    let guard = 0;
    while (props.length < (rar.props || 0) && guard++ < 80) {
      const d = this._d(20);
      const k = claves.find(x => d >= this.DB.propiedades[x].min && d <= this.DB.propiedades[x].max);
      if (!k || props.some(p => p.k === k)) continue;
      const p = this.DB.propiedades[k];
      let txt = p.txt;
      // El techo del bono lo fija la rareza
      if (p.bono === 'atk' && rar.atk && rar.atk !== '—') txt = `${rar.atk.split(' ')[0]} al ataque.`;
      if (p.bono === 'def' && rar.def && rar.def !== '—') txt = `${rar.def.split(' ')[0]} a la Guardia o de Armadura, según lo que el objeto haga en la ficción.`;
      if (p.bono === 'dano' && rar.dano && rar.dano !== '—') txt = `Añade ${rar.dano} de daño de ${this._azar(['Fuego', 'Frío', 'Rayo', 'Ácido', 'Veneno', 'Necrótico', 'Radiante'])}.`;
      props.push({ k, name: p.name, txt });
    }
    const o = { id: this._uid(), nombre: `${tipo.split(' (')[0]} ${rar.name.toLowerCase()}`, rareza: rk, tipo, tirada, props,
      historia: ['', '', ''], notas: '' };
    if (rk === 'legendario' || rk === 'artefacto_unico') o.props.push({ k: 'unica', name: 'Propiedad única', txt: 'Defínela tú: algo que no aparece en la tabla, propio de la historia del objeto.' });
    if (cfg.maldito) { const m = this._azar(Object.values(this.DB.maldiciones)); o.maldicion = { name: m.name, txt: m.txt, cura: m.cura }; }
    this.mesa.objeto = o;
    this.mesaCambio();
  },

  _cuerpoObjeto(host, o, enTesoro) {
    const rar = this.DB.rarezas[o.rareza] || {};
    host.appendChild(this._campo('Nombre', this._texto(o.nombre, v => { o.nombre = v; }, 'Nombre del objeto')));
    const box = this.h('div', 'dir-lineas');
    [['Rareza', (rar.name || o.rareza) + (o.tirada ? ` (${o.tirada})` : '')], ['Forma', o.tipo], ['Sintonía', rar.sintonia || '—'],
     ['Precio', rar.precio || '—'], ['Apropiado', rar.nivel || '—']].forEach(([k, v]) => {
      const p = this.h('div', 'dir-linea'); p.append(this.h('span', 'dir-linea-k', k), this.h('span', 'dir-linea-v', v)); box.appendChild(p);
    });
    host.appendChild(box);
    if (!o.props.length) host.appendChild(this.h('p', 'dir-nota', 'Sin propiedades: un consumible, una herramienta menor o munición encantada.'));
    o.props.forEach(p => { const b = this.h('div', 'js-grade-block grade-on'); b.append(this.h('strong', null, p.name + '. '), document.createTextNode(p.txt)); host.appendChild(b); });
    if (o.maldicion) {
      const b = this.h('div', 'js-grade-block dir-maldito');
      b.append(this.h('strong', null, `Maldición: ${o.maldicion.name}. `), document.createTextNode(`${o.maldicion.txt} Se elimina: ${o.maldicion.cura}`));
      host.appendChild(b);
    }
    this.DB.tablas.objHistoria.filas.forEach((q, i) => {
      host.appendChild(this._campo(q, this._texto(o.historia[i], v => { o.historia[i] = v; }, q, '', true)));
    });
    if (enTesoro) host.appendChild(this._campo('Notas', this._texto(o.notas, v => { o.notas = v; }, 'Notas', 'Quién lo lleva, dónde está…', true)));
  },

  _pintarObjeto() {
    const host = document.getElementById('objeto_body'); if (!host) return;
    const cfg = this.mesa.objCfg;
    host.textContent = '';
    host.appendChild(this._campo('NA de la zona', this._seg([[0, 'NA 0–3'], [1, 'NA 4–6'], [2, 'NA 7+']], cfg.zona, v => { cfg.zona = v; this.mesaCambio(); }, 'NA de la zona'), 'ajusta la tirada de rareza'));
    const rarezas = [['', 'Al azar (1d6)']].concat(Object.entries(this.DB.rarezas).map(([k, r]) => [k, r.name]));
    host.appendChild(this._campo('Rareza', this._select(rarezas, cfg.rareza, v => { cfg.rareza = v; this.guardarMesa(); }, 'Rareza')));
    const fila = this.h('div', 'set-row dir-fila-toggle');
    const txt = this.h('div', 'set-row-txt');
    txt.append(this.h('span', 'set-lbl', 'Con maldición'), this.h('span', 'set-hint', 'Funciona, y cobra por hacerlo.'));
    const tg = this.h('button', 'toggle-btn'); tg.type = 'button';
    tg.setAttribute('aria-pressed', String(!!cfg.maldito)); tg.setAttribute('aria-label', 'Generar el objeto con una maldición');
    tg.addEventListener('click', () => { cfg.maldito = !cfg.maldito; this.mesaCambio(); });
    fila.append(txt, tg);
    host.appendChild(fila);
    const acc = this.h('div', 'dir-acc dir-acc-centro');
    acc.appendChild(this._boton(this._ico('i-d20') + (this.mesa.objeto ? 'Generar otro' : 'Generar objeto'), () => this.generarObjeto(), 'btn btn-gold'));
    host.appendChild(acc);
    const o = this.mesa.objeto;
    if (!o) return;
    const res = this.h('div', 'dir-form');
    this._cuerpoObjeto(res, o, false);
    const acc2 = this.h('div', 'dir-acc dir-acc-centro');
    acc2.appendChild(this._boton(this._ico('i-check') + 'Guardar en el tesoro', () => {
      this.mesa.tesoro.unshift(o);
      this._mAbiertos.add('t' + o.id);
      this.mesa.objeto = null;
      this.mesaCambio();
      this.toast(`«${o.nombre}» guardado en el tesoro`, 'ok');
    }));
    res.appendChild(acc2);
    host.appendChild(res);
  },

  _pintarTesoro() {
    const host = document.getElementById('tesoro_body'); if (!host) return;
    const cnt = document.getElementById('tesoro_count'); if (cnt) cnt.textContent = this.mesa.tesoro.length;
    host.textContent = '';
    if (!this.mesa.tesoro.length) {
      host.innerHTML = '<div class="empty-state"><span class="es-rune">✦</span><span class="es-line">Tesoro vacío</span><div class="es-hint">Genera un objeto y guárdalo aquí</div></div>';
      return;
    }
    const lista = this.h('div', 'dir-lista');
    this.mesa.tesoro.forEach((o, i) => {
      lista.appendChild(this._dc('t' + o.id, o.nombre || 'Objeto', this.DB.rarezas[o.rareza]?.name || '', b => {
        this._cuerpoObjeto(b, o, true);
        const acc = this.h('div', 'dir-acc');
        acc.appendChild(this._quitar('Quitar ' + o.nombre, () => { this.mesa.tesoro.splice(i, 1); this.mesaCambio(); }));
        b.appendChild(acc);
      }));
    });
    host.appendChild(lista);
  },

  _pintarBotinRef() {
    const host = document.getElementById('botin_ref_body'); if (!host) return;
    host.textContent = '';
    const grupo = (titulo, entradas, linea) => {
      host.appendChild(this.h('span', 'fl dir-ref-t', titulo));
      const lista = this.h('div', 'dir-lista');
      Object.entries(entradas).forEach(([k, e]) => lista.appendChild(this._dc('r' + titulo + k, e.name, linea(e)[0], b => { b.appendChild(this.h('div', 'u-pre-wrap', linea(e)[1])); })));
      host.appendChild(lista);
    };
    grupo('Rarezas y techos de bono', this.DB.rarezas, e => [e.d6 ? '1d6: ' + e.d6 : '',
      `${e.nivel}\nSintonía: ${e.sintonia} · NA equivalente ${e.na}\nTechos — ataque ${e.atk} · Guardia/Armadura ${e.def} · CD de Axioma ${e.cd} · daño ${e.dano}\nPrecio: ${e.precio}`]);
    grupo('Propiedades (d20)', this.DB.propiedades, e => [e.d20, e.txt]);
    grupo('Maldiciones', this.DB.maldiciones, e => ['', `${e.txt}\n\nCómo se elimina: ${e.cura}`]);
    grupo('Focos', this.DB.focos, e => [e.ud, `Fuente afín: ${e.fuente} · ${e.coste}\nResonancia: ${e.txt}`]);
    grupo('Módulos de Mejora', this.DB.modulos, e => [e.coste, `${e.tipo} · instalación CD ${e.cd}\n${e.txt}`]);
    grupo('Costes que generan decisiones', this.DB.costes, e => [e.coste, e.txt]);
    host.appendChild(this.h('p', 'dir-nota', 'Sintonía: máximo 3 objetos (Legendarios y Únicos cuentan 2); solo el Artífice con El Sintonizador llega a 5. Los bonos mágicos a un mismo eje no se suman: se aplica el mayor. Los Módulos de Mejora son para armas, armaduras y equipo; los Chips de un Construido son otra cosa (Manual Básico, Cap. 3).'));
  },

  /* ══════════ ZONAS ══════════ */
  tirarRiesgo() {
    const cfg = this.mesa.riesgo;
    const filas = this.DB.tablas.riesgo.filas;
    const leer = d => filas[d - 1] || '';
    const a = this._d(6);
    let txt, caras = [a];
    if (cfg.nivel === 'extremo') {
      const b = this._d(6);
      caras = [a, b];
      txt = (a === 6 && b === 6) ? leer(6) : [a, b].filter(d => d !== 6).map(leer).join('\n') || leer(6);
    } else if (cfg.nivel === 'seguro' && a <= 2) txt = `${leer(6)} (zona segura: el ${a} cuenta como Calma)`;
    else if (cfg.nivel === 'peligroso' && a === 1) txt = leer(1) + ' Zona peligrosa: aparecen 2 amenazas, o una de NA superior.';
    else txt = leer(a);
    cfg.ult = `${caras.join(' y ')} → ${txt}`;
    this.showDiceRoll({ label: 'Dado de Riesgo', die: 6, finalFaces: caras, isCrit: false, isFail: false, detail: txt, total: caras.reduce((x, y) => x + y, 0), totalLabel: 'Daño' });
    this.mesaCambio();
  },
  tirarReaccion() {
    const cfg = this.mesa.reaccion;
    const a = this._d(10), b = this._d(10);
    const total = Math.max(2, Math.min(20, a + b + cfg.mod));
    const F = this.DB.tablas.reaccion.filas;
    const txt = total <= 5 ? F[0] : total <= 10 ? F[1] : total <= 15 ? F[2] : total <= 19 ? F[3] : F[4];
    cfg.ult = `${a} + ${b}${cfg.mod ? ' ' + this._signo(cfg.mod) : ''} = ${total} → ${txt}`;
    this.showDiceRoll({ label: 'Reacción', die: 10, finalFaces: [a, b], isCrit: false, isFail: false,
      detail: (cfg.mod ? `Modificador ${this._signo(cfg.mod)} · ` : '') + txt, total, totalLabel: 'Daño' });
    this.mesaCambio();
  },
  _pintarTiradas() {
    const host = document.getElementById('tiradas_body'); if (!host) return;
    const R = this.mesa.riesgo, X = this.mesa.reaccion;
    host.textContent = '';
    host.appendChild(this._campo('Dado de Riesgo', this._seg([['seguro', 'Seguro'], ['normal', 'Normal'], ['peligroso', 'Peligroso'], ['extremo', 'Extremo']],
      R.nivel, v => { R.nivel = v; this.mesaCambio(); }, 'Peligro del entorno'), 'al cerrar cada Ronda de Exploración o Vigilia'));
    const a1 = this.h('div', 'dir-acc dir-acc-centro');
    a1.appendChild(this._boton(this._ico('i-d20') + 'Tirar Dado de Riesgo', () => this.tirarRiesgo()));
    host.appendChild(a1);
    if (R.ult) host.appendChild(this.h('p', 'dir-resultado u-pre-wrap', R.ult));
    host.appendChild(this._campo('Reacción (2d10)', this._paso(X.mod, -6, 6, n => { X.mod = n; this.mesaCambio(); }, 'el modificador de Reacción', 'Mod. ' + this._signo(X.mod)),
      'actitud inicial de quien aparece'));
    const a2 = this.h('div', 'dir-acc dir-acc-centro');
    a2.appendChild(this._boton(this._ico('i-d20') + 'Tirar Reacción', () => this.tirarReaccion()));
    host.appendChild(a2);
    if (X.ult) host.appendChild(this.h('p', 'dir-resultado', X.ult));
    host.appendChild(this.h('p', 'dir-nota', 'Modificadores: Reputación de Facción ±1 por punto · bandera de tregua +2 · Defecto del Trasfondo −2 · regalo o información valiosa +1 a +3.'));
  },

  nuevaZona() {
    const z = { id: this._uid(), nombre: '', na: 3, et: [0, 0], faccion: '', recurso: '', amenaza: '', lugar: '', salidas: '',
      detonante: '', reloj: [{ t: '', ok: false }, { t: '', ok: false }, { t: '', ok: false }, { t: '', ok: false }] };
    this.mesa.zonas.unshift(z);
    this._mAbiertos.add('z' + z.id);
    this.mesaCambio();
  },
  _pintarZonas() {
    const host = document.getElementById('zonas_body'); if (!host) return;
    const cnt = document.getElementById('zonas_count'); if (cnt) cnt.textContent = this.mesa.zonas.length;
    host.textContent = '';
    const acc = this.h('div', 'dir-acc dir-acc-centro');
    acc.appendChild(this._boton(this._ico('i-mas') + 'Nueva zona', () => this.nuevaZona()));
    host.appendChild(acc);
    if (!this.mesa.zonas.length) {
      host.appendChild(this.h('p', 'dir-nota dir-centro', 'Una zona lista para jugar en un minuto: NA, dos Etiquetas, Facción, Recurso, Amenaza, Lugar clave, Reloj y Salidas.'));
      return;
    }
    const lista = this.h('div', 'dir-lista');
    const etiquetas = [['0', '— Sin etiqueta —']].concat(Object.entries(this.DB.etiquetas).map(([k, e]) => [k, `${k} · ${e.name}`]));
    this.mesa.zonas.forEach((z, i) => {
      lista.appendChild(this._dc('z' + z.id, z.nombre || 'Zona sin nombre', 'NA ' + z.na, b => {
        b.appendChild(this._campo('Nombre', this._texto(z.nombre, v => { z.nombre = v; }, 'Nombre de la zona', 'ej. El Puerto Hundido')));
        b.appendChild(this._campo('NA de la zona', this._paso(z.na, 0, 15, n => { z.na = n; this.mesaCambio(); }, 'el NA de la zona', 'NA ' + z.na),
          `CD ${10 + z.na} · Moral ${10 + z.na}`));
        // Etiquetas
        const dado = this._botonDado('Tirar las dos Etiquetas (2d20)', () => {
          const a = this._d(20); let c = this._d(20); if (c === a) c = (c % 20) + 1;
          z.et = [a, c]; this.mesaCambio();
        });
        const sels = this.h('div', 'dir-con-dado');
        const dos = this.h('div', 'dir-dos');
        [0, 1].forEach(n => dos.appendChild(this._select(etiquetas, String(z.et[n] || 0), v => { z.et[n] = parseInt(v, 10) || 0; this.mesaCambio(); }, 'Etiqueta ' + (n + 1))));
        sels.append(dos, dado);
        b.appendChild(this._campo('Etiquetas', sels, '2d20 o elige'));
        z.et.forEach(n => {
          const e = this.DB.etiquetas[n]; if (!e) return;
          const caja = this.h('div', 'js-grade-block grade-on dir-etq');
          caja.appendChild(this.h('strong', null, e.name + '. '));
          caja.appendChild(document.createTextNode(e.txt));
          [['Enemigo', e.enemigo], ['Aliado', e.aliado], ['Complicación', e.complicacion], ['Objeto', e.objeto], ['Lugar', e.lugar]].forEach(([k, v]) => {
            const p = this.h('div', 'dir-etq-l'); p.append(this.h('span', 'dir-linea-k', k), document.createTextNode(' ' + v)); caja.appendChild(p);
          });
          b.appendChild(caja);
        });
        [['faccion', 'Facción', 'Quién manda o quién lo intenta'], ['recurso', 'Recurso', 'Lo que el grupo puede llevarse'],
         ['amenaza', 'Amenaza', 'Lo que crece si nadie actúa'], ['lugar', 'Lugar clave', 'El sitio al que todo apunta'],
         ['salidas', 'Salidas', 'Por dónde se entra y por dónde se huye']].forEach(([k, rot, ayuda]) => {
          b.appendChild(this._campo(rot, this._texto(z[k], v => { z[k] = v; }, rot, ayuda)));
        });
        // Reloj de Amenaza
        b.appendChild(this._campo('Reloj de Amenaza', this._texto(z.detonante, v => { z.detonante = v; }, 'Detonante del Reloj', 'Avanza con… (cada Vigilia, cada fallo ruidoso)'), 'lo que ocurrirá si nadie interviene'));
        const reloj = this.h('div', 'dir-reloj');
        z.reloj.forEach((p, n) => {
          const f = this.h('div', 'dir-reloj-p');
          const chk = document.createElement('input');
          chk.type = 'checkbox'; chk.checked = !!p.ok; chk.setAttribute('aria-label', `Paso ${n + 1} cumplido`);
          chk.addEventListener('change', () => { p.ok = chk.checked; this.guardarMesa(); });
          f.append(chk, this._texto(p.t, v => { p.t = v; }, `Paso ${n + 1} del Reloj`, `Paso ${n + 1}`));
          reloj.appendChild(f);
        });
        b.appendChild(reloj);
        const acc2 = this.h('div', 'dir-acc');
        if (z.reloj.length < 6) acc2.appendChild(this._boton(this._ico('i-mas') + 'Paso', () => { z.reloj.push({ t: '', ok: false }); this.mesaCambio(); }));
        if (z.reloj.length > 3) acc2.appendChild(this._boton('− Paso', () => { z.reloj.pop(); this.mesaCambio(); }));
        acc2.appendChild(this._quitar('Eliminar la zona', () => {
          this._confirm('¿Eliminar la zona?', `«${z.nombre || 'Zona sin nombre'}» se borrará de la Mesa.`, 'Eliminar', () => { this.mesa.zonas.splice(i, 1); this.mesaCambio(); });
        }));
        b.appendChild(acc2);
      }));
    });
    host.appendChild(lista);
  },

  trampaAlAzar() {
    const T = this.DB.tablas;
    const na = this.mesa.trampaNa;
    const dano = this.DB.na[na]?.dano || '1d6';
    const efecto = this._azar(T.trampaEfecto.filas).replace('daño base', 'daño base ' + dano);
    this.mesa.trampaUlt = `Trampa de NA ${na} (CD ${10 + na})\nSe dispara al: ${this._azar(T.trampaDisp.filas).toLowerCase()}\nEfecto: ${efecto}\nSeñal: ${this._azar(T.trampaSenal.filas).toLowerCase()}`;
    this.mesaCambio();
  },
  _pintarPeligros() {
    const host = document.getElementById('peligros_body'); if (!host) return;
    host.textContent = '';
    host.appendChild(this._campo('Construir una trampa', this._paso(this.mesa.trampaNa, 0, 15, n => { this.mesa.trampaNa = n; this.mesaCambio(); }, 'el NA de la trampa', 'NA ' + this.mesa.trampaNa), 'el NA es el de la zona'));
    const acc = this.h('div', 'dir-acc dir-acc-centro');
    acc.appendChild(this._boton(this._ico('i-d20') + 'Trampa al azar', () => this.trampaAlAzar()));
    host.appendChild(acc);
    if (this.mesa.trampaUlt) host.appendChild(this.h('p', 'dir-resultado u-pre-wrap', this.mesa.trampaUlt));
    host.appendChild(this.h('p', 'dir-nota', 'Detectarla: Percepción o Investigación contra la CD. Desactivarla: Mecanismos o Tecnología. Un fallo por 5 o más la dispara. Toda amenaza tiene señal: descríbela antes de que el grupo llegue a la condición.'));
    host.appendChild(this.h('span', 'fl dir-ref-t', 'Biblioteca de peligros'));
    const lista = this.h('div', 'dir-lista');
    Object.entries(this.DB.peligros).sort((a, b) => a[1].na - b[1].na).forEach(([k, p]) => {
      lista.appendChild(this._dc('p' + k, p.name, 'NA ' + p.na, b => {
        const box = this.h('div', 'dir-lineas');
        [['Actúa', p.cond], ['Señal', p.senal], ['Consecuencia', p.cons], ['CD', String(10 + p.na)]].forEach(([a, v]) => {
          const l = this.h('div', 'dir-linea'); l.append(this.h('span', 'dir-linea-k', a), this.h('span', 'dir-linea-v', v)); box.appendChild(l);
        });
        b.appendChild(box);
      }));
    });
    host.appendChild(lista);
  },

  /* ══════════ FACCIONES ══════════ */
  _pgMax(f) { return (f.f + f.a + f.r) * 3; },
  nuevaFaccion(base) {
    const f = { id: this._uid(), nombre: base?.name || '', f: base?.f ?? 1, a: base?.a ?? 1, r: base?.r ?? 1, objetivo: '', activos: base?.activos || '', notas: '' };
    f.pg = this._pgMax(f);
    this.mesa.facciones.unshift(f);
    this._mAbiertos.add('f' + f.id);
    return f;
  },
  _pintarFacciones() {
    const host = document.getElementById('facciones_body'); if (!host) return;
    const cnt = document.getElementById('facciones_count'); if (cnt) cnt.textContent = this.mesa.facciones.length;
    host.textContent = '';
    const acc = this.h('div', 'dir-acc dir-acc-centro');
    acc.append(
      this._boton(this._ico('i-mas') + 'Nueva facción', () => { this.nuevaFaccion(); this.mesaCambio(); }),
      this._boton(this._ico('i-up') + 'De ejemplo', () => this.abrirSelector({
        titulo: 'Facciones de ejemplo', sub: 'Toca una para añadirla a la Mesa',
        items: () => Object.entries(this.DB.faccionesEj).map(([k, e]) => ({ k, nombre: e.name, etiqueta: `F${e.f} A${e.a} R${e.r}`, texto: e.activos })),
        alElegir: k => { this.nuevaFaccion(this.DB.faccionesEj[k]); this.guardarMesa(); this.toast('Facción añadida', 'ok'); return false; },
        alCerrar: () => this.pintarMesa(),
      })));
    host.appendChild(acc);
    if (!this.mesa.facciones.length) {
      host.appendChild(this.h('p', 'dir-nota dir-centro', 'Úsalas cuando la campaña pase de dos sesiones: el mundo se mueve aunque el grupo duerma.'));
      return;
    }
    const lista = this.h('div', 'dir-lista');
    this.mesa.facciones.forEach((f, i) => {
      lista.appendChild(this._dc('f' + f.id, f.nombre || 'Facción sin nombre', `PG ${f.pg}/${this._pgMax(f)}`, b => {
        b.appendChild(this._campo('Nombre', this._texto(f.nombre, v => { f.nombre = v; }, 'Nombre de la facción', 'ej. Gremio de Mercaderes')));
        const g = this.h('div', 'dir-tres');
        [['f', 'Fuerza'], ['a', 'Astucia'], ['r', 'Riqueza']].forEach(([k, n]) => {
          g.appendChild(this._campo(n, this._paso(f[k], 0, 6, v => {
            const antes = this._pgMax(f);
            f[k] = v;
            f.pg = Math.max(0, Math.min(this._pgMax(f), f.pg + (this._pgMax(f) - antes)));
            this.mesaCambio();
          }, n)));
        });
        b.appendChild(g);
        b.appendChild(this._campo('Puntos de Golpe', this._paso(f.pg, 0, this._pgMax(f), v => { f.pg = v; this.mesaCambio(); }, 'los Puntos de Golpe', `${f.pg} / ${this._pgMax(f)}`), '(F + A + R) × 3'));
        if (f.pg === 0) b.appendChild(this.h('p', 'dir-aviso', 'A 0 PG no desaparece: se rinde y negocia, se fragmenta o se vuelve desesperada y peligrosa.'));
        const obj = this.h('div', 'dir-con-dado');
        const inp = this._texto(f.objetivo, v => { f.objetivo = v; }, 'Objetivo activo', 'Lo que persigue ahora');
        obj.append(inp, this._botonDado('Tirar objetivo (d8)', () => { f.objetivo = this._azar(this.DB.tablas.objFaccion.filas); this.mesaCambio(); }));
        b.appendChild(this._campo('Objetivo activo', obj));
        b.appendChild(this._campo('Activos', this._texto(f.activos, v => { f.activos = v; }, 'Activos', 'Milicia urbana (F3), Red de informantes (A2)…', true), 'cada uno con su NA (1–8)'));
        b.appendChild(this._campo('Notas', this._texto(f.notas, v => { f.notas = v; }, 'Notas', '', true)));
        b.appendChild(this.h('p', 'dir-nota', `${f.f + f.a + f.r >= 12 ? '2 acciones' : '1 acción'} por Turno de Facción.`));
        const acc2 = this.h('div', 'dir-acc');
        acc2.appendChild(this._quitar('Eliminar la facción', () => {
          this._confirm('¿Eliminar la facción?', `«${f.nombre || 'Facción sin nombre'}» se borrará de la Mesa.`, 'Eliminar', () => { this.mesa.facciones.splice(i, 1); this.mesaCambio(); });
        }));
        b.appendChild(acc2);
      }));
    });
    host.appendChild(lista);
  },

  resolverConflicto() {
    const C = this.mesa.conflicto;
    const A = this.mesa.facciones.find(f => f.id === C.a), D = this.mesa.facciones.find(f => f.id === C.d);
    if (!A || !D || A === D) { this.toast('Elige dos facciones distintas', 'err'); return; }
    const k = C.attr;
    const N = { f: 'Fuerza', a: 'Astucia', r: 'Riqueza' }[k];
    const d1 = this._d(10), d2 = this._d(10);
    const total = d1 + d2 + A[k], cd = 10 + D[k];
    let txt;
    if (total >= cd) {
      const dano = this._d(6) + A[k];
      D.pg = Math.max(0, D.pg - dano);
      txt = `Éxito: ${D.nombre || 'la defensora'} pierde ${dano} PG (1d6 + ${N}) y queda en ${D.pg}.`;
      if (d1 === 10 && d2 === 10) txt += ' Doble 10: además captura un activo, expone información o desmoraliza.';
    } else if (cd - total >= 5) {
      const contra = this._d(4);
      A.pg = Math.max(0, A.pg - contra);
      txt = `Fallo por ${cd - total}: contraataque. ${A.nombre || 'La atacante'} pierde ${contra} PG y queda en ${A.pg}.`;
    } else txt = `Fallo por ${cd - total}: la defensa aguanta.`;
    if (d1 === 1 && d2 === 1) txt += ' Doble 1: complicación para la atacante.';
    C.ult = `${A.nombre || 'Atacante'} (${N} ${A[k]}) contra ${D.nombre || 'Defensora'} — ${d1} + ${d2} + ${A[k]} = ${total} frente a CD ${cd}. ${txt}`;
    this.showDiceRoll({ label: `Conflicto · CD ${cd}`, die: 10, finalFaces: [d1, d2], isCrit: d1 === 10 && d2 === 10, isFail: d1 === 1 && d2 === 1,
      detail: `2d10 ${this._signo(A[k])} (${N}) · ${txt}`, total, totalLabel: 'Daño' });
    this.mesaCambio();
  },
  _pintarConflicto() {
    const host = document.getElementById('conflicto_body'); if (!host) return;
    const C = this.mesa.conflicto, F = this.mesa.facciones;
    host.textContent = '';
    if (F.length < 2) { host.appendChild(this.h('p', 'dir-nota dir-centro', 'Hacen falta dos facciones para un conflicto.')); return; }
    const ops = [['', '— Elegir —']].concat(F.map(f => [f.id, f.nombre || 'Facción sin nombre']));
    const g = this.h('div', 'g2 dir-g2');
    g.append(this._campo('Atacante', this._select(ops, C.a, v => { C.a = v; this.guardarMesa(); }, 'Facción atacante')),
             this._campo('Defensora', this._select(ops, C.d, v => { C.d = v; this.guardarMesa(); }, 'Facción defensora')));
    host.appendChild(g);
    host.appendChild(this._campo('Con qué', this._seg([['f', 'Fuerza'], ['a', 'Astucia'], ['r', 'Riqueza']], C.attr, v => { C.attr = v; this.mesaCambio(); }, 'Atributo del conflicto'),
      'combate · sabotaje · compra'));
    const acc = this.h('div', 'dir-acc dir-acc-centro');
    acc.appendChild(this._boton(this._ico('i-d20') + 'Resolver', () => this.resolverConflicto(), 'btn btn-gold'));
    host.appendChild(acc);
    if (C.ult) host.appendChild(this.h('p', 'dir-resultado', C.ult));
    host.appendChild(this.h('p', 'dir-nota', '2d10 + atributo contra CD 10 + el atributo equivalente de la defensora. Éxito: 1d6 + atributo a sus PG. Fallo por 5 o más: contraataque de 1d4. Por cada Acción de Impacto Indirecto del grupo, +3 a quien ayudan.'));
  },
  _pintarTurno() {
    const host = document.getElementById('turno_body'); if (!host) return;
    host.textContent = '';
    host.appendChild(this.h('p', 'dir-nota', 'Una vez por sesión: cada Facción activa hace 1 acción (2 si suma 12 o más en atributos). Anota el resultado como una o dos líneas de noticias.'));
    const box = this.h('div', 'dir-lineas');
    Object.values(this.DB.accionesFaccion).forEach(a => {
      const l = this.h('div', 'dir-linea dir-linea-col');
      l.append(this.h('span', 'dir-linea-k', a.name + (a.attr && a.attr !== '—' ? ` (${a.attr})` : '')), this.h('span', 'dir-linea-v', a.txt));
      box.appendChild(l);
    });
    host.appendChild(box);
    host.appendChild(this._campo('Noticias del mundo', this._texto(this.mesa.noticias, v => { this.mesa.noticias = v; }, 'Noticias del mundo',
      '«El Gremio cerró el paso norte. Nadie en el mercado habla del culto desde la semana pasada.»', true), '2 o 3 titulares para abrir la sesión'));
  },
});
