import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { getMockPlace } from '@/features/places/data/mock-places'
import { getMockCollection } from '@/features/saved/data/mock-collections'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const CATEGORY_LABEL = {
  cafe: 'Café',
  food: 'Food',
  nature: 'Nature',
  other: 'Place',
} as const

export default function CollectionDetailScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>()
  const id = Array.isArray(collectionId) ? collectionId[0] : collectionId
  const collection = getMockCollection(id)

  if (!collection) return <ErrorState />

  const places = collection.placeIds
    .map((placeId) => getMockPlace(placeId))
    .filter((place): place is NonNullable<typeof place> => place != null)

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={palette.white} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>{collection.name}</Text>
          <Text style={styles.meta}>{collection.subtitle}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.lg }]}>
        {places.length === 0 ? (
          <Text style={styles.empty}>No places in this collection yet</Text>
        ) : (
          places.map((place) => (
            <Pressable
              key={place.id}
              accessibilityRole="button"
              style={styles.row}
              onPress={() => router.push(`/places/${place.id}`)}>
              {place.coverImageUrl ? (
                <Image source={{ uri: place.coverImageUrl }} style={styles.thumb} contentFit="cover" />
              ) : (
                <View style={styles.thumb} />
              )}
              <View style={styles.info}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeMeta}>
                  {CATEGORY_LABEL[place.category ?? 'other']}
                  {place.distanceKm != null ? ` · ${place.distanceKm} km` : ''}
                  {' · '}
                  <Text style={place.isOpenNow ? styles.open : styles.closed}>
                    {place.isOpenNow ? 'Open' : 'Closed'}
                  </Text>
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17161A',
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: palette.white,
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bodySemiBold,
  },
  meta: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: '#17161A',
  },
  info: {
    flex: 1,
  },
  placeName: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  placeMeta: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
  open: {
    color: palette.green500,
  },
  closed: {
    color: 'rgba(255,255,255,0.4)',
  },
  empty: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    paddingVertical: spacing.lg,
    textAlign: 'center',
  },
})
