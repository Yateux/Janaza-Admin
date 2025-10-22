import { usePushTokens } from '@/api/queries/useNotifications';
import { useDeletePushToken } from '@/api/mutations/useNotificationMutations';
import { SendNotificationForm } from '@/components/notifications/SendNotificationForm';
import { NotificationHistory } from '@/components/notifications/NotificationHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Send, Users, History } from 'lucide-react';

export default function NotificationsPage() {
  const { data: pushTokens, isLoading: tokensLoading } = usePushTokens();
  const deletePushToken = useDeletePushToken();

  const handleDeleteToken = (deviceId: string) => {
    deletePushToken.mutate({ deviceId });
  };

  const devicesCount = pushTokens?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications Push</h1>
          <p className="text-muted-foreground">
            Gérer les notifications push et les tokens des appareils
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
              <Bell className="h-5 w-5 text-blue-600" />
              Total Appareils
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{devicesCount}</div>
            <p className="text-sm text-blue-600">appareils enregistrés</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
              <Users className="h-5 w-5 text-green-600" />
              Utilisateurs Connectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {pushTokens?.filter((t) => t.userId).length || 0}
            </div>
            <p className="text-sm text-green-600">avec compte utilisateur</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <History className="h-5 w-5 text-slate-600" />
              Anonymes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-700">
              {pushTokens?.filter((t) => !t.userId).length || 0}
            </div>
            <p className="text-sm text-slate-600">sans compte utilisateur</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="user" className="space-y-4">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 h-11 bg-slate-100 border-0 shadow-inner">
          <TabsTrigger value="user" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold flex items-center gap-2">
            <Send className="h-4 w-4" />
            Utilisateur
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tous
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-slate-900">Envoyer à un Utilisateur</CardTitle>
              <CardDescription>
                Envoyer une notification push à un utilisateur spécifique
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SendNotificationForm mode="user" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-slate-900">Diffusion à Tous</CardTitle>
              <CardDescription>
                Envoyer une notification push à tous les utilisateurs enregistrés
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
                <p className="text-sm text-amber-900">
                  <strong>Attention :</strong> Cette notification sera envoyée à {devicesCount} appareil{devicesCount > 1 ? 's' : ''}.
                  Veuillez vérifier le contenu avant d'envoyer.
                </p>
              </div>
              <SendNotificationForm mode="all" devicesCount={devicesCount} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-slate-900">Historique des Tokens</CardTitle>
              <CardDescription>
                Liste de tous les tokens push enregistrés et leurs informations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <NotificationHistory
                tokens={pushTokens || []}
                loading={tokensLoading}
                onDelete={handleDeleteToken}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
