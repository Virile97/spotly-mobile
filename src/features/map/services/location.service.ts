import * as Location from 'expo-location'

export interface Coordinates {
  latitude: number
  longitude: number
  heading: number | null
}

function toCoords(position: Location.LocationObject): Coordinates {
  const heading = position.coords.heading
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    heading: heading != null && heading >= 0 ? heading : null,
  }
}

export const locationService = {
  async requestPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync()
    return status === 'granted'
  },

  async getCurrentPosition() {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    })
    return toCoords(position)
  },

  watchPosition(onChange: (coords: Coordinates) => void) {
    return Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 2,
      },
      (position) => {
        onChange(toCoords(position))
      }
    )
  },

  watchHeading(onChange: (heading: number) => void) {
    return Location.watchHeadingAsync((heading) => {
      const next = heading.trueHeading >= 0 ? heading.trueHeading : heading.magHeading
      if (next >= 0) onChange(next)
    })
  },
}
