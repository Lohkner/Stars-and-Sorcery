/* ══════════════════════════════════════════
   CONSTANTES — S&S Director
══════════════════════════════════════════ */
/** Retrato vacío (el mismo de S&S Companion). */
const DEFAULT_PORTRAIT = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='%23382f47'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

/** Ancho máximo del retrato recortado (px) */
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
