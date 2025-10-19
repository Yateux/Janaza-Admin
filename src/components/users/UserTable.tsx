import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { User } from '@/types/api.types';
import { formatDisplayDateTime, getRoleLabel } from '@/lib/utils';

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UserTable({ users, loading, onView, onEdit, onDelete }: UserTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Eye className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">Aucun utilisateur trouvé</p>
      </div>
    );
  }

  return (
    <>
      {/* Vue Desktop - Table classique */}
      <div className="hidden lg:block rounded-xl border-0 shadow-lg shadow-slate-200/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-slate-50 to-white border-b-2 border-slate-100 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Email</TableHead>
              <TableHead className="font-semibold text-slate-700">Nom</TableHead>
              <TableHead className="font-semibold text-slate-700">Prénom</TableHead>
              <TableHead className="font-semibold text-slate-700">Rôle</TableHead>
              <TableHead className="font-semibold text-slate-700">Date création</TableHead>
              <TableHead className="font-semibold text-slate-700">Statut</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">
                  {user.email || '-'}
                </TableCell>
                <TableCell className="text-slate-700">{user.lastName || '-'}</TableCell>
                <TableCell className="text-slate-700">{user.firstName || '-'}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.roles === 'admin' ? 'default' : 'secondary'}
                    className={user.roles === 'admin' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-sm' : ''}
                  >
                    {getRoleLabel(user.roles)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {formatDisplayDateTime(user.createdAt, 'DD/MM/YYYY à HH:mm')}
                </TableCell>
                <TableCell>
                  {user.deletedAt ? (
                    <Badge variant="destructive" className="shadow-sm">Supprimé</Badge>
                  ) : (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 shadow-sm">Actif</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(user)}
                        title="Voir les détails"
                        className="h-9 w-9 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && !user.deletedAt && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(user)}
                        title="Modifier"
                        className="h-9 w-9 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && !user.deletedAt && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(user)}
                        title="Supprimer"
                        className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Vue Mobile - Cards */}
      <div className="lg:hidden space-y-3">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-lg shadow-slate-200/50 p-3 sm:p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">{user.email || '-'}</p>
                <p className="text-xs sm:text-sm text-slate-600 truncate">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div className="flex gap-0.5 flex-shrink-0">
                {onView && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(user)}
                    title="Voir"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                )}
                {onEdit && !user.deletedAt && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                    title="Modifier"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                )}
                {onDelete && !user.deletedAt && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user)}
                    title="Supprimer"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Badge
                variant={user.roles === 'admin' ? 'default' : 'secondary'}
                className={`text-xs ${user.roles === 'admin' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-sm' : ''}`}
              >
                {getRoleLabel(user.roles)}
              </Badge>
              {user.deletedAt ? (
                <Badge variant="destructive" className="shadow-sm text-xs">Supprimé</Badge>
              ) : (
                <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 shadow-sm text-xs">Actif</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Créé le {formatDisplayDateTime(user.createdAt, 'DD/MM/YYYY')}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
