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
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Utilisateurs' },
  { to: '/announces', icon: MessageSquare, label: 'Annonces' },
  { to: '/reports', icon: AlertTriangle, label: 'Signalements' },
  { to: '/reasons', icon: Tag, label: 'Raisons' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50">
      <div className="flex h-full flex-col">
        {/* Logo Section with gradient */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Janaza Jamaa</h1>
              <p className="text-xs text-slate-400">Administration</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
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
                      'h-5 w-5 transition-transform duration-200',
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    )}
                  />
                  <span>{item.label}</span>
                  {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-white" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer with user info placeholder */}
        <div className="border-t border-slate-700/50 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Administrateur</p>
              <p className="text-xs text-slate-400 truncate">admin@janaza.fr</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
