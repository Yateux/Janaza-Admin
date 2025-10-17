import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReportAnnounce, ReportType, ReasonType } from '@/types/api.types';
import { useResolveReport } from '@/api/mutations/useReportMutations';
import { useDeleteAnnounce } from '@/api/mutations/useAnnounceMutations';
import { useReasonsByType } from '@/api/queries/useReasons';
import { getFullName, formatDisplayDateTime } from '@/lib/utils';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResolveDialogProps {
  report: ReportAnnounce | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ResolveDialog({
  report,
  open,
  onOpenChange,
  onSuccess,
}: ResolveDialogProps) {
  const [adminNotes, setAdminNotes] = useState('');
  const [deleteAnnounce, setDeleteAnnounce] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState<string>('');

  const { data: reasons, isLoading: reasonsLoading } = useReasonsByType(ReasonType.ANNOUNCE);
  const resolveReport = useResolveReport();
  const deleteAnnounceMutation = useDeleteAnnounce();

  const handleResolve = async () => {
    if (!report) return;

    try {
      // First, resolve the report
      await resolveReport.mutateAsync({
        reportId: report.id,
        data: { adminNotes: adminNotes || undefined },
      });

      // If delete option is checked, delete the announce
      if (deleteAnnounce && selectedReasonId) {
        await deleteAnnounceMutation.mutateAsync({
          id: report.announce.id,
          reasonId: parseInt(selectedReasonId, 10),
        });
      }

      onOpenChange(false);
      handleReset();
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleReset = () => {
    setAdminNotes('');
    setDeleteAnnounce(false);
    setSelectedReasonId('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleReset();
    }
    onOpenChange(newOpen);
  };

  if (!report) return null;

  const getReportTypeBadge = (type: ReportType) => {
    const variants: Record<ReportType, 'default' | 'destructive' | 'secondary' | 'outline'> = {
      [ReportType.INAPPROPRIATE_CONTENT]: 'destructive',
      [ReportType.INCORRECT_INFORMATION]: 'secondary',
      [ReportType.SPAM]: 'outline',
      [ReportType.OTHER]: 'outline',
    };

    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  const isSubmitDisabled =
    resolveReport.isPending ||
    deleteAnnounceMutation.isPending ||
    (deleteAnnounce && !selectedReasonId);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Résoudre le signalement
          </DialogTitle>
          <DialogDescription>
            Marquer ce signalement comme résolu et optionnellement supprimer
            l'annonce concernée.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <h4 className="text-sm font-semibold mb-3">Résumé du signalement</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Annonce: </span>
                {getFullName(
                  report.announce.firstName,
                  report.announce.lastName
                )}
              </div>
              <div>
                <span className="font-medium">Type: </span>
                {getReportTypeBadge(report.type)}
              </div>
              {report.description && (
                <div>
                  <span className="font-medium">Description: </span>
                  <span className="text-muted-foreground">
                    {report.description}
                  </span>
                </div>
              )}
              <div>
                <span className="font-medium">Signalé par: </span>
                {report.reportedBy
                  ? getFullName(
                      report.reportedBy.firstName,
                      report.reportedBy.lastName
                    )
                  : 'Anonyme'}
              </div>
              <div>
                <span className="font-medium">Date: </span>
                {formatDisplayDateTime(report.createdAt)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminNotes">Notes administrateur (optionnel)</Label>
            <Textarea
              id="adminNotes"
              placeholder="Ajouter des notes concernant la résolution de ce signalement..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              disabled={resolveReport.isPending || deleteAnnounceMutation.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Ces notes seront enregistrées avec le signalement résolu.
            </p>
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="deleteAnnounce"
                checked={deleteAnnounce}
                onCheckedChange={(checked) => {
                  setDeleteAnnounce(checked === true);
                  if (checked !== true) {
                    setSelectedReasonId('');
                  }
                }}
                disabled={
                  resolveReport.isPending ||
                  deleteAnnounceMutation.isPending ||
                  !!report.announce.deletedAt
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="deleteAnnounce"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Supprimer l'annonce en même temps
                </label>
                <p className="text-xs text-muted-foreground">
                  L'annonce sera définitivement supprimée de la plateforme
                </p>
              </div>
            </div>

            {report.announce.deletedAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>Cette annonce est déjà supprimée</span>
              </div>
            )}

            {deleteAnnounce && !report.announce.deletedAt && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="deleteReason">
                  Raison de la suppression *
                </Label>
                <Select
                  value={selectedReasonId}
                  onValueChange={setSelectedReasonId}
                  disabled={
                    reasonsLoading ||
                    resolveReport.isPending ||
                    deleteAnnounceMutation.isPending
                  }
                >
                  <SelectTrigger id="deleteReason">
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
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={resolveReport.isPending || deleteAnnounceMutation.isPending}
          >
            Annuler
          </Button>
          <Button onClick={handleResolve} disabled={isSubmitDisabled}>
            {resolveReport.isPending || deleteAnnounceMutation.isPending
              ? 'Traitement...'
              : 'Résoudre le signalement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
