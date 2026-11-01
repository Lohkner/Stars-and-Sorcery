/* ══════════════════════════════════════════════════════════════
   EDITOR DE REGLAS
   El mismo panel de S&S Companion (lista con buscador, formulario que
   sube desde abajo), pero el formulario se genera solo a partir de la
   entrada: texto, número, sí/no, lista (una línea por elemento) o, para
   lo que tiene estructura, JSON. Así cualquier tabla de la base —la
   Biblioteca, los Roles, las Etiquetas de Zona— se edita sin código
   propio por categoría.
══════════════════════════════════════════════════════════════ */
Object.assign(app, {
  currentEditorCat: '',

  /* [clave en DB, rótulo]. `rasgos` es la única agrupada (familia → lista). */
  DB_CATS: [
    ['Amenazas', [['na', 'Valores por NA'], ['roles', 'Roles'], ['tamanos', 'Tamaños'], ['hordas', 'Hordas'], ['tipos', 'Tipos de criatura'],
                  ['rasgos', 'Biblioteca'], ['familias', 'Familias'], ['plantillas', 'Plantillas'], ['estados', 'Estados']]],
    ['Mesa', [['encuentros', 'NA del encuentro'], ['riqueza', 'Riqueza por nivel'], ['rarezas', 'Rarezas'], ['propiedades', 'Propiedades'],
              ['maldiciones', 'Maldiciones'], ['focos', 'Focos'], ['modulos', 'Módulos'], ['costes', 'Costes'],
              ['etiquetas', 'Etiquetas de Zona'], ['peligros', 'Peligros'], ['faccionesEj', 'Facciones'], ['accionesFaccion', 'Acciones de Facción']]],
    ['Azar', [['tablas', 'Tablas']]],
  ],
  DB_ROTULOS: {
    name: 'Nombre', txt: 'Texto', id: 'Identificador', tipo: 'Tipo', peso: 'Potencial', coste: 'Coste', frec: 'Frecuencia', pide: 'Dato que pide',
    multi: 'Se puede tomar varias veces', mod: 'Modificadores a la ficha', pv: 'PV', g: 'Guardia', a: 'Armadura', atk: 'Ataque', dano: 'Daño',
    pa: 'PA', sf: 'Salvación fuerte', sd: 'Salvación débil', cd: 'CD', etiqueta: 'Etiqueta', hab: 'Habilidad',
    habTipo: 'Tipo de la habilidad', habCoste: 'Coste de la habilidad', habTxt: 'Texto de la habilidad', pb: 'Competencia (PB)', ajuste: 'Ajuste del daño', narrativa: 'De especie de narrativa (gratis)', area: 'Daño en área (sube el NA de encuentro)', fuerteExtra: 'Atributo Fuerte por su tipo', alientoGratis: 'Su Aliento es gratis', fuerte: 'Atributo Fuerte', normal: 'Atributo Normal', debil: 'Atributo Débil', vel: 'Velocidad',
    ini: 'Iniciativa', esbirro: 'Es esbirro', ej: 'Ejemplos', fue: 'FUE (número, o D = Débil)', des: 'DES (número, o D = Débil)', con: 'CON (número, o D = Débil)', atrTxt: 'Atributos (texto)', naEnc: 'NA que suma al encuentro', alcance: 'Alcance', espacio: 'Espacio', fuertes: 'Atributos Fuertes', debiles: 'Atributos Débiles', danoDados: 'Dados de daño extra', atrDeb: 'Atributos Débiles (texto)',
    deb: 'Debilidad coherente', gratis: 'Rasgos gratuitos', elige: 'Rasgos a elegir', exige: 'Rasgos obligatorios', fuertesDef: 'Fuertes del tipo', fuertesTxt: 'Fuertes (texto del Manual)', clave: 'Atributo clave', claveAlt: 'Clave alternativa', afin: 'Fuerte que conserva si la clave sustituye a otro', marea: 'Registro Planetario',
    noMoral: 'No tira Moral', tamMin: 'Tamaño mínimo', gratisFam: 'Rasgo gratuito de una familia', equipo: 'Lleva equipo', naTxt: 'NA (texto)',
    na: 'NA', gana: 'Rasgos que gana', notas: 'Notas de los Rasgos', pierdeFam: 'Familias que pierde', pierdeMayor: 'Pierde su Rasgo mayor',
    tam: 'Cambio de tamaño', rol: 'Rol', horda: 'Pasa a horda', cond: 'Condición', senal: 'Señal', cons: 'Consecuencia', filas: 'Filas',
    f: 'Fácil / Fuerza', e: 'Estándar', p: 'Peligroso', m: 'Mortal', estandar: 'NA estándar', serio: 'NA serio', mortal: 'NA mortal',
    acum: 'Riqueza acumulada', sesion: 'Botín por sesión', sesMin: 'Botín mínimo', sesMax: 'Botín máximo', objetos: 'Objetos apropiados',
    d6: 'Resultado en 1d6', sintonia: 'Sintonía', nivel: 'Nivel apropiado', props: 'Propiedades', def: 'Guardia / Armadura', precio: 'Precio',
    d20: 'Resultado en d20', min: 'Desde', max: 'Hasta', bono: 'Bono ligado a la rareza', cura: 'Cómo se elimina', ud: 'Dado de Uso',
    fuente: 'Fuente afín', enemigo: 'Enemigo', aliado: 'Aliado', complicacion: 'Complicación', objeto: 'Objeto', lugar: 'Lugar',
    r: 'Riqueza', activos: 'Activos', attr: 'Atributo', dado: 'Dado de la familia',
  },

  openDatabaseEditor() {
    this._tapShield();
    const sm = document.getElementById('settings_modal');
    if (sm.open) sm.close();
    const panel = document.getElementById('db_panel');
    panel.classList.add('fs-open');
    document.body.style.overflow = 'hidden';
    this._dbPintarBarra();
    this.dbEditCategory(this.currentEditorCat || 'rasgos');
    this._attachPanelSwipeBack(panel, () => this.closeDatabaseEditor());
  },
  closeDatabaseEditor() {
    this._tapShield();
    const panel = document.getElementById('db_panel');
    panel.style.transform = ''; panel.style.opacity = '';
    panel.classList.remove('fs-open');
    document.body.style.overflow = '';
    this._dbAlCambiar();
  },
  /** Tras tocar las reglas: fuera cachés y repintar lo que esté abierto. */
  _dbAlCambiar() {
    this._libCache = null;
    const s = document.getElementById('app-screen');
    if (s.classList.contains('hidden')) return;
    if (this.modo === 'ficha') this.pintarFicha(true); else this.pintarMesa();
  },

  _dbPintarBarra() {
    const side = document.getElementById('db_sidebar');
    side.textContent = '';
    this.DB_CATS.forEach(([grupo, cats]) => {
      side.appendChild(this.h('div', 'dbs-section-label', grupo));
      cats.forEach(([k, n]) => {
        const b = this.h('button', 'catbtn db-cat');
        b.type = 'button';
        b.dataset.cat = k;
        b.setAttribute('aria-label', 'Editar ' + n);
        b.append(this.h('span', 'catbtn-dot'), document.createTextNode(n));
        b.addEventListener('click', () => this.dbEditCategory(k));
        side.appendChild(b);
      });
    });
    const esp = this.h('div'); esp.style.flex = '1';
    side.appendChild(esp);
    const fab = this.h('button', 'catbtn db-cat dir-fabrica');
    fab.type = 'button';
    fab.append(this.h('span', 'catbtn-dot'), document.createTextNode('De fábrica'));
    fab.setAttribute('aria-label', 'Restaurar las reglas de fábrica');
    fab.addEventListener('click', () => this.dbRestaurarFabrica());
    side.appendChild(fab);
  },
  _dbRotuloCat(cat) {
    for (const [, cats] of this.DB_CATS) { const c = cats.find(x => x[0] === cat); if (c) return c[1]; }
    return cat;
  },

  dbRestaurarFabrica() {
    this._confirm('¿Restaurar las reglas de fábrica?', 'Se pierden todos los cambios hechos en el Editor de Reglas. Tus amenazas y tu Mesa no se tocan.', 'Restaurar', () => {
      this.DB = structuredClone(DEFAULT_DB);
      this.saveRulesToLocal();
      this.dbEditCategory(this.currentEditorCat || 'rasgos');
      this.toast('Reglas de fábrica restauradas', 'ok');
    }, document.getElementById('db_panel'));
  },

  dbEditCategory(cat) {
    this.currentEditorCat = cat;
    const lc = document.getElementById('db_list_container');
    const fc = document.getElementById('db_form_container');
    fc.style.display = 'none';
    fc.classList.remove('animate');
    const src = this.DB[cat] || {};
    const agrupada = cat === 'rasgos';
    const catLabel = this._dbRotuloCat(cat);
    const count = agrupada ? Object.values(src).reduce((a, l) => a + (l || []).length, 0) : Object.keys(src).length;
    document.querySelectorAll('#db_sidebar .catbtn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
    requestAnimationFrame(() => document.querySelector('#db_sidebar .catbtn.active')?.scrollIntoView({ block: 'nearest', inline: 'center' }));

    lc.textContent = '';
    const hdr = this.h('div', 'db-list-header');
    const ht = this.h('div'); ht.style.cssText = 'display:flex;align-items:center;gap:8px;min-width:0';
    ht.append(this.h('span', 'db-list-title', catLabel), this.h('span', 'db-list-count', count + ' entrada' + (count !== 1 ? 's' : '')));
    const nuevo = this.h('button', 'btn btn-p', '+ Nuevo');
    nuevo.style.cssText = 'font-size:var(--fs-sm);padding:6px 11px;min-height:34px';
    nuevo.addEventListener('click', () => this.dbEditEntry('new'));
    hdr.append(ht, nuevo);
    lc.appendChild(hdr);
    if (count) {
      const wrap = this.h('div', 'db-search-wrap');
      const search = document.createElement('input');
      search.type = 'search'; search.className = 'db-search'; search.id = 'db_search';
      search.placeholder = `Buscar en ${catLabel}…`;
      search.setAttribute('aria-label', `Buscar en ${catLabel}`);
      search.addEventListener('input', () => this._dbFilterList(search.value));
      wrap.appendChild(search);
      lc.appendChild(wrap);
    } else {
      const empty = this.h('div', 'db-empty');
      empty.appendChild(this.h('p', null, `Sin entradas en ${catLabel}. Crea la primera con «+ Nuevo».`));
      lc.appendChild(empty);
      return;
    }
    if (agrupada) {
      Object.keys(src).forEach(fam => {
        const h = this.h('div', 'db-group-hdr dir-db-grupo');
        h.append(this.h('span', null, this.DB.familias[fam]?.name || fam), this.h('span', 'dir-db-grupo-n', (src[fam] || []).length + ' piezas'));
        lc.appendChild(h);
        (src[fam] || []).forEach((e, i) => this._dbListItem(lc, e.name, `${fam}|${i}`));
      });
    } else {
      Object.entries(src).forEach(([k, v]) => this._dbListItem(lc, (v && (v.name || v.nombre)) || k, k));
    }
    const noRes = this.h('div', 'db-search-empty', 'Sin resultados para esa búsqueda.');
    noRes.id = 'db_search_empty';
    lc.appendChild(noRes);
  },

  /** Entrada vacía con la misma forma que las demás de su categoría. */
  _dbPlantilla(cat) {
    const src = this.DB[cat] || {};
    const modelo = cat === 'rasgos' ? Object.values(src).flat()[0] : Object.values(src)[0];
    const vaciar = v => typeof v === 'string' ? '' : typeof v === 'number' ? 0 : typeof v === 'boolean' ? false : Array.isArray(v) ? [] : (v && typeof v === 'object') ? {} : v;
    const o = {};
    Object.entries(modelo || { name: '' }).forEach(([k, v]) => { o[k] = vaciar(v); });
    return o;
  },

  dbEditEntry(key) {
    const cat = this.currentEditorCat;
    const fc = document.getElementById('db_form_container');
    const agrupada = cat === 'rasgos';
    let existente = null, fam = '', idx = -1;
    if (key !== 'new') {
      if (agrupada) { [fam, idx] = key.split('|'); idx = parseInt(idx, 10); existente = this.DB.rasgos[fam]?.[idx]; }
      else existente = this.DB[cat]?.[key];
    }
    const e = existente ? structuredClone(existente) : this._dbPlantilla(cat);
    fc.textContent = '';
    const t = this.h('h3', 'dir-form-t', (key === 'new' ? 'Nueva' : 'Editar') + ' entrada');
    fc.appendChild(t);

    const campos = [];
    if (agrupada) {
      const sel = this._select(Object.keys(this.DB.rasgos).map(f => [f, this.DB.familias[f]?.name || f]), fam || Object.keys(this.DB.rasgos)[0], () => {}, 'Familia');
      sel.id = 'db_fam';
      fc.appendChild(this._campo('Familia', sel));
    } else {
      const k = document.createElement('input');
      k.type = 'text'; k.id = 'db_key'; k.value = key === 'new' ? '' : key; k.autocomplete = 'off'; k.spellcheck = false;
      k.placeholder = 'ej. elfo_oscuro';
      fc.appendChild(this._campo('Clave', k, 'identificador interno, sin espacios ni acentos'));
    }
    Object.entries(e).forEach(([k, v]) => {
      const rot = this.DB_ROTULOS[k] || k;
      let ctl, tipo;
      if (typeof v === 'number') { ctl = document.createElement('input'); ctl.type = 'number'; ctl.step = 'any'; ctl.value = v; tipo = 'n'; }
      else if (typeof v === 'boolean') { ctl = this._select([['1', 'Sí'], ['0', 'No']], v ? '1' : '0', () => {}, rot); tipo = 'b'; }
      else if (typeof v === 'string') {
        if (v.length > 60 || ['txt', 'habTxt', 'cons', 'cura'].includes(k)) { ctl = document.createElement('textarea'); ctl.style.minHeight = '64px'; }
        else { ctl = document.createElement('input'); ctl.type = 'text'; ctl.autocomplete = 'off'; }
        ctl.value = v; tipo = 't';
      } else if (Array.isArray(v) && v.every(x => typeof x === 'string')) {
        ctl = document.createElement('textarea'); ctl.style.minHeight = k === 'filas' ? '220px' : '64px';
        ctl.value = v.join('\n'); tipo = 'l';
      } else {
        ctl = document.createElement('textarea'); ctl.style.minHeight = '64px'; ctl.spellcheck = false;
        ctl.classList.add('dir-json');
        ctl.value = JSON.stringify(v, null, 1); tipo = 'j';
      }
      ctl.setAttribute('aria-label', rot);
      campos.push({ k, ctl, tipo });
      fc.appendChild(this._campo(rot, ctl, tipo === 'l' ? 'una por línea' : tipo === 'j' ? 'avanzado (JSON)' : ''));
    });

    const fila = this.h('div', 'edit-acc');
    const can = this.h('button', 'edit-cancel'); can.type = 'button';
    can.innerHTML = this._ico('i-x') + 'Cancelar';
    can.addEventListener('click', () => { fc.style.display = 'none'; });
    const ok = this.h('button', 'bcnf'); ok.type = 'button'; ok.id = 'db_save_btn';
    ok.innerHTML = this._ico('i-check') + 'Guardar';
    ok.addEventListener('click', () => this.dbSaveEntry(key, campos));
    fila.append(can, ok);
    fc.appendChild(fila);

    fc.style.display = 'block';
    fc.classList.remove('animate'); void fc.offsetWidth; fc.classList.add('animate');
    requestAnimationFrame(() => fc.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  },

  dbSaveEntry(oldKey, campos) {
    const cat = this.currentEditorCat;
    const entry = {};
    for (const { k, ctl, tipo } of campos) {
      const raw = ctl.value;
      if (tipo === 'n') { const n = parseFloat(raw); entry[k] = Number.isFinite(n) ? n : 0; }
      else if (tipo === 'b') entry[k] = raw === '1';
      else if (tipo === 't') entry[k] = this._sanitize(raw.trim());
      else if (tipo === 'l') entry[k] = raw.split('\n').map(x => this._sanitize(x.trim())).filter(Boolean);
      else {
        try { entry[k] = JSON.parse(raw || 'null'); }
        catch (e) { this.toast(`«${this.DB_ROTULOS[k] || k}» no es JSON válido`, 'err'); ctl.focus(); return; }
      }
    }
    if (cat === 'rasgos') {
      if (!entry.name) { this.toast('Ponle un nombre', 'err'); return; }
      if (!entry.id) entry.id = this._slug(entry.name);
      const fam = document.getElementById('db_fam').value;
      if (oldKey !== 'new') {
        const [f0, i0] = oldKey.split('|');
        this.DB.rasgos[f0].splice(parseInt(i0, 10), 1);
      }
      const repetido = Object.values(this.DB.rasgos).flat().some(x => x.id === entry.id);
      if (repetido) entry.id = entry.id + '_' + Date.now().toString(36).slice(-4);
      (this.DB.rasgos[fam] = this.DB.rasgos[fam] || []).push(entry);
    } else {
      const key = (document.getElementById('db_key').value || entry.name || '').toLowerCase().trim()
        .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
      if (!key) { this.toast('Hace falta una clave', 'err'); return; }
      if (key !== oldKey && this.DB[cat]?.[key]) { this.toast('Ya existe una entrada con esa clave', 'err'); return; }
      if (!this.DB[cat]) this.DB[cat] = {};
      if (oldKey !== 'new' && oldKey !== key) {
        // Renombrar conservando el orden
        const nuevo = {};
        Object.keys(this.DB[cat]).forEach(k => { nuevo[k === oldKey ? key : k] = k === oldKey ? entry : this.DB[cat][k]; });
        this.DB[cat] = nuevo;
      } else this.DB[cat][key] = entry;
    }
    this.saveRulesToLocal();
    this._libCache = null;
    document.getElementById('db_form_container').style.display = 'none';
    this.dbEditCategory(cat);
    this.toast('Entrada guardada', 'ok');
  },

  dbDeleteEntry(key) {
    const cat = this.currentEditorCat;
    const nombre = cat === 'rasgos' ? this.DB.rasgos[key.split('|')[0]]?.[parseInt(key.split('|')[1], 10)]?.name : (this.DB[cat]?.[key]?.name || key);
    this._confirm(`¿Eliminar «${nombre}»?`, 'Se quitará de la base de reglas. Las amenazas que lo usen conservan su nombre.', 'Eliminar', () => {
      if (cat === 'rasgos') { const [f, i] = key.split('|'); this.DB.rasgos[f]?.splice(parseInt(i, 10), 1); }
      else if (this.DB[cat]) delete this.DB[cat][key];
      this.saveRulesToLocal();
      this._libCache = null;
      this.dbEditCategory(cat);
      this.toast('Eliminado', 'ok');
    }, document.getElementById('db_panel'));
  },
});
