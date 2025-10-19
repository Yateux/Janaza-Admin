import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '@/api/queries/useUsers';
import { UserTable } from '@/components/users/UserTable';
import { UserForm } from '@/components/users/UserForm';
import { UserDeleteDialog } from '@/components/users/UserDeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dayjs from '@/lib/dayjs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Role } from '@/types/api.types';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';

export default function UsersPage() {
  const navigate = useNavigate();
  const { data: users, isLoading } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortByDate, setSortByDate] = useState<string>('none');
  const [sortByRole, setSortByRole] = useState<string>('none');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    let filtered = users.filter((user) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower);

      // Role filter
      const matchesRole =
        roleFilter === 'all' ||
        user.roles === roleFilter;

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !user.deletedAt) ||
        (statusFilter === 'deleted' && !!user.deletedAt);

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort by date
    if (sortByDate === 'asc') {
      filtered = [...filtered].sort((a, b) =>
        dayjs(a.createdAt || 0).valueOf() - dayjs(b.createdAt || 0).valueOf()
      );
    } else if (sortByDate === 'desc') {
      filtered = [...filtered].sort((a, b) =>
        dayjs(b.createdAt || 0).valueOf() - dayjs(a.createdAt || 0).valueOf()
      );
    }

    // Sort by role
    if (sortByRole === 'asc') {
      filtered = [...filtered].sort((a, b) =>
        (a.roles || '').localeCompare(b.roles || '')
      );
    } else if (sortByRole === 'desc') {
      filtered = [...filtered].sort((a, b) =>
        (b.roles || '').localeCompare(a.roles || '')
      );
    }

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter, sortByDate, sortByRole]);

  const handleView = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const stats = {
    total: users?.length || 0,
    active: users?.filter((u) => !u.deletedAt).length || 0,
    deleted: users?.filter((u) => !!u.deletedAt).length || 0,
    admins: users?.filter((u) => u.roles === Role.Admin).length || 0,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérer les utilisateurs de la plateforme Janaza Jamaa
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg w-full sm:w-auto h-10 sm:h-11">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Créer</span>
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-xs sm:text-sm text-slate-500">utilisateurs</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-700">{stats.active}</div>
            <p className="text-xs sm:text-sm text-blue-600 hidden sm:block">utilisateurs actifs</p>
            <p className="text-xs sm:text-sm text-blue-600 sm:hidden">actifs</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-red-50 to-rose-50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-red-700">Supprimés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-red-700">{stats.deleted}</div>
            <p className="text-xs sm:text-sm text-red-600 hidden sm:block">utilisateurs supprimés</p>
            <p className="text-xs sm:text-sm text-red-600 sm:hidden">supprimés</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-700">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-purple-700">{stats.admins}</div>
            <p className="text-xs sm:text-sm text-purple-600 hidden sm:block">administrateurs</p>
            <p className="text-xs sm:text-sm text-purple-600 sm:hidden">admins</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
          <CardTitle className="text-slate-900">Liste des utilisateurs</CardTitle>
          <CardDescription>
            Rechercher et filtrer les utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 sm:pt-6">
          {/* Version Mobile - Recherche + Bouton Filtres */}
          <div className="flex gap-2 lg:hidden">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setFiltersOpen(true)}
              className="h-10 px-3 gap-2 flex-shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filtres</span>
            </Button>
          </div>

          {/* Version Desktop - Tous les filtres visibles */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher par email, nom ou prénom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value={Role.User}>Utilisateur</SelectItem>
                  <SelectItem value={Role.Admin}>Administrateur</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="deleted">Supprimés</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortByDate} onValueChange={setSortByDate}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Trier par date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Pas de tri par date</SelectItem>
                  <SelectItem value="asc">Date croissante</SelectItem>
                  <SelectItem value="desc">Date décroissante</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortByRole} onValueChange={setSortByRole}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Trier par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Pas de tri par rôle</SelectItem>
                  <SelectItem value="asc">Rôle A-Z</SelectItem>
                  <SelectItem value="desc">Rôle Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <UserTable
            users={filteredUsers}
            loading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un utilisateur</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau compte utilisateur.
            </DialogDescription>
          </DialogHeader>
          <UserForm onSuccess={handleCreateSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm user={selectedUser} onSuccess={handleEditSuccess} />
          )}
        </DialogContent>
      </Dialog>

      <UserDeleteDialog
        user={selectedUser}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />

      {/* Dialog de filtres pour mobile */}
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Filtres</DialogTitle>
            <DialogDescription>
              Filtrer et trier la liste des utilisateurs
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rôle</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value={Role.User}>Utilisateur</SelectItem>
                  <SelectItem value={Role.Admin}>Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="deleted">Supprimés</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Trier par date</label>
              <Select value={sortByDate} onValueChange={setSortByDate}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Trier par date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Pas de tri par date</SelectItem>
                  <SelectItem value="asc">Date croissante</SelectItem>
                  <SelectItem value="desc">Date décroissante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Trier par rôle</label>
              <Select value={sortByRole} onValueChange={setSortByRole}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Trier par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Pas de tri par rôle</SelectItem>
                  <SelectItem value="asc">Rôle A-Z</SelectItem>
                  <SelectItem value="desc">Rôle Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setRoleFilter('all');
                  setStatusFilter('all');
                  setSortByDate('none');
                  setSortByRole('none');
                }}
              >
                Réinitialiser
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600"
                onClick={() => setFiltersOpen(false)}
              >
                Appliquer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
