import type { Dayjs } from 'dayjs';

/**
 * Interface pour les informations de debug du timezone
 */
export interface TimezoneDebugInfo {
  timezone: string;
  currentTimeUTC: string;
  currentTimeLocal: string;
  offset: string;
  offsetMinutes: number;
  isDST: boolean;
}

/**
 * Détecter le timezone du navigateur de l'utilisateur
 */
export function getUserTimezone(): string;

/**
 * Convertir une date UTC vers le timezone local pour l'affichage
 */
export function formatUtcDate(utcDate: string | Date | null, format?: string): string;

/**
 * Convertir une heure UTC vers le timezone local pour l'affichage
 */
export function formatUtcTime(utcDate: string | Date | null): string;

/**
 * Convertir une date et heure locale en UTC pour l'envoi à l'API
 */
export function createUtcFromLocal(date: string, time: string): string;

/**
 * Vérifier si une date UTC est dans le passé
 */
export function isPastDate(utcDate: string | Date | null): boolean;

/**
 * Obtenir les informations de debug du timezone
 */
export function getTimezoneDebugInfo(): TimezoneDebugInfo;

/**
 * Formater une date et heure UTC combinées pour l'affichage
 */
export function formatUtcDateTime(
  utcDate: string | Date | null,
  utcTime: string | Date | null,
  format?: string
): string;

/**
 * Convertir une date ISO vers un format compatible avec input[type="date"]
 */
export function utcToDateInput(utcDate: string | Date | null): string;

/**
 * Convertir une heure ISO vers un format compatible avec input[type="time"]
 */
export function utcToTimeInput(utcTime: string | Date | null): string;

/**
 * Obtenir la date/heure actuelle dans le timezone de l'utilisateur
 */
export function now(): Dayjs;

/**
 * Comparer deux dates UTC
 */
export function compareDates(date1: string | Date | null, date2: string | Date | null): number;

/**
 * Exporter dayjs configuré
 */
export const dayjs: typeof import('dayjs');
