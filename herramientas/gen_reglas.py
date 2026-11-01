# -*- coding: utf-8 -*-
"""Genera js/reglas.js (DEFAULT_DB de S&S Director) a partir de los manuales
de Stars & Sorcery en .docx: el Manual de Monstruos y la Guía del Director.

Uso (desde la carpeta del proyecto):
    python herramientas/gen_reglas.py
    python herramientas/gen_reglas.py <carpeta con los docx>

Después de regenerar: sube STORAGE.RULES_DATA_VERSION (js/storage.js) y
CACHE_VERSION (sw.js), y pasa el autodiagnóstico (?check=1): comprueba que las
criaturas del bestiario siguen saliendo de las fórmulas y caben en su Potencial.

Los docx no se abren en su sitio (OneDrive devuelve PermissionError): se
copian antes a una carpeta temporal. Los iconos de tipo de Talento son
imágenes (t_pasivo.png y compañía), no texto: se convierten en marcadores
como [t_pasivo].
"""
import re, json, sys, os, unicodedata, zipfile, html, shutil, tempfile
sys.stdout.reconfigure(encoding='utf-8')
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FUENTE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.expanduser('~'), 'OneDrive', 'S&S', 'Official')
OUT = os.path.join(RAIZ, 'js', 'reglas.js')


def extraer(nombre):
    """Texto de un docx, línea a línea; las filas de tabla salen como «ROW: | a | b»."""
    tmp = os.path.join(tempfile.mkdtemp(prefix='ssd_'), nombre)
    shutil.copyfile(os.path.join(FUENTE, nombre), tmp)
    with zipfile.ZipFile(tmp) as z:
        x = z.read('word/document.xml').decode('utf-8')
    x = re.sub(r'<w:tab/>', '\t', x)
    x = re.sub(r'<w:drawing>(?:(?!</w:drawing>).)*?name="((?:t|f)_[a-z]+)\.png"(?:(?!</w:drawing>).)*?</w:drawing>',
               lambda m: '<w:t>[' + m.group(1) + ']</w:t>', x, flags=re.S)
    out = []
    for para in re.findall(r'<w:p[ >].*?</w:p>|<w:tr[ >]|</w:tr>|<w:tc[ >]', x, flags=re.S):
        if para.startswith('<w:tr'):
            out.append('[TR]'); continue
        if para == '</w:tr>':
            out.append('[/TR]'); continue
        if para.startswith('<w:tc'):
            out.append('|'); continue
        estilo = re.search(r'<w:pStyle w:val="([^"]+)"', para)
        t = html.unescape(''.join(a or b for a, b in re.findall(r'<w:t(?: [^>]*)?>([^<]*)</w:t>|(\t)', para)))
        if t.strip():
            pre = '#' + estilo.group(1) + ' ' if estilo and re.match(r'(Heading|Ttulo|Title)', estilo.group(1)) else ''
            out.append(pre + t)
    txt = '\n'.join(out)
    txt = re.sub(r'\[TR\]\n?(.*?)\n?\[/TR\]', lambda m: 'ROW: ' + ' '.join(m.group(1).split('\n')), txt, flags=re.S)
    return txt.split('\n')


M = extraer('Stars_and_Sorcery_Manual_de_Monstruos_v1.docx')
G = extraer('Stars_and_Sorcery_Guia_del_Director_v1.docx')
MB = extraer('Stars_and_Sorcery_Manual_Basico_v1.docx')
# Las piezas del bestiario (Rasgos separados) salen de una copia fija: ver
# la cabecera de herramientas/bestiario_piezas.txt
with open(os.path.join(RAIZ, 'herramientas', 'bestiario_piezas.txt'), encoding='utf-8') as f:
    BP = [l for l in f.read().split('\n') if not l.startswith('# ')]


def slug(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', '_', s).strip('_')


def cells(row):
    assert row.startswith('ROW: |'), row
    return [c.strip() for c in row[len('ROW: |'):].split(' | ')]


def find(L, text, start=0, exact=False):
    for i in range(start, len(L)):
        if (L[i] == text) if exact else (text in L[i]):
            return i
    raise KeyError(text)


def rows_from(L, i):
    """Filas ROW consecutivas a partir de la primera que haya desde i."""
    while not L[i].startswith('ROW: |'):
        i += 1
    out = []
    while i < len(L) and L[i].startswith('ROW: |'):
        c = cells(L[i]); i += 1
        if c == ['Ilustración']: break
        out.append(c)
    return out, i


def num(s):
    return int(s.replace('+', '').replace('−', '-').replace('.', ''))


# ───────────────────────── Tabla por NA ─────────────────────────
# El «Potencial» del Manual (antes «Peso») se guarda en el campo `peso`: es el
# mismo dato con otro nombre, y así las amenazas guardadas siguen valiendo.
ATR = ['FUE', 'DES', 'CON', 'INT', 'SAB', 'CAR']
i = find(M, '#Heading2 Valores por Nivel de Amenaza')
rows, _ = rows_from(M, i)
assert rows[0] == ['NA', 'PB', 'Fuerte', 'Normal', 'Débil', 'Dado de daño', 'Armadura', 'PA', 'Potencial'], rows[0]
NA = {}
for r in rows[1:]:
    na, pb, fuerte, normal, debil, dano, arm, pa, pot = r
    md = re.match(r'(\d+d\d+)(?: \(([+−]\d+)\))?$', dano)
    assert md, dano
    NA[na] = {'name': 'NA ' + na, 'pb': num(pb), 'fuerte': num(fuerte), 'normal': num(normal), 'debil': num(debil),
              'dano': md.group(1), 'ajuste': num(md.group(2)) if md.group(2) else 0, 'a': int(arm), 'pa': int(pa), 'peso': int(pot)}
assert len(NA) == 16
ETIQ_NA = {'0': 'Civil', '1': 'Novato', '3': 'Veterano', '10': 'Élite', '12': 'Legendario'}
for k, v in ETIQ_NA.items():
    NA[k]['etiqueta'] = v
# Las fórmulas del Cap. 1 van en el código (js/amenaza.js → calcCr). Si el Manual
# las cambia, esto avisa antes de generar nada.
for frase in ['ROW: | Ataque | PB + el mayor de FUE o DES; a distancia, DES',
              'ROW: | Guardia | 10 + PB + MOD DES',
              'ROW: | Daño por turno | Dado de daño de su NA + su ajuste + el MOD con el que ataca',
              'ROW: | PV | (20 + NA × (8 + MOD CON)) × 1,5, redondeando hacia abajo',
              'ROW: | Salvaciones | MOD + ½ NA; en sus atributos Fuertes, MOD + PB (dos; tres en un dragón)',
              'ROW: | Resiste casi todo el daño del grupo (Enjambre, Incorpórea…) y el grupo no tiene cómo evitarlo | +1',
              'Con 4 PA o más son dos Ataques Normales: reparte los dados entre los dos, y el primero lleva el impar',
              'Un Arrollador Grande o mayor tiene al menos 4 PA desde NA 5',
              'ROW: | CD | 8 + PB + ½ NA + el MOD de su atributo Fuerte más alto',
              'ROW: | Iniciativa | MOD DES',
              'ROW: | Moral | 10 + NA',
              'Una criatura de NA 0 tiene 1–4 PV']:
    find(M, frase)

# «Valores listos por NA» (Cap. 4, construcción rápida) sale de esas mismas
# fórmulas: si no cuadra, el Manual ha cambiado una de las dos cosas.
def _sg(n):
    return ('+' if n >= 0 else '−') + str(abs(n))


def _dano(d, b):
    return d + ('' if b == 0 else _sg(b))


i = find(M, '#Heading2 Valores listos por NA', exact=True)
rows, _ = rows_from(M, i)
VL = 0
for r in rows:
    if r[0] == 'NA':
        cab = r[1]; continue
    B = NA[r[0]]; n = int(r[0]); pb, F, N, D = B['pb'], B['fuerte'], B['normal'], B['debil']
    if cab.startswith('Ataque'):
        esperado = [_sg(pb + F) + '/' + _sg(pb + N), _dano(B['dano'], B['ajuste'] + F) + '/' + _dano(B['dano'], B['ajuste'] + N),
                    '/'.join(str(10 + pb + x) for x in (F, N, D)), str(B['a']), str(B['pa'])]
    else:
        pv = '1–4/1–4/1–4' if n == 0 else '/'.join(str((20 + n * (8 + x)) * 3 // 2) for x in (F, N, D))
        esperado = [pv, str(8 + pb + n // 2 + F), '/'.join(_sg(x) for x in (F + pb, N + n // 2, D + n // 2)), str(10 + n)]
    assert r[1:] == esperado, ('Valores listos', r, esperado)
    VL += 1
assert VL == 32, VL

# ───────────────────────── Roles ─────────────────────────
i = find(M, '#Heading2 Roles', exact=True)
rows, _ = rows_from(M, i)
assert rows[0] == ['Rol', 'Clave', 'Débil', 'Ajuste', 'Habilidad de Rol'], rows[0]
ROL_HAB = {  # nombre de la habilidad, tipo y coste (el texto sale de la tabla)
    'arrollador': ('Ataque Masivo', 'Modificador', '1/ronda'), 'hostigador': ('Flanqueo', 'Rasgo', ''),
    'represor': ('Represión', 'Aptitud', '3 PA · 1/ronda'), 'comandante': ('Aura de Mando', 'Aura', ''),
    'soporte': ('Restaurar', 'Aptitud', '2 PA'), 'explorador': ('Primero en Llegar', 'Rasgo', ''),
    'artillero': ('Posición', 'Rasgo', ''), 'acechador': ('Primer Golpe', 'Modificador', ''),
    'guardian': ('Custodia', 'Reacción', ''), 'esbirro': ('Esbirro', 'Rasgo', ''),
}


def lista_atr(txt):
    out = re.findall(r'\b(FUE|DES|CON|INT|SAB|CAR)\b', txt)
    return out


def ajuste_rol(txt):
    """«+1d6 al daño», «+15 pies · Iniciativa +4», «+1 Armadura · −10 pies», «PV = NA × 2»."""
    e = {}
    for trozo in [t.strip() for t in txt.split('·')]:
        if trozo in ('—', ''): continue
        m = re.match(r'\+(\d+)d6 al daño$', trozo)
        if m: e['danoDados'] = int(m.group(1)); continue
        m = re.match(r'([+−]\d+) pies$', trozo)
        if m: e['vel'] = num(m.group(1)); continue
        m = re.match(r'Iniciativa ([+−]\d+)$', trozo)
        if m: e['ini'] = num(m.group(1)); continue
        m = re.match(r'([+−]\d+) Armadura$', trozo)
        if m: e['a'] = num(m.group(1)); continue
        if trozo.startswith('PV = NA × 2'): e['esbirro'] = True; continue
        raise ValueError('ajuste de Rol desconocido: ' + trozo)
    return e


# El atributo clave del Rol sustituye, si el tipo no lo tiene, al Fuerte que
# «menos encaje con su táctica». El Manual no dice cuál: la app conserva el
# que pide la táctica del Rol (los dos Fuertes que tenía cada Rol hasta el
# 20-10-2026) y cambia el otro. El Director puede cambiarlo a mano.
ROL_AFIN = {'arrollador': ['FUE', 'CON'], 'hostigador': ['DES', 'FUE'], 'represor': ['INT', 'SAB'],
            'comandante': ['CAR', 'FUE'], 'soporte': ['SAB', 'CAR'], 'explorador': ['DES', 'SAB'],
            'artillero': ['DES', 'SAB'], 'acechador': ['DES', 'FUE'], 'guardian': ['CON', 'FUE'], 'esbirro': []}
# Claves alternativas que el Manual permite (párrafo bajo la tabla de Roles)
find(M, 'Un Represor puede tomar CAR como clave en lugar de INT o SAB (una bruja que maldice), y un Artillero con armas pesadas, FUE en lugar de DES.')
ROL_CLAVE_ALT = {'represor': ['CAR'], 'artillero': ['FUE']}
ROLES = {}
for nombre, clave, debil, ajuste, hab in rows[1:]:
    k = slug(nombre)
    hn, ht, hc = ROL_HAB[k]
    txt = re.sub(r'^[^:]{3,22}(?:\s*\([^)]*\))?:\s*', '', hab) if k not in ('explorador', 'esbirro') else hab
    txt = txt[0].upper() + txt[1:]
    f, d = lista_atr(clave), lista_atr(debil)
    assert len(f) in (1, 2) or clave == 'Los del tipo', (nombre, clave)
    alt = ROL_CLAVE_ALT.get(k, [])
    partes = ['Clave: ' + (' o '.join(f) + (' (o ' + ', '.join(alt) + ')' if alt else '') if f else 'los Fuertes del tipo')]
    if d: partes.append('Débil: ' + ', '.join(d))
    if ajuste != '—': partes.append(ajuste)
    e = {'name': nombre, 'mod': ' · '.join(partes), 'clave': f, 'claveAlt': alt, 'afin': ROL_AFIN[k], 'debiles': d,
         'hab': hn, 'habTipo': ht, 'habCoste': hc, 'habTxt': txt}
    e.update(ajuste_rol(ajuste))
    ROLES[k] = e
assert len(ROLES) == 10 and ROLES['esbirro'].get('esbirro'), list(ROLES)
ROLES['esbirro']['habTxt'] = 'Cae con cualquier golpe que le quite sus PV. Sin más Rasgos que los de su tipo y su Rasgo de especie gratuito. No tira Moral: huye cuando cae su líder o la mitad de su grupo. Todos los esbirros de un mismo tipo actúan en la misma Iniciativa.'

# ───────────────────────── Tamaños ─────────────────────────
i = find(M, '#Heading2 Tamaño', exact=True)
rows, _ = rows_from(M, i)
assert rows[0] == ['Tamaño', 'Ejemplos', 'FUE', 'DES', 'CON', 'Alcance y espacio'], rows[0]


def ajuste_tam(x):
    """«+1», «−1», «—» o «Débil» (el atributo pasa a ser Débil, sea cual sea)."""
    return 'D' if x == 'Débil' else 0 if x == '—' else num(x)


TAM = {}
for nombre, ej, fue, des, con, alc in rows[1:]:
    alcance, espacio = [x.strip() for x in alc.split(' · ')]
    e = {'name': nombre, 'ej': ej, 'fue': ajuste_tam(fue), 'des': ajuste_tam(des), 'con': ajuste_tam(con),
         'atrTxt': f'FUE {fue} · DES {des} · CON {con}', 'alcance': alcance, 'espacio': espacio}
    TAM[slug(nombre)] = e
# «Una criatura Enorme o Colosal suma +1 a su NA de encuentro (Cap. 4).»
find(M, 'Una criatura Enorme o Colosal suma +1 a su NA de encuentro')
TAM['enorme']['naEnc'] = 1
TAM['colosal']['naEnc'] = 1

# ───────────────────────── Hordas ─────────────────────────
i = find(M, 'ROW: | Tamaño de la horda | Miembros | NA efectivo')
rows, _ = rows_from(M, i)
HORDAS = {}
for nombre, miembros, naef in rows[1:]:
    nums = [int(x) for x in re.findall(r'\d+', miembros)]
    m = re.match(r'NA del miembro \+ (\d+)$', naef)
    e = {'name': nombre, 'min': nums[0], 'max': nums[1] if len(nums) > 1 else 999, 'txt': naef}
    if m: e['na'] = int(m.group(1))
    else: e['marea'] = True
    HORDAS[slug(nombre)] = e
assert [h.get('na') for h in HORDAS.values()] == [2, 4, 6, None], HORDAS
find(M, 'se divide en dos hordas de NA efectivo 2 puntos menor')

# ───────────────────────── Biblioteca ─────────────────────────
FAM_KEYS = ['ataque', 'defensa', 'movilidad', 'sentidos', 'control', 'mente', 'vitalidad', 'elementos',
            'sobrenatural', 'manada', 'sigilo', 'forma', 'tecnologia', 'mando', 'guarida', 'debilidades']
MODS = {
    'piel_gruesa': {'a': 2}, 'caparazon': {'a': 3, 'vel': -10}, 'evasiva': {'g': 2}, 'veloz': {'vel': 20},
    'varias_cabezas': {'pa': 1}, 'lenta': {'vel': -10}, 'cobarde': {'moral': -4}, 'fragil': {'conDebil': True},
    'sin_rendicion': {'noMoral': True}, 'colmena': {'noMoral': True},
}
MULTI = {'resistencia', 'inmunidad', 'inmunidad_a_estados'}
# Rasgos de especie «de narrativa» (Cap. 2): no gastan Potencial ni tienen límite.
NARRATIVA = {'resurgir', 'pesadillas', 'corrupcion_del_lugar', 'rastro_falso', 'imitacion', 'mente_colmena', 'silenciosa'}
# Aptitudes que hacen daño a varios a la vez (Cap. 4): suben el NA de encuentro.
AREA = {'aliento', 'tormenta_personal', 'andanada', 'ataque_barrido', 'chillido', 'carga_arrolladora'}
PIDE = {
    'resistencia': 'Un tipo físico o dos de energía', 'inmunidad': 'Tipo de daño', 'inmunidad_a_estados': 'Dos estados',
    'vulnerabilidad': 'Tipo de daño', 'aversion': 'Material o símbolo', 'aliento': 'Tipo de energía',
    'regeneracion': 'Daño que la detiene (Fuego, Ácido…)', 'uso_de_axiomas': 'Axiomas que conoce (hasta tres)',
    'trucos': 'Los dos Trucos', 'tentaculos': 'Cuántos (de 2 a 4)', 'absorcion_elemental': 'Tipo de energía',
    'muro_elemental': 'Elemento', 'estallido_al_morir': 'Elemento', 'fundirse_con_el_elemento': 'Elemento',
    'nombre_verdadero': 'El nombre (para el Director)', 'resurgir': 'Su núcleo', 'ligada_al_lugar': 'El lugar',
    'victoria_alternativa': 'La condición', 'maldicion': 'Tipo de tirada', 'proyectiles': 'Qué lanza',
    'cuerpo_hueco': 'Qué lleva dentro', 'nucleo_expuesto': 'Dónde está',
}
i = find(M, '#Heading2 La Biblioteca')
fin = find(M, 'Capítulo 4', i, exact=True)
FAM, RASGOS = {}, {}
fk = iter(FAM_KEYS)
j = i + 1
while j < fin:
    if M[j].startswith('#Heading3 '):
        k = next(fk)
        nombre = M[j][10:]
        desc = M[j + 1]
        rows, j2 = rows_from(M, j + 2)
        FAM[k] = {'name': nombre, 'txt': desc}
        lst = []
        assert rows[0][3] == 'Potencial', rows[0]
        for n, nm, tipo, peso, efecto in rows[1:]:
            partes = [p.strip() for p in tipo.split('·')]
            e = {'id': slug(nm), 'name': nm, 'tipo': partes[0], 'peso': num(peso), 'txt': efecto}
            for p in partes[1:]:
                if re.search(r'PA|fuera de combate', p):
                    e['coste'] = p
                else:
                    e['frec'] = p
            if e['id'] in MODS: e['mod'] = MODS[e['id']]
            if e['id'] in MULTI: e['multi'] = True
            if e['id'] in PIDE: e['pide'] = PIDE[e['id']]
            if e['id'] in NARRATIVA: e['narrativa'] = True
            if e['id'] in AREA: e['area'] = True
            lst.append(e)
        RASGOS[k] = lst
        j = j2
    else:
        j += 1
assert len(RASGOS) == 16, len(RASGOS)
POR_ID = {}
for k, lst in RASGOS.items():
    for e in lst:
        assert e['id'] not in POR_ID, e['id']
        POR_ID[e['id']] = (k, e)
POR_NOMBRE = {e['name']: e for _, e in POR_ID.values()}
print('piezas de biblioteca:', len(POR_ID))
assert NARRATIVA <= set(POR_ID) and AREA <= set(POR_ID), (NARRATIVA - set(POR_ID), AREA - set(POR_ID))
for frase in ['De narrativa. Los que solo actúan fuera del combate o sobre la historia: Resurgir, Pesadillas, Corrupción del Lugar, Rastro Falso, Imitación, Mente Colmena, Silenciosa',
              'si su Potencial no pasa de 1 hasta NA 4, de 2 entre NA 5 y 9, ni de 3 desde NA 10',
              'Tiene una Aptitud que hace daño a varios a la vez | +3 si es de Potencial 3 y +2 si es de menos; en un jefe, uno menos']:
    find(M, frase)

# dado de cada familia en la tabla aleatoria
i = find(M, 'ROW: | d20 | Familia | Dado')
rows, _ = rows_from(M, i)
for (rango, nombre, dado), k in zip(rows[1:], FAM_KEYS):
    FAM[k]['d20'] = rango
    FAM[k]['dado'] = dado.split(' ')[0]

# ───────────────────────── Tipos ─────────────────────────
i = find(M, 'ROW: | Tipo | Fuertes (Salv. buenas) | Rasgos de tipo (gratuitos) | Atributos Débiles | Debilidad coherente')
rows, _ = rows_from(M, i)
TIPO_EXTRA = {
    'bestia': dict(elige=[['olfato_agudo', 'vision_en_la_oscuridad']], fuertesDef=['DES', 'CON']),
    'humanoide': dict(fuertesDef=['FUE', 'CON'], equipo=True),
    'gigante': dict(gratis=[{'id': 'gigantismo'}], fuertesDef=['FUE', 'CON'], tamMin='grande'),
    'monstruosidad': dict(gratisFam={'fam': 'forma', 'peso': 1}, fuertesDef=['FUE', 'CON']),
    'dragon': dict(gratis=[{'id': 'vision_en_la_oscuridad'}, {'id': 'telepatia'}, {'id': 'inmunidad', 'nota': 'su elemento'}],
                   exige=['aliento', 'uso_de_axiomas'], fuertesDef=['FUE', 'CON'], fuerteExtra='INT', alientoGratis=True, tamMin='enorme'),
    'draconido': dict(gratis=[{'id': 'vision_en_la_oscuridad'}, {'id': 'inmunidad', 'nota': 'su elemento'}], exige=['aliento'], fuertesDef=['FUE', 'CON']),
    'no_muerto': dict(gratis=[{'id': 'vigor_inagotable'}, {'id': 'inmunidad_a_estados', 'nota': 'Envenenado y Aterrado'}], fuertesDef=['CON', 'SAB']),
    'espiritu': dict(gratis=[{'id': 'telepatia'}], fuertesDef=['SAB', 'CAR']),
    'constructo': dict(gratis=[{'id': 'vigor_inagotable'}, {'id': 'inmunidad_a_estados', 'nota': 'Envenenado y Encantado'}], fuertesDef=['FUE', 'CON'], noMoral='nunca'),
    'maquina': dict(gratis=[{'id': 'vigor_inagotable'}, {'id': 'sistemas_redundantes'}], fuertesDef=['CON', 'INT'], noMoral='nunca'),
    'elemental': dict(gratis=[{'id': 'inmunidad', 'nota': 'su elemento'}, {'id': 'fundirse_con_el_elemento'}], fuertesDef=['CON', 'FUE']),
    'extraplanar': dict(gratis=[{'id': 'telepatia'}, {'id': 'resistencia', 'nota': 'dos tipos de energía'}], fuertesDef=['CAR', 'SAB']),
    'feerico': dict(gratis=[{'id': 'voluntad_de_hierro'}], exige=['aversion'], fuertesDef=['DES', 'CAR']),
    'aberracion': dict(gratis=[{'id': 'mente_ajena'}, {'id': 'vision_en_la_oscuridad'}], fuertesDef=['CON', 'SAB']),
    'planta_u_hongo': dict(gratis=[{'id': 'inmunidad_a_estados', 'nota': 'Cegado y Ensordecido'}, {'id': 'camuflaje'}], fuertesDef=['CON', 'FUE']),
    'cieno': dict(gratis=[{'id': 'forma_amorfa'}, {'id': 'sentido_sismico'}], fuertesDef=['CON', 'FUE']),
    'mutante': dict(gratisFam={'fam': 'forma'}, fuertesDef=['CON', 'SAB']),
}
T_DEB = {'bestia': ['INT'],
         'humanoide': [],
         'gigante': ['INT'],
         'monstruosidad': ['CAR'],
         'dragon': [],
         'draconido': ['INT', 'CAR'],
         'no_muerto': ['CAR'],
         'espiritu': ['FUE'],
         'constructo': ['INT', 'CAR'],
         'maquina': ['CAR'],
         'elemental': ['INT'],
         'extraplanar': [],
         'feerico': ['FUE'],
         'aberracion': ['FUE'],
         'planta_u_hongo': ['DES', 'INT'],
         'cieno': ['INT', 'CAR'],
         'mutante': []}
TIPOS = {}
for nombre, fuertes_txt, rasgos, atr_deb, deb in rows[1:]:
    k = slug(nombre)
    e = {'name': nombre, 'txt': rasgos, 'fuertesTxt': fuertes_txt, 'atrDeb': atr_deb, 'debiles': T_DEB[k], 'deb': deb}
    # Los Fuertes por defecto (fuertesDef, más fuerteExtra en el dragón) tienen
    # que salir de la columna del Manual: los fijos, tal cual; donde el tipo deja
    # elegir (elemental, extraplanar, humanoide, mutante), uno de los que nombra.
    fijos = lista_atr(fuertes_txt.split('(')[0]) if k != 'elemental' else ['CON']
    pon = TIPO_EXTRA[k]['fuertesDef'] + ([TIPO_EXTRA[k]['fuerteExtra']] if TIPO_EXTRA[k].get('fuerteExtra') else [])
    assert all(a in pon for a in fijos) and all(a in lista_atr(fuertes_txt) or k in ('humanoide', 'extraplanar', 'mutante') for a in pon), (nombre, fuertes_txt, pon)
    # lo que la lista dice tiene que estar en el texto del Manual
    assert all(a in atr_deb for a in T_DEB[k]), (nombre, atr_deb)
    e.update(TIPO_EXTRA[k])
    for gr in e.get('gratis', []):
        assert gr['id'] in POR_ID, gr
    TIPOS[k] = e
assert len(TIPOS) == 17, len(TIPOS)
find(M, 'Tiene tres Fuertes, y su clave de Rol no sustituye a ninguno: se suma como cuarto si no es uno de ellos')


# ───────────────────────── Tablas sueltas ─────────────────────────
def tabla1(L, ancla, col=1, desde=0):
    i = find(L, ancla, desde)
    rows, _ = rows_from(L, i)
    # Dos tablas pegadas en el docx salen como filas seguidas: se corta en la
    # siguiente cabecera («d12 | …»).
    cuerpo = []
    for r in rows[1:]:
        if re.match(r'^(d\d+|n\.º)$', r[0]): break
        cuerpo.append(r)
    return [r[col] for r in cuerpo if len(r) > col and r[col]]


TABLAS = {}
def T(k, nombre, filas):
    TABLAS[k] = {'name': nombre, 'filas': filas}

T('fases', 'Fases de jefe (d12)', tabla1(M, 'ROW: | d12 | La transformación'))
T('guarida', 'Acciones de Guarida (d12)', tabla1(M, 'ROW: | d12 | Acción de Guarida'))
T('victoria', 'Victoria alternativa (d10): el combate termina si el grupo…', tabla1(M, 'ROW: | d10 | El combate termina si el grupo'))
T('bandas', 'Composición de bandas (d12)', tabla1(M, 'ROW: | d12 | Composición'))
T('forma', 'Aspecto: forma base (d20)', tabla1(M, 'ROW: | d20 | Forma base', 1))
T('rasgoVisible', 'Aspecto: rasgo visible (d20)', tabla1(M, 'ROW: | d20 | Forma base', 3))
T('mueve', 'Aspecto: se mueve… (d12)', tabla1(M, 'ROW: | d12 | Se mueve', 1))
T('ataca', 'Aspecto: ataca con… (d12)', tabla1(M, 'ROW: | d12 | Se mueve', 3))
T('quiere', 'Comportamiento: qué quiere (d20)', tabla1(M, 'ROW: | d20 | Qué quiere', 1))
T('pelea', 'Comportamiento: cómo pelea (d12)', tabla1(M, 'ROW: | d20 | Qué quiere', 3))
T('habitat', 'Hábitat (d20)', tabla1(M, 'ROW: | d20 | Hábitat', 1))
T('senal', 'La señal (d20)', tabla1(M, 'ROW: | d20 | Hábitat', 3))
T('botinCae', 'Lo que deja al caer (d12)', tabla1(M, 'ROW: | d12 | Lo que deja al caer'))
T('nomNucleo', 'Nombres: artículo y núcleo (d20)', tabla1(M, 'ROW: | d20 | Artículo y núcleo', 1))
T('nomRaiz', 'Nombres: raíz sonora (d20)', tabla1(M, 'ROW: | d20 | Artículo y núcleo', 3))
T('nomEpiteto', 'Nombres: epíteto (d20)', tabla1(M, 'ROW: | d20 | Artículo y núcleo', 5))
T('nomFin', 'Nombres: terminaciones', ['ax', 'ith', 'ora', 'un', 'esh', 'ul'])
T('trampaDisp', 'Trampa: disparador (d12)', tabla1(M, 'ROW: | d12 | Disparador | Efecto | Señal', 1))
T('trampaEfecto', 'Trampa: efecto (d12)', tabla1(M, 'ROW: | d12 | Disparador | Efecto | Señal', 2))
T('trampaSenal', 'Trampa: señal (d12)', tabla1(M, 'ROW: | d12 | Disparador | Efecto | Señal', 3))

i = find(G, '#Heading3 El Dado de Riesgo (1d6)')
rows, _ = rows_from(G, i)
T('riesgo', 'Dado de Riesgo (d6)', [f'{r[1]} — {r[2]}' for r in rows[1:]])
i = find(G, '#Heading3 Tabla de Reacciones PNJ (2d10)')
rows, _ = rows_from(G, i)
T('reaccion', 'Reacción de PNJ (2d10): 2–5 · 6–10 · 11–15 · 16–19 · 20', [r[1] for r in rows[1:]])
T('objFaccion', 'Objetivos de Facción (d8)', tabla1(G, 'ROW: | d8 | Objetivo'))
T('objTipo', 'Objeto mágico: tipo (d12)', ['Arma cuerpo a cuerpo', 'Arma a distancia', 'Armadura', 'Escudo', 'Capa o vestimenta',
   'Accesorio (anillo, amuleto, brazalete)', 'Consumible (poción, pergamino)', 'Joya o gema', 'Herramienta especializada',
   'Foco', 'Documento o mapa arcano', 'Objeto extraño (no identificable a primera vista)'])
T('objHistoria', 'Objeto mágico: las tres preguntas', ['¿Quién lo creó y con qué propósito?', '¿Cuál fue su momento de mayor poder o infamia?',
   '¿Qué quiere ahora el objeto, o qué creen los que lo conocen que «quiere» hacer?'])
T('revision', 'Revisión final de una criatura', ['¿Se puede ver venir? Tiene una señal, y sus Aptitudes más peligrosas se anuncian.',
   '¿Obliga a decidir? Si la respuesta óptima es siempre «pegarle más fuerte», le falta algo.',
   '¿Se puede descubrir su punto débil? Si tiene una Debilidad, el grupo tiene forma de averiguarla antes o durante el encuentro.',
   '¿Sabe cuándo huir? Anota su Moral o la condición en la que abandona la pelea.'])
T('moralMods', 'Modificadores de Moral', ['+2 · Líder especialmente carismático o intimidante', '+3 · Defienden algo que no pueden abandonar',
   '−2 · Han sufrido un Golpe Crítico devastador', '−2 · Su líder acaba de caer', '−1 · El terreno ofrece una huida fácil y visible'])
T('moralCuando', 'Cuándo comprobar la Moral', ['Cae el líder visible del grupo enemigo.', 'La mitad o más del grupo ha sido incapacitada o muerta.',
   'Aparece un terror sobrenatural o una amenaza desproporcionada.', 'Un enemigo recibe un golpe que supera la mitad de sus PV de una vez.'])
for k, t in TABLAS.items():
    assert t['filas'], k
print({k: len(t['filas']) for k, t in TABLAS.items()})

# ───────────────────────── Plantillas ─────────────────────────
i = find(M, 'ROW: | d12 | Plantilla | NA | Cambios')
rows, _ = rows_from(M, i)
PL_AUTO = {  # lo que la app aplica sola; el resto queda descrito en `txt`
    'anciana': dict(na=2, gana=['voluntad_de_hierro']),
    'no_muerta': dict(na=0, tipo='no_muerto', gana=['toque_necrotico', 'vulnerabilidad'], notas={'vulnerabilidad': 'Radiante'}),
    'espectral': dict(na=1, tipo='espiritu', gana=['incorporeo'], pierdeFam=['forma']),
    'infernal': dict(na=1, tipo='extraplanar', gana=['cuerpo_igneo', 'aversion'], notas={'aversion': 'sal consagrada'}),
    'mecanizada': dict(na=1, tipo='maquina', gana=['arma_montada', 'vulnerabilidad'], notas={'vulnerabilidad': 'Rayo'}, a=2),
    'colosal': dict(na=2, tam=2, gana=['pisoton', 'gigantismo'], pierdeFam=['sigilo']),
    'enjambre': dict(na=0, horda=True, gana=['enjambre']),
    'corrupta': dict(na=1, tipo='mutante', gana=['aura_toxica']),
    'cristalina': dict(na=1, gana=['piel_gruesa', 'reflejar_axiomas', 'vulnerabilidad'], notas={'vulnerabilidad': 'Contundente'}),
    'sombria': dict(na=1, gana=['paso_de_sombra', 'oscuridad_viva', 'fotosensible']),
    'alfa': dict(na=1, rol='comandante', gana=['lider_de_manada']),
    'cria': dict(na=-2, tam=-1, gana=['cobarde'], pierdeMayor=True),
}
PLANT = {}
for n, nombre, na, cambios in rows[1:]:
    k = slug(nombre)
    e = {'name': nombre, 'naTxt': na, 'txt': cambios}
    e.update(PL_AUTO[k])
    for g in e.get('gana', []):
        assert g in POR_ID, g
    PLANT[k] = e

# ───────────────────────── Peligros ─────────────────────────
i = find(M, 'ROW: | d20 | Peligro | NA | Condición')
rows, _ = rows_from(M, i)
PELIGROS = {}
for n, nombre, na, txt in rows[1:]:
    cond, senal, cons = [p.strip() for p in txt.split(' · ', 2)]
    PELIGROS[slug(nombre)] = {'name': nombre, 'na': int(na), 'cond': cond, 'senal': senal, 'cons': cons}
assert len(PELIGROS) == 20

# ───────────────────────── Bestiario (Manual de Monstruos) ─────────────────────────
ROL_K = {v['name']: k for k, v in ROLES.items()}
TAM_K = {v['name'].lower(): k for k, v in TAM.items()}
TIPO_K = {v['name']: k for k, v in TIPOS.items()}
ESTADOS_N = ['Sangrado', 'Desgarro', 'Trauma', 'Envenenado', 'Ignición', 'Ralentizado', 'Aturdido', 'Conmocionado', 'Cegado',
             'Aterrado', 'Paralizado', 'Apresado', 'Derribado', 'Encantado', 'Ensordecido', 'Maldito', 'Petrificado']


def rasgo_de(nombre, txt=None, nota=None, gratis=False):
    e = POR_NOMBRE[nombre]
    r = {'id': e['id']}
    if txt: r['txt'] = txt
    if nota: r['nota'] = nota
    if gratis: r['gratis'] = True
    return r


def parse_dano(s):
    """«3d6+2 y 2d6+2 Cortante (garras)» → ('3d6+2 y 2d6+2', 'Cortante', 'garras')."""
    m = re.match(r'(\d+d\d+(?:[+−-]\d+)?(?: y \d+d\d+(?:[+−-]\d+)?)?)\s*(.*)$', s)
    formula = m.group(1).replace('−', '-')
    resto = m.group(2)
    arma = ''
    ma = re.search(r'\(([^)]*)\)\s*$', resto)
    if ma:
        arma = ma.group(1); resto = resto[:ma.start()].strip()
    if arma == 'dos ataques': arma = ''
    return formula, resto, arma


def parse_gratis(par):
    """Rasgos de tipo entre paréntesis → lista de rasgos gratis."""
    out = []
    for trozo in re.split(r'[;.]\s*', par):
        trozo = trozo.strip()
        if not trozo: continue
        sub = [trozo] if ':' in trozo else [t.strip() for t in trozo.split(',')]
        for t in sub:
            m = re.match(r'Inmune a (.+)$', t)
            if m:
                cosas = m.group(1)
                es_estado = any(e in cosas for e in ESTADOS_N)
                out.append(rasgo_de('Inmunidad a Estados' if es_estado else 'Inmunidad', nota=cosas, gratis=True)); continue
            m = re.match(r'Resistencia a (.+)$', t)
            if m:
                out.append(rasgo_de('Resistencia', nota=m.group(1), gratis=True)); continue
            nm = None
            for cand in sorted(POR_NOMBRE, key=len, reverse=True):
                if t.startswith(cand):
                    nm = cand; break
            if nm:
                resto = t[len(nm):].strip(' :')
                out.append(rasgo_de(nm, txt=(resto[0].upper() + resto[1:]) if ':' in t and resto else None,
                                    nota=None if ':' in t else (resto or None), gratis=True))
    return out


def n_horda(miembros):
    for h in HORDAS.values():
        if miembros <= h['max']:
            return h.get('na', 6)
    return 6


def tope_especie(na):
    """El Rasgo de especie de combate gratuito: hasta Potencial 1, 2 o 3 según el NA (Cap. 2)."""
    return 1 if na <= 4 else 2 if na <= 9 else 3


def pesos(c, na):
    """Potencial gastado y presupuesto, con los Rasgos de especie, el racial mayor y
    los de tipo (lo mismo que hace calcCr en la app)."""
    tipo, rol = TIPOS[c['tipo']], ROLES.get(c['rol'], {})
    infos = []
    for r in c['rasgos']:
        e = POR_ID[r['id']][1] if r.get('id') in POR_ID else r
        if r.get('id') in POR_ID and 'peso' in r: e = dict(e, peso=r['peso'])   # Uso de Axiomas de Nivel 4 o más: 3
        infos.append((r, e))
    auto = None
    gf = tipo.get('gratisFam')
    if gf:
        for r, e in infos:
            if not r.get('gratis') and r.get('id') in POR_ID and POR_ID[r['id']][0] == gf['fam'] and e['peso'] > 0 \
                    and (gf.get('peso') is None or e['peso'] == gf['peso']):
                auto = r; break
    libre = None
    if tipo.get('alientoGratis'):
        libre = next((r for r, e in infos if r.get('id') == 'aliento'), None)
    if libre is None:
        cand = [(e['peso'], i) for i, (r, e) in enumerate(infos) if r.get('especie') and not e.get('narrativa')
                and 0 < e['peso'] <= tope_especie(na) and not r.get('gratis') and not r.get('racial')]
        if cand: libre = infos[max(cand)[1]][0]
    gratis = lambda r, e: r.get('gratis') or r is auto or r is libre or r.get('racial') or (r.get('especie') and e.get('narrativa'))
    debs = [1 for r, e in infos if not gratis(r, e) and (e.get('tipo') == 'Debilidad' or e['peso'] < 0)]
    base = 0 if rol.get('esbirro') else NA[str(na)]['peso'] + (2 if c['estructura'] == 'jefe' else 0)
    gasto = sum(e['peso'] for r, e in infos if not gratis(r, e) and e['peso'] > 0)
    return gasto, base + min(2, len(debs))


def calcular(c):
    """Las fórmulas del Cap. 1, para comprobar lo impreso (el cálculo de la app
    está en js/amenaza.js; el autodiagnóstico repite esta comprobación allí)."""
    na = c['na'] + (n_horda(c['miembros']) if c['estructura'] == 'horda' else 0)
    B, rol, tam, tipo = NA[str(na)], ROLES.get(c['rol'], {}), TAM[c['tam']], TIPOS[c['tipo']]
    mods_r = [POR_ID[r['id']][1].get('mod', {}) for r in c['rasgos'] if r.get('id') in POR_ID]
    fuertes = c['fuertes'] + ([tipo['fuerteExtra']] if tipo.get('fuerteExtra') else [])
    mod = {}
    for a in ATR:
        cat = 'F' if a in fuertes else 'D' if a in c['debiles'] else 'N'
        t = tam.get(a.lower(), 0)
        if a == 'CON' and any(m.get('conDebil') for m in mods_r): cat = 'D'
        if t == 'D': mod[a] = B['debil']
        else: mod[a] = {'F': B['fuerte'], 'N': B['normal'], 'D': B['debil']}[cat] + t
    pega = max(mod['FUE'], mod['DES'])
    n, caras = [int(x) for x in B['dano'].split('d')]
    n += rol.get('danoDados', 0)
    pa = B['pa'] + sum(m.get('pa', 0) for m in mods_r)
    if rol.get('danoDados') and c['tam'] in ('grande', 'enorme', 'colosal') and na >= 5: pa = max(pa, 4)
    bono = B['ajuste'] + pega
    sb = f'+{bono}' if bono > 0 else str(bono) if bono < 0 else ''
    dano = f'{(n + 1) // 2}d{caras}{sb} y {n // 2}d{caras}{sb}' if pa >= 4 else f'{n}d{caras}{sb}'
    pv = max(1, c['na'] * 2) if rol.get('esbirro') else 4 if na == 0 else (20 + na * (8 + mod['CON'])) * 3 // 2
    if c['estructura'] == 'jefe': pv *= 2
    gasto, maximo = pesos(c, na)
    exceso = max(0, gasto - maximo)
    area = 0
    for r in c['rasgos']:
        e = POR_ID[r['id']][1] if r.get('id') in POR_ID else r
        if e.get('area') is True: area = max(area, 3 if e['peso'] >= 3 else 2)
        elif r.get('area'): area = max(area, r['area'])
    jefe = c['estructura'] == 'jefe'
    axiomas = any(r.get('id') == 'uso_de_axiomas' or r.get('axiomas') for r in c['rasgos'])
    enc = na + exceso // 2 + ((4 if na >= 6 else 3) if jefe else 0) + (max(0, area - 1) if jefe else area) \
        + tam.get('naEnc', 0) + (1 if axiomas else 0)
    return {
        'attrs': mod, 'pv': pv, 'g': 10 + B['pb'] + mod['DES'], 'a': min(B['a'] + rol.get('a', 0), na + 3),
        'vel': 30 + rol.get('vel', 0), 'ini': mod['DES'] + rol.get('ini', 0), 'atk': B['pb'] + pega,
        'dano': dano, 'pa': pa, 'cd': 8 + B['pb'] + na // 2 + max([mod[a] for a in fuertes] or [0]),
        'salv': {a: mod[a] + B['pb'] for a in fuertes}, 'enc': enc, 'gasto': gasto, 'max': maximo,
    }


def leer_atributos(c, linea):
    """«FUE +4 · DES −2 · … · Salvaciones fuertes: DES +6, FUE +7» → Fuertes y Débiles.
    Un atributo es Débil si, quitado lo que pone el tamaño, vale −2."""
    cab, _, salv = linea.partition('Salvaciones fuertes:')
    attrs = {a: num(v) for a, v in re.findall(r'\b(FUE|DES|CON|INT|SAB|CAR) ([+−]\d+)', cab)}
    assert len(attrs) == 6, linea
    fuertes = re.findall(r'\b(FUE|DES|CON|INT|SAB|CAR) ([+−]\d+)', salv)
    extra = TIPOS[c['tipo']].get('fuerteExtra')       # el dragón: INT Fuerte por su tipo
    c['fuertes'] = [a for a, _ in fuertes if a != extra]
    assert len(c['fuertes']) == 2, linea
    tam = TAM[c['tam']]
    c['debiles'] = [a for a in ATR if a not in c['fuertes'] and a != extra and tam.get(a.lower(), 0) != 'D'
                    and attrs[a] - tam.get(a.lower(), 0) == -2]
    return attrs, {a: num(v) for a, v in fuertes}


def comprobar(c, imp, attrs, salv, errores, solo=None):
    """Lo impreso frente a las fórmulas. Lo que difiere por equipo o identidad
    (Armadura, Velocidad) se queda como ajuste a mano; lo demás es un aviso."""
    f = calcular(c)
    for a in ATR:
        if f['attrs'][a] != attrs[a]: errores.append((c['nombre'], a, f['attrs'][a], attrs[a]))
    for a, v in salv.items():
        if f['salv'][a] != v: errores.append((c['nombre'], 'Salvación ' + a, f['salv'][a], v))
    for k, rot in [('pv', 'PV'), ('g', 'Guardia'), ('atk', 'Ataque'), ('dano', 'Daño'), ('cd', 'CD'), ('ini', 'Iniciativa'), ('pa', 'PA')]:
        if k in imp and f[k] != imp[k]: errores.append((c['nombre'], rot, f[k], imp[k]))
    manual = {}
    # Desde el 11-10 la ficha impresa ya suma lo que mueven los Rasgos (Piel Gruesa,
    # Lenta…), igual que la app: solo queda a mano lo que viene del equipo.
    mods_r = [POR_ID[r['id']][1].get('mod', {}) for r in c['rasgos'] if r.get('id') in POR_ID]
    na_ef = c['na'] + (n_horda(c['miembros']) if c['estructura'] == 'horda' else 0)
    rol = ROLES.get(c['rol'], {})
    a_con = min(NA[str(na_ef)]['a'] + rol.get('a', 0) + sum(m.get('a', 0) for m in mods_r), na_ef + 3)
    vel_con = 30 + rol.get('vel', 0) + sum(m.get('vel', 0) for m in mods_r)
    if imp.get('a') is not None and imp['a'] != a_con: manual['armadura'] = imp['a']
    if imp.get('vel') is not None and imp['vel'] != vel_con: manual['vel'] = imp['vel']
    # El objeto de un jefe o un Comandante va ya sumado en la ficha («ya incluido»)
    if c.get('equipo'):
        for k, km in [('g', 'guardia'), ('atk', 'ataque'), ('cd', 'cd')]:
            if k in imp and imp[k] != f[k]:
                manual[km] = imp[k]
                errores[:] = [e for e in errores if not (e[0] == c['nombre'] and e[1] == {'g': 'Guardia', 'atk': 'Ataque', 'cd': 'CD'}[k])]
    for k, km in IMPRESO_A_MANO.get(c['nombre'], {}).items():
        if imp.get(k) is not None and imp[k] != f[k]:
            manual[km] = imp[k]
            rot = {'dano': 'Daño', 'cd': 'CD'}[k]
            errores[:] = [e for e in errores if not (e[0] == c['nombre'] and e[1] == rot)]
    if 'enc' in imp and imp['enc'] != f['enc']: errores.append((c['nombre'], 'NA de encuentro', f['enc'], imp['enc'], f'Potencial {f["gasto"]}/{f["max"]}'))
    return f, manual


# Cifras impresas que no salen de las fórmulas y no se explican por el equipo.
# La app las respeta como ajuste a mano y el README las anota como posibles
# erratas del Manual (31-10-2026): el Arconte (NA 11) lleva el daño y la CD
# del Serafín Ceniciento (NA 9); el Seraph, +5 al daño en lugar de +10.
IMPRESO_A_MANO = {'Arconte': {'dano': 'dano', 'cd': 'cd'}, 'Seraph': {'dano': 'dano'}}


TAM_PREF = {k[:5]: k for k in TAM}   # «diminutas» → diminuto, «grande» → grande


def leer_stats(partes, c, imp, extra, errores):
    """Las piezas de la línea de estadísticas, comunes al Manual y a la Guía."""
    for p in partes:
        mt = re.match(r'^(\w+)(?: \(horda\))?$', p)
        tam_k = mt and TAM_PREF.get(mt.group(1).lower()[:5])
        if tam_k:                       # «Mediano», «Diminutas (horda)»: la Guía imprime el tamaño desde el 8-10
            if c.get('tam') and c['tam'] != tam_k: errores.append((c['nombre'], 'tamaño', c['tam'], tam_k))
            c['tam'] = tam_k
        elif p in ROL_K: c['rol'] = ROL_K[p]
        elif p.startswith('Rol: '): c['rol'] = '' if p[5:] == 'Sin Rol' else ROL_K[p[5:]]
        elif p == 'Sin Rol': pass
        elif p == 'Jefe': c['estructura'] = 'jefe'
        elif p.startswith('PV '): imp['pv'] = int(re.match(r'PV (\d+)', p).group(1))
        elif p.startswith('Guardia '): imp['g'] = int(p[8:])
        elif p.startswith('Armadura '): imp['a'] = int(re.match(r'Armadura (\d+)', p).group(1))
        elif p.startswith('Velocidad '):
            imp['vel'] = int(re.match(r'Velocidad (\d+)', p).group(1))
            if '/' in p: extra.append(p.split('/', 1)[1].strip())
        elif p.startswith('Iniciativa '): imp['ini'] = num(p[11:])
        elif p.startswith('Ataque '): imp['atk'] = num(p[7:])
        elif p.startswith('Daño '):
            f, tp, arma = parse_dano(p[5:])
            imp['dano'] = f; c['danoTipo'] = tp.split(',')[0].strip(); c['ataqueNombre'] = arma[0].upper() + arma[1:] if arma else ''
        elif p.startswith('PA '): imp['pa'] = int(p[3:])
        elif p.startswith('CD '): imp['cd'] = int(p[3:])
        elif p.startswith('Moral '): imp['moral'] = None if p.endswith('—') else int(p[6:])
        elif re.match(r'Horda de \w+ ', p):
            m = re.match(r'Horda de (\w+) .*\(NA (\d+)\)', p)
            c['estructura'] = 'horda'; c['miembros'] = NUM_TXT[m.group(1)]; c['na'] = int(m.group(2))
        else: extra.append(p)


NUM_TXT = {'cuatro': 4, 'cinco': 5, 'seis': 6, 'siete': 7, 'ocho': 8, 'diez': 10, 'doce': 12}
# Piezas del bestiario que no están en la Biblioteca: su tipo y su Potencial, por
# la pieza de la Biblioteca a la que más se parecen (la línea «Encuentro» lo confirma).
CUSTOM_PESO = {
    'Garras Paralizantes': ('Modificador', 3), 'Toque Paralizante': ('Modificador', 3), 'Mirada Dominante': ('Aptitud', 3),
    'Miembros que Siguen': ('Rasgo', 1), 'Hijos de la Noche': ('Aptitud', 0), 'Forma de Niebla': ('Rasgo', 0),
    'Filacteria': ('Rasgo', 0), 'Palabra Atada': ('Debilidad', 0),
    # Criaturas celestiales (31-10-2026)
    'Toque Sanador': ('Aptitud', 0), 'El Mensaje': ('Rasgo', 0), 'Prohibición': ('Aptitud', 2),
    'Seis Alas': ('Aptitud', 3), 'Fuego que Purifica': ('Aura', 3), 'La Brasa': ('Aptitud', 0),
}
# Las que cuentan como Aptitud de área en su línea «Encuentro»
CUSTOM_AREA = {'Prohibición': 2, 'Fuego que Purifica': 3}


def poner_flags(r, flags):
    """«especie», «definitoria», «racial mayor» → marcas en el Rasgo."""
    f = [x.strip() for x in re.split(r'[,;]', flags)]
    if 'especie' in f: r['especie'] = True
    if 'definitoria' in f: r['definitoria'] = True; r['especie'] = True   # la definitoria es su Rasgo de especie más fuerte
    if 'racial mayor' in f: r['racial'] = True; r['especie'] = True


def leer_encuentro(c, imp, txt):
    """«… cuenta como NA 11; como jefe, 15, y por sus Axiomas, 16.» → el último número."""
    c['encuentroTxt'] = txt
    nums = re.findall(r'NA (\d+)', txt) + re.findall(r', (\d+)(?:,| y |\.| \()', txt)
    todos = [int(x) for x in re.findall(r'(?:NA |, | y )(\d+)', txt)]
    imp['enc'] = todos[-1] if todos else None
BEST = {}
M_ACTUAL, M = M, BP   # el bucle lee la copia fija; M vuelve a ser el Manual al acabar
i0 = find(M, '#Heading1 Bestiario')
i1 = find(M, '#Heading1 Referencia rápida')
j = i0
errores = []
while j < i1:
    if M[j].startswith('#Heading3 '):
        m = re.match(r'#Heading3 (.+) \(NA (\d+)\)', M[j])
        nombre, na = m.group(1), int(m.group(2))
        c = {'nombre': nombre, 'na': na, 'tipo': '', 'tam': '', 'rol': '', 'estructura': 'normal',
             'rasgos': [], 'fuente': 'Manual de Monstruos'}
        k = j + 1
        # Las hordas llevan una línea delante: «Banda de 8 xenos (NA 3) · NA efectivo 7»
        mh = re.match(r'(Grupo|Banda|Turba) de (\d+) .*\(NA (\d+)\) · NA efectivo (\d+)$', M[k])
        if mh:
            assert int(mh.group(4)) == na, M[k]
            c['estructura'] = 'horda'; c['miembros'] = int(mh.group(2)); c['na'] = int(mh.group(3))
            k += 1
        st = [p.strip() for p in M[k].split(' · ')]
        # «Humanoide · Mediano · Esbirro · PV 2…»: tipo y tamaño van por separado
        c['tipo'] = TIPO_K[st[0]]
        c['tam'] = TAM_K[st[1].lower()]
        imp, extra = {}, []
        leer_stats(st[2:], c, imp, extra, errores)
        for x in extra: errores.append((nombre, 'stat?', x))
        attrs, salv = leer_atributos(c, M[k + 1])
        k += 2
        while k < i1 and not M[k].startswith('#Heading') and not M[k].startswith('ROW:'):
            ln = M[k]
            if ln.startswith('('):
                # el paréntesis de tipo es el primero; puede llevar paréntesis dentro
                depth, fin_par = 0, len(ln) - 1
                for idx, ch in enumerate(ln):
                    if ch == '(': depth += 1
                    elif ch == ')':
                        depth -= 1
                        if depth == 0:
                            fin_par = idx; break
                c['rasgos'] += parse_gratis(ln[1:fin_par])
                resto = ln[fin_par + 1:].strip()
                if resto: c['rolNota'] = resto
            elif ln.startswith('Señal. '): c['senal'] = ln[7:]
            elif ln.startswith('Contexto táctico. '): c['contexto'] = ln[18:]
            elif ln.startswith('Esbirro:') or ln.startswith('Custodia (Reacción)') or ln.startswith('Horda:'): pass
            elif ln.startswith('Equipo:'): c['equipo'] = ln[8:]
            elif re.match(r'Equipo( de jefe)?\. ', ln): c['equipo'] = ln.split('. ', 1)[1]
            elif ln.startswith('Protección. '): c['proteccion'] = ln[12:]
            elif ln.startswith('Encuentro. '): leer_encuentro(c, imp, ln[11:])
            elif ln.startswith('Edad. '): c['notas'] = (c.get('notas', '') + '\n' + ln).strip()
            else:
                m2 = re.match(r'([^.(]+?)(?: \(([^)]*)\))?\. (.+)$', ln)
                if m2:
                    nm, flags, txt = m2.group(1), m2.group(2) or '', m2.group(3)
                    if nm in POR_NOMBRE:
                        r = rasgo_de(nm, txt=txt)
                        mx = re.search(r'de hasta Nivel (\d)', txt)
                        if r['id'] == 'uso_de_axiomas' and mx and int(mx.group(1)) >= 4: r['peso'] = 3
                        if r['id'] == 'vulnerabilidad':
                            mm = re.search(r'daño (?:de )?(\w+)', txt)
                            r['nota'] = mm.group(1)
                    elif nm in CUSTOM_PESO:
                        tp, peso = CUSTOM_PESO[nm]
                        r = {'custom': True, 'name': nm, 'tipo': tp, 'peso': peso, 'txt': txt}
                        if nm in CUSTOM_AREA: r['area'] = CUSTOM_AREA[nm]
                        mc = re.match(r'(\d PA)(?: · ([^:]+))?: (.+)$', txt)
                        if mc: r['coste'] = mc.group(1); r['frec'] = mc.group(2) or ''; r['txt'] = mc.group(3)
                    else:
                        errores.append((nombre, 'línea?', ln[:60])); k += 1; continue
                    poner_flags(r, flags)
                    c['rasgos'].append(r)
                else:
                    errores.append((nombre, 'línea?', ln[:60]))
            k += 1
        f, manual = comprobar(c, imp, attrs, salv, errores)
        if manual: c['manual'] = manual
        if imp.get('moral') is None and c['tipo'] == 'bestia' and 'INT' not in c['debiles']: c['moralNoTira'] = True
        c['impreso'] = {'pv': imp['pv'], 'g': imp['g'], 'a': imp['a'], 'vel': imp.get('vel'), 'atk': imp['atk'],
                        'dano': imp['dano'], 'cd': imp['cd'], 'ini': imp['ini'], 'moral': imp.get('moral'), 'attrs': attrs,
                        'enc': imp.get('enc', f['enc'] if 'enc' not in imp else imp['enc'])}
        if 'enc' not in imp and f['enc'] != (c['na'] + (n_horda(c['miembros']) if c['estructura'] == 'horda' else 0)):
            errores.append((nombre, 'NA de encuentro sin línea «Encuentro»', f['enc'], f'Potencial {f["gasto"]}/{f["max"]}'))
        c['impreso']['enc'] = imp.get('enc', c['na'] + (n_horda(c['miembros']) if c['estructura'] == 'horda' else 0))
        BEST[slug(nombre)] = c
        j = k
    else:
        j += 1
M = M_ACTUAL

# Vuelo y trepar: la velocidad concreta del bestiario va en la nota del Rasgo
VEL_NOTA = {'dron_centinela': ('vuelo', '30 pies'), 'fuego_fatuo': ('vuelo', '30 pies'), 'arpia': ('vuelo', '40 pies'),
            'manticora': ('vuelo', '50 pies'), 'elemental_de_tormenta': ('vuelo', '60 pies'),
            'serafin_ceniciento': ('vuelo', '60 pies'), 'dragon_rojo_adulto': ('vuelo', '80 pies'),
            'deva': ('vuelo', '90 pies'), 'arconte': ('vuelo', '60 pies'), 'seraph': ('vuelo', '120 pies')}
for k, (rid, nota) in VEL_NOTA.items():
    for r in BEST[k]['rasgos']:
        if r.get('id') == rid: r['nota'] = nota

# ───────────────────────── Bestiario básico de la Guía ─────────────────────────
GUIA_TT = {  # el tipo no viene en la Guía: se asigna por lo que la criatura es (el tamaño, sí, y se comprueba)
    'Lobo': ('bestia', 'mediano'), 'Esqueleto': ('no_muerto', 'mediano'), 'Zombie': ('no_muerto', 'mediano'),
    'Orco': ('humanoide', 'mediano'), 'Oso Pardo': ('bestia', 'grande'), 'Azotamente / Mente Devoradora': ('aberracion', 'mediano'),
    'Gigante de la Tormenta': ('gigante', 'enorme'), 'Licántropo / Hombre Lobo': ('monstruosidad', 'mediano'),
    'Caballero de la Muerte': ('no_muerto', 'mediano'), 'Jefe de Tribu': ('humanoide', 'mediano'),
    'Acólito de la Ceniza': ('humanoide', 'mediano'), 'Batidor': ('humanoide', 'mediano'), 'Enjambre de Ratas': ('bestia', 'diminuto'),
}
ICONO_TIPO = {'[t_pasivo]': 'Rasgo', '[t_disparador]': 'Reacción', '[t_modificador]': 'Modificador', '✦': 'Aptitud'}
G_ACTUAL, G = G, BP
i0 = find(G, '#Heading1 Bestiario básico')
i1 = find(G, '#Heading1 Referencia del Director', i0)
j = i0
while j < i1:
    if G[j].startswith('#Heading2 '):
        m = re.match(r'#Heading2 (.+?) \((?:Horda de )?NA (\d+)', G[j])
        nombre, na = m.group(1), int(m.group(2))
        tipo, tam = GUIA_TT[nombre]
        st = [p.strip() for p in G[j + 1].split(' · ')]
        c = {'nombre': nombre.split(' / ')[0], 'na': na, 'tipo': tipo, 'tam': tam, 'rol': '', 'estructura': 'normal',
             'rasgos': [], 'fuente': 'Guía del Director'}
        imp, extra = {}, []
        leer_stats(st, c, imp, extra, errores)
        assert G[j + 2].startswith('Atributos: '), G[j + 2]
        attrs, salv = leer_atributos(c, G[j + 2])
        for x in extra:
            c['rasgos'].append({'custom': True, 'name': x.split(':')[0].split(' a ')[0].split(' al ')[0] if len(x) > 40 else x,
                                'tipo': 'Rasgo', 'peso': 0, 'txt': x})
        k = j + 3
        ctx = []
        while k < i1 and not G[k].startswith('#Heading') and not G[k].startswith('ROW:'):
            ln = G[k]
            m2 = re.match(r'([^(:]+) \(([^)]*)\): (.+)$', ln)
            if ln.startswith('Contexto táctico. '): ctx.append(ln[18:])
            elif m2 and (re.split(r'[,;]', m2.group(2))[0].strip() in ICONO_TIPO):
                nm, txt = m2.group(1), m2.group(3)[0].upper() + m2.group(3)[1:]
                partes = [x.strip() for x in re.split(r'[,;]', m2.group(2))]
                if nm == 'Protección': c['proteccion'] = txt
                elif nm == 'Encuentro': leer_encuentro(c, imp, txt)
                elif nm.startswith('Equipo'): c['equipo'] = (partes[1] + ': ' if len(partes) > 1 else '') + txt
                else:
                    r = {'custom': True, 'name': nm, 'tipo': ICONO_TIPO[partes[0]], 'peso': 0, 'txt': txt}
                    for x in partes[1:]:
                        if 'PA' in x: r['coste'] = x
                        elif x.startswith('Ud') or x.startswith('1/'): r['frec'] = x
                        elif 'pies' in x: r['tipo'] = 'Aura'; r['txt'] = f'Radio de {x}: ' + r['txt'][0].lower() + r['txt'][1:]
                    poner_flags(r, m2.group(2))
                    if nm == 'Uso de Axiomas': r['axiomas'] = True
                    c['rasgos'].append(r)
            elif ctx: ctx.append(ln)
            elif re.match(r'[^.]+ \(NA \d+\)\. ', ln): c['notas'] = (c.get('notas', '') + '\n' + ln).strip()
            else: errores.append((nombre, 'línea guía?', ln[:60]))
            k += 1
        c['contexto'] = '\n\n'.join(ctx)
        # Los rasgos de la Guía no llevan Potencial: la Aptitud de área que nombra su
        # línea «Encuentro» («su Explosión Mental le suma 3») se marca para la cuenta.
        if imp.get('enc') is not None:
            sin_area = calcular(c)['enc']
            falta = imp['enc'] - sin_area
            if falta > 0:
                r = next((r for r in c['rasgos'] if r.get('custom') and r['name'].split()[0] in c.get('encuentroTxt', '')), None)
                if r: r['area'] = falta + (1 if c['estructura'] == 'jefe' else 0)
        f, manual = comprobar(c, imp, attrs, salv, errores)
        if manual: c['manual'] = manual
        if imp.get('moral') is None and 'INT' not in c['debiles'] and tipo == 'bestia': c['moralNoTira'] = True
        c['impreso'] = {'pv': imp['pv'], 'g': imp['g'], 'a': imp['a'], 'vel': imp.get('vel'), 'atk': imp['atk'],
                        'dano': imp['dano'], 'cd': imp['cd'], 'ini': imp['ini'], 'moral': imp.get('moral'), 'attrs': attrs,
                        'enc': imp.get('enc', c['na'] + (n_horda(c['miembros']) if c['estructura'] == 'horda' else 0))}
        key = slug(c['nombre'])
        assert key not in BEST, key
        BEST[key] = c
        j = k
    else:
        j += 1
G = G_ACTUAL


# ──────────── Bestiario tal como lo escriben hoy el Manual y la Guía ────────────
# Desde el 24-10-2026 (01:35) cada criatura abre con una frase y una tabla
# (Rareza, Número, En su guarida, Botín, Inteligencia, Tamaño y tipo, NA y Rol,
# Moral), sigue con su línea de combate y sus atributos, los Rasgos en
# párrafos, su descripción, Señales y una tabla de ganchos d6. Las cifras se
# comparan con las de la copia fija; lo demás va a la ficha.
def leer_actual(L, i0, i1, nivel, fuente):
    j = i0
    while j < i1:
        m = re.match(r'#' + nivel + r' (.+?) \((?:Horda de )?NA (\d+)', L[j])
        if not m:
            j += 1; continue
        nombre = m.group(1).split(' / ')[0]
        k = j + 1
        fin = next(x for x in range(k, i1 + 1) if x == i1 or L[x].startswith('#Heading'))
        B = L[k:fin]
        j = fin
        key = slug(nombre)
        c = BEST.get(key)
        if not c:
            errores.append((nombre, 'criatura nueva en el ' + fuente + ': falta en bestiario_piezas.txt')); continue
        assert B[0].startswith('«'), (nombre, B[0])
        c['idea'] = B[0]
        filas = [cells(x) for x in B if x.startswith('ROW: |')]
        assert filas[0] == ['Rareza', 'Número', 'En su guarida', 'Botín'] and filas[2] == ['Inteligencia', 'Tamaño y tipo', 'NA · Rol', 'Moral'], (nombre, filas[:3])
        rareza, numero, guarida, botin = filas[1]
        intel, tamtipo, narol, moral = filas[3]
        c['botin'] = botin
        datos = [rareza, 'Número: ' + numero]
        if guarida != '—': datos.append('En su guarida: ' + guarida)
        datos.append('Inteligencia: ' + intel[0].lower() + intel[1:])
        datos.append('Moral: ' + moral)
        # Las cifras impresas tienen que ser las de la copia fija
        ic = next(i for i, x in enumerate(B) if re.match(r'(?:Forma \w+ · )?Guardia \d+ · ', x))   # el licántropo: «Forma lobo · Guardia…»
        lin, at = B[ic], B[ic + 1]
        imp = c['impreso']
        for et, pat, val in [('PV', r'PV (\d+)', imp['pv']), ('Guardia', r'Guardia (\d+)', imp['g']), ('Armadura', r'Armadura (\d+)', imp['a']),
                             ('Iniciativa', r'Iniciativa ([+−]\d+)', imp['ini']), ('Ataque', r' ([+−]\d+)(?: a [^,]+)?, \d+d', imp['atk']),
                             ('CD', r'CD (\d+)', imp['cd'])]:
            mm = re.search(pat, lin)
            if not mm or num(mm.group(1)) != val:
                errores.append((nombre, et + ' impreso cambia', val, mm.group(1) if mm else None))
        md = re.search(r', (\d+d\d+[+−]?\d*(?: y \d+d\d+[+−]?\d*)?)', lin)
        if not md or md.group(1).replace('−', '-') != imp['dano'].replace('−', '-'):
            errores.append((nombre, 'Daño impreso cambia', imp['dano'], md.group(1) if md else None))
        attrs = dict((a, num(v)) for a, v in re.findall(r'\b(FUE|DES|CON|INT|SAB|CAR) ([+−]\d+)', at))
        if attrs != imp['attrs']:
            errores.append((nombre, 'atributos impresos cambian', imp['attrs'], attrs))
        # Después de los Rasgos: la descripción, «Encuentro.» y «Señales.»
        resto = [x for x in B[ic + 2:] if not x.startswith('ROW: |')]
        isen = next(i for i, x in enumerate(resto) if x.startswith('Señales. '))
        c['senal'] = resto[isen][9:]
        ienc = next((i for i, x in enumerate(resto) if x.startswith('Encuentro. ')), None)
        if ienc is not None:
            e = re.findall(r'(?:NA |, |y )(\d+)', resto[ienc])
            if not e or int(e[-1]) != imp['enc']:
                errores.append((nombre, 'línea «Encuentro» cambia', imp['enc'], resto[ienc][:80]))
        desc = resto[min(x for x in (isen, ienc) if x is not None) - 1]
        ganchos = [f'{f[0]} {f[1]}' for f in filas[5:] if len(f) == 2 and f[0].isdigit()] if len(filas) > 5 and filas[4] == ['d6', 'Gancho'] else []
        if len(ganchos) != 6:
            errores.append((nombre, 'ganchos', len(ganchos)))
        notas = [' · '.join(datos), desc]
        if ganchos: notas.append('Ganchos (d6):\n' + '\n'.join(ganchos))
        if c.get('notas'): notas.append(c['notas'])
        c['notas'] = '\n\n'.join(notas)
        c['actual'] = True


leer_actual(M, find(M, '#Heading1 Bestiario'), find(M, '#Heading1 Referencia rápida'), 'Heading3', 'Manual de Monstruos')
gi = find(G, '#Heading1 Bestiario básico')
leer_actual(G, gi, find(G, '#Heading1 Referencia del Director', gi), 'Heading2', 'Guía')
for k, c in BEST.items():
    if not c.pop('actual', False):
        errores.append((c['nombre'], 'ya no está en el bestiario del Manual ni de la Guía'))
print('bestiario:', len(BEST))
for e in errores:
    print('  AVISO', e)

# ───────────────────────── Encuentros ─────────────────────────
# Dificultad de una criatura sola, o NA de encuentro de cada dificultad (Manual de
# Monstruos, Cap. 4). La Guía (Cap. 2) da la misma tabla con ejemplos: se comprueba.
i = find(M, '#Heading2 Calibrar el encuentro')
rows, _ = rows_from(M, i)
assert rows[0] == ['Nivel del grupo', 'Fácil', 'Estándar', 'Peligroso', 'Mortal'], rows[0]
i = find(G, 'ROW: | Nivel grupo | Fácil | Estándar | Peligroso | Mortal')
guia, _ = rows_from(G, i)
ENC = {}
for r, g in zip(rows[1:], guia[1:]):
    assert r[0] == g[0], (r, g)
    f, e, p, m = [int(x.rstrip('+')) for x in r[1:5]]
    assert [int(re.match(r'1×NA(\d+)', x).group(1)) for x in g[1:5]] == [f, e, p, m], (r, g)
    assert r[4].endswith('+') and f < e < p < m, r
    ENC[r[0].replace('–', '-')] = {'name': 'Nivel ' + r[0], 'f': f, 'e': e, 'p': p, 'm': m}
assert list(ENC) == ['1-2', '3-4', '5-6', '7-8', '9-10'], list(ENC)
# «Con cinco o seis, suma 1 a cada casilla; con dos o tres, resta 1.» Nada dice de un
# personaje solo: se le resta 2.
find(M, 'Con cinco o seis, suma 1 a cada casilla; con dos o tres, resta 1')
find(M, 'con jugadores que empiezan, baja un escalón')
GRUPO_AJUSTE = {'1': -2, '2': -1, '3': -1, '4': 0, '5': 1, '6': 1}
# El cálculo va en el código (js/amenaza.js → naEnc y js/mesa.js → _naDeLineas;
# js/asistente.js → varias iguales). Si el Manual cambia la regla, esto avisa.
for frase in ['ROW: | Es un jefe | +3; +4 desde NA 6', 'ROW: | Es Enorme o Colosal | +1', 'ROW: | Usa Axiomas | +1',
              'ROW: | Se pasa de su Potencial | +1 por cada 2 puntos',
              'a 0 o 1 NA, 1; a 2 o 3, ½; a 4, ¼; a 5 o más, no cuenta',
              'con 1½, +2; con 2, +3; con 3, +4; con 4 o 5, +6; con 6 o 7, +7; con 8 o más, +9',
              'Cuatro esbirros cuentan como una criatura de su NA, y una horda usa su NA efectivo',
              'réstale al NA de la casilla: con dos, 3; con tres, 4; con cuatro o cinco, 6; con seis o siete, 7; con ocho o más, 9']:
    find(M, frase)

# ───────────────────────── Botín ─────────────────────────
i = find(G, 'ROW: | Nivel del grupo | Riqueza acumulada')
rows, _ = rows_from(G, i)
RIQUEZA = {}
for nv, acum, ses, obj in rows[1:]:
    a, b = [num(x) for x in re.findall(r'[\d.]+', ses)]
    RIQUEZA[nv] = {'name': 'Nivel ' + nv, 'acum': acum, 'sesion': ses, 'sesMin': a, 'sesMax': b, 'objetos': obj}
i = find(G, 'ROW: | Inversión | Coste | Efecto')
rows, _ = rows_from(G, i)
COSTES = {slug(r[0]): {'name': r[0], 'coste': r[1], 'txt': r[2]} for r in rows[1:]}

i = find(G, 'ROW: | Rareza | NA equivalente | Sintonía')
req, _ = rows_from(G, i)
i = find(G, 'ROW: | Resultado | Rareza')
res, _ = rows_from(G, i)
i = find(G, 'ROW: | Rareza | Nivel apropiado | Ataque')
tec, _ = rows_from(G, i)
D6 = {r[1]: r[0] for r in res[1:]}
TECHO = {r[0]: r for r in tec[1:]}
PROPS_N = {'Común': 0, 'Infrecuente': 1, 'Raro': 2, 'Muy Raro': 3, 'Legendario': 4, 'Artefacto Único': 5}
RAREZAS = {}
for nombre, na, sint, nivel in req[1:]:
    t = TECHO.get(nombre)
    e = {'name': nombre, 'd6': D6[nombre], 'na': na, 'sintonia': sint, 'nivel': nivel, 'props': PROPS_N[nombre]}
    if t:
        e.update({'atk': t[2], 'def': t[3], 'cd': t[4], 'dano': t[5], 'precio': t[6]})
    else:
        e.update({'atk': '+3 y único', 'def': '+3 y único', 'cd': '+3', 'dano': '+1d10', 'precio': 'no comprable'})
    RAREZAS[slug(nombre)] = e
i = find(G, 'ROW: | d20 | Propiedad | Descripción breve')
rows, _ = rows_from(G, i)
PROPS = {}
for rango, nombre, txt in rows[1:]:
    nums = [int(x) for x in re.findall(r'\d+', rango)]
    e = {'name': nombre, 'd20': rango, 'min': nums[0], 'max': nums[-1], 'txt': txt}
    PROPS[slug(nombre)] = e
PROPS['bono_de_ataque']['bono'] = 'atk'
PROPS['bono_defensivo']['bono'] = 'def'
PROPS['dano_elemental']['bono'] = 'dano'
i = find(G, 'ROW: | Maldición | Efecto activo')
rows, _ = rows_from(G, i)
MALD = {slug(r[0]): {'name': r[0], 'txt': r[1], 'cura': r[2]} for r in rows[1:]}
i = find(G, 'ROW: | Tipo | Ud | Fuente afín | Resonancia | Coste')
rows, _ = rows_from(G, i)
FOCOS = {slug(r[0]): {'name': r[0], 'ud': r[1], 'fuente': r[2], 'txt': r[3], 'coste': r[4]} for r in rows[1:]}
i = find(G, 'ROW: | Módulo | CD instalación')
rows, _ = rows_from(G, i)
MODULOS = {slug(r[0]): {'name': r[0], 'cd': r[1], 'tipo': r[2], 'txt': r[3], 'coste': r[4]} for r in rows[1:]}

# ───────────────────────── Etiquetas de Zona ─────────────────────────
i = find(G, 'ROW: | d20 | Etiqueta | d20 | Etiqueta')
rows, fin_t = rows_from(G, i)
NOMBRES_ET = {}
for a, na_, b, nb in rows[1:]:
    NOMBRES_ET[int(a)] = na_; NOMBRES_ET[int(b)] = nb
ETIQ = {}
for n in range(1, 21):
    nm = NOMBRES_ET[n]
    idx = find(G, f'{n} — {nm} ', fin_t)
    desc = G[idx][len(f'{n} — {nm} '):]
    e = {'name': nm, 'txt': desc}
    for campo, ln in zip(['enemigo', 'aliado', 'complicacion', 'objeto', 'lugar'], G[idx + 1:idx + 6]):
        etq, val = ln.split(': ', 1)
        assert slug(etq) == campo, (etq, campo)
        e[campo] = val
    ETIQ[str(n)] = e

# ───────────────────────── Facciones ─────────────────────────
i = find(G, 'ROW: | Facción | F | A | R | PG | Activos representativos')
rows, _ = rows_from(G, i)
FACC = {}
for nombre, f, a, r, pg, act in rows[1:]:
    if not f.isdigit(): continue
    FACC[slug(nombre)] = {'name': nombre, 'f': int(f), 'a': int(a), 'r': int(r), 'activos': act}
i = find(G, 'ROW: | Acción | Atributo | Efecto')
rows, _ = rows_from(G, i)
ACC = {slug(r[0]): {'name': r[0], 'attr': r[1], 'txt': r[2]} for r in rows[1:]}

# ───────────────────────── Estados (Manual Básico, Cap. 10) ─────────────────────────
# ───────────────────────── Estados (Manual Básico, Cap. 10) ─────────────────────────
# La tabla de estados, las «equivalencias de condiciones clásicas» (Encantado,
# Ensordecido, Maldito, Petrificado), el Derribado de las maniobras y el
# Desprevenido del glosario.
i = find(MB, 'ROW: | Estado | Daño por turno | Ud | Efecto secundario')
rows, _ = rows_from(MB, i)
ESTADOS = {}
for nombre, dano, ud, efecto in rows[1:]:
    mud = re.match(r'(Ud\d+)$', ud)
    txt = (f'{dano} por turno. ' if dano not in ('—', '') else '') + efecto
    if ud.startswith('Ud (según'): txt += ' (Su Ud, el de la fuente.)'
    ESTADOS[slug(nombre)] = {'name': nombre, 'ud': mud.group(1) if mud else '', 'txt': txt}
for nombre in ['Encantado', 'Ensordecido', 'Maldito', 'Petrificado']:
    ln = MB[find(MB, nombre + ': ')]
    txt = ln[len(nombre) + 2].upper() + ln[len(nombre) + 3:]
    mud = re.search(r'(Ud\d+) por defecto', txt)
    ESTADOS[slug(nombre)] = {'name': nombre, 'ud': mud.group(1) if mud else '', 'txt': txt}
ln = MB[find(MB, 'Mientras está Derribado: ')]
ESTADOS['derribado'] = {'name': 'Derribado', 'ud': '',
                        'txt': re.search(r'Mientras está Derribado: ([^.]+\.)', ln).group(1)}
ln = MB[find(MB, 'Desprevenido — ')]
ESTADOS['desprevenido'] = {'name': 'Desprevenido', 'ud': '', 'txt': ln[len('Desprevenido — '):]}
assert {'sangrado', 'desgarro', 'trauma', 'envenenado', 'ignicion', 'ralentizado', 'aturdido', 'conmocionado', 'cegado',
        'aterrado', 'paralizado', 'apresado', 'derribado', 'encantado', 'ensordecido', 'maldito', 'petrificado',
        'desprevenido'} == set(ESTADOS), sorted(ESTADOS)
DANOS = ['Cortante', 'Perforante', 'Contundente', 'Fuego', 'Frío', 'Rayo', 'Ácido', 'Veneno', 'Energía', 'Sónico',
         'Fuerza', 'Psíquico', 'Necrótico', 'Radiante']
TABLAS['danos'] = {'name': 'Tipos de daño', 'filas': DANOS}

DB = {
    'na': NA, 'roles': ROLES, 'tamanos': TAM, 'hordas': HORDAS, 'tipos': TIPOS, 'familias': FAM, 'rasgos': RASGOS,
    'plantillas': PLANT, 'peligros': PELIGROS, 'bestiario': BEST, 'tablas': TABLAS,
    'encuentros': ENC, 'grupoAjuste': GRUPO_AJUSTE,
    'riqueza': RIQUEZA, 'costes': COSTES, 'rarezas': RAREZAS, 'propiedades': PROPS,
    'maldiciones': MALD, 'focos': FOCOS, 'modulos': MODULOS,
    'etiquetas': ETIQ, 'faccionesEj': FACC, 'accionesFaccion': ACC, 'estados': ESTADOS,
}
js = ('/* ══════════════════════════════════════════\n'
      '   BASE DE DATOS DE REGLAS — S&S Director\n'
      '   Generada desde el Manual de Monstruos v1 y la Guía del Director v1.\n'
      '   Se puede editar entera desde el Editor de Reglas de la app; al cambiar\n'
      '   este archivo, sube STORAGE.RULES_DATA_VERSION (js/storage.js).\n'
      '══════════════════════════════════════════ */\n'
      'const DEFAULT_DB = ' + json.dumps(DB, ensure_ascii=False, indent=1) + ';\n')
with open(OUT, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(js)
print('escrito', OUT, len(js), 'bytes')
for k, v in DB.items():
    print(' ', k, len(v))
