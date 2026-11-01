/* ══════════════════════════════════════════════════════════════
   BIBLIOTECA DE RASGOS Y APTITUDES — Manual de Monstruos, Cap. 3
   Panel a pantalla completa, calcado del Gestor de Talentos de S&S
   Companion: familias a un lado, piezas al otro, buscador y filtros.

   El Potencial (`peso` en el código) no bloquea: el Manual permite excederlo (cada 2 puntos cuentan
   como +1 NA al calibrar). La pieza que no cabe se marca y avisa, pero se
   puede tomar.
══════════════════════════════════════════════════════════════ */
Object.assign(app, {
  _libCat: null,
  _libFiltros: { caben: false, mias: false },
  _libFormAbierto: false,

  abrirBiblioteca() {
    this._tapShield();
    const p = document.getElementById('lib_panel');
    p.classList.add('fs-open');
    document.body.style.overflow = 'hidden';
    const fams = Object.keys(this.DB.rasgos);
    if (!this._libCat || !this.DB.rasgos[this._libCat]) this._libCat = fams[0];
    document.getElementById('lib_search').value = '';
    this._libFormAbierto = false;
    ['caben', 'mias'].forEach(k => {
      const b = document.getElementById('lib_f_' + k);
      if (b) { b.classList.toggle('active', this._libFiltros[k]); b.setAttribute('aria-pressed', String(this._libFiltros[k])); }
    });
    this._libPintarCats();
    this._libPintar();
    this._attachPanelSwipeBack(p, () => this.cerrarBiblioteca());
    requestAnimationFrame(() => document.querySelector('#lib_cats .catbtn.active')?.scrollIntoView({ block: 'nearest', inline: 'center' }));
  },

  cerrarBiblioteca() {
    this._tapShield();
    const p = document.getElementById('lib_panel');
    if (!p.classList.contains('fs-open')) return;
    p.style.transform = ''; p.style.opacity = '';
    p.classList.remove('fs-open');
    document.body.style.overflow = '';
    this.pintarFicha();
    // El asistente abre esta misma Biblioteca: al volver, repinta su paso.
    if (typeof this._alCerrarBiblioteca === 'function') this._alCerrarBiblioteca();
  },

  _libPintarCats() {
    const cc = document.getElementById('lib_cats');
    cc.textContent = '';
    const idx = this._libIdx();
    const conPieza = new Set(this.cr.rasgos.map(r => idx[r.id]?.fam).filter(Boolean));
    Object.keys(this.DB.rasgos).forEach(k => {
      const btn = this.h('button', 'catbtn' + (k === this._libCat ? ' active' : ''), this.DB.familias[k]?.name || k);
      btn.type = 'button';
      btn.dataset.cat = k;
      if (conPieza.has(k)) btn.appendChild(this.h('span', 'cat-dot'));
      btn.addEventListener('click', () => {
        document.getElementById('lib_search').value = '';
        this._libCat = k;
        this._libFormAbierto = false;
        this._libPintarCats();
        this._libPintar();
        document.getElementById('lib_list').scrollTop = 0;
      });
      cc.appendChild(btn);
    });
  },

  _libChip(cual, btn) {
    this._libFiltros[cual] = !this._libFiltros[cual];
    if (btn) { btn.classList.toggle('active', this._libFiltros[cual]); btn.setAttribute('aria-pressed', String(this._libFiltros[cual])); }
    this._libPintar();
  },
  _libFiltro() {
    if (!this._libDeb) this._libDeb = this._debounce(() => this._libPintar(), 90);
    this._libDeb();
  },

  _libPie(S) {
    S = S || this.calcCr(this.cr);
    const a = document.getElementById('lib_peso'), b = document.getElementById('lib_peso_max');
    if (a) {
      a.textContent = S.pesoGastado;
      a.classList.toggle('full', S.pesoGastado >= S.pesoMax);
      a.classList.toggle('dir-exceso', S.exceso > 0);
    }
    if (b) b.textContent = '/' + S.pesoMax;
    const sub = document.getElementById('lib_sub');
    if (sub) sub.textContent = S.exceso
      ? `Excede en ${S.exceso}` + (S.exceso >= 2 ? ` · cuenta como NA ${S.naEnc}` : '')
      : `NA ${S.na} · Potencial ${S.pesoBase}${S.devuelto ? ' + ' + S.devuelto : ''}`;
  },

  _libPintar() {
    const list = document.getElementById('lib_list'); if (!list) return;
    const cr = this.cr;
    const S = this.calcCr(cr);
    this._libPie(S);
    const y = list.scrollTop;
    list.textContent = '';
    if (this._libFormAbierto) { list.appendChild(this._libFormulario()); return; }

    const q = this._norm(document.getElementById('lib_search').value).split(/\s+/).filter(Boolean);
    let filas = [];
    Object.entries(this.DB.rasgos).forEach(([fam, lista]) => {
      if (!q.length && fam !== this._libCat) return;
      (lista || []).forEach(e => filas.push([fam, e]));
    });
    if (q.length) {
      const qn = q.join(' ');
      const puntos = e => {
        const n = this._norm(e.name), t = this._norm(e.txt);
        if (!q.every(w => n.includes(w) || t.includes(w))) return 0;
        return (n === qn ? 1000 : n.startsWith(qn) ? 500 : n.includes(qn) ? 220 : 0) + q.reduce((a, w) => a + (n.includes(w) ? 40 : 8), 0);
      };
      filas = filas.map(f => [f, puntos(f[1])]).filter(([, p]) => p > 0).sort((a, b) => b[1] - a[1]).map(([f]) => f);
    } else {
      const fam = this.DB.familias[this._libCat];
      if (fam?.txt) list.appendChild(this.h('p', 'wiz-hint dir-fam-txt', fam.txt));
    }
    const cuenta = id => cr.rasgos.filter(r => r.id === id).length;
    const libre = S.pesoMax - S.pesoGastado;
    if (this._libFiltros.mias) filas = filas.filter(([, e]) => cuenta(e.id));
    if (this._libFiltros.caben) filas = filas.filter(([, e]) => cuenta(e.id) || e.peso <= Math.max(0, libre));

    if (!filas.length) {
      list.appendChild(this.h('p', 'tm-empty', q.length ? 'Ninguna pieza coincide con la búsqueda.' : 'Ninguna pieza de esta familia pasa los filtros.'));
      return;
    }
    filas.forEach(([fam, e]) => {
      const n = cuenta(e.id);
      const soloTipo = n > 0 && cr.rasgos.filter(r => r.id === e.id).every(r => r.gratis);
      const noCabe = !n && e.peso > 0 && e.peso > libre;
      const card = this.h('div', 'tc' + (n ? ' sel' : '') + (noCabe ? ' tc-locked' : ''));
      const chk = document.createElement('input');
      chk.type = 'checkbox'; chk.checked = n > 0;
      chk.setAttribute('aria-label', e.name);
      const info = this.h('div');
      info.appendChild(this.h('h4', null, e.name + (n > 1 ? ` ×${n}` : '')));
      if (q.length) { const tag = this.h('span', 'js-grade-block', this.DB.familias[fam]?.name || fam); tag.style.color = 'var(--gold)'; info.appendChild(tag); }
      const [sim, clave] = this._tipoPieza(e.tipo);
      const tp = this.h('span', 'tc-tipo', [sim + ' ' + e.tipo, e.coste, e.frec, e.peso < 0 ? 'devuelve 1 de Potencial' : 'Potencial ' + e.peso].filter(Boolean).join(' · '));
      tp.dataset.tipo = clave;
      info.appendChild(tp);
      info.appendChild(this.h('p', null, e.txt));
      const cifras = this._concretar(e.txt, S);
      if (cifras.length) info.appendChild(this.h('span', 'js-grade-block grade-on', cifras.join(' · ')));
      if (soloTipo) info.appendChild(this.h('span', 'tc-req tc-req-ok', '✓ Ya lo tiene por su tipo, sin gastar Potencial'));
      else if (noCabe) info.appendChild(this.h('span', 'tc-req', `No cabe: excede tu Potencial en ${e.peso - Math.max(0, libre)}`));
      if (e.multi && n > 0) {
        const mas = this.h('button', 'btn btn-g dir-otra'); mas.type = 'button';
        mas.innerHTML = this._ico('i-mas') + 'Añadir otra';
        mas.addEventListener('click', ev => { ev.stopPropagation(); cr.rasgos.push({ uid: this._uid(), id: e.id }); this._libCambio(); });
        info.appendChild(mas);
      }
      const alternar = () => {
        if (n > 0) {
          // Se quita la última pagada; un Rasgo de tipo no se quita desde aquí.
          const propias = cr.rasgos.filter(r => r.id === e.id && !r.gratis);
          if (!propias.length) { this.toast('Es un Rasgo de su tipo: cambia el tipo para quitarlo', 'info'); this._libPintar(); return; }
          cr.rasgos = cr.rasgos.filter(r => r !== propias[propias.length - 1]);
        } else cr.rasgos.push({ uid: this._uid(), id: e.id });
        this._libCambio();
      };
      chk.addEventListener('change', alternar);
      card.addEventListener('click', ev => { if (ev.target === chk || ev.target.closest('button')) return; alternar(); });
      card.append(chk, info);
      list.appendChild(card);
    });
    list.scrollTop = y;
  },

  _libCambio() {
    this._markUnsaved();
    this._libPintarCats();
    this._libPintar();
  },

  /* ── Rasgo propio (o un Talento del Compendio: 1 de Potencial por Grado) ── */
  rasgoPropio() {
    this._libFormAbierto = !this._libFormAbierto;
    this._libPintar();
    if (this._libFormAbierto) document.getElementById('lib_list').scrollTop = 0;
  },
  _libFormulario() {
    const f = this.h('div', 'dir-form');
    f.appendChild(this.h('h3', 'dir-form-t', 'Rasgo propio'));
    f.appendChild(this.h('p', 'wiz-hint', 'Para lo que no esté en la Biblioteca. Un Talento del Compendio de Sendas cuesta 1 de Potencial por Grado.'));
    const nombre = document.createElement('input'); nombre.type = 'text'; nombre.placeholder = 'ej. Canto de Sirena'; nombre.autocomplete = 'off';
    const tipo = this._select(['Rasgo', 'Aptitud', 'Reacción', 'Modificador', 'Aura', 'Debilidad'].map(x => [x, x]), 'Rasgo', () => {}, 'Tipo de pieza');
    const peso = this._select([['0', '0 · sabor'], ['1', '1 · ventaja acotada'], ['2', '2 · cambia cómo enfrentarla'], ['3', '3 · define a la criatura'], ['-1', '−1 · Debilidad']], '1', () => {}, 'Peso');
    const coste = this._select([['', '—'], ['0 PA', '0 PA'], ['1 PA', '1 PA'], ['2 PA', '2 PA'], ['3 PA', '3 PA']], '', () => {}, 'Coste en PA');
    const frec = this._select([['', '—'], ['a voluntad', 'A voluntad'], ['1/ronda', '1/ronda'], ['Ud6', 'Ud6'], ['Ud4', 'Ud4'], ['1/combate', '1/combate']], '', () => {}, 'Frecuencia');
    const txt = document.createElement('textarea'); txt.placeholder = 'Qué hace, escrito en función del NA cuando puedas.'; txt.style.minHeight = '76px';
    const g = this.h('div', 'g2 dir-g2');
    g.append(this._campo('Tipo', tipo), this._campo('Potencial', peso), this._campo('Coste', coste), this._campo('Frecuencia', frec));
    f.append(this._campo('Nombre', nombre), g, this._campo('Efecto', txt));
    const fila = this.h('div', 'edit-acc');
    const can = this.h('button', 'edit-cancel'); can.type = 'button';
    can.innerHTML = this._ico('i-x') + 'Cancelar';
    can.addEventListener('click', () => this.rasgoPropio());
    const ok = this.h('button', 'bcnf'); ok.type = 'button';
    ok.innerHTML = this._ico('i-check') + 'Añadir';
    ok.addEventListener('click', () => {
      if (!nombre.value.trim()) { nombre.focus(); this.toast('Ponle un nombre', 'err'); return; }
      const r = this._normalizarRasgo({ custom: true, name: nombre.value.trim(), tipo: tipo.value, peso: peso.value,
        coste: coste.value, frec: frec.value, txt: txt.value.trim() });
      if (r.tipo === 'Debilidad') r.peso = -1;
      this.cr.rasgos.push(r);
      this._libFormAbierto = false;
      this._libCambio();
      this.toast(`«${r.name}» añadido`, 'ok');
    });
    fila.append(can, ok);
    f.appendChild(fila);
    return f;
  },
});
