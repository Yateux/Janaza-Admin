import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpiredAnnounces } from '@/api/queries/useAnnounces';
import { AnnounceTable } from '@/components/announces/AnnounceTable';
import { AnnounceDeleteDialog } from '@/components/announces/AnnounceDeleteDialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Announce } from '@/types/api.types';
import { Search, Archive } from 'lucide-react';

export default function ExpiredAnnouncesPage() {
  const navigate = useNavigate();
  const { data: expiredAnnounces, isLoading } = useExpiredAnnounces();

  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnounce, setSelectedAnnounce] = useState<Announce | null>(null);

  const filteredAnnounces = useMemo(() => {
    if (!expiredAnnounces) return [];

    return expiredAnnounces.filter((announce) => {
      // Search filter (name, city)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        announce.firstName?.toLowerCase().includes(searchLower) ||
        announce.lastName?.toLowerCase().includes(searchLower) ||
        announce.cityPray.toLowerCase().includes(searchLower);

      // Gender filter
      const matchesGender = genderFilter === 'all' || announce.gender === genderFilter;

      return matchesSearch && matchesGender;
    });
  }, [expiredAnnounces, searchTerm, genderFilter]);

  const handleView = (announce: Announce) => {
    navigate(`/announces/${announce.id}`);
  };

  const handleDelete = (announce: Announce) => {
    setSelectedAnnounce(announce);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setSelectedAnnounce(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Archive className="h-8 w-8" />
            Annonces expirées
          </h1>
          <p className="text-muted-foreground">
            Annonces qui ont atteint leur date d'expiration
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total expirées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredAnnounces?.length || 0}</div>
            <p className="text-xs text-muted-foreground">annonces expirées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Non supprimées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expiredAnnounces?.filter((a) => !a.deletedAt).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">annonces encore visibles pour admin</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des annonces expirées</CardTitle>
          <CardDescription>
            Rechercher et gérer les annonces expirées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les genres</SelectItem>
                <SelectItem value="M">Homme</SelectItem>
                <SelectItem value="F">Femme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AnnounceTable
            announces={filteredAnnounces}
            loading={isLoading}
            onView={handleView}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <AnnounceDeleteDialog
        announce={selectedAnnounce}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
