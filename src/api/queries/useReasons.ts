import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { Reason, ReasonType, ReasonCategory } from '@/types/api.types';

export const useReasons = () => {
  return useQuery({
    queryKey: ['reasons'],
    queryFn: async () => {
      const { data } = await apiClient.get<Reason[]>('/reasons');
      return data;
    },
  });
};

export const useActiveReasons = () => {
  return useQuery({
    queryKey: ['reasons', 'active'],
    queryFn: async () => {
      const { data } = await apiClient.get<Reason[]>('/reasons/active');
      return data;
    },
  });
};

export const useReasonsByType = (type: ReasonType) => {
  return useQuery({
    queryKey: ['reasons', 'type', type],
    queryFn: async () => {
      const { data } = await apiClient.get<Reason[]>(`/reasons/type/${type}`);
      return data;
    },
    enabled: !!type,
  });
};

export const useReasonsByCategory = (category: ReasonCategory) => {
  return useQuery({
    queryKey: ['reasons', 'category', category],
    queryFn: async () => {
      const { data } = await apiClient.get<Reason[]>(`/reasons/category/${category}`);
      return data;
    },
    enabled: !!category,
  });
};

export const useReason = (id: number) => {
  return useQuery({
    queryKey: ['reasons', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Reason>(`/reasons/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
