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
