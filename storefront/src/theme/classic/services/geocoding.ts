interface GeocodeResult {
  address: string;
  lat: number;
  lng: number;
  formatted_address: string;
  place_id: string;
}

interface ReverseGeocodeResult {
  address: string;
  formatted_address: string;
  place_id: string;
}

// Declare google namespace for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

export class GeocodingService {
  private geocoder: any = null;

  constructor() {
    if (window.google && window.google.maps) {
      this.geocoder = new window.google.maps.Geocoder();
    }
  }

  // Search for addresses based on query
  async searchAddresses(query: string): Promise<GeocodeResult[]> {
    if (!this.geocoder) {
      throw new Error('Google Maps not loaded');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ address: query }, (results: any, status: any) => {
        if (status === 'OK' && results) {
          const addresses = results.map((result: any) => ({
            address: result.formatted_address,
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
            formatted_address: result.formatted_address,
            place_id: result.place_id
          }));
          resolve(addresses);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }

  // Get address from coordinates
  async reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult | null> {
    if (!this.geocoder) {
      throw new Error('Google Maps not loaded');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === 'OK' && results && results.length > 0) {
          const result = results[0];
          resolve({
            address: result.formatted_address,
            formatted_address: result.formatted_address,
            place_id: result.place_id
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  // Get current location using browser geolocation
  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }
}

export const geocodingService = new GeocodingService();







