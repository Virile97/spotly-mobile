import { apiClient } from '@/core/api/client'
import type { NearbyPlacesParams, Place, SearchPlacesParams } from '@/features/places/types/place.types'

export const placesApi = {
  getPlace: (placeId: string) => apiClient.get<Place>(`/places/${placeId}`).then((res) => res.data),

  getNearbyPlaces: (params: NearbyPlacesParams) =>
    apiClient.get<Place[]>('/places/nearby', { params }).then((res) => res.data),

  searchPlaces: (params: SearchPlacesParams) =>
    apiClient.get<Place[]>('/places/search', { params }).then((res) => res.data),
}
