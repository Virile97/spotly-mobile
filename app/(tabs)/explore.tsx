import { useLocalSearchParams } from 'expo-router'

import { PlaceMapView } from '@/features/map/components/PlaceMapView'

export default function ExploreScreen() {
  const { placeId } = useLocalSearchParams<{ placeId?: string }>()

  const resolvedId = typeof placeId === 'string' ? placeId : placeId?.[0]

  return <PlaceMapView key={resolvedId ?? 'explore'} initialPlaceId={resolvedId} />
}
