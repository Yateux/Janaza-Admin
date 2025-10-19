import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/api/queries/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Menu } from 'lucide-react';
import { getFullName, getInitials } from '@/lib/utils';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/users': 'Gestion des utilisateurs',
  '/announces': 'Gestion des annonces',
  '/reports': 'Signalements',
  '/reasons': 'Raisons de suppression',
  '/notifications': 'Notifications',
};

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    for (const [route, title] of Object.entries(routeTitles)) {
      if (path.startsWith(route)) {
        return title;
      }
    }
    return 'Administration';
  };

  return (
    <header className="fixed left-0 lg:left-72 right-0 top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Bouton Menu Hamburger - visible uniquement sur mobile */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">{getPageTitle()}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
              Bienvenue, {user?.firstName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 sm:h-12 gap-2 sm:gap-3 rounded-xl px-2 sm:px-3 hover:bg-slate-50">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-xs sm:text-sm">
                    {getInitials(user?.firstName || null, user?.lastName || null)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <p className="text-sm font-semibold text-slate-900">
                    {getFullName(user?.firstName || null, user?.lastName || null)}
                  </p>
                  <p className="text-xs text-slate-500">Administrateur</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {getFullName(user?.firstName || null, user?.lastName || null)}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
