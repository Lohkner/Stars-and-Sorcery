# S&S Companion — v57.14

## Novedades v57.14 — Grado 5: orbe legendario en filigrana

`CACHE_VERSION` sube a `ss-companion-v122`.

El cabujón ovalado del Grado 5 pasa a ser un orbe legendario, en la línea
de las gemas legendarias de los ARPG (opción F de la muestra):
- **Esfera** (`i-sk-mitico-adr` / `i-sk-mitico-ing`):
  - volumen, con luz arriba a la izquierda y sombra abajo a la derecha
    (`g-sk-vol`);
  - núcleo encendido del color de la reserva (`g-sk-orbe-adr` /
    `g-sk-orbe-ing`);
  - vetas de niebla: ruido fractal (`f-sk-niebla`) fundido en modo
    *overlay*;
  - una luz de rebote abajo, y un brillo con un destello arriba.
- **Montura de filigrana**:
  - aro redondo de oro con un filete interior y luz de borde arriba a la
    izquierda;
  - cuatro volutas enroscadas pegadas al aro, una perla arriba y otra
    abajo, y dos puntas a los lados.
- Se conservan el color de la reserva, el brillo mítico que late y el
  tamaño de la caja.
- Se retiran los degradados del cabujón y de las garras (`g-sk-adr`,
  `g-sk-ing`, `g-sk-sombra`, `g-sk-garra`). El oro de la filigrana reutiliza
  `g-sk-bronce`.
- Autodiagnóstico: 9 de 9.

## Novedades v57.13 — Comillas dobles en la leyenda · Montura y garras del Grado 5

`CACHE_VERSION` sube a `ss-companion-v121`.

- **Leyenda**: comillas dobles tipográficas y doradas (“…”) en lugar de las
  angulares.
- **Montura del Grado 5**:
  - más gruesa: el bisel crece (20,4 × 11,2) y la piedra se recoge
    (15,6 × 7,2);
  - lleva un escalón interior y el granulado más marcado (28 puntos);
  - el oro es menos envejecido: pasa de claro arriba a la izquierda a un
    oro hondo abajo a la derecha, y la luz de borde queda solo arriba a la
    izquierda.
- **Garras**: cuatro, más grandes y curvas, en diagonal. Tienen raíz ancha
  en el bisel, punta que entra en la piedra, degradado propio
  (`g-sk-garra`) y una sombra que las despega de la piedra.
- Autodiagnóstico: 9 de 9.

## Novedades v57.12 — Portada en blanco · Grado 5 en oro viejo

`CACHE_VERSION` sube a `ss-companion-v120`.

### Portada
- **Nivel y alineamiento**: pasan a un blanco casi puro, apenas enfriado
  (`--port-ink: #efedf3`). Se retira el marfil.
- **Nivel**: en versalitas de 12 px, espaciado; el nombre va a 21 px.
- **Alineamiento**: tal como se guarda («Neutral Bueno»), en la letra de
  texto. Se deshace el paso a minúsculas de v57.11.
- **Leyenda**: 13 px, en cursiva, en el tono de texto del resto de la app
  (`--text`), entre comillas angulares en oro.

### Grado 5
El cabujón conserva su forma, su color de reserva y su brillo mítico, pero
deja de parecer un adhesivo:
- **Engaste**: bisel de oro viejo (`g-sk-bronce`, de oro pálido a bronce
  oscuro) con granulado de 26 puntos.
- **Luz**: una luz de borde solo arriba a la izquierda y un surco oscuro
  donde asienta la piedra.
- **Garras**: cuatro, curvadas, en diagonal, mordiendo la piedra. Sustituyen
  a los cuatro botones redondos.
- **Remates**: en punta a los lados, como una montura gótica.
- **Piedra**: más honda. Tiene un núcleo encendido abajo, bordes casi
  negros y una sombra interior bajo el bisel (`g-sk-sombra`).
- **Reflejos**: en lugar de la mancha blanca, un filo de luz fino, un
  destello puntual y un reflejo tenue abajo.
- **Caja**: se oscurece y el color queda solo en un halo leve.
- Se retira el degradado `g-sk-luz`.
- Autodiagnóstico: 9 de 9.

## Novedades v57.11 — Tinta marfil en la portada · Grado 5 del color de su reserva

`CACHE_VERSION` sube a `ss-companion-v119`.

- **Portada**: el nivel, el alineamiento y la leyenda comparten una tinta
  marfil cálida (`--port-ink: #e4d8c0`; gris claro en el tema Vacío) en
  lugar del lila apagado. No es blanco puro: sobre casi negro, el blanco
  deslumbra y competiría con el oro del nombre.
- **Nivel**: sigue en mayúsculas, con la letra de los títulos.
- **Alineamiento**: pasa a minúsculas y a la letra de texto, porque es un
  dato, no un título. Se guarda igual; solo se muestra en minúsculas.
- **Grado 5**: el cabujón deja de ser rojo y toma el color de la reserva,
  como las gemas de los grados inferiores:
  - ámbar de Adrenalina (`#i-sk-mitico-adr`, degradado `g-sk-adr`) si la
    habilidad va con FUE, DES o CON;
  - azul de Ingenio (`#i-sk-mitico-ing`, degradado `g-sk-ing`) si va con
    INT, SAB o CAR.
- **Brillo mítico**: late en ese mismo color (`--mg`), igual que el borde y
  el halo de la caja.
- Autodiagnóstico: 9 de 9.

## Novedades v57.10 — Portada: nombre al frente, biografía como leyenda

`CACHE_VERSION` sube a `ss-companion-v118`.

La biografía (16 px, en el color del texto) pesaba más que el nombre
(16 px) y que el nivel y el alineamiento (12-13 px, mono y apagados). La
jerarquía se invierte, sin estridencias:

- **Nombre**: 21 px (antes 16), en oro, con un halo dorado muy leve.
- **Nivel**: en la letra de los títulos, 13 px, en oro y espaciado (antes
  mono gris de 12).
- **Alineamiento**: en la misma voz, en versalitas de 12 px y color lila
  tenue. Si no hay alineamiento, no ocupa sitio.
- **Biografía**: una leyenda de 14 px (antes 16), en cursiva, apagada y
  entre comillas angulares doradas («…»), con 32 em de ancho máximo.
- Los estilos en línea de `sum_align_ov` y `sum_bio_ov` pasan a las
  clases `.port-align` y `.port-bio`.
- Autodiagnóstico: 9 de 9 con Normal y Muy grande.

## Novedades v57.9 — Letra para móvil · Estado, Capacidades y Defensas · Guardia en Stats

`CACHE_VERSION` sube a `ss-companion-v117`.

### Tamaños de letra
- **Rampa**: los siete pasos a medio píxel (12 · 12,5 · 13 · 14 · 15 · 16 ·
  17) quedan en seis papeles, a tamaño Normal:
  - rótulo 12;
  - detalle 13;
  - secundario 14;
  - énfasis 15;
  - cuerpo 16;
  - destacado 18.
- **Suelo de 12 px**: `--fs-2xs`, `--fs-xs` y `--fs-sm` llevan
  `max(12px, …)`, así que ningún ajuste los baja del mínimo legible.
- **Ajuste «Tamaño de letra»**: pasa a 14,5 · 16 · 17,5 · 19 px (antes
  13 · 16 · 18 · 20).
  - Con «Pequeña» a 13 px, los rótulos bajaban a 9,75 px.
  - Con «Muy grande» a 20 px, el título de la cabecera pisaba «Guardar».
- **Títulos de tarjeta** (`.pt`): de 14 a 15 px, un paso por encima del
  contenido.
- **Campos**: nunca por debajo de 16 px, para que iOS no amplíe la página al
  enfocarlos.
- **Cifras en px fijos** (los PV, los ±): pasan a rem, así que ahora siguen
  el ajuste.
- **Marco de la app**: la cabecera y la barra de pestañas crecen con el
  ajuste solo hasta donde caben (`clamp`).
- **Desbordes corregidos con letra grande**: la fórmula del Arquetipo y el
  rótulo «Adrenalina» de Detalle.
- Autodiagnóstico 9 de 9 con los cuatro tamaños, a 390 px.

### Tarjetas
- **Estado**: Puntos de Vida, Adrenalina, Ingenio, Carne y Descansar.
- **Capacidades** (nueva): lo que sobraba de Estado.
  - Iniciativa (se sigue tirando al tocarla), Velocidad, Competencia y
    Pericias.
  - También la Carga y las Notas rápidas.
  - Plegada muestra «Ini ±N».
- **Defensas** (nueva):
  - la Guardia grande, y Desprevenido y Armadura en filas de rótulo y
    cifra, para que quepan con cualquier tamaño de letra;
  - `calc()` rellena `def_guardia` y `def_desprev` junto a la Guardia,
    y `res_armor` se muda aquí;
  - plegada muestra solo «G: N | A: N».
- **Guardia**: de Perfil a Stats, bajo Tiradas de Salvación. Conserva su
  edición, su lápiz y su resumen.

## Novedades v57.8 — Engastes de Grado en las habilidades

`CACHE_VERSION` sube a `ss-companion-v116`.

- **Engastes**: los cuatro círculos de Grado pasan a ser cuatro engastes
  octogonales de oro, con el hueco oscuro de la piedra (`#i-sk-slot`).
- **Gemas**: cada Grado pone en su engaste una gema de talla brillante
  (`#i-sk-gema`) del color del atributo con que se tira la habilidad (el
  elegido, o el automático):
  - azul de Ingenio (`--res-ing`) si es mental: INT, SAB, CAR;
  - naranja de Adrenalina (`--res-adr`) si es físico: FUE, DES, CON.

  Grado 0 son cuatro engastes vacíos, sin distinción.
- **Grado 5**: un cabujón rojo mítico en engaste de oro pulido, con cuatro
  garras (`#i-sk-mitico`, 48 × 26 px), ocupa el sitio de los cuatro.
  - Su brillo rojo late despacio, salvo con «reducir movimiento».
  - Sustituye a la medalla de v56.6: se retiran `#i-medalla` y las reglas
    `.sk-pip` / `.sk-medalla`.
- Los degradados del oro, del rojo y de la luz del cabujón van en un
  `<svg>` aparte, de tamaño cero, porque el sprite está en `display:none`.
- Verificado a 390 px con Grados 0–5, físicos y mentales; autodiagnóstico
  9 de 9.

## Novedades v57.7 — Amatista en las tarjetas · Iconos por tipo de arma

`CACHE_VERSION` sube a `ss-companion-v115`.

- **Medallas de identidad**: sin gemas. Quedan el engaste fino de oro y el
  «·» dorado entre medallas. Se retiran el símbolo `#i-joya-engaste`, su
  degradado y los tokens `--gema-*`.
- **Tarjetas plegables**: el triángulo que giraba se cambia por una
  amatista engastada en oro.
  - Abierta, la amatista está en pie y brilla. Plegada, se tumba (gira 90°)
    y se apaga un poco.
  - Con ratón, al pasar por encima brilla más.
  - Es una imagen SVG propia en el `::before`, porque un pseudoelemento no
    puede usar el sprite. En el tema Vacío se desatura.
- **Iconos de armas** en el resumen de Equipo & Tesoro, por tipo
  (`_iconoArma`). Se decide por las etiquetas de las notas o, si no hay
  notas, por el nombre. Gana la primera regla que encaje:

  | Tipo | Icono | Ejemplos |
  |---|---|---|
  | Magitec a distancia | pistola | pistola, rifle, lanzagranadas |
  | A distancia | ballesta | arcos, ballestas |
  | Arrojadiza | shuriken | daga, jabalina, hacha de mano, lanza corta |
  | Contundente | maza | maza, martillo, mangual, garrote, bastón, desarmado |
  | Perforante | lanza | lanza, espada corta, espada ropera |
  | Energía | rayo | sable de energía |
  | Cortante y resto | espada | espada larga, espadón, hachas, alabarda |

  Los objetos sueltos con nombre de arma («Shuriken de acero») pasan por la
  misma función.
- Verificado a 390 px con doce armas; autodiagnóstico 9 de 9.

## Novedades v57.6.1 — Medallas con gema abajo · Barras de Estado más cortas

`CACHE_VERSION` sube a `ss-companion-v114`.

- **Identidad**: la presentación definitiva son las medallas de engaste
  fino, con la gema solo en el filo de abajo (sujeta por dos garras de oro)
  y el «·» dorado entre ellas.
  - Se retiran la tríada de v57.6 y sus rótulos (CSS y marcado).
  - La fila vuelve a usar todo el ancho, como cuando su padding iba en
    línea: la reserva de 34 px por lado para el lápiz partía las medallas
    en dos líneas.
  - A cambio, la fila baja 22 px para quedar bajo el lápiz de la esquina.
  - A 390 px, Humano · Audaz · Soldado caben en una fila, sin solaparse
    con el lápiz.
- **Estado**: las barras de PV, Adrenalina, Ingenio y Carne ya no pasan
  bajo los botones. Van bajo el nombre y acaban 12 px antes del −
  (`margin-right:162px`: los 150 px de la columna de controles más el
  hueco de 12).
- Autodiagnóstico: 9 de 9.

## Novedades v57.6 — Identidad en tríada

`CACHE_VERSION` sube a `ss-companion-v113`.

- **Tríada**: el resumen de identidad pasa a tres columnas, sin medallas.
  - Cada columna lleva la gema engastada de su color arriba, el nombre en
    oro y debajo, en cursiva pequeña, qué es (descriptor, arquetipo,
    trasfondo).
  - Las columnas se separan con un filete de oro que se desvanece.
- **Márgenes**: la tríada no usa los 34 px por lado que reservan el hueco
  del lápiz. El lápiz queda en la esquina, por encima de los nombres, y las
  columnas miden unos 100 px, así que ningún nombre del manual se parte a
  media palabra.
- **Dos presentaciones, un marcado**: sin la clase `id-triada` del
  contenedor (`index.html`), vuelven las medallas de engaste fino con la
  gema solo abajo y el «·» dorado entre ellas.
- Verificado a 390 px con Medio Elfo · Audaz · Mercenario, en las dos
  presentaciones; autodiagnóstico 9 de 9.

## Novedades v57.5.1 — Medallas: engaste fino y doble gema

`CACHE_VERSION` sube a `ss-companion-v112`.

- **Borde**: mucho más delgado. Queda un solo filo de oro de 1 px, un hilo
  oscuro por dentro y una leve sombra interior. Se quitan el hilo de oro
  interior y el granulado.
- **Gemas**: cada medalla lleva su gema engastada arriba y otra igual abajo,
  cada una con sus dos garras de oro.
- **Separadores**: vuelve el «·» dorado entre medallas. A 390 px las tres
  caben en una fila.
- Autodiagnóstico: 9 de 9.

## Novedades v57.5 — Medallas enjoyadas de identidad

`CACHE_VERSION` sube a `ss-companion-v111`.

- **Gema de corona**: cada medalla del resumen de identidad lleva sobre su
  filo superior la joya en rombo engastada en oro (símbolo
  `#i-joya-engaste`), con brillo del color de su categoría:
  - amatista para el Descriptor;
  - rubí para el Arquetipo;
  - zafiro para el Trasfondo.

  Dos garras de oro la sujetan al filo, y el tema Vacío tiene tonos
  apagados propios.
- **Borde de engaste**: de fuera adentro, filo de oro vivo, surco oscuro,
  hilo de oro interior y granulado de puntos (milgrain), con una leve
  sombra interior que da hondura.
- **Separadores**: se quitan los «·» entre medallas. Con una gema por
  medalla sobran, y al pasar a dos líneas se quedaban sueltos en los
  bordes.
- **Marcado**: el id `sum_*_badge` pasa a un `<span>` interior, así que
  el `textContent` de `confirmSection` ya no borra la gema.
- **Degradado del oro**: va en un `<svg>` aparte, de tamaño cero, porque
  Chrome no pinta un degradado que viva dentro del sprite en
  `display:none`.
- Verificado a 390 px con nombres cortos y largos; autodiagnóstico 9 de 9.

## Novedades v57.4 — Joyas en la tarjeta de Estado

`CACHE_VERSION` sube a `ss-companion-v110`.

- **Joyas**: los puntos de 6 px junto a Puntos de Vida, Adrenalina, Ingenio
  y Carne pasan a ser una joya en rombo tallado de 14 px, del color de cada
  recurso (símbolo `#i-joya`).
- **Cómo está hecha**: cuatro facetas y una mesa central, en blanco y negro
  translúcidos sobre `currentColor`, más un destello arriba a la izquierda.
  El mismo símbolo sirve para los cuatro recursos y para el tema Vacío.
- **Brillo**: como en las barras, PV, Adrenalina e Ingenio lo llevan; Carne
  no.
- Verificado a 390 px; autodiagnóstico 9 de 9.

## Novedades v57.3.1 — Resumen de Guardia

- Plegada, la tarjeta de Guardia muestra solo el número («11»), no
  «Guardia 11»: el título ya dice «Guardia» (`js/plegables.js`).
- `CACHE_VERSION` sube a `ss-companion-v109`.

## Novedades v57.3 — Botones ± de recursos rediseñados

`CACHE_VERSION` sube a `ss-companion-v108`. Pensados para el móvil.

- **PV**: los botones − y + también en verde.
- **Diseño**:
  - casilla redondeada de 32 px (antes, círculo de 27 px) con un velo del
    color de su recurso, borde a juego y un relieve sutil;
  - los signos se dibujan con trazos, así que siempre están centrados y no
    dependen del estilo de letra. El carácter sigue en el botón, en
    transparente, para el lector de pantalla.
- **Respuesta al dedo**:
  - al pulsar, el botón se hunde (sombra interior) y se aprieta un poco;
  - el brillo al pasar el ratón solo existe en dispositivos con ratón, así
    que en el móvil no se queda pegado tras tocar;
  - el área táctil sigue siendo de 44 px y mantener pulsado sigue
    repitiendo.
- **Topes**: el − se atenúa con el recurso a 0 y el + con el recurso lleno
  (`_updateResBars` pone `.is-tope`). Siguen siendo pulsables; la suma y
  la resta ya se detenían en el límite.
- Verificado a 390 px con toques reales:
  - Ingenio 0 → 1, y su − deja de estar atenuado;
  - PV 13 → 12;
  - autodiagnóstico: 9 de 9.

## Novedades v57.2 — PV en verde · Ingenio en azul místico

`CACHE_VERSION` sube a `ss-companion-v107`.

- **PV**: el punto y el número también pasan a verde (`--res-pv-bar`,
  `--res-pv-bar-ink: #7fd6a3`). Los botones − y + conservan el rojo.
- **Ingenio**: azul místico en la barra, el brillo, el punto, el número y los
  botones. Es el `--ice` de la antigua caja de Fuente de Poder (#3d8fc2), con
  el número en #5aa8d8. Como `--ice` ya lo redefine cada tema, en Arcano y
  Vacío toma su propio azul.

## Novedades v57.1 — Barra de PV en verde

`CACHE_VERSION` sube a `ss-companion-v106`.

- La **barra** de Puntos de Vida pasa a verde esmeralda (`--res-pv-bar:
  #46b97a`; en el tema Vacío, `#7d9c80`), con el mismo brillo de dos capas.
- **Con PV bajos** (25 % o menos) sigue cambiando a brasa, barra y brillo.
- El nombre, el número y los botones de PV conservan su color (`--res-pv`);
  solo cambia la barra.

## Novedades v57.0 — Lápiz en la cabecera, Cancelar y modo edición

`CACHE_VERSION` sube a `ss-companion-v105`. Todo en `js/edicion.js`; la
edición de cada tarjeta (`editSection`, `confirmSection`…) no cambia.

### Lápiz en la cabecera
- Sustituye al «Editar» del pie en las 9 tarjetas editables: retrato,
  identidad, atributos, salvaciones, habilidades, Guardia, Equipo de Combate,
  Equipo & Tesoro y Campaña.
- En las tarjetas plegables va al extremo derecho del título y se ve aunque
  la tarjeta esté plegada, detrás de su resumen. El título sigue plegando; el
  lápiz solo edita y, si la tarjeta estaba plegada, la abre. En el retrato y
  en la identidad, que no tienen título, va en la esquina.
- El lápiz se oculta mientras la tarjeta está en edición.

### Cancelar
- Junto a cada «Confirmar». Al entrar en edición se guarda una foto de la
  ficha; «Cancelar» devuelve **solo los campos de esa tarjeta** y lo que
  arrastran:
  - cambiar de Arquetipo o Linaje arrastra habilidades, Pericias y
    elecciones;
  - Equipo & Tesoro arrastra el inventario, el oro, lo equipado y las
    raciones.
- Lo demás no se toca: PV gastados, tiradas del historial y otras tarjetas
  en edición.
- La restauración usa la ruta de carga de un personaje guardado
  (`clearCharData` + `applyCharData`) y conserva la página y el
  desplazamiento.

### Modo edición
- Botón con el lápiz en el **menú de acciones**: abre las 9 tarjetas en
  edición (despliega las plegadas) y muestra un único **«Terminar edición»**
  flotante que las confirma todas.
- Dentro del modo, «Cancelar» sigue funcionando por tarjeta y el resto sigue
  abierto.

### Arreglado de paso
- Abrir Combate o Equipo desde otra página lanzaba un `scrollIntoView` que
  descolocaba el carril de páginas. Ahora se evita con el indicador de
  edición en bloque que ya tenía la app (`_bulkEditing`).
- El historial de tiradas no se borra al cancelar.

### Verificado
A 390 px:
- 9 lápices y ningún «Editar» al pie.
- Lápiz sobre una tarjeta plegada, con clic real: se abre en edición.
- Atributos: FUE +3 → Cancelar → vuelve a su valor; los PV restados, la
  tirada y la Guardia en edición siguen igual.
- Arquetipo cambiado → Cancelar → Arquetipo, habilidades y Reservas
  idénticos a antes.
- Arma equipada borrada y oro +50 → Cancelar → todo vuelve, arma equipada
  incluida.
- Modo edición: 9 de 9 abiertas; cancelar una deja las otras 8; «Terminar»
  cierra todas.
- Guardar, cargar y cancelar funciona.
- Autodiagnóstico: 9 de 9.

## Novedades v56.9.2 — Brillo en las barras de Estado

`CACHE_VERSION` sube a `ss-companion-v104`.

- **PV, Adrenalina e Ingenio** brillan en su color, con dos capas: un halo
  cercano intenso y otro amplio y suave. Con los PV bajos, el brillo pasa a
  brasa, igual que la barra.
- **Carne** va sin brillo, a propósito.
- **Por qué casi no se veía antes:** las barras ya tenían un brillo tenue,
  pero el carril las recortaba (`overflow:hidden`). En Estado ahora se deja
  salir; la barra nunca pasa del 100 %, así que no hay nada más que
  recortar.
- Autodiagnóstico: 9 de 9.

## Novedades v56.9.1 — Cifras legibles en el Clásico · nombre · «Editar»

`CACHE_VERSION` sube a `ss-companion-v103`.

- **Cifras en el estilo Clásico.** IM Fell English solo tiene números
  antiguos, a media altura: el 0 parecía un «°» y «G2» se leía «G₂» en la
  tirada de habilidad, los títulos y los dados. Las familias del Clásico son
  ahora combinadas (`'SS Fell'` y `'SS Fell SC'` en `css/fuentes.css`): las
  letras son de Fell y las cifras (0–9) de EB Garamond, de altura completa.
  Medido: el «0» pasa de 16 a 26 px de altura en un cuerpo de 40 px, con la
  «H» a 27 px. El texto no cambia.
- **Nombre del personaje** (portada): tiene la misma negrita y espaciado que
  los títulos de talento. Ya era 1 px más grande que ellos, pero sin negrita
  se leía más pequeño.
- **Botones «Editar»**: pasan al tamaño mínimo de la app (12 px), sin
  versales ni espaciado ancho y en un tono más apagado. El área táctil sigue
  siendo de 44 px.
- Autodiagnóstico: 9 de 9 en Clásico y en Moderno.

## Novedades v56.9 — Historial de tiradas

`CACHE_VERSION` sube a `ss-companion-v102`.

- **Las 10 últimas tiradas** del personaje abierto, la más reciente arriba.
  Cada una muestra su nombre, su total, la hora y el detalle de los dados.
  Los críticos se marcan en dorado y los fallos totales en rojo.
- **Dónde se ven:**
  - bajo cada resultado, en el desplegable «Últimas tiradas», que sale
    plegado para no adelantar el total mientras ruedan los dados;
  - desde el **menú de acciones** (engranaje de la cabecera), en el botón del
    d20, que abre solo la lista sin tirar nada.
- **Cómo funciona** (`js/historial.js`): se envuelve `showDiceRoll`, por donde
  pasan todas las tiradas de la ficha (atributos, salvaciones, habilidades,
  iniciativa, ataque y daño), así que ninguna tirada cambia.
- Se guarda solo en memoria: al crear, cargar o importar otro personaje
  (todo pasa por `clearCharData`) empieza de cero. Con el asistente de
  creación abierto sigues con el personaje anterior, y su historial se
  conserva hasta que termines.
- Arrastrar la lista no activa el «desliza para cerrar» de la tarjeta.

### Verificado
A 390 px:
- 12 tiradas de los seis tipos: quedan 10, en orden, y el total de la
  primera coincide con el de la tarjeta.
- Con la lista abierta, la tarjeta cabe en la pantalla.
- El modo «solo lista» oculta los dados. La siguiente tirada vuelve al modo
  normal.
- Otro personaje empieza con la lista vacía y su aviso.
- Autodiagnóstico: 9 de 9.

## Novedades v56.8 — Estilo de letra: Clásico o Moderno

`CACHE_VERSION` sube a `ss-companion-v101`.

«Familia de letra» (Clásica/Sobria/Legible) y «Letra de los títulos»
(Cinzel/IM Fell English) se sustituyen por una sola opción, **Estilo de
letra**, que cambia las cuatro familias a la vez para que no se mezclen
épocas:

| | Logotipo (`--ft`) | Títulos y rótulos (`--fd`) | Texto y cifras (`--fb`) | Metadatos (`--fm`) |
|---|---|---|---|---|
| **Clásico** | IM Fell English SC | IM Fell English | EB Garamond | EB Garamond |
| **Moderno** | Cinzel Decorative | Cinzel | Spectral | JetBrains Mono |

- El Moderno es el aspecto de siempre y el predeterminado. El Clásico se
  aplica con `data-estilo="clasico"` en `<html>`.
- **Migración**: si tenías IM Fell English en los títulos, pasas al Clásico;
  cualquier otra combinación, al Moderno. Las claves `ss_titulos` y
  `ss_font_family` se borran.
- **Letras nuevas** en `fonts/`: EB Garamond (normal y cursiva, variables) e
  IM Fell English SC. Son 146 KB, solo alfabeto latino y licencia OFL, y
  están en la caché sin conexión.
- Fuera: `setFontFamily`, `setTitulos` y las reglas CSS `[data-font]` y
  `[data-titulos]`. Las familias Sobria y Legible usaban letras del sistema
  y desaparecen con la opción.
- Cada botón del selector está escrito con su propio pack, para ver el
  resultado antes de elegir.

### Verificado
- Migración simulada (IM Fell + Sobria guardados): arranca en Clásico y
  borra las claves viejas.
- Las 7 familias se cargan desde `fonts/`.
- Revisados Inicio, Estado, Talentos y Ajustes en Clásico.
- Autodiagnóstico a 390 px: 9 de 9 en Clásico y 9 de 9 en Moderno.

## Novedades v56.7 — Panel de Ajustes reorganizado

`CACHE_VERSION` sube a `ss-companion-v100`.

### Estructura
Cinco secciones plegables, ordenadas por uso, que recuerdan si se dejaron
abiertas (`localStorage.ss_set_secs`; por defecto solo Apariencia):

1. **Apariencia**: tema (con muestra de color), tamaño de letra, familia,
   letra de los títulos y fondo de pantalla. El tamaño de letra pasa aquí
   desde «Interfaz», junto al resto de la tipografía.
2. **Retrato**: «Aplicar a: Este personaje | Todos», tamaño, forma (con
   su silueta dibujada), borde dorado y un único botón de aplicar.
3. **Preferencias**: asistente de creación y recordar posición.
4. **Copias y datos**: todos los personajes (copia / restaurar), un
   personaje (exportar / importar JSON) y reglas (importar / editor).
5. **Aplicación**: Buscar y Forzar actualización lado a lado, y las tres
   versiones en una línea.

### Retirado
- **«Guardar»** del panel: duplicaba el botón Guardar de la cabecera
  (`saveFromSettings` eliminado).
- **Interruptor «Ajustes individuales por personaje»**: se solapaba con
  «Aplicar a». Un personaje solo tiene retrato propio si se pulsa «Aplicar a
  este personaje». Para quitárselo aparece un enlace **«Volver al
  predeterminado en este personaje»** (`quitarRetratoPropio`).
  `togglePerCharPrefs` eliminado; la clave `ss_per_char_prefs` se borra al
  arrancar.
- **«Listo»** al pie (queda la X de la cabecera) y los textos de ayuda
  largos.
- El **Editor de reglas** deja de ser el botón dorado del panel: es de uso
  raro y era lo que más llamaba la atención.

### Arreglos de paso
- **Exportar un personaje** se desactiva si no hay ninguno abierto: antes
  exportaba una ficha vacía.
- Las confirmaciones del retrato («Guardado para todos», «Aplicado solo
  a…») se escriben dentro del panel, porque el toast queda tapado.
- El botón de aplicar perdía su icono al cambiar de texto (`textContent`).
- El rótulo de «Recordar posición» cambiaba a «Activar…/Desactivar…» junto
  al interruptor, que ya dice el estado. Ahora es fijo.
- Cada carga de personaje añadía otro oyente de «close» al panel. Ahora se
  añade uno solo.
- Cerrar el panel descarta la vista previa del retrato directamente, sin
  depender del evento «close» del `<dialog>`.

### Verificado
A 390 px:
- Los 41 botones del panel apuntan a funciones y elementos existentes.
- Desde Inicio, «Este personaje» y «Exportar» aparecen desactivados.
- Con un personaje abierto se probó: aplicar XL solo a él (se guarda en su
  ficha, el enlace de volver aparece al momento), cerrar con una vista previa
  sin aplicar (vuelve a XL) y volver al predeterminado (quita sus ajustes y
  vuelve a M).
- Autodiagnóstico: 9 de 9.

## Novedades v56.6 — Copia de seguridad · letras sin conexión · IM Fell English · armadura sin competencia · Grado 5

`CACHE_VERSION` sube a `ss-companion-v99`; `RULES_DATA_VERSION` a
`1.0-manual-sendas-axiomas-r6`.

### Copia de seguridad de todos los personajes
En **Ajustes → Datos → Todos los personajes**:
- **Crear copia** descarga un solo archivo
  `ss-companion-respaldo-AAAA-MM-DD.json` con todos los personajes guardados,
  retratos incluidos.
- **Restaurar** lo lee y añade sus personajes. Si alguno ya existe con el mismo
  nombre, pregunta antes de reemplazarlo; si cancelas, no se toca nada. Los
  personajes dañados se omiten y se avisa.
- El resultado se muestra en la línea de estado bajo los botones, porque el
  toast queda tapado por el panel de Ajustes.
- Código en `js/respaldo.js`. Un JSON de un solo personaje sigue entrando por
  «Importar JSON».

### Letras instaladas en la app
Cinzel, Cinzel Decorative, Spectral, JetBrains Mono e IM Fell English viven
ahora en `fonts/` (11 archivos woff2, 311 KB, solo alfabeto latino, licencia
OFL) con sus reglas en `css/fuentes.css`. El service worker las guarda con el
resto de la app, así que se ven igual con o sin conexión. La app ya no pide
nada a Google Fonts.

### Letra de los títulos: Cinzel o IM Fell English
En **Ajustes → Apariencia → Letra de los títulos**. Cambia títulos, nombres y
rótulos (`--fd` y `--ft`); el texto sigue con la familia elegida arriba, sea
Clásica, Sobria o Legible.

### Aviso de armadura sin competencia
Manual 1.0, Ap. A: con armadura **Media o Pesada sin competencia**, los
Axiomas se tiran con Desventaja (ataque y Concentración) y cuestan el doble
de Reserva. Equipo de Combate lo avisa cuando se dan las tres condiciones: la
armadura es Media o Pesada, tu Arquetipo no tiene esa competencia, y el
personaje usa Axiomas (tiene alguna Fuente iniciada). No avisa con las
armaduras avanzadas, que el Manual exime.
- **Ignorar** (en el aviso) o la casilla «Tengo competencia por un Talento»
  (en edición) lo silencian. Se guarda con el personaje.
- De paso: la «Coraza de Cristal de Éter» pasa a llamarse **Coraza
  Resonante**, como en el Manual, con su propiedad Fuente descrita.

### Grado 5 de habilidad
- Se puede subir una habilidad a **Grado 5 (Maestría Absoluta)** con el +. El
  Grado automático sigue llegando como mucho a 4: el 5 solo se pone a mano,
  como en el Manual (Maestría Absoluta o Hito de Legado).
- En modo lectura, el Grado 5 se muestra como una **medalla** en lugar de los
  puntos.
- La caja de los puntos es más ancha (78 px) y los puntos pasan de 6 a 8 px,
  para distinguirlos bien en el móvil.

### Retoques visuales
- **Fuente de Poder** deja el recuadro azul y usa el filete dorado de los
  Rasgos.
- **Grados de talento**: el texto pasa de letra de máquina a la letra del
  cuerpo, con filete (dorado para el Grado que tienes, tenue para los que aún
  no).

### Verificado
A 390 px:
- Aviso de armadura con un Sagaz con Afinidad y Cota de Malla. «Ignorar» lo
  quita, y se conserva al guardar y cargar.
- Grado 5 con medalla, y las seis cajas de Grado miden 78 px.
- Copia: exportada (se intercepta la descarga) y restaurada con un nombre
  repetido y uno dañado: pregunta, reemplaza, y omite el dañado.
- Letras: 0 peticiones a Google, y las 11 en la caché sin conexión.
- Autodiagnóstico 9 de 9 con Cinzel y 9 de 9 con IM Fell English.

## Novedades v56.5 — Sin esquinas doradas · Ataques resume el bono

`CACHE_VERSION` sube a `ss-companion-v97`.

- Se retiran las escuadras doradas de las esquinas de las tarjetas (punto 7
  de v56.4). El grano de la textura se queda.
- La tarjeta **Ataques** plegada ya no muestra el daño, sino el **bono de
  ataque del arma principal** («Ataques +4»).

## Novedades v56.4 — Acabado gráfico

`CACHE_VERSION` sube a `ss-companion-v96`. Solo cambia la pintura: nada se
mueve de sitio ni hace algo distinto. Todo el CSS nuevo va en un bloque al
final de `css/main.css` («ACABADO GRÁFICO»), con tokens propios que el tema
Vacío redefine en gris.

1. **Rasgos e Inconvenientes**: se acabó la letra de máquina azul. Ahora van
   en la serif del cuerpo, en marfil, con un filete dorado a la izquierda. Los
   Inconvenientes llevan el filete en rojo apagado.
2. **Estado**: cada recurso tiene su color y su barra. PV en rojo, Adrenalina
   en brasa, Ingenio en violeta y Carne en granate, repetido en el punto del
   nombre, en la cifra y en los botones − y +.
3. **Ataques**: los recuadros «ATK» y «DMG» pasan a ser una espada y un d20
   dibujados. El bono de ataque ya no sale en rojo, sino en marfil.
4. **Retrato vacío**: un emblema grabado (estrella de cuatro puntas en un
   círculo) en lugar de la silueta. Se reconoce por el propio retrato por
   defecto, así que no cambia ningún dato guardado.
5. **Grado de habilidad**: cuatro puntos que se llenan en lugar de «G0». El
   nombre del Grado aparece al pasar el dedo y lo lee el lector de pantalla.
6. **Tipo de talento**: Pasivo en dorado, Habilitador en verde salvia,
   Disparador en brasa y Modificador en violeta.
7. **Tarjetas**: el grano baja suave por toda la tarjeta, no solo por arriba,
   y hay dos escuadras doradas en las esquinas superiores.
8. **Cifras**: una sola familia para los números (la del cuerpo, con cifras
   de ancho fijo), que sigue a la tipografía elegida en Ajustes.
9. **«Sin guardar»** en ámbar, no en rojo.
10. **Equipo & Tesoro**: cada objeto lleva un icono (arma, escudo, armadura,
    mochila, comida, luz, agua, cuerda, herramientas, ropa, foco, brújula o
    bolsa). Se elige por el tipo de dato y, si no, por el nombre.
11. **Raciones**: el − y el + tienen el mismo trato, y el contador pasa de
    azul a dorado.
12. **Editar**: sin marco y con el lápiz en oro tenue. «+ Objeto
    Personalizado» conserva su marco, porque es una acción de edición.

### Verificado
A 390 px, en las cinco pestañas, con un personaje aleatorio y en los tres
temas (Art Déco, Vacío y Arcano). Autodiagnóstico: 9 de 9. Consola sin errores
de la app: los avisos de `navigator.vibrate` los provoca el generador
aleatorio sin un toque real, y ya salían antes.

## Novedades v56.3 — Reglas a la edición «Ultimate» de los cuatro libros

`CACHE_VERSION` sube a `ss-companion-v95`; `RULES_DATA_VERSION` a
`1.0-manual-sendas-axiomas-r5`.

Los cuatro documentos nuevos cambian mucho de **formato** (estilos propios en
el Compendio, tablas nuevas en el Catálogo, glifos ◆✦⚡◈ retirados,
referencias «Cap. N» → «p. N», comillas «»), pero poco de **reglas**. Se
compararon palabra por palabra contra la app —no contra la versión anterior
del libro— y solo se tocó lo que cambia el juego.

### Compendio de Sendas
- **Renombrados**: *Gadgeteer* → **Maestro de Artilugios** («gadget» →
  «artilugio» en todo su texto) y *Legado del Bestias* → **Legado de la
  Manada**. Los personajes guardados se migran solos, conservando el Grado
  (`TALENT_ID_RENAMES`).
- **«TRIGGER» → «DISPARADOR»** en los 26 talentos de ese tipo, y
  «Pasivos/Triggers» → «Pasivos/Disparadores» en Procesamiento Acelerado. La
  app conserva el glifo ⚡ como icono.
- **Lo Prohibido**: pasa a Nivel 3, y sus Grados 2 y 3 a Nivel 6 y 8 (antes 9).
- **Maestría de Fuente**: Grado 2 a Nivel 9 (antes 10).
- **Los nueve Dominios**: el Signo a Nivel 4+ (antes 3+) y la Prerrogativa a
  Nivel 6+ (antes 5+).
- **Sangre Vinculada**: gana la etiqueta GRADO ÚNICO y su epígrafe.
- **Gracia del Rompejuramentos**: nota reescrita («al romper tu Voto, tu
  Gracia pasa a ser Gracia del Rompejuramentos con el mismo Grado»).

### Catálogo de Axiomas
- *Telekinesis Menor* → **Telequinesis Menor** (migración en
  `AXIOM_ID_RENAMES`).
- Armadura de Mago y Armadura Infernal: «DES sustituye a tu atributo
  defensivo» en lugar de «aunque no lleves armadura». Luz: «uses» por
  «lances».
- **Los 18 Axiomas de Dominio** entran en la lista de Divinidad. El Catálogo
  dice que cualquier usuario de Divinidad puede aprenderlos por las vías
  normales, y la app no los tenía. Cada uno lleva «Dominio de X» en su texto,
  así que se encuentran buscando «dominio».

### Manual Básico y Guía del Director
Sin cambios que afecten a la ficha. Del Manual cambian abreviaturas (AoO →
AdO, DoT → DeT), el glosario y una regla nueva: con armadura Media o Pesada
sin competencia, los Axiomas cuestan el doble. La app no aplica penalizaciones
por armadura sin competencia (tampoco las aplicaba antes), porque no puede
saber qué Talentos te la conceden. La Guía solo cambia terminología (Tags →
Etiquetas) y añade un capítulo de criterios para el Director.

### Verificado
- Tras el cambio, la app coincide con los libros: 253 talentos y 369
  Axiomas, sin diferencias salvo las decisiones de presentación ya conocidas
  (Dominios, Orígenes de Herencia, rótulos de Grado).
- Un personaje guardado con *Gadgeteer* G2, *Legado del Bestias* y
  *Telekinesis Menor* se abre con los nombres nuevos y el mismo Grado.
- El gestor de Axiomas de un personaje de Divinidad muestra los 18 de Dominio.
- Autodiagnóstico a 390 px: 9 de 9. Consola limpia.

## Novedades v56.2 — Manuales actualizados · el fondo de pantalla confirma y se puede quitar

`CACHE_VERSION` sube a `ss-companion-v94`; `RULES_DATA_VERSION` a
`1.0-manual-sendas-axiomas-r4`, así que la copia de reglas guardada se
refresca sola.

### Cómo se localizaron los cambios

Se comparó cada talento de `data.js` con el Compendio actual **palabra por
palabra**, sin fijarse en cómo se reparte el texto entre descripción, Grados y
notas. Así solo aparecen cambios de contenido. Cada edición se hizo sobre el
objeto de su talento, con una comprobación de que todo lo demás del archivo
queda byte a byte igual: ningún texto ha pasado de un talento a otro.

### Compendio de Sendas

- **12 Sinergias nuevas**, cada una en su talento y en la posición del libro:
  Magia de Guerra (Presión), La Pregunta Correcta (Deducción), Golpe de Gracia
  (Presión, tras la de Postura), Defensor Implacable (Intervención), Golpe
  Furtivo (Enfoque), Preparación Meticulosa (Preparación), Experto en Todo
  (Enfoque), Maestro del Escudo (Intervención, antes de «Respuesta»), El
  Improvisador (Improvisar), Torsión Arcana (Ejecución, antes de sus dos
  notas), Enemigo Predilecto (Deducción) y Trepador Imposible (Enfoque).
- **Sangre de Gigante**, reescrito: pasa de 4 Grados a 3 (Talla Grande ·
  Gigante a Nivel 4+ · Coloso a Nivel 6+).
- **Galería de Entidades**: el requisito pasa de «atributo clave 15+» a «el
  atributo de tu Fuente 13+».
- Las etiquetas **«Grado Único» → «GRADO ÚNICO»** (26) y **«Acumulable» →
  «ACUMULABLE»** (1).
- Se dejan igual los Nueve Dominios y los Ocho Orígenes de Herencia: están
  igual en todas las versiones del Compendio. Que la app los muestre dentro de
  cada talento es una decisión de presentación anterior, no un cambio del libro.

### Manual Básico

- **Tabla de XP** nueva: 1.500 · 4.500 · 9.000 · 15.000 · 22.500 · 31.500 ·
  42.000 · 54.000 · 67.000. Un personaje guardado **conserva su nivel**; solo
  cambia la cifra que necesita para el siguiente.
- **PD por nivel**: 2 en cada nivel, más 1 en los niveles 5 y 9 (Hito de
  Estilo). Total al Nivel 10: **20 PD**, antes 14.
- **Versátil**: Adrenalina e Ingenio pasan de +5 a **+6** cada una.
- **Rasgos de Arquetipo**, al texto actual:
  - Audaz: desaparece *Lectura de Campo*; *Inercia de Guerra* pasa a formar
    parte de Presión; *Intervención* tiene dos formas definidas: Interponerte
    y Cerrar el paso.
  - Versátil: el *Enfoque* se elige en cada turno, abarata el Esfuerzo de su
    categoría y lleva la tabla de qué abarca cada una. Cambia el ejemplo de
    *Improvisar*.
  - Sagaz: *Deducción* pierde «Ya sabía eso» y «El eslabón», y gana Analizar
    un lugar, umbral o rastro fuera de combate. *Preparación* pierde «Plan B».
    *Ejecución* se queda en Excluir y Reencuadrar (Aplazar y Contener viven
    ahora en la Sinergia de Torsión Arcana).
  - Los apodos pasan a «El que se planta», «El que se las arregla» y «El que
    lo vio venir».
- Selector de Fuente: **Psiónica (INT/SAB)** y **Divinidad (SAB/CAR)**, como
  dicen el Manual y el Compendio.
- El intercambio de habilidades iniciales (Versátil 3, Sagaz 4) ya estaba así
  en la app.

### Guía del Director

Es idéntica a la entregada la vez anterior. No hay nada que cambiar.

### Fondo de pantalla

**Causa.** `localStorage` tiene un cupo (≈5 MB) que comparte con los
personajes y sus retratos. Al llenarse, `setItem` lanzaba una excepción que
cortaba la función **antes** de mostrar el botón de quitar y el aviso. El fondo
se veía, pero no se guardaba y se perdía al recargar. Aunque se guardara bien,
el aviso «Fondo actualizado» salía **debajo** del panel de Ajustes, que es un
`<dialog>` modal, así que nunca se veía.

**Arreglo.**
- La confirmación está ahora dentro del propio panel: una miniatura del fondo
  guardado y una línea de estado («Procesando imagen…», «Guardada en este
  dispositivo» en dorado, o el aviso de falta de espacio en rojo).
- El botón de quitar aparece siempre que haya fondo, se haya podido guardar o
  no.
- Si no cabe, se prueba con versiones más ligeras (1400 → 1100 → 860 → 640 px)
  antes de rendirse, y se libera primero el fondo anterior.

### Verificado

En el navegador, con la caché limpia:
- Datos: 253 talentos, las 12 Sinergias en su sitio, Sangre de Gigante con 3
  Grados, Galería con el requisito nuevo, 27 etiquetas en mayúsculas y
  ninguna en el formato viejo, XP y PD nuevos, Versátil 6/6.
- Fondo: subir, confirmar, miniatura, botón visible y quitar funcionan. El
  almacenamiento lleno se simuló: hubo 4 intentos, aviso rojo, fondo visible
  durante la sesión y botón de quitar presente.
- Autodiagnóstico: 9 de 9. Consola limpia.

## Novedades v56.1 — El resumen de Letalidad dice solo el nivel

`CACHE_VERSION` sube a `ss-companion-v93`.

El distintivo del resumen de Campaña decía **«Letalidad 2 — +2 + MOD CON por
nivel»** y ocupaba 353 px en dos líneas. Ahora dice **«Letalidad 2»** y ocupa
129. La fórmula sigue donde se consulta —en las tarjetas del modo edición—;
repetirla en el resumen llenaba dos líneas con algo que en mesa no se mira.

### Verificado

Los tres niveles dan «Letalidad 1», «Letalidad 2» y «Letalidad 3», con el
`data-tier` correcto para el color. El cálculo no se ha tocado: a nivel 5 los
PV siguen dando 31 · 35 · 39 según el nivel de Letalidad —+1, +2 y +3 por
nivel—, y a nivel 1 los tres coinciden porque aún no hay ningún nivel ganado
al que aplicar la bonificación. Autodiagnóstico: 9 de 9. Consola limpia.

### Y una corrección a lo que dije en v55.5

Afirmé que «Nuevo personaje» ya no partía en dos líneas en la pantalla de
Inicio. **Era falso**: comprobé que no se *recortara*, que no es lo mismo que
no *partir*. El texto pide 151 px y la columna solo le daba 116, así que
seguía en dos líneas. La rejilla pasa de `1fr 1fr` a `1.45fr 1fr` —la acción
principal necesita más sitio que «Importar»— y el acolchado lateral baja de 14
a 10 px. Medido ahora con `Range.getClientRects()`, que cuenta líneas de
verdad: **una línea** cada botón.

## Novedades v56.0 — La Carne es un pool de vida · Respiro completo · autodiagnóstico · todo plegable

`CACHE_VERSION` sube a `ss-companion-v91`.

### La Carne, corregida al revés de lo que hicimos en v55.4

El Manual 1.0 es tajante: **«Flesh (Carne) — Segundo umbral vital = puntuación
completa de CON. Al llegar a 0: Muerte»**, y «el Flesh solo baja por efectos
que lo ataquen expresamente». Es un **segundo pool de vida**, no un contador de
daño: nace lleno y baja.

En v55.4 la puse a 0 al crear personaje, siguiendo la etiqueta del campo
—«Daño de carne actual»— que era justamente lo que estaba mal. Ahora:

- Nace **llena**, como PV, Adrenalina e Ingenio.
- Las etiquetas dicen «Carne», no «Daño de carne».
- El reposo prolongado que sumaba +1 hacia el máximo **ya era correcto**: es
  curación (1 punto por semana completa de reposo, Cap. 10).

### El Respiro recupera Reservas

Manual 1.0: «1d8 + MOD CON en PV **y un cuarto de cada Reserva máxima
(Adrenalina e Ingenio), redondeando hacia arriba**». La app tenía
`reservas:0`. Además, el motor de descanso solo entendía «toda» y «la mitad»:
cualquier otra fracción se trataba como mitad. Ahora `reservas` es la fracción
real y el aviso dice cuánto ha devuelto.

### Autodiagnóstico: `?check=1`

Abre la app con `?check=1` y en cinco segundos te dice si la versión está sana.
No toca ningún personaje guardado: monta uno de prueba en memoria y termina en
Inicio. Nueve comprobaciones, y ninguna es decorativa —cada una corresponde a
algo que se rompió de verdad estas semanas—:

- los elementos que la ficha necesita para calcular existen (36 ids);
- Guardia contra su fórmula, con los dos atributos y los bonos;
- Carne = puntuación de CON; PV con la base del Arquetipo;
- ningún texto se sale de su caja, en las cinco páginas;
- ningún texto por debajo de 12 px;
- sin desbordamiento horizontal;
- las 17 tarjetas plegables abren y cierran;
- sin errores de consola durante la pasada.

**Encontró un fallo en su primera ejecución**: `res_guardia` no existe en el
marcado. `_calcGuardia` le escribía —con guarda, así que no rompía nada— y
`plegables.js` lo usaba como respaldo que nunca llegaba a leerse. Es un id de
una maqueta anterior; fuera de los tres sitios.

### Todo lo plegable

Se pliegan ahora **17 tarjetas**: las tres de Perfil que ya lo eran, más las de
Stats (Pilares, Salvaciones, Habilidades), Aptitudes (Talentos, Rasgos, Trucos,
Conjuros), Equipo (Combate, Raciones, Tesoro) y Detalle (Campaña, Linaje,
Arquetipo, Talentos Activos). Sin resúmenes nuevos: las que ya tenían uno lo
conservan y el resto enseña solo su título.

Quedan sin plegar el retrato y «Identidad & Origen», que son la portada.

### Un solo símbolo por título, y gira

Las tarjetas plegables llevaban **dos** marcas: el rombo `◆` de todo título de
panel y el triángulo del plegado. Ahora en las plegables el triángulo sustituye
al rombo, y en vez de cambiar de glifo `▸`/`▾` **gira 90°** con transición —que
es lo que da la sensación de abrir y cerrar—. Los paneles no plegables
conservan su rombo, así que sigue habiendo exactamente un símbolo por título.

### Limpieza

Los dos respaldos (2,4 MB) salen del árbol de la app a
`../SS-Companion-respaldos/`, y `_isTrickEntry` pierde la rama que clasificaba
por un coste que empezara con «adr»: hoy no clasificaba nada, pero el día que
un Axioma tuviera ese coste se habría colado entre los Trucos sin avisar.

### Verificado

Autodiagnóstico: **9 de 9** en 4,8 s. Carne = CON (15) y nace llena; el reposo
semanal la sube de 9 a 10. Respiro con Adrenalina 25 e Ingenio 15 devuelve
exactamente 7 y 4 —los techos de `ceil(max/4)`— y lo dice en el aviso. Las 14
tarjetas nuevas existen, pliegan y **ninguna añade resumen**; con todas
plegadas, las cuatro páginas caben en 686 px. El triángulo gira de 0° a 90° y
el rombo desaparece solo en las plegables. Sin `?check=1` no se pinta nada del
informe. Consola limpia y sin desbordamiento horizontal.

## Novedades v55.11 — Tres tarjetas más que se pliegan

`CACHE_VERSION` sube a `ss-companion-v90`.

Se pliegan ahora, igual que las demás:

- **Aptitudes** → Rasgos
- **Detalle** → Linaje · Arquetipo

**Sin texto de resumen**, como se pidió: plegadas enseñan solo su título. No
hizo falta código para conseguirlo —basta con no darles entrada en el mapa
`RESUMEN` de `js/plegables.js`, porque `pintarPeek()` se retira sola cuando la
clave no está—.

Van abiertas por defecto y su estado se recuerda en `localStorage` junto al de
las otras, como preferencia de quien juega: no viaja en el JSON del personaje
ni lo marca como no guardado.

### Verificado

Las tres son `<details>` con su `<summary>`, y el clic en la cabecera abre y
cierra. Plegadas no muestran resumen y sus títulos no se recortan. Los títulos
dinámicos de Detalle siguen actualizándose dentro del `<summary>`: cambiar de
Linaje da «Linaje: Dracónido» y de Arquetipo, «Arquetipo: Audaz»; los cuerpos
se siguen pintando enteros (8 bloques cada uno). Sin textos desbordados en
Aptitudes ni en Detalle, sin desbordamiento horizontal, y el estado plegado
queda guardado en `ss_folds`. Consola limpia.

## Novedades v55.10 — Los rótulos de Guardia dentro de su caja, y un barrido de textos desbordados

`CACHE_VERSION` sube a `ss-companion-v89`.

### La tira de la fórmula de Guardia

Medido a 375 px: las cajas son de 61 px con 51 de hueco interior, y los
rótulos pedían más.

| Rótulo | Pedía | Se salía |
|---|---|---|
| `Atributo` | 70 px | **19 px** |
| `Escudo` | 58 px | **7 px** |
| `Comp.` | 51 px | justo al límite |

Dos causas: las palabras y el espaciado entre letras de `.1em`. Se abrevian a
**`Esc.`** y **`Atrib.`** —como sugeriste— y el espaciado baja a `.03em`.
Ahora el más largo se queda en 53 px dentro de 53. Ninguno se sale.

Con la quinta parte —el segundo atributo— la tira no cabe en una fila: entre
los cuatro `+` y los huecos quedan unos 50 px por caja y los rótulos piden 53.
Se deja envolver, pero con **tope de ancho**: antes la quinta se estiraba sola
a los 309 px de la tira y parecía un fallo; ahora sale centrada y de ancho
normal, como una segunda línea deliberada.

### Barrido de textos desbordados

Los barridos anteriores buscaban texto **recortado** (`overflow:hidden` con
contenido de más). Eso no ve el caso de Guardia, donde el texto se sale de su
caja con `overflow:visible`. El detector nuevo compara el ancho real del texto
con el de su caja, y descuenta un falso positivo importante: los botones ± de
Estado dan `scrollWidth` de 35 sobre 25 por el pseudoelemento de 44 px que les
da área táctil —su texto mide 9—.

Un hallazgo real además de Guardia: la insignia **`DMG`** de los botones de
ataque medía 30×30 con borde y el texto pedía 32, así que cruzaba el marco.
Pasa a ancho elástico con suelo de 30.

### Verificado

Con el detector corregido, **cero textos desbordados** en: las cinco páginas en
modo edición y en modo confirmado, el Gestor de Axiomas, el de Talentos,
Ajustes & Datos, la pantalla de Inicio, tres pasos del asistente —incluido un
Linaje abierto con su sub-bloque—, el formulario de objeto personalizado y el
editor de reglas. Probado además con un nombre de personaje deliberadamente
largo. Sin desbordamiento horizontal del cuerpo. Consola limpia.

## Novedades v55.9 — Limpieza: fuera el segundo generador aleatorio y 4 300 bytes de CSS muerto

`CACHE_VERSION` sube a `ss-companion-v88`.

Auditoría con evidencia —nada se quitó «porque parecía»—: un análisis estático
localizó candidatos y cada uno se confirmó contra el DOM vivo antes de tocarlo.

### La inconsistencia de fondo: había dos generadores aleatorios

El menú lateral de la ficha llamaba a `randomize()` y el asistente al suyo.
**Solo el segundo respeta las reglas.** El de `randomize()` sorteaba los tres
Talentos de golpe sin mirar `req`, elegía arma y armadura sin comprobar la
competencia del Arquetipo ni el requisito de FUE, y dejaba las elecciones de
Linaje en blanco —tanto, que `js/origen.js` le había puesto un parche encima
para rellenarlas a posteriori—.

El botón del menú apunta ahora al generador del asistente, y con él se van:

| Fuera | Líneas |
|---|---|
| `randomize()` en `js/app.js` | 140 |
| el parche de `randomize()` en `js/origen.js` | 22 |

Verificado antes de borrar nada: 8 tiradas seguidas desde el menú, con el
asistente **desactivado**, sin un solo Talento con requisitos sin cumplir, sin
armas fuera de competencia ni por debajo del requisito de FUE, sin elecciones
de Linaje en blanco y con los recursos al máximo.

### Código muerto

- **`_sourceAttrMod()`** en `app.js`: su propio comentario decía «lo usa la
  Conducción Arcana del Sagaz», y ese Rasgo desapareció al reescribir el
  Arquetipo para el Manual v5.0. Cero llamadas.
- **31 clases CSS** de la tarjeta de Estado anterior al rediseño `est4` —la
  familia `res-box`, `res-ctrl`, `res-lbl`, `res-max`, los `res-btn-*` de
  color, `res-fill-*`— más `sc-clickable`, `sc-lbl`, `g3c`, `mb4`, `mb5` y
  `mft`. **43 reglas fuera, 4 317 bytes menos.**

  Comprobado en el DOM real antes de borrar: se recorrieron las cinco páginas,
  los tres gestores, Ajustes, las vistas de edición, la pantalla de Inicio, el
  formulario de objeto personalizado, el editor de reglas y el asistente —381
  clases distintas en uso— y ninguna de las 31 aparecía.

### Una colisión de cascada mía

`.est4 .e4-num` estaba declarado dos veces: la primera con
`align-items:baseline` y la segunda —el parche que añadí en v55.2 al subir los
campos a 44 px— con `center`. La primera nunca se aplicaba. Fusionadas en una
sola regla, con el motivo escrito al lado.

### Lo que NO se tocó, y por qué

Hay más selectores con propiedades declaradas dos veces (`.char-lvl-badge`,
`.home-body`, `.char-port`…): son secciones de rediseño que pisan a propósito
a las anteriores. Reordenarlas es churn con riesgo de regresión y ninguna
ganancia funcional, así que quedan anotadas y en su sitio.

Tres «funciones invocadas sin definir» que marcó el análisis —`checkForUpdate`,
`forceUpdate`, `personajeAleatorio`— y una «definida sin uso» —`saveCustomItem`—
son ceguera del detector: las dos primeras se declaran con `async`, la tercera
se asigna por identificador y la cuarta se invoca desde un `data-action`
generado en JS. Verificadas a mano una por una.

### Verificado tras la limpieza

Arranque limpio; las cinco páginas con las **mismas alturas exactas** que antes
(1712 · 841 · 1303 · 962 · 1711 con las secciones confirmadas) y **cero
recortes**; los tres gestores abren con su contenido (327 Axiomas, 21
Talentos); Ajustes abre; el dado del menú y el del asistente producen
personajes legales; guardar y cargar funciona y deja la etiqueta limpia. La
tarjeta de Estado conserva sus áreas táctiles (campos 44–45 px, ± 45×45) y la
fila de PV alinea número, separador y máximo con **0 px** de desvío. Sin
desbordamiento horizontal. Consola limpia.

`css/main.css`: 3 583 líneas. `js/app.js`: 6 212.

## Novedades v55.8 — Los tres bonos de Guardia, alineados

`CACHE_VERSION` sube a `ss-companion-v86`.

En móvil la caja de «Otro Bono» quedaba 18 px más alta que las otras dos. No
era el tamaño de las cajas: eran las **etiquetas**. A 375 px, «Bono de
Atributo» y «Bono Mágico» partían en dos líneas (36 px) y «Otro Bono» cabía en
una (18 px), así que su desplegable arrancaba justo esa línea más arriba.

Los tres comparten ahora un rótulo —**«Bonos a la Guardia»**— y cada etiqueta
se queda en una palabra: `Atributo · Mágico · Otro`. Ninguna parte, las tres
cajas arrancan a la misma altura y el bloque ocupa una línea menos.

Y por si alguna etiqueta acabara partiendo de todos modos —otro idioma, un
texto más largo—, cada celda es una columna flex con el desplegable pegado
abajo: quedan alineadas por su base pase lo que pase con el rótulo.

### Verificado

A 375 px: desalineación **0 px** —las tres cajas en la misma coordenada—,
ninguna etiqueta partida ni recortada, cajas de 97×43 y sin desbordamiento
horizontal. La Guardia sigue sumando bien: 14 sin bonos, 15 con SAB (+1), 17
añadiendo +2 mágico y 18 con +1 de otro. Consola limpia.

## Novedades v55.7 — Apagar el Borde Premium quita el dorado de verdad

`CACHE_VERSION` sube a `ss-companion-v85`.

En v55.6 arreglé que el ajuste **se quedara puesto**, pero no que se **viera**:
apagado seguía habiendo dorado alrededor del retrato. Esta vez, en lugar de
mirar las dos clases que yo conocía, escaneé toda la cadena de elementos que
envuelve la imagen buscando cualquier cosa que pintara oro. Aparecieron dos:

| Elemento | Qué seguía pintando |
|---|---|
| `.port-card` | borde `rgba(200,169,110,.18)` — oro rebajado, pero oro |
| `.panel-accent` | borde `rgba(200,169,110,.25)`, halo dorado y un filete superior en degradado |

El segundo es el marco del bloque entero —retrato más identidad— y **no lo
tocaba ninguna regla del modo apagado**: era el que más se veía. Ahora los tres
—marco, panel y filete— pasan a `var(--edge)` y `var(--rim)` cuando el Borde
Premium está apagado.

### Verificado

Escaneando la cadena completa desde el `<img>` hasta el `<body>`: con el borde
apagado quedan **cero** elementos pintando dorado —ni borde, ni halo, ni
pseudoelementos—, tanto con el retrato confirmado como en modo edición.
Encendido vuelven los dos. Comprobado también en captura: el marco dorado del
retrato y el del panel desaparecen y quedan en gris neutro. Consola limpia.

## Novedades v55.6 — Segundo atributo a la Guardia · «sin guardar» que sí avisa · retrato y fuente que se quedan puestos

`CACHE_VERSION` sube a `ss-companion-v84`.

### 1 · Bono de Atributo en la Guardia

Desplegable nuevo junto a Bono Mágico. Hay Talentos que suman el MOD de un
segundo atributo —Defensa sin Forma es el caso claro: `10 + PB + MOD DES +
MOD SAB`, la única fórmula del sistema con dos— y no había dónde declararlo.
Se falseaba con «Otro Bono», que es un número fijo y no seguía al atributo
cuando subía.

El término entra en el total y en Desprevenido, y aparece en la tira de la
fórmula con el nombre del atributo elegido. Sin elegir nada, ni se pinta.

### 2 · El aviso «sin guardar»

Dos fallos, uno encima del otro:

- **`_markUnsaved` se bloqueaba a sí mismo.** La marca `fresh` («guardado hace
  un momento») dura 3,5 s y también impedía el aviso, así que cualquier cambio
  hecho justo después de guardar dejaba la ficha con cara de estar al día.
- **Media app no avisaba.** Cada acción tenía que acordarse de llamar a
  `_markUnsaved()` y varias no lo hacían: los talentos —el caso que se
  reportó—, el inventario, las aptitudes, los desplegables de Guardia y de
  combate, los atributos.

Ahora hay **un solo sitio** del que cuelgan todos los controles de la ficha: un
listener delegado sobre `#app-screen` para `change` e `input`. Los cambios que
no pasan por un evento del DOM —talentos por input oculto, inventario,
aptitudes— siguen avisando a mano. El panel de Ajustes queda fuera: son
preferencias, no datos del personaje.

### 3 y 4 · Retrato y tamaño de fuente: la misma causa

Cada guardado hacía una **foto del ajuste global** y la metía en el `_prefs`
del personaje, aunque el jugador nunca hubiera pedido ajustes propios. Al
reabrir la ficha esa foto pisaba lo global. De ahí las dos quejas: apagar el
Borde Premium no servía de nada —volvía al abrir el personaje— y el tamaño de
fuente había que ponerlo uno por uno.

- `_prefs` lleva ahora la marca **`propias`**, que solo pone «Aplicar a este
  personaje». Sin ella, el personaje hereda lo global. Las fichas antiguas se
  dan por no propias, que es lo que el jugador espera.
- **El tamaño de fuente sale de `_prefs`**: es tamaño de la interfaz, no un
  dato del personaje. Uno solo para toda la app.
- Y se nota que se aplicó: la fila de Ajustes dice **«Grande · 18px · toda la
  app»** y sale un aviso al tocarlo.

**El interruptor del borde también se veía igual encendido que apagado** en la
vista de edición del retrato: 0,4 → 0,22 de alfa sobre el mismo trazo. Ahora el
premium lleva halo dorado y el sutil ninguno, así que la diferencia se ve al
configurarlo y no solo con la ficha confirmada.

### Verificado

**Guardia**: con SAB (+1) el total pasa de 14 a 15 y Desprevenido de 12 a 13;
la parte extra aparece con su etiqueta y desaparece al quitarla; la tira no
desborda y los tres desplegables llenan su columna a 44 px de alto.

**«Sin guardar»**: avisa en las ocho acciones probadas —Descriptor, atributo
base, 2.º atributo de Guardia, añadir objeto, quitar objeto, elegir talento,
elegir conjuro y un cambio justo después de guardar—. Y **no** avisa donde no
debe: cargar un personaje por su camino real deja la etiqueta limpia, y tocar
el tamaño de fuente no ensucia la ficha.

**Retrato y fuente**: apagar el Borde Premium y guardarlo como global sobrevive
a recargar el personaje; un personaje nuevo hereda el global; y uno con prefs
propias conserva las suyas sin contaminar el global. El tamaño de fuente
aguanta el cambio de personaje (18 px, «Grande», eco correcto).

Consola limpia, sin desbordamiento horizontal a 375 px.

## Novedades v55.5 — El bono de Linaje ya no se come el nombre

`CACHE_VERSION` sube a `ss-companion-v83`.

En el paso de Descriptor, la etiqueta del bono iba con el texto largo de
`bonus` —«+1 a dos Atributos distintos a elección»— y en móvil se montaba
encima del nombre del Linaje. Ahora se comprime a lo que hay que decidir:

| Antes | Ahora |
|---|---|
| `+1 a dos Atributos distintos a elección` | `Elegir +1, +1` |
| `+2 a un Atributo a elección, +1 CON` | `Elegir +2 · +1 CON` |
| `+2 CAR, +1 INT o DES` | `+2 CAR · +1 INT/DES` |
| `+2 FUE o DES, +1 CON` | `+2 FUE/DES · +1 CON` |

Tres pasos, y el orden importa: primero se separan las cláusulas con «·»,
después se expanden las elecciones —que meten sus propias comas— y por último
las alternativas de atributo pasan a barra.

El texto de la ficha no se toca: `bonus` sigue igual en `js/data.js` y la
compresión vive solo en la tarjeta del asistente.

### Y la cabecera de la tarjeta deja de poder aplastarse

La etiqueta lleva `flex-shrink:0`, así que sin `flex-wrap` un texto largo
empujaba el nombre a cero de ancho y se le montaba encima. Ahora `.wiz-opt-h`
envuelve: si algún día una etiqueta no cabe, cae a su propia línea en vez de
pisar nada.

### Verificado

Los once Linajes a 375 px: **ninguno solapa**, ninguno parte en dos líneas y
ningún nombre queda recortado. `Humano` y `Medio Elfo` dan `Elegir +1, +1`;
`Mutante`, `Elegir +2 · +1 CON`; `Infernal`, `+2 CAR · +1 INT/DES`;
`Cambiante`, `+2 FUE/DES · +1 CON`. Consola limpia.

## Novedades v55.4 — La Carne arranca en 0

`CACHE_VERSION` sube a `ss-companion-v82`.

El generador aleatorio de la pantalla de Inicio rellenaba la Carne al máximo y
la ficha salía con **«14/14»**. Ahora arranca en **0**, con el máximo intacto:
`0/14`. Los otros tres recursos siguen llenos, que sí son reservas que se
gastan.

Era el único sitio que la poblaba: el dado del asistente y la creación a mano
ya la dejaban en 0.

### Verificado

Los tres caminos de creación dan Carne en 0 con su máximo correcto —aleatorio
de Inicio `0/10`, dado del asistente `0/15`, personaje nuevo a mano `0/8`— y
PV, Adrenalina e Ingenio siguen llenos donde corresponde. Guardar y recargar
conserva el 0.

### Una contradicción que esto deja a la vista

El campo se llama **«Daño de carne actual»** en su propia etiqueta, y con eso
0 significa sano — que es justo lo que se acaba de arreglar. Pero
`progresion.js` trata la Carne como una reserva que se cura hacia arriba: el
reposo prolongado hace `cur_carne + 1` con tope en el máximo. Comprobado:
partiendo de `0/13`, una semana de reposo deja `1/13` y dos semanas `2/13`.
Es decir, **descansar añade daño**.

Antes no se notaba porque el aleatorio te dejaba ya al máximo y el reposo no
movía nada. No se ha tocado: cuál de las dos lecturas es la buena —contador de
daño o reserva que se recupera— es una decisión de reglas.

## Novedades v55.3 — Resumen de Ataques solo con el daño · dado de personaje aleatorio en el asistente

`CACHE_VERSION` sube a `ss-companion-v81`.

### La tarjeta de Ataques, plegada, enseña solo el daño

El bono de ataque se consulta al tirar, con la tarjeta abierta; el dado de
daño es lo que se quiere tener a la vista sin desplegar nada. `Ataque +6 ·
Daño 1d8+4` pasa a `1d8+4`.

### Dado de personaje aleatorio, junto a «A mano»

Botón nuevo en la cabecera del asistente. Lo importante es **cómo** genera:
no sortea sobre la ficha, sino que rellena el **mismo borrador** que
rellenaría una persona y lo vuelca con `volcar()`. Así pasa por los mismos
filtros que el asistente en vez de tener su propia idea de qué es legal —si el
asistente no te deja tomar algo, el dado tampoco—.

En concreto:

- **Talentos**: se eligen de uno en uno **re-evaluando** con
  `app._parseTalentReq` tras cada elección, porque tomar una Iniciación abre
  los Talentos que la exigen. Sortear los tres de golpe daba fichas con
  requisitos sin cumplir.
- **Armas**: salen de `armasPermitidas()`, que ya filtra por competencia del
  Arquetipo, más el requisito de FUE del arma —que el Audaz ignora, como dice
  su entrada—. El tope de dos armas se consulta con `topeArmas()`, que depende
  de si la primera es simple.
- **Atributos**: método A (4d6 descartando el menor) repartidos por prioridad
  del Arquetipo, con el atributo de la Fuente colado en segundo lugar si el
  Linaje abre una. Un Sagaz no sale con INT 8.
- **Elecciones de Linaje**: bono de atributo (respetando `distinct`),
  Expresiones y el Truco de la Afinidad, que se guarda por **nombre** y con el
  mismo criterio (`type === 'trick'`) que usa el desplegable del paso.
- **Guardia**: no se sortea. Se toma el mejor de los tres atributos
  elegibles, que es lo que haría cualquiera al construir.

Antes de volcar, el borrador pasa por `queFalta()` **paso a paso** — el mismo
juez que enciende el botón «Continuar»—. Si algo no cuadra no se crea a
medias: se abre el asistente en el paso que falla, ya relleno, y el aviso dice
qué falta.

### Un fallo que esto destapó

El asistente entregaba los personajes con **0 PV**: `calc()` deja los máximos,
pero los actuales se quedaban en el 0 con el que `newCharManual()` limpia la
ficha. Afectaba también a la creación normal, no solo al dado. Ahora los tres
recursos se rellenan al máximo después de `calc()`.

### Verificado

**16 tiradas seguidas, cero incidencias**: ningún Talento con requisitos sin
cumplir —evaluados contra la ficha ya volcada, sin el contexto prestado del
asistente—, ninguna arma fuera de la competencia del Arquetipo (Sagaz solo
simples, Versátil ligeras o medias), ningún arma con FUE insuficiente salvo en
el Audaz que la ignora, ningún Linaje con Afinidad sin Truco resuelto, y
ninguno arrancando herido. 5 de las 16 abrieron Fuente por Afinidad. El
resumen de Ataques da `1d8+4`; los de Estado y Guardia siguen igual. Consola
limpia y sin desbordamiento horizontal.

Nota sobre los Trucos: hoy los 24 son un fondo común (`source: "Trucos"`), así
que la rama que prefiere un Truco de la propia Fuente no llega a activarse y
se sortea sobre todos, igual que hace el desplegable. Queda escrita por si el
Catálogo los reparte por Fuente más adelante.

## Novedades v55.2 — Revamp de sistema: suelo tipográfico, contraste y objetivos táctiles

`CACHE_VERSION` sube a `ss-companion-v80`. Respaldo previo en
`_backup_pre_revamp_ux_v55.1/`.

Se aplica la **capa de sistema** del revamp de UX/UI: tipografía, color y
tamaño de control. **No** se toca la arquitectura: el retrato conserva sus
tokens (`--port-w: 288px`, `--port-h: 410px`), Perfil sigue siendo la portada
del personaje y la navegación sigue con sus cinco pestañas.

### El suelo tipográfico sube de 9 a 12 px

Los siete pasos de la escala conservan sus nombres —así que ningún componente
cambia— y se recalibran para que el más bajo sea 12 px:

| Token | Antes | Ahora |
|---|---|---|
| `--fs-2xs` | .56rem · 9 px | .75rem · **12 px** |
| `--fs-xs` | .6rem · 9,6 px | .78rem · 12,5 px |
| `--fs-sm` | .66rem · 10,6 px | .8125rem · 13 px |
| `--fs-md` | .72rem · 11,5 px | .875rem · 14 px |
| `--fs-lg` | .78rem · 12,5 px | .9375rem · 15 px |
| `--fs-xl` | .85rem · 13,6 px | 1rem · 16 px |
| `--fs-2xl` | .92rem · 14,7 px | 1.0625rem · 17 px |

La rampa es plana a propósito: aquí los pasos marcan **rol** —rótulo, dato,
cifra—, no jerarquía; la jerarquía la hacen los números grandes, que van en px
explícitos y no se han tocado.

### El rojo se parte en dos

`--blood` daba **4,21:1** sobre el panel, por debajo del 4,5 de AA para texto
normal, y es el color de los avisos. Ahora:

- `--blood: #e07a88` — el color de **texto** (6,2:1).
- `--blood-fill: #d45363` — el relleno saturado de barras, botones y
  distintivos, donde el contraste de texto no aplica porque encima va blanco.

Cinco sitios pasan al relleno: el fondo de borrar personaje, el check de
Letalidad 1, el degradado de Guardar y la línea decorativa. Los temas Vacío y
Arcano reciben su propio `--blood-fill`.

### Objetivos táctiles

- Las filas de recurso pasan de `min-height: 33px` a **44**. Los ± de
  Adrenalina, Ingenio y Carne medían 45×33 de área efectiva; ahora 44×43.
- El campo numérico de cada recurso medía **27×21** —el control más pequeño de
  la app siendo de los que más se usan— y ahora mide 44 de alto. El ancho lo
  fija la rejilla de `.e4-ctl` y sigue en 26–34 px: el hueco central de 74 px
  lo comparte con el separador y el máximo.

### Dos ajustes que el tamaño nuevo obligó

- **El logotipo de cabecera** partía en dos líneas y el encabezado crecía a
  88 px, justo en la página que hace de portada. El logotipo cede: baja a
  `--fs-md` y su espaciado de `.16em` a `.04em` —169 px de una línea que solo
  tiene 124—. Cabecera de vuelta a 64 px.
- **Las cajas de atributo** tenían 74 px fijos con `overflow:hidden` y el
  contenido pasó a pedir 85. Suben a 88.

### Verificado

Barrido de las cinco páginas a 375×812: **cero texto por debajo de 12 px** en
toda la app, cabecera y navegación incluidas, y **cero recortes** (excluyendo
los truncados a propósito con `text-overflow: ellipsis`). Sin desbordamiento
horizontal del cuerpo. Los ± de PV dan 44×44 y los de Adrenalina 44×43. El
Gestor de Talentos, el de Axiomas y los siete pasos del asistente no recortan
nada; los 13 chips de filtro de arma pasan de 3 filas a 4. Consola limpia.

El retrato mide 276×393 a 375 px de ancho — **el mismo valor que antes del
cambio**, comprobado contra el respaldo: a ese viewport ya lo escalaba una
media query desde los 288×410 del token.

### El precio, medido

Las páginas crecen, que es la contrapartida de subir el suelo:

| Página | Antes | Ahora |
|---|---|---|
| Perfil | 1 609 px | 1 712 px (+6 %) |
| Stats | 768 px | 841 px (+10 %) |
| Aptitudes | 1 103 px | 1 303 px (+18 %) |
| Equipo | 888 px | 962 px (+8 %) |
| Detalle | 1 379 px | 1 711 px (+24 %) |

### Una corrección al diagnóstico

En la propuesta dije que la app cargaba cinco familias tipográficas «una de
ellas Arial, un fallback colándose». Es falso: Arial solo aparece dentro de
`[data-font="legible"]`, que es una de las tres tipografías que ofrece Ajustes
y está puesta a propósito. En el tema por defecto son tres familias —Cinzel,
Spectral y JetBrains Mono— más Cinzel Decorative para el logotipo. No se ha
tocado nada de eso.

## Novedades v55.1 — Asistente: cerrar con el mismo toque · buscador y filtros de arma · «A mano» conserva lo hecho

`CACHE_VERSION` sube a `ss-companion-v79`.

### Un toque abre, otro cierra

En Descriptor, Arquetipo y Trasfondo, volver a tocar la opción abierta la cierra. Cerrar **no borra lo elegido dentro**: reabrir la misma opción lo devuelve tal cual, y solo se reinicia al pasarte a otra distinta. Por eso hace falta recordar cuál fue la última abierta —tras cerrar, el campo está vacío y compararlo no bastaría—.

### La lista de armas tiene buscador y filtros

Eran 31 entradas seguidas. Ahora hay un buscador (nombre, propiedades y dado de daño) y una fila de chips: **Simple · Marcial · Ligera · Pesada · Versátil · Dos Manos · Sutil · Arrojadiza · A distancia · Cortante · Perforante · Contundente · Magitec**, con el recuento vivo «N de M» debajo.

Los chips **suman** condiciones: `Arrojadiza` da 4 y `Arrojadiza + Ligera` da 2. Un chip que no encuentra nada dentro de tu competencia no se pinta —al Sagaz no le sirve un «Marcial» que siempre da cero— y aparece «Quitar filtros» en cuanto hay alguno puesto.

Las propiedades salen de `notes`, que las lleva separadas por «·». La lista de chips es curada a mano y no sacada de los datos, porque ahí hay ruido que no filtra nada: alcances como `150/600`, `Munición Ud10`, `Área 15 pies`.

Elegir un arma repinta **solo la lista y el pie**, no el paso entero: si no, el buscador perdería el foco a cada toque y la vista se iría arriba — el mismo criterio que ya seguía la lista de Talentos.

### «A mano» conserva lo diligenciado

Salir por «A mano» a media creación ya no tira el trabajo. Vuelca a la ficha lo que llevabas —atributos, Linaje, Arquetipo, Trasfondo, habilidades, Talentos, Salvaciones, nombre, Convicción, retrato— y deja las secciones **abiertas** en modo edición, que es justo lo que se ha pedido al salir: seguir rellenando a mano.

Dos detalles: sin nada repartido no se tocan los atributos (dejar ochos por todas partes sería peor que una ficha nueva en blanco), y el macuto de partida solo se mete si se llegó al paso de Equipo — a quien se sale en el Arquetipo no se le añade a la mochila un equipo que no ha visto.

### Verificado

Abrir/cerrar: tocar el Linaje abierto lo cierra, el pie vuelve a «Elige un Linaje» y el bloque de elecciones desaparece; reabrir el mismo devuelve los bonos ya elegidos (`FUE`, `CON`); pasarse a otro los reinicia. Igual en Arquetipo, donde reabrir conserva las habilidades marcadas.

Armas: 30 de 30 al entrar; `Arrojadiza` → 4 (Daga, Lanza corta, Hacha de mano, Jabalina); `+ Ligera` → 2; «Quitar filtros» vuelve a 30 y apaga los chips; buscar «arco» → 2, buscar «sutil» → 6; una combinación imposible da «0 de 30» con su aviso. Al elegir un arma se conservan búsqueda, filtros, posición y **el foco del buscador**, y la etiqueta pasa a «has elegido una simple, puedes llevar una segunda».

«A mano»: nada más abrir deja la ficha en blanco; parando en Trasfondo conserva 15/14/13/12/10/8, `humano`/`audaz`/`soldado`, 4 habilidades marcadas, secciones en edición y **sin** equipo; parando en Equipo con un arma elegida trae el arma, el escudo fijo del Arquetipo, el macuto y el nombre, y deja pendiente la armadura que aún no habías elegido. Sin desbordamiento horizontal a 375 px. Consola limpia.

## Novedades v55.0 — El equipo fija el máximo de Raciones · las Raciones no van por Ud · la Cantimplora va por Vigilias

`CACHE_VERSION` sube a `ss-companion-v78`; `RULES_DATA_VERSION` a `1.0-manual-sendas-axiomas-r3`.

Dos correcciones sobre la tarjeta de v54.7.

### El límite son las Raciones establecidas en Equipo

La tarjeta ya no crea comida. Ahora funciona como los PV: **el inventario fija el máximo** —lo que el jugador se ha establecido en Equipo y Tesoro— y la tarjeta lleva la cuenta de las que quedan.

- La cabecera muestra **`restantes/establecidas`** y el número grande lleva un «de N» debajo.
- Se pintan **todas** las latas establecidas: las doradas son las que quedan, las punteadas las que ya te comiste. El hueco es el dato.
- El `+` se apaga al llegar al máximo, y el `−` a cero. Para llevar más hay que añadirlas en Equipo — la nota lo dice cuando no tienes ninguna.
- Comprar sube el máximo y las nuevas se llevan encima (8/10 tras gastar 2 de 5 y comprar otras 5). Quitarlas del inventario recorta las restantes.
- Comer no toca el inventario, igual que perder PV no baja los PV máximos. Cada vista dice una cosa y solo una: **Equipo y Tesoro muestra el total** (`Raciones ×10`, que es el límite) y **la tarjeta rastrea las que quedan** (`7/10`). Sin comparativas repetidas en dos sitios.
- Un personaje guardado antes de esta tarjeta —o recién creado— llega **lleno**: sin recuento previo, lo razonable es dar por llenas las que acaba de establecer. Un 0 guardado a propósito sí se respeta.

### Las Raciones no tienen Dado de Uso

La tabla de equipo de aventurero del Manual 1.0 da **«Raciones (×5) · 5 pp · 1 Slot · Ud: —»**. Nuestro `data.js` arrastraba un `Ud8` de una versión anterior, y el generador de personajes aleatorios lo repetía en el nombre del objeto. Corregido en los dos sitios, y la migración limpia el `Ud8` de los nombres ya guardados. (El recuadro del Cap. 10 menciona «Ud8 por cada 5 raciones»; manda la fila de la tabla, que es la línea técnica del objeto.)

Sube `RULES_DATA_VERSION` para que la copia de reglas en `localStorage` no siga sirviendo el `Ud8` viejo.

### La Cantimplora se tira por Vigilia, no por Guardia

`misc.cantimplora` decía «Clima cálido: tira tras cada **Guardia** activa». El manual dice **Vigilia** —la unidad de tiempo de la exploración en exteriores, 4–6 horas—, y *Guardia* es la estadística defensiva, así que ahí no confundía un poco: confundía del todo. Corregido.

Barrido del resto de `data.js`, `constants.js`, `app.js` e `index.html` buscando el mismo cruce (`cada/por/N Guardia`, `Guardia activa/completa/nocturna`): era el único caso. Los demás usos de «Guardia» son la estadística —escudos, Posturas, auras, Reacciones— y están bien.

### Verificado

Sin Raciones: `0/0`, ambos botones apagados, «sin existencias». Comprar 5 → `5/5` con el `+` apagado. Gastar 2 → `3/5`, 3 latas doradas y 2 punteadas. Comprar otras 5 → `8/10`, y la fila de Equipo pasa a `Raciones ×10` sin comparativa. Gastar y descansar no la mueven: sigue en `×10` mientras la tarjeta baja a `7/10`. Bajar la cantidad del inventario a 4 con 7 restantes las recorta a 4. Guardar y cargar conserva `2/4`; un `0` guardado vuelve como `0/5` sin rellenarse solo; una ficha vieja con `Raciones (×5) · Ud8` llega como `Raciones`, `5/5`, 1 Slot; un personaje nuevo arranca en `0/0` sin heredar el anterior.

Cantimplora: tras invalidar la copia de reglas, la nota que sirve la app es la corregida, y no queda ningún «Guardia» usado como unidad de tiempo en `DB.misc`.

Descanso: a 0 restantes, Respiro, Largo Inseguro y Largo Seguro dejan PV, Adrenalina e Ingenio **exactamente igual** y el menú se queda abierto; el Confortable cura a cero Raciones. Con Raciones, el Respiro gasta 1 —«−1 Ración (quedan 4)» en el mismo aviso, sin apilar un segundo— y **no toca** la cantidad del inventario. Sin desbordamiento horizontal a 375 px. Consola limpia.
