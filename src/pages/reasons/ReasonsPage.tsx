import { useState, useMemo } from 'react';
import { useReasons } from '@/api/queries/useReasons';
import { ReasonTable } from '@/components/reasons/ReasonTable';
import { ReasonForm } from '@/components/reasons/ReasonForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Reason, ReasonType, ReasonCategory } from '@/types/api.types';
import { Plus, Search } from 'lucide-react';
import { useUpdateReason, useDeleteReason } from '@/api/mutations/useReasonMutations';

export default function ReasonsPage() {
  const { data: reasons, isLoading } = useReasons();
  const updateReason = useUpdateReason();
  const deleteReason = useDeleteReason();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<Reason | null>(null);

  const filteredReasons = useMemo(() => {
    if (!reasons) return [];

    return reasons.filter((reason) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        reason.code.toLowerCase().includes(searchLower) ||
        reason.label.toLowerCase().includes(searchLower) ||
        reason.description?.toLowerCase().includes(searchLower);

      // Type filter
      const matchesType =
        typeFilter === 'all' ||
        reason.type === typeFilter;

      // Category filter
      const matchesCategory =
        categoryFilter === 'all' ||
        reason.category === categoryFilter;

      // Active filter
      const matchesActive =
        activeFilter === 'all' ||
        (activeFilter === 'active' && reason.active) ||
        (activeFilter === 'inactive' && !reason.active);

      return matchesSearch && matchesType && matchesCategory && matchesActive;
    });
  }, [reasons, searchTerm, typeFilter, categoryFilter, activeFilter]);

  const handleEdit = (reason: Reason) => {
    setSelectedReason(reason);
    setEditDialogOpen(true);
  };

  const handleDelete = (reason: Reason) => {
    setSelectedReason(reason);
    setDeleteDialogOpen(true);
  };

  const handleToggleActive = async (reason: Reason) => {
    try {
      await updateReason.mutateAsync({
        id: reason.id,
        data: { active: !reason.active },
      });
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedReason) return;

    try {
      await deleteReason.mutateAsync(selectedReason.id);
      setDeleteDialogOpen(false);
      setSelectedReason(null);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedReason(null);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!reasons) return { total: 0, active: 0, byType: {} };

    const byType = reasons.reduce((acc, reason) => {
      acc[reason.type] = (acc[reason.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: reasons.length,
      active: reasons.filter((r) => r.active).length,
      byType,
    };
  }, [reasons]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Raisons</h1>
          <p className="text-muted-foreground">
            Gérer les raisons de suppression et de modération
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg">
          <Plus className="h-5 w-5" />
          Créer une raison
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-sm text-slate-500">raisons</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700">Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{stats.active}</div>
            <p className="text-sm text-green-600">raisons actives</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700">Annonces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {stats.byType[ReasonType.ANNOUNCE] || 0}
            </div>
            <p className="text-sm text-blue-600">raisons annonces</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700">Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">
              {stats.byType[ReasonType.USER] || 0}
            </div>
            <p className="text-sm text-purple-600">raisons utilisateurs</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
          <CardTitle className="text-slate-900">Liste des raisons</CardTitle>
          <CardDescription>
            Rechercher et filtrer les raisons
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher par code ou libellé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-11 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value={ReasonType.ANNOUNCE}>Annonce</SelectItem>
                <SelectItem value={ReasonType.COMMENT}>Commentaire</SelectItem>
                <SelectItem value={ReasonType.USER}>Utilisateur</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px] h-11 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem value={ReasonCategory.USER_REQUEST}>Demande utilisateur</SelectItem>
                <SelectItem value={ReasonCategory.ACCOUNT_DELETION}>Suppression compte</SelectItem>
                <SelectItem value={ReasonCategory.EXPIRED}>Expiré</SelectItem>
                <SelectItem value={ReasonCategory.COMPLETED}>Complété</SelectItem>
                <SelectItem value={ReasonCategory.INAPPROPRIATE}>Inapproprié</SelectItem>
                <SelectItem value={ReasonCategory.SPAM}>Spam</SelectItem>
                <SelectItem value={ReasonCategory.OFFENSIVE}>Offensant</SelectItem>
                <SelectItem value={ReasonCategory.OTHER}>Autre</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-full md:w-[150px] h-11 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="active">Actives</SelectItem>
                <SelectItem value="inactive">Inactives</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ReasonTable
            reasons={filteredReasons}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </CardContent>
      </Card>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une raison</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle raison.
            </DialogDescription>
          </DialogHeader>
          <ReasonForm onSuccess={handleCreateSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier la raison</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la raison.
            </DialogDescription>
          </DialogHeader>
          {selectedReason && (
            <ReasonForm reason={selectedReason} onSuccess={handleEditSuccess} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la raison "{selectedReason?.label}" ?
              Cette action est irréversible et pourrait affecter les données qui y sont liées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
