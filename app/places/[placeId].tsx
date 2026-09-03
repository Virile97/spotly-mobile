import { useLocalSearchParams } from 'expo-router'

import { PlaceHeader } from '@/features/places/components/PlaceHeader'
import { usePlace } from '@/features/places/hooks/usePlace'
import { Screen } from '@/shared/components/layout/Screen'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { ErrorState } from '@/shared/components/feedback/ErrorState'

export default function PlaceDetailScreen() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>()
  const { data, isLoading, isError, refetch } = usePlace(placeId)

  return (
    <Screen scroll>
      {isLoading ? (
        <LoadingState />
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <PlaceHeader place={data} />
      )}
    </Screen>
  )
}
