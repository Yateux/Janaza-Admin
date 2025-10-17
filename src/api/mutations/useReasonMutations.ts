import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { toast } from 'sonner';
import { CreateReasonDto, UpdateReasonDto, Reason } from '@/types/api.types';

export const useCreateReason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReasonDto) => {
      const response = await apiClient.post<Reason>('/reasons', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reasons'] });
      toast.success('Raison créée avec succès');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });
};

export const useUpdateReason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateReasonDto }) => {
      const response = await apiClient.patch<Reason>(`/reasons/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reasons'] });
      queryClient.invalidateQueries({ queryKey: ['reasons', variables.id] });
      toast.success('Raison mise à jour avec succès');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
};

export const useDeleteReason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/reasons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reasons'] });
      toast.success('Raison supprimée avec succès');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });
};
