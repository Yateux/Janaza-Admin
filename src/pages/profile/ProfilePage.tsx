import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { getFullName, formatDisplayDateTime } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Utilisateur non connecté</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
        <p className="text-muted-foreground">Informations de votre compte administrateur</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Nom complet</p>
              <p className="text-lg font-semibold text-slate-900">
                {getFullName(user.firstName, user.lastName)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Adresse email</p>
              <p className="text-base text-slate-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Rôle</p>
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 shadow-sm">
                <Shield className="h-3 w-3 mr-1" />
                Administrateur
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Informations du compte
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Date de création</p>
              <p className="text-base text-slate-700">{formatDisplayDateTime(user.createdAt)}</p>
            </div>
            {user.updatedAt && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Dernière mise à jour</p>
                <p className="text-base text-slate-700">{formatDisplayDateTime(user.updatedAt)}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Statut du compte</p>
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 shadow-sm">
                Actif
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
