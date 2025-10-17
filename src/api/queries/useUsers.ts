import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { User } from '@/types/api.types';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await apiClient.get<User[]>('/users');
      return data;
    },
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const { data } = await apiClient.get<User>(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
