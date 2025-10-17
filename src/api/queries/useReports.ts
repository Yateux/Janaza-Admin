import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { ReportAnnounce } from '@/types/api.types';

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data } = await apiClient.get<ReportAnnounce[]>('/announce/admin/reports');
      return data;
    },
  });
};

export const useReport = (reportId: string) => {
  return useQuery({
    queryKey: ['reports', reportId],
    queryFn: async () => {
      // Récupère tous les signalements et trouve celui qui correspond à l'ID
      const { data } = await apiClient.get<ReportAnnounce[]>('/announce/admin/reports');
      const report = data.find(r => r.id === reportId);
      if (!report) {
        throw new Error('Report not found');
      }
      return report;
    },
    enabled: !!reportId,
  });
};

export const useAnnounceReports = (announceId: string) => {
  return useQuery({
    queryKey: ['announces', announceId, 'reports'],
    queryFn: async () => {
      const { data } = await apiClient.get<ReportAnnounce[]>(
        `/announce/${announceId}/reports`
      );
      return data;
    },
    enabled: !!announceId,
  });
};
