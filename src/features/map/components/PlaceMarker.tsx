import { Marker } from 'react-native-maps'

import type { Place } from '@/features/places/types/place.types'

interface PlaceMarkerProps {
  place: Place
  onPress?: () => void
}

export function PlaceMarker({ place, onPress }: PlaceMarkerProps) {
  return (
    <Marker
      coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      title={place.name}
      description={place.address}
      onPress={onPress}
    />
  )
}
