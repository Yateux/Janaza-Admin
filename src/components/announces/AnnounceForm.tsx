import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { AddressAutocomplete, AddressDetails } from '@/components/ui/address-autocomplete';
import { toDateInput } from '@/lib/utils';
import { Announce } from '@/types/api.types';

const announceFormSchema = z.object({
  // Informations défunt
  firstName: z.string().min(1, 'Prénom requis').max(50),
  lastName: z.string().min(1, 'Nom requis').max(50),
  gender: z.enum(['M', 'F'], { required_error: 'Genre requis' }),
  dateOfBirth: z.string().optional(),
  remarks: z.string().optional(),

  // Localisation prière (obligatoire)
  addressPray: z.string().min(1, 'Adresse requise'),
  postCodePray: z.string().min(1, 'Code postal requis'),
  cityPray: z.string().min(1, 'Ville requise'),
  countryPray: z.string().min(1, 'Pays requis').default('France'),
  latitudePray: z.string().optional(),
  longitudePray: z.string().optional(),
  startDate: z.string().min(1, 'Date requise'),
  startTime: z.string().min(1, 'Heure requise'),

  // Localisation enterrement (optionnel)
  hasFuneralLocation: z.boolean().default(false),
  addressFuneral: z.string().optional(),
  postCodeFuneral: z.string().optional(),
  cityFuneral: z.string().optional(),
  countryFuneral: z.string().optional(),
  latitudeFuneral: z.string().optional(),
  longitudeFuneral: z.string().optional(),
  funeralDate: z.string().optional(),
  funeralTime: z.string().optional(),

  // Options
  active: z.boolean().default(true),
  hasForum: z.boolean().default(true),
});

// Schema simplifié pour la modification d'une annonce
const updateAnnounceFormSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis').max(50),
  lastName: z.string().min(1, 'Nom requis').max(50),
  gender: z.enum(['M', 'F'], { required_error: 'Genre requis' }),
  dateOfBirth: z.string().optional(),
  remarks: z.string().optional(),
  active: z.boolean().default(true),
  hasForum: z.boolean().default(true),
});

export type AnnounceFormValues = z.infer<typeof announceFormSchema>;
export type UpdateAnnounceFormValues = z.infer<typeof updateAnnounceFormSchema>;

interface AnnounceFormProps {
  announce?: Partial<AnnounceFormValues & { id: string; active: boolean; hasForum: boolean }> | Announce; // Announce à éditer (optionnel)
  onSubmit: (data: AnnounceFormValues | UpdateAnnounceFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function AnnounceForm({ announce, onSubmit, isLoading }: AnnounceFormProps) {
  const isEditMode = !!announce;
  const schema = isEditMode ? updateAnnounceFormSchema : announceFormSchema;

  const form = useForm<AnnounceFormValues | UpdateAnnounceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: announce ? {
      firstName: announce.firstName || '',
      lastName: announce.lastName || '',
      gender: announce.gender || 'M',
      dateOfBirth: toDateInput(announce.dateOfBirth || null),
      remarks: announce.remarks || '',
      active: announce.active ?? true,
      hasForum: announce.hasForum ?? true,
    } : {
      gender: 'M',
      countryPray: 'France',
      active: true,
      hasForum: true,
      hasFuneralLocation: false,
    },
  });

  const hasFuneralLocation = !isEditMode && form.watch('hasFuneralLocation' as keyof (AnnounceFormValues | UpdateAnnounceFormValues));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations Défunt */}
        <Card>
          <CardHeader>
            <CardTitle>Informations sur le Défunt</CardTitle>
            <CardDescription>
              {isEditMode
                ? 'Modifiez uniquement les informations de base (nom, prénom, genre, date de naissance, remarques et statut actif)'
                : 'Informations de base sur la personne décédée'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Mohammed" {...field} />
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
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ben Ali" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
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

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>Optionnel</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarques</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations complémentaires..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Informations supplémentaires (optionnel)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Options - Visible en mode édition */}
        {isEditMode && (
          <Card>
            <CardHeader>
              <CardTitle>Options de l'Annonce</CardTitle>
              <CardDescription>Paramètres de visibilité et fonctionnalités</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Annonce active</FormLabel>
                      <FormDescription>
                        L'annonce sera visible par les utilisateurs
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasForum"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Activer les commentaires</FormLabel>
                      <FormDescription>
                        Permettre aux utilisateurs de laisser des condoléances
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Localisation Prière - Caché en mode édition */}
        {!isEditMode && (
          <Card>
          <CardHeader>
            <CardTitle>Localisation de la Prière Mortuaire</CardTitle>
            <CardDescription>Lieu et horaires de la prière funéraire</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="addressPray"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse *</FormLabel>
                  <FormControl>
                    <AddressAutocomplete
                      placeholder="Rechercher une adresse"
                      value={field.value}
                      onSelect={(details: AddressDetails) => {
                        form.setValue('addressPray', details.address_format);
                        form.setValue('postCodePray', details.post_code);
                        form.setValue('cityPray', details.city);
                        form.setValue('countryPray', details.country);
                        form.setValue('latitudePray', details.latitude.toString());
                        form.setValue('longitudePray', details.longitude.toString());
                      }}
                    />
                  </FormControl>
                  <FormDescription>Commencez à taper pour rechercher une adresse</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de la Prière *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de la Prière *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        )}

        {/* Localisation Enterrement (Optionnel) - Caché en mode édition */}
        {!isEditMode && (
          <Card>
          <CardHeader>
            <CardTitle>Localisation de l'Enterrement</CardTitle>
            <CardDescription>Optionnel - Lieu et horaires de l'inhumation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="hasFuneralLocation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Ajouter un lieu d'enterrement</FormLabel>
                    <FormDescription>
                      Activer pour spécifier un lieu d'inhumation différent
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {hasFuneralLocation && (
              <>
                <FormField
                  control={form.control}
                  name="addressFuneral"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <AddressAutocomplete
                          placeholder="Rechercher une adresse d'enterrement"
                          value={field.value || ''}
                          onSelect={(details: AddressDetails) => {
                            form.setValue('addressFuneral', details.address_format);
                            form.setValue('postCodeFuneral', details.post_code);
                            form.setValue('cityFuneral', details.city);
                            form.setValue('countryFuneral', details.country);
                            form.setValue('latitudeFuneral', details.latitude.toString());
                            form.setValue('longitudeFuneral', details.longitude.toString());
                          }}
                        />
                      </FormControl>
                      <FormDescription>Commencez à taper pour rechercher une adresse</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="funeralDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de l'Enterrement</FormLabel>
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
                        <FormLabel>Heure de l'Enterrement</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
        )}

        {/* Options - Caché en mode édition (déjà affiché au-dessus) */}
        {!isEditMode && (
          <Card>
          <CardHeader>
            <CardTitle>Options de Publication</CardTitle>
            <CardDescription>Paramètres de visibilité et fonctionnalités</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Annonce active</FormLabel>
                    <FormDescription>
                      L'annonce sera visible immédiatement après création
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasForum"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Activer les commentaires</FormLabel>
                    <FormDescription>
                      Permettre aux utilisateurs de laisser des condoléances
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? (announce ? 'Modification...' : 'Création...')
              : (announce ? 'Modifier l\'Annonce' : 'Créer l\'Annonce')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
