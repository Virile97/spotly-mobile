import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { formatDistanceKm } from '@/features/map/utils/route'
import type { Place } from '@/features/places/types/place.types'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface PlaceMapCardProps {
  place: Place
  onViewPlace: () => void
  onGetDirections: () => void
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function PlaceMapCard({ place, onViewPlace, onGetDirections }: PlaceMapCardProps) {
  const posts = place.postCount ?? 0
  const saves = place.saveCount ?? 0
  const score = place.communityScore ?? 0

  return (
    <View style={styles.card}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <View style={styles.thumb}>
          <Text style={styles.thumbEmoji}>{place.emoji ?? '📍'}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {place.name}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.badge, place.isOpenNow ? styles.badgeOpen : styles.badgeClosed]}>
              <View style={[styles.badgeDot, place.isOpenNow ? styles.dotOpen : styles.dotClosed]} />
              <Text style={styles.badgeText}>{place.isOpenNow ? 'OPEN' : 'CLOSED'}</Text>
            </View>
            {place.distanceKm != null ? (
              <Text style={styles.distance}>{formatDistanceKm(place.distanceKm)}</Text>
            ) : null}
          </View>
        </View>
      </View>

      <Text style={styles.stats}>
        <Text style={styles.statValue}>{formatCount(posts)}</Text> posts
        {'   '}
        <Text style={styles.statValue}>{formatCount(saves)}</Text> saves
        {'   '}
        <Text style={styles.statValue}>{score.toFixed(1)}</Text> community score
      </Text>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" style={styles.outlineButton} onPress={onViewPlace}>
          <Text style={styles.outlineLabel}>View Place</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={styles.filledButton} onPress={onGetDirections}>
          <Ionicons name="navigate" size={14} color={palette.black} />
          <Text style={styles.filledLabel}>Get Directions</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#17161A',
    borderRadius: 28,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  thumbEmoji: {
    fontSize: 26,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  name: {
    color: palette.white,
    fontSize: fontSize.lg,
    fontFamily: fontFamily.headline,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeOpen: {
    backgroundColor: 'rgba(34,197,94,0.18)',
  },
  badgeClosed: {
    backgroundColor: 'rgba(239,68,68,0.18)',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotOpen: {
    backgroundColor: palette.green500,
  },
  dotClosed: {
    backgroundColor: palette.red500,
  },
  badgeText: {
    color: palette.white,
    fontSize: 10,
    fontFamily: fontFamily.bodySemiBold,
    letterSpacing: 0.4,
  },
  distance: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  stats: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  statValue: {
    color: palette.white,
    fontFamily: fontFamily.bodySemiBold,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  outlineButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  outlineLabel: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  filledButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    borderRadius: radius.full,
    backgroundColor: palette.pink500,
  },
  filledLabel: {
    color: palette.black,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
})
