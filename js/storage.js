/* ══════════════════════════════════════════
   STORAGE MODULE
   Versioned persistence with migration support

   v58.0 — Los datos grandes (personajes con retrato, reglas editadas y
   fondos de pantalla) viven en IndexedDB, no en localStorage. localStorage
   tiene un cupo de ≈5 MB por origen y, con unos cuantos retratos y un
   fondo, se llenaba («¡Almacenamiento lleno!»). IndexedDB admite cientos de
   MB y, con navigator.storage.persist(), el navegador no lo borra por su
   cuenta.

   La API sigue siendo SÍNCRONA para el resto de la app: al arrancar,
   preparar() carga todo en memoria (y migra lo que hubiera en
   localStorage); después cada lectura sale de memoria y cada escritura se
   guarda en memoria al momento y en IndexedDB en segundo plano, en cola y
   en orden. Si IndexedDB no está disponible, todo sigue como antes, en
   localStorage. Las preferencias pequeñas (tema, letra…) siguen en
   localStorage.
══════════════════════════════════════════ */
const STORAGE = {
  SCHEMA_VERSION: 2,
  /** Bump when DEFAULT_DB rules data changes so cached rules refresh automatically. */
  RULES_DATA_VERSION: 'v1-manual-sendas-axiomas',
  KEYS: {
    rules:          'sands_rules',
    rulesVer:       'sands_rules_ver',
    roster:         'sands_roster',
    font:           'ss_font_size',
    scrollPreserve: 'ss_scroll_preserve',
    portSize:       'ss_port_size',
    portShape:      'ss_port_shape',
    version:        'sands_schema_v'
  },
  /* Claves que pasan a IndexedDB (las mismas que usaba localStorage) */
  GRANDES: ['sands_roster', 'sands_rules', 'sands_rules_ver', 'ss_bg_home', 'ss_bg_app'],

  _idb: null,          // conexión abierta, o null si se usa localStorage
  _mem: {},            // copia en memoria de las claves GRANDES
  _cola: Promise.resolve(),
  /** Lo llama la app para avisar si una escritura en segundo plano falla. */
  alFallarEscritura: null,

  /* ── IndexedDB ─────────────────────────────────────────────── */
  _abrir() {
    return new Promise((res, rej) => {
      if (!('indexedDB' in window)) { rej(new Error('sin IndexedDB')); return; }
      const rq = indexedDB.open('ss-companion', 1);
      rq.onupgradeneeded = () => { rq.result.createObjectStore('kv'); };
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => rej(rq.error);
      rq.onblocked = () => rej(new Error('IndexedDB bloqueado'));
    });
  },
  _tx(modo, fn) {
    return new Promise((res, rej) => {
      const tx = this._idb.transaction('kv', modo);
      const st = tx.objectStore('kv');
      const out = fn(st);
      tx.oncomplete = () => res(out && 'result' in out ? out.result : undefined);
      tx.onerror = () => rej(tx.error);
      tx.onabort = () => rej(tx.error || new Error('transacción abortada'));
    });
  },
  _leerTodo() {
    return this._tx('readonly', st => {
      const res = {};
      this.GRANDES.forEach(k => { const r = st.get(k); r.onsuccess = () => { res[k] = r.result; }; });
      return { get result() { return res; } };
    });
  },
  /** Escribe (o borra, con v === undefined) en segundo plano, en orden. */
  _persistir(k, v) {
    if (!this._idb) return;
    this._cola = this._cola.then(() => this._tx('readwrite', st => { v === undefined ? st.delete(k) : st.put(v, k); }))
      .catch(err => { try { this.alFallarEscritura && this.alFallarEscritura(err); } catch (e) { /* sin aviso */ } });
  },

  /** Arranque: abre IndexedDB, migra lo que hubiera en localStorage y lo
      deja todo en memoria. Si algo falla, se sigue con localStorage. */
  async preparar() {
    try {
      this._idb = await this._abrir();
      const guardado = await this._leerTodo();
      const aMigrar = {};
      this.GRANDES.forEach(k => {
        let ls = null;
        try { ls = localStorage.getItem(k); } catch (e) { /* sin acceso */ }
        if (guardado[k] !== undefined) {
          this._mem[k] = guardado[k];
        } else if (ls !== null) {
          // El roster y las reglas se guardan ya parseados (menos trabajo al leer)
          let v = ls;
          if (k === this.KEYS.roster || k === this.KEYS.rules) { try { v = JSON.parse(ls); } catch (e) { v = null; } }
          if (v !== null) { this._mem[k] = v; aMigrar[k] = v; }
        }
      });
      const claves = Object.keys(aMigrar);
      if (claves.length) {
        await this._tx('readwrite', st => { claves.forEach(k => st.put(aMigrar[k], k)); });
      }
      // Si el arranque ya siguió sin esperar (boot.js, límite de tiempo), la
      // app está usando localStorage: no se mezcla ni se borra nada.
      if (this._rendido) { try { this._idb.close(); } catch (e) { /* nada */ } this._idb = null; this._mem = {}; return false; }
      // Ya a salvo en IndexedDB: se libera localStorage
      this.GRANDES.forEach(k => { try { localStorage.removeItem(k); } catch (e) { /* nada */ } });
      try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { /* opcional */ }
    } catch (err) {
      this._idb = null;   // fallback: localStorage, como antes de v58
    }
    return !!this._idb;
  },

  /* ── Acceso genérico a las claves grandes ──────────────────── */
  _get(k) {
    if (this._idb) return this._mem[k];
    try { return localStorage.getItem(k); } catch (e) { return null; }
  },
  _set(k, v) {
    if (this._idb) { this._mem[k] = v; this._persistir(k, v); return true; }
    try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); return true; }
    catch (e) { return false; }
  },
  _del(k) {
    if (this._idb) { delete this._mem[k]; this._persistir(k, undefined); return; }
    try { localStorage.removeItem(k); } catch (e) { /* nada */ }
  },
  _obj(k) {             // roster y reglas: objeto (clonado, que nadie toque la copia en memoria)
    const v = this._get(k);
    if (v == null) return null;
    if (typeof v === 'string') { try { return JSON.parse(v); } catch (e) { return null; } }
    return structuredClone(v);
  },

  /** Load rules DB – falls back to DEFAULT_DB. Auto-refreshes when the
      bundled rules data is newer than what's cached, so updated formulas
      reach returning users without touching their saved characters. */
  loadRules() {
    try {
      const storedVer = this._get(this.KEYS.rulesVer);
      if (storedVer !== this.RULES_DATA_VERSION) {
        // Stale or absent cache → adopt the bundled rules and stamp the version.
        this._del(this.KEYS.rules);
        this._set(this.KEYS.rulesVer, this.RULES_DATA_VERSION);
        return structuredClone(DEFAULT_DB);
      }
      const parsed = this._obj(this.KEYS.rules);
      return (parsed && typeof parsed === 'object') ? parsed : structuredClone(DEFAULT_DB);
    } catch (err) {
      return structuredClone(DEFAULT_DB);
    }
  },

  /** Save rules DB – handles storage quota */
  saveRules(db) {
    const ok = this._set(this.KEYS.rules, this._idb ? structuredClone(db) : JSON.stringify(db));
    if (ok) this._set(this.KEYS.rulesVer, this.RULES_DATA_VERSION);
    return ok;
  },

  /** Load entire roster */
  loadRoster() {
    try {
      const parsed = this._obj(this.KEYS.roster);
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
    } catch (err) {
      return {};
    }
  },

  /** Save entire roster – returns false on quota error */
  saveRoster(roster) {
    return this._set(this.KEYS.roster, this._idb ? structuredClone(roster) : JSON.stringify(roster));
  },

  /** Delete a single character */
  deleteChar(name) {
    const roster = this.loadRoster();
    delete roster[String(name)];
    return this.saveRoster(roster);
  },

  /* ── Fondos de pantalla (data-URL) ─────────────────────────── */
  getBg(target) { return this._get(target === 'home' ? 'ss_bg_home' : 'ss_bg_app') || ''; },
  setBg(target, src) {
    const k = target === 'home' ? 'ss_bg_home' : 'ss_bg_app';
    if (!src) { this._del(k); return true; }
    this._del(k);                 // suelta primero la anterior (en localStorage, su hueco hace falta)
    return this._set(k, src);
  },

  /** Espacio usado y disponible (bytes), si el navegador lo dice. */
  async espacio() {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const e = await navigator.storage.estimate();
        const persistente = navigator.storage.persisted ? await navigator.storage.persisted() : false;
        return { usado: e.usage || 0, cupo: e.quota || 0, persistente, idb: !!this._idb };
      }
    } catch (e) { /* sin datos */ }
    return null;
  },
};
