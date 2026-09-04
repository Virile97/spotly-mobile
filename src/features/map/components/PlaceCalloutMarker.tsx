import { StyleSheet, Text, View } from 'react-native'
import { Marker } from 'react-native-maps'

import type { Place } from '@/features/places/types/place.types'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface PlaceCalloutMarkerProps {
  place: Place
}

export function PlaceCalloutMarker({ place }: PlaceCalloutMarkerProps) {
  return (
    <Marker
      coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false}>
      <View style={styles.wrap}>
        <View style={styles.bubble}>
          <Text style={styles.emoji}>{place.emoji ?? '📍'}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {place.name}
          </Text>
        </View>
        <View style={styles.tip} />
      </View>
    </Marker>
  )
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: 180,
    backgroundColor: palette.pink500,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  emoji: {
    fontSize: 14,
  },
  name: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  tip: {
    width: 10,
    height: 10,
    marginTop: -5,
    backgroundColor: palette.pink500,
    transform: [{ rotate: '45deg' }],
  },
})
