import { Image } from 'expo-image'
import { StyleSheet, Text, View } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'
import type { Place } from '@/features/places/types/place.types'
import { PlaceStatus } from './PlaceStatus'

export function PlaceHeader({ place }: { place: Place }) {
  const { theme } = useAppTheme()

  return (
    <View>
      {place.coverImageUrl ? (
        <Image source={{ uri: place.coverImageUrl }} style={styles.cover} contentFit="cover" />
      ) : null}
      <View style={{ padding: theme.spacing.md }}>
        <Text style={{ color: theme.colors.text, fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold }}>
          {place.name}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.xs }}>{place.address}</Text>
        <View style={{ marginTop: theme.spacing.xs }}>
          <PlaceStatus isOpenNow={place.isOpenNow} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    height: 200,
  },
})
