// ── Boot sequence ──────────────────────────────────────────
// Single entry point. Uses addEventListener (not assignment) so it
// never conflicts with other listeners and never misses an already-
// fired 'load' event (readyState guard handles that case).
(function boot() {
  function dismissLoader() {
    const l = document.getElementById('ss-loader');
    if (!l) return;
    l.classList.add('fade-out');
    setTimeout(() => { if (l.parentNode) l.parentNode.removeChild(l); }, TIMING.LOADER_DISMISS * 2);
  }

  function startApp() {
    try {
      app.init();
    } catch(err) {
      console.error('S&S init error:', err);
    }
    // Dismiss loader after init — short delay so first paint is ready
    setTimeout(dismissLoader, TIMING.LOADER_DISMISS);
  }

  // Register SW independently (non-blocking, no relation to app init).
  // Update-aware: when a new SW takes control, prompt the user to reload so
  // they actually receive the latest version instead of a stale cache.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
      // Muestra el aviso de actualización. El reload NO se hace aquí: al
      // aceptar, SKIP_WAITING activa el SW nuevo y es controllerchange
      // (abajo) quien recarga — sin carrera con la activación.
      const promptUpdate = (worker) => {
        const show = () => {
          try {
            app.toast('Nueva versión disponible — toca para actualizar', 'info', () => {
              // Si se apilaron varias actualizaciones, el waiting VIGENTE puede
              // ser más nuevo que el worker capturado al mostrar el aviso.
              const target = reg.waiting || worker;
              target.postMessage && target.postMessage({ type: 'SKIP_WAITING' });
              // Respaldo por si controllerchange no recarga
              setTimeout(() => location.reload(), 1600);
            }, { sticky: true });
          } catch(e) { /* toast may not support action; ignore */ }
        };
        // app.toast necesita el DOM listo (contenedores de toast)
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', show, { once: true });
        } else show();
      };
      // Caso 1: el SW nuevo quedó EN ESPERA en una visita anterior.
      // updatefound ya no se dispara para él, así que sin esta comprobación
      // el aviso no vuelve a aparecer nunca y la app queda en la versión vieja.
      // reg.waiting puede tardar en poblarse tras resolver register() (carrera
      // observada en Chromium), así que se comprueba en tres momentos; el
      // dedupe de app.toast evita avisos duplicados.
      const checkWaiting = () => {
        if (reg.waiting && navigator.serviceWorker.controller) promptUpdate(reg.waiting);
      };
      checkWaiting();
      navigator.serviceWorker.ready.then(checkWaiting).catch(() => {});
      setTimeout(checkWaiting, 3000);
      // Caso 2: la actualización se encuentra durante esta visita.
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          // Installed + an existing controller means this is an UPDATE, not first install.
          if (nw.state === 'installed' && navigator.serviceWorker.controller) promptUpdate(nw);
        });
      });
      // Check for updates each launch, al volver a la app y cada 30 min.
      reg.update && reg.update();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update && reg.update().catch(() => {});
      });
      setInterval(() => { reg.update && reg.update().catch(() => {}); }, 30 * 60 * 1000);
    }).catch(() => {});

    // When the controlling worker changes, reload once to pick up new assets.
    // BUT only for genuine UPDATES: on the very first visit the page starts
    // uncontrolled and the SW's clients.claim() fires controllerchange once —
    // reloading there just replays the loading screen (doble pantalla de carga).
    // Capturing whether a controller already existed lets us skip that case.
    const hadController = !!navigator.serviceWorker.controller;
    let _reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return;            // first-install claim → no reload
      if (_reloaded) return; _reloaded = true; location.reload();
    });
  }

  // Fire as soon as DOM is ready — app needs DOM only, not external resources
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp, { once: true });
  } else {
    // 'interactive' or 'complete' — DOM already parsed
    setTimeout(startApp, 0);
  }

  // Safety net: if something hangs, dismiss loader after 5s regardless
  setTimeout(dismissLoader, TIMING.LOADER_TIMEOUT);
})();
