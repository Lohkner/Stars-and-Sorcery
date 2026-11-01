# -*- coding: utf-8 -*-
"""Deja en CRLF los archivos de texto del proyecto, como los de S&S Companion.
Uso: python herramientas/crlf.py"""
import os
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIN = {'README.md', 'ui-dialogs.js', 'LICENSE'}
n = 0
for raiz, dirs, files in os.walk(RAIZ):
    dirs[:] = [d for d in dirs if d not in ('.claude', 'fonts', '.git', 'herramientas')]
    for f in files:
        if f in SIN or not f.endswith(('.js', '.css', '.html', '.json')):
            continue
        p = os.path.join(raiz, f)
        b = open(p, 'rb').read()
        c = b.replace(b'\r\n', b'\n').replace(b'\n', b'\r\n')
        if c != b:
            open(p, 'wb').write(c)
            n += 1
print('convertidos a CRLF:', n)
