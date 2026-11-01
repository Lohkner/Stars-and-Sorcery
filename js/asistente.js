/* ══════════════════════════════════════════════════════════════
   ASISTENTE DE CREACIÓN DE AMENAZAS
   Los diez pasos del Manual de Monstruos, Cap. 4, uno por pantalla:
   Idea · NA · Tipo y tamaño · Rol · Atributos · Estadísticas · Rasgos de
   especie · Potencial · Si es un jefe · Encuentro y cierre. El paso del
   jefe solo aparece si la criatura lo es. «Empieza por lo que el grupo va a sentir. Los
   números vienen después, y casi solos.»

   Trabaja directamente sobre app.cr —la ficha está oculta mientras
   dura—, así que no calcula nada por su cuenta: usa calcCr() y la misma
   Biblioteca que la ficha. Por eso «A mano» puede abandonarlo en
   cualquier paso sin perder lo ya decidido.
══════════════════════════════════════════════════════════════ */
(function () {
  const $ = id => document.getElementById(id);
  const PASOS = ['La idea', 'El NA', 'Tipo y tamaño', 'Rol', 'Atributos', 'Estadísticas', 'La especie', 'Potencial', 'El jefe', 'El cierre'];
  const ULTIMO = PASOS.length - 1, JEFE = 8;
  let paso = 0, pintado = -1, abierto = false, iguales = 1;
  /* El paso del jefe solo existe si la criatura es un jefe */
  const visibles = () => PASOS.map((_, i) => i).filter(i => i !== JEFE || cr().estructura === 'jefe');
  const el = (t, c, x) => app.h(t, c, x);
  const cr = () => app.cr;

  /* ── Paso 1 · La idea ─────────────────────────────────────────── */
  function pasoIdea(b) {
    b.appendChild(el('p', 'wiz-hint', 'Una frase: qué es y qué problema plantea.'));
    const idea = document.createElement('textarea');
    idea.value = cr().idea; idea.style.minHeight = '84px';
    idea.placeholder = 'Una araña que caza desde el techo y se lleva a quien se queda atrás.';
    idea.setAttribute('aria-label', 'La idea de la criatura');
    idea.addEventListener('input', () => { cr().idea = idea.value; pie(); });
    b.appendChild(app._campo('La idea', idea));

    const nombre = document.createElement('input');
    nombre.type = 'text'; nombre.value = cr().nombre; nombre.placeholder = 'ej. Tejedora del Techo'; nombre.autocomplete = 'off';
    nombre.setAttribute('aria-label', 'Nombre de la criatura');
    nombre.addEventListener('input', () => { cr().nombre = nombre.value; pie(); });
    const caja = el('div', 'dir-con-dado');
    caja.append(nombre, app._botonDado('Nombre al azar', () => { nombre.value = cr().nombre = app._nombreAzar(); pie(); }));
    b.appendChild(app._campo('Nombre', caja));

    const sub = el('div', 'wiz-sub');
    sub.appendChild(el('span', 'fl', 'Retrato (opcional)'));
    const marco = el('div', 'port-card-edit wiz-retrato');
    marco.setAttribute('role', 'button'); marco.tabIndex = 0;
    marco.setAttribute('aria-label', 'Elegir el retrato de la criatura');
    const img = document.createElement('img');
    img.alt = 'Retrato'; img.src = app._retratoOk(cr().retrato) ? cr().retrato : DEFAULT_PORTRAIT;
    const hint = el('div', 'port-hint'); hint.appendChild(el('span', null, cr().retrato ? 'Cambiar Retrato' : 'Elegir Retrato'));
    marco.append(img, hint);
    const elegir = () => $('img_input').click();
    marco.onclick = elegir;
    marco.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(); } };
    const centro = el('div', 'wiz-retrato-caja'); centro.appendChild(marco);
    sub.appendChild(centro);
    b.appendChild(sub);
  }

  /* ── Paso 2 · El NA ───────────────────────────────────────────── */
  /* Si van a ser varias iguales, se resta al NA de la casilla (Cap. 4) */
  const RESTA = n => n >= 8 ? 9 : n >= 6 ? 7 : n >= 4 ? 6 : n === 3 ? 4 : n === 2 ? 3 : 0;
  function pasoNA(b) {
    b.appendChild(el('p', 'wiz-hint', 'El peso que debe tener en la escena. Una criatura sola del NA de la casilla da esa dificultad; si van a ser varias iguales, cada una es más baja.'));
    const g = app.mesa.grupo;
    const fila = el('div', 'g2 dir-g2');
    fila.append(
      app._campo('Nivel del grupo', app._paso(g.nivel, 1, 10, n => { g.nivel = n; app.guardarMesa(); pintar(); }, 'el nivel del grupo', 'Nivel ' + g.nivel)),
      app._campo('Cuántas iguales', app._paso(iguales, 1, 8, n => { iguales = n; pintar(); }, 'cuántas criaturas iguales', iguales >= 8 ? '8+' : String(iguales))));
    b.appendChild(fila);
    const U = app.umbrales(), resta = RESTA(iguales);
    [['Fácil', U.f, ''], ['Estándar', U.e, 'Pierde en torno a una séptima parte de sus PV; alguien cae en uno de cada cinco a diez combates.'],
     ['Peligroso', U.p, 'Pierde entre un cuarto y un tercio; alguien cae a menudo y la muerte ya es posible.'], ['Mortal', U.m, 'Casi la mitad o más; puede caer el grupo entero, y en uno de cada diez muere alguien.']].forEach(([n, casilla, t]) => {
      const na = Math.max(0, casilla - resta);
      b.appendChild(app.tarjetaOpcion(n, 'NA ' + na + (n === 'Mortal' ? '+' : ''), t, resta ? `Casilla NA ${casilla}, menos ${resta} por ser ${iguales >= 8 ? 'ocho o más' : iguales}` : '',
        cr().na === na, () => { cr().na = Math.min(15, na); cr().pvAct = null; pintar(); }));
    });
    const sub = el('div', 'wiz-sub');
    const B = app.DB.na[cr().na];
    sub.appendChild(app._campo('Nivel de Amenaza', app._paso(cr().na, 0, 15, n => { cr().na = n; cr().pvAct = null; pintar(); }, 'el Nivel de Amenaza',
      'NA ' + cr().na + (B.etiqueta ? ' · ' + B.etiqueta : ''))));
    const ajuste = B.ajuste ? ` (${app._signo(B.ajuste)})` : '';
    sub.appendChild(app._info(`Competencia ${app._signo(B.pb)} · Fuerte ${app._signo(B.fuerte)} · Normal ${app._signo(B.normal)} · Débil ${app._signo(B.debil)}\nDado de daño ${B.dano}${ajuste} · Armadura ${B.a} · PA ${B.pa} · Potencial ${B.peso}\nCon CON Normal, ${cr().na ? Math.floor((50 + cr().na * (5 + B.normal)) * 3 / 2) : '1–4'} PV`));
    b.appendChild(sub);
  }

  /* ── Paso 3 · Tipo y tamaño ───────────────────────────────────── */
  function pasoTipo(b) {
    b.appendChild(el('p', 'wiz-hint', 'El tipo es su naturaleza: da Rasgos gratuitos y sugiere sus atributos Débiles y una debilidad coherente. El tamaño cambia FUE, DES y CON.'));
    const tams = Object.entries(app.DB.tamanos).map(([k, x]) => [k, x.name]);
    b.appendChild(app._campo('Tamaño', app._select(tams, cr().tam, k => { cr().tam = k; cr().pvAct = null; pintar(); }, 'Tamaño')));
    const tm = app.DB.tamanos[cr().tam];
    b.appendChild(app._info(`${tm.ej}\n${tm.atrTxt} · Alcance ${tm.alcance}` + (tm.naEnc ? `\nAl calibrar el encuentro, ${app._signo(tm.naEnc)} NA.` : '')));
    const sub = el('div', 'wiz-sub');
    Object.entries(app.DB.tipos).forEach(([k, t]) => {
      const sel = cr().tipo === k;
      sub.appendChild(app.tarjetaOpcion(t.name, '', t.txt, `Fuertes: ${t.fuertesTxt || '—'} · Débiles: ${t.atrDeb} · Debilidad coherente: ${t.deb}`, sel, () => {
        if (cr().tipo !== k) {
          cr().tipo = k;
          app._ponerRasgosDeTipo(cr());
          app._reponerAtributos(cr());
          if (t.tamMin && app.ORDEN_TAM.indexOf(cr().tam) < app.ORDEN_TAM.indexOf(t.tamMin)) cr().tam = t.tamMin;
        }
        pintar();
      }));
      if (sel) (t.elige || []).forEach(grupo => {
        const actual = cr().rasgos.find(r => r.gratis && r.origen === 'tipo' && grupo.includes(r.id));
        const caja = el('div', 'wiz-sub wiz-inline');
        caja.appendChild(app._campo('Elige su Rasgo de tipo', app._seg(grupo.map(id => [id, app._libIdx()[id]?.e.name || id]), actual?.id || grupo[0], id => {
          if (actual) actual.id = id; else cr().rasgos.unshift({ uid: app._uid(), id, gratis: true, origen: 'tipo' });
          pintar();
        }, 'Rasgo de tipo')));
        sub.appendChild(caja);
      });
    });
    b.appendChild(sub);
  }

  /* ── Paso 4 · Rol ─────────────────────────────────────────────── */
  function pasoRol(b) {
    b.appendChild(el('p', 'wiz-hint', 'Uno o ninguno: cómo se comporta en escena. Su atributo clave es siempre Fuerte: si el tipo no lo tiene, sustituye a uno de los suyos. Algunos marcan también uno Débil.'));
    b.appendChild(app._campo('Estructura', app._seg([['normal', 'Normal'], ['jefe', 'Jefe'], ['horda', 'Horda']], cr().estructura,
      k => { cr().estructura = k; cr().pvAct = null; pintar(); }, 'Estructura')));
    if (cr().estructura === 'jefe') b.appendChild(app._info('PV ×2 y +2 de Potencial. Usa al menos una: Acción de Jefe, Turno Doble o un séquito. Al calibrar el encuentro sube 2 NA.'));
    if (cr().estructura === 'horda') {
      const inp = document.createElement('input');
      inp.type = 'number'; inp.min = 2; inp.max = 999; inp.value = cr().miembros; inp.inputMode = 'numeric';
      inp.setAttribute('aria-label', 'Miembros de la horda');
      inp.addEventListener('change', () => { cr().miembros = Math.max(2, Math.min(999, parseInt(inp.value, 10) || 2)); pintar(); });
      b.appendChild(app._campo('Miembros', inp, 'de 4 a 30'));
      const H = app._horda(cr().miembros);
      b.appendChild(app._info(H.marea ? 'Marea (31 o más): registro Planetario (Guía, Cap. 9).'
        : `${H.n}: una sola criatura de NA ${Math.min(15, cr().na + H.na)} (el de sus miembros + ${H.na}). Un solo turno; doble daño de área; a mitad de sus PV se divide en dos.`));
    }
    const sub = el('div', 'wiz-sub');
    sub.appendChild(app.tarjetaOpcion('Sin Rol', 'Los Fuertes de su tipo', 'Se queda con los Fuertes de su tipo, sin ajuste ni habilidad de Rol.', '', !cr().rol, () => { cr().rol = ''; app._reponerAtributos(cr()); cr().pvAct = null; pintar(); }));
    Object.entries(app.DB.roles).forEach(([k, r]) => {
      sub.appendChild(app.tarjetaOpcion(r.name, '', r.mod, `${r.hab}: ${r.habTxt}`, cr().rol === k, () => { cr().rol = k; app._reponerAtributos(cr()); cr().pvAct = null; pintar(); }));
    });
    b.appendChild(sub);
  }

  /* ── Paso 5 · Atributos ───────────────────────────────────────── */
  function pasoAtributos(b) {
    const S = app.calcCr(cr());
    const B = S.B;
    b.appendChild(el('p', 'wiz-hint', `El tipo da los dos Fuertes (${app._signo(B.fuerte)}), la clave del Rol siempre lo es y el tipo sugiere los Débiles (${app._signo(B.debil)}); el resto son Normales (${app._signo(B.normal)}). El tamaño ya está aplicado.`));
    app._editorAtributos(b, pintar);
    const sub = el('div', 'wiz-sub');
    sub.appendChild(app._info(`${S.tipo.name} — Fuertes: ${S.tipo.fuertesTxt || '—'} · Débiles: ${S.tipo.atrDeb || '—'}\n${S.rol.name ? S.rol.name + ' — ' + S.rol.mod : 'Sin Rol — los Fuertes de su tipo'}\n${S.tam.name} — ${S.tam.atrTxt || 'sin cambios'}`));
    b.appendChild(sub);
  }

  /* ── Paso 6 · Estadísticas ────────────────────────────────────── */
  function pasoStats(b) {
    const S = app.calcCr(cr());
    b.appendChild(el('p', 'wiz-hint', 'Salen de sus atributos con las fórmulas de un personaje. Aquí solo falta ponerle nombre a su ataque.'));
    const grid = el('div', 'def-grid');
    const celda = (rot, val, cls) => { const c = el('div', 'def-cell' + (cls ? ' ' + cls : '')); c.append(el('span', 'def-lbl', rot), el('span', 'def-val', String(val))); return c; };
    grid.append(celda('Guardia', S.guardia, 'def-cell--guardia'), celda('Armadura', S.armadura), celda('CD', S.cd));
    const g1 = el('div', 'dir-stats');
    g1.append(app._stat('PV', String(S.pv)), app._stat('Ataque', app._signo(S.ataque)), app._stat('Daño', S.dano), app._stat('PA', String(S.pa)));
    const g2 = el('div', 'dir-stats dir-stats-3');
    g2.append(app._stat('Velocidad', S.vel + ' pies'), app._stat('Iniciativa', app._signo(S.ini)), app._stat('Moral', S.noMoral ? 'no tira' : String(S.moral)));
    const marco = el('div', 'wiz-panelito');
    marco.append(grid, g1, g2);
    b.appendChild(marco);
    const pega = S.mod.FUE >= S.mod.DES ? 'FUE' : 'DES';
    b.appendChild(app._info(
      `Ataque = Competencia ${app._signo(S.pb)} + ${pega} ${app._signo(S.mod[pega])}\n` +
      `Daño por turno = ${S.danoBase}${S.rol.danoDados ? ' + ' + S.rol.danoDados + 'd6 de su Rol' : ''} + ${pega}\n` +
      `Guardia = 10 + Competencia + DES ${app._signo(S.mod.DES)}\n` +
      (S.esbirro ? 'PV = NA × 2 (esbirro)\n' : `PV = (20 + NA × (8 + CON ${app._signo(S.mod.CON)})) × 1,5${S.jefe ? ', el doble por ser jefe' : ''}\n`) +
      `Salvaciones fuertes: ${cr().fuertes.map(a => a + ' ' + app._signo(S.salv[a])).join(' · ')}\n` +
      `Al calibrar el encuentro: ${app._txtCalibrar(S)}`));

    const sub2 = el('div', 'wiz-sub');
    const n = document.createElement('input');
    n.type = 'text'; n.value = cr().ataqueNombre; n.placeholder = 'ej. Quelíceros'; n.autocomplete = 'off';
    n.setAttribute('aria-label', 'Nombre del ataque');
    n.addEventListener('input', () => { cr().ataqueNombre = n.value; });
    const tipos = [['', '— Sin tipo —']].concat((app.DB.tablas.danos?.filas || []).map(x => [x, x]));
    if (cr().danoTipo && !tipos.some(t => t[0] === cr().danoTipo)) tipos.push([cr().danoTipo, cr().danoTipo]);
    const g = el('div', 'g2 dir-g2');
    g.append(app._campo('Su ataque', n), app._campo('Tipo de daño', app._select(tipos, cr().danoTipo, v => { cr().danoTipo = v; }, 'Tipo de daño')));
    sub2.appendChild(g);
    b.appendChild(sub2);
  }

  /* Lista de los Rasgos propios (no de tipo) con su etiqueta de Potencial */
  function tarjetasRasgos(caja, S, alTocar, etiqueta) {
    S.infos.filter(x => !x.r.gratis).forEach(x => {
      caja.appendChild(app.tarjetaOpcion(x.i.name + (x.r.nota ? ` (${x.r.nota})` : ''), etiqueta(x), x.i.txt, app._lineaTipo(x.i), !!alTocar.sel(x), () => alTocar.fn(x)));
    });
  }
  function barraPotencial(b, S) {
    const carga = el('div', 'dir-load');
    carga.append(el('span', 'dir-load-lbl', 'Potencial'), el('span', 'dir-load-val', `${S.pesoGastado}/${S.pesoMax}`));
    const barra = el('div', 'lbar'); const fill = el('div', 'lfill' + (S.exceso ? ' dir-exceso' : ''));
    fill.style.width = (S.pesoMax ? Math.min(100, S.pesoGastado / S.pesoMax * 100) : (S.pesoGastado ? 100 : 0)) + '%';
    barra.appendChild(fill);
    b.append(carga, barra);
  }
  function botonBiblioteca(b) {
    const abrir = el('button', 'btn btn-gold dir-ancho'); abrir.type = 'button';
    abrir.textContent = 'Abrir la Biblioteca';
    abrir.onclick = () => app.abrirBiblioteca();
    b.appendChild(abrir);
  }

  /* ── Paso 7 · Rasgos de especie ───────────────────────────────── */
  function pasoEspecie(b) {
    const S = app.calcCr(cr());
    b.appendChild(el('p', 'wiz-hint', `Lo que la hace ser lo que es. Los de narrativa son gratis, y uno de combate también si no pasa de Potencial ${S.tope} (el tope de su NA). Toca un Rasgo para marcarlo como de especie.` +
      (S.na >= 3 ? ' Desde NA 3, el más fuerte es su Aptitud definitoria: la que decide el combate.' : '')));
    botonBiblioteca(b);
    const sub = el('div', 'wiz-sub');
    tarjetasRasgos(sub, S, { sel: x => x.r.especie, fn: x => { if (x.r.especie) { delete x.r.especie; delete x.r.definitoria; delete x.r.racial; } else x.r.especie = true; pintar(); } },
      x => x.r.especie ? (S.motivoGratis(x) === 'especie' ? 'especie · gratis' : 'especie') : 'tocar: de especie');
    if (!sub.childElementCount) sub.appendChild(el('p', 'dir-nota', 'Aún no tiene Rasgos propios: ábrelos en la Biblioteca.'));
    b.appendChild(sub);
    const especie = S.infos.filter(x => x.r.especie && !x.r.gratis);
    if (S.na >= 3 && especie.length) {
      const s2 = el('div', 'wiz-sub');
      const ops = [['', '— Sin elegir —']].concat(especie.map(x => [x.r.uid, x.i.name]));
      const actual = especie.find(x => x.r.definitoria);
      s2.appendChild(app._campo('Aptitud definitoria', app._select(ops, actual ? actual.r.uid : '', uid => {
        especie.forEach(x => { if (x.r.uid === uid) x.r.definitoria = true; else delete x.r.definitoria; });
        pintar();
      }, 'Aptitud definitoria')));
      const ta = document.createElement('textarea');
      ta.value = cr().proteccion || ''; ta.style.minHeight = '64px';
      ta.placeholder = 'Apartar la mirada da Ventaja; un antídoto bebido antes baja Paralizado a Ralentizado.';
      ta.setAttribute('aria-label', 'Protección');
      ta.addEventListener('input', () => { cr().proteccion = ta.value; });
      s2.appendChild(app._campo('Protección', ta, 'Ventaja o un escalón menos, nunca la anula'));
      b.appendChild(s2);
    }
  }

  /* ── Paso 8 · Potencial ───────────────────────────────────────── */
  function pasoPotencial(b) {
    const S = app.calcCr(cr());
    b.appendChild(el('p', 'wiz-hint', 'Gasta el Potencial de su NA: primero lo que sostiene la idea, después lo que la hace jugable (movilidad, defensa) y, si quieres que el grupo descubra algo, una Debilidad. Por debajo de NA 5, una sola pieza de Potencial 3. Puedes pasarte: cada 2 de exceso suben 1 su NA de encuentro.'));
    barraPotencial(b, S);
    if (S.exceso) b.appendChild(el('p', 'dir-aviso', `Excede en ${S.exceso}` + (S.exceso >= 2 ? `: cuenta como NA ${S.naEnc} al calcular el encuentro.` : ': con 2 de exceso contará como +1 NA.')));
    (S.tipo.exige || []).forEach(id => {
      if (!cr().rasgos.some(r => r.id === id)) b.appendChild(el('p', 'dir-aviso', `${S.tipo.name}: debe tener ${app._libIdx()[id]?.e.name || id}.`));
    });
    botonBiblioteca(b);
    const sub = el('div', 'wiz-sub');
    if (S.rol && S.rol.hab) sub.appendChild(app.tarjetaOpcion(S.rol.hab, 'de Rol', S.rol.habTxt, '', true, () => {}));
    tarjetasRasgos(sub, S, { sel: () => true, fn: x => { cr().rasgos = cr().rasgos.filter(r => r !== x.r); pintar(); } },
      x => S.motivoGratis(x) ? S.motivoGratis(x) + ' ✓ · quitar' : (x.i.peso < 0 ? 'devuelve 1 · quitar' : `Potencial ${x.i.peso} · quitar`));
    b.appendChild(sub);
    // Debilidades coherentes con su tipo, a un toque
    const nombres = String(S.tipo.deb || '').split(',').map(t => t.trim().replace(/\s*\(.*\)$/, '')).filter(Boolean);
    const sugeridas = app.DB.rasgos.debilidades.filter(e => nombres.includes(e.name) && !cr().rasgos.some(r => r.id === e.id));
    if (sugeridas.length && S.nDebs < 2) {
      const s2 = el('div', 'wiz-sub');
      s2.appendChild(el('span', 'fl', 'Debilidad coherente con su tipo'));
      sugeridas.forEach(e => s2.appendChild(app.tarjetaOpcion(e.name, 'añadir · devuelve 1', e.txt, '', false, () => { app.ponerRasgo(e.id, true); pintar(); })));
      b.appendChild(s2);
    }
  }

  /* ── Paso 9 · Si es un jefe ───────────────────────────────────── */
  const RAREZA = na => na <= 5 ? 'Infrecuente, con 1 propiedad' : na <= 8 ? 'Raro, con 2' : na <= 11 ? 'Muy Raro, con 3' : 'Legendario, con 4';
  function pasoJefe(b) {
    const S = app.calcCr(cr());
    b.appendChild(el('p', 'wiz-hint', 'PV ×2 y +2 de Potencial (ya aplicados). Además: Acción de Jefe, Turno Doble o un séquito; un Rasgo racial mayor gratuito; y un objeto mágico de la rareza de su NA, con sus bonos ya sumados.'));
    const ids = cr().rasgos.map(r => r.id);
    const eco = ids.includes('accion_de_jefe') ? 'Acción de Jefe' : ids.includes('turno_doble') ? 'Turno Doble' : '';
    b.appendChild(el('p', eco ? 'dir-nota dir-ok' : 'dir-aviso', eco ? `Responde entre los turnos del grupo con ${eco}.` : 'Sin Acción de Jefe ni Turno Doble: añade una en la Biblioteca (Mando y jefes) o dale un séquito.'));
    const sub = el('div', 'wiz-sub');
    sub.appendChild(el('span', 'fl', 'Rasgo racial mayor — de Potencial 3, o 2 si ninguno encaja'));
    tarjetasRasgos(sub, S, { sel: x => x.r.racial, fn: x => { S.infos.forEach(y => { delete y.r.racial; }); if (!x.r.racial) { x.r.racial = true; x.r.especie = true; } pintar(); } },
      x => x.r.racial ? 'racial mayor ✓' : `Potencial ${x.i.peso}`);
    b.appendChild(sub);
    botonBiblioteca(b);
    const s2 = el('div', 'wiz-sub');
    const ta = document.createElement('textarea');
    ta.value = cr().equipo || ''; ta.style.minHeight = '64px';
    ta.placeholder = `Objeto ${RAREZA(S.na)}: +bono al ataque, a la CD, a la Armadura o a la Guardia; daño de energía; Resistencia; o atravesar una defensa.`;
    ta.setAttribute('aria-label', 'Su objeto mágico');
    ta.addEventListener('input', () => { cr().equipo = ta.value; });
    s2.appendChild(app._campo('Su objeto mágico', ta, RAREZA(S.na)));
    s2.appendChild(el('p', 'dir-nota', 'Sus bonos se suman a mano en la ficha (Defensa, Ataque o Estadísticas). Si el jefe cae, es botín.'));
    b.appendChild(s2);
  }

  /* ── Paso 10 · El encuentro y el cierre ───────────────────────── */
  function pasoCierre(b) {
    const S = app.calcCr(cr());
    const partes = [];
    if (S.exceso >= 2) partes.push(`exceso de Potencial +${Math.floor(S.exceso / 2)}`);
    if (S.jefe) partes.push(`jefe +${S.na >= 6 ? 4 : 3}`);
    if (S.area) partes.push(`Aptitud de área +${S.area}`);
    if (S.tam.naEnc) partes.push(`tamaño +${S.tam.naEnc}`);
    if (S.axiomas) partes.push('Axiomas +1');
    b.appendChild(app._info(S.naEnc === S.na ? `Encuentro: cuenta como NA ${S.na}, su propio NA.` : `Encuentro: cuenta como NA ${S.naEnc} (${S.na} + ${partes.join(', ')}).`));
    const ta = document.createElement('textarea');
    ta.value = cr().senal; ta.style.minHeight = '72px';
    ta.placeholder = 'Hilos pegajosos a la altura de la cabeza; ratas envueltas; ningún eco en la galería.';
    ta.setAttribute('aria-label', 'La señal');
    ta.addEventListener('input', () => { cr().senal = ta.value; pie(); });
    const caja = el('div', 'dir-con-dado');
    caja.append(ta, app._botonDado('Señal al azar', () => { ta.value = cr().senal = app._azar(app.DB.tablas.senal.filas); pie(); }));
    b.appendChild(app._campo('La señal', caja, 'qué percibe el grupo antes de verla'));
    const ctx = document.createElement('textarea');
    ctx.value = cr().contexto; ctx.style.minHeight = '84px';
    ctx.placeholder = 'No pelea: atrapa con la tela al último de la fila y se lo lleva. El grupo decide entre perseguirla o dejar atrás a un compañero.';
    ctx.setAttribute('aria-label', 'Contexto táctico');
    ctx.addEventListener('input', () => { cr().contexto = ctx.value; pie(); });
    b.appendChild(app._campo('Contexto táctico', ctx, 'una o dos frases; si no salen, vuelve a sus Rasgos'));
    b.appendChild(el('p', 'dir-nota', S.noMoral ? 'Cuándo huye: no tira Moral; anótalo en el contexto.' : `Cuándo huye: Moral ${S.moral} (2d10 por encima, rompe).`));
    const sub = el('div', 'wiz-sub');
    [['habitat', 'Hábitat', 'habitat'], ['quiere', 'Qué quiere', 'quiere'], ['pelea', 'Cómo pelea', 'pelea'], ['botin', 'Lo que deja al caer', 'botinCae']].forEach(([k, rot, tabla]) => {
      const inp = document.createElement('input');
      inp.type = 'text'; inp.value = cr()[k]; inp.autocomplete = 'off'; inp.placeholder = 'Opcional';
      inp.setAttribute('aria-label', rot);
      inp.addEventListener('input', () => { cr()[k] = inp.value; });
      const c = el('div', 'dir-con-dado');
      c.append(inp, app._botonDado(`${rot} al azar`, () => {
        inp.value = cr()[k] = app._azar(app.DB.tablas[tabla].filas).replace(/NA × (\d+)/g, (_, n) => String(cr().na * parseInt(n, 10)));
      }));
      sub.appendChild(app._campo(rot, c));
    });
    sub.appendChild(el('span', 'fl', 'Así queda'));
    sub.appendChild(app._info(`${cr().nombre || 'Sin nombre'} — ${app._etiquetaNA(cr())} · ${app._lineaCr(cr())}\n` +
      `PV ${S.pv} · Guardia ${S.guardia} · Armadura ${S.armadura} · Ataque ${app._signo(S.ataque)} · Daño ${S.dano}\n` +
      `Potencial ${S.pesoGastado}/${S.pesoMax} · al calibrar, ${app._txtCalibrar(S)}`));
    b.appendChild(sub);
  }

  const PINTORES = [pasoIdea, pasoNA, pasoTipo, pasoRol, pasoAtributos, pasoStats, pasoEspecie, pasoPotencial, pasoJefe, pasoCierre];

  function queFalta() {
    const c = cr();
    switch (paso) {
      case 0:
        if (!c.idea.trim()) return 'Escribe la idea en una frase';
        return c.nombre.trim() ? '' : 'Ponle un nombre';
      case 4: return c.fuertes.length === 2 ? '' : 'Elige dos atributos Fuertes';
      case 9:
        if (!c.senal.trim()) return 'Toda amenaza tiene señal';
        return c.contexto.trim() ? '' : 'Escribe el contexto táctico';
    }
    return '';
  }

  function pie() {
    const falta = queFalta();
    $('wiz_next').disabled = !!falta;
    $('wiz_next').textContent = paso === ULTIMO ? 'Crear amenaza' : 'Continuar';
    $('wiz_why').textContent = falta;
  }

  function pintar() {
    const vis = visibles();
    if (!vis.includes(paso)) paso = vis.find(i => i > paso) ?? ULTIMO;
    $('wiz_ttl').textContent = PASOS[paso];
    $('wiz_sub').textContent = `Paso ${vis.indexOf(paso) + 1} de ${vis.length}`;
    const bars = $('wiz_bars'); bars.textContent = '';
    vis.forEach(i => bars.appendChild(el('span', 'wiz-bar' + (i === paso ? ' on' : (i < paso ? ' done' : '')))));
    const b = $('wiz_body');
    const y = pintado === paso ? b.scrollTop : 0;
    b.textContent = '';
    PINTORES[paso](b);
    b.scrollTop = y;
    pintado = paso;
    pie();
  }

  function cerrar() {
    abierto = false;
    $('wiz_panel').classList.remove('fs-open');
    document.body.style.overflow = '';
    app._retratoRecortado = null;
    app._alCerrarBiblioteca = null;
  }
  function abrir() {
    app.limpiarFicha();
    app.cr = app.nuevaCr();
    app._nombreOriginal = '';
    app.modo = 'ficha';
    paso = 0; pintado = -1; abierto = true; iguales = 1;
    app._retratoRecortado = () => { if (abierto) pintar(); };
    app._alCerrarBiblioteca = () => { if (abierto) pintar(); };
    $('wiz_panel').classList.add('fs-open');
    document.body.style.overflow = 'hidden';
    pintar();
  }

  /** Sale del asistente a la ficha con lo que haya. `completo` = terminado:
      la ficha se queda en resumen; a medias, con el perfil en edición. */
  function volcar(completo) {
    const c = app.cr;
    cerrar();
    app._abrirFicha(c, '');
    app._markUnsaved();
    if (!completo) {
      app.editSection('personal');
      app.editSection('identity');
      app.toast('Ficha abierta: lo que elegiste sigue ahí', 'info');
    } else app.toast(`${c.nombre} lista — revisa la ficha y guarda`, 'ok');
  }

  $('wiz_back').onclick = () => {
    const vis = visibles(), i = vis.indexOf(paso);
    if (i > 0) { paso = vis[i - 1]; pintar(); return; }
    cerrar();
    app.showScreen('home');
  };
  $('wiz_next').onclick = () => {
    if (queFalta()) return;
    if (paso === ULTIMO) { volcar(true); return; }
    const vis = visibles();
    paso = vis[vis.indexOf(paso) + 1]; pintar();
  };
  $('wiz_manual').onclick = () => volcar(false);
  $('wiz_dado').onclick = () => {
    const na = paso >= 1 ? app.cr.na : null;
    app.cr = app.criaturaAlAzar(na);
    volcar(true);
  };

  /* ── Interruptor en Ajustes ───────────────────────────────────── */
  const CLAVE = 'ssd_asistente';
  const leer = () => { try { return localStorage.getItem(CLAVE) !== '0'; } catch (e) { return true; } };
  const sincronizar = () => { const b = $('wiz_toggle_btn'); if (b) b.setAttribute('aria-pressed', String(app.asistenteActivo)); };
  app.asistenteActivo = leer();
  app.toggleAsistente = function () {
    this.asistenteActivo = !this.asistenteActivo;
    try { localStorage.setItem(CLAVE, this.asistenteActivo ? '1' : '0'); } catch (e) { /* la sesión sigue */ }
    sincronizar();
    this.toast(this.asistenteActivo
      ? 'Asistente activado — «Nueva amenaza» te guiará por los pasos del Manual'
      : 'Asistente desactivado — «Nueva amenaza» abrirá la ficha en blanco', 'ok');
  };
  const _open = app.openSettings;
  app.openSettings = function () { const r = _open.apply(this, arguments); sincronizar(); return r; };

  app.newChar = function () {
    if (!app.asistenteActivo) return app.nuevaAmenazaManual();
    abrir();
  };
  app.abrirAsistente = abrir;
  app._asistenteAbierto = () => abierto;
})();
