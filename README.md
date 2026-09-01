# S&S Companion — v55.1

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

