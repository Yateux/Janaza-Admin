/**
 * Exemple de formulaire montrant comment créer/éditer une janaza
 * avec gestion du timezone Local → UTC pour l'API
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { createUtcFromLocal, utcToDateInput, utcToTimeInput } from '@/lib/utils';
import { CalendarDays, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Schéma de validation du formulaire
const janazaFormSchema = z.object({
  // Informations du défunt
  firstName: z.string().min(1, 'Prénom requis').max(50),
  lastName: z.string().min(1, 'Nom requis').max(50),
  gender: z.enum(['M', 'F'], { required_error: 'Genre requis' }),

  // Prière - date et heure LOCALES (seront converties en UTC)
  prayerDate: z.string().min(1, 'Date de la prière requise'),
  prayerTime: z.string().min(1, 'Heure de la prière requise'),
  prayerAddress: z.string().min(1, 'Adresse requise'),
  prayerCity: z.string().min(1, 'Ville requise'),

  // Enterrement optionnel
  hasFuneral: z.boolean().default(false),
  funeralDate: z.string().optional(),
  funeralTime: z.string().optional(),
  funeralAddress: z.string().optional(),
  funeralCity: z.string().optional(),
}).refine(
  (data) => {
    // Si hasFuneral est true, les champs sont requis
    if (data.hasFuneral) {
      return data.funeralDate && data.funeralTime;
    }
    return true;
  },
  {
    message: 'Date et heure d\'enterrement requises',
    path: ['funeralDate'],
  }
);

type JanazaFormValues = z.infer<typeof janazaFormSchema>;

interface JanazaFormExampleProps {
  // Pour l'édition, on peut passer une janaza existante
  janaza?: {
    id: string;
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';
    startDate: string; // UTC
    startTime: string; // UTC
    addressPray: string;
    cityPray: string;
    funeralDate?: string | null; // UTC
    funeralTime?: string | null; // UTC
    addressFuneral?: string | null;
    cityFuneral?: string | null;
  };
  onSubmit?: (payload: any) => Promise<void>;
}

export function JanazaFormExample({ janaza, onSubmit }: JanazaFormExampleProps) {
  const isEditMode = !!janaza;
  const [isLoading, setIsLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(true);

  const form = useForm<JanazaFormValues>({
    resolver: zodResolver(janazaFormSchema),
    defaultValues: isEditMode
      ? {
          // Données du défunt
          firstName: janaza.firstName,
          lastName: janaza.lastName,
          gender: janaza.gender,

          // Prière - CONVERSION UTC → LOCAL pour affichage dans le formulaire
          prayerDate: utcToDateInput(janaza.startDate),
          prayerTime: utcToTimeInput(janaza.startTime),
          prayerAddress: janaza.addressPray,
          prayerCity: janaza.cityPray,

          // Enterrement - CONVERSION UTC → LOCAL si présent
          hasFuneral: !!(janaza.funeralDate && janaza.funeralTime),
          funeralDate: janaza.funeralDate ? utcToDateInput(janaza.funeralDate) : undefined,
          funeralTime: janaza.funeralTime ? utcToTimeInput(janaza.funeralTime) : undefined,
          funeralAddress: janaza.addressFuneral || undefined,
          funeralCity: janaza.cityFuneral || undefined,
        }
      : {
          // Valeurs par défaut pour création
          gender: 'M',
          hasFuneral: false,
        },
  });

  const hasFuneral = form.watch('hasFuneral');

  const handleFormSubmit = async (data: JanazaFormValues) => {
    setIsLoading(true);

    try {
      // CONVERSION LOCAL → UTC pour l'API
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,

        // Prière: Convertir date + heure locale → UTC ISO
        startDate: createUtcFromLocal(data.prayerDate, data.prayerTime),
        startTime: createUtcFromLocal(data.prayerDate, data.prayerTime),
        addressPray: data.prayerAddress,
        cityPray: data.prayerCity,
        postCodePray: '75000', // Exemple
        countryPray: 'France',

        // Enterrement: Convertir seulement si présent
        ...(data.hasFuneral && data.funeralDate && data.funeralTime
          ? {
              funeralDate: createUtcFromLocal(data.funeralDate, data.funeralTime),
              funeralTime: createUtcFromLocal(data.funeralDate, data.funeralTime),
              addressFuneral: data.funeralAddress || null,
              cityFuneral: data.funeralCity || null,
              postCodeFuneral: '75000', // Exemple
              countryFuneral: 'France',
            }
          : {
              funeralDate: null,
              funeralTime: null,
              addressFuneral: null,
              cityFuneral: null,
              postCodeFuneral: null,
              countryFuneral: null,
            }),
      };

      console.log('📤 Payload envoyé à l\'API (dates converties en UTC):', payload);

      // Appeler la fonction de soumission
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // Simulation
        console.log('✅ Formulaire validé avec succès');
        alert('Formulaire validé ! Voir la console pour le payload.');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la soumission:', error);
      alert('Erreur lors de la soumission');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerte d'information */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 text-sm">
          Les dates et heures sont saisies dans <strong>votre timezone local</strong> et seront
          automatiquement converties en <strong>UTC</strong> avant l'envoi à l'API.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Informations du défunt */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du défunt</CardTitle>
              <CardDescription>Identité de la personne décédée</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Ahmed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Benali" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">Homme</SelectItem>
                        <SelectItem value="F">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Prière mortuaire */}
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50/50">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <CalendarDays className="h-5 w-5" />
                Prière mortuaire (Salat al-Janazah)
              </CardTitle>
              <CardDescription>Date, heure et lieu de la prière</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="prayerDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Timezone local détecté
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prayerTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Heure
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Format 24h (ex: 14:30)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="prayerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Rue de la Mosquée" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prayerCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Enterrement (optionnel) */}
          <Card className="border-purple-200">
            <CardHeader className="bg-purple-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <CalendarDays className="h-5 w-5" />
                    Enterrement (optionnel)
                  </CardTitle>
                  <CardDescription>Informations sur l'enterrement si connu</CardDescription>
                </div>
                <FormField
                  control={form.control}
                  name="hasFuneral"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>
            {hasFuneral && (
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="funeralDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          Date
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="funeralTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Heure
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="funeralAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Cimetière..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="funeralCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Paris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            )}
          </Card>

          {/* Debug */}
          {showDebug && (
            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">🐛 Debug - Valeurs du formulaire</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDebug(false)}
                  >
                    Masquer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono bg-white p-3 rounded border overflow-auto max-h-40">
                  {JSON.stringify(form.watch(), null, 2)}
                </pre>
                <p className="text-xs text-orange-700 mt-2">
                  💡 Ces valeurs sont en <strong>timezone local</strong>. Elles seront converties
                  en UTC lors de la soumission.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Réinitialiser
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Envoi en cours...'
                : isEditMode
                ? 'Mettre à jour'
                : 'Créer la janaza'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

/**
 * NOTES D'UTILISATION:
 *
 * 1. Les inputs type="date" et type="time" fonctionnent en timezone LOCAL du navigateur
 *
 * 2. Lors de l'édition, convertir UTC → LOCAL pour pré-remplir le formulaire:
 *    - utcToDateInput(janaza.startDate) → "2025-10-05"
 *    - utcToTimeInput(janaza.startTime) → "20:00"
 *
 * 3. Lors de la soumission, convertir LOCAL → UTC pour l'API:
 *    - createUtcFromLocal(data.prayerDate, data.prayerTime)
 *    - Résultat: "2025-10-05T18:00:00.000Z"
 *
 * 4. Exemple de flux complet:
 *    a) API envoie: "2025-10-05T18:00:00.000Z" (UTC)
 *    b) Formulaire affiche: "2025-10-05" et "20:00" (Local, UTC+2)
 *    c) Utilisateur modifie: "2025-10-06" et "15:00" (Local)
 *    d) Soumission convertit: "2025-10-06T13:00:00.000Z" (UTC)
 *
 * 5. Toujours vérifier hasFuneral avant d'envoyer les données d'enterrement
 */
