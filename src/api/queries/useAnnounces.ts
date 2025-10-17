import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { Announce, CommentAnnounce } from '@/types/api.types';

export const useAnnounces = () => {
  return useQuery({
    queryKey: ['announces'],
    queryFn: async () => {
      const { data } = await apiClient.get<Announce[]>('/announce');
      return data;
    },
  });
};

export const useAllAnnounces = () => {
  return useQuery({
    queryKey: ['announces', 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get<Announce[]>('/announce/admin/all');
      return data;
    },
  });
};

export const useExpiredAnnounces = () => {
  return useQuery({
    queryKey: ['announces', 'expired'],
    queryFn: async () => {
      const { data } = await apiClient.get<Announce[]>('/announce/expired');
      return data;
    },
  });
};

export const useAnnounce = (id: string) => {
  return useQuery({
    queryKey: ['announces', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Announce>(`/announce/admin/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useAnnounceComments = (announceId: string) => {
  return useQuery({
    queryKey: ['announces', announceId, 'comments'],
    queryFn: async () => {
      const { data } = await apiClient.get<CommentAnnounce[]>(
        `/announce/${announceId}/comment`
      );
      return data;
    },
    enabled: !!announceId,
  });
};

export const useAnnounceParticipants = (announceId: string) => {
  return useQuery({
    queryKey: ['announces', announceId, 'participants'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/announce/${announceId}/participate/all`);
      return data;
    },
    enabled: !!announceId,
  });
};
