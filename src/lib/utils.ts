import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from './dayjs';
import { getUserTimezone } from './dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display (in user's local timezone)
 * @param date - Date string or Date object
 * @returns Formatted date string (DD/MM/YYYY)
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return '-';
  try {
    const parsed = dayjs(date);
    if (!parsed.isValid()) return 'Date invalide';
    return parsed.tz(getUserTimezone()).format('DD/MM/YYYY');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Erreur de date';
  }
}

/**
 * Format date and time for display (in user's local timezone)
 * @param date - Date string or Date object
 * @returns Formatted datetime string (DD/MM/YYYY HH:mm)
 */
export function formatDateTime(date: Date | string | null): string {
  if (!date) return '-';
  try {
    const parsed = dayjs(date);
    if (!parsed.isValid()) return 'Date invalide';
    return parsed.tz(getUserTimezone()).format('DD/MM/YYYY HH:mm');
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return 'Erreur de date';
  }
}

/**
 * Format time only for display (in user's local timezone)
 * @param date - Date string or Date object
 * @returns Formatted time string (HH:mm)
 */
export function formatTime(date: Date | string | null): string {
  if (!date) return '-';
  try {
    const parsed = dayjs(date);
    if (!parsed.isValid()) return 'Heure invalide';
    return parsed.tz(getUserTimezone()).format('HH:mm');
  } catch (error) {
    console.error('Time formatting error:', error);
    return 'Erreur d\'heure';
  }
}

/**
 * Format relative date (e.g., "il y a 2 heures")
 * @param date - Date string or Date object
 * @returns Relative date string
 */
export function formatRelativeDate(date: Date | string | null): string {
  if (!date) return '-';
  try {
    const parsed = dayjs(date);
    if (!parsed.isValid()) return 'Date invalide';
    return parsed.tz(getUserTimezone()).fromNow();
  } catch (error) {
    console.error('Relative date formatting error:', error);
    return 'Erreur de date';
  }
}

export function getFullName(firstName: string | null, lastName: string | null): string {
  if (!firstName && !lastName) return '-';
  return [firstName, lastName].filter(Boolean).join(' ');
}

export function getInitials(firstName: string | null, lastName: string | null): string {
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || '?';
}

export function truncate(str: string | null | undefined, length: number): string {
  if (!str) return '-';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getGenderLabel(gender: 'M' | 'F'): string {
  return gender === 'M' ? 'Homme' : 'Femme';
}

export function getRoleLabel(role: string): string {
  return role === 'admin' ? 'Administrateur' : 'Utilisateur';
}

/**
 * Convert Date object to ISO string for API (always UTC)
 * @param date - Date object
 * @returns ISO 8601 string
 */
export function formatDateForAPI(date: Date): string {
  return dayjs(date).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
}

/**
 * Convert time to ISO string for API (with fixed date, UTC)
 * @param date - Date object with time
 * @returns ISO 8601 string with fixed date (2000-01-01)
 */
export function formatTimeForAPI(date: Date): string {
  const time = dayjs(date).format('HH:mm:ss');
  return dayjs(`2000-01-01 ${time}`).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
}

/**
 * Convert HTML date input (YYYY-MM-DD) to ISO string for API
 * @param dateString - Date string from HTML input
 * @returns ISO 8601 string (UTC)
 */
export function dateInputToISO(dateString: string): string {
  // Parse in user's timezone, then convert to UTC
  return dayjs.tz(dateString, 'YYYY-MM-DD', getUserTimezone())
    .utc()
    .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
}

/**
 * Convert HTML time input (HH:mm) to ISO string for API
 * @param timeString - Time string from HTML input (HH:mm)
 * @returns ISO 8601 string with fixed date (2000-01-01, UTC)
 */
export function timeInputToISO(timeString: string): string {
  // Parse in user's timezone
  const parsed = dayjs.tz(`2000-01-01 ${timeString}`, 'YYYY-MM-DD HH:mm', getUserTimezone());
  return parsed.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
}

/**
 * Convert ISO string to HTML date input format (YYYY-MM-DD)
 * Converts from UTC to user's local timezone
 * @param isoString - ISO 8601 string
 * @returns Date string for HTML input (YYYY-MM-DD)
 */
export function isoToDateInput(isoString: string | null): string {
  if (!isoString) return '';
  try {
    const parsed = dayjs(isoString);
    if (!parsed.isValid()) return '';
    return parsed.tz(getUserTimezone()).format('YYYY-MM-DD');
  } catch (error) {
    console.error('ISO to date input conversion error:', error);
    return '';
  }
}

/**
 * Convert ISO string to HTML time input format (HH:mm)
 * Converts from UTC to user's local timezone
 * @param isoString - ISO 8601 string
 * @returns Time string for HTML input (HH:mm)
 */
export function isoToTimeInput(isoString: string | null): string {
  if (!isoString) return '';
  try {
    const parsed = dayjs(isoString);
    if (!parsed.isValid()) return '';
    return parsed.tz(getUserTimezone()).format('HH:mm');
  } catch (error) {
    console.error('ISO to time input conversion error:', error);
    return '';
  }
}

/**
 * Parse any date string/object to Day.js object
 * @param date - Date string or Date object
 * @returns Day.js object in user's timezone or null
 */
export function parseDate(date: Date | string | null): dayjs.Dayjs | null {
  if (!date) return null;
  try {
    const parsed = dayjs(date);
    if (!parsed.isValid()) return null;
    return parsed.tz(getUserTimezone());
  } catch (error) {
    console.error('Date parsing error:', error);
    return null;
  }
}

/**
 * Get current date/time in user's timezone
 * @returns Day.js object
 */
export function now(): dayjs.Dayjs {
  return dayjs().tz(getUserTimezone());
}

// Re-export timezone service functions for convenience (AVEC conversion UTC → Local)
export {
  formatUtcDate,
  formatUtcTime,
  formatUtcDateTime,
  createUtcFromLocal,
  isPastDate,
  getTimezoneDebugInfo,
  utcToDateInput,
  utcToTimeInput,
  compareDates,
} from '@/utils/timezoneService';

// Re-export display service functions (SANS conversion - affichage direct)
export {
  formatDisplayDate,
  formatDisplayTime,
  formatDisplayDateTime,
  toDateInput,
  toTimeInput,
  createIsoFromInputs,
  formatRelativeDate as formatRelativeDateDisplay,
} from '@/utils/displayDateService';
