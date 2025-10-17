import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUsers } from '@/api/queries/useUsers';
import { useSendNotificationToUser, useSendNotificationToAll } from '@/api/mutations/useNotificationMutations';
import { NotificationType } from '@/types/api.types';
import { getFullName } from '@/lib/utils';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

const MAX_TITLE_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 500;

const notificationSchema = z.object({
  userId: z.string().optional(),
  title: z.string().min(1, 'Le titre est requis').max(MAX_TITLE_LENGTH, `Le titre ne peut pas dépasser ${MAX_TITLE_LENGTH} caractères`),
  message: z.string().min(1, 'Le message est requis').max(MAX_MESSAGE_LENGTH, `Le message ne peut pas dépasser ${MAX_MESSAGE_LENGTH} caractères`),
  type: z.nativeEnum(NotificationType),
  data: z.string().optional(),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

interface SendNotificationFormProps {
  mode: 'user' | 'all';
  onSuccess?: () => void;
  devicesCount?: number;
}

export function SendNotificationForm({ mode, onSuccess, devicesCount = 0 }: SendNotificationFormProps) {
  const { data: users, isLoading: usersLoading } = useUsers();
  const sendToUser = useSendNotificationToUser();
  const sendToAll = useSendNotificationToAll();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<NotificationFormValues | null>(null);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      userId: '',
      title: '',
      message: '',
      type: NotificationType.ADMIN_MESSAGE,
      data: '',
    },
  });

  const titleLength = form.watch('title')?.length || 0;
  const messageLength = form.watch('message')?.length || 0;
  const dataValue = form.watch('data');

  // Validate JSON data
  const [jsonError, setJsonError] = useState<string>('');

  useEffect(() => {
    if (dataValue && dataValue.trim()) {
      try {
        JSON.parse(dataValue);
        setJsonError('');
      } catch (e) {
        setJsonError('JSON invalide');
      }
    } else {
      setJsonError('');
    }
  }, [dataValue]);

  const handleFormSubmit = (values: NotificationFormValues) => {
    if (mode === 'all') {
      setPendingData(values);
      setShowConfirmDialog(true);
    } else {
      onSubmit(values);
    }
  };

  const onSubmit = async (values: NotificationFormValues) => {
    try {
      // Parse data if provided
      let parsedData: Record<string, unknown> | undefined;
      if (values.data && values.data.trim()) {
        try {
          parsedData = JSON.parse(values.data);
        } catch (e) {
          form.setError('data', { message: 'JSON invalide' });
          return;
        }
      }

      if (mode === 'user') {
        if (!values.userId) {
          form.setError('userId', { message: 'Veuillez sélectionner un utilisateur' });
          return;
        }

        await sendToUser.mutateAsync({
          userId: values.userId,
          title: values.title,
          message: values.message,
          type: values.type,
          data: parsedData,
        });
      } else {
        await sendToAll.mutateAsync({
          title: values.title,
          message: values.message,
          type: values.type,
          data: parsedData,
        });
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleConfirmSendToAll = () => {
    if (pendingData) {
      onSubmit(pendingData);
      setShowConfirmDialog(false);
      setPendingData(null);
    }
  };

  const isLoading = sendToUser.isPending || sendToAll.isPending;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          {mode === 'user' && (
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Utilisateur</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={usersLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un utilisateur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {getFullName(user.firstName, user.lastName)} - {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choisir l'utilisateur qui recevra la notification
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Titre de la notification"
                    {...field}
                    maxLength={MAX_TITLE_LENGTH}
                  />
                </FormControl>
                <FormDescription>
                  {titleLength}/{MAX_TITLE_LENGTH} caractères
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contenu de la notification"
                    className="min-h-[100px]"
                    {...field}
                    maxLength={MAX_MESSAGE_LENGTH}
                  />
                </FormControl>
                <FormDescription>
                  {messageLength}/{MAX_MESSAGE_LENGTH} caractères
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de notification</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NotificationType.ADMIN_MESSAGE}>Message Admin</SelectItem>
                    <SelectItem value={NotificationType.ADMIN_BROADCAST}>Diffusion Admin</SelectItem>
                    <SelectItem value={NotificationType.SYSTEM_ANNOUNCEMENT}>Annonce Système</SelectItem>
                    <SelectItem value={NotificationType.SECURITY_ALERT}>Alerte Sécurité</SelectItem>
                    <SelectItem value={NotificationType.ACCOUNT_UPDATE}>Mise à jour Compte</SelectItem>
                    <SelectItem value={NotificationType.MAINTENANCE}>Maintenance</SelectItem>
                    <SelectItem value={NotificationType.SERVICE_UPDATE}>Mise à jour Service</SelectItem>
                    <SelectItem value={NotificationType.CUSTOM}>Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Type de notification à envoyer
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Données (JSON) - Optionnel</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='{"key": "value"}'
                    className="font-mono text-sm min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Données supplémentaires au format JSON (optionnel)
                </FormDescription>
                {jsonError && (
                  <p className="text-sm font-medium text-destructive">{jsonError}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading || !!jsonError} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'user' ? 'Envoyer la notification' : 'Diffuser à tous'}
          </Button>
        </form>
      </Form>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la diffusion</AlertDialogTitle>
            <AlertDialogDescription>
              Vous allez envoyer cette notification à tous les utilisateurs ({devicesCount} appareils).
              Cette action ne peut pas être annulée. Voulez-vous continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSendToAll}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
