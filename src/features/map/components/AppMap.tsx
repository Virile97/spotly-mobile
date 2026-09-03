import { StyleSheet } from 'react-native'
import MapView, { type MapViewProps } from 'react-native-maps'

export function AppMap(props: MapViewProps) {
  return <MapView style={styles.map} {...props} />
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
