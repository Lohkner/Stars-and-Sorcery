# S&S Companion — v44

Hoja de personaje digital (PWA) para **Stars & Sorcery RPG**. Esta versión reestructura el monolito original de 7.800 líneas en un proyecto modular, corrige el bug de *touch bleed-through* del diálogo de confirmación y completa las piezas PWA que faltaban. **Toda la funcionalidad original se conserva** (verificado con suite de pruebas automatizada).





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
