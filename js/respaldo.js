/* ══════════════════════════════════════════════════════════════
   Copia de seguridad de TODO: las amenazas y la Mesa del Director.
   (Heredado de S&S Companion.)

   Exportar: un solo archivo .json con el roster entero, tal y como está
   guardado en este dispositivo (retratos incluidos), más la Mesa
   (encuentros, tesoro, zonas y facciones).
   Restaurar: lee ese archivo y añade sus amenazas al roster. Si alguna
   ya existe con el mismo nombre —o si la copia trae una Mesa y aquí ya
   hay una con contenido—, pregunta antes de reemplazar; si se cancela,
   no se toca nada.

   Solo se admite el formato de este módulo, reconocible por su campo
   `tipo`. Un JSON de una sola amenaza sigue entrando por «Importar».
══════════════════════════════════════════════════════════════ */
(function () {
  const TIPO = 'ss-director-respaldo';
  const VERSION = 1;

  const fecha = () => {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  };

  /** Una amenaza guardada es válida si es un objeto con su NA. Pasa por
      normalizarCr, que deja el retrato solo si es un data-URL de imagen y
      quita cualquier HTML de los textos. */
  function limpiar(p) {
    if (!p || typeof p !== 'object' || Array.isArray(p) || !('na' in p)) return null;
    return app.normalizarCr(p);
  }

  /** Aviso doble: toast y la línea de estado bajo los botones. Los botones
      viven en Ajustes, un <dialog> modal que tapa los toasts. */
  function avisar(msg, tipo) {
    app.toast(msg, tipo);
    const est = document.getElementById('respaldo_estado');
    if (!est) return;
    est.textContent = msg;
    est.classList.toggle('is-ok', tipo === 'ok');
    est.classList.toggle('is-err', tipo === 'err');
  }

  const mesaConContenido = m => !!m && ['guardados', 'tesoro', 'zonas', 'facciones'].some(k => Array.isArray(m[k]) && m[k].length)
    || !!(m && m.enc && Array.isArray(m.enc.items) && m.enc.items.length);

  app.exportarRespaldo = function () {
    const roster = STORAGE.loadRoster();
    const n = Object.keys(roster).length;
    const conMesa = mesaConContenido(this.mesa);
    if (!n && !conMesa) { avisar('No hay amenazas ni Mesa que copiar', 'err'); return; }
    const datos = {
      tipo: TIPO, version: VERSION, creado: new Date().toISOString(),
      reglas: STORAGE.RULES_DATA_VERSION,
      amenazas: roster,
      mesa: this.mesa,
    };
    app.guardarArchivo(`ss-director-respaldo-${fecha()}.json`, JSON.stringify(datos)).then(r => {
      if (r === 'cancelado') { avisar('Copia cancelada', 'info'); return; }
      avisar(`Copia ${r === 'compartido' ? 'compartida' : 'creada'}: ${n} ${n === 1 ? 'amenaza' : 'amenazas'}${conMesa ? ' y la Mesa' : ''} · ${fecha()}`, 'ok');
    });
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
      if (!datos || datos.tipo !== TIPO || typeof datos.amenazas !== 'object' || Array.isArray(datos.amenazas)) {
        avisar('No es una copia de seguridad de S&S Director. Para una sola amenaza usa «Importar».', 'err');
        return;
      }
      const entrantes = {};
      let descartados = 0;
      Object.entries(datos.amenazas).forEach(([nombre, p]) => {
        const ok = limpiar(p);
        if (ok && String(nombre).trim()) entrantes[String(nombre)] = ok;
        else descartados++;
      });
      const nombres = Object.keys(entrantes);
      const traeMesa = mesaConContenido(datos.mesa);
      if (!nombres.length && !traeMesa) { avisar('La copia no contiene amenazas ni Mesa válidas', 'err'); return; }

      const roster = STORAGE.loadRoster();
      const repetidos = nombres.filter(n => roster[n]);
      const pisaMesa = traeMesa && mesaConContenido(this.mesa);
      const aplicar = () => {
        if (!STORAGE.saveRoster({ ...roster, ...entrantes })) {
          avisar('Sin espacio en este dispositivo para restaurar la copia', 'err');
          return;
        }
        if (traeMesa) {
          STORAGE.saveMesa(datos.mesa);
          this.initMesa();
        }
        if (typeof this.renderHome === 'function') this.renderHome();
        const extra = !descartados ? ''
          : descartados === 1 ? ' (1 dañada, omitida)' : ` (${descartados} dañadas, omitidas)`;
        avisar(`${nombres.length === 1 ? 'Restaurada 1 amenaza' : `Restauradas ${nombres.length} amenazas`}${traeMesa ? ' y la Mesa' : ''}${extra}`, 'ok');
      };
      if (!repetidos.length && !pisaMesa) { aplicar(); return; }
      // UI.confirm pinta con textContent: los nombres van tal cual.
      const lista = repetidos.slice(0, 6).map(n => '«' + n + '»').join(', ')
                  + (repetidos.length > 6 ? ` y ${repetidos.length - 6} más` : '');
      const partes = [`La copia trae ${nombres.length} ${nombres.length === 1 ? 'amenaza' : 'amenazas'}.`];
      if (repetidos.length) partes.push(`${repetidos.length === 1 ? 'Esta ya existe' : 'Estas ya existen'} en el dispositivo y se reemplazará${repetidos.length === 1 ? '' : 'n'} por la versión de la copia: ${lista}.`);
      if (pisaMesa) partes.push('La Mesa del Director actual (encuentros, tesoro, zonas y facciones) se reemplazará por la de la copia.');
      this._confirm('Restaurar copia', partes.join(' '), 'Restaurar', aplicar,
        document.getElementById('settings_modal')?.open ? document.getElementById('settings_modal') : document.body);
    };
    r.onerror = () => avisar('No se pudo leer el archivo', 'err');
    r.readAsText(file);
  };
})();
