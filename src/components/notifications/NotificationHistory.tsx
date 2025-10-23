import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PushToken } from '@/types/api.types';
import { formatDisplayDateTime, truncate, getFullName } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Trash2, ExternalLink } from 'lucide-react';

interface NotificationHistoryProps {
  tokens: PushToken[];
  loading: boolean;
  onDelete: (deviceId: string) => void;
}

export function NotificationHistory({ tokens, loading, onDelete }: NotificationHistoryProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<PushToken | null>(null);

  // Debug: vérifier le format des dates reçues de l'API
  // Les dates système (createdAt, updatedAt) doivent avoir des millisecondes précises (ex: .874Z)
  // pour être converties de UTC → Europe/Paris automatiquement par formatDisplayDateTime
  if (tokens && tokens.length > 0) {
    const firstToken = tokens[0];
    console.log('🔍 Debug Token Push - Format des dates:', {
      deviceId: firstToken.deviceId.substring(0, 20) + '...',
      createdAt_raw: firstToken.createdAt,
      createdAt_type: typeof firstToken.createdAt,
      createdAt_string: String(firstToken.createdAt),
      updatedAt_raw: firstToken.updatedAt,
      updatedAt_string: String(firstToken.updatedAt),
      note: 'Les dates doivent finir par des millisecondes précises (ex: .874Z) pour conversion timezone',
    });
  }

  const handleDeleteClick = (token: PushToken) => {
    setSelectedToken(token);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedToken) {
      onDelete(selectedToken.deviceId);
      setDeleteDialogOpen(false);
      setSelectedToken(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!tokens || tokens.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">Aucun token push enregistré</div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device ID</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Expo Token</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Date création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={`${token.deviceId}-${token.expoPushToken}`}>
                <TableCell className="font-mono text-sm">{truncate(token.deviceId, 20)}</TableCell>
                <TableCell>
                  {token.user ? (
                    <div className="flex flex-col">
                      <Link
                        to={`/users/${token.user.id}`}
                        className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                      >
                        {getFullName(token.user.firstName, token.user.lastName)}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <span className="text-xs text-muted-foreground">{token.user.email}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Anonyme</span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  <span title={token.expoPushToken}>{truncate(token.expoPushToken, 30)}</span>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {token.latitude && token.longitude ? (
                    <div>
                      <div>Lat: {token.latitude}</div>
                      <div>Lng: {token.longitude}</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">{formatDisplayDateTime(token.createdAt, 'DD/MM/YYYY à HH:mm')}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(token)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le token</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce token push ? L'appareil ne recevra plus de
              notifications. Cette action ne peut pas être annulée.
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
    </>
  );
}
