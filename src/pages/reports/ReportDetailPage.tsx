import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReport } from '@/api/queries/useReports';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  Monitor,
  MapPin,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { formatDisplayDateTime, getFullName } from '@/lib/utils';
import { ReportType } from '@/types/api.types';

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: report, isLoading } = useReport(id!);

  const getReportTypeBadge = (type: ReportType) => {
    const config: Record<ReportType, { variant: 'default' | 'destructive' | 'secondary' | 'outline'; label: string }> = {
      [ReportType.INAPPROPRIATE_CONTENT]: { variant: 'destructive', label: 'Contenu inapproprié' },
      [ReportType.INCORRECT_INFORMATION]: { variant: 'secondary', label: 'Information incorrecte' },
      [ReportType.SPAM]: { variant: 'outline', label: 'Spam' },
      [ReportType.OTHER]: { variant: 'outline', label: 'Autre' },
    };

    return (
      <Badge variant={config[type].variant} className="text-sm">
        {config[type].label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-slate-600">Signalement non trouvé</p>
        <Button onClick={() => navigate('/reports')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux signalements
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/reports')} className="hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Signalement #{report.id}
            </h1>
            <p className="text-slate-600 flex items-center gap-2 mt-1">
              <AlertTriangle className="h-4 w-4" />
              {report.resolved ? 'Résolu' : 'En attente de traitement'}
            </p>
          </div>
        </div>
        <div>
          {report.resolved ? (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg text-base px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Résolu
            </Badge>
          ) : (
            <Badge variant="destructive" className="shadow-lg text-base px-4 py-2">
              <XCircle className="h-4 w-4 mr-2" />
              Non résolu
            </Badge>
          )}
        </div>
      </div>

      {/* Main Info - 2 columns */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Report Information */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Informations du signalement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-sm font-semibold text-slate-900 mb-2">Type de signalement</p>
              {getReportTypeBadge(report.type)}
            </div>

            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-sm font-semibold text-slate-900 mb-2">Description</p>
              <p className="text-sm text-slate-600">
                {report.description || 'Aucune description fournie'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-sm font-semibold text-slate-900">Date du signalement</p>
              <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-slate-500" />
                {formatDisplayDateTime(report.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reporter Information */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Signalé par
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {report.reportedBy ? (
              <>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30">
                    {report.reportedBy.firstName?.charAt(0)}{report.reportedBy.lastName?.charAt(0)}
                  </div>
                  <div>
                    <Link
                      to={`/users/${report.reportedBy.id}`}
                      className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {getFullName(report.reportedBy.firstName, report.reportedBy.lastName)}
                    </Link>
                    <p className="text-sm text-slate-600">{report.reportedBy.email || 'Pas d\'email'}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-sm font-semibold text-slate-700">Utilisateur anonyme</p>
                <p className="text-xs text-slate-500">Non connecté</p>
              </div>
            )}

            {report.deviceId && (
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-slate-600" />
                  ID Appareil
                </p>
                <p className="text-xs font-mono text-slate-600 break-all">{report.deviceId}</p>
              </div>
            )}

            {report.ipAddress && (
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-600" />
                  Adresse IP
                </p>
                <p className="text-xs font-mono text-slate-600">{report.ipAddress}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Announce Information */}
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Annonce concernée
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-sm font-semibold text-slate-900 mb-1">Défunt</p>
              <Link
                to={`/announces/${report.announce.id}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                {getFullName(report.announce.firstName, report.announce.lastName)}
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-sm font-semibold text-slate-900 mb-1">Ville de prière</p>
              <p className="text-sm text-slate-600">{report.announce.cityPray}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-sm font-semibold text-slate-900 mb-1">Date de la prière</p>
              <p className="text-sm text-slate-600">{formatDisplayDateTime(report.announce.startDate)}</p>
            </div>
          </div>
          {report.announce.deletedAt && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100">
              <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-red-600">
                Annonce supprimée
              </Badge>
              <p className="text-sm text-slate-600 mt-1">
                Supprimée le {formatDisplayDateTime(report.announce.deletedAt)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolution Information */}
      {report.resolved && (
        <Card className="border-0 shadow-lg shadow-slate-200/50 border-l-4 border-l-green-500">
          <CardHeader className="border-b bg-gradient-to-r from-green-50 to-white">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Résolution du signalement
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <p className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Statut
              </p>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                Résolu
              </Badge>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Dernière mise à jour : {formatDisplayDateTime(report.updatedAt)}
              </p>
            </div>

            {report.adminNotes && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-600" />
                  Note de l'administrateur
                </p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{report.adminNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
