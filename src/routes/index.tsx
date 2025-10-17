import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/auth/LoginPage';
import UnauthorizedPage from '@/pages/auth/UnauthorizedPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import UsersPage from '@/pages/users/UsersPage';
import UserDetailPage from '@/pages/users/UserDetailPage';
import AnnouncesPage from '@/pages/announces/AnnouncesPage';
import ExpiredAnnouncesPage from '@/pages/announces/ExpiredAnnouncesPage';
import AnnounceDetailPage from '@/pages/announces/AnnounceDetailPage';
import CreateAnnouncePage from '@/pages/announces/CreateAnnouncePage';
import ReportsPage from '@/pages/reports/ReportsPage';
import ReportDetailPage from '@/pages/reports/ReportDetailPage';
import ReasonsPage from '@/pages/reasons/ReasonsPage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
import ProfilePage from '@/pages/profile/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'users',
        children: [
          { index: true, element: <UsersPage /> },
          { path: ':id', element: <UserDetailPage /> },
        ],
      },
      {
        path: 'announces',
        children: [
          { index: true, element: <AnnouncesPage /> },
          { path: 'new', element: <CreateAnnouncePage /> },
          { path: 'expired', element: <ExpiredAnnouncesPage /> },
          { path: ':id', element: <AnnounceDetailPage /> },
        ],
      },
      {
        path: 'reports',
        children: [
          { index: true, element: <ReportsPage /> },
          { path: ':id', element: <ReportDetailPage /> },
        ],
      },
      {
        path: 'reasons',
        element: <ReasonsPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);
