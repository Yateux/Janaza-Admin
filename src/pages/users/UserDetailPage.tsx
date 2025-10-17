import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '@/api/queries/useUsers';
import { useAllAnnounces } from '@/api/queries/useAnnounces';
import { UserForm } from '@/components/users/UserForm';
import { UserDeleteDialog } from '@/components/users/UserDeleteDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  formatDisplayDateTime,
  formatDisplayDate,
  getFullName,
  getRoleLabel,
  getGenderLabel,
} from '@/lib/utils';
import { ArrowLeft, Pencil, Trash2, Calendar, Mail, User as UserIcon, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id!);
  const { data: allAnnounces } = useAllAnnounces();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter announces for this user
  const userAnnounces = allAnnounces?.filter((announce) => announce.user?.id === id) || [];

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    navigate('/users');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">Utilisateur non trouvé</p>
        <Button onClick={() => navigate('/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/users')} className="hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {getFullName(user.firstName, user.lastName)}
            </h1>
            <p className="text-slate-600">{user.email || 'Aucun email'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {!user.deletedAt && (
            <>
              <Button variant="outline" onClick={() => setEditDialogOpen(true)} className="gap-2 border-slate-200 hover:bg-slate-50 hover:text-slate-900">
                <Pencil className="h-4 w-4" />
                Modifier
              </Button>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg">
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-blue-600" />
              Informations personnelles
            </CardTitle>
            <CardDescription>Détails du compte utilisateur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">Email</p>
                <p className="text-sm text-slate-600">
                  {user.email || 'Non renseigné'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <UserIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">Nom complet</p>
                <p className="text-sm text-slate-600">
                  {getFullName(user.firstName, user.lastName)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-sm font-semibold text-slate-900">Genre</p>
                <p className="text-sm text-slate-600">
                  {getGenderLabel(user.gender)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-sm font-semibold text-slate-900 mb-2">Rôle</p>
                <Badge variant={user.roles === 'admin' ? 'default' : 'secondary'} className={user.roles === 'admin' ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : ''}>
                  {getRoleLabel(user.roles)}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">Date de naissance</p>
                <p className="text-sm text-slate-600">
                  {formatDisplayDate(user.dateOfBirth)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Informations système
            </CardTitle>
            <CardDescription>Métadonnées du compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-sm font-semibold text-slate-900">ID Utilisateur</p>
              <p className="text-sm text-slate-600 font-mono">{user.id}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-sm font-semibold text-slate-900">Date de création</p>
              <p className="text-sm text-slate-600">
                {formatDisplayDateTime(user.createdAt, 'DD/MM/YYYY à HH:mm')}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-sm font-semibold text-slate-900">Dernière mise à jour</p>
              <p className="text-sm text-slate-600">
                {formatDisplayDateTime(user.updatedAt, 'DD/MM/YYYY à HH:mm')}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-sm font-semibold text-slate-900 mb-2">Statut</p>
              {user.deletedAt ? (
                <div className="space-y-2">
                  <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-red-600">Supprimé</Badge>
                  <p className="text-sm text-slate-600">
                    Supprimé le {formatDisplayDateTime(user.deletedAt, 'DD/MM/YYYY à HH:mm')}
                  </p>
                </div>
              ) : (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600">Actif</Badge>
              )}
            </div>

            {user.rgpdDeletionRequested && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-sm font-semibold text-slate-900 mb-2">Demande RGPD</p>
                <Badge variant="destructive" className="bg-gradient-to-r from-orange-500 to-red-600">Suppression demandée</Badge>
                <p className="text-sm text-slate-600 mt-1">
                  {formatDisplayDateTime(user.rgpdDeletionRequestedAt, 'DD/MM/YYYY à HH:mm')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Annonces créées</p>
                <p className="text-2xl font-bold text-blue-900">{userAnnounces.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Annonces actives</p>
                <p className="text-2xl font-bold text-green-900">
                  {userAnnounces.filter(a => a.active && !a.expired).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg shadow-slate-500/30">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Annonces expirées</p>
                <p className="text-2xl font-bold text-slate-900">
                  {userAnnounces.filter(a => a.expired).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            Annonces de l'utilisateur
          </CardTitle>
          <CardDescription>
            {userAnnounces.length} annonce{userAnnounces.length !== 1 ? 's' : ''} trouvée
            {userAnnounces.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {userAnnounces.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune annonce trouvée pour cet utilisateur
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Défunt</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Date de prière</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userAnnounces.map((announce) => (
                    <TableRow key={announce.id}>
                      <TableCell className="font-medium">
                        {getFullName(announce.firstName, announce.lastName)}
                      </TableCell>
                      <TableCell>{announce.cityPray}</TableCell>
                      <TableCell className="text-sm">
                        {formatDisplayDateTime(announce.startDate, 'DD/MM/YYYY à HH:mm')}
                      </TableCell>
                      <TableCell>
                        {announce.expired ? (
                          <Badge variant="secondary">Expirée</Badge>
                        ) : announce.active ? (
                          <Badge>Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDisplayDateTime(announce.createdAt, 'DD/MM/YYYY à HH:mm')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/announces/${announce.id}`}>Voir détails</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <UserForm user={user} onSuccess={handleEditSuccess} />
        </DialogContent>
      </Dialog>

      <UserDeleteDialog
        user={user}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
