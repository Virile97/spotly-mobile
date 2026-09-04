import { useLocalSearchParams } from 'expo-router'

import { PlaceDetail } from '@/features/places/components/PlaceDetail'
import { useResolvedPlace } from '@/features/places/hooks/useResolvedPlace'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { LoadingState } from '@/shared/components/feedback/LoadingState'

export default function PlaceDetailScreen() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>()
  const { place, isLoading, isError, refetch } = useResolvedPlace(placeId)

  if (isLoading) return <LoadingState />
  if (isError || !place) return <ErrorState onRetry={() => refetch()} />

  return <PlaceDetail place={place} />
}
