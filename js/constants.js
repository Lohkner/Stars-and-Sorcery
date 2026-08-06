/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
/** Stat keys in canonical order */
const STATS = ['FUE','DES','CON','INT','SAB','CAR'];

/** Proficiency bonus thresholds by level */
const PROF_THRESHOLDS = [[9,4],[5,3],[1,2]]; // S&S: Nv1-4→+2, Nv5-8→+3, Nv9-10→+4 (PB solo en Salvaciones elegidas y ataques; NO en tiradas de habilidad)

/* ── Habilidades — Manual Cap.VI §2 ──────────────────────────
   Tirada: 2d10 + MOD del Atributo asociado + Grado de Maestría vs CD.
   El PB NO se suma. Cuando hay dos atributos posibles se usa el de
   mayor modificador. Las Especializadas sin Grado 0 sufren Desventaja
   Técnica (3d10, suma los 2 más bajos) — no aplica a habilidades ya
   adquiridas (Grado ≥ 0), que es lo único que se muestra como botón. */
const SKILL_ATTR = {
  // Generales
  'Sigilo':['DES'], 'Proeza Física':['FUE','DES'], 'Percepción':['SAB'],
  'Perspicacia':['SAB'], 'Influencia':['CAR'], 'Engaño':['CAR'],
  'Supervivencia':['SAB'], 'Intimidación':['CAR','FUE'],
  // Especializadas
  'Arcano':['INT'], 'Medicina':['SAB'], 'Tecnología':['INT'], 'Historia':['INT'],
  'Religión':['INT'], 'Naturaleza':['INT'], 'Investigación':['INT'],
  'Herramientas de Ladrón':['DES'], 'Conocimiento de la Calle':['CAR','INT'],
  'Artesanía':['INT','DES'], 'Conocimiento':['INT'],
};
const SKILL_SPECIALIZED = new Set([
  'Arcano','Medicina','Tecnología','Historia','Religión','Naturaleza',
  'Investigación','Herramientas de Ladrón','Conocimiento de la Calle',
  'Artesanía','Conocimiento',
]);
/** Nombre del Grado de Maestría (Manual Cap.VI §1) */
const SKILL_GRADE_NAMES = ['Novato','Entrenado','Hábil','Especialista','Maestro'];

/** XP required to reach each level (index = current level) */
const XP_TABLE = [0, 300, 900, 2100, 4500, 9000, 16000, 28000, 44000, 62000];

/* ── Progresión por nivel (Expert v1.0, «Tabla de progresión completa»)
   Índice = nivel, así que la posición 0 no se usa. Total al Nivel 10:
   7 Talentos · 1 Epítome · 14 PD · PB +4.                              */

/** PD ganados AL ALCANZAR cada nivel. El Nivel 1 no otorga ninguno. */
const PD_POR_NIVEL = [0, 0, 2, 1, 2, 1, 2, 1, 2, 1, 2];

/** Espacios de Talento disponibles en cada nivel (3 iniciales + 1 en los
    niveles impares a partir del 3). El Epítome del Nivel 10 va aparte. */
const TALENT_SLOTS = [0, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];

/** Hito narrativo de cada nivel, para avisar al subir. */
const HITOS_NIVEL = {
  3:  '+1 Talento nuevo',
  5:  '+1 Talento nuevo · Hito de Estilo (y +1 a un Atributo, opcional)',
  7:  '+1 Talento nuevo',
  9:  '+1 Talento nuevo · Hito de Estilo (y +1 a un Atributo, opcional)',
  10: 'Trascendencia + Epítome',
};

/* ── Descanso y recuperación (Reglas Esenciales §7) ─────────────
   La Carne/Flesh NO figura aquí a propósito: ningún descanso la
   recupera. Solo sube 1 punto por semana completa de reposo real,
   con curación avanzada (100 pp) o con botiquín avanzado (CD 16). */
const DESCANSOS = [
  { id:'respiro',     nombre:'Respiro',                  dur:'10 min',
    coste:'1 Ración',
    txt:'1d8 + MOD CON en PV. Las Reservas no se recuperan.',
    pv:'1d8+con', reservas:0 },
  { id:'largo_inseg', nombre:'Descanso Largo — Inseguro', dur:'6 h',
    coste:'1 Ración',
    txt:'Mitad de PV máximos y mitad de Reservas. No elimina Fatiga.',
    pv:'mitad',   reservas:.5 },
  { id:'largo_seg',   nombre:'Descanso Largo — Seguro',   dur:'8 h',
    coste:'1 Ración + entorno adecuado',
    txt:'Todos los PV y Reservas. Elimina 1 nivel de Fatiga.',
    pv:'todo',    reservas:1 },
  { id:'largo_conf',  nombre:'Descanso Largo — Confortable', dur:'8 h',
    coste:'Posada de calidad o camarote',
    txt:'Todos los PV y Reservas. Elimina 2 niveles de Fatiga.',
    pv:'todo',    reservas:1 },
];

/* ── Migración de ids de Axioma (reglas v5.3.7/v5.3.8) ──────────
   Cuatro Axiomas cambiaron de id (unidades en el nombre y el estado
   canónico Ensordecido). Los personajes guardados bajo v5.3.5
   conservan sus selecciones con el id nuevo al cargarse.            */
const AXIOM_ID_RENAMES = {
  silencio_9_m:           'silencio_30_pies',
  invisibilidad_9_m:      'invisibilidad_30_pies',
  proteccion_del_mal_9_m: 'proteccion_del_mal_30_pies',
  sordera:                'ensordecido',
};

/* ── Migración de ids de Talento (reglas v5.5.2) ─────────────────
   El Compendio v5.5.2 reestructuró 90 talentos en catálogos nuevos y
   talentos-contenedor con opciones (Voto, Origen de Sangre, Pacto,
   Dominio Divino…). La inmensa mayoría no tiene un id 1:1 equivalente
   (pasan a ser una opción dentro de otro talento) y no se pueden
   migrar automáticamente sin perder la elección original del jugador.
   Solo se listan aquí los renombres puros verificados (mismo id salvo
   el cambio de terminología "Ki"→"Qi", contenido idéntico letra por
   letra en sus tres Grados). Los personajes con talentos v5.3.8 que no
   están en este mapa conservan su nombre/leyenda guardados pero la
   ficha lo marca como no encontrado en la base actual — ver
   `_findTalent` / `_talentRichCard` en app.js. */
const TALENT_ID_RENAMES = {
  golpe_de_ki:      'golpe_de_qi',
  reflexion_de_ki:  'reflexion_de_qi',

  /* ── Compendio de Sendas v2.0 ───────────────────────────────────
     Solo renombrados 1:1 comprobados: o el texto del Grado 1 coincide
     letra por letra, o es el MISMO concepto con el artículo caído del
     nombre. Los talentos-contenedor que el v2.0 desglosó en varios
     (Origen de Sangre → los ocho Orígenes) NO se mapean: elegir por el
     jugador cuál le tocó sería inventarse su ficha. Esos muestran
     "⚠ No encontrado" y conservan su texto en la ficha guardada. */
  dominio_de_la_vida:         'dominio_de_vida',
  dominio_de_la_luz:          'dominio_de_luz',
  dominio_de_la_guerra:       'dominio_de_guerra',
  dominio_de_la_tormenta:     'dominio_de_tormenta',
  dominio_de_la_naturaleza:   'dominio_de_naturaleza',
  dominio_de_la_forja:        'dominio_de_forja',
  dominio_del_conocimiento:   'dominio_de_conocimiento',
  dominio_del_engano:         'dominio_de_engano',
  dominio_de_la_muerte_requiere_aprobacion_del_dj: 'dominio_de_muerte',

  companero_de_exploracion:   'vinculo_animal',
  pericia_que_vuelve:         'filo_que_vuelve',
  qi_en_la_pericia:           'qi_en_el_filo',
  metamagia_arcana:           'torsion_arcana',
};

/** Inventory slots per card cap */
const MAX_PORTRAIT_W = 600;

/** Max JSON import size (bytes) */
const MAX_JSON_BYTES = 2 * 1024 * 1024;

/* ── UI Timing constants (ms) ────────────────────────
   Centralising these avoids scattered magic numbers and
   makes animation tuning a single-location change.      */
const TIMING = {
  /** Loader fade-out after init */
  LOADER_DISMISS:    300,
  /** Safety-net loader timeout */
  LOADER_TIMEOUT:   5000,
  /** Toast visible duration */
  TOAST_VISIBLE:    3200,
  /** Toast fade-out duration */
  TOAST_FADE:        240,
  /** Section confirm-button success flash */
  CONFIRM_FLASH:     480,
  /** Skill-limit flash red duration */
  SKILL_FLASH:       340,
  /** Dice overlay close animation */
  DICE_CLOSE:        180,
  /** Resource colour-flash after adjust */
  RES_FLASH:         240,
  /** Saved-label "fresh" highlight */
  SAVED_FRESH:      3500,
  /** Swipe ghost-click suppression window — shorter = less dead zone after swipe */
  SWIPE_SUPPRESS:    220,
  /** Crop spring transition */
  CROP_SPRING:       280,
  /** Long-press initial threshold — shorter feels more responsive */
  LONGPRESS_HOLD:    320,
  /** Long-press minimum repeat interval */
  LONGPRESS_MIN:      50,
};
