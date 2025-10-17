import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useMe } from '@/api/queries/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuthStore();

  useMe();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
