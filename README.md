# S&S Companion — v55.0

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

