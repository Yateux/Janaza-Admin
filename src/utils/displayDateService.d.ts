/**
 * Formater une date SANS conversion de timezone
 */
export function formatDisplayDate(date: string | Date | null, format?: string): string;

/**
 * Formater une heure SANS conversion de timezone
 */
export function formatDisplayTime(time: string | Date | null): string;

/**
 * Formater date et heure SANS conversion
 */
export function formatDisplayDateTime(
  date: string | Date | null,
  time: string | Date | null,
  format?: string
): string;

/**
 * Convertir pour input[type="date"] SANS conversion
 */
export function toDateInput(date: string | Date | null): string;

/**
 * Convertir pour input[type="time"] SANS conversion
 */
export function toTimeInput(time: string | Date | null): string;

/**
 * Créer une date ISO depuis les inputs SANS conversion
 */
export function createIsoFromInputs(date: string, time: string): string;

/**
 * Formater une date relative
 */
export function formatRelativeDate(date: string | Date | null): string;
