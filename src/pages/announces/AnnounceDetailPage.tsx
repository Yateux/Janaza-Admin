import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useAnnounce,
  useAnnounceParticipants,
  useAnnounceComments,
} from '@/api/queries/useAnnounces';
import { useAnnounceReports } from '@/api/queries/useReports';
import { useDeleteComment, useUpdateAnnounce } from '@/api/mutations/useAnnounceMutations';
import { ExpireDialog } from '@/components/announces/ExpireDialog';
import { AnnounceDeleteDialog } from '@/components/announces/AnnounceDeleteDialog';
import { AnnounceForm, AnnounceFormValues, UpdateAnnounceFormValues } from '@/components/announces/AnnounceForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  formatDisplayDateTime,
  formatDisplayDate,
  formatDisplayTime,
  getFullName,
  getGenderLabel,
  createIsoFromInputs,
} from '@/lib/utils';
import {
  ArrowLeft,
  Clock,
  Trash2,
  Users,
  MessageSquare,
  AlertTriangle,
  MapPin,
  Calendar,
  User as UserIcon,
  Mail,
  CheckCircle,
  XCircle,
  Edit,
} from 'lucide-react';
import { CommentAnnounce, ReasonType } from '@/types/api.types';
import { useReasonsByType } from '@/api/queries/useReasons';

// Composant pour afficher un commentaire
interface CommentItemProps {
  comment: CommentAnnounce;
  replies?: CommentAnnounce[];
  onDelete: (comment: CommentAnnounce) => void;
}

function CommentItem({ comment, replies, onDelete }: CommentItemProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30 flex-shrink-0">
          {comment.user.firstName?.charAt(0)}{comment.user.lastName?.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-slate-900">
                {getFullName(comment.user.firstName, comment.user.lastName)}
              </p>
              <p className="text-xs text-slate-500">{formatDisplayDateTime(comment.createdAt, 'DD/MM/YYYY à HH:mm')}</p>
            </div>
            {!comment.deletedAt && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(comment)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-slate-700">{comment.message}</p>
          {comment.deletedAt && (
            <Badge variant="destructive" className="mt-2">Supprimé</Badge>
          )}
        </div>
      </div>

      {replies && replies.length > 0 && (
        <div className="ml-12 space-y-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={(reply as CommentAnnounce & { reply?: CommentAnnounce[] }).reply || []}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Composant pour supprimer un commentaire
interface DeleteCommentDialogProps {
  comment: CommentAnnounce | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteCommentDialog({ comment, open, onOpenChange }: DeleteCommentDialogProps) {
  const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);
  const { data: reasons } = useReasonsByType(ReasonType.COMMENT);
  const deleteCommentMutation = useDeleteComment();

  const handleDelete = async () => {
    if (!comment || !selectedReasonId) return;
    await deleteCommentMutation.mutateAsync({
      announceId: comment.announce.id,
      commentId: comment.id,
      reasonId: selectedReasonId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le commentaire</DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Veuillez sélectionner une raison de suppression.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Raison de suppression</Label>
            <Select value={selectedReasonId?.toString()} onValueChange={(value) => setSelectedReasonId(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une raison" />
              </SelectTrigger>
              <SelectContent>
                {reasons?.map((reason) => (
                  <SelectItem key={reason.id} value={reason.id.toString()}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {comment && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium">
                {getFullName(comment.user.firstName, comment.user.lastName)}
              </p>
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">{comment.message}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!selectedReasonId || deleteCommentMutation.isPending}
          >
            {deleteCommentMutation.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AnnounceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: announce, isLoading } = useAnnounce(id!);
  const { data: participantsData } = useAnnounceParticipants(id!);
  const { data: comments } = useAnnounceComments(id!);
  const { data: reports } = useAnnounceReports(id!);

  // Extraire les participants du format API
  const participants = participantsData?.devices || [];
  const totalParticipants = participantsData?.totalParticipants || 0;

  // Debug: voir la structure des données
  console.log('participantsData:', participantsData);
  console.log('participants:', participants);

  const [expireDialogOpen, setExpireDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentAnnounce | null>(null);

  const updateAnnounceMutation = useUpdateAnnounce();

  const handleExpireSuccess = () => {
    setExpireDialogOpen(false);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    navigate('/announces');
  };

  const handleUpdateSubmit = async (data: AnnounceFormValues | UpdateAnnounceFormValues) => {
    // Convertir la date de naissance si présente
    const updateData = {
      ...data,
      dateOfBirth: data.dateOfBirth ? createIsoFromInputs(data.dateOfBirth, '00:00') : undefined,
    };
    await updateAnnounceMutation.mutateAsync({ id: id!, data: updateData });
    setEditDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!announce) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">Annonce non trouvée</p>
        <Button onClick={() => navigate('/announces')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  // Les commentaires racines sont ceux qui n'ont pas de parent
  // L'API retourne déjà les réponses dans la propriété "reply"
  const rootComments = comments?.filter((c) => !c.parent) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/announces')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getFullName(announce.firstName, announce.lastName)}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              {announce.cityPray}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!announce.deletedAt && (
            <Button variant="outline" onClick={() => setEditDialogOpen(true)} className="gap-2 border-slate-200 hover:bg-slate-50 hover:text-slate-900">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
          {!announce.expired && !announce.expiredAt && !announce.deletedAt && (
            <Button variant="outline" onClick={() => setExpireDialogOpen(true)}>
              <Clock className="mr-2 h-4 w-4" />
              Expirer
            </Button>
          )}
          {!announce.deletedAt && (
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Main Info - 2 colonnes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informations du défunt */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle>Informations du défunt</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Genre</p>
                <p className="font-semibold">{getGenderLabel(announce.gender)}</p>
              </div>
              {announce.dateOfBirth && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Date de naissance</p>
                  <p className="font-semibold">{formatDisplayDate(announce.dateOfBirth)}</p>
                </div>
              )}
            </div>

            {announce.remarks && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Remarques</p>
                <p className="text-sm text-slate-700">{announce.remarks}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {announce.active ? (
                <Badge className="bg-gradient-to-r from-emerald-500 to-green-600">Active</Badge>
              ) : (
                <Badge variant="outline">Inactive</Badge>
              )}
              {announce.expired && <Badge variant="secondary">Expirée</Badge>}
              {announce.hasForum && <Badge variant="outline">Forum activé</Badge>}
            </div>
          </CardContent>
        </Card>

        {/* Lieu et date de la prière */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Prière funéraire
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Adresse</p>
              <p className="font-semibold">{announce.addressPray}</p>
              <p className="text-sm text-slate-600">
                {announce.postCodePray} {announce.cityPray}, {announce.countryPray}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Date</p>
                <p className="font-semibold">{formatDisplayDate(announce.startDate)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Heure</p>
                <p className="font-semibold">{formatDisplayTime(announce.startTime)}</p>
              </div>
            </div>

            {announce.addressFuneral && (
              <>
                <div className="border-t pt-4">
                  <p className="text-xs font-medium text-slate-500 mb-2">Lieu d'enterrement</p>
                  <p className="font-semibold">{announce.addressFuneral}</p>
                  <p className="text-sm text-slate-600">
                    {announce.postCodeFuneral} {announce.cityFuneral}, {announce.countryFuneral}
                  </p>
                </div>
                {announce.funeralDate && announce.funeralTime && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">Date</p>
                      <p className="font-semibold">{formatDisplayDate(announce.funeralDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">Heure</p>
                      <p className="font-semibold">{formatDisplayTime(announce.funeralTime)}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Auteur */}
      {announce.user && (
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-purple-600" />
              Auteur de l'annonce
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/30">
                  {announce.user.firstName?.charAt(0)}{announce.user.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {getFullName(announce.user.firstName, announce.user.lastName)}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {announce.user.email || 'N/A'}
                  </p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link to={`/users/${announce.user.id}`}>Voir le profil</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats rapides */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{announce.participantsCount || 0}</p>
                <p className="text-sm text-slate-500">Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{comments?.length || 0}</p>
                <p className="text-sm text-slate-500">Commentaires</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{reports?.length || 0}</p>
                <p className="text-sm text-slate-500">Signalements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participants */}
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Participants ({totalParticipants})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!participants || participants.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">Aucun participant</p>
              <p className="text-sm text-slate-400 mt-1">Personne n'a encore participé à cette annonce</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {participants.map((device: { deviceId: string; user?: { id: string; firstName?: string; lastName?: string; email?: string }; expoPushToken?: string }) => (
                <div
                  key={device.deviceId}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 border border-slate-200"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30 flex-shrink-0">
                    {device.user ? (
                      `${device.user.firstName?.charAt(0)}${device.user.lastName?.charAt(0)}`
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {device.user ? (
                      <>
                        <Link
                          to={`/users/${device.user.id}`}
                          className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                        >
                          {getFullName(device.user.firstName || null, device.user.lastName || null)}
                        </Link>
                        <p className="text-xs text-slate-500">{device.user.email}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-slate-700 truncate">Anonyme</p>
                        <p className="text-xs text-slate-500">Utilisateur non connecté</p>
                      </>
                    )}
                    <div className="mt-2 flex items-center gap-1.5">
                      <Badge variant="outline" className="text-xs font-mono bg-white">
                        {device.deviceId ? device.deviceId.substring(0, 12) + '...' : 'N/A'}
                      </Badge>
                    </div>
                    {device.expoPushToken && (
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-xs">
                          Push activé
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commentaires */}
      {comments && Array.isArray(comments) && comments.length > 0 && (
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              Commentaires ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {rootComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  replies={(comment as CommentAnnounce & { reply?: CommentAnnounce[] }).reply || []}
                  onDelete={(c) => {
                    setSelectedComment(c);
                    setDeleteCommentDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signalements */}
      {reports && Array.isArray(reports) && reports.length > 0 && (
        <Card className="border-0 shadow-lg shadow-slate-200/50 border-l-4 border-l-red-500">
          <CardHeader className="border-b bg-gradient-to-r from-red-50 to-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Signalements ({reports.length})
              </CardTitle>
              <Button variant="outline" onClick={() => navigate('/reports')} className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-900 hover:border-red-300">
                Voir tous les signalements
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="p-4 rounded-xl bg-red-50 border border-red-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">{report.type}</Badge>
                      {report.resolved ? (
                        <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Résolu</Badge>
                      ) : (
                        <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Non résolu</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{report.description || 'Aucune description'}</p>
                    <p className="text-xs text-slate-500">
                      Signalé par {report.reportedBy ? getFullName(report.reportedBy.firstName, report.reportedBy.lastName) : 'N/A'}
                      {' '}- {formatDisplayDateTime(report.createdAt, 'DD/MM/YYYY à HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'annonce</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'annonce funéraire
            </DialogDescription>
          </DialogHeader>
          <AnnounceForm
            announce={announce}
            onSubmit={handleUpdateSubmit}
            isLoading={updateAnnounceMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <ExpireDialog
        announce={announce}
        open={expireDialogOpen}
        onOpenChange={setExpireDialogOpen}
        onSuccess={handleExpireSuccess}
      />
      <AnnounceDeleteDialog
        announce={announce}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
      <DeleteCommentDialog
        comment={selectedComment}
        open={deleteCommentDialogOpen}
        onOpenChange={setDeleteCommentDialogOpen}
      />
    </div>
  );
}
