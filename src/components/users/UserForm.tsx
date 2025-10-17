import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Role } from '@/types/api.types';
import { createUserSchema, userSchema, CreateUserFormValues, UserFormValues } from '@/lib/validations';
import { useCreateUser, useUpdateUser } from '@/api/mutations/useUserMutations';
import { useEffect } from 'react';
import dayjs from '@/lib/dayjs';

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const isEditMode = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const form = useForm<CreateUserFormValues | UserFormValues>({
    resolver: zodResolver(isEditMode ? userSchema : createUserSchema),
    defaultValues: isEditMode
      ? {
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          gender: user.gender,
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
          roles: user.roles,
        }
      : {
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          gender: 'M' as const,
          dateOfBirth: undefined,
          roles: Role.User,
        },
  });

  useEffect(() => {
    if (isEditMode && user) {
      form.reset({
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        gender: user.gender,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
        roles: user.roles,
      });
    }
  }, [user, isEditMode, form]);

  const onSubmit = async (data: CreateUserFormValues | UserFormValues) => {
    try {
      if (isEditMode && user) {
        await updateUser.mutateAsync({
          id: user.id,
          data: data as UserFormValues,
        });
      } else {
        await createUser.mutateAsync(data as CreateUserFormValues);
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="exemple@email.com"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditMode ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={isEditMode ? 'Laisser vide pour ne pas modifier' : 'Mot de passe'}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Prénom"
                    {...field}
                    value={field.value || ''}
                  />
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
                  <Input
                    placeholder="Nom"
                    {...field}
                    value={field.value || ''}
                  />
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

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de naissance</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={
                    field.value instanceof Date
                      ? dayjs(field.value).format('YYYY-MM-DD')
                      : ''
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      field.onChange(dayjs(e.target.value).toDate());
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={Role.User}>Utilisateur</SelectItem>
                  <SelectItem value={Role.Admin}>Administrateur</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="submit"
            disabled={createUser.isPending || updateUser.isPending}
          >
            {isEditMode ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
