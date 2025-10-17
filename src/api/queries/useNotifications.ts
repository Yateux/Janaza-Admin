import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { PushToken } from '@/types/api.types';

export const usePushTokens = () => {
  return useQuery({
    queryKey: ['pushTokens'],
    queryFn: async () => {
      const { data } = await apiClient.get<PushToken[]>('/push-notifications/tokens');
      return data;
    },
  });
};
