/* ══════════════════════════════════════════════════════════════
   Subida de nivel y descanso.
   Módulo aparte: se carga entre app.js y boot.js y envuelve
   updateXpHint(), updateTalentCount() e init(). Todo lo que toca vive
   aquí, así que la función se quita quitando el <script> — pero el orden
   de carga importa: DEBE ir tras app.js (necesita el objeto `app`) y
   ANTES de boot.js (que llama a init()).

   Reglas (Expert v1.0 «Tabla de progresión completa» y Reglas
   Esenciales §7), en constants.js: XP_TABLE · PD_POR_NIVEL ·
   TALENT_SLOTS · HITOS_NIVEL · DESCANSOS.

   La Carne NO se recupera descansando: el manual solo la sube 1 punto
   por semana completa de reposo real, con curación avanzada (100 pp) o
   con botiquín avanzado (CD 16). Por eso el reposo semanal es una
   entrada aparte del menú y los cuatro descansos normales no la tocan.
══════════════════════════════════════════════════════════════ */
(function () {
  const $ = id => document.getElementById(id);
  const num = (id, def = 0) => parseInt($(id)?.value, 10) || def;
  const txt = (id, def = 0) => parseInt($(id)?.textContent, 10) || def;
  const lvl = () => Math.min(10, Math.max(1, num('char_lvl', 1)));

  /* Reposo prolongado: es un Descanso Largo Seguro que además, por durar
     una semana de reposo real, sube 1 punto de Carne. */
  const REPOSO_SEMANAL = {
    id: 'semana', nombre: 'Reposo prolongado', dur: '1 semana',
    coste: 'Sin viajar ni combatir',
    txt: 'Todos los PV y Reservas, y +1 de Carne (el único descanso que la toca).',
    pv: 'todo', reservas: 1, carne: 1,
  };

  const opciones = () => DESCANSOS.concat([REPOSO_SEMANAL]);

  // ── Subida de nivel ────────────────────────────────────────────
  function refreshLevelBtn() {
    const btn = $('lvlup_btn');
    if (!btn) return;
    const l = lvl();
    const puede = l < 10 && num('char_xp') >= (XP_TABLE[l] || 0);
    btn.style.display = puede ? '' : 'none';
    if (puede) {
      const pd = PD_POR_NIVEL[l + 1] || 0;
      btn.textContent = `Subir a Nivel ${l + 1}  ·  +${pd} PD`;
    }
  }

  function refreshSlots() {
    const el = $('talent_slots_lbl');
    if (!el) return;
    const n = document.querySelectorAll('input[name="chk_talents_hidden"]').length;
    const max = TALENT_SLOTS[lvl()] || 3;
    el.textContent = `${n} / ${max}`;
    el.classList.toggle('over', n > max);
    el.title = n > max
      ? `Te pasas por ${n - max}: al Nivel ${lvl()} te tocan ${max} Talentos.`
      : `Al Nivel ${lvl()} te tocan ${max} Talentos.`;
    // El contador del Gestor marcaba «lleno» con un 3 fijo
    const modal = $('talent_count_modal');
    if (modal) modal.classList.toggle('full', n >= max);
  }

  app.levelUp = function () {
    const l = lvl();
    if (l >= 10) { this.toast('Ya estás al nivel máximo', 'info'); return; }
    const need = XP_TABLE[l] || 0;
    if (num('char_xp') < need) {
      this.toast(`Te faltan ${need - num('char_xp')} XP para el Nivel ${l + 1}`, 'info');
      return;
    }
    const nuevo = l + 1;
    $('char_lvl').value = nuevo;
    const pd = PD_POR_NIVEL[nuevo] || 0;
    if ($('char_pd')) $('char_pd').value = num('char_pd') + pd;

    this.calc();                 // recalcula PV, Reservas, PB, NLE…
    this.updateXpHint();
    this._markUnsaved && this._markUnsaved();

    const hito = HITOS_NIVEL[nuevo];
    this.toast(`Nivel ${nuevo} · +${pd} PD` + (hito ? ` · ${hito}` : ''), 'ok');
    if (navigator.vibrate) navigator.vibrate([10, 40, 10]);
  };

  // ── Descanso ───────────────────────────────────────────────────
  function pintarMenu() {
    const host = $('rest_list');
    if (!host || host.dataset.listo) return;
    host.textContent = '';
    opciones().forEach(o => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rest-opt' + (o.carne ? ' rest-opt-carne' : '');
      const t = document.createElement('span');
      t.className = 'rest-opt-t';
      t.textContent = o.nombre;
      const m = document.createElement('span');
      m.className = 'rest-opt-m';
      m.textContent = `${o.dur} · ${o.coste}`;
      const d = document.createElement('span');
      d.className = 'rest-opt-d';
      d.textContent = o.txt;
      b.append(t, m, d);
      b.addEventListener('click', () => app.doRest(o.id));
      host.appendChild(b);
    });
    host.dataset.listo = '1';
  }

  app.doRest = function (id) {
    const o = opciones().find(x => x.id === id);
    if (!o) return;
    const parte = [];

    // PV
    const maxPv = txt('max_pv');
    const curPv = num('cur_pv');
    let nuevoPv = curPv;
    if (o.pv === 'todo') {
      nuevoPv = maxPv;
    } else if (o.pv === 'mitad') {
      nuevoPv = Math.min(maxPv, curPv + Math.floor(maxPv / 2));
    } else if (o.pv === '1d8+con') {
      const modCon = this._statFinal('CON').mod;
      const d8 = 1 + Math.floor(Math.random() * 8);
      const cura = Math.max(1, d8 + modCon);      // nunca cura menos de 1
      nuevoPv = Math.min(maxPv, curPv + cura);
      parte.push(`1d8+MOD CON = ${d8}${modCon >= 0 ? '+' : ''}${modCon} → ${cura} PV`);
    }
    if ($('cur_pv')) $('cur_pv').value = nuevoPv;
    if (o.pv !== '1d8+con') parte.push(`PV ${nuevoPv}/${maxPv}`);

    // Reservas
    if (o.reservas > 0) {
      [['cur_adr', 'max_adr'], ['cur_ing', 'max_ing']].forEach(([c, m]) => {
        const max = txt(m);
        const val = o.reservas === 1 ? max
                                     : Math.min(max, num(c) + Math.floor(max / 2));
        if ($(c)) $(c).value = val;
      });
      parte.push(o.reservas === 1 ? 'Reservas al completo' : 'Reservas a la mitad');
    } else {
      parte.push('Reservas sin cambios');
    }

    // Carne: solo el reposo prolongado
    if (o.carne) {
      const maxC = txt('res_carne');
      const nueva = Math.min(maxC, num('cur_carne') + o.carne);
      if ($('cur_carne')) $('cur_carne').value = nueva;
      parte.push(`Carne ${nueva}/${maxC}`);
    }

    this._updateResBars();
    this._markUnsaved && this._markUnsaved();
    const det = $('rest_panel');
    if (det) det.open = false;
    this.toast(`${o.nombre} — ${parte.join(' · ')}`, 'ok');
    if (navigator.vibrate) navigator.vibrate(12);
  };

  // ── Enganches ──────────────────────────────────────────────────
  const _updateXpHint = app.updateXpHint;
  app.updateXpHint = function () {
    const r = _updateXpHint.apply(this, arguments);
    refreshLevelBtn();
    refreshSlots();
    return r;
  };

  const _updateTalentCount = app.updateTalentCount;
  app.updateTalentCount = function () {
    const r = _updateTalentCount.apply(this, arguments);
    refreshSlots();              // pisa el «lleno» con tope 3 de app.js
    return r;
  };

  const _init = app.init;
  app.init = function () {
    const r = _init.apply(this, arguments);
    pintarMenu();
    refreshLevelBtn();
    refreshSlots();
    return r;
  };
})();
