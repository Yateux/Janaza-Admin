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
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Clock, Trash2, Users, AlertTriangle } from 'lucide-react';
import { Announce } from '@/types/api.types';
import { formatDisplayDate, formatDisplayTime, getFullName, getGenderLabel } from '@/lib/utils';

interface AnnounceTableProps {
  announces: Announce[];
  loading?: boolean;
  onView?: (announce: Announce) => void;
  onExpire?: (announce: Announce) => void;
  onDelete?: (announce: Announce) => void;
}

export function AnnounceTable({
  announces,
  loading,
  onView,
  onExpire,
  onDelete,
}: AnnounceTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!announces || announces.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Eye className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">Aucune annonce trouvée</p>
      </div>
    );
  }

  const getStatusBadge = (announce: Announce) => {
    if (announce.deletedAt) {
      return (
        <Badge variant="destructive" className="shadow-sm">
          Supprimée
        </Badge>
      );
    }
    if (announce.expired || announce.expiredAt) {
      return (
        <Badge variant="secondary" className="shadow-sm">
          Expirée
        </Badge>
      );
    }
    if (announce.active) {
      return (
        <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 shadow-sm">Active</Badge>
      );
    }
    return <Badge variant="outline">Inactive</Badge>;
  };

  return (
    <div className="rounded-xl border-0 shadow-lg shadow-slate-200/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-slate-50 to-white border-b-2 border-slate-100 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-700">Défunt</TableHead>
            <TableHead className="font-semibold text-slate-700">Genre</TableHead>
            <TableHead className="font-semibold text-slate-700">Date/Heure prière</TableHead>
            <TableHead className="font-semibold text-slate-700">Ville prière</TableHead>
            <TableHead className="text-center font-semibold text-slate-700">Participants</TableHead>
            <TableHead className="text-center font-semibold text-slate-700">Signalements</TableHead>
            <TableHead className="font-semibold text-slate-700">Statut</TableHead>
            <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announces.map((announce) => (
            <TableRow key={announce.id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-semibold text-slate-900">
                {getFullName(announce.firstName, announce.lastName)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-slate-50">
                  {getGenderLabel(announce.gender)}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                <div className="font-medium text-slate-700">{formatDisplayDate(announce.startDate)}</div>
                <div className="text-slate-500">{formatDisplayTime(announce.startTime)}</div>
              </TableCell>
              <TableCell className="text-slate-700">{announce.cityPray}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-slate-900">
                    {announce.participantsCount || 0}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="bg-slate-50 gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {0}
                </Badge>
              </TableCell>
              <TableCell>{getStatusBadge(announce)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(announce)}
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onExpire && !announce.expired && !announce.expiredAt && !announce.deletedAt && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onExpire(announce)}
                      title="Marquer comme expirée"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && !announce.deletedAt && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(announce)}
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
