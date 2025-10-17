import { useNavigate } from 'react-router-dom';
import { AnnounceForm, AnnounceFormValues, UpdateAnnounceFormValues } from '@/components/announces/AnnounceForm';
import { useCreateAnnounce, CreateAnnounceDto } from '@/api/mutations/useAnnounceMutations';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createIsoFromInputs } from '@/lib/utils';

export default function CreateAnnouncePage() {
  const navigate = useNavigate();
  const createMutation = useCreateAnnounce();

  const handleSubmit = async (data: AnnounceFormValues | UpdateAnnounceFormValues) => {
    // Pour la création, on doit avoir tous les champs requis (AnnounceFormValues)
    if (!('startDate' in data) || !('startTime' in data) || !('addressPray' in data)) {
      throw new Error('Données incomplètes pour créer une annonce');
    }
    const formData = data as AnnounceFormValues;
    // Préparer les données pour l'API
    const announceData: CreateAnnounceDto = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth ? createIsoFromInputs(formData.dateOfBirth, '00:00') : undefined,
      remarks: formData.remarks,
      addressPray: formData.addressPray,
      postCodePray: parseInt(formData.postCodePray),
      cityPray: formData.cityPray,
      countryPray: formData.countryPray,
      latitudePray: formData.latitudePray ? parseFloat(formData.latitudePray) : undefined,
      longitudePray: formData.longitudePray ? parseFloat(formData.longitudePray) : undefined,
      startDate: createIsoFromInputs(formData.startDate, formData.startTime),
      startTime: createIsoFromInputs(formData.startDate, formData.startTime),
      active: formData.active,
      hasForum: formData.hasForum,
    };

    // Ajouter les données d'enterrement si présentes
    if (formData.hasFuneralLocation && formData.addressFuneral) {
      announceData.addressFuneral = formData.addressFuneral;
      announceData.postCodeFuneral = formData.postCodeFuneral
        ? parseInt(formData.postCodeFuneral)
        : undefined;
      announceData.cityFuneral = formData.cityFuneral;
      announceData.countryFuneral = formData.countryFuneral;
      announceData.latitudeFuneral = formData.latitudeFuneral
        ? parseFloat(formData.latitudeFuneral)
        : undefined;
      announceData.longitudeFuneral = formData.longitudeFuneral
        ? parseFloat(formData.longitudeFuneral)
        : undefined;
      announceData.funeralDate = formData.funeralDate && formData.funeralTime ? createIsoFromInputs(formData.funeralDate, formData.funeralTime) : undefined;
      announceData.funeralTime = formData.funeralDate && formData.funeralTime ? createIsoFromInputs(formData.funeralDate, formData.funeralTime) : undefined;
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
