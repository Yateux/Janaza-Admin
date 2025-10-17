import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Reason, ReasonType, ReasonCategory } from '@/types/api.types';
import { reasonSchema, ReasonFormValues } from '@/lib/validations';
import { useCreateReason, useUpdateReason } from '@/api/mutations/useReasonMutations';
import { useEffect } from 'react';

interface ReasonFormProps {
  reason?: Reason;
  onSuccess?: () => void;
}

const reasonTypeOptions = [
  { value: ReasonType.ANNOUNCE, label: 'Annonce' },
  { value: ReasonType.COMMENT, label: 'Commentaire' },
  { value: ReasonType.USER, label: 'Utilisateur' },
];

const reasonCategoryOptions = [
  { value: ReasonCategory.USER_REQUEST, label: 'Demande utilisateur' },
  { value: ReasonCategory.ACCOUNT_DELETION, label: 'Suppression compte' },
  { value: ReasonCategory.EXPIRED, label: 'Expiré' },
  { value: ReasonCategory.COMPLETED, label: 'Complété' },
  { value: ReasonCategory.INAPPROPRIATE, label: 'Inapproprié' },
  { value: ReasonCategory.SPAM, label: 'Spam' },
  { value: ReasonCategory.OFFENSIVE, label: 'Offensant' },
  { value: ReasonCategory.OTHER, label: 'Autre' },
];

export function ReasonForm({ reason, onSuccess }: ReasonFormProps) {
  const isEditMode = !!reason;
  const createReason = useCreateReason();
  const updateReason = useUpdateReason();

  const form = useForm<ReasonFormValues>({
    resolver: zodResolver(reasonSchema),
    defaultValues: isEditMode
      ? {
          code: reason.code,
          label: reason.label,
          description: reason.description || '',
          type: reason.type,
          category: reason.category,
          active: reason.active,
          displayOrder: reason.displayOrder,
        }
      : {
          code: '',
          label: '',
          description: '',
          type: ReasonType.USER,
          category: ReasonCategory.OTHER,
          active: true,
          displayOrder: 0,
        },
  });

  useEffect(() => {
    if (isEditMode && reason) {
      form.reset({
        code: reason.code,
        label: reason.label,
        description: reason.description || '',
        type: reason.type,
        category: reason.category,
        active: reason.active,
        displayOrder: reason.displayOrder,
      });
    }
  }, [reason, isEditMode, form]);

  const onSubmit = async (data: ReasonFormValues) => {
    try {
      if (isEditMode && reason) {
        await updateReason.mutateAsync({
          id: reason.id,
          data,
        });
      } else {
        await createReason.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: USER_INACTIVE"
                  {...field}
                  className="font-mono"
                />
              </FormControl>
              <FormDescription>
                Code unique pour identifier la raison (utilisé en interne)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Libellé</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: Compte inactif"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Libellé affiché à l'utilisateur
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optionnelle)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description détaillée de la raison..."
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {reasonTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Type d'entité concernée
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {reasonCategoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Catégorie de la raison
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="displayOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordre d'affichage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Ordre de tri dans les listes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between">
                <FormLabel>Statut</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="active-switch"
                    />
                    <label
                      htmlFor="active-switch"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {field.value ? 'Active' : 'Inactive'}
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="submit"
            disabled={createReason.isPending || updateReason.isPending}
          >
            {isEditMode ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
