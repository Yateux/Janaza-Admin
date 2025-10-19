import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  AlertTriangle,
  Tag,
  Bell,
  Sparkles,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Utilisateurs' },
  { to: '/announces', icon: MessageSquare, label: 'Annonces' },
  { to: '/reports', icon: AlertTriangle, label: 'Signalements' },
  { to: '/reasons', icon: Tag, label: 'Raisons' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-72 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo Section with gradient */}
          <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white">Janaza Jamaa</h1>
                <p className="text-xs text-slate-400">Administration</p>
              </div>
            </div>
            {/* Bouton de fermeture mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 sm:p-4 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        'h-5 w-5 transition-transform duration-200 flex-shrink-0',
                        isActive ? 'scale-110' : 'group-hover:scale-110'
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                    {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-white flex-shrink-0" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer with user info placeholder */}
          <div className="border-t border-slate-700/50 p-3 sm:p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-2 sm:p-3">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-xs sm:text-sm font-bold text-white flex-shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">Administrateur</p>
                <p className="text-xs text-slate-400 truncate">admin@janaza.fr</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
