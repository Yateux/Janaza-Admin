import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Announce } from '@/types/api.types';
import {
  formatDisplayDateTime,
  formatDisplayDate,
  formatDisplayTime,
  getFullName,
  getGenderLabel,
} from '@/lib/utils';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Bell,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface AnnounceDetailsProps {
  announce: Announce;
}

export function AnnounceDetails({ announce }: AnnounceDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Deceased Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations du défunt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Nom complet</span>
              <p className="text-base mt-1">
                {getFullName(announce.firstName, announce.lastName)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Genre</span>
              <p className="text-base mt-1">
                <Badge variant="outline">{getGenderLabel(announce.gender)}</Badge>
              </p>
            </div>
            {announce.dateOfBirth && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Date de naissance</span>
                <p className="text-base mt-1">{formatDisplayDate(announce.dateOfBirth)}</p>
              </div>
            )}
          </div>
          {announce.remarks && (
            <>
              <Separator />
              <div>
                <span className="text-sm font-medium text-muted-foreground">Remarques</span>
                <p className="text-base mt-1 whitespace-pre-wrap">{announce.remarks}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Prayer Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Lieu de la prière
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Date</span>
              <p className="text-base mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDisplayDate(announce.startDate)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Heure</span>
              <p className="text-base mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatDisplayTime(announce.startTime)}
              </p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Adresse</span>
            <p className="text-base">{announce.addressPray}</p>
            <p className="text-base text-muted-foreground">
              {announce.postCodePray} {announce.cityPray}, {announce.countryPray}
            </p>
          </div>
          {announce.latitudePray && announce.longitudePray && (
            <div className="text-sm text-muted-foreground">
              Coordonnées: {announce.latitudePray}, {announce.longitudePray}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Funeral Location (if exists) */}
      {announce.addressFuneral && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Lieu de l'enterrement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announce.funeralDate && announce.funeralTime && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Date</span>
                  <p className="text-base mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDisplayDate(announce.funeralDate)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Heure</span>
                  <p className="text-base mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatDisplayTime(announce.funeralTime)}
                  </p>
                </div>
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Adresse</span>
              <p className="text-base">{announce.addressFuneral}</p>
              {announce.postCodeFuneral && announce.cityFuneral && (
                <p className="text-base text-muted-foreground">
                  {announce.postCodeFuneral} {announce.cityFuneral}, {announce.countryFuneral}
                </p>
              )}
            </div>
            {announce.latitudeFuneral && announce.longitudeFuneral && (
              <div className="text-sm text-muted-foreground">
                Coordonnées: {announce.latitudeFuneral}, {announce.longitudeFuneral}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Features & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Fonctionnalités et Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              {announce.hasForum ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">Forum activé</span>
            </div>
            <div className="flex items-center gap-2">
              {announce.active ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">Annonce active</span>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Notification envoyée</span>
              <span className="flex items-center gap-2">
                {announce.notificationSent ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {announce.notificationSentAt && formatDisplayDateTime(announce.notificationSentAt, 'DD/MM/YYYY à HH:mm')}
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                    Non
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Notification de localisation</span>
              <span className="flex items-center gap-2">
                {announce.locationNotificationSent ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {announce.locationNotificationSentAt &&
                      formatDisplayDateTime(announce.locationNotificationSentAt, 'DD/MM/YYYY à HH:mm')}
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                    Non
                  </>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Métadonnées système
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Date de création</span>
              <p className="text-base mt-1">{formatDisplayDateTime(announce.createdAt, 'DD/MM/YYYY à HH:mm')}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Dernière modification</span>
              <p className="text-base mt-1">{formatDisplayDateTime(announce.updatedAt, 'DD/MM/YYYY à HH:mm')}</p>
            </div>
            {announce.expiredAt && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Date d'expiration</span>
                <p className="text-base mt-1">{formatDisplayDateTime(announce.expiredAt, 'DD/MM/YYYY à HH:mm')}</p>
              </div>
            )}
            {announce.deletedAt && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Date de suppression</span>
                <p className="text-base mt-1">{formatDisplayDateTime(announce.deletedAt, 'DD/MM/YYYY à HH:mm')}</p>
              </div>
            )}
          </div>
          <Separator />
          <div>
            <span className="text-sm font-medium text-muted-foreground">ID de l'annonce</span>
            <p className="text-sm mt-1 font-mono text-muted-foreground">{announce.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
