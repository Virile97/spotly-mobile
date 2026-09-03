import * as Location from 'expo-location'

export const locationService = {
  async requestPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync()
    return status === 'granted'
  },

  async getCurrentPosition() {
    const position = await Location.getCurrentPositionAsync({})
    return { latitude: position.coords.latitude, longitude: position.coords.longitude }
  },
}
