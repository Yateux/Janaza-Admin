import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnnounces, useAllAnnounces } from '@/api/queries/useAnnounces';
import { AnnounceTable } from '@/components/announces/AnnounceTable';
import { ExpireDialog } from '@/components/announces/ExpireDialog';
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
import { Announce } from '@/types/api.types';
import { Search, CheckCircle, XCircle, Archive, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnnouncesPage() {
  const navigate = useNavigate();
  const { data: activeAnnounces, isLoading: activeLoading } = useAnnounces();
  const { data: allAnnounces, isLoading: allLoading } = useAllAnnounces();

  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('startDate-desc');

  const [expireDialogOpen, setExpireDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnounce, setSelectedAnnounce] = useState<Announce | null>(null);

  const currentData = activeTab === 'active' ? activeAnnounces : allAnnounces;
  const isLoading = activeTab === 'active' ? activeLoading : allLoading;

  const filteredAnnounces = useMemo(() => {
    if (!currentData) return [];

    // Filter
    const filtered = currentData.filter((announce) => {
      // Search filter (name, city)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        announce.firstName?.toLowerCase().includes(searchLower) ||
        announce.lastName?.toLowerCase().includes(searchLower) ||
        announce.cityPray.toLowerCase().includes(searchLower);

      // Gender filter
      const matchesGender = genderFilter === 'all' || announce.gender === genderFilter;

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' &&
          announce.active &&
          !announce.expired &&
          !announce.deletedAt) ||
        (statusFilter === 'expired' && (announce.expired || announce.expiredAt)) ||
        (statusFilter === 'deleted' && !!announce.deletedAt);

      return matchesSearch && matchesGender && matchesStatus;
    });

    // Sort
    const [sortField, sortOrder] = sortBy.split('-');
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      if (sortField === 'startDate') {
        aValue = a.startDate;
        bValue = b.startDate;
      } else if (sortField === 'createdAt') {
        aValue = a.createdAt;
        bValue = b.createdAt;
      } else {
        return 0;
      }

      const comparison = new Date(aValue).getTime() - new Date(bValue).getTime();

      // Pour startDate:
      //   - "récent" (desc) = dates les plus proches en premier (10/05/2025 avant 10/05/2026) = ordre croissant
      //   - "ancien" (asc) = dates les plus lointaines en premier (10/05/2026 avant 10/05/2025) = ordre décroissant
      // Pour createdAt:
      //   - "récent" (desc) = créées récemment en premier = ordre décroissant
      //   - "ancien" (asc) = créées il y a longtemps en premier = ordre croissant

      if (sortField === 'startDate') {
        // Pour startDate, inverser la logique desc/asc
        return sortOrder === 'desc' ? comparison : -comparison;
      } else {
        // Pour createdAt, logique normale
        return sortOrder === 'desc' ? -comparison : comparison;
      }
    });

    return filtered;
  }, [currentData, searchTerm, genderFilter, statusFilter, sortBy]);

  const handleView = (announce: Announce) => {
    navigate(`/announces/${announce.id}`);
  };

  const handleExpire = (announce: Announce) => {
    setSelectedAnnounce(announce);
    setExpireDialogOpen(true);
  };

  const handleDelete = (announce: Announce) => {
    setSelectedAnnounce(announce);
    setDeleteDialogOpen(true);
  };

  const handleExpireSuccess = () => {
    setExpireDialogOpen(false);
    setSelectedAnnounce(null);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setSelectedAnnounce(null);
  };

  const stats = {
    total: allAnnounces?.length || 0,
    active: allAnnounces?.filter((a) => a.active && !a.expired && !a.deletedAt).length || 0,
    expired: allAnnounces?.filter((a) => a.expired || a.expiredAt).length || 0,
    deleted: allAnnounces?.filter((a) => !!a.deletedAt).length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Annonces</h1>
          <p className="text-muted-foreground">
            Gérer les annonces de décès de la plateforme Janaza Jamaa
          </p>
        </div>
        <Button
          onClick={() => navigate('/announces/new')}
          size="lg"
          className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Nouvelle Annonce
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-sm text-slate-500">annonces</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700">Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2 text-green-700">
              <CheckCircle className="h-6 w-6 text-green-600" />
              {stats.active}
            </div>
            <p className="text-sm text-green-600">annonces actives</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700">Expirées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2 text-slate-700">
              <Archive className="h-6 w-6 text-slate-600" />
              {stats.expired}
            </div>
            <p className="text-sm text-slate-600">annonces expirées</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-red-50 to-rose-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700">Supprimées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2 text-red-700">
              <XCircle className="h-6 w-6 text-red-600" />
              {stats.deleted}
            </div>
            <p className="text-sm text-red-600">annonces supprimées</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2 h-11 bg-slate-100 border-0 shadow-inner">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold"
          >
            Actives
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold"
          >
            Toutes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-slate-900">Annonces actives</CardTitle>
              <CardDescription>Annonces actuellement visibles sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher par nom ou ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  />
                </div>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="w-full md:w-[180px] h-11 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les genres</SelectItem>
                    <SelectItem value="M">Homme</SelectItem>
                    <SelectItem value="F">Femme</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] h-11 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actives</SelectItem>
                    <SelectItem value="expired">Expirées</SelectItem>
                    <SelectItem value="deleted">Supprimées</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[220px] h-11 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startDate-desc">Date prière (récent)</SelectItem>
                    <SelectItem value="startDate-asc">Date prière (ancien)</SelectItem>
                    <SelectItem value="createdAt-desc">Date création (récent)</SelectItem>
                    <SelectItem value="createdAt-asc">Date création (ancien)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AnnounceTable
                announces={filteredAnnounces}
                loading={isLoading}
                onView={handleView}
                onExpire={handleExpire}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-slate-900">Toutes les annonces</CardTitle>
              <CardDescription>Historique complet de toutes les annonces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher par nom ou ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  />
                </div>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="w-full md:w-[180px] h-11 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les genres</SelectItem>
                    <SelectItem value="M">Homme</SelectItem>
                    <SelectItem value="F">Femme</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] h-11 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actives</SelectItem>
                    <SelectItem value="expired">Expirées</SelectItem>
                    <SelectItem value="deleted">Supprimées</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[220px] h-11 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startDate-desc">Date prière (récent)</SelectItem>
                    <SelectItem value="startDate-asc">Date prière (ancien)</SelectItem>
                    <SelectItem value="createdAt-desc">Date création (récent)</SelectItem>
                    <SelectItem value="createdAt-asc">Date création (ancien)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AnnounceTable
                announces={filteredAnnounces}
                loading={isLoading}
                onView={handleView}
                onExpire={handleExpire}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ExpireDialog
        announce={selectedAnnounce}
        open={expireDialogOpen}
        onOpenChange={setExpireDialogOpen}
        onSuccess={handleExpireSuccess}
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
