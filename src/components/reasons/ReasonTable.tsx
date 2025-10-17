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
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2 } from 'lucide-react';
import { Reason, ReasonType, ReasonCategory } from '@/types/api.types';

interface ReasonTableProps {
  reasons: Reason[];
  loading?: boolean;
  onEdit?: (reason: Reason) => void;
  onDelete?: (reason: Reason) => void;
  onToggleActive?: (reason: Reason) => void;
}

const getTypeLabel = (type: ReasonType): string => {
  const labels: Record<ReasonType, string> = {
    [ReasonType.ANNOUNCE]: 'Annonce',
    [ReasonType.COMMENT]: 'Commentaire',
    [ReasonType.USER]: 'Utilisateur',
  };
  return labels[type];
};

const getCategoryLabel = (category: ReasonCategory): string => {
  const labels: Record<ReasonCategory, string> = {
    [ReasonCategory.USER_REQUEST]: 'Demande utilisateur',
    [ReasonCategory.ACCOUNT_DELETION]: 'Suppression compte',
    [ReasonCategory.EXPIRED]: 'Expiré',
    [ReasonCategory.COMPLETED]: 'Complété',
    [ReasonCategory.INAPPROPRIATE]: 'Inapproprié',
    [ReasonCategory.SPAM]: 'Spam',
    [ReasonCategory.OFFENSIVE]: 'Offensant',
    [ReasonCategory.OTHER]: 'Autre',
  };
  return labels[category];
};

const getTypeVariant = (type: ReasonType): 'default' | 'secondary' | 'outline' => {
  const variants: Record<ReasonType, 'default' | 'secondary' | 'outline'> = {
    [ReasonType.ANNOUNCE]: 'default',
    [ReasonType.COMMENT]: 'secondary',
    [ReasonType.USER]: 'outline',
  };
  return variants[type];
};

export function ReasonTable({
  reasons,
  loading,
  onEdit,
  onDelete,
  onToggleActive
}: ReasonTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!reasons || reasons.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune raison trouvée
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Libellé</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-center">Actif</TableHead>
            <TableHead className="text-center">Ordre</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reasons.map((reason) => (
            <TableRow key={reason.id}>
              <TableCell className="font-mono font-medium">
                {reason.code}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{reason.label}</div>
                  {reason.description && (
                    <div className="text-sm text-muted-foreground">
                      {reason.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getTypeVariant(reason.type)}>
                  {getTypeLabel(reason.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getCategoryLabel(reason.category)}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={reason.active}
                  onCheckedChange={() => onToggleActive?.(reason)}
                  aria-label={`Activer/Désactiver ${reason.label}`}
                />
              </TableCell>
              <TableCell className="text-center">
                <span className="font-medium">{reason.displayOrder}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(reason)}
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(reason)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
