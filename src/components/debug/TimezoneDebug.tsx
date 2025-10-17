import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, Clock, Globe, MapPin } from 'lucide-react';
import { getTimezoneDebugInfo, type TimezoneDebugInfo } from '@/utils/timezoneService';

export function TimezoneDebug() {
  const [debugInfo, setDebugInfo] = useState<TimezoneDebugInfo | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpenDebug = () => {
    const info = getTimezoneDebugInfo();
    setDebugInfo(info);
    setOpen(true);

    // Log également dans la console pour faciliter le debug
    console.log('🐛 Timezone Debug Info:', info);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenDebug}
          className="gap-2"
        >
          <Bug className="h-4 w-4" />
          Debug Timezone
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-orange-600" />
            Informations de Timezone
          </DialogTitle>
          <DialogDescription>
            Informations détaillées sur le fuseau horaire du navigateur
          </DialogDescription>
        </DialogHeader>

        {debugInfo && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Timezone Détecté
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Timezone IANA</span>
                    <span className="font-mono font-semibold text-blue-700">
                      {debugInfo.timezone}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Offset UTC</span>
                    <span className="font-mono font-semibold text-blue-700">
                      {debugInfo.offset} ({debugInfo.offsetMinutes} minutes)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Heure d'été (DST)</span>
                    <span className={`font-semibold ${debugInfo.isDST ? 'text-green-700' : 'text-slate-700'}`}>
                      {debugInfo.isDST ? '✓ Actif' : '✗ Inactif'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  Date et Heure Actuelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                    <div className="text-xs text-purple-600 font-medium mb-1">
                      Heure UTC
                    </div>
                    <div className="font-mono text-lg font-bold text-purple-900">
                      {debugInfo.currentTimeUTC}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                    <div className="text-xs text-blue-600 font-medium mb-1">
                      Heure Locale ({debugInfo.timezone})
                    </div>
                    <div className="font-mono text-lg font-bold text-blue-900">
                      {debugInfo.currentTimeLocal}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-orange-600" />
                  Comment ça fonctionne ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-700">
                  <p className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">1.</span>
                    <span>
                      L'API envoie toutes les dates en <strong>UTC</strong> (format ISO)
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">2.</span>
                    <span>
                      L'admin détecte automatiquement le timezone du navigateur
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">3.</span>
                    <span>
                      Toutes les dates affichées sont converties vers le <strong>timezone local</strong>
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">4.</span>
                    <span>
                      Les dates des formulaires sont converties vers <strong>UTC</strong> avant envoi
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="text-xs text-slate-600 font-mono">
                💡 Ces informations ont également été loguées dans la console
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
