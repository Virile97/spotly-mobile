import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/query/query-keys'
import { placesApi } from '@/features/places/api/places.api'
import type { NearbyPlacesParams } from '@/features/places/types/place.types'

export function useNearbyPlaces(params: NearbyPlacesParams | null) {
  return useQuery({
    queryKey: queryKeys.nearbyPlaces(params ?? undefined),
    queryFn: () => placesApi.getNearbyPlaces(params!),
    enabled: params !== null,
  })
}
