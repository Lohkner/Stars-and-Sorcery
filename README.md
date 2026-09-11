# S&S Companion — v56.2

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

