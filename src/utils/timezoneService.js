import dayjs from '@/lib/dayjs';

/**
 * Détecter le timezone du navigateur de l'utilisateur
 * @returns {string} Timezone IANA (ex: "Europe/Paris")
 */
export const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Erreur lors de la détection du timezone:', error);
    return 'Europe/Paris'; // Fallback par défaut pour la France
  }
};

/**
 * Convertir une date UTC vers le timezone local pour l'affichage
 * @param {string|Date} utcDate - Date en UTC (format ISO ou objet Date)
 * @param {string} format - Format d'affichage dayjs (ex: 'DD/MM/YYYY')
 * @returns {string} Date formatée dans le timezone local
 */
export const formatUtcDate = (utcDate, format = 'DD/MM/YYYY') => {
  if (!utcDate) return '-';

  try {
    const userTz = getUserTimezone();
    return dayjs.utc(utcDate).tz(userTz).format(format);
  } catch (error) {
    console.error('Erreur formatage date UTC:', error);
    return 'Date invalide';
  }
};

/**
 * Convertir une heure UTC vers le timezone local pour l'affichage
 * @param {string|Date} utcDate - Date/heure en UTC (format ISO ou objet Date)
 * @returns {string} Heure formatée dans le timezone local (HH:mm)
 */
export const formatUtcTime = (utcDate) => {
  if (!utcDate) return '-';

  try {
    const userTz = getUserTimezone();
    return dayjs.utc(utcDate).tz(userTz).format('HH:mm');
  } catch (error) {
    console.error('Erreur formatage heure UTC:', error);
    return 'Heure invalide';
  }
};

/**
 * Convertir une date et heure locale en UTC pour l'envoi à l'API
 * @param {string} date - Date locale (format: YYYY-MM-DD ou DD/MM/YYYY)
 * @param {string} time - Heure locale (format: HH:mm)
 * @returns {string} Date ISO en UTC (ex: "2025-10-05T18:00:00.000Z")
 */
export const createUtcFromLocal = (date, time) => {
  if (!date || !time) {
    throw new Error('Date et heure sont requises');
  }

  try {
    const userTz = getUserTimezone();

    // Normaliser le format de la date si elle est en DD/MM/YYYY
    let normalizedDate = date;
    if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Créer la date/heure dans le timezone local
    const localDateTime = dayjs.tz(`${normalizedDate} ${time}`, 'YYYY-MM-DD HH:mm', userTz);

    // Convertir en UTC et formater en ISO
    return localDateTime.utc().toISOString();
  } catch (error) {
    console.error('Erreur création date UTC:', error);
    throw error;
  }
};

/**
 * Vérifier si une date UTC est dans le passé
 * @param {string|Date} utcDate - Date en UTC
 * @returns {boolean} true si la date est passée
 */
export const isPastDate = (utcDate) => {
  if (!utcDate) return false;

  try {
    const userTz = getUserTimezone();
    const dateInUserTz = dayjs.utc(utcDate).tz(userTz);
    const nowInUserTz = dayjs().tz(userTz);

    return dateInUserTz.isBefore(nowInUserTz);
  } catch (error) {
    console.error('Erreur vérification date passée:', error);
    return false;
  }
};

/**
 * Obtenir les informations de debug du timezone
 * @returns {Object} Informations de debug
 */
export const getTimezoneDebugInfo = () => {
  const userTz = getUserTimezone();
  const now = dayjs();
  const nowUtc = dayjs.utc();
  const localNow = now.tz(userTz);

  // Calculer si on est en heure d'été (DST)
  // On compare l'offset actuel avec l'offset de janvier (hiver)
  const januaryOffset = dayjs().month(0).date(1).tz(userTz).utcOffset();
  const currentOffset = localNow.utcOffset();
  const isDST = currentOffset > januaryOffset;

  return {
    timezone: userTz,
    currentTimeUTC: nowUtc.format('YYYY-MM-DD HH:mm:ss'),
    currentTimeLocal: localNow.format('YYYY-MM-DD HH:mm:ss'),
    offset: localNow.format('Z'),
    offsetMinutes: currentOffset,
    isDST: isDST,
  };
};

/**
 * Formater une date et heure UTC combinées pour l'affichage
 * @param {string|Date} utcDate - Date en UTC
 * @param {string|Date} utcTime - Heure en UTC
 * @param {string} format - Format d'affichage (par défaut: 'DD/MM/YYYY à HH:mm')
 * @returns {string} Date et heure formatées dans le timezone local
 */
export const formatUtcDateTime = (utcDate, utcTime, format = 'DD/MM/YYYY à HH:mm') => {
  if (!utcDate || !utcTime) return '-';

  try {
    const userTz = getUserTimezone();
    // Utiliser utcTime car il contient déjà la date et l'heure complètes
    return dayjs.utc(utcTime).tz(userTz).format(format);
  } catch (error) {
    console.error('Erreur formatage date/heure UTC:', error);
    return 'Date/heure invalide';
  }
};

/**
 * Convertir une date ISO vers un format compatible avec input[type="date"]
 * @param {string|Date} utcDate - Date en UTC
 * @returns {string} Date au format YYYY-MM-DD dans le timezone local
 */
export const utcToDateInput = (utcDate) => {
  if (!utcDate) return '';

  try {
    const userTz = getUserTimezone();
    return dayjs.utc(utcDate).tz(userTz).format('YYYY-MM-DD');
  } catch (error) {
    console.error('Erreur conversion vers input date:', error);
    return '';
  }
};

/**
 * Convertir une heure ISO vers un format compatible avec input[type="time"]
 * @param {string|Date} utcTime - Heure en UTC
 * @returns {string} Heure au format HH:mm dans le timezone local
 */
export const utcToTimeInput = (utcTime) => {
  if (!utcTime) return '';

  try {
    const userTz = getUserTimezone();
    return dayjs.utc(utcTime).tz(userTz).format('HH:mm');
  } catch (error) {
    console.error('Erreur conversion vers input time:', error);
    return '';
  }
};

/**
 * Obtenir la date/heure actuelle dans le timezone de l'utilisateur
 * @returns {Object} Objet dayjs dans le timezone local
 */
export const now = () => {
  const userTz = getUserTimezone();
  return dayjs().tz(userTz);
};

/**
 * Comparer deux dates UTC
 * @param {string|Date} date1 - Première date en UTC
 * @param {string|Date} date2 - Deuxième date en UTC
 * @returns {number} -1 si date1 < date2, 0 si égales, 1 si date1 > date2
 */
export const compareDates = (date1, date2) => {
  if (!date1 || !date2) return 0;

  try {
    const d1 = dayjs.utc(date1);
    const d2 = dayjs.utc(date2);

    if (d1.isBefore(d2)) return -1;
    if (d1.isAfter(d2)) return 1;
    return 0;
  } catch (error) {
    console.error('Erreur comparaison dates:', error);
    return 0;
  }
};

// Export dayjs configuré pour utilisation avancée
export { dayjs };
