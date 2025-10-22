import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { toast } from 'sonner';
import { SendNotificationToUserDto, SendNotificationToAllDto } from '@/types/api.types';

export const useSendNotificationToUser = () => {
  return useMutation({
    mutationFn: async (data: SendNotificationToUserDto) => {
      await apiClient.post('/push-notifications/admin/send-to-user', data);
    },
    onSuccess: () => {
      toast.success('Notification envoyée avec succès');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi');
    },
  });
};

export const useSendNotificationToAll = () => {
  return useMutation({
    mutationFn: async (data: SendNotificationToAllDto) => {
      await apiClient.post('/push-notifications/admin/send-to-all', data);
    },
    onSuccess: () => {
      toast.success('Notification diffusée à tous les utilisateurs');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la diffusion');
    },
  });
};

export const useDeletePushToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deviceId,
    }: {
      deviceId: string;
    }) => {
      await apiClient.delete(`/push-notifications/token/${deviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pushTokens'] });
      toast.success('Token supprimé avec succès');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });
};
