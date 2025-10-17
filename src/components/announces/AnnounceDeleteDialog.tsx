import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Announce, ReasonType } from '@/types/api.types';
import { useReasonsByType } from '@/api/queries/useReasons';
import { useDeleteAnnounce } from '@/api/mutations/useAnnounceMutations';
import { getFullName, formatDisplayDateTime } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface AnnounceDeleteDialogProps {
  announce: Announce | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AnnounceDeleteDialog({
  announce,
  open,
  onOpenChange,
  onSuccess,
}: AnnounceDeleteDialogProps) {
  const [selectedReasonId, setSelectedReasonId] = useState<string>('');
  const { data: reasons, isLoading: reasonsLoading } = useReasonsByType(ReasonType.ANNOUNCE);
  const deleteAnnounce = useDeleteAnnounce();

  const handleDelete = async () => {
    if (!announce || !selectedReasonId) return;

    try {
      await deleteAnnounce.mutateAsync({
        id: announce.id,
        reasonId: parseInt(selectedReasonId, 10),
      });
      onOpenChange(false);
      setSelectedReasonId('');
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedReasonId('');
    }
    onOpenChange(newOpen);
  };

  if (!announce) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmer la suppression
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible. L'annonce sera définitivement supprimée.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Défunt:</span>{' '}
                {getFullName(announce.firstName, announce.lastName)}
              </div>
              <div>
                <span className="font-medium">Ville de prière:</span>{' '}
                {announce.cityPray}
              </div>
              <div>
                <span className="font-medium">Date de la prière:</span>{' '}
                {formatDisplayDateTime(announce.startDate)}
              </div>
              <div>
                <span className="font-medium">ID:</span> {announce.id}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Raison de la suppression *</Label>
            <Select
              value={selectedReasonId}
              onValueChange={setSelectedReasonId}
              disabled={reasonsLoading}
            >
              <SelectTrigger id="reason">
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
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={deleteAnnounce.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!selectedReasonId || deleteAnnounce.isPending}
          >
            {deleteAnnounce.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
