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
import { Eye, CheckCircle, Trash2, FileText } from 'lucide-react';
import { ReportAnnounce, ReportType } from '@/types/api.types';
import { formatDisplayDateTime, getFullName, truncate } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ReportTableProps {
  reports: ReportAnnounce[];
  loading?: boolean;
  onResolve?: (report: ReportAnnounce) => void;
  onViewAnnounce?: (report: ReportAnnounce) => void;
  onDeleteAnnounce?: (report: ReportAnnounce) => void;
}

export function ReportTable({
  reports,
  loading,
  onResolve,
  onViewAnnounce,
  onDeleteAnnounce,
}: ReportTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun signalement trouvé
      </div>
    );
  }

  const getReportTypeBadge = (type: ReportType) => {
    const variants: Record<ReportType, 'default' | 'destructive' | 'secondary' | 'outline'> = {
      [ReportType.INAPPROPRIATE_CONTENT]: 'destructive',
      [ReportType.INCORRECT_INFORMATION]: 'secondary',
      [ReportType.SPAM]: 'outline',
      [ReportType.OTHER]: 'outline',
    };

    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  const getStatusBadge = (resolved: boolean) => {
    if (resolved) {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Résolu
        </Badge>
      );
    }
    return <Badge variant="destructive">En attente</Badge>;
  };

  return (
    <>
      {/* Vue Desktop - Table classique */}
      <div className="hidden lg:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Annonce</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="max-w-[200px]">Description</TableHead>
              <TableHead>Signalé par</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  <Link
                    to={`/announces/${report.announce.id}`}
                    className="hover:underline text-primary"
                  >
                    {getFullName(
                      report.announce.firstName,
                      report.announce.lastName
                    )}
                  </Link>
                </TableCell>
                <TableCell>{getReportTypeBadge(report.type)}</TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="text-sm text-muted-foreground">
                    {report.description
                      ? truncate(report.description, 50)
                      : '-'}
                  </div>
                </TableCell>
                <TableCell>
                  {report.reportedBy
                    ? getFullName(
                        report.reportedBy.firstName,
                        report.reportedBy.lastName
                      )
                    : 'Anonyme'}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDisplayDateTime(report.createdAt, 'DD/MM/YYYY à HH:mm')}
                </TableCell>
                <TableCell>{getStatusBadge(report.resolved)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/reports/${report.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Voir le signalement"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    {onViewAnnounce && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewAnnounce(report)}
                        title="Voir l'annonce"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                    {onResolve && !report.resolved && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onResolve(report)}
                        title="Résoudre le signalement"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    {onDeleteAnnounce && !report.announce.deletedAt && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteAnnounce(report)}
                        title="Supprimer l'annonce"
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

      {/* Vue Mobile - Cards */}
      <div className="lg:hidden space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-lg shadow-slate-200/50 p-4 space-y-3 border">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/announces/${report.announce.id}`}
                  className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block truncate"
                >
                  {getFullName(report.announce.firstName, report.announce.lastName)}
                </Link>
                <p className="text-sm text-slate-600 truncate">
                  {report.reportedBy
                    ? getFullName(report.reportedBy.firstName, report.reportedBy.lastName)
                    : 'Anonyme'}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Link to={`/reports/${report.id}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Voir le signalement"
                    className="h-8 w-8"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                {onViewAnnounce && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewAnnounce(report)}
                    title="Voir l'annonce"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {getReportTypeBadge(report.type)}
              {getStatusBadge(report.resolved)}
            </div>

            {report.description && (
              <p className="text-sm text-slate-600 line-clamp-2">
                {report.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <p className="text-xs text-slate-500">
                {formatDisplayDateTime(report.createdAt, 'DD/MM/YYYY à HH:mm')}
              </p>
              <div className="flex gap-1">
                {onResolve && !report.resolved && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResolve(report)}
                    className="h-7 text-xs"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Résoudre
                  </Button>
                )}
                {onDeleteAnnounce && !report.announce.deletedAt && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteAnnounce(report)}
                    className="h-7 text-xs text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Supprimer
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
