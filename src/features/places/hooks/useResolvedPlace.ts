import { getMockPlace } from '@/features/places/data/mock-places'
import { usePlace } from '@/features/places/hooks/usePlace'
import type { Place } from '@/features/places/types/place.types'

interface UseResolvedPlaceResult {
  place: Place | null
  isLoading: boolean
  isError: boolean
  error: unknown
  refetch: () => void
}

export function useResolvedPlace(placeId: string): UseResolvedPlaceResult {
  const mock = getMockPlace(placeId) ?? null
  const query = usePlace(mock ? '' : placeId)

  if (mock) {
    return { place: mock, isLoading: false, isError: false, error: null, refetch: () => undefined }
  }

  return {
    place: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      void query.refetch()
    },
  }
}
