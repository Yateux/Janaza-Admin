import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AddressDetails {
  address_format: string;
  post_code: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  placeholder?: string;
  onSelect: (addressDetails: AddressDetails) => void;
  value?: string;
  className?: string;
}

export function AddressAutocomplete({
  placeholder = 'Rechercher une adresse',
  onSelect,
  value = '',
  className,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!inputRef.current) return;

    // Initialiser l'autocomplete Google Places
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'fr' },
    });

    autocompleteRef.current = autocomplete;

    // Écouter l'événement de sélection d'une adresse
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.error('Aucune géométrie trouvée pour cette adresse');
        return;
      }

      const addressComponents = place.address_components || [];

      const getAddressComponent = (type: string): string => {
        const component = addressComponents.find((c) => c.types.includes(type));
        return component?.long_name || '';
      };

      const addressDetails: AddressDetails = {
        address_format: place.formatted_address || '',
        post_code: getAddressComponent('postal_code'),
        city: getAddressComponent('locality'),
        country: getAddressComponent('country'),
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };

      setQuery(place.formatted_address || '');
      onSelect(addressDetails);
    });

    // Nettoyage
    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [onSelect]);

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
