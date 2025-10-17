import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { toast } from 'sonner';
import { DeleteWithReasonDto } from '@/types/api.types';

export interface CreateAnnounceDto {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dateOfBirth?: string;
  remarks?: string;
  addressPray: string;
  postCodePray: number;
  cityPray: string;
  countryPray: string;
  latitudePray?: number;
  longitudePray?: number;
  startDate: string;
  startTime: string;
  addressFuneral?: string;
  postCodeFuneral?: number;
  cityFuneral?: string;
  countryFuneral?: string;
  latitudeFuneral?: number;
  longitudeFuneral?: number;
  funeralDate?: string;
  funeralTime?: string;
  active?: boolean;
  hasForum?: boolean;
}

export interface UpdateAnnounceDto {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dateOfBirth?: string;
  remarks?: string;
  active?: boolean;
  hasForum?: boolean;
}

export const useCreateAnnounce = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAnnounceDto) => {
      const response = await apiClient.post('/announce', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announces'] });
      toast.success('Annonce créée avec succès');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });
};

export const useExpireAnnounce = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/announce/${id}/expire`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announces'] });
      toast.success('Annonce marquée comme expirée');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'expiration');
    },
  });
};

export const useDeleteAnnounce = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reasonId }: { id: string } & DeleteWithReasonDto) => {
      await apiClient.delete(`/announce/${id}/admin-delete`, {
        data: { reasonId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announces'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Annonce supprimée avec succès');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });
};

export const useUpdateAnnounce = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAnnounceDto }) => {
      const response = await apiClient.patch(`/announce/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['announces'] });
      queryClient.invalidateQueries({ queryKey: ['announces', variables.id] });
      toast.success('Annonce modifiée avec succès');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      announceId,
      commentId,
      reasonId,
    }: {
      announceId: string;
      commentId: string;
    } & DeleteWithReasonDto) => {
      await apiClient.delete(`/announce/${announceId}/comment/${commentId}`, {
        data: { reasonId },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['announces', variables.announceId, 'comments'],
      });
      toast.success('Commentaire supprimé avec succès');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });
};
