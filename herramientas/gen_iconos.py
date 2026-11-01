# -*- coding: utf-8 -*-
"""Saca los iconos de instalación a partir del icono de la app
(Bone_Chill_Icon.webp, la mano esquelética, 144×144 con fondo transparente).

El .webp se usa tal cual como favicon. Pero al instalar la app hacen falta
PNG opacos de 192 y 512 px: iOS no admite WebP como icono de inicio y pinta en
negro lo transparente, y Android recorta los iconos «maskable» en círculo, así
que la figura va centrada con margen sobre el fondo del tema Cripta.

Si cambias el icono, vuelve a ejecutar esto y sube CACHE_VERSION (sw.js).
Necesita Pillow.   Uso: python herramientas/gen_iconos.py
"""
import os
from PIL import Image, ImageDraw, ImageFilter
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGEN = os.path.join(RAIZ, 'Bone_Chill_Icon.webp')
FONDO, HALO = (6, 8, 10), (20, 46, 38)
OCUPA = 0.66        # parte del lienzo que ocupa la figura (zona segura de «maskable»)

mano = Image.open(ORIGEN).convert('RGBA')
for n in (192, 512):
    lienzo = Image.new('RGB', (n, n), FONDO)
    # un resplandor frío y suave detrás, para que no flote sobre un negro plano
    luz = Image.new('L', (n, n), 0)
    ImageDraw.Draw(luz).ellipse([n * .2, n * .2, n * .8, n * .8], fill=170)
    luz = luz.filter(ImageFilter.GaussianBlur(n * .13))
    lienzo = Image.composite(Image.new('RGB', (n, n), HALO), lienzo, luz)
    lado = round(n * OCUPA)
    figura = mano.resize((lado, lado), Image.LANCZOS)
    pos = ((n - lado) // 2, (n - lado) // 2)
    lienzo.paste(figura, pos, figura)
    lienzo.save(os.path.join(RAIZ, f'icono-{n}.png'), optimize=True)
    print('icono', n)
