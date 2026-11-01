# -*- coding: utf-8 -*-
"""Identidad de color de S&S Director.

Hace dos cosas, las dos repetibles sin riesgo:

 1. Tematiza css/main.css (la hoja heredada de S&S Companion): cambia los
    dorados, morados y marrones escritos a mano —rgba(200,169,110,…),
    #0a0810…— por variables, para que un tema los pueda redefinir. Si ya
    está hecho, no encuentra nada que cambiar.
 2. Genera css/temas.css con las tres paletas de abajo. Para retocar un
    color, cámbialo aquí y vuelve a ejecutar.

Uso: python herramientas/gen_temas.py     (y después sube CACHE_VERSION)

Las letras NO se tocan: son las de Companion (Moderno y Clásico).
"""
import io, os, re, urllib.parse
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAIN = os.path.join(RAIZ, 'css', 'main.css')
OUT = os.path.join(RAIZ, 'css', 'temas.css')

# ── Paletas ─────────────────────────────────────────────────────
# «gold» conserva el nombre heredado: es el metal de acento de cada tema
# (hueso viejo, hierro al rojo, verde cadavérico).
TEMAS = {
    'cripta': dict(   # tumbas: pizarra fría, hueso viejo, cardenillo
        nombre='Cripta',
        void='#06080a', deep='#090b0e', surface='#0f1317', raised='#161b21', panel='#1d242b', rim='#29323b', border='#37424d',
        muted='#87919b', dim='#9ba4ac', text='#cfd0c6', bright='#ecebe0',
        gold='#c2bb9c', goldb='#e3ddc2',
        crimson='#4a1c22', blood='#dd8f94', blood_fill='#a8474f', ember='#cf7d3c', ice='#6f9bb5', sage='#5fa38f',
        metal=('#efead4', '#c2bb9c', '#7d7965', '#e3ddc2'),      # filo de las medallas
        medalla=('#1c2026', '#12151a'),                           # relleno de las medallas
        joya='#5fa38f', engaste=('#e4e2d6', '#a3a497', '#565a52', '#1e2422'),
        pv_bar='#5fa38f', pv_bar_ink='#93cdb9', pv='#a8474f', pv_ink='#e3a3a7',
        tipos=('#cfc8a8', '#7fc3ad', '#d99a6a', '#a9b4d6'), amber='#c9a96a',
    ),
    'forja': dict(    # forjas: hollín, hierro al rojo, acero templado
        nombre='Forja',
        void='#070504', deep='#0b0807', surface='#130e0b', raised='#1b1410', panel='#241a14', rim='#33251c', border='#453327',
        muted='#a08a76', dim='#b39d88', text='#e0d2c0', bright='#f6ecdc',
        gold='#e07b2a', goldb='#f5a54a',
        crimson='#5a1a0c', blood='#ec8c80', blood_fill='#c0402c', ember='#ee5a2c', ice='#7aa2b6', sage='#86ac66',
        metal=('#ffcf94', '#e07b2a', '#7a3a12', '#f5a54a'),
        medalla=('#231710', '#150d08'),
        joya='#ee5a2c', engaste=('#b9aa9a', '#7c6c5e', '#3d3129', '#1a120d'),
        pv_bar='#86ac66', pv_bar_ink='#b2d294', pv='#c0402c', pv_ink='#f0a094',
        tipos=('#f0b878', '#9cc487', '#f08a5a', '#c3a6e0'), amber='#e8a84e',
    ),
    'muerte': dict(   # muerte viviente: carne verdosa, palidez, sangre seca
        nombre='Muerte viviente',
        void='#050706', deep='#080b09', surface='#0d120e', raised='#141b15', panel='#1b241c', rim='#263428', border='#344636',
        muted='#87957f', dim='#9aa892', text='#cbd3bf', bright='#e9efdc',
        gold='#9ccc5a', goldb='#c2e67e',
        crimson='#4a1414', blood='#e3918b', blood_fill='#9c3a3a', ember='#cf763c', ice='#6aa7a0', sage='#6fb37a',
        metal=('#e2f4ae', '#9ccc5a', '#4f6e2a', '#c2e67e'),
        medalla=('#172016', '#0e150e'),
        joya='#9ccc5a', engaste=('#ebe6cf', '#b9b08f', '#6e684f', '#22241a'),
        pv_bar='#a8433f', pv_bar_ink='#e8a09a', pv='#9c3a3a', pv_ink='#e8a09a',
        tipos=('#c9d98e', '#7fc3a0', '#e09a62', '#b3a8de'), amber='#cdb45e',
    ),
}
PREDETERMINADO = 'cripta'

# El emblema del retrato vacío (dibujo de Companion); %COLOR% es el metal del tema.
EMBLEMA = """data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='%COLOR%'%3E%3Ccircle cx='50' cy='50' r='44' stroke-opacity='.35' stroke-width='.8'/%3E%3Ccircle cx='50' cy='50' r='39' stroke-opacity='.22' stroke-width='.6' stroke-dasharray='1.5 3'/%3E%3Cpath d='M50 28 65.5 34.5 72 50 65.5 65.5 50 72 34.5 65.5 28 50 34.5 34.5Z' stroke-opacity='.3' stroke-width='.7'/%3E%3Cpath d='M50 12 58.5 41.5 88 50 58.5 58.5 50 88 41.5 58.5 12 50 41.5 41.5Z' stroke-opacity='.8' stroke-width='1.1' fill='%COLOR%' fill-opacity='.07'/%3E%3Ccircle cx='50' cy='50' r='3.5' fill='%COLOR%' fill-opacity='.75' stroke='none'/%3E%3C/svg%3E"""


def rgb(h):
    h = h.lstrip('#')
    return ','.join(str(int(h[i:i + 2], 16)) for i in (0, 2, 4))


def mezcla(h, k):
    """Oscurece un color: k=0.9 deja el 90 %."""
    h = h.lstrip('#')
    return '#' + ''.join('%02x' % round(int(h[i:i + 2], 16) * k) for i in (0, 2, 4))


def joya_svg(t):
    """La gema de las tarjetas plegables: mismo dibujo que la amatista de
    Companion, con la piedra y el engaste de cada tema."""
    a, b, c, filo = t['engaste']
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 26"><defs><linearGradient id="o" x1="0" y1="0" x2="0" y2="1">'
           f'<stop offset="0" stop-color="{a}"/><stop offset=".5" stop-color="{b}"/><stop offset="1" stop-color="{c}"/></linearGradient></defs>'
           f'<polygon points="10,0 20,13 10,26 0,13" fill="url(#o)" stroke="{filo}" stroke-width=".8"/>'
           '<polygon points="10,1.6 18.4,13 10,24.4 1.6,13" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width=".5"/>'
           '<g transform="translate(.4 3.4) scale(.8)">'
           f'<polygon points="12,1 20.5,12 12,23 3.5,12" fill="{t["joya"]}"/>'
           '<polygon points="12,1 3.5,12 8.4,12 12,6.2" fill="#fff" opacity=".45"/>'
           '<polygon points="12,1 20.5,12 15.6,12 12,6.2" fill="#fff" opacity=".15"/>'
           '<polygon points="20.5,12 12,23 12,17.8 15.6,12" fill="#000" opacity=".4"/>'
           '<polygon points="3.5,12 12,23 12,17.8 8.4,12" fill="#000" opacity=".2"/>'
           '<polygon points="12,6.2 15.6,12 12,17.8 8.4,12" fill="#fff" opacity=".12" stroke="#fff" stroke-opacity=".35" stroke-width=".5"/>'
           '<polygon points="12,1 20.5,12 12,23 3.5,12" fill="none" stroke="#000" stroke-opacity=".45" stroke-width=".8"/>'
           '<path d="M7.2 9.6 9.8 5.8" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".85"/></g></svg>')
    return "url('data:image/svg+xml," + urllib.parse.quote(svg, safe="/:=,. -") .replace("'", '%27') + "')"


def bloque(clave, t):
    sel = (':root,' if clave == PREDETERMINADO else '') + f'[data-theme="{clave}"]'
    m = t['metal']
    L = [f'/* ── {t["nombre"]} ── */', sel + '{']
    for k in ('void', 'deep', 'surface', 'raised', 'panel', 'rim', 'border', 'muted', 'dim', 'text', 'bright', 'gold', 'goldb',
              'crimson', 'ember', 'ice', 'sage'):
        L.append(f'  --{k}:{t[k]};')
    L.append(f'  --blood:{t["blood"]}; --blood-fill:{t["blood_fill"]};')
    for k in ('void', 'deep', 'surface', 'raised', 'panel', 'border', 'muted', 'dim', 'gold', 'goldb', 'sage', 'ice'):
        L.append(f'  --{k}-rgb:{rgb(t[k])};')
    L.append(f'  --sangre-rgb:{rgb(t["blood_fill"])}; --joya-rgb:{rgb(t["joya"])};')
    L.append(f'  --edge-soft:rgba({rgb(t["border"])},.3); --edge:rgba({rgb(t["border"])},.5); --edge-strong:rgba({rgb(t["border"])},.7);')
    L.append(f'  --edge-gold:rgba({rgb(t["gold"])},.4); --edge-gold-strong:rgba({rgb(t["gold"])},.55);')
    L.append(f'  --oro-metal:linear-gradient(140deg,{m[0]} 0%,{m[1]} 38%,{m[2]} 62%,{m[3]} 100%);')
    L.append('  --oro-metal-90:linear-gradient(140deg,' + ','.join(f'{mezcla(c, .9)} {p}' for c, p in zip(m, ('0%', '38%', '62%', '100%'))) + ');')
    L.append(f'  --oro-suave:linear-gradient(140deg,{mezcla(m[0], .82)} 0%,{mezcla(m[1], .88)} 38%,{m[2]} 62%,{mezcla(m[3], .85)} 100%);')
    L.append(f'  --medalla-a:{t["medalla"][0]}; --medalla-b:{t["medalla"][1]};')
    L.append(f'  --medalla-a-rgb:{rgb(t["medalla"][0])}; --medalla-b-rgb:{rgb(t["medalla"][1])};')
    L.append(f'  --joya-img:{joya_svg(t)};')
    L.append('  --emblema-img:url("' + EMBLEMA.replace('%COLOR%', '%23' + t['gold'].lstrip('#')) + '");')
    L.append(f'  --card-ink:{t["surface"]};')
    L.append(f'  --res-pv:{t["pv"]}; --res-pv-ink:{t["pv_ink"]}; --res-pv-bar:{t["pv_bar"]}; --res-pv-bar-ink:{t["pv_bar_ink"]};')
    tp = t['tipos']
    L.append(f'  --tipo-pasivo:{tp[0]}; --tipo-habilitador:{tp[1]}; --tipo-disparador:{tp[2]}; --tipo-modificador:{tp[3]};')
    L.append(f'  --amber:{t["amber"]};')
    L.append('}')
    return '\n'.join(L)


# ── 1 · tematizar main.css ──────────────────────────────────────
css = io.open(MAIN, encoding='utf-8', newline='').read()
antes = css
RGBA = {
    '200,169,110': 'gold', '224,194,126': 'goldb', '224,192,122': 'goldb', '138,107,53': 'gold', '178,143,90': 'gold',
    '61,50,84': 'border', '5,4,10': 'void', '10,8,16': 'deep', '16,14,24': 'surface', '24,20,34': 'raised',
    '63,160,108': 'sage', '61,143,194': 'ice', '168,42,58': 'sangre', '155,106,214': 'joya',
    '8,6,14': 'deep', '7,5,12': 'void', '3,2,8': 'void', '30,24,44': 'panel', '22,18,32': 'raised', '20,17,30': 'raised',
    '19,16,29': 'raised', '158,141,182': 'dim', '138,122,158': 'muted', '122,106,146': 'muted',
    '38,31,21': 'medalla-a', '40,32,21': 'medalla-a', '23,19,13': 'medalla-b', '21,17,11': 'medalla-b',
}
for k, v in RGBA.items():
    css = css.replace(f'rgba({k},', f'rgba(var(--{v}-rgb),')
HEX = {'#0a0810': 'deep', '#100e18': 'surface', '#07060a': 'void', '#3d3254': 'border', '#2e2540': 'rim',
       '#1e1a12': 'medalla-a', '#131008': 'medalla-b'}
lineas = css.split('\n')
for i, ln in enumerate(lineas):
    if re.match(r'\s*--[a-z-]+\s*:', ln) and '{' not in ln:      # una definición de token: no se toca
        continue
    if '[data-theme=' in ln:
        continue
    for h, v in HEX.items():
        ln = re.sub(re.escape(h) + r'\b', f'var(--{v})', ln, flags=re.I)
    lineas[i] = ln
css = '\n'.join(lineas)
# La amatista de las tarjetas plegables pasa a ser la gema del tema
css = re.sub(r"background:url\('data:image/svg\+xml,%3Csvg xmlns=\"http://www\.w3\.org/2000/svg\" viewBox=\"0 0 20 26\"[^']*'\)",
             'background:var(--joya-img)', css)
# El emblema del retrato vacío, también
css = re.sub(r"""url\("data:image/svg\+xml,%3Csvg xmlns='http://www\.w3\.org/2000/svg' viewBox='0 0 100 100'[^"]+"\)""", 'var(--emblema-img)', css)
# Los filos metálicos escritos a mano usan el metal del tema
css = css.replace('linear-gradient(140deg, #e8cd90 0%, #c9a96f 38%, #8a6b35 62%, #e0c27e 100%) border-box', 'var(--oro-metal) border-box')
css = css.replace('linear-gradient(140deg,#f0d89c 0%,#c9a96f 40%,#7f6231 64%,#e6c985 100%) border-box', 'var(--oro-metal) border-box')
if css != antes:
    io.open(MAIN, 'w', encoding='utf-8', newline='').write(css)
print('main.css:', 'tematizado' if css != antes else 'ya estaba tematizado')

# ── 2 · css/temas.css ───────────────────────────────────────────
cab = '''/* ══════════════════════════════════════════════════════════════
   S&S DIRECTOR — identidad de color. GENERADO por herramientas/gen_temas.py:
   no lo edites a mano; cambia la paleta allí y vuelve a ejecutarlo.

   Tres temas que evocan tumbas, forjas y muerte viviente. Cripta es el
   predeterminado. Las letras son las de S&S Companion, sin cambios.
══════════════════════════════════════════════════════════════ */
'''
pie = '''
/* ── Piezas que en Companion llevaban el oro escrito a mano ─────── */
html,body{background:var(--void)!important}
.port-name,.ibadge,#identity_summary_view .ibadge{color:color-mix(in srgb,var(--goldb) 92%,#000)}
.char-lvl-badge{color:color-mix(in srgb,var(--gold) 92%,#000)}
.js-grade-block.grade-on{color:var(--text)}
::selection{background:rgba(var(--gold-rgb),.22)}
'''
cuerpo = '\n\n'.join(bloque(k, t) for k, t in TEMAS.items())
io.open(OUT, 'w', encoding='utf-8', newline='\r\n').write(cab + cuerpo + '\n' + pie)
print('temas.css:', ', '.join(TEMAS))
