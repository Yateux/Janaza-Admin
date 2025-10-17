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
import { User, ReasonType } from '@/types/api.types';
import { useReasonsByType } from '@/api/queries/useReasons';
import { useDeleteUser } from '@/api/mutations/useUserMutations';
import { getFullName } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface UserDeleteDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UserDeleteDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UserDeleteDialogProps) {
  const [selectedReasonId, setSelectedReasonId] = useState<string>('');
  const { data: reasons, isLoading: reasonsLoading } = useReasonsByType(ReasonType.USER);
  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    if (!user || !selectedReasonId) return;

    try {
      await deleteUser.mutateAsync({
        id: user.id,
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

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmer la suppression
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible. L'utilisateur sera définitivement supprimé.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Nom complet:</span>{' '}
                {getFullName(user.firstName, user.lastName)}
              </div>
              <div>
                <span className="font-medium">Email:</span>{' '}
                {user.email || 'N/A'}
              </div>
              <div>
                <span className="font-medium">ID:</span> {user.id}
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
            disabled={deleteUser.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!selectedReasonId || deleteUser.isPending}
          >
            {deleteUser.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
