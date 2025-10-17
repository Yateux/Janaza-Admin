import dayjs from 'dayjs';

/**
 * SYSTÈME DE GESTION DES DATES BACKEND
 *
 * Le backend retourne 2 types de dates avec des comportements différents :
 *
 * 1. Dates de janaza (startDate, startTime, funeralDate, funeralTime)
 *    - Format API : "2025-10-08T18:00:00.000Z"
 *    - BDD stocke en UTC : "2025-10-08 20:00:00" (+2h été)
 *    - API reconvertit en France avant envoi : "18:00"
 *    → Afficher tel quel SANS conversion (18:00 → 18:00)
 *
 * 2. Dates système (createdAt, updatedAt, deletedAt, etc.)
 *    - Format API : "2025-10-05T16:30:43.874Z"
 *    - BDD stocke en France : "2025-10-05 18:30:43.874066"
 *    - API convertit en UTC avant envoi : -2h
 *    → Convertir UTC → Europe/Paris (16:30 → 18:30)
 *
 * Solution : Détection automatique basée sur les millisecondes
 *   - Avec ".000Z" = Janaza (afficher tel quel)
 *   - Avec millisecondes précises = Système (convertir UTC → Paris)
 */

/**
 * Formater une date avec détection automatique du type
 * @param {string|Date} dateString - Date de l'API
 * @param {string} format - Format dayjs souhaité
 * @returns {string} Date formatée
 */
const formatApiDate = (dateString, format) => {
  if (!dateString) return '-';

  try {
    const dateStr = String(dateString);

    // Dates de janaza : finissent par ".000Z" (millisecondes à zéro)
    // → Afficher tel quel SANS conversion
    if (dateStr.endsWith('.000Z')) {
      return dayjs.utc(dateString).format(format);
    }

    // Dates système : millisecondes précises (ex: ".874Z")
    // → Convertir UTC → Europe/Paris
    if (dateStr.endsWith('Z')) {
      return dayjs.utc(dateString).tz('Europe/Paris').format(format);
    }

    // Dates sans Z : afficher tel quel
    return dayjs(dateString).format(format);
  } catch (error) {
    console.error('Erreur formatage date:', error);
    return 'Date invalide';
  }
};

/**
 * Formater une date SANS conversion
 * @param {string|Date} date - Date ISO de l'API
 * @param {string} format - Format d'affichage dayjs (ex: 'DD/MM/YYYY')
 * @returns {string} Date formatée (ex: "20/01/2025")
 */
export const formatDisplayDate = (date, format = 'DD/MM/YYYY') => {
  return formatApiDate(date, format);
};

/**
 * Formater une heure SANS conversion
 * @param {string|Date} time - Heure ISO de l'API
 * @returns {string} Heure formatée (ex: "18:00")
 */
export const formatDisplayTime = (time) => {
  return formatApiDate(time, 'HH:mm');
};

/**
 * Formater date et heure SANS conversion
 * @param {string|Date} datetime - Date/heure ISO
 * @param {string} format - Format (défaut: 'DD/MM/YYYY à HH:mm')
 * @returns {string} Date/heure formatée (ex: "20/01/2025 à 18:00")
 */
export const formatDisplayDateTime = (datetime, format = 'DD/MM/YYYY à HH:mm') => {
  return formatApiDate(datetime, format);
};

/**
 * Convertir pour input[type="date"] SANS conversion
 * @param {string|Date} date - Date ISO
 * @returns {string} Format YYYY-MM-DD (ex: "2025-01-20")
 */
export const toDateInput = (date) => {
  return formatApiDate(date, 'YYYY-MM-DD') || '';
};

/**
 * Convertir pour input[type="time"] SANS conversion
 * @param {string|Date} time - Heure ISO
 * @returns {string} Format HH:mm (ex: "18:00")
 */
export const toTimeInput = (time) => {
  return formatApiDate(time, 'HH:mm') || '';
};

/**
 * Créer une date ISO depuis les inputs SANS conversion (pour dates de janaza)
 * L'heure saisie est directement mise dans le format ISO avec Z
 * @param {string} date - Date du formulaire (YYYY-MM-DD)
 * @param {string} time - Heure du formulaire (HH:mm)
 * @returns {string} Date ISO (format: "YYYY-MM-DDTHH:mm:ss.000Z")
 */
export const createIsoFromInputs = (date, time) => {
  if (!date || !time) {
    throw new Error('Date et heure sont requises');
  }

  try {
    // Créer directement en UTC sans conversion
    // L'heure saisie devient l'heure affichée
    const isoString = `${date}T${time}:00.000Z`;
    return isoString;
  } catch (error) {
    console.error('Erreur création ISO:', error);
    throw error;
  }
};

/**
 * Formater une date relative (ex: "il y a 2 heures")
 * @param {string|Date} date - Date ISO
 * @returns {string} Date relative
 */
export const formatRelativeDate = (date) => {
  if (!date) return '-';

  try {
    return dayjs(date).fromNow();
  } catch (error) {
    console.error('Erreur formatage date relative:', error);
    return 'Date invalide';
  }
};
