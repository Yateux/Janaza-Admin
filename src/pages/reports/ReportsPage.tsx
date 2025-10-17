import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '@/api/queries/useReports';
import { ReportTable } from '@/components/reports/ReportTable';
import { ResolveDialog } from '@/components/reports/ResolveDialog';
import { AnnounceDeleteDialog } from '@/components/announces/AnnounceDeleteDialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportAnnounce, ReportType, Announce } from '@/types/api.types';
import { Search, Clock, CheckCircle, FileText } from 'lucide-react';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { data: allReports, isLoading } = useReports();

  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportAnnounce | null>(null);
  const [selectedAnnounce, setSelectedAnnounce] = useState<Announce | null>(null);

  const filteredReports = useMemo(() => {
    if (!allReports) return [];

    let reports = allReports;

    // Filter by tab (pending or all)
    if (activeTab === 'pending') {
      reports = reports.filter((report) => !report.resolved);
    }

    // Filter by search term (announce name or report description)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      reports = reports.filter((report) => {
        const matchesAnnounceName =
          report.announce.firstName?.toLowerCase().includes(searchLower) ||
          report.announce.lastName?.toLowerCase().includes(searchLower);
        const matchesDescription =
          report.description?.toLowerCase().includes(searchLower);
        return matchesAnnounceName || matchesDescription;
      });
    }

    // Filter by report type
    if (typeFilter !== 'all') {
      reports = reports.filter((report) => report.type === typeFilter);
    }

    return reports;
  }, [allReports, activeTab, searchTerm, typeFilter]);

  const handleViewAnnounce = (report: ReportAnnounce) => {
    navigate(`/announces/${report.announce.id}`);
  };

  const handleResolve = (report: ReportAnnounce) => {
    setSelectedReport(report);
    setResolveDialogOpen(true);
  };

  const handleDeleteAnnounce = (report: ReportAnnounce) => {
    setSelectedAnnounce(report.announce);
    setDeleteDialogOpen(true);
  };

  const handleResolveSuccess = () => {
    setResolveDialogOpen(false);
    setSelectedReport(null);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setSelectedAnnounce(null);
  };

  const stats = {
    total: allReports?.length || 0,
    pending: allReports?.filter((r) => !r.resolved).length || 0,
    resolved: allReports?.filter((r) => r.resolved).length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Signalements</h1>
          <p className="text-muted-foreground">
            Gérer les signalements d'annonces de la plateforme Janaza Jamaa
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2 text-slate-900">
              <FileText className="h-6 w-6 text-slate-600" />
              {stats.total}
            </div>
            <p className="text-sm text-slate-500">signalements</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2 text-orange-700">
              <Clock className="h-6 w-6 text-orange-600" />
              {stats.pending}
            </div>
            <p className="text-sm text-orange-600">à traiter</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700">Résolus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2 text-green-700">
              <CheckCircle className="h-6 w-6 text-green-600" />
              {stats.resolved}
            </div>
            <p className="text-sm text-green-600">traités</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2 h-11 bg-slate-100 border-0 shadow-inner">
          <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold">En attente</TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold">Tous</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-slate-900">Signalements en attente</CardTitle>
              <CardDescription>
                Signalements nécessitant une action administrative
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher par nom d'annonce ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[240px] h-11 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Type de signalement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value={ReportType.INAPPROPRIATE_CONTENT}>
                      Contenu inapproprié
                    </SelectItem>
                    <SelectItem value={ReportType.INCORRECT_INFORMATION}>
                      Information incorrecte
                    </SelectItem>
                    <SelectItem value={ReportType.SPAM}>Spam</SelectItem>
                    <SelectItem value={ReportType.OTHER}>Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ReportTable
                reports={filteredReports}
                loading={isLoading}
                onResolve={handleResolve}
                onViewAnnounce={handleViewAnnounce}
                onDeleteAnnounce={handleDeleteAnnounce}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-slate-900">Tous les signalements</CardTitle>
              <CardDescription>
                Historique complet de tous les signalements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher par nom d'annonce ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[240px] h-11 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Type de signalement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value={ReportType.INAPPROPRIATE_CONTENT}>
                      Contenu inapproprié
                    </SelectItem>
                    <SelectItem value={ReportType.INCORRECT_INFORMATION}>
                      Information incorrecte
                    </SelectItem>
                    <SelectItem value={ReportType.SPAM}>Spam</SelectItem>
                    <SelectItem value={ReportType.OTHER}>Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ReportTable
                reports={filteredReports}
                loading={isLoading}
                onResolve={handleResolve}
                onViewAnnounce={handleViewAnnounce}
                onDeleteAnnounce={handleDeleteAnnounce}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ResolveDialog
        report={selectedReport}
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
        onSuccess={handleResolveSuccess}
      />

      <AnnounceDeleteDialog
        announce={selectedAnnounce}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
