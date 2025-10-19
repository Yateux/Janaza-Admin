import { useUsers } from '@/api/queries/useUsers';
import { useAllAnnounces } from '@/api/queries/useAnnounces';
import { useReports } from '@/api/queries/useReports';
import { useRecentComments } from '@/api/queries/useComments';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  MessageSquare,
  AlertTriangle,
  MessageCircle,
  ShieldAlert,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { formatRelativeDate, getFullName } from '@/lib/utils';
import { Link } from 'react-router-dom';
import dayjs from '@/lib/dayjs';

export default function DashboardPage() {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: announces, isLoading: announcesLoading } = useAllAnnounces();
  const { data: reports, isLoading: reportsLoading } = useReports();
  const { data: recentComments, isLoading: commentsLoading } = useRecentComments(5);

  const stats = {
    totalUsers: users?.length || 0,
    activeUsers: users?.filter((u) => !u.deletedAt).length || 0,
    totalAnnounces: announces?.length || 0,
    activeAnnounces: announces?.filter((a) => a.active && !a.expired && !a.deletedAt).length || 0,
    expiredAnnounces: announces?.filter((a) => a.expired).length || 0,
    totalComments: 0, // On pourrait calculer ça si on avait tous les commentaires
    pendingReports: reports?.filter((r) => !r.resolved).length || 0,
    resolvedReports: reports?.filter((r) => r.resolved).length || 0,
  };

  const recentAnnounces = announces
    ?.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
    .slice(0, 5);

  const recentUsers = users
    ?.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
    .slice(0, 5);

  const recentReports = reports
    ?.filter((report) => !report.resolved) // Filtrer les signalements non résolus
    ?.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
    .slice(0, 5);

  if (usersLoading || announcesLoading || reportsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Tableau de bord</h1>
        <p className="text-sm sm:text-base text-slate-600">Vue d'ensemble de la plateforme Janaza Jamaa</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Utilisateurs"
          value={stats.activeUsers}
          description={`${stats.totalUsers} au total`}
          icon={Users}
          gradient="blue"
        />
        <StatsCard
          title="Annonces"
          value={stats.activeAnnounces}
          description={`${stats.expiredAnnounces} expirées`}
          icon={MessageSquare}
          gradient="green"
        />
        <StatsCard
          title="Commentaires"
          value={recentComments?.length || 0}
          description="Commentaires récents"
          icon={MessageCircle}
          gradient="purple"
        />
        <StatsCard
          title="Signalements"
          value={stats.pendingReports}
          description={`${stats.resolvedReports} résolus`}
          icon={AlertTriangle}
          gradient="orange"
        />
      </div>

      {/* Quick Actions & Activity Timeline */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Activité Récente
                  </CardTitle>
                  <CardDescription>Derniers événements de la plateforme</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Recent Announces */}
                {recentAnnounces?.slice(0, 3).map((announce) => (
                  <div key={announce.id} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/30 border border-green-100/50 hover:shadow-md transition-all">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-green-500/30 flex-shrink-0">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">Nouvelle annonce</p>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600">Annonce</Badge>
                      </div>
                      <Link to={`/announces/${announce.id}`} className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                        {getFullName(announce.firstName, announce.lastName)} - {announce.cityPray}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">{formatRelativeDate(announce.createdAt)}</p>
                    </div>
                  </div>
                ))}

                {/* Recent Users */}
                {recentUsers?.slice(0, 2).map((user) => (
                  <div key={user.id} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border border-blue-100/50 hover:shadow-md transition-all">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30 flex-shrink-0">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">Nouvel utilisateur</p>
                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600">Utilisateur</Badge>
                      </div>
                      <Link to={`/users/${user.id}`} className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                        {getFullName(user.firstName, user.lastName)}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">{formatRelativeDate(user.createdAt)}</p>
                    </div>
                  </div>
                ))}

                {/* Recent Reports */}
                {recentReports?.slice(0, 2).map((report) => (
                  <div key={report.id} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-red-50/50 to-rose-50/30 border border-red-100/50 hover:shadow-md transition-all">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 flex-shrink-0">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">Nouveau signalement</p>
                        <Badge variant="destructive">Signalement</Badge>
                      </div>
                      <Link to={`/announces/${report.announce.id}`} className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                        {getFullName(report.announce.firstName, report.announce.lastName)} - {report.type}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">{formatRelativeDate(report.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats Card */}
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <p className="text-sm font-medium text-blue-100">Tendances</p>
                  </div>
                  <p className="text-3xl font-bold">{stats.activeAnnounces}</p>
                  <p className="text-sm text-blue-100">Annonces actives</p>
                </div>
                <div className="h-px bg-white/20" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{stats.activeUsers}</p>
                    <p className="text-xs text-blue-100">Utilisateurs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingReports}</p>
                    <p className="text-xs text-blue-100">À traiter</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Latest Users */}
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white pb-4">
              <CardTitle className="text-slate-900 text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Derniers Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {recentUsers?.slice(0, 5).map((user) => (
                  <Link
                    key={user.id}
                    to={`/users/${user.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow-lg shadow-blue-500/30">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {getFullName(user.firstName, user.lastName)}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email || 'Pas d\'email'}</p>
                    </div>
                    {user.roles === 'admin' && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-xs">Admin</Badge>
                    )}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Latest Comments */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              Derniers Commentaires
            </CardTitle>
            <CardDescription>Interactions récentes sur les annonces</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {commentsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : !recentComments || recentComments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Aucun commentaire récent</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentComments.slice(0, 5).map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-indigo-50/30 border border-purple-100/50 hover:shadow-md transition-all"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow-lg shadow-purple-500/30 flex-shrink-0">
                      {comment.user.firstName?.charAt(0)}{comment.user.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/announces/${comment.announce.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block truncate text-sm"
                      >
                        {getFullName(comment.user.firstName, comment.user.lastName)}
                      </Link>
                      <p className="text-xs text-slate-500 truncate">{comment.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatRelativeDate(comment.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Reports */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-orange-600" />
              Signalements en Attente
            </CardTitle>
            <CardDescription>Signalements nécessitant votre attention</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {!recentReports || recentReports.filter(r => !r.resolved).length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-10 w-10 text-green-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Tous les signalements sont traités</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.filter(r => !r.resolved).slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50/50 to-red-50/30 border border-orange-100/50 hover:shadow-md transition-all"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 flex-shrink-0">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/announces/${report.announce.id}`}
                          className="font-semibold text-slate-900 hover:text-blue-600 transition-colors truncate text-sm"
                        >
                          {getFullName(report.announce.firstName, report.announce.lastName)}
                        </Link>
                        <Badge variant="destructive" className="text-xs">En attente</Badge>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{report.type}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatRelativeDate(report.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
