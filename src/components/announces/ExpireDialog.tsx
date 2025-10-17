import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Announce } from '@/types/api.types';
import { useExpireAnnounce } from '@/api/mutations/useAnnounceMutations';
import { getFullName, formatDisplayDateTime } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface ExpireDialogProps {
  announce: Announce | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ExpireDialog({
  announce,
  open,
  onOpenChange,
  onSuccess,
}: ExpireDialogProps) {
  const expireAnnounce = useExpireAnnounce();

  const handleExpire = async () => {
    if (!announce) return;

    try {
      await expireAnnounce.mutateAsync(announce.id);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  if (!announce) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Marquer comme expirée
          </DialogTitle>
          <DialogDescription>
            Cette annonce sera marquée comme expirée et ne sera plus visible pour les utilisateurs.
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
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={expireAnnounce.isPending}
          >
            Annuler
          </Button>
          <Button
            onClick={handleExpire}
            disabled={expireAnnounce.isPending}
          >
            {expireAnnounce.isPending ? 'Expiration...' : 'Marquer comme expirée'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
