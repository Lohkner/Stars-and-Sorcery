/* ══════════════════════════════════════════════════════════════
   Copia de seguridad de TODOS los personajes.
   Módulo aparte; se carga entre app.js y boot.js.

   Exportar: un solo archivo .json con el roster entero, tal y como está
   guardado en este dispositivo (retratos incluidos).
   Restaurar: lee ese archivo y añade sus personajes al roster. Si alguno
   ya existe con el mismo nombre, pregunta antes de reemplazarlo; si se
   cancela, no se toca nada.

   Solo se admite el formato de este módulo, reconocible por su campo
   `tipo`. Un JSON de un solo personaje sigue entrando por «Importar JSON».
══════════════════════════════════════════════════════════════ */
(function () {
  const TIPO = 'ss-companion-respaldo';
  const VERSION = 1;

  const fecha = () => {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  };

  /** Un personaje guardado es válido si trae sus `inputs`. El retrato,
      que se interpola en un src, solo se admite como data-URL de imagen:
      lo mismo que exige la pantalla de Inicio al pintarlo. */
  function limpiar(p) {
    if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
    if (!p.inputs || typeof p.inputs !== 'object' || Array.isArray(p.inputs)) return null;
    const out = { ...p };
    if (typeof out.portrait !== 'string' || !/^data:image\//.test(out.portrait)) delete out.portrait;
    return out;
  }

  /** Aviso doble: toast y la línea de estado bajo los botones. Los botones
      viven en Ajustes, un <dialog> modal que tapa los toasts; sin la línea,
      el resultado no se vería mientras el panel está abierto. */
  function avisar(msg, tipo) {
    app.toast(msg, tipo);
    const est = document.getElementById('respaldo_estado');
    if (!est) return;
    est.textContent = msg;
    est.classList.toggle('is-ok', tipo === 'ok');
    est.classList.toggle('is-err', tipo === 'err');
  }

  app.exportarRespaldo = function () {
    const roster = STORAGE.loadRoster();
    const n = Object.keys(roster).length;
    if (!n) { avisar('No hay personajes guardados que copiar', 'err'); return; }
    const datos = {
      tipo: TIPO, version: VERSION, creado: new Date().toISOString(),
      reglas: STORAGE.RULES_DATA_VERSION,
      personajes: roster,
    };
    // Blob y no data-URL: con retratos, la copia pasa de los 2 MB que
    // algunos navegadores admiten en un enlace data:.
    const url = URL.createObjectURL(new Blob([JSON.stringify(datos)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `ss-companion-respaldo-${fecha()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    avisar(`Copia creada: ${n} ${n === 1 ? 'personaje' : 'personajes'} · ${fecha()}`, 'ok');
  };

  app.restaurarRespaldo = function (input) {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const r = new FileReader();
    r.onload = e => {
      let datos;
      try { datos = JSON.parse(e.target.result); }
      catch (err) { avisar('El archivo no es un JSON válido', 'err'); return; }
      if (!datos || datos.tipo !== TIPO || typeof datos.personajes !== 'object' || Array.isArray(datos.personajes)) {
        avisar('No es una copia de seguridad de S&S Companion. Para un solo personaje usa «Importar JSON».', 'err');
        return;
      }
      const entrantes = {};
      let descartados = 0;
      Object.entries(datos.personajes).forEach(([nombre, p]) => {
        const ok = limpiar(p);
        if (ok && String(nombre).trim()) entrantes[String(nombre)] = ok;
        else descartados++;
      });
      const nombres = Object.keys(entrantes);
      if (!nombres.length) { avisar('La copia no contiene personajes válidos', 'err'); return; }

      const roster = STORAGE.loadRoster();
      const repetidos = nombres.filter(n => roster[n]);
      const aplicar = () => {
        const nuevo = { ...roster, ...entrantes };
        if (!STORAGE.saveRoster(nuevo)) {
          avisar('Sin espacio en este dispositivo para restaurar la copia', 'err');
          return;
        }
        if (typeof this.renderHome === 'function') this.renderHome();
        const extra = !descartados ? ''
          : descartados === 1 ? ' (1 dañado, omitido)' : ` (${descartados} dañados, omitidos)`;
        avisar(`${nombres.length === 1 ? 'Restaurado 1 personaje' : `Restaurados ${nombres.length} personajes`}${extra}`, 'ok');
      };
      if (!repetidos.length) { aplicar(); return; }
      // UI.confirm pinta con textContent: los nombres van tal cual.
      const lista = repetidos.slice(0, 6).map(n => '«' + n + '»').join(', ')
                  + (repetidos.length > 6 ? ` y ${repetidos.length - 6} más` : '');
      this._confirm(
        'Restaurar copia',
        `La copia trae ${nombres.length} ${nombres.length === 1 ? 'personaje' : 'personajes'}. `
          + `${repetidos.length === 1 ? 'Este ya existe' : 'Estos ya existen'} en el dispositivo y se reemplazará${repetidos.length === 1 ? '' : 'n'} por la versión de la copia: ${lista}.`,
        'Restaurar',
        aplicar,
        document.getElementById('settings_modal')?.open ? document.getElementById('settings_modal') : document.body
      );
    };
    r.onerror = () => avisar('No se pudo leer el archivo', 'err');
    r.readAsText(file);
  };
})();
