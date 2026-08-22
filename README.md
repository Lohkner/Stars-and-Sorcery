# S&S Companion — v52.2

## Novedades v52.2 — La ficha del Linaje deja de ser un muro de texto

`CACHE_VERSION` sube a `ss-companion-v59`. Solo presentación de Identidad, más un desplegable nuevo.

El recuadro bajo el selector de Linaje volcaba `bonus` y **todo** `grant` unido por comas. En el Infernal eran doce líneas seguidas en cursiva donde no se distinguía un Rasgo de un Inconveniente, y repetía entera la Elección de Experiencia **que ya tiene su propio desplegable justo debajo**.

Ahora se queda solo con lo que hace falta para *elegir* linaje, en cuatro líneas jerarquizadas:

```
El Marcado. Pilares: Pacto · Estigma. Algo en tu ascendencia…   ← sabor, cursiva
+2 CAR, +1 INT o DES                                            ← bonos, en dorado
Rasgo — Afinidad de Pacto: tienes Acceso a Pacto…               ← decide tu Fuente
Inconveniente — Estigma: Desventaja en Reacción…                ← el precio
```

Los demás Rasgos siguen enteros en la pestaña **Detalle**, que es donde se consultan; no se ha perdido texto, solo ha dejado de estar dos veces. Los linajes sin Afinidad muestran tres líneas.

### Selector de Afinidad

Los seis linajes con Afinidad ganan su propio bloque en Identidad, junto a los bonos y la Elección de Experiencia:

- **Afinidad de Linaje** — la Fuente que abre, como chip. No es elegible (la fija el Descriptor), y va en azul para que no se lea como un bono de atributo más.
- **Truco de \<Fuente\>** — desplegable con los 24 Trucos. Esta sí es una elección real que la ficha no recogía: la Afinidad dice «además, aprendes 1 Truco de Pacto» y no había dónde anotarlo. Se ofrecen los 24 porque el Catálogo los declara transversales a todas las Fuentes — «la Fuente cambia cómo se manifiestan, no su mecánica».

Se guarda solo (`gatherCharData` serializa todo `<select>` con id) y aparece en Detalle junto al resto de elecciones.

### Verificado

Los once linajes: los seis con Afinidad muestran chip + Truco y cuatro líneas de ficha; los cinco sin ella, tres líneas y ningún control de Afinidad. Ciclo completo con un Infernal —Truco *Mano Mágica*, Experiencia *Lengua de la Mentira*, bono +1 INT—: guardar, abrir otro personaje, volver a cargarlo y encontrarlo todo intacto, con la Fuente en Pacto. Detalle lista `Truco de Pacto: Mano Mágica`. Consola limpia.

## Novedades v52.1 — Los botones de actualización actualizan

`CACHE_VERSION` sube a `ss-companion-v58`. Solo toca el flujo de actualización.

El fallo era de diseño, no de mecánica: **la actualización estaba escondida detrás de un segundo toque**. Pulsabas «Buscar actualización», la app encontraba la versión nueva… y en vez de aplicarla mostraba un aviso flotante que había que tocar. Si tocabas fuera, o no lo veías, el worker se quedaba en espera y el botón parecía no hacer nada. Encima salían **dos avisos casi idénticos** superpuestos: uno del arranque (`updatefound` de `boot.js`, que se dispara al llamar a `reg.update()`) y otro del propio botón.

Ahora:

- **«Buscar actualización» aplica.** Quien pulsa un botón con ese nombre ya ha dicho que sí. Si encuentra versión nueva, activa el worker y recarga: `Buscando actualización…` → `Actualizando…` → recarga.
- **El aviso del arranque sigue siendo tocable.** Ese no lo pidió nadie, así que es una notificación, no una orden.
- **Un solo aviso.** `app._buscandoActualizacion` silencia el de `boot.js` mientras dura la comprobación manual.
- **Si el servidor sirve otra versión y el navegador no la ve** (CDN, proxy), ya no propone forzar: fuerza.
- **Al volver de la recarga, la app dice en qué versión se ha quedado** — `Actualizada — ss-companion-v58` o `App descargada de nuevo — ss-companion-v58`. Sin esto la app se reiniciaba sin más y ambos botones parecían no haber hecho nada, que era la mitad de la queja.

Ese aviso llega **con la carga terminada y dura el triple** (`opts.hold` nuevo en `app.toast`). Nacía debajo del velo de carga y se gastaba sus 3,2 s sin que nadie lo viera — comprobado midiendo: el toast se creaba y moría antes de que la pantalla estuviera lista.

### Verificado con clics reales

Instalada la v60, publicada la v61 en el servidor, Ajustes muestra las dos versiones distintas. Un clic en «Buscar actualización» → aplica, recarga y confirma **«Actualizada — ss-companion-v61»**, con el caché viejo borrado. Sin versión nueva responde `Ya tienes la última versión (ss-companion-v60)`. «Forzar actualización» pide confirmación, borra caché y service worker, recarga con `?_fresh=` (que `boot.js` limpia de la barra), confirma **«App descargada de nuevo»** y deja intactos `localStorage`, personajes y reglas.

## Novedades v52.0 — Manual Básico v5.0, Compendio de Sendas v5.6, Catálogo de Axiomas v2.2

Actualización de reglas completa. `RULES_DATA_VERSION` pasa a `5.0-manual-v5-sendas-v56-axiomas-v22` y `CACHE_VERSION` a `ss-companion-v57`.

### Lo que cambia en el juego

**La Iniciación deja de ser un talento y pasa a ser siete.** «Iniciado Místico» desaparece; en su lugar están *Iniciado en Erudición · Psiónica · Divinidad · Naturaleza · Pacto · Herencia · Juramento*, cada uno abriendo su Fuente. Detrás llegan **Adepto de Fuente** (techo Nivel 6) y **Maestría de Fuente** (techo Nivel 9).

**El Sagaz ya no se inicia gratis en una Fuente.** El manual es explícito: «si quiere una Fuente, gasta un Talento como cualquiera». Su Misticismo Innato desaparece y lo sustituyen tres Rasgos que no dependen de tener Fuente — **Deducción** (Analizar + la Deducción por sujeto), **Preparación** (Preparativos por Descanso Largo) y **Ejecución** (Excluir · Reencuadrar · Aplazar · Contener · Repartir). `_channelOpen()` deja de abrir el Canal por ser Sagaz.

**Las Afinidades de Linaje.** Seis Descriptores traen una Afinidad, y ya no es una opción: es un Rasgo fijo. Elfo → Erudición · Infernal → Pacto · Aesir → Divinidad · Mutante → Psiónica · Dracónido → Herencia · Cambiante → Naturaleza.

**El Versátil** recupera *Combate* en su lista de Enfoques (ahora son seis) y gana *Oportunidad*: cambiar de Enfoque una vez por escena cuando la situación cambia de categoría.

### Cómo lo implementa la app

La Afinidad hace exactamente las dos cosas que el manual le atribuye:

1. **Habilita su Fuente.** Al elegir un Linaje con Afinidad, la Fuente de Poder se preselecciona sola y el desplegable la marca — «Erudición (INT) — Afinidad de tu Linaje». Cambiar de Linaje mueve la Afinidad con él; una Fuente que hayas elegido a mano en el Gestor no se pisa nunca.
2. **Cuenta como el Talento de Iniciación.** Un requisito «Iniciado en Erudición» se da por cumplido con la Afinidad Arcana del Elfo, y **solo** en esa Fuente: al mismo personaje le sigue faltando «Iniciado en Pacto». `_fuentesIniciadas()` es el único punto que decide esto, y lo alimentan tanto los siete Talentos de Iniciación como la Afinidad.

El evaluador de requisitos entiende las tres formas nuevas: `Iniciado en cualquier Fuente`, `Iniciado en <Fuente>` e `Iniciado en Juramento o en Divinidad`. Y deja de bloquear seis átomos que no son talentos y antes trataba como si lo fueran — `Competencia con armas marciales`, `elección permanente`, `Modo`, `Don`, `En Ruptura`, `dos talentos de esta Senda`.

### Los talentos, uno por uno

**254 talentos en 23 Sendas** (antes 256), regenerados desde el Compendio. Cada uno lleva ahora su **tipo** (◆ PASIVO · ✦ HABILITADOR · ⚡ TRIGGER · ◈ MODIFICADOR, con sus etiquetas FUNDACIONAL / Grado Único / Acumulable), que dice cómo entra en juego antes de decir qué hace.

**Las notas salen de los Grados.** Sinergias, Respuestas y listas de opciones viven en el Compendio *fuera* de los bloques de Grado. Meterlas dentro del último las escondía de quien solo tiene el Grado 1; ahora son un campo `notes` propio del talento y se pintan aparte, en cursiva y sin fondo de bloque.

Verificación del texto, que era el encargo explícito. Sobre los 254 talentos y sus **700 Grados**:

| Comprobación | Resultado |
|---|---|
| Grados duplicados, desordenados o no consecutivos | 0 |
| Grados vacíos | 0 |
| Dos Grados fundidos en un mismo texto | 0 |
| Texto de Grado repetido entre talentos distintos | 0 |
| Grado que arranca con el nombre de otro talento | 0 |
| Línea técnica o separador de Senda colado en un Grado | 0 |
| `desc` contaminada con una línea técnica | 0 |
| Nombres o ids duplicados | 0 |
| Líneas del documento sin representar | 0 |

Dos casos que el documento trae mal formados y se han corregido al importar:

- **Las Concesiones** traía sus tres Grados fundidos en una sola línea (`Grado 1 — … Grado 2 · Nivel 4+ — … Grado 3 · Nivel 7+ — …`). Se separan, y los seis regalos pasan a notas.
- **Los nueve Dominios de Divinidad** se escriben sin línea técnica propia porque su estructura se declara una vez en la cabecera de sección. El parser genérico los descartaba enteros. Se reconstruyen como talentos de tres Grados — Mandato / Signo (Nv3+) / Prerrogativa (Nv5+) — con requisito `Iniciado en Divinidad`.

**Los Ocho Orígenes de Herencia** dejaron de ser talentos comprables y son ahora una elección al abrir la Fuente: su lista se adjunta como notas de *Iniciado en Herencia* para que no se pierda.

### Axiomas

**351 Axiomas** del Catálogo v2.2, con sus siete columnas completas (Nivel · Coste y Reserva · PA · Concentración · Efecto · Salvación). Solo cinco Fuentes tienen catálogo: Pacto culmina en Nivel 4 por diseño, Erudición es la única que llega al 9. Herencia escribe su propio repertorio (Manifestaciones) y Juramento no tiene catálogo.

Doce nombres se repiten entre Fuentes —*Disipar Magia* está en Erudición, Divinidad y Naturaleza, a distinto Nivel en cada una—, así que las tarjetas del Gestor muestran ahora la Fuente junto al nombre. Como el buscador mira el nombre, escribir «pacto» filtra el catálogo entero de esa Fuente.

### Migración de fichas guardadas

`TALENT_ID_RENAMES` crece con 15 renombres verificados uno a uno comparando el Grado 1: los siete `Voto de X` → `Gracia de X` de la Senda de Juramento (texto idéntico letra por letra), más `Voto de Servicio` → `El Servicio`, `Represalia del Patrón` → `Represalia del Patrono`, `Banneret del Patrón` → `Voz Delegada`, `Voz del Contrato` → `Nombre Invocado`, `Herencia Maldita` → `La Estirpe`, `Canal Compartido` → `Fuente Compartida`, `Resonancia del Canal` → `Oído Abierto` y `Trascendencia Mística` → `Maestría de Fuente`.

**No** se mapean los que se repartieron entre varios talentos o dejaron de serlo: `Iniciado Místico` (elegir por el jugador cuál de las siete Fuentes le tocó sería inventarse su ficha), `Afinidad Mística`, `Pacto`, `Regalo Oscuro`, `La Letra Pequeña`, `Hechizo de Toda una Vida` y los ocho Orígenes de Herencia. Esos muestran «⚠ No encontrado» conservando el nombre y la leyenda guardados. Los requisitos, en cambio, sí siguen reconociendo el viejo `Iniciado Místico (Fuente)` de esas fichas.

### El editor de reglas

Gana los dos campos nuevos —**Tipo** y **Notas del talento** (una por línea)— para que siga editando la mecánica entera y no solo una parte.

### Verificado en el navegador

Base cargada desde cero: 23 Sendas, 254 talentos, 351 Axiomas, 11 Linajes, consola limpia. Los 254 requisitos pasan por el evaluador sin una sola excepción. Comprobado que el Sagaz solo ya no abre el Canal; que el Elfo lo abre y preselecciona Erudición; que cambiar a Infernal mueve la Fuente a Pacto; que una Fuente elegida a mano sobrevive al cambio de Linaje; que *Mente Arcana* (Erudición) se cumple con la Afinidad del Elfo mientras *Las Concesiones* (Pacto) sigue pidiendo su Iniciación; y que los selectores de Elección de Experiencia salen con 2, 3 y 12 opciones según el Linaje —el Mutante con sus dos Expresiones y su bono de +2 aparte—.

## Novedades v51.12 — El actualizador dice la verdad, y tiene salida de emergencia

`CACHE_VERSION` sube a `ss-companion-v56`; `RULES_DATA_VERSION` se queda en `1.8-manual-sendas-v22-r7`.

El flujo de actualización se probó de punta a punta en local —instalar una versión, publicar la siguiente, recibir el aviso, tocarlo, comprobar que el código nuevo corre— y **funciona**. El problema es que cuando *no* funciona, la app no sabía decir por qué: respondía «Ya tienes la última versión» tanto si de verdad no había nada nuevo como si el servidor publicaba algo que este navegador se negaba a ver (un CDN cacheando `sw.js`, un proxy, archivos que nunca se subieron). Dos fallos muy distintos con el mismo mensaje.

**Ajustes → Aplicación** ahora enseña dos versiones en vez de una:

```
Versión de la app:          ss-companion-v56   ← la que corre en este dispositivo
Publicada en el servidor:   ss-companion-v56   ← la que sirve el hosting ahora mismo
```

La segunda se lee pidiendo `sw.js` con `cache:'no-store'` y extrayendo su `CACHE_VERSION`. Si las dos no coinciden, el problema es de distribución, no de la app — y se ve de un vistazo.

**«Buscar actualización»** usa esa comparación: si no hay worker en espera pero el servidor sirve otra versión, en vez de mentir avisa `El servidor sirve X y tú tienes Y — toca para forzar`.

**«Forzar actualización»** (botón nuevo) es el último recurso: da de baja el service worker, borra los cachés `ss-companion-*` y recarga con `?_fresh=<ts>` para que ni el navegador ni un CDN puedan devolver el HTML rancio. `boot.js` limpia esa marca de la barra de direcciones nada más arrancar, para que nadie la guarde en favoritos. **No toca `localStorage`**: personajes y reglas se conservan — y el diálogo de confirmación lo dice.

Verificado en local: instalación limpia → v55 → aviso → toque → v56 corriendo con el código nuevo; el botón «Buscar actualización» por su camino real de click; la rama de discrepancia; y `forceUpdate` completo (cachés borrados y reconstruidos desde red, SW reinstalado, URL limpia, `localStorage` intacto).

## Novedades v51.11 — Estado plegado: solo los PV

Solo presentación. `RULES_DATA_VERSION` se queda en `1.8-manual-sendas-v22-r7`.

Plegada, la tarjeta de Estado resumía `PV · Adrenalina · Ingenio`. En pantallas de móvil ese resumen ocupaba tanto que el título de la tarjeta se recortaba y se leía «Esta…» en vez de «Estado».

El resumen se queda **solo con los PV** (`RESUMEN.estado` en `js/plegables.js`). Es el dato que se consulta de un vistazo en mesa; Adrenalina e Ingenio están a un toque, al desplegar. Guardia y Ataques mantienen su resumen tal cual.

Medido a **375, 320 y 280 px**, con letra normal, grande y XL, y forzando el caso peor de tres cifras (`PV 188/188`): el título nunca se recorta, el resumen nunca se recorta, y quedan entre 27 y 100 px de hueco libre entre ambos. Cero desbordamiento de cabecera y de página.

## Novedades v51.10 — El indicador de plegado, a la izquierda

Solo presentación. `CACHE_VERSION` sube a `ss-companion-v53`; `RULES_DATA_VERSION` se queda en `1.8-manual-sendas-v22-r7`.

El triángulo dorado de las tarjetas plegables de Perfil —Estado, Guardia y Ataques— se salía de la tarjeta en móvil. Iba al final de la cabecera con `order:9` y `margin-left:auto`, es decir, **colocado por el espacio sobrante**: si algo de la fila medía más de lo previsto, el indicador era lo primero en salirse.

Ahora va **al principio y en flujo normal**, anclado al borde izquierdo, que es además donde lo ponen todos los demás desplegables de la app (`details > summary::before`). Al no depender del espacio sobrante, no puede desbordar.

Dos anclajes más para que la cabecera ceda en vez de empujar: el título (`.pt`) y el resumen de una línea (`.fold-peek`) se recortan con puntos suspensivos antes de forzar el ancho.

Medido con las tarjetas abiertas y plegadas a **375, 320 y 280 px**, y en los cuatro tamaños de letra de la app: cero desbordamiento en la cabecera y cero desbordamiento horizontal de página. El indicador ocupa 14–16 px a la izquierda.

**«desde equipo» se retira** de la cabecera de Ataques.

## Novedades v51.9 — Fuera las cabeceras redundantes del chasis

Solo presentación. `CACHE_VERSION` sube a `ss-companion-v52`; `RULES_DATA_VERSION` se queda en `1.8-manual-sendas-v22-r7`.

En Detalle, el chasis imprimía una cabecera de sección justo encima de una tarjeta con el mismo nombre: **«Sustrato — Analizado»** sobre una tarjeta llamada «Analizado», y **«Permiso — Previsión»** sobre «Previsión». Se dice dos veces lo mismo en dos renglones.

La cabecera desaparece y la clasificación pasa a la propia tarjeta, en el hueco del tipo:

```
▸ Analizado    SUSTRATO
▸ Previsión    PERMISO
```

Así no se pierde a qué bloque pertenece cada aptitud —Sustrato y Permiso son categorías con significado en el sistema—, pero se lee una sola vez.

**El Perfil conserva su cabecera** porque no es redundante: agrupa varios rasgos con nombres propios (Veterano de Guerra, Lectura de Campo) y ya usan su hueco de tipo para el marcador `◆ pasivo`.

La tarjeta del Audaz pierde dos renglones; la del Versátil y la del Sagaz, dos cada una.

## Novedades v51.8 — Rasgos de Arquetipo reescritos

`RULES_DATA_VERSION` sube a `1.8-manual-sendas-v22-r7` y `CACHE_VERSION` a `ss-companion-v51`.

Los once rasgos de los tres Arquetipos se sustituyen por la redacción revisada del autor, más corta y sin la prosa de color del manual.

**El bloque Límite desaparece.** Su contenido queda incorporado dentro del Sustrato al que pertenece, que es donde se lee mejor:

- «Solo puedes beneficiarte de Presión contra una criatura con la que hayas intercambiado al menos un ataque…» → dentro de **Presión**.
- «Puedes mantener Analizadas tantas criaturas como tu modificador del atributo de tu Fuente activa…» → dentro de **Analizado**.
- «Solo puedes tener un Enfoque activo a la vez. Cambiarlo requiere un Respiro.» → dentro de **Enfoque**.

La ficha pasa a mostrar tres secciones —Perfil, Sustrato y Permiso— en vez de cuatro.

**Las viñetas se pintan como lista.** Seis de los rasgos nuevos las llevan y el render las volcaba de corrido dentro del párrafo. Ahora cada `•` es un elemento con su punto en oro y su sangría. Recuento verificado: Misticismo Innato 4, Analizado 4, Previsión 5, Enfoque 5, Intervención 3.

**Cambios de regla que trae la redacción nueva**, más allá del estilo:

- **Enfoque** gana un efecto que antes no tenía: «las Habilidades de su categoría utilizan tu Grado de Maestría más alto, aunque la Habilidad concreta tenga un Grado inferior».
- **Lectura de Campo** se reduce a la Ventaja en evaluaciones tácticas; se retira el «pregunta 2 de 3 al Director sin tirada».
- **Analizado** pasa de que el Director elija entre cuatro datos a revelar «uno de estos», e incluye ahora la Vulnerabilidad y la capacidad que la criatura pretende usar.
- La lista de **Enfoques** queda en cinco (Movilidad, Infiltración, Exploración, Interacción, Conocimiento). El Manual v1.8 listaba seis, con **Combate** al principio.

## Novedades v51.7 — Estado, Guardia y Ataques plegables

`CACHE_VERSION` sube a `ss-companion-v50`. No cambia ningún dato de reglas, así que `RULES_DATA_VERSION` se queda en `1.8-manual-sendas-v22-r6`.

Las tres tarjetas de Perfil se pliegan desde su cabecera. Van **abiertas por defecto** —al revés que las aptitudes de Arquetipo, que son consulta: estas se usan cada turno— y el estado **se recuerda** entre sesiones.

Se guarda en `localStorage`, no en el personaje: plegar una tarjeta es una preferencia de quien juega en esa mesa, no un dato de la ficha, así que no viaja en el JSON exportado ni marca el personaje como no guardado.

**Plegada, la cabecera no pierde el dato.** Cada una muestra un resumen de una línea:

| Tarjeta | Plegada muestra | Alto |
|---|---|---|
| Estado | `PV 22/23 · Adr 25/25 · Ing 18/18` | 384 → 57 px |
| Guardia | `Guardia 15` | 170 → 49 px |
| Ataques | `Ataque +3 · Daño 1d8+1` | 253 → 53 px |

El resumen se refresca desde `calc()` y `adjustRes()`, así que sigue los `±` en vivo aunque la tarjeta esté cerrada.

Con las tres plegadas, Perfil baja de unas 2 pantallas a poco más de media.

**Detalle de implementación**: el indicador `▸`/`▾` usa `::before` con `order`, porque `::after` ya lo ocupa la línea divisoria dorada de `.ph` y `::before` sin `order` se colocaría delante del rombo `◆` del título.

Verificado que plegar no rompe nada de dentro: los ocho botones `±`, la tirada de Iniciativa, el menú de Descanso —un `<details>` anidado dentro de otro— y el ciclo Editar/Confirmar de Guardia siguen funcionando.

## Novedades v51.6 — Aptitudes de Arquetipo retráctiles

`RULES_DATA_VERSION` sube a `1.8-manual-sendas-v22-r6` y `CACHE_VERSION` a `ss-companion-v49`.

**Inercia de Guerra salía dos veces**

La extracción del chasis desde el Manual v1.8 se tragaba *todas* las líneas de cada bloque, y el SUSTRATO del Audaz contiene dentro el rasgo «Inercia de Guerra». Como los rasgos además se guardan aparte en `rasgos[]`, el texto aparecía duplicado: una vez dentro de la prosa de Presión y otra como aptitud propia.

La prosa del chasis ahora se corta en el primer rasgo. El Sustrato del Audaz pasa de **1.524 a 675 caracteres** y no queda ningún nombre de rasgo embebido en los tres bloques de los tres Arquetipos.

**Cada aptitud es un desplegable, cerrado por defecto**

El chasis son unos 2.000 caracteres por Arquetipo y, abierto, sepultaba la tarjeta. Ahora cerrado se ve el **nombre**, su **tipo** (`◆ pasivo`, `⚡ trigger`) y la **primera frase** recortada; el resto, al tocarlo. Usa el mismo marcador `▸`/`▾` dorado que los demás desplegables de la app.

La tarjeta del Audaz —la más larga, con seis aptitudes— pasa de **1.160 px a 621 px**. Los otros dos quedan en 497 px.

## Novedades v51.5 — La tarjeta Rasgos también muestra lo elegido

Mismo criterio que la v51.4, aplicado a la tarjeta **Rasgos** de la pestaña Aptitudes. `CACHE_VERSION` sube a `ss-companion-v48`; los datos de reglas no cambian, así que `RULES_DATA_VERSION` se queda en `1.8-manual-sendas-v22-r5`.

La tarjeta volcaba todos los `grant` del Linaje y del Trasfondo, incluida la línea cruda «Elección: Furia de la Forja (…) o Guardia de la Montaña (…)» — un menú, no un rasgo del personaje. Ahora:

- Los rasgos **fijos** del Linaje y del Trasfondo, como antes.
- La opción **escogida**, con borde dorado para distinguirla de las que vienen dadas.
- Un aviso **«Elección sin resolver»** en discontinuo cuando queda algo por decidir.

Las pendientes se cuentan por **ranura vacía**, no por línea de `grant`: el Mutante abre dos desplegables desde una sola línea («Elige DOS Mutaciones»), y contando líneas su segunda ranura vacía pasaba desapercibida.

**Dos refrescos que faltaban.** El repintado de la tarjeta vivía dentro de `updateOptions()`, así que no ocurría al resolver una elección —el badge se quedaba en «sin resolver» tras elegir— y al cambiar de Linaje se pintaba con los desplegables del anterior, arrastrando su elección al nuevo. Se extrae a `_renderTraits()` y se llama también desde el manejador de cambio, desde `updateOptions()` una vez reconstruidos los desplegables, y desde `randomize()`.

Verificado: Enano, Mutante con sus dos ranuras, cambios de Linaje encadenados y 10 personajes aleatorios seguidos, todos sin pendientes.

## Novedades v51.4 — Detalle muestra lo elegido, no lo disponible

`RULES_DATA_VERSION` sube a `1.8-manual-sendas-v22-r5` y `CACHE_VERSION` a `ss-companion-v47`.

**Las tarjetas de Linaje y Arquetipo enseñaban el menú, no el plato**

En Detalle, la tarjeta de Linaje listaba entre sus Rasgos la línea cruda «Elección: Ingenio Práctico (…) o Aguante (…)» —que no es un rasgo, es un menú— y en Modificadores solo mostraba los bonos **fijos**. Un Humano, cuyo bono es todo elección, aparecía sin ningún modificador aunque hubiera elegido dos.

Ahora:

- **Rasgos** lista solo los fijos.
- **Elecciones** es una sección nueva con lo que el jugador escogió, y marca «Sin elegir» lo que falte.
- **Modificadores** suma los fijos y los elegidos, con `·elegido` en los que vienen de una elección.

En la tarjeta de Arquetipo, **Pericias** pasa de mostrar la de `sel_filo` a mostrarlas todas **con su grado** (`Físico 2 · Mental 1`), que es lo que determina el coste de Esfuerzo. Y **Habilidades Seleccionadas** indica el cupo: «2 de 3 del Arquetipo», así se ve de un vistazo si faltan por elegir.

**Los bonos fijos, a la vista en Identidad**

Si el Linaje trae un bono establecido (Enano: +2 CON, +1 FUE), ahora se muestra junto a los desplegables de bono a elegir, como fichas informativas. Antes solo se veía lo que había que escoger, sin el reparto que ya venía dado.

**Un personaje aleatorio se quedaba sin sus elecciones**

`randomize()` es anterior a estos campos y los dejaba en blanco: un Cambiante aleatorio salía **sin su +2 de atributo** y sin Experiencia. Ahora se rellenan al azar respetando las exclusiones —atributos distintos, opciones que ocupan varias ranuras—, porque se resuelven a través de los mismos desplegables. Verificado con 12 personajes aleatorios seguidos: los 12 completos.

**Sobre los datos de Arquetipo**: se cotejaron contra el Manual v1.8 y ya estaban al día desde la v51.1 —las listas de habilidades iniciales y sus cupos (2/3/4) coinciden—, así que aquí solo cambia la presentación.

## Novedades v51.3 — El Editor de Reglas edita la mecánica, no solo el texto

`RULES_DATA_VERSION` sube a `1.8-manual-sendas-v22-r4` y `CACHE_VERSION` a `ss-companion-v46`.

**El editor destruía datos en silencio**

Construía la entrada desde cero (`let entry = {name}`), así que **todo campo que el formulario no mostrase se borraba al guardar**. Abrir el Audaz y pulsar Guardar sin tocar nada lo dejaba en **10 campos de 18**: perdía su chasis entero —`rasgos`, `sustrato`, `permiso`, `limite`—, `skills_count` e `ignoresGearReq`, y `armorProf` se vaciaba. Los Linajes perdían `innate_optional` (que satisface el requisito de Iniciado Místico) y `skillGrants`; las armas, sus `notes`.

Ahora se parte de la entrada existente y se sobrescribe solo lo editado.

**Campos que no se podían tocar, y ahora sí**

| Categoría | Se añade |
|---|---|
| Arquetipo | Velocidad · Habilidades a elegir · Competencia de armadura · Ignora requisitos de FUE · Sustrato, Permiso y Límite · Rasgos (uno por línea, `Nombre (tipo) \| texto @bloque`) |
| Linaje | Elecciones · Bono de Atributo a elegir *(v51.2)* |
| Trasfondo | Defecto |
| Armas | Notas |
| Armaduras y escudos | Notas · Requisitos de FUE y DES |
| Axiomas | Nivel · Fuente |

**Cuatro fallos más que salieron en la auditoría**

- **Trasfondos partía `grant` por comas**, igual que Linajes antes de v51.2. «Kit de caligrafía y sellos (Influencia, Engaño) — competencia incluida» se convertía en dos rasgos rotos. Ahora es una línea por rasgo.
- **«Sangre de Gigante» perdía su Grado 4**: el formulario tenía tres campos fijos y el guardado recorría `[1,2,3]`. Ahora los campos se generan según los Grados que tenga, con uno de más para añadir.
- **Sin Armadura pasaba de 0 a 1 slot** en cada guardado: `||1` trataba el 0 como ausente.
- **Se inventaban campos vacíos**: `desc:""` en cada talento —el catálogo no lleva descripción desde v47—, `cost:""` en Axiomas y ceros en los requisitos de armas.

**El PB del Arquetipo no se ofrece**, y es deliberado: el Bono de Competencia sale del **nivel** (`PROF_THRESHOLDS`), no del Arquetipo. El campo `prof` del dato no lo lee nadie, así que un control ahí no haría nada.

**Verificación**: abrir y guardar sin tocar nada las **435 entradas** de las siete categorías más 73 talentos. Idempotente en todas: ni un campo perdido, cambiado o inventado. Y comprobado que editar sí llega al motor — cambiar la Velocidad del Sagaz a 25 aparece como «25 pies» en la ficha.

## Novedades v51.2 — Mutaciones del Mutante y elecciones desde el Editor

`RULES_DATA_VERSION` sube a `1.8-manual-sendas-v22-r3` y `CACHE_VERSION` a `ss-companion-v45`.

**El Mutante ya elige sus dos Mutaciones**

Era el único Linaje cuya elección no se recogía, porque usa otro formato: «Elige DOS Mutaciones: A / B / C» en vez de «Elección: A o B». El lector reconoce ahora ambos, y el número sale del propio texto (`DOS` → dos desplegables).

Las dos ranuras **se excluyen entre sí**, y **Aberración Mística ocupa las dos**: al elegirla, la segunda desaparece; al cambiarla por otra, vuelve. Esa regla se deduce del texto de la opción («ocupa las DOS elecciones»), así que funciona igual para cualquier opción futura redactada de esa forma, sin cablear nombres.

**Editar un Linaje le rompía los rasgos**

El Editor de Reglas guardaba `grant` partiendo el campo **por comas**, y la mayoría de rasgos llevan comas dentro. Editar un Humano convertía «Elección: Ingenio Práctico (repite 1 tirada de 1d20 fallida por conflicto dramático, 1/Descanso Largo; vale el segundo resultado) o Aguante» en dos rasgos rotos.

Ahora es un área de texto con **una línea por rasgo**. Comprobado: entra con 3 rasgos y sale con 3, ninguno partido.

**Elecciones y bonos, editables**

El formulario de Linaje gana dos campos:

- **Elecciones** — una por línea. Se convierten en desplegables en la ficha. Admite `Elección: A o B`, `Elección: A / B / C` y `Elige DOS Cosas: A / B / C`, y respeta los paréntesis, así que una opción puede contener « o » dentro.
- **Bono de Atributo a elegir** — cuántos, de qué valor, si deben ser distintos y a qué atributos limitarlo. Es lo que la ficha pinta como «Bono de Linaje».

Con esto se pueden añadir Experiencias y bonos a un Linaje existente, o crear uno nuevo con ellos, sin tocar `data.js`.

## Novedades v51.1 — Rasgos de Arquetipo, y el Linaje ya se elige

`RULES_DATA_VERSION` sube a `1.8-manual-sendas-v22-r2` y `CACHE_VERSION` a `ss-companion-v44`.

**Los rasgos de Arquetipo se leían de corrido**

Iban concatenados con « · » dentro de un mismo párrafo, así que en Detalle salía un muro de texto. Ahora cada rasgo es una tarjeta con **su nombre y su tipo** (`◆ pasivo`, `⚡ trigger`…), agrupada bajo su bloque del chasis: Perfil, Sustrato, Permiso y Límite. En `data.js` dejan de ser dos cadenas (`feature1`/`feature2`) y pasan a ser `rasgos:[{n,t,d,b}]`.

Al reconstruirlos desde el Manual v1.8 salió que **el catálogo de rasgos estaba desfasado**. El manual dice literalmente que «el Sagaz tiene un solo rasgo pasivo desde el Nivel 1, el Misticismo Innato»; la ficha le mostraba cinco, heredados de una versión anterior. Queda: Audaz con Veterano de Guerra, Lectura de Campo e Inercia de Guerra; Versátil con Pericia Flexible; Sagaz con Misticismo Innato.

**Conducción Arcana ya no existe, y afectaba a dos cálculos**

Ese rasgo permitía al Sagaz usar el atributo de su Fuente en lugar del defensivo para la **Guardia** y la **Iniciativa**. No aparece en el Manual v1.8 ni en el Compendio v2.2, y el propio ejemplo del manual lo confirma: *Sable, Sagaz con INT 17/+3 y DES 12/+1, **Guardia 13*** = 10 + PB 2 + DES 1. Con el rasgo habrían sido 15.

Retirado de ambos cálculos. Sustituir el atributo defensivo sigue siendo posible, pero solo por Talento —Armadura de Magia—, que entra por los bonos declarados de la tarjeta Guardia.

**El Linaje ya se elige: bonos de atributo y Elección de Experiencia**

Los bonos raciales con elección no se recogían en ninguna parte. Un **Humano** o un **Medio Elfo** («+1 a dos Atributos a elección») no recibían **ningún** bono, y cuatro Linajes tenían una rama cableada en los datos: Infernal aplicaba siempre INT, Aesir siempre SAB, Cambiante siempre FUE y Mutante perdía su +2.

Ahora el panel de Identidad muestra un desplegable por elección, bajo el Linaje. Los bonos entran por `app._descMods()`, punto único que leen `_statFinal`, `_buildStatsSummary` y `calc()`, así que **al confirmar Identidad y Origen los atributos ya aparecen aplicados en Stats**. Cuando el Linaje pide «dos Atributos distintos», el segundo desplegable excluye el ya elegido.

La **Elección de Experiencia** vivía como una línea de texto corrido dentro de `grant`; ahora es un desplegable con sus opciones. El separador varía entre Linajes (` o ` con dos opciones, ` / ` con tres) y **Cambiante tiene un « o » dentro de un paréntesis**, así que la división respeta el nivel de anidamiento en vez de partir por la primera coincidencia.

Todo se guarda solo: `gatherCharData` serializa los `<select>` con id.

## Novedades v51 — Manual Básico v1.8 y Compendio de Sendas v2.2

Actualización a la línea nueva desde **Stars & Sorcery Manual Básico v1.8** y **Compendio de Sendas v2.2** (carpeta `V2`). `STORAGE.RULES_DATA_VERSION` sube a `1.8-manual-sendas-v22-r1` y `CACHE_VERSION` a `ss-companion-v43`.

**Los PV por nivel estaban 2 puntos por debajo del manual**

El manual fija, en cuatro sitios y para los tres Arquetipos, que los PV por nivel posterior son **2 + MOD CON**, y remite al índice de Letalidad para moverlo. La app calculaba `lethality - 1`, así que con la Letalidad 1 por defecto sumaba **solo el MOD de CON**: un personaje de Nivel 10 tenía **18 PV menos** de los que le tocan.

El índice de Letalidad *es* ese sumando fijo. Corregido a `lethality` y el valor por defecto pasa a **2**, que es el estándar del manual — con la 1 para campañas más mortales y la 3 para las más heroicas. De paso, las etiquetas mentían: prometían «+1 PV/nivel» cuando el valor real depende también de la CON. Ahora dicen «+1 + MOD CON». Verificado a Nivel 1, 5 y 10 contra la fórmula del manual.

Las fichas guardadas conservan su índice, así que **ninguna cambia de PV sola**; solo los personajes nuevos arrancan en 2.

**Chasis de Arquetipo: Sustrato, Permiso y Límite**

El manual reestructura los Arquetipos en cuatro bloques —Perfil, Sustrato, Permiso y Límite— y añade tres mecánicas centrales que antes no existían: **Presión** (Audaz), **Enfoque** (Versátil) y **Analizado** (Sagaz), cada una con su Permiso (Intervención · Improvisar · Previsión) y su Límite, que ningún Talento levanta.

Los tres van a `data.js` y se muestran en la ficha de Arquetipo de la página Detalle. Esto destapó que **`feature1` y `feature2` no las leía nadie**: llevaban versiones en `data.js` sin que ningún punto de la app las pintara. Ahora se muestran como el bloque Perfil.

**Catálogo de Talentos: 257 → 256**

v2.2 corrigió los cuatro fallos de maquetación que se reportaron en la v49 —el bloque duplicado de Arsenal, los encabezados perdidos de «La Hoja del Pacto» y «El Tomo del Pacto», y los Grados de Rompejuramentos colados en «Voto de Conquista»—. Ya no hace falta repararlos al importar.

- **«Lectura del Combate» se retira** del compendio (era el que traía una nota de edición en lugar del talento). No se rescata: v2.2 borró su encabezado, no lo dejó vacío. Quien lo tuviera verá «No encontrado» conservando su texto.
- **21 talentos con el texto revisado** y uno con el requisito actualizado: `comunicacion_silenciosa` pasa a pedir «Vínculo Animal G1» en vez de «Compañero de Exploración G1», que es el renombrado que la v49 ya había migrado.
- Cero ids nuevos y cero renombrados, así que `TALENT_ID_RENAMES` no se toca.

**«Hechizo de Toda una Vida» sigue sin cuerpo en el .docx.** Aparece en el índice y como encabezado, pero sin texto — igual que en v2.0. Se mantiene el contenido heredado y queda pendiente en el documento.

**Otras comprobaciones**, todas sin cambios respecto a lo que ya implementaba la app: tabla de progresión (XP, PD, PB), tabla de descansos, Guardia (`10 + PB + escudo + atributo defensivo`), techo de Armadura (`5 + PB`), NLE por nivel y costes de Pericia (5/4/3/2). El Hito del Nivel 10 pierde el «+ Epítome»: el manual ahora dice solo «Trascendencia».

**Una inconsistencia del documento**, sin resolver aquí: el Manual v1.8 remite a un «índice de Letalidad» que no define, y tampoco aparece en la Guía del Director v1.2. La app lo interpreta como el sumando fijo de PV por nivel, que es lo único coherente con «2 + MOD CON».

## Novedades v50.1 — Emojis fuera de la interfaz

La v46 ya había establecido la política «Sin emojis», pero quedaban cuatro pictogramas de color repartidos por la app. `CACHE_VERSION` sube a `ss-companion-v42`; ninguna otra versión cambia.

| Dónde | Antes | Ahora |
|---|---|---|
| Insignia de pifia en la tirada | `☠ Fallo Total ☠` | `Fallo Total` |
| Aviso de talento retirado | `⚠ No encontrado…` | `No encontrado…` |
| Desplegable «Descansar» | `☾` | hereda el `▸`/`▾` dorado del resto de desplegables |
| Rasgos de Arquetipo (`data.js`) | `Inercia de Guerra (⚡ 0 PA)` | `Inercia de Guerra (Trigger · 0 PA)` |

Los dos primeros no perdían nada: sus insignias ya llevan color y borde propios por CSS, así que el pictograma era pura decoración. El `☾` era un marcador que se había puesto a mano en vez de usar el que ya define `details > summary`.

**Lo que NO se ha tocado**, porque no son emojis sino la tipografía de la casa —ninguno tiene presentación de color en Unicode—: `✦` y `✧` (el ornamento que abre las cabeceras de panel y marca los avisos de éxito), `◆` (el rombo de `.pt`), `▸ ▾ ▲ ▼ ●` (los controles) y `✓ ✕`.

Tampoco se han limpiado los emojis que aparecen en el README y en algunos comentarios del código: ahí están **citados** como registro de lo que se retiró en versiones anteriores, no usados como decoración.

Queda una asimetría deliberada: la insignia de crítico sigue siendo `✦ Crítico ✦` y la de pifia es ahora `Fallo Total` a secas. Si prefieres las dos sin ornamento, es quitar los dos `✦`.

## Novedades v50 — Subida de nivel y descanso

Dos funciones nuevas en `js/progresion.js`, un módulo aparte que se carga entre `app.js` y `boot.js` y envuelve `updateXpHint()`, `updateTalentCount()` e `init()`. Las tablas viven en `constants.js`. No cambia ningún dato de reglas: `STORAGE.RULES_DATA_VERSION` sigue en `9.0-sendas-v2-r2`; `CACHE_VERSION` sube a `ss-companion-v41`.

**Subir de nivel**

Al alcanzar el umbral de XP aparece un botón dorado bajo la barra de experiencia —«Subir a Nivel 5 · +1 PD»—, que dice de antemano qué se gana. Al pulsarlo sube el nivel, suma los PD al contador nuevo y avisa del Hito que toca (Talento nuevo en 3/5/7/9, Hito de Estilo en 5 y 9, Trascendencia + Epítome en 10). El botón solo existe mientras la XP dé para ello, y desaparece al Nivel 10.

Se recorrió la progresión entera comprobando contra la «Tabla de progresión completa» del Expert v1.0: los diez umbrales de XP, los PD alternos +2/+1 y el total al Nivel 10 — **14 PD, 7 espacios de Talento y PB +4**, que es exactamente lo que declara el manual.

**Puntos de Desarrollo y espacios de Talento**

Dos campos nuevos junto a Nivel y XP. Los PD son un contador editable —la subida de nivel los suma sola— y los espacios de Talento muestran `3 / 4` según el nivel, siguiendo la tabla 3·3·4·4·5·5·6·6·7·7. Pasarse **no bloquea**: el contador se pone en ámbar y explica el margen al pasar el cursor, porque el sistema es abierto y quien decide es el DJ. Esto sustituye al tope fijo de 3 que tenía el Gestor de Talentos cableado. Los PD se guardan solos: `gatherCharData` serializa todo `input[type=number]` con id.

**Descanso**

Un desplegable en la tarjeta Estado con los cuatro descansos del §7, cada uno con su duración, su coste y lo que recupera:

| Tipo | Duración | Recupera |
|---|---|---|
| Respiro | 10 min | 1d8 + MOD CON en PV. **Reservas no** |
| Descanso Largo — Inseguro | 6 h | Mitad de PV y mitad de Reservas |
| Descanso Largo — Seguro | 8 h | Todo. Elimina 1 Fatiga |
| Descanso Largo — Confortable | 8 h | Todo. Elimina 2 Fatiga |

El Respiro **tira el dado de verdad** y el aviso enseña el resultado (`1d8+MOD CON = 2+3 → 5 PV`), en vez de dar una cantidad fija.

**La Carne no se recupera descansando.** Se pidió que el botón la restaurara, pero el manual es explícito: *«El Flesh solo baja por efectos que lo ataquen expresamente… Recuperación: 1 punto de Flesh por semana completa de reposo real, además de la curación avanzada (100 pp) y del botiquín avanzado (CD 16)»*. Ninguno de los cuatro descansos la toca. Para la vía que sí existe se añade una quinta entrada aparte y marcada en color distinto, **Reposo prolongado** (1 semana sin viajar ni combatir): PV y Reservas al completo **y +1 de Carne**. Es el único que la mueve.

## Novedades v49.1 — Ajustes visuales de la tarjeta Estado y las insignias

Ronda de acabado sobre lo entregado en v49. No cambia ningún dato de reglas, así que `STORAGE.RULES_DATA_VERSION` se queda en `9.0-sendas-v2-r2`; `CACHE_VERSION` sube a `ss-companion-v40`.

**Los ± caían desalineados entre filas**

El bloque del número usaba `min-width:6.6ch`, y `ch` escala con el tamaño de fuente: como el número de PV es de 21 px y el de los otros tres recursos de 16 px, la columna de PV medía 66 px y las demás 59 — sus botones quedaban 7 px a la izquierda. `.e4-ctl` pasa a ser una rejilla de anchos fijos en píxeles (`27px / 74px / 27px`), así que los cuatro `−` y los cuatro `+` caen en la misma vertical. Verificado también con máximos de tres cifras, que era el caso que más desalineaba.

**El separador de Pericias era invisible**

Con dos Pericias adquiridas se leían de corrido (`Físico 2 Mental 1`). El punto sí se pintaba, pero en `var(--rim)` (#2e2540), que es un color de **borde**: prácticamente negro sobre el fondo del panel. Pasa a `var(--muted)`. Además iba anclado al borde izquierdo de la segunda Pericia y quedaba pegado a ella; ahora se centra en el hueco con `translateX(-50%)` sobre un espacio de 11 px.

**Iniciativa deja de estar señalada**

Tenía contorno dorado, fondo tenue y colores de acento para leerse como botón. Ahora usa **exactamente los mismos colores que las otras cuatro celdas** y la fila se lee uniforme. Sigue siendo un `<button>` que tira la iniciativa, y conserva dos cosas que no lo marcan en reposo: el hundido al pulsar como acuse de recibo, y un anillo de foco para quien navegue con teclado — sin él quedaría invisible al tabular. Como ya no tiene contorno propio, vuelven los filetes verticales que se le habían suprimido a los lados: los lleva toda celda que no abra fila (la 2, la 3 y la 5 en el reparto 3 + 2 de móvil).

**Insignias de Identidad: menos metalizado**

Lo que hace que un borde parezca metal pulido no es el tono, sino el vaivén claro→oscuro→claro del degradado. En las medallas de Linaje/Arquetipo/Trasfondo ese recorrido se comprime —el tramo oscuro sube de `#7c6030` a `#96794c`— y baja el brillo interior, así que el filo queda como una línea de oro mate. Se hace con una variable propia, `--oro-suave`: **el marco del retrato y las tarjetas del roster conservan el metalizado completo**. El separador `·` entre medallas pasa de `var(--muted)` a `var(--gold)` y sale del estilo inline a una clase `.isep`, para que siga el color de los temas alternativos en lugar de quedarse en un dorado fijo.

## Novedades v49 — Compendio de Sendas v2.0, Pericias con grado y tarjeta Estado

Actualización desde **Compendio de Sendas v2.0** y **Stars & Sorcery Reglas Esenciales**. `STORAGE.RULES_DATA_VERSION` sube a `9.0-sendas-v2-r2` y `CACHE_VERSION` a `ss-companion-v39`.

**Los botones ± suman de uno en uno**

Un clic sumaba **2**: el atributo `onclick` del HTML y el `mousedown` de `_initResLongPress()` llamaban ambos a `adjustRes()`, y el `preventDefault()` del listener de `click` no cancela un manejador inline —ya está registrado antes y se ejecuta igual—. Se retiran los ocho `onclick` del HTML y el puntero queda como única vía. Mantener pulsado sigue repitiendo con aceleración (verificado: 0 → 97 en 6,6 s). Como quitar el `onclick` dejaba sin efecto Enter y Espacio, se añade un manejador de teclado que suma 1 e **ignora la repetición automática del sistema** (`e.repeat`): para una ráfaga está el mantenido.

**Catálogo de Talentos — 267 → 257, en 23 Sendas**

- **Dos fallos de maquetación del .docx que fusionaban talentos.** En la Senda **Pacto**, los nombres de «La Hoja del Pacto» y «El Tomo del Pacto» quedaron como texto normal en vez de encabezado: los tres talentos se leían como uno solo. En **Voto de Conquista** se coló pegada la tanda completa de Grados de **Rompejuramentos**. El parser detecta ambos casos —una segunda línea técnica dentro del bloque indica un talento nuevo cuyo nombre va dos líneas antes; un segundo «Grado 1» sin línea técnica de por medio indica contenido ajeno y se corta— y se pasó la comprobación por las 23 Sendas: no hay más casos.
- Se conservan **212 ids**; entran 44 talentos nuevos y salen 55. `TALENT_ID_RENAMES` crece de 2 a 15 entradas con los renombrados **comprobados 1:1** (mismo texto de Grado 1, o el mismo concepto con el artículo caído): los nueve `dominio_de_la_X` → `dominio_de_X`, `pericia_que_vuelve` → `filo_que_vuelve`, `qi_en_la_pericia` → `qi_en_el_filo`, `metamagia_arcana` → `torsion_arcana`, `companero_de_exploracion` → `vinculo_animal`.
- **No se mapean los contenedores desglosados.** `origen_de_sangre`, `herencia_refinada` y `herencia_culminada` se convierten en los ocho Orígenes independientes (Sangre Dracónica, Linaje Infernal, …); elegir por el jugador cuál le tocó sería inventarse su ficha. Esos talentos muestran "⚠ No encontrado" y **conservan su texto** en la ficha guardada, que almacena una copia completa.
- Los **nueve Dominios** y los **seis Votos** vienen ya desglosados en el documento como talentos independientes de tres Grados. Los Dominios no traen línea técnica: sus Grados se derivan del chasis que el propio Compendio declara (G1 El Mandato = Axiomas + Rasgo · G2 El Signo · G3 La Prerrogativa).

**Anomalías del documento fuente** (corregidas en la app, pendientes en el .docx)

- **«Hechizo de Toda una Vida»** (General) aparece en el índice y como encabezado pero **sin texto**. Se conserva el contenido de v1.0.
- **«Lectura del Combate»** (Arsenal) trae una nota de edición en lugar del talento: *«Se conserva, con el requisito abierto (dos talentos de esta Senda en vez de dos talentos de esta Senda)»* — el paréntesis dice lo mismo a ambos lados. Se conserva el contenido y el requisito de v1.0.
- El bloque **Arsenal Personal / Lectura del Combate / El Armero** está **duplicado literalmente** en la Senda Arsenal. Se toma una sola copia: Arsenal queda con sus 6 talentos.
- **«Al abrir tu Canal eliges un Origen»** (Herencia) es una instrucción introductoria a los ocho Orígenes con nivel de encabezado de talento. No entra al catálogo.

**El Arquetipo «Sutil» pasa a llamarse «Versátil»**

Las Reglas Esenciales lo renombran (76 menciones, cero de «Sutil»). Cambia **solo el nombre visible**: la clave interna sigue siendo `sutil` porque las fichas guardadas la referencian en `sel_arq`, y renombrarla obligaría a migrar cada personaje. `_talentMatchesArq` deja de tener la lista de Arquetipos cableada y la deriva de la base de reglas, reconociendo clave y nombre visible. Sus cifras no cambian (6 PV base, +5/+5, 3 habilidades, Pericia Flexible exclusiva). Ojo: **«Sutil» sigue siendo una propiedad de arma** y ahí no se toca.

**Pericias con grado** (`js/pericias.js`, módulo nuevo)

La ficha ya registra las Pericias, que antes no guardaba. Cada Pericia lleva grado **0–3** con su coste por Nivel de Esfuerzo a la vista (Sin Pericia 5 · 1→4 · 2→3 · 3→2). **Física y Mental las adquiere cualquiera** con Puntos de Desarrollo sin importar el Arquetipo —este solo decide la Pericia *inicial*—; **Flexible sigue siendo exclusiva del Versátil**. Los grados se guardan solos porque `gatherCharData` serializa todo `<select>` con id; las fichas anteriores migran poniendo a grado 1 la Pericia que tuvieran elegida.

**Validador de requisitos: fuera la rama de Pericia**

`_parseTalentReq` tenía una rama dedicada a «Pericia Física 2» para tratarla como informativa. Ningún talento del catálogo pide una Pericia como requisito, y no lo hará: la rama era código muerto y se retira. No cambia el comportamiento — el patrón se añade a la lista `informational` del caso general, porque sin eso caería en la rama que interpreta cualquier texto capitalizado como *talento requerido* y pasaría a **bloquear** en una base de reglas importada que sí usara esa redacción.

**Tarjeta Estado, rediseñada**

Cuatro recursos con el mismo ritmo tipográfico (PV destacado y con barra) y una sola fila de consulta —Armadura · Iniciativa · Velocidad · Comp. · Pericias— separada por filetes que se desvanecen. Iniciativa es un botón que tira la iniciativa (su aspecto se unifica con el resto de celdas en v49.1). En móvil la fila se reparte 3 + 2 para que ninguna celda baje de 100 px. El nombre de la armadura se retira de Estado: basta el puntaje, y el nombre sigue en Equipo de Combate.

# S&S Companion — v48.1

Hoja de personaje digital (PWA) para **Stars & Sorcery RPG**. Esta versión reestructura el monolito original de 7.800 líneas en un proyecto modular, corrige el bug de *touch bleed-through* del diálogo de confirmación y completa las piezas PWA que faltaban. **Toda la funcionalidad original se conserva** (verificado con suite de pruebas automatizada).




## Novedades v48.1 — Auditoría de código y ajustes de la tarjeta Guardia

**Ajustes pedidos**

- La tarjeta **Guardia** se mueve de la pestaña Stats a **Perfil, justo encima de Ataques** — donde se consulta de verdad durante el combate, junto al resto de números que se usan turno a turno.
- El selector de atributo defensivo pierde las glosas descriptivas ("evitas el golpe moviéndote", "lo ves venir", "mantienes la línea"): ahora solo dice Destreza / Sabiduría / Constitución.
- Al **generar un personaje aleatorio**, el atributo defensivo deja de sortearse a ciegas y toma el **mayor de DES/SAB/CON** con las puntuaciones ya tiradas, que es lo que haría cualquier jugador al construir la ficha (verificado en 8 de 8 tiradas).
- Se retira la referencia "(§3d)" de la etiqueta **Desprevenido**.
- **Detalle → Arquetipo**: el cuadro de *Ingenio* desbordaba su caja. La causa era el `min-width:auto` que los ítems de un grid tienen por defecto: impide encogerse por debajo del `min-content`, y `INT/SAB/CAR + Niv + 12` es un token largo sin espacios. Corregido con `min-width:0` y `overflow-wrap:anywhere`; verificado a 360 px, donde las tres cajas quedan idénticas y ninguna desborda.

**Auditoría de código zombie**

- **`hasTalent('alerta')`** en el cálculo de Iniciativa sumaba +5 por un talento que **no existe en ningún catálogo** de la app (ni en v6.0, ni v8.1, ni anteriores). Código muerto desde hace varias versiones: eliminado.
- **"Filo" seguía visible en la interfaz** pese a que las reglas lo renombraron a **Pericia** en v8.3: corregido en el selector de Identidad, el recuadro de Estado, el resumen de Detalle y el editor de Arquetipos. El validador de requisitos acepta ahora ambas nomenclaturas, por si una base de reglas importada trae la antigua.
- Cuatro `id` de HTML sin ninguna referencia en JS, CSS ni HTML (`adv_fab_opts`, `sdial_btn`, `db_editor_title`, `talent_modal_title`): esos elementos se localizan por clase, así que los ids sobraban.
- Revisado también: métodos de `app.js` sin llamadas (ninguno real), clases CSS sin uso (ninguna real — las 17 candidatas resultaron construirse por concatenación de plantillas), referencias a ids inexistentes (ninguna), `data-action` sin manejador (ninguno), y restos de la migración CA→Guardia en el código (limpios; los `.bonus` que quedan son el bono de atributo de los Descriptores, otro campo distinto).

`CACHE_VERSION` sube a `ss-companion-v34`.

## Novedades v48 — Guardia y Armadura: las dos defensas (reglas v8.3 / v7.1 / v8.1)

Actualización a la línea nueva desde los tres documentos canónicos: **Manual Básico v8.3**, **Catálogo de Axiomas v7.1** y **Compendio de Sendas v8.1**. `STORAGE.RULES_DATA_VERSION` sube a `8.3-guardia-r1` y `CACHE_VERSION` a `ss-companion-v33`.

### El cambio de fondo: la Clase de Armadura desaparece

El sistema separa en dos ejes lo que antes era un solo número (Manual, Cap. 5 §3a):

- **Guardia** — lo difícil que es *alcanzarte*. `10 + PB + escudo + atributo defensivo`. El atributo defensivo se elige **una vez al crear el personaje** entre DES, SAB o CON (tres formas de impedir un impacto efectivo: apartarte, verlo venir o no ceder). **La armadura no la modifica en absoluto.**
- **Armadura** — lo difícil que es *herirte*. Es Reducción de Daño: se resta a cada golpe que ya superó tu Guardia, con un mínimo de 1 punto. Techo del sistema: **5 + PB**.

Los escudos son la excepción coherente: no son blindaje, son defensa activa, así que suben la **Guardia** (+1 estándar, +2 torre) y aportan +2 a la tirada de Bloqueo Enfrentado.

### La tarjeta "Equipo de Combate" se divide en dos

- **Equipo de Combate** (pestaña Equipo) mantiene armas principal y secundaria **sin ningún cambio**, y su bloque defensivo pasa a informar de **Armadura**: el nombre y categoría de la pieza equipada, su valor de Reducción de Daño, y qué aporta el escudo a la Guardia y al Bloqueo. Nuevo selector de **Armadura extra** para talentos y objetos (Veterano de Guerra, Piel Blindada, Escamas Endurecidas…). Si la suma supera el techo `5 + PB`, la tarjeta lo avisa en vez de mostrar un número que el sistema no permite.
- **Guardia** (pestaña Stats, bajo Habilidades) es la tarjeta nueva. En modo edición calcula el total **en vivo** con la fórmula desglosada en sus cuatro sumandos (Base · Competencia · Escudo · Atributo), permite elegir el atributo defensivo y añadir bonos mágicos u otros, y muestra además la **Guardia de Desprevenido** (§3d: sin PB ni escudo). Al pulsar Confirmar pasa a modo lectura, igual que el resto de secciones.
- La tarjeta **Estado** cambia su recuadro `CA` por **Armadura**, con el nombre de la pieza debajo.

**Fórmulas alternativas de Guardia**: Conducción Arcana (Sagaz) sustituye el atributo defensivo por el de su Fuente y la tarjeta lo indica explícitamente; no se acumulan entre sí, aplica la más alta.

**Migración**: las armaduras personalizadas guardadas bajo el esquema viejo (campo `ca`) se convierten a Reducción de Daño con la equivalencia de la tabla oficial, así que no pasan a valer 0 al abrir una ficha antigua. Los editores de objeto personalizado y de la base de datos piden ahora Armadura (RD) y, para escudos, bono de Guardia y de Bloqueo por separado.

### Contenido

- **Axiomas: 364 → 362** desde el Catálogo v7.1. *Conocer Alineamiento* se convierte en **Leer Intenciones** (percibe intención hostil y si la Fuente es sobrenatural, en vez de leer un alineamiento). Los Axiomas defensivos se reescriben en los ejes nuevos: *Armadura de Mago* y *Armadura Infernal* pasan a ser fórmulas alternativas de Guardia; *Escudo Arcano* da +4 Guardia y anula por completo Proyectil Mágico; *Fortalecer Armadura*, *Manto Aberrante* y *Piel de Corteza* dan **Armadura**. *Eco del Vacío* sube a 3d6 y encadena a un segundo objetivo.
- **Talentos: 260 → 267** desde el Compendio de Sendas v8.1, con el mismo criterio de la versión anterior (solo nombre, requisitos y Grados). El reparto entre los dos ejes sigue la guía del propio compendio: blindaje y dureza corporal dan Armadura; postura, reflejos y escudo dan Guardia. *Defensa Marcial* ya no mejora la categoría de armadura (sin sentido cuando la armadura no toca la Guardia) y ahora da Armadura directamente; *Maestría de Armas* ignora Armadura y sus Críticos la deterioran. **Dominio Divino se desglosa en sus 9 Dominios** como talentos independientes, igual que se hizo con Voto en v47.1.
- El estado **Sorprendido** se sustituye por **Desprevenido** en todo el compendio.
- **Convicciones** (Manual Cap. 18) sustituyen al Alineamiento: las nueve etiquetas clásicas se conservan como coordenadas de dos ejes, no como veredicto moral; *Neutral Puro* pasa a llamarse **Neutral**. Es puramente narrativo y no modifica ninguna regla.
- **Filo** pasa a llamarse **Pericia** en los textos de Arquetipo.

### Visual

El dorado de las **tarjetas de identidad** (marco del retrato, su nombre, las insignias de Linaje/Arquetipo/Trasfondo y las tarjetas del roster) baja un **10%** de intensidad. Se hace con `color-mix` sobre los tokens de tema, con respaldo en hex para navegadores sin soporte, de modo que los temas alternativos (blood, arcane, parchment) se atenúan igual.

## Novedades v47.1 — El talento "Voto" se desglosa en 7 talentos independientes

- A petición del usuario: el talento-contenedor **Voto** (Juramento) mezclaba 7 variaciones dentro de un mismo talento con un selector de Grado que repetía G1/G2/G3 siete veces — difícil de navegar en el Gestor de Talentos. Ahora son **7 talentos independientes**: *Voto del Centinela*, *Voto de la Deuda Jurada*, *Voto Inquebrantable*, *Voto del Guardián Ancestral*, *Voto de Enemistad*, *Voto de Conquista* y *Rompejuramentos* (la variante corrupta), cada uno con sus propios 3 Grados y el mismo requisito que tenía Voto (`Iniciado Místico (Juramento) · Nivel 1`).
- A diferencia del resto del Compendio de Sendas (sin `desc` por pedido explícito), **estos 7 sí llevan descripción**: el texto "Principio: …" de cada Voto en el documento fuente, que antes se descartaba como nota, ahora es su flavor — es lo que el propio usuario pidió usar como tal.
- **Talentos: 254 → 260** (un talento-contenedor se convierte en 7).
- **Robustez de código**: cualquier talento futuro cuyo requisito sea "Voto" a secas (no un Voto concreto) queda satisfecho si el personaje tiene cualquiera de los 7 — nueva rama en `_parseTalentReq` (`app.js`), en el mismo patrón que ya usan Iniciado Místico/Despertar Sobrenatural. Ningún talento actual del compendio requería "Voto" genérico, así que no hizo falta tocar más `req`.
- `STORAGE.RULES_DATA_VERSION` sube a `5.5.2-sendas6.0-r2`, `CACHE_VERSION` a `ss-companion-v32`.

## Novedades v47 — Talentos reemplazados por el Compendio de Sendas v6.0

- **Sustitución completa de la sección `talents`** de `js/data.js` desde el `Compendio de Sendas v6.0` (formato markdown, no docx): **225 → 254 talentos**, **21 → 23 categorías** (ahora llamadas "Sendas" en el propio compendio). Sendas nuevas: **Espionaje** (se separa de Letalidad: Mente Criminal, Red de Contactos, Experto en Todo, Doble Vida + la nueva Preparación Meticulosa), **Arsenal** (contraparte de Armas: dominio de múltiples armas en vez de una sola), **Invocación** (ex-"Entidades"), **Bestias** (compañero animal, separado de Cacería) y **Liderazgo** (Temple del Acero + cinco talentos nuevos). Las Sendas "Vía de axiomas" y "Rompejuramentos" desaparecen como categorías propias: Iniciado Místico/Despertar Sobrenatural/Poderío Arcano pasan a vivir dentro de **General**, y Legado de la Caída/Corona Rota dentro de **Juramento** — así los organiza el propio compendio nuevo.
- **Solo nombre + requisitos + Grados.** A petición expresa, se eliminó toda leyenda, epígrafe y nota de diseño de cada talento (el compendio fuente las incluye profusamente: citas en cursiva, "Nota de diseño", asides con ✦). El campo `desc` se omite por completo — la ficha ya lo maneja con normalidad (`t.desc||''`, o el placeholder "Sin descripción." en la tarjeta de detalle) — y **la búsqueda del Gestor de Talentos sigue funcionando** porque indexa nombre + texto de Grados, no la descripción.
- **Talentos-contenedor con opciones** (Voto, Pacto, Origen de Sangre, Dominio Divino, Regalo Oscuro, Lo Prohibido, Gadgeteer…) conservan la convención `«Opción» texto` ya usada en la actualización anterior: cada opción aparece como una o varias entradas de Grado con su etiqueta entre `«»`, en vez de perderse en una sola descripción.
- **Poderes Apex retirados de las reglas.** El compendio nuevo no incluye la Vía de Poderes Apex (`Despertar Apex` desaparece sin reemplazo). Otras tres bajas sin renombre 1:1: `Danza de Hojas`, `Señor de Bestias` (su rol pasa a otros talentos de Bestias) y `Defensa sin Armadura` (reemplazada conceptualmente por la nueva `Defensa Marcial`, con una mecánica distinta, no una migración automática). **229 de los 233 ids anteriores se conservan sin cambios** — la inmensa mayoría de personajes guardados no pierde nada; los cuatro casos anteriores muestran el aviso "⚠ No encontrado en la versión actual de las reglas" ya construido en la actualización previa.
- **Parser propio para markdown** (`gen_sendas.py`, ejecutado fuera del repo): el documento fuente mezcla dos estilos de conversión (párrafos en una sola línea vs. líneas envueltas a ~80 columnas con negrita `**Grado N** --- texto` estilo pandoc) y dos bugs de origen — un encabezado pegado a la regla horizontal anterior sin línea en blanco (`Fe Inquebrantable` quedaba fusionado con `Corona Rota`) y dos talentos (`Armadura de Poder`, `Gadgeteer`) con encabezado en negrita suelta sin `##`. Ambos corregidos con un unión de bloques que aísla encabezados/reglas horizontales y una heurística que promueve una negrita suelta a talento si le sigue un bloque `REQ`. Verificado 1:1 contra los 254 encabezados reales del documento (sin duplicados, sin huecos). Se corrigió además una frase truncada del propio documento fuente en *Compañero de Exploración* Grado 1 ("...y se esc puede morir definitivamente" → oración duplicada eliminada, el resto del párrafo ya cubre la regla correctamente).
- `STORAGE.RULES_DATA_VERSION` sube a `5.5.2-sendas6.0-r1` (Manual/Catálogo siguen en v5.5.2; solo el Compendio de Talentos cambia de línea) y `CACHE_VERSION` del service worker a `ss-companion-v31`.

## Novedades v46 — Reglas v5.5.2 (línea completa)

- **Actualización a la línea v5.5.2** desde los documentos canónicos: Manual Básico v5.5.2, Compendio Maestro de Talentos v5.5.2 y Catálogo de Axiomas v5.5.2. `STORAGE.RULES_DATA_VERSION` sube a `5.5.2-app-r1` — los usuarios que regresan adoptan las reglas nuevas **sin tocar sus personajes guardados**.
- **Axiomas: sin cambios de contenido.** El Catálogo v5.5.2 conserva las 364 entradas de la línea v5.3.8 (verificado con regeneración completa desde las tablas del docx: diff vacío). El Dominio del Engaño pasa a prosa en el catálogo pero sus dos Axiomas (*Reflejo Falaz*, *Velo de Identidad*) se conservan. **Sin renombres de id — no hay migración de axiomas.**
- **Talentos: 225 → 233, catálogos 16 → 21**, sección regenerada íntegramente desde el Compendio v5.5.2:
  - **Cinco catálogos nuevos**: **Armas** (Escuela de Combate, Maniobras, Ataque Adicional, Combate a Dos Armas…), **Nigromancia**, **Furia**, **Entidades** y **Sombras** (12 talentos cada uno). Buena parte del antiguo cajón «general» (59 talentos) se redistribuye en ellos; General queda en 13.
  - **Talentos-contenedor consolidados**: los votos del Juramento se funden en **Voto** (6 votos con Grados 1/4+/7+), los linajes de Herencia en **Origen de Sangre** (8 orígenes), Pacto de la Hoja/Tomo en **Pacto** (elección Hoja/Tomo) y **Dominio Divino** pasa a 9 dominios con progresión Nv1/3+/5+. Cada opción se identifica entre «» en sus Grados.
  - **Ki → Qi**: *Golpe de Qi*, *Reflexión de Qi* y los nuevos *Respiración Serena* y *Qi en el Filo*.
  - **Rompejuramentos** se rehace como progresión propia (*Legado de la Caída*, *Corona Rota*); las capacidades-espejo (Tormento, Aura de Odio…) viven ahora en la Sustitución Espejo descrita en el propio Compendio.
  - Los personajes guardados **conservan su snapshot de talento** (nombre, descripción y grado): un talento retirado del Compendio sigue legible en la ficha.
- **Linajes al día con el Manual v5.5.2**: epítetos nuevos (Infernal «El Marcado», Sintético «El Construido», Aesir «El Portador», Medio Orco «El Marcado por la Furia»), **Inconveniente añadido a los 11 linajes** (Testarudo, Estigma, Torpeza Social, Orgullo Dracónico…), rasgos actualizados (*Presencia Imponente* del Dracónido pasa a Salvación SAB → Aterrado; *Furia Salvaje* del Cambiante definida; *Aguante* sustituye a *Resiliencia Implacable*; Mutante: *Aberración Mística* ocupa las dos elecciones).
- **Arquetipos**: nuevos rasgos de chasis — **Lectura de Campo** (Audaz), **Filo Flexible + Procedimientos de Sigilo** explícitos (Sutil) y **Lectura del Vínculo** (Sagaz). Fórmulas de Reservas sin cambios.
- **Despertar Sobrenatural ya no otorga +6 Ingenio** (en v5.5.2 da +2 Trucos y +1 Axioma Nv1): el cálculo de Ingenio máximo se actualiza en `app.js`.
- **Trasfondos**: defectos con la redacción v5.5.2 y kits con su habilidad asociada (p. ej. «Herramientas de Alquimia (Naturaleza o Arcano)»).
- **Equipo (Apéndice A)**: entra el **Ninjato**; **armaduras históricas [MÓDULO]** (Gambesón, Cota de Anillas, Media Armadura) y **avanzadas de magitecnología** (Traje Balístico, Exoesqueleto Táctico, Nanoplacas, Traje de Sombra, Coraza de Cristal de Éter). El cálculo de CA soporta ahora **topes de DES por armadura** (`dexCap`: anillas +3, nanoplacas +1…). Escudos con su Ud de bloqueo (§3b) y equipo básico (Morral, Raciones, Cantimplora, Antorchas) en el catálogo de Equipo.
- El **Starter Set v5.5.2** no altera reglas de la app: no requiere cambios de datos.
- **Fix: talentos guardados que solo mostraban la leyenda.** La reestructuración de 225→233 talentos (90 ids retirados, 98 nuevos) dejaba sin efecto visible a los personajes que tenían uno de esos 90 talentos: `_findTalent` no lo localizaba en la base actual, `grades` quedaba vacío y la tarjeta solo mostraba la leyenda guardada (`data-desc`) sin ningún bloque de Grados, indistinguible de un talento completo. Dos correcciones:
  - **`TALENT_ID_RENAMES`** (constants.js, mismo patrón que `AXIOM_ID_RENAMES`): migra automáticamente los dos renombres 1:1 verificados letra por letra (`golpe_de_ki`→`golpe_de_qi`, `reflexion_de_ki`→`reflexion_de_qi`; el resto de los 90 pasaron a ser *opciones* dentro de talentos-contenedor como Voto u Origen de Sangre y no tienen un id equivalente migrable sin perder la elección original del jugador).
  - **Aviso explícito** en `_talentRichCard` (app.js): cuando un talento guardado no se encuentra en la base actual, la tarjeta muestra "⚠ No encontrado en la versión actual de las reglas" en vez de aparentar estar completa.
- `CACHE_VERSION` del service worker sube a `ss-companion-v30` para que los clientes instalados reciban los datos y el fix.

## Novedades v45.1 — Actualización PWA a prueba de balas, buscador y limpieza

- **Causa raíz de "la app no se actualiza" (además del SW en espera)**: el precache del service worker usaba `cache.add(url)` con el modo de caché por defecto, así que un SW nuevo podía **instalarse con copias rancias de la caché HTTP del navegador** — el SW "se actualizaba" pero servía archivos viejos. Ahora precachea con `new Request(url, { cache:'reload' })` (red real, sin caché HTTP). Reproducido y verificado en navegador.
- **Botón "Buscar actualización" en Ajustes → Datos → Aplicación** (`app.checkForUpdate`): fuerza `reg.update()`, espera la instalación y —si hay SW nuevo— muestra el mismo aviso persistente del arranque; si no, "Ya tienes la última versión". Debajo, un **sello con la versión de datos** (`RULES_DATA_VERSION`) para verificar tras actualizar. Ciclo completo verificado: botón → detecta → aviso → tocar → activación → recarga → SW nuevo activo.
- **Fix: las barras de PV/Adrenalina/Ingenio no se llenaban al generar personaje aleatorio** — `randomize()` escribe los valores actuales *después* de `calc()`, así que las barras quedaban a 0 hasta tocar ±. Ahora llama a `_updateResBars()` tras asignarlos. (Al cargar personaje ya funcionaba: `applyCharData` recalcula después de restaurar inputs.)
- **Código zombie eliminado**: `.stat-in` (huérfana tras los pilares consolidados), `.stag` + variantes (sin uso ni construcción dinámica; el único "stag" en JS era la palabra *staggered* en un comentario), y `TIMING.SAVE_GUARD` / `TIMING.SWIPE_SNAP` (sin referencias). Barrido automatizado de métodos de `app`, funciones de los módulos y clases CSS contra HTML+JS.
- `CACHE_VERSION` sube a **v21** (el sw.js cambió con el fix de precache).

### Swipe con física nativa, toasts uniformes y dados modernos (v45.1)

- **Swipe entre páginas** (sensación tipo Fight Club 5e / paginador nativo):
  - **Continuación desde animación en vuelo**: si el dedo atrapa la pista a mitad de un snap, el arrastre continúa desde donde está (`originOffset`) en vez de saltar a la posición de reposo; la decisión de página usa el desplazamiento *efectivo*, igual al que se ve en pantalla.
  - **Rubber-band asintótico** (curva iOS): la resistencia en los bordes crece progresivamente con límite suave en ~40% del ancho — sustituye al factor lineal 0.12, que se sentía rígido.
  - **Snap proporcional a la velocidad**: la duración de asentado se calcula de lo que queda por recorrer y la velocidad de soltado (160–320 ms); un flick rápido asienta antes, un soltado lento cae con más peso. La navegación por botones mantiene 220 ms fijos.
  - Umbral de flick ligeramente más accesible (0.28 → 0.25 px/ms) y arreglo del caso límite: un *tap* que atrapaba una animación en vuelo dejaba la pista congelada entre páginas; ahora re-asienta.
  - Verificado con gestos táctiles sintéticos: flick avanza (320 ms), arrastre corto de 20 px no cambia de página, arrastre lento >30% sí.
- **Toasts uniformes**: ancho fijo `min(92vw, 340px)` para todos — antes cada botón producía un toast de tamaño distinto (min/max-width variables). Look moderno: superficie plana, borde hairline, radio 12 px, sombra suave (fuera el degradado y el triple box-shadow). Se mantiene la posición inferior sobre la navegación (estándar snackbar, zona del pulgar).
- **Tarjeta de dados moderna y de tamaño constante**: ancho fijo `min(88vw, 340px)` — mide lo mismo con 1 dado que con 5 (verificado: 340 px en ambos). Fuera las esquinas art déco (`::before`/`::after`) y la línea decorativa al 60%; ahora borde hairline, radio 16 px y separador de ancho completo. Los halos de crítico/pifia y la posición en zona del pulgar (≤480 px) se conservan.

### Acabado premium: púrpura profundo + grano dorado (v45.1)

Tratamiento visual en las **tres zonas estándar de la industria** (superficie héroe, momento firma, CTA primario), con moderación deliberada:

- **Grano** generado por SVG `feTurbulence` como data-URI (`--grain`, tile de 160px, opacidad 6% horneada) — cero peticiones, cero assets.
- **Héroe del home**: bloom dorado radial desde el borde superior + velo púrpura profundo + grano. El **fondo personalizado del usuario (`--bg-home`) es la capa superior**: si existe lo cubre todo; al quitarlo, el premium reaparece (verificado en los tres estados).
- **Tarjeta de dados**: bloom dorado superior + velo púrpura + grano **sobre `background-color: var(--panel)`**, así los temas alternativos solo se tiñen en vez de romperse.
- **CTA primarios**: grano sobre el degradado dorado de "Nuevo Personaje" (el *gold grain* literal) y, sutil, en "Guardar".
- Donde NO se aplicó, a propósito: paneles, encabezados, navegación — el grano en todas partes deja de ser premium y pasa a ser ruido.

### Premium en la hoja, home fijo con reordenación y actualización a prueba de modales (v45.2)

- **Golden grain en la hoja de personaje**: la tarjeta del retrato/identidad (`.panel-accent`) recibe el tratamiento héroe (bloom dorado + velo púrpura + grano); las **tarjetas de ataque** la versión sutil; y todos los paneles un velo púrpura al 5% que enriquece el tono **sin cambiar la paleta** (los colores base siguen siendo las variables del tema).
- **Reordenar personajes en el home**: chevrons ▲▼ en cada tarjeta del roster (`app.moveChar`) — el roster es un objeto y el orden de inserción de claves es el orden mostrado, así que se reconstruye y persiste. Deshabilitados en los extremos, con `stopPropagation` para no abrir la ficha, y **el borrado por swipe queda intacto** (verificado).
- **Home con estructura fija**: título, botones y pie anclados; **solo el roster se desplaza** (`.home-roster-body` con `flex:1` + `overflow-y:auto`), **sin scrollbars visibles** (`scrollbar-width:none` + `::-webkit-scrollbar`). En pantallas de menos de 560px de alto vuelve el scroll general como respaldo.
- **El popup de actualización por fin funciona desde Ajustes**: la causa era que los toasts se renderizan **debajo del top-layer del `<dialog>`** — el aviso aparecía invisible e intocable detrás del modal (los tests sintéticos con `.click()` lo enmascaraban). `checkForUpdate` ahora cierra Ajustes antes de mostrar cualquier resultado. Además, al aceptar el aviso hay una **recarga de respaldo a los 1.6s** por si `controllerchange` no dispara en navegadores raros (también en el aviso de arranque de boot.js).
- **Escudo anti-traspaso de toques** (`app._tapShield`): un velo invisible de 320ms absorbe el toque fantasma que sigue a abrir o cerrar cualquier capa — aplicado a los 12 puntos de apertura/cierre (Ajustes, Editor de Reglas, gestores de Aptitudes y Talentos, FAB de Ventaja, overlay de dados). Los `<dialog>` quedan por encima del escudo (top-layer), así que sus propios controles nunca se bloquean.
- `CACHE_VERSION` sube a **v22**.

### Reordenar por swipe, esquinas limpias y golden noise universal (v45.2)

- **Reordenar por swipe a la derecha**: los chevrons in-card no se veían en móvil; ahora el panel de ordenar (▲▼, fondo `#1d1230`, chevrons dorados) **se revela deslizando la tarjeta a la derecha**, simétrico al borrado por swipe a la izquierda (que queda intacto). Gesto de tres estados con clamp bidireccional (−80px borrar · +80px ordenar), cierre al tocar fuera unificado (`card._conceal`) y pista actualizada: "desliza · → ordenar · ← eliminar". Verificado con gestos sintéticos: → abre y reordena persistiendo, ← sigue abriendo borrar.
- **Fuera la sombra junto al título**: eliminados los tres artefactos difusos de esa zona — el halo elíptico de `.home-hdr::before`, la sombra negra dura del `text-shadow` del título (queda solo el glow dorado) y el radial púrpura de la esquina del tratamiento premium del home.
- **Golden noise en todas las tarjetas** (`--grain-md`, 13%): base **`#140921`** con el grano desvaneciéndose de arriba a abajo (**mucho ruido → cero ruido**, cubierta opaca al 82%) y bloom dorado sutil en el borde superior. Aplica a `.panel`, `.char-card`, `.atk-card`, `.dice-card`, `.pillar-card`, `.sbox`, `.svsbox`, `.sc`, `.apt-card` y el marco del roster; el retrato (`.panel-accent`) lleva el bloom más presente, y las cajas de recursos conservan su **tinte funcional** (sangre/salvia/hielo) como velo superior. De paso se retiraron los selectores `.panel-estado` zombis de la pasada revertida.

### Pulido de feedback visual — lote 8 (v45.2)

- **Tinta de tarjetas**: `#140921` → **`#1f142b`** (`--card-ink` + los 10 velos de desvanecido).
- **Cajón del roster en negro** (`#07060a`), fuera del tratamiento de grano — las tarjetas resaltan sobre él; **retratos del roster con elevación real** (sombra 5/16 + anillo dorado, también el placeholder); la **pista de swipe ahora es legible** (era `var(--border)`, casi invisible → `var(--dim)`).
- **Botones de tirada con la superficie de las tarjetas de talento** (`--raised` + borde `--edge` + brillo interior): modificadores de los Seis Pilares, Tiradas de Salvación y los botones Atacar/Daño.
- **Identidad de recursos**: hairline de color de 2px en la parte superior de cada caja (sangre/salvia/hielo/cobre); **Carne asciende a caja de recurso completa** (`.res-box-carne`: tinte cobre + grano + borde propio + **barra de fracción** conectada a `_updateResBars` y al tecleo directo).
- **Sombras del título restauradas y mejoradas** (grounding nítido 1px + profundidad 6/18 + glow dorado en dos radios). La "gradiente negra" de la esquina señalada en la captura era el **borde del bloom dorado central** (las esquinas quedaban fuera y se veían como manchas oscuras): el bloom pasa de 120% a **220% de ancho** y cubre uniformemente.
- **Feedback del botón Buscar actualización**: estado `:active` con flash dorado + escala; el modal de Ajustes se cierra al lanzarlo (ya desde v45.2) y el toast de progreso queda visible.

### Estado limpio, tinta espacial y swipe sin lag (v45.2)

- **Sin grano en los recuadros internos de Estado** (PV/Adrenalina/Ingenio/Carne/CA/Ini/Vel/Comp/Filo): vuelven a superficie limpia `var(--raised)` conservando su tinte de color e identidad (hairlines y barras); el grano queda en la tarjeta contenedora. Los **pilares en modo lectura** (`.sbox` FUE…CAR) adoptan exactamente la superficie de las Tiradas de Salvación (verificado: mismos valores computados).
- **Tinta de tarjetas**: `#1f142b` → **`#1d1426`** (tono oscuro espacial), manteniendo el grano dorado con su degradado mucho→cero.
- **Lag del swipe eliminado**: el encabezado de la hoja (`blur 24px`) y la navegación inferior (`blur 20px`) tienen `backdrop-filter` y viven **encima de la pista que se desliza** — el navegador re-difuminaba ambos en cada frame del gesto. Fuera de la cromo fija (sus fondos casi opacos compensan subiendo la opacidad); los blurs de capas transitorias (diálogos, dados, toasts) se conservan. También se retiró el del cajón del roster (ya es negro sólido).
- **Entrada del roster perceptible de nuevo**: la animación de las tarjetas sube de .22s a **.38s** con curva con rebote suave y ahora entra desde abajo (`translateY(14px) + scale(.97)`), con el stagger de 50ms por tarjeta.

### Tarjetas oscuras originales y cirugía de rendimiento del swipe (v45.2)

- **Tarjetas de vuelta a la oscuridad original**: la tinta pasa de `#1d1426` a **`#100e18`** (el `--surface` con el que nacieron los paneles), conservando el grano dorado con su degradado mucho→cero.
- **Swipe — tres causas de jank atacadas a la vez**:
  1. **El grano era un filtro SVG (`feTurbulence`) que el navegador re-rasteriza en cada repintado** — carísimo en móvil con una docena de tarjetas visibles. Ahora `app._initGrainTexture()` genera la textura UNA vez en un canvas de 160px y la sirve como PNG data-URI en las mismas variables (`--grain`, `--grain-md`); el SVG del CSS queda como respaldo si canvas falla.
  2. **Cada página promociona a capa de compositor propia** (`transform:translateZ(0)` en `.page`): el gesto mueve rasters ya pintados en GPU en vez de repintar.
  3. **`touchmove` llega en ráfagas más rápidas que el refresco**: el transform del arrastre se aplica ahora como máximo una vez por frame vía `requestAnimationFrame`, con contador de generación (`liveGen`) que invalida el frame pendiente al soltar para que no pise el snap (también en la ruta de ratón y en `touchcancel`).
  (En el lote anterior ya se habían retirado los `backdrop-filter` del encabezado y la navegación, que se re-difuminaban en cada frame.)

### Sin grano, Aptitudes reorganizada y actualizaciones fiables (v46)

- **Fuera el grano por completo** (feedback: "se ve sucia"): eliminadas las variables `--grain`/`--grain-md`, todas las reglas con textura y `_initGrainTexture`. Las tarjetas vuelven a **sus colores originales** (`--surface`/`--raised`/`--panel` y el degradado original del roster) — verificado: panel `#100e18`, dados `--panel`.
- **Home en morado profundo perceptible** (`#221540 → #170e2c → #0c0818 → --void`), conservando la iluminación del título (bloom dorado ancho + text-shadow) y **sin tocar la línea degradada horizontal** (`.home-deco`). El fondo personalizado del usuario sigue siendo la capa superior.
- **Aptitudes reorganizada**: los paneles de **Talentos** y **Rasgos** se mudan de Stats a la página Aptitudes, en el orden **Talentos → Rasgos → Trucos → Conjuros** (los render por id — `traits_list`, `talents_summary_*` — funcionan igual desde su nueva casa).
- **Swipe menos "torpe"**: (1) fuera la capa rAF del lote anterior — Chrome ya alinea `touchmove` al refresco, el doble buffer solo añadía un frame de latencia; (2) `V_BIAS` 2.2 → **1.5**: el bloqueo de eje exigía un gesto casi perfectamente horizontal, ahora acepta diagonales amables; (3) `DEAD_PX` 8 → 6; (4) `getComputedStyle` en `touchstart` forzaba un reflow que congelaba el primer frame del gesto — ahora solo se lee el transform si hay un snap en vuelo (`_snapUntil`).
- **Actualizaciones por fin fiables — causa raíz**: el navegador solo detecta una actualización **si `sw.js` cambia en bytes**; al reutilizar la misma `CACHE_VERSION` entre despliegues, la app quedaba congelada (de ahí tener que borrar caché a mano). Ahora: **regla escrita en sw.js de subir versión en CADA despliegue** (→ `v23`), registro con `updateViaCache:'none'` (el fetch de sw.js nunca pasa por caché HTTP), y re-chequeo al volver a la app (`visibilitychange`) y cada 30 min además del arranque.

### Medallas de oro metálico y home al tono de la hoja (v46 → `v24`)

- **Medallas de Identidad y Origen en modo lectura** (Descriptor · Arquetipo · Origen): borde de **oro metálico en degradado** con la técnica de doble capa (`padding-box` opaco bajo un `border-box` dorado que gira de `#e8cd90` a `#8a6b35`), brillo interior, sombra de elevación y `text-shadow` de grounding — el filo se ve como metal pulido, no como una línea translúcida.
- **Home al mismo tono oscuro que la hoja de personaje** (`--void` plano), conservando la iluminación del título (bloom dorado + glow), el campo de estrellas y **la línea degradada horizontal intacta**.
- `CACHE_VERSION` → **v24** (regla: sube en cada publicación).

### Sistema de oro de joyería, jerarquía y microfeedback (v46 → `v25`)

Las seis propuestas aprobadas, más el golden noise en versión sutil:

1. **Un solo oro de joyería** (`--oro-metal`, el metal de las medallas como token): marco del **retrato** de la hoja, **insignia de nivel** del roster y **badge del crítico** en dados (con pulso `badgePulse`, desactivado bajo reduced-motion).
2. **Encabezados con jerarquía**: rombo dorado (`◆`) ante cada título de panel + regla que se desvanece de oro a sombra (sustituye al border-bottom plano).
3. **Estados vacíos con voz**: runa ✦ + "Aún sin trucos/conjuros" + pista, en los estáticos y en `_renderAptSummary`.
4. **Hilo de oro en la navegación** (`#nav_thread`): línea metálica de 2px que se desliza a la pestaña activa desde `goToPage` — `transform` puro, coste cero.
5. **Total del dado en Cinzel Decorative** (1.75rem): el momento firma habla con la voz ceremonial de la app.
6. **Ceremonia al confirmar**: el resumen de cada sección entra con un micro-fundido (`sum-reveal`, 260ms).
- **Golden noise, esta vez bien**: PNG dorado pre-rasterizado en canvas (sin filtros SVG → sin coste de pintado), media de opacidad ~4%, y **desvanecido a cero en el 40% superior** de paneles y tarjeta de dados vía `mask-image` en un pseudo-elemento — un brillo de polvo de oro bajo los encabezados, no una textura que ensucia.
- `CACHE_VERSION` → **v25**.
- **Endurecimiento del aviso de actualización** (encontrado en el propio testing): si se apilan dos actualizaciones (p. ej. dos despliegues seguidos sin abrir la app), el aviso capturaba una referencia al worker que luego quedaba reemplazado — al tocarlo, el `SKIP_WAITING` iba a un worker muerto. Ahora el aviso resuelve **`reg.waiting` vigente en el momento del toque**. `CACHE_VERSION` → **v26**.

### Purple noise ligero y retrato limpio (v46.2 → `v28`)

- **La textura de tarjetas cambia a purple noise claro muy ligero**: lavanda con luminancia suave y alpha media ~2%, sin destellos, conservando el degradado mucho→cero al 45%. Sustituye al golden grain metalizado.
- **El recuadro de la imagen del retrato (`.port-card`) va limpio**: el efecto pertenece a la tarjeta contenedora (que ya lo hereda por ser `.panel`), no al marco de la foto. Verificado: tarjeta con ruido, recuadro limpio.
- `CACHE_VERSION` → **v28**.

### Grano metalizado, metal calibrado y anti-congelación (v46.1 → `v27`)

- **Golden grain metalizado**: el generador de textura pasa de ruido dorado uniforme a **flecks de luminancia variable con destellos dispersos** (~0.4% de glints brillantes, como pintura metalizada), siempre en degradado mucho→cero (45%). Aplicado a **todas las tarjetas**: paneles, roster, ataques, dados, pilares, aptitudes y **la tarjeta del retrato** (el sheen hover del roster cedió su pseudo-elemento).
- **Metal calibrado** (los bordes de oro quedan intactos — "perfectos"): rombo de encabezados al 50% y más pequeño, regla áurea al 22%, hilo de navegación con alphas al 70%, pulso de crítico a la mitad, rellenos de insignias más sobrios y menos bronce.
- **Congelamientos resueltos**: el escudo anti-traspaso podía quedarse pegado si su temporizador era estrangulado (pestaña en segundo plano) — un velo invisible bloqueando toda la app. Ahora es **singleton** (nunca se apilan), con **fecha límite absoluta**: el primer toque tras ella lo retira en vez de tragárselo, un vigilante re-programable lo limpia, y `visibilitychange` lo elimina al volver a la pestaña.
- **Cielo negro sobre el título**: fuera el bloom de fondo del home — el espacio sobre "Stars & Sorcery" es negro puro (`--void`) y el glow vive únicamente en las letras. La línea degradada horizontal, intacta.
- `CACHE_VERSION` → **v27**.

### Revisión de mejores prácticas (v45.1)

Pasada de auditoría con correcciones aplicadas, cada una verificada en navegador:

- **XSS por retrato importado (seguridad)**: `renderHome` interpolaba `data.portrait` sin validar dentro de `src="…"`; un JSON de personaje manipulado inyectaba HTML en el roster. Ahora el roster solo renderiza **data-URLs de imagen estrictos** (regex completa con base64) y la importación descarta retratos que no empiecen por `data:image/`. Verificado con un payload real: la sonda no se inyecta y se muestra el placeholder.
- **Clamp de recursos con máximo 0**: `parseInt(max) || 999` convertía un máximo de `0` en `999` (falsy), permitiendo subir un recurso sin tope en hojas vacías. Ahora `NaN → 999, 0 → 0`, y `parseInt` lleva radix explícito. Verificado: 31 pulsaciones de + clavan PV en su máximo.
- **Los toasts persistentes ya no se expulsan por el tope**: el límite de 2 toasts visibles eliminaba el más antiguo — dos avisos posteriores echaban el aviso de actualización. La expulsión ahora salta los `t-sticky`. Verificado con 3 toasts seguidos: el sticky sobrevive.
- **Carrera en `checkForUpdate`**: `reg.update()` resuelve antes de que `reg.installing` se pueble; el botón podía responder "estás al día" justo cuando sí había actualización. Se espera (hasta 3 s) a que aparezca el worker nuevo antes de concluir.
- **`AXIOM_ID_RENAMES` a constants.js**: el mapa de migración vivía dentro de `applyCharData` (se recreaba en cada carga); ahora es constante de módulo junto a `XP_TABLE`. Migración re-verificada (`sordera` → `ensordecido`).
- **A11y**: las barras de fracción de Estado llevan `aria-hidden="true"` — son decorativas (el dato ya está en el input y su máximo) y solo generaban ruido en lectores de pantalla.

## Novedades v45 — Reglas v5.3.7 / v5.3.8 (línea completa)

- **Actualización a la línea v5.3.7/v5.3.8** desde los documentos canónicos: Manual Básico v5.3.7, Compendio Maestro de Talentos v5.3.7 y **Catálogo de Axiomas v5.3.8**. `STORAGE.RULES_DATA_VERSION` sube a `5.3.8-app-r1` — los usuarios que regresan adoptan las reglas nuevas **sin tocar sus personajes guardados**.
- **Axiomas: 332 → 364 (+32)**, sección regenerada íntegramente desde las tablas del Catálogo v5.3.8:
  - **Trucos: 18 → 24 [v5.3.6/v5.3.8]**: entran *Prestidigitación*, *Empuje*, *Guía*, *Remendar*, *Toque Silvestre* y *Llama Sagrada* (el primer Truco de daño Radiante). Los 18 existentes adoptan su entrada canónica del Catálogo de Trucos (dado base unificado: 1d8 con Salvación · 1d6 impacto automático, escalado por escalón de nivel).
  - **La cola alta [v5.3.8] (+24)**: los Niveles 8–9 de **Divinidad** (*Aura Sagrada, Santuario Consagrado, Juicio Flamígero, Vínculo Vital, Resurrección Verdadera, Palabra de Poder: Sanar, Tormenta de la Ira, Intervención Divina*), **Naturaleza** (*Despertar del Bosque, Muro de Espinas, Estallido Solar, Forma Primordial, Cambiaformas, Maremoto, Invocar al Primordial, Anillo de las Estaciones*) y **Psiónica** (*Dominación Absoluta, Aplastamiento Psíquico, Sondeo Profundo, Bastión de la Mente, Presciencia, Pesadilla Colectiva, Cárcel Mental, Sincronía Total*). Pacto conserva su techo de Nv4 por diseño.
  - **Dominio del Engaño [v5.3.7] (+2)**: *Reflejo Falaz* y *Velo de Identidad*; la tabla de Dominios pasa de 16 a 18 entradas y adopta los nombres canónicos **Muerte, Conocimiento y Naturaleza** (antes Umbral, Saber y Tierra y Mar).
  - **Unificación de unidades [v5.3.7]** en los 127 textos que aún usaban métrico: distancias y paneles en **pies**, pesos en **libras**, distancias climáticas en **millas**, alcances redondeados a la rejilla de 5 pies. Cuatro Axiomas cambian de id por ello (`silencio_30_pies`, `invisibilidad_30_pies`, `proteccion_del_mal_30_pies`, `ensordecido`) — **migración automática al cargar el personaje**, las selecciones guardadas se conservan.
  - **Estados canónicos [v5.3.6]**: *Atrapado* → **Apresado**, *Sordera* → **Ensordecido** en todos los textos. Vocabulario de criaturas: los «DG» heredados pasan a **NA** en las nueve entradas que los usaban (*Nube Mortal, Hechizo de Muerte, Palabra Sagrada, Dedo de la Muerte, Hechizar Serpientes, Patrón Hipnótico, Espray de Colores, Crecimiento Animal, Convocar Animales II*). *Espurio* corrige su redacción (7 PV temporales, +7 por Nivel de Esfuerzo).
- **Talentos al día con el Compendio v5.3.7** (ningún coste ni Grado cambia):
  - *Jinete de Guerra* (G2) y *Maestro de la Justa* (G2) adoptan la **CD escalable de la regla R3** (8 + PB + ½ Nivel + MOD) en lugar de la CD 12 plana [v5.3.6].
  - La opción **«Sobrecargar» pasa a llamarse «Intensificar»** (*Escultor de Hechizos* G2), para no colisionar con el subsistema de Sobrecarga eliminado en v5.3.4 [v5.3.6].
  - Pesos psiónicos en libras: *Telequinesis* (200 lb / 1.000 lb) y *Proyección Astral* (200 lb) [v5.3.7].
- **Tabla de Fuentes v5.3.6** en la Conducción Arcana del Sagaz (`_sourceAttrMod`): **Divinidad recupera «SAB o CAR»** y **Psiónica queda en «INT o SAB»** (antes INT/SAB/CAR).
- `CACHE_VERSION` del service worker sube a `ss-companion-v19` para que los clientes instalados reciban los datos nuevos.
- La *Bitácora de Exploración v1.1* (módulo de juego en solitario, compatible con la línea v5.3.7/v5.3.8) no altera reglas: no requiere cambios de datos en la app.

### Pasada UX móvil (v45)

Auditoría de objetivos táctiles y entrada en viewport de 375 px; el criterio fue el mínimo de 44 px para controles frecuentes en partida:

- **Objetivos táctiles**: opciones de Ventaja/Desventaja del FAB 38→44 px y FAB principal 40→48 px (control de combate más frecuente); *speed dial* del encabezado 40→44 px; **✕ Cerrar** del resultado de dados 23→44 px de alto (era el peor objetivo de la app); botón *✏ Editar* de sección 34→40 px; chips de filtro del Gestor de Talentos 25→36 px; *✕ Limpiar* del gestor 30→38 px.
- **Buscadores**: los `input[type=search]` no estaban cubiertos por el selector base de inputs — el buscador del Gestor de Trucos/Conjuros se renderizaba sin estilo y con 19 px de alto. Ahora ambos buscadores miden ≥40 px y usan fuente de 16 px (evita el auto-zoom de iOS y mejora la legibilidad del campo que más se teclea).
- **Entrada numérica**: al enfocar cualquier campo numérico se selecciona su contenido (teclear reemplaza el valor en vez de producir "010"), y la tecla Intro del teclado en pantalla confirma y cierra el teclado.
- **Viewport**: se retira `user-scalable=no` (accesibilidad WCAG 1.4.4 — el pellizco para ampliar vuelve a funcionar en Android; `maximum-scale=1` se conserva para evitar el auto-zoom de iOS al enfocar), y se añade `interactive-widget=resizes-content` para que el teclado de Android encoja el layout en vez de tapar los controles.

Lo que ya estaba bien y se conserva: zonas táctiles extendidas a 44 px vía pseudo-elemento en los steppers de recursos, toasts con `aria-live`, trampa de foco y Escape en diálogos, `overscroll-behavior` contenido, `prefers-reduced-motion`, hover solo bajo `@media(hover:hover)` y fuente de 16 px en los inputs de recursos.

### Revamp visual (v45)

- **Pilares consolidados**: en la página de Stats, las 12 cajas (6 inputs + 6 recuadros de modificador) se funden en **6 tarjetas**: puntuación editable a la izquierda y el **modificador como protagonista** a la derecha —es el número que se usa en cada tirada—, con el valor final (base + bonos de linaje) debajo. El modificador es un botón: **tocarlo tira el chequeo del atributo** (nuevo `app.rollStat()`, reutiliza `rollCheck`). La vista-resumen tras Confirmar (`.sbox`) no cambia. Los ids `base_*` se conservan, así que los personajes guardados y el generador aleatorio siguen funcionando sin migración. (La "barra de vitales" bajo el encabezado se prototipó y se retiró tras feedback.)
- **Iconografía unificada**: un **sprite SVG** (`#i-*`, 11 símbolos de trazo 1.5 px que heredan el color) sustituye la mezcla de emoji y glifos unicode (✏ ✎ ✕ ✓ ⚙ ↑ ↓ ↺ ↻ ▲ ▼) en ~50 botones de HTML y JS: Confirmar, Editar (pluma), Limpiar/Cerrar, Editor de BD, Importar/Exportar, rotación del recorte, FAB de Ventaja/Desventaja y los botones del inventario. Los prefijos "✓ " de las etiquetas de diálogos se retiran (el estilo del botón primario ya comunica). Se conservan a propósito: el icono de **Equipo** de la navegación (petición expresa), el ✦ rúnico de los toasts, los ✓ de estado en texto ("✓ Requisitos", "✓ Quitar") y los +/− tipográficos de los steppers de Grado.
- **Tokens de elevación de bordes**: las ~28 variantes sueltas de `rgba(61,50,84,α)` y `rgba(200,169,110,α)` en bordes (123 usos) colapsan en **5 tokens**: `--edge-soft / --edge / --edge-strong` (línea estructural) y `--edge-gold / --edge-gold-strong` (acento). Además, **cada tema alternativo (`data-theme`) redefine los tokens con su propio tinte** — antes los bordes quedaban en violeta aunque cambiaras a blood/arcane/parchment. Las filigranas doradas de α ≤ .28 (ornamentos de esquina, focus rings) se dejan fuera a propósito.
- **Drama del momento de dados**: en móvil (≤480 px) la tarjeta de resultado baja a la **zona del pulgar** (anclada sobre la navegación, respetando `safe-area`); el **crítico ilumina la tarjeta entera con halo dorado pulsante** (`.dice-card.crit`, animación desactivada bajo `prefers-reduced-motion`) y la pifia con halo sangre.
- **Escala tipográfica**: las ~31 variantes de `font-size` menores de 1rem (253 declaraciones entre CSS, HTML y JS) colapsan en **7 tokens** (`--fs-2xs … --fs-2xl`) con **suelo legible de .56rem (~9px)** — los micro-textos de .4–.55rem suben al suelo. Verificado sin desbordes a 375px con personaje aleatorio.
- **Sala de héroes (home)**: el retrato de la tarjeta del roster crece a **56×72** con marco dorado y pasa a ser el protagonista; el nombre sube a `--fs-2xl` y la insignia de nivel viste oro. El estado vacío gana un **anillo rúnico giratorio** en CSS puro (26s, desactivado bajo `prefers-reduced-motion`). Solo CSS — el markup y el swipe-para-borrar no cambian.
- **Peso de los iconos** (feedback): los triángulos del FAB radial de Ventaja/Desventaja pasan a **relleno sólido** (`fill:currentColor`) — a 13 px el contorno de 1.5 px se veía "transparente" frente a los glifos ▲▼ originales — y el resto del sprite sube a **trazo 1.8**, el mismo peso que los SVG preexistentes del encabezado y la navegación.
- **Buscador en el Editor de Reglas**: campo de búsqueda bajo el encabezado de cada categoría que filtra las entradas en vivo, **insensible a mayúsculas y tildes** ("proteccion" encuentra "Protección del Mal 30 pies"). En Talentos oculta los encabezados de catálogo sin resultados; mensaje de "sin resultados" cuando no hay coincidencias. Clave con 364 conjuros o 225 talentos por categoría.
- **Revamp de la sección de Estado**: PV, Adrenalina e Ingenio ganan una **barra de fracción** bajo el numerador (`.res-track`/`.res-fill`) con su color de recurso; la de **PV vira a émber al caer a ≤25%**. Se refrescan desde `calc()`, los steppers y el tecleo directo (`_updateResBars`). Transición desactivada bajo `prefers-reduced-motion`. (La segunda pasada "look moderno" de este panel —PV como tarjeta héroe a ancho completo— se revirtió a petición: el panel conserva su retícula original de tres columnas.)
- **Fix del aviso de actualización (PWA)**: si el service worker nuevo quedaba **en espera** desde una visita anterior, `updatefound` ya no volvía a dispararse y el aviso "Nueva versión disponible" no aparecía nunca más (la app quedaba clavada en la versión vieja). `boot.js` ahora comprueba también `reg.waiting` al arrancar — en **tres momentos** (inmediato, tras `serviceWorker.ready` y a los 3 s), porque `reg.waiting` puede tardar en poblarse tras resolver `register()` (carrera observada en Chromium; el dedupe de `app.toast` evita duplicados). El aviso es ahora **persistente** (`app.toast` acepta `{ sticky: true }`): no se autodescarta a los 3 s, queda hasta que se toque. Al aceptar ya no se hace `location.reload()` inmediato (carrera con la activación del SW): se envía `SKIP_WAITING` y la recarga la hace el listener de `controllerchange` cuando el SW nuevo toma el control. `CACHE_VERSION` sube a **v20**. Ciclo completo verificado en navegador: actualización detectada en visita → aviso; recarga sin aceptar → el aviso **reaparece**; tocar → activación + recarga automática + SW nuevo activo.

## Novedades v44 — Reglas v5.3.5 y limpieza de código zombie

- **Actualización a las reglas v5.3.5** desde los tres documentos canónicos. El Manual Básico y el Catálogo de Axiomas declaran la revisión como *congelación editorial* (ninguna regla, coste ni fórmula cambia); el grueso vive en el **Compendio Maestro de Talentos v5.3.5**. `STORAGE.RULES_DATA_VERSION` sube a `5.3.5-app-r1` — los usuarios que regresan adoptan las reglas nuevas sin tocar sus personajes guardados.
- **Talentos: 193 → 225 (+32)**, sincronizados con la reorganización por catálogos del Compendio (el antiguo Apéndice de Expansión se disuelve y sus líneas —nunca importadas hasta ahora— entran en sus catálogos naturales):
  - **Juramento (+6)**: los dos Juramentos nuevos con mecánica de Aura (*Juramento de Venganza*, *Juramento del Poder Antiguo*) y La Senda del Sepulcro (*Llamada del Sepulcro, Cosecha de Almas, Manto Necrótico, Corona de los Caídos*).
  - **Psiónica (+5)**: *Clarisenciencia, Psicocinesis, Psicometabolismo, Psicoportación, Dominio Telepático*.
  - **Herencia (+9)**: Orígenes *Llama Interior* (*Sangre del Elemento, Voluntad Pura, Forma del Elemento*), *Convergencia Primordial* (*Núcleo Plural, Confluencia, Resonancia Primordial*) y *Carne Maleable* (*Carne Reescrita, Forma de Guerra, Cuerpo Sin Forma*).
  - **Letalidad (+3)** — armas arrojadizas: *Filo que Vuelve, Ojo Certero, Cuchilla que No Erra Dos Veces*.
  - **General (+3)** — La Senda del Jinete: *Jinete de Guerra, Maestro de la Justa, Vínculo del Jinete Dracónico*.
  - **Exploración (+4)**: *Superviviente de Climas Extremos, Memoria del Terreno* (renombrado desde *Cartógrafo Instintivo*), *Trepador Imposible, Forrajero Experto*.
  - **Combate (+1)**: *Danza de Hojas* (con la Regla de Combate con Dos Armas). **Invención (+1)**: *Armadura de Poder*.
- **Invención reconstruida**: *Armadura Arcana*, *Guardián de Acero*, *Cañón Arcano* y *Armadura de Artillero* tenían entradas degeneradas (solo el prerrequisito de ficción, sin grados) — ahora tienen sus G1/G2/G3 completos del doc. *Armadura Arcana* pasa a requerir *Iniciado Místico + Mente de Inventor G1* (su versión no-mágica es la nueva *Armadura de Poder*), y sus dependientes aceptan **"Armadura Arcana G1 o Armadura de Poder G1"**.
- **Pacto de la Hoja revisado**: cláusula de **Desafío** (0 PA, 1/encuentro) en G1 y recuperación de Ingenio al abatir al desafiado en G3; leyenda nueva. *Iniciado Místico* añade **Juramento** a la lista de Fuentes.
- **Parser de requisitos ampliado** (`_parseTalentReq`): alternativas de talento con "o" (basta cumplir una), "Competencia con…" y "Origen: …" se tratan como informativos (antes habrían bloqueado como requisito imposible).
- **Importar JSON reconectado**: la función `loadJSON`/`triggerLoadJSON` existía pero no tenía botón en Ajustes (solo en la pantalla de inicio). Ahora *Ajustes → Datos* tiene **"↑ Importar JSON"** junto a Exportar.
- **Código zombie eliminado**: helper `app._tc` sin usos, wrappers `STORAGE.loadChar`/`saveCharData` nunca llamados, y ~2,2 KB de CSS muerto (19 clases sin referencia: `tc-check`, `js-talent-*`, `talent-count-badge`, `db-section-sep`, utilidades `u-*` huérfanas, etc. — verificado también contra construcción dinámica de nombres de clase).

Verificado en navegador: arranque, generador aleatorio, cálculo, tiradas, guardado, búsqueda y render de los 32 talentos nuevos en el Gestor, emparejamiento del requisito OR, y el botón de importar. (La suite de humo Node no pudo ejecutarse en esta máquina: no hay Node.js instalado.)

## Novedades v43 — Reglas v5.3.4 (parche de balance)

- **Actualización a las reglas v5.3.4** desde los tres documentos canónicos (Manual Básico v5.3.4, Compendio de Talentos y Catálogo de Axiomas). `STORAGE.RULES_DATA_VERSION` sube a `5.3.4-app-r1`, así que los usuarios que regresan adoptan las reglas nuevas automáticamente **sin tocar sus personajes guardados**.
- **Nuevo Talento General — *Resonancia del Canal*** (Talentos 192 → **193**): Modificador, REQ *Iniciado Místico · atributo de tu Fuente 13+ · Nivel 3+*. Al inicio de cada turno en combate recuperas Ingenio según el Grado (G1→1 · G2→2 · G3→3). Lo puede tomar cualquier lanzador con el Canal abierto (el Sagaz no: su Resonancia es innata).
- **Rasgos del Sagaz al día**: el texto del arquetipo aún mencionaba *Dominio de Axiomas* y *Paso Arcano* (retirados desde v5.3.2). Ahora refleja sus rasgos actuales: **Sentido de la Fuente · Conducción Arcana · Misticismo Innato · Retroalimentación Arcana**.
- **Conducción Arcana en el cálculo de Iniciativa**: para un Sagaz con una Fuente elegida, la Iniciativa usa el MOD de su atributo de Fuente (INT/SAB/CAR) en lugar de DES. Se aplica el **mejor de ambos** para no penalizar fichas que invirtieron en DES (regla "aplica solo la más alta"); el resto de Arquetipos siguen usando DES.
- **Veterano de Guerra (Audaz) build-agnóstico**: con armadura +1 CA; sin armadura, +1 a tiradas de combate. *Inercia de Guerra* ahora reconoce abatimientos por Axioma además de cuerpo a cuerpo y a distancia.
- Cambios del parche que son reglas de Manual (no cálculos de la app): coste de Esfuerzo +1 en toda la escala de Filo, fusión de la antigua Sobrecarga en el Esfuerzo, umbral de muerte (golpe letal deja a 1 PV en vez de matar), Regla del Profesional acotada en Grado 1 y la inversión de PD *Esfuerzo Profundo*. La app no computa esos valores, así que solo se reflejan en los textos de reglas correspondientes.

## Novedades v42 — Reglas v5.3.3 y fix de saltos de grado

- **Actualización a las reglas v5.3.3** desde los tres documentos canónicos (Manual, Compendio de Talentos, Catálogo de Axiomas):
  - **Talentos**: 191 → **192** (nuevo *Bendición Oscura*); se sincronizaron grados, leyendas y requisitos (187 talentos actualizados).
  - **Axiomas**: 330 → **332** (nuevos *Bola de Fuego Mayor* y *Rayo Relámpago Mayor*); rebalanceos de v5.3.3 (p. ej. *Chispa Arcana* y *Descarga* ahora escalan por nivel; *Rayo Relámpago* 8d6→4d6; *Bola de Fuego* reescrita).
  - **Manual** (linajes, arquetipos, trasfondos, equipo): sin cambios respecto a v5.3.1 — ya estaba al día.
- **Fix de saltos de grado**: 12 talentos saltaban de **Grado 1 a Grado 3** (les faltaba el Grado 2 por un error de parseo previo) — p. ej. *Maestría de Armas*, *Mente Arcana*, *Sentidos Primales*. Ahora todos tienen **G1 / G2 / G3** correlativos.
- **Personalizaciones conservadas** (a elección del usuario): Rompejuramentos mantiene el requisito *Iniciado Místico (Juramento)* y los talentos de Juramento usan solo **CAR**, aunque el doc no lo incluya.
- Se re-aplicó la limpieza de textos: sin etiquetas `[v5.x.x]` ni markdown `**` en la interfaz.

## Novedades v41 — Fuente aleatoria y revisión de consistencia

- **Generación aleatoria + Fuente**: al generar un personaje al azar, si la tirada deja el **Canal Arcano abierto** (sale Iniciado Místico, el Arquetipo es Sagaz o el Linaje ofrece Afinidad Mística), ahora también se asigna una **Fuente de Poder aleatoria**; si no, queda sin Fuente. Verificado: 25/25 personajes consistentes.
- **Limpieza de textos**: se eliminó el **markdown literal** (`**negritas**`, 98 marcas) que se mostraba como asteriscos en los efectos de talentos, y las **etiquetas internas de versión** (`[v5.2.2]` / `[v5.2.3]`, 30 en total) que ensuciaban descripciones de axiomas y trasfondos.
- **Consistencia de requisitos**: "Despertar Sobrenatural (Fuente)" y "Poderío Arcano (Fuente)" ahora también **comprueban la Fuente elegida** (como Iniciado Místico), no solo que tengas el talento. Se corrigió el aviso obsoleto que remitía a la "pestaña Aptitudes" (ahora "en el Gestor de Talentos").
- Sin nombres/ids de talento duplicados; se retiró el último resto de emoji en código.

## Novedades v40 — Edición de grado solo en el Gestor, Fuente de solo lectura y fix de talentos

- **Fix de talentos corruptos**: *Facultades de Percepción* tenía texto erróneo (había absorbido toda la cola del documento, 10 600 caracteres) — ahora muestra su requisito, leyenda y las cuatro opciones correctas. Se limpió también la "prosa de sección" que se había colado en *Red de Contactos* y *Políglota*.
- **Grados editables solo en el Gestor**: el resumen (sección Stats) y Detalle son ahora de **solo lectura** — muestran el Grado activo y los efectos con realce acumulativo, pero **no** permiten cambiar el grado. El cambio de grado se hace **dentro del Gestor**, con un **stepper claro** (`− G2 / 3 +`) en el talento ya elegido.
- **Fuente de Poder**: el selector editable vive **solo en el Gestor** (aparece arriba cuando el Canal está abierto). En el resumen y Detalle la Fuente elegida se muestra en **solo lectura**, sin selector dentro de la tarjeta del talento.

Verificado en navegador: el talento corregido, stepper de grado con topes (G1↔G3), resumen/detalle sin edición de grado, Fuente editable solo en el gestor y de lectura en el resumen.

## Novedades v39 — Búsqueda de talentos, Fuente en contexto, atributos de Fuente y tarjetas de talento

- **Búsqueda de talentos por relevancia**: al teclear un nombre, el talento sale **primero** (puntúa nombre exacto > prefijo > contiene, por encima de coincidencias en descripción/grados; búsqueda AND sin acentos). Antes mostraba otros talentos de forma torpe.
- **Fuente de Poder en contexto**: se retiró el recuadro suelto de Aptitudes; ahora, al elegir **Iniciado Místico** (o Sagaz / Afinidad racial), aparece el **selector de Fuente dentro del resumen de Talentos**, y la elegida se ve también en Detalle. Sigue marcando los requisitos de Fuente.
- **Atributos representativos de Fuente**: **Divinidad → SAB**, **Juramento → CAR**, **Psiónica → INT/SAB/CAR**. Se actualizaron los requisitos de los talentos de esas Fuentes en consecuencia (los talentos compartidos Divinidad/Juramento mantienen "SAB o CAR").
- **Tarjetas de talento enriquecidas**: el recuadro de Talentos (sección Stats) ahora usa las mismas tarjetas colapsables que Detalle. En el gestor puedes **subir el Grado** del talento ya elegido; en lectura se muestra el **Grado activo** y los efectos con realce **acumulativo**: con Grado 2, los efectos de **G1 y G2** aparecen como adquiridos y **G3 atenuado** ("aún no adquirido").

Verificado en navegador: orden de búsqueda, aparición del selector de Fuente con Iniciado Místico, emparejamiento por atributo de cada Fuente, realce acumulativo de grados y persistencia (Fuente + Grado viajan con el personaje).

## Novedades v38 — Fuente de Poder, Grado activo, Audaz y editor de talentos

- **Fuente de Poder** (pestaña Aptitudes): al abrir el Canal (Iniciado Místico, Sagaz o Afinidad racial) eliges la Fuente y queda **registrada**, de modo que los talentos/axiomas que piden "Iniciado Místico (Pacto/Juramento/…)" se marcan como requisito **cumplido solo con la Fuente correcta** (antes se ignoraba el paréntesis).
- **Rompejuramentos**: sus 7 talentos ahora requieren **Iniciado Místico (Juramento)** en lugar del texto de Ruptura.
- **Audaz ignora los requisitos de equipo**: con Audaz, armas/armaduras/escudos ya **no muestran la alerta "Requiere FUE/DES…"** (flag `ignoresGearReq`).
- **Grado activo de talentos**: cada talento elegido tiene un **selector de Grado (G1/G2/G3)** en la página Detalle; el Grado activo se resalta, aparece como insignia en el resumen y **se guarda con el personaje**.
- **Editor de reglas — talentos**: el formulario ahora edita **Requisitos** y **Grado 1/2/3** (además de nombre y leyenda), preservando el `id`; antes descartaba grados y requisitos al guardar.
- **Sin emojis**: se retiraron los emojis pictográficos de la interfaz (💾, 📂, 📈, ⚔), sustituidos por texto o el glifo monocromo ✦.

Todo verificado en navegador: emparejamiento de Fuente, supresión de alertas del Audaz, selector y persistencia del Grado activo, y el editor de talentos guardando requisitos + grados.

## Novedades v37 — Habilidades jugables, Ventaja/Desventaja y fix de doble carga

**Habilidades como botones de tirada.** Cada habilidad seleccionada se tira según el manual (Cap. VI §1): **2d10 + MOD del Atributo + Grado de Maestría** (el PB no se aplica). Incluye Dobles del Destino (doble 10 = éxito crítico, doble 1 = Ojos de Serpiente), el mínimo de 7 en los dados a partir de Grado 3, y muestra el Grado y el atributo en el modo lectura.

**Sistema de Grados con suelo automático.** El modo *lectura* solo tira (no es editable). En modo *edición*, bajo los selectores, una caja **Grado y Atributo** permite por cada habilidad:
- Un **stepper de Grado** cuyo mínimo se calcula solo (modelo de adquisiciones del manual): elegir la misma habilidad dos veces sube a G1, el linaje aporta su grado, etc. No se puede bajar por debajo de ese mínimo sin quitar selecciones.
- Un **selector de Atributo** con el sugerido por el manual por defecto (`Auto`, el de mayor modificador entre los candidatos), con opción de fijar otro.

**Grados sembrados desde el linaje.** Los `descriptors` declaran `skillGrants`; p. ej. el **Elfo** otorga *Proeza Física* a Grado 1, que aparece como botón incluso sin seleccionarla y se apila con las selecciones (linaje G1 + 1 selección = G2). Los grants de linaje *a elección* (Humano Legado, Medio Elfo) se dejan a la selección manual.

**Ventaja / Normal / Desventaja** aplicado a **todas las tiradas**: 2d10 → 3d10 conservando los 2 más altos/bajos; 1d20 (salvaciones y ataques) → 2d20 con el mejor/peor. Si ambas aplicaran, se cancelan (regla del Glosario). Se controla con un **botón flotante pequeño** en la esquina (sobre la barra inferior) que despliega las tres opciones al tocarlo y se colapsa al elegir o al tocar fuera — sin estorbar la navegación en móvil.

**Fix: la pantalla de carga aparecía dos veces** en la primera visita. El `controllerchange` del Service Worker (por `clients.claim()`) provocaba una recarga incluso en la instalación inicial; ahora solo recarga en **actualizaciones reales** (cuando la página ya estaba controlada).

**Densidad de la hoja**: el espacio entre secciones (paneles) se redujo a la mitad (14→7 px) para ver más en una pantalla.

Todo verificado en navegador (incl. móvil 375 px): fórmulas, suelo de grado, override de atributo, ventaja/desventaja en ambos tipos de dado, persistencia (grados extra y atributo elegido viajan con el personaje), arranque único y el FAB sin solaparse con la nav.

## Novedades v36 — Sincronización con las reglas **v5.3 / v5.3.1**

La base de datos de reglas (`js/data.js`) se actualizó de **v5.2.2 a v5.3.1**, sincronizada con los tres documentos canónicos: el *Manual Básico v5.3*, el *Compendio Maestro de Talentos v5.3.1* y el *Catálogo de Axiomas v5.3*. Ninguna funcionalidad de la app cambió — solo los datos. `STORAGE.RULES_DATA_VERSION` se incrementó a `5.3.1-app-r1`, así que los usuarios que regresan adoptan automáticamente las reglas nuevas **sin tocar sus personajes guardados**.

**Axiomas (Catálogo v5.3) — 327 → 330 entradas:**

- Nuevos: **Explosión Sobrenatural** (Truco), **Armadura Gélida** y **Espurio** (Erudición Nv1).
- Rebalanceo de PA: *Palabra de Poder: Aturdir*, *Palabra de Poder: Matar* y *Palabra Sagrada* pasan de 1 PA a **2 PA**.
- Reetiquetado de versión interno (`[v5.2.2]` → `[v5.2.3]`) y normalización de comillas en los efectos.
- Las 327 entradas previas se conservan con su mismo `id` (compatibilidad con personajes guardados).

**Talentos (Compendio v5.3.1) — 175 → 191 talentos, 15 → 16 catálogos:**

- Nueva categoría **Rompejuramentos** (7 capacidades-espejo de La Caída): *Tormento, Aura de Odio, Aspecto Pavoroso, Mando sobre los Muertos, Sentencia de Condena, Voluntad Corrupta, Armadura Profana*.
- **Los Seis Juramentos** con su Talento-firma en la categoría *Juramento*: *Luz de Refugio* (Faro), *Marca de la Deuda* (Ceniza), *Sello del Umbral* (Umbral), *Luz Imperecedera* (Antiguo), *Voto de Enemistad* (Promesa), *Presencia del Trono* (Trono).
- Nuevos talentos sueltos: *Estallido agonizante* (Pacto), *Sangre de Veterano* y *Maestría de la Materia* (General).

**Datos del Manual (Apéndice A + Cap. II):**

- **Sintético**: bono de atributo ahora **+1 CON, +1 INT** (antes solo +1 CON) — afecta el cálculo automático de atributos.
- **Armadura de Placas**: CA base **17 → 18**.
- Nueva arma magitec: **Lanzagranadas** (3d6, área 15 pies).
- **Soldado**: habilidad *Perspicacia* corregida a *Percepción* (según la tabla del manual).
- **Elfo**: Visión Élfica ajustada a 60 pies (texto del manual).

> El módulo de extracción y los textos fuente intermedios se conservan fuera del despliegue; la app sigue siendo cero *build step*.

## Novedades v35 — Modo lectura de "Equipo de Combate" reconstruido desde cero

La vista resumen de Equipo de Combate cambió de arquitectura. La versión anterior era markup estático en `index.html` cuyo contenido se actualizaba "raspando" el `textContent` de la vista de edición — un acoplamiento al DOM que dependía del orden de ejecución y que originó toda la familia de bugs de "Desarmado fantasma".

Ahora:

- `calc()` deposita su resultado en un **estado único** (`app._combat`: CA, armadura, escudo, y nombre/ataque/daño/avisos de ambas armas).
- `_buildCombatSummary()` **regenera la vista completa** desde ese estado en cada cálculo. Cero lecturas del DOM de otras vistas ⇒ es estructuralmente imposible que el modo lectura diverja de los valores calculados, sin importar el orden de carga o renderizado.
- En `index.html` el contenedor `#combat_summary_view` queda como cascarón vacío que el renderer llena (misma apariencia: se reutilizan las clases `atk-card`, `fbox`, `abtn`…).
- Mejora: los avisos del arma (p. ej. "⚠ Sin datos de arma" o requisitos de FUE/DES no cumplidos) ahora también se ven en el modo lectura.
- Los nombres se escapan con `_esc` (los items personalizados son entrada del usuario).

Suite de humo: **28 pruebas**, todas en verde.

## Novedades v34 — Fix: resumen de "Equipo de Combate" rancio al cargar

**Síntoma.** Tras abrir un personaje, la página *Ataques* y la vista de edición eran correctas, pero el resumen colapsado de **Equipo → Equipo de Combate** mostraba "Desarmado" en Principal y Secundaria, con el texto de ataque/daño de desarmado — mientras el chip de tirada de ese mismo resumen sí tenía los valores correctos.

**Causa raíz (orden de carga en `applyCharData`).** `updateOptions()` ejecuta un `calc()` *antes* de restaurar los `<select>` (calcula "Desarmado"); luego se restauran los selects; luego `confirmSection('combat')` construye el resumen **con esos valores rancios**; y el `calc()` final corregía la edición, la página Ataques y los chips `sum_atk*` — pero `sum_wep*_name` y `sum_wep*_stats` solo se reescribían en `_buildCombatSummary`, que ya no volvía a ejecutarse.

**Fix.** `calc()` ahora refresca también el resumen de combate (mismo patrón que ya usaba con Stats y Salvaciones): el resumen no puede volver a quedar desincronizado, sin importar el orden de carga. De paso esto corrige el mismo desfase en la armadura/escudo del resumen.

Suite de humo: **27 pruebas**, todas en verde.

## Novedades v33 — Fix: arma equipada que decía "Desarmado"

**Síntoma reportado.** Al abrir un personaje, Principal/Secundaria parecían "resetearse": el botón de ataque mostraba valores correctos pero el texto decía *Desarmado* y las tiradas calculaban ataque/daño de desarmado.

**Causas raíz (tres, encadenadas):**

1. **El editor ✎ destruía los datos del item.** `saveCustomItem` reconstruía el objeto como `{uid, name, slots, type}`, eliminando `dbKey`/`dbData`. Editar un arma equipada (aunque solo el nombre) la dejaba sin datos de juego → `_calcWeapon` no encontraba `wData` y degradaba a "Desarmado" pese a seguir seleccionada. **Fix:** la edición ahora preserva la identidad del item (`{...existing}`) y sus datos.
2. **Caché de tiradas rancia.** La rama "desarmado" de `_calcWeapon` retornaba sin actualizar `_weaponAtkData`, así que el botón de tirada conservaba el bono del arma anterior — el estado mixto "botón correcto / texto desarmado". **Fix:** la caché se actualiza en todas las ramas.
3. **uids colisionables.** `Date.now()` a secas genera uids duplicados al añadir varios items en el mismo milisegundo; con duplicados, los selects y `_getInventoryItem` podían resolver al item equivocado. **Fix:** generador monotónico `_nextUid()` + migración automática al cargar personajes antiguos (el primer item conserva el uid, así las selecciones guardadas no cambian).

**Mejoras asociadas:**

- El editor de items ahora permite definir **datos de juego por tipo**: daño y bono de ataque (armas), CA base y categoría (armaduras), bono de CA (escudos). Los objetos personalizados ya combaten de verdad.
- Arma sin datos (heredada de guardados antiguos): se respeta la selección — muestra **su nombre**, ataca como arma genérica 1d4 y avisa *"⚠ Sin datos de arma — edítala (✎) para definirlos"* en lugar de fingir "Desarmado".
- Armadura/escudo sin datos: mismos números que antes (CA 10 / bono 0) pero mostrando el nombre real con "(sin datos)" en vez de "Sin Armadura".

Suite de humo: **26 pruebas**, todas en verde.

## Novedades v32 — Ajustes & Datos rediseñado

**Menú reordenado** (frecuencia de uso → acciones de datos al final): *Retrato → Interfaz → Apariencia (Tema + Fondo) → Datos (Personaje + Reglas)*. Se eliminó el botón redundante de cierre superior duplicado en lógica; el botón inferior "✓ Listo" se conserva por ergonomía de pulgar en móvil.

**Retrato con ámbito explícito.** Un control segmentado *"Aplicar a: Este personaje | Global (todos)"* hace visible lo que antes era implícito:

- **Este personaje** (por defecto con una hoja abierta): tamaño, forma y borde son vista previa en vivo; *"✓ Aplicar a este personaje"* los persiste en `_prefs` de SU entrada del roster sin tocar el global ni a otros personajes.
- **Global (todos)**: *"✓ Guardar como global"* fija el predeterminado de la app (nuevos personajes y los que no tengan ajustes propios). Único ámbito disponible desde Inicio o con "Ajustes individuales por personaje" desactivado (el segmento se deshabilita solo).
- El toggle **"Ajustes individuales por personaje"** (antes "Guardar ajustes con personaje") sigue siendo el interruptor maestro; **"Borde Premium"** pasó a fraseo positivo (activado = borde dorado), eliminando el doble negativo "Desactivar Borde Premium".

**Blindaje anti ghost-click ampliado** (`js/ui-dialogs.js`):

- **Capa 4 — guardia de armado**: el click sintetizado (~300 ms tras el `touchend`) que aterrice *sobre los propios botones* del diálogo recién abierto ya no puede activarlos: cada botón exige un `pointerdown` propio posterior a la apertura (las activaciones de teclado, `detail === 0`, se aceptan siempre). Antes, tocar "Guardar" justo donde luego aparece "✓ Sobreescribir" podía auto-confirmar.
- **`UI.ghostShield(ms)`**: escudo independiente reutilizable. `app.saveFromSettings()` y `app.closeSettings()` lo usan al cerrar el modal de Ajustes, de modo que el toque sobre "💾 Guardar"/"✓ Listo"/"✕" no traspasa a la hoja que queda al descubierto ni al diálogo de confirmación que aparece después.

La suite de humo creció a 22 pruebas en esta versión, incluyendo: ámbito global vs por-personaje sin contaminación cruzada, cierre de Ajustes bajo escudo, liberación anticipada del escudo y la guardia de armado contra clicks fantasma sobre el botón OK.

## Estructura del proyecto

```
ss-companion/
├── index.html          Markup semántico (sin CSS ni JS embebidos masivos)
├── manifest.json       Manifest PWA  ← NUEVO (antes referenciado pero inexistente)
├── sw.js               Service Worker offline-first  ← NUEVO (ídem)
├── css/
│   └── main.css        Tokens de diseño + toda la hoja de estilos
├── js/
│   ├── data.js         Base de datos de reglas por defecto (v5.3.5)
│   ├── constants.js    Constantes del sistema y temporizadores de UI
│   ├── storage.js      Persistencia versionada con migraciones (localStorage)
│   ├── ui-dialogs.js   Diálogos modales con escudo anti ghost-click  ← NUEVO
│   ├── app.js          Lógica principal (hoja, cálculo, dados, editores…)
│   └── boot.js         Arranque + registro/actualización del Service Worker
└── smoke_test.cjs      Suite de humo (Node + jsdom)
```

Los scripts se cargan con `defer` en orden de dependencia y comparten el ámbito global del documento (patrón deliberado: cero *build step*, compatible con los manejadores declarativos del markup y con despliegue por simple copia de archivos).

## El bug corregido: toque que "traspasa" el botón de confirmación

**Síntoma.** Al pulsar **Guardar** sobre un personaje existente aparece el diálogo *"¿Sobreescribir personaje?"*. Al tocar **✓ Sobreescribir**, el toque atravesaba el diálogo y activaba lo que estuviera detrás (inputs de la hoja, el engranaje del header…).

**Causa raíz.** En móvil, el navegador sintetiza un evento `click` ~300 ms después del `touchend`, **en las mismas coordenadas**. El código anterior retiraba su bloqueador de eventos apenas 2 frames (~32 ms) después de cerrar, así que el click fantasma aterrizaba en la página ya desprotegida. Además, `onConfirm` podía ejecutarse dos veces (`pointerup` + `click`).

**Solución** (`js/ui-dialogs.js`), defensa en tres capas:

1. `preventDefault()` en `pointerup` sobre los botones → suprime el click sintetizado en origen donde el motor lo respeta.
2. Bloqueador en fase de **captura a nivel de `document`** para todos los eventos de puntero/táctiles/click que no nazcan dentro de la tarjeta del diálogo.
3. Tras cerrar, el bloqueador pasa a modo *absorber todo* y permanece vivo **450 ms** (> ventana de ~300 ms de iOS) antes de liberarse y devolver el foco al elemento invocador.

Extras del nuevo diálogo: ejecución única garantizada de `onConfirm`/`onCancel`, `role="alertdialog"` con trampa de foco y Escape, variante visual de **peligro** automática para acciones destructivas, animación de entrada/salida (respetando `prefers-reduced-motion`), *tick* háptico y cierre al tocar el fondo. `app._confirm` ahora delega aquí, de modo que **los 6 flujos de confirmación de la app** (sobreescribir, resetear, eliminar personaje, salir sin guardar, borrar entrada de reglas, limpiar talentos) quedan protegidos.

## PWA completada

- `sw.js`: precache del *app shell* (funciona 100 % offline), caché *stale-while-revalidate* para Google Fonts, versionado de caché y soporte del mensaje `SKIP_WAITING` que `boot.js` ya enviaba al tocar el aviso "Nueva versión disponible".
- `manifest.json`: instalable en pantalla de inicio, `display: standalone`, orientación retrato, colores del tema.

> Para subir una nueva versión: incrementa `CACHE_VERSION` en `sw.js`.

## Pruebas

```bash
npm install jsdom
node smoke_test.cjs
```

Cubre: arranque, render del roster, creación de hoja, cálculo, generador aleatorio, guardado, **apertura del diálogo de confirmación, bloqueo de clicks externos, ejecución única al confirmar, absorción del click fantasma post-cierre y recuperación de la interactividad**, tirada de dados, inventario y exportación JSON.

## Despliegue

Copia la carpeta a cualquier hosting estático (GitHub Pages, Netlify, un servidor propio). Requiere **HTTPS** (o `localhost`) para que el Service Worker se registre.

Para desarrollo local:

```bash
npx serve .          # o: python3 -m http.server
```
