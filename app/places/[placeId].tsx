import { useLocalSearchParams } from 'expo-router'

import { PlaceDetail } from '@/features/places/components/PlaceDetail'
import { useResolvedPlace } from '@/features/places/hooks/useResolvedPlace'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { getErrorMessage } from '@/shared/utils/error'

export default function PlaceDetailScreen() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>()
  const { place, isLoading, isError, error, refetch } = useResolvedPlace(placeId)

  if (isLoading) return <LoadingState />
  if (isError || !place) return <ErrorState onRetry={() => refetch()} message={getErrorMessage(error)} />

  return <PlaceDetail place={place} />
}
