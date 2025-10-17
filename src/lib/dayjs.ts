import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/fr';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Set default locale to French
dayjs.locale('fr');

/**
 * Get user's timezone from browser settings
 * @returns Timezone string (e.g., "Europe/Paris")
 */
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'Europe/Paris'; // Default fallback for France
  }
};

// NE PAS définir de timezone par défaut !
// Cela causerait une double conversion (UTC → Local → Local)
// dayjs.tz.setDefault(getUserTimezone()); ← RETIRÉ

export default dayjs;
