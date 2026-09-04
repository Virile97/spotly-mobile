import { forwardRef } from 'react'
import { StyleSheet } from 'react-native'
import MapView, { type MapViewProps } from 'react-native-maps'

export const AppMap = forwardRef<MapView, MapViewProps>(function AppMap(props, ref) {
  return <MapView ref={ref} style={styles.map} {...props} />
})

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
