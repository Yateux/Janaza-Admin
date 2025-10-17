import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { toast } from 'sonner';
import { ResolveReportDto } from '@/types/api.types';

export const useResolveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, data }: { reportId: string; data: ResolveReportDto }) => {
      await apiClient.patch(`/announce/reports/${reportId}/resolve`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Signalement résolu avec succès');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la résolution');
    },
  });
};
