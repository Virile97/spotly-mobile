export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isOpenNow: boolean;
  coverImageUrl: string | null;
}

export interface NearbyPlacesParams {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
}

export interface SearchPlacesParams {
  query: string;
}
