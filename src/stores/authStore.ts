import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, User } from '@/types/api.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      setAuth: (user, token) => {
        if (user.roles !== Role.Admin) {
          throw new Error('Accès refusé : rôle administrateur requis');
        }
        set({ user, accessToken: token });
        localStorage.setItem('accessToken', token);
      },
      logout: () => {
        set({ user: null, accessToken: null });
        localStorage.removeItem('accessToken');
      },
      isAdmin: () => {
        const user = get().user;
        return user?.roles === Role.Admin;
      },
      updateUser: (user) => {
        if (user.roles !== Role.Admin) {
          get().logout();
          throw new Error('Rôle administrateur perdu');
        }
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    }
  )
);
