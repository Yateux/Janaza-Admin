import { useNavigate } from 'react-router-dom';
import { AnnounceForm } from '@/components/announces/AnnounceForm';
import { useCreateAnnounce, CreateAnnounceDto } from '@/api/mutations/useAnnounceMutations';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createIsoFromInputs } from '@/lib/utils';

export default function CreateAnnouncePage() {
  const navigate = useNavigate();
  const createMutation = useCreateAnnounce();

  const handleSubmit = async (data: {
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';
    dateOfBirth?: string;
    remarks?: string;
    addressPray: string;
    postCodePray: string;
    cityPray: string;
    countryPray: string;
    latitudePray?: string;
    longitudePray?: string;
    startDate: string;
    startTime: string;
    hasFuneralLocation?: boolean;
    addressFuneral?: string;
    postCodeFuneral?: string;
    cityFuneral?: string;
    countryFuneral?: string;
    latitudeFuneral?: string;
    longitudeFuneral?: string;
    funeralDate?: string;
    funeralTime?: string;
    active?: boolean;
    hasForum?: boolean;
  }) => {
    // Préparer les données pour l'API
    const announceData: CreateAnnounceDto = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth ? createIsoFromInputs(data.dateOfBirth, '00:00') : undefined,
      remarks: data.remarks,
      addressPray: data.addressPray,
      postCodePray: parseInt(data.postCodePray),
      cityPray: data.cityPray,
      countryPray: data.countryPray,
      latitudePray: data.latitudePray ? parseFloat(data.latitudePray) : undefined,
      longitudePray: data.longitudePray ? parseFloat(data.longitudePray) : undefined,
      startDate: createIsoFromInputs(data.startDate, data.startTime),
      startTime: createIsoFromInputs(data.startDate, data.startTime),
      active: data.active,
      hasForum: data.hasForum,
    };

    // Ajouter les données d'enterrement si présentes
    if (data.hasFuneralLocation && data.addressFuneral) {
      announceData.addressFuneral = data.addressFuneral;
      announceData.postCodeFuneral = data.postCodeFuneral
        ? parseInt(data.postCodeFuneral)
        : undefined;
      announceData.cityFuneral = data.cityFuneral;
      announceData.countryFuneral = data.countryFuneral;
      announceData.latitudeFuneral = data.latitudeFuneral
        ? parseFloat(data.latitudeFuneral)
        : undefined;
      announceData.longitudeFuneral = data.longitudeFuneral
        ? parseFloat(data.longitudeFuneral)
        : undefined;
      announceData.funeralDate = data.funeralDate && data.funeralTime ? createIsoFromInputs(data.funeralDate, data.funeralTime) : undefined;
      announceData.funeralTime = data.funeralDate && data.funeralTime ? createIsoFromInputs(data.funeralDate, data.funeralTime) : undefined;
    }

    await createMutation.mutateAsync(announceData);
    navigate('/announces');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/announces')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Créer une Annonce</h1>
          <p className="text-muted-foreground">
            Publier une nouvelle annonce de décès sur la plateforme
          </p>
        </div>
      </div>

      <AnnounceForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
    </div>
  );
}
