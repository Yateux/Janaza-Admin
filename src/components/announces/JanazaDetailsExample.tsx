/**
 * Exemple de composant montrant comment afficher correctement les dates d'une janaza
 * avec gestion du timezone UTC → Local
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatUtcDate, formatUtcTime, formatUtcDateTime } from '@/lib/utils';

interface JanazaDetailsExampleProps {
  janaza: {
    id: string;
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';

    // Données de la prière (obligatoires)
    startDate: string; // UTC ISO: "2025-10-05T18:00:00.000Z"
    startTime: string; // UTC ISO: "2025-10-05T18:00:00.000Z"
    addressPray: string;
    cityPray: string;

    // Données de l'enterrement (optionnels)
    funeralDate?: string | null;
    funeralTime?: string | null;
    addressFuneral?: string | null;
    cityFuneral?: string | null;
  };
}

export function JanazaDetailsExample({ janaza }: JanazaDetailsExampleProps) {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {janaza.firstName} {janaza.lastName}
          </CardTitle>
          <Badge variant="secondary" className="w-fit">
            {janaza.gender === 'M' ? 'Homme' : 'Femme'}
          </Badge>
        </CardHeader>
      </Card>

      {/* Informations de la prière */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
            <Calendar className="h-5 w-5" />
            Prière Mortuaire (Salat al-Janazah)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date et heure - MÉTHODE 1: Séparé */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-blue-700 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Date
              </div>
              <div className="text-lg font-semibold text-blue-900">
                {formatUtcDate(janaza.startDate, 'DD MMMM YYYY')}
              </div>
              <div className="text-xs text-slate-500">
                {formatUtcDate(janaza.startDate, 'dddd')}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-blue-700 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Heure
              </div>
              <div className="text-lg font-semibold text-blue-900">
                {formatUtcTime(janaza.startTime)}
              </div>
            </div>
          </div>

          {/* Date et heure - MÉTHODE 2: Combiné */}
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Date et heure complète</div>
            <div className="font-semibold text-blue-900">
              {formatUtcDateTime(janaza.startDate, janaza.startTime)}
            </div>
          </div>

          {/* Lieu */}
          <div className="space-y-1">
            <div className="text-sm font-medium text-blue-700 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Lieu
            </div>
            <div className="text-base text-blue-900">
              {janaza.addressPray}
            </div>
            <div className="text-sm text-slate-600">
              {janaza.cityPray}
            </div>
          </div>

          {/* Debug: Afficher la date UTC brute */}
          <div className="mt-4 p-3 bg-slate-100 rounded-lg border border-slate-200">
            <div className="text-xs font-mono text-slate-600">
              <div className="font-semibold mb-1">Debug - Dates UTC (reçues de l'API):</div>
              <div>startDate: {janaza.startDate}</div>
              <div>startTime: {janaza.startTime}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations de l'enterrement (si présentes) */}
      {janaza.funeralDate && janaza.funeralTime && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-purple-900">
              <Calendar className="h-5 w-5" />
              Enterrement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date et heure */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-purple-700 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
                <div className="text-lg font-semibold text-purple-900">
                  {formatUtcDate(janaza.funeralDate, 'DD MMMM YYYY')}
                </div>
                <div className="text-xs text-slate-500">
                  {formatUtcDate(janaza.funeralDate, 'dddd')}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-purple-700 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Heure
                </div>
                <div className="text-lg font-semibold text-purple-900">
                  {formatUtcTime(janaza.funeralTime)}
                </div>
              </div>
            </div>

            {/* Lieu si présent */}
            {janaza.addressFuneral && (
              <div className="space-y-1">
                <div className="text-sm font-medium text-purple-700 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Lieu
                </div>
                <div className="text-base text-purple-900">
                  {janaza.addressFuneral}
                </div>
                {janaza.cityFuneral && (
                  <div className="text-sm text-slate-600">
                    {janaza.cityFuneral}
                  </div>
                )}
              </div>
            )}

            {/* Debug: Afficher les dates UTC brutes */}
            <div className="mt-4 p-3 bg-slate-100 rounded-lg border border-slate-200">
              <div className="text-xs font-mono text-slate-600">
                <div className="font-semibold mb-1">Debug - Dates UTC (reçues de l'API):</div>
                <div>funeralDate: {janaza.funeralDate}</div>
                <div>funeralTime: {janaza.funeralTime}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exemple de message si pas d'enterrement */}
      {(!janaza.funeralDate || !janaza.funeralTime) && (
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 italic">
              Informations d'enterrement non renseignées
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * NOTES D'UTILISATION:
 *
 * 1. Les dates reçues de l'API sont TOUJOURS en UTC (format ISO)
 *    Exemple: "2025-10-05T18:00:00.000Z"
 *
 * 2. Utiliser formatUtcDate() et formatUtcTime() pour l'affichage
 *    Ces fonctions convertissent automatiquement UTC → timezone local
 *
 * 3. Si l'utilisateur est en France (Europe/Paris, UTC+2 en été):
 *    - API envoie: "2025-10-05T18:00:00.000Z" (18:00 UTC)
 *    - Affichage: "20:00" (18:00 + 2h offset)
 *
 * 4. Les dates d'enterrement sont optionnelles, toujours vérifier:
 *    if (janaza.funeralDate && janaza.funeralTime) { ... }
 *
 * 5. Pour le debug, afficher les dates UTC brutes aide à comprendre
 *    la conversion effectuée
 */
