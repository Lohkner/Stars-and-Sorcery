# -*- coding: utf-8 -*-
"""Receta anti-caché para probar en local: genera _verify.html, una copia de
index.html con ?nc=<marca de tiempo> en cada js y css. Tras dar de baja el
service worker y borrar las cachés, navega a _verify.html?v=<algo único>.
Bórralo al terminar: no se publica.
Uso: python herramientas/verify.py"""
import io, os, re, time
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = io.open(os.path.join(RAIZ, 'index.html'), encoding='utf-8', newline='').read()
ts = str(int(time.time()))
s = re.sub(r'(src="js/[^"]+\.js)"', r'\1?nc=' + ts + '"', s)
s = re.sub(r'(href="css/[^"]+\.css)"', r'\1?nc=' + ts + '"', s)
io.open(os.path.join(RAIZ, '_verify.html'), 'w', encoding='utf-8', newline='').write(s)
print(ts)
