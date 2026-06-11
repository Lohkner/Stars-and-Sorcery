const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');
const dom = new JSDOM(html, {
  url: 'https://localhost/',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
});
const { window } = dom;
window.navigator.vibrate = () => true;
// jsdom no expone structuredClone en el contexto window (los navegadores sí desde 2022)
window.structuredClone = (o) => JSON.parse(JSON.stringify(o));

// Load scripts in declared order (defer semantics). Se concatenan porque
// window.eval no comparte const/let entre llamadas (a diferencia del navegador,
// donde los scripts clásicos comparten el entorno léxico global).
const code = ['js/data.js','js/constants.js','js/storage.js','js/ui-dialogs.js','js/app.js','js/boot.js']
  .map(f => fs.readFileSync(f, 'utf-8')).join('\n;\n');
window.eval(code + '\n;window.__app = app; window.__STORAGE = STORAGE;');
const { document } = window;
const app = window.__app;
const results = [];
const t = (name, fn) => { try { fn(); results.push('✓ ' + name); } catch (e) { results.push('✗ ' + name + ' — ' + e.message); } };

t('app.init() arranca sin errores', () => app.init());
t('Home screen renderiza roster', () => { if (!document.getElementById('home-roster')) throw new Error('no roster'); });
t('newChar() abre la hoja', () => { app.newChar(); if (document.getElementById('app-screen').classList.contains('hidden')) throw new Error('app-screen oculto'); });
t('calc() funciona', () => app.calc());
t('Selects de identidad poblados', () => { if (document.getElementById('sel_arq').options.length < 2) throw new Error('sel_arq vacío'); });
t('randomize() genera personaje completo', () => { app.randomize(); if (!document.getElementById('char_name').value) throw new Error('sin nombre'); });

// ── Test crítico: guardar → confirmar sobreescritura sin ghost-click ──
t('saveChar() guarda personaje nuevo', () => {
  app.saveChar();
  const roster = window.__STORAGE.loadRoster();
  if (!Object.keys(roster).length) throw new Error('roster vacío tras guardar');
});
t('saveChar() de nuevo abre diálogo de confirmación (UI.confirm)', () => {
  app.saveChar();
  if (!document.querySelector('.ui-confirm-overlay')) throw new Error('no apareció el diálogo');
  if (!document.querySelector('.ui-confirm-btn.ok')) throw new Error('sin botón OK');
});
t('Escudo activo: click externo durante el diálogo NO llega a la página', () => {
  let leaked = false;
  const back = document.querySelector('.app-hdr-save');
  back.addEventListener('click', () => { leaked = true; });
  back.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  if (leaked) throw new Error('el click traspasó al fondo');
});
t('Confirmar ejecuta onConfirm UNA sola vez y cierra', () => {
  const ok = document.querySelector('.ui-confirm-btn.ok');
  ok.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  ok.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true })); // doble disparo simulado
  if (!document.querySelector('.ui-confirm-overlay').classList.contains('closing')) throw new Error('no cerró');
});
// avanzar timers reales un poco
setTimeout(() => {
  t('Escudo sigue absorbiendo el click fantasma post-cierre (ventana 450ms)', () => {
    let leaked = false;
    const back = document.querySelector('.app-hdr-save');
    const h = () => { leaked = true; };
    back.addEventListener('click', h);
    back.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    back.removeEventListener('click', h);
    if (leaked) throw new Error('el click fantasma traspasó');
  });
  setTimeout(() => {
    t('Tras la ventana, la página vuelve a ser interactiva', () => {
      let received = false;
      const back = document.querySelector('.app-hdr-save');
      const h = () => { received = true; };
      back.addEventListener('click', h);
      back.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
      back.removeEventListener('click', h);
      if (!received) throw new Error('la página quedó bloqueada');
    });
    t('rollDice() funciona', () => app.rollDice('1d20+3', 'Prueba'));
    t('Inventario: addFromDB', () => { app.updateDbSelect(); app.addFromDB(); if (!app.inventory.length) throw new Error('inventario vacío'); });
    t('exportJSON genera datos válidos', () => { const d = app.gatherCharData(); JSON.parse(JSON.stringify(d)); if (!d.inputs) throw new Error('sin inputs'); });
    console.log(results.join('\n'));
    const fails = results.filter(r => r.startsWith('✗'));
    process.exit(fails.length ? 1 : 0);
  }, 500);
}, 200);
