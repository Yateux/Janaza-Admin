import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReportAnnounce, ReportType } from '@/types/api.types';
import { formatDisplayDateTime, getFullName } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  User,
  Calendar,
  FileText,
  Monitor,
  MapPin,
  CheckCircle,
} from 'lucide-react';

interface ReportDetailsProps {
  report: ReportAnnounce;
}

export function ReportDetails({ report }: ReportDetailsProps) {
  const getReportTypeBadge = (type: ReportType) => {
    const variants: Record<ReportType, 'default' | 'destructive' | 'secondary' | 'outline'> = {
      [ReportType.INAPPROPRIATE_CONTENT]: 'destructive',
      [ReportType.INCORRECT_INFORMATION]: 'secondary',
      [ReportType.SPAM]: 'outline',
      [ReportType.OTHER]: 'outline',
    };

    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Informations du signalement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Type</span>
              </div>
              <div>{getReportTypeBadge(report.type)}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Statut</span>
              </div>
              <div>
                {report.resolved ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    Résolu
                  </Badge>
                ) : (
                  <Badge variant="destructive">En attente</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">Signalé par</span>
              </div>
              <div className="text-sm">
                {report.reportedBy
                  ? getFullName(
                      report.reportedBy.firstName,
                      report.reportedBy.lastName
                    )
                  : 'Anonyme'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Date du signalement</span>
              </div>
              <div className="text-sm">{formatDisplayDateTime(report.createdAt)}</div>
            </div>
          </div>

          {report.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Description</span>
              </div>
              <div className="rounded-lg border p-3 bg-muted/50 text-sm">
                {report.description}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {report.deviceId && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Monitor className="h-4 w-4" />
                  <span className="font-medium">ID Appareil</span>
                </div>
                <div className="text-sm font-mono text-muted-foreground">
                  {report.deviceId}
                </div>
              </div>
            )}

            {report.ipAddress && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Adresse IP</span>
                </div>
                <div className="text-sm font-mono text-muted-foreground">
                  {report.ipAddress}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Annonce concernée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium">Défunt: </span>
              <Link
                to={`/announces/${report.announce.id}`}
                className="text-sm text-primary hover:underline"
              >
                {getFullName(
                  report.announce.firstName,
                  report.announce.lastName
                )}
              </Link>
            </div>
            <div>
              <span className="text-sm font-medium">Ville de prière: </span>
              <span className="text-sm text-muted-foreground">
                {report.announce.cityPray}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium">Date de la prière: </span>
              <span className="text-sm text-muted-foreground">
                {formatDisplayDateTime(report.announce.startDate)}
              </span>
            </div>
            {report.announce.deletedAt && (
              <div>
                <Badge variant="destructive">Annonce supprimée</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {report.resolved && report.adminNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Notes de résolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-3 bg-muted/50 text-sm">
              {report.adminNotes}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Résolu le {formatDisplayDateTime(report.updatedAt)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
