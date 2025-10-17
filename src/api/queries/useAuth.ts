import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../client';
import { LoginDto, LoginResponse, User } from '@/types/api.types';
import { useAuthStore } from '@/stores/authStore';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginDto) => {
      const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: async (data) => {
      const { data: user } = await apiClient.get<User>('/auth/me', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      if (user.roles !== 'admin') {
        throw new Error('Accès refusé : seuls les administrateurs peuvent se connecter');
      }

      setAuth(user, data.access_token);
    },
  });
};

export const useMe = () => {
  const { updateUser, logout } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await apiClient.get<User>('/auth/me');

      if (data.roles !== 'admin') {
        logout();
        throw new Error('Rôle administrateur requis');
      }

      updateUser(data);
      return data;
    },
    retry: false,
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      logout();
    },
  });
};
