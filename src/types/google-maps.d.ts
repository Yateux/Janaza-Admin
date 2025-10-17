/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  namespace google {
    namespace maps {
      class LatLng {
        lat(): number;
        lng(): number;
      }

      namespace places {
        class Autocomplete {
          constructor(input: HTMLInputElement, opts?: any);
          addListener(eventName: string, handler: () => void): any;
          getPlace(): {
            geometry?: {
              location: LatLng;
            };
            formatted_address?: string;
            address_components?: Array<{
              long_name: string;
              short_name: string;
              types: string[];
            }>;
          };
        }
      }

      namespace event {
        function removeListener(listener: any): void;
      }
    }
  }

  interface Window {
    google: typeof google;
  }
}

export {};
