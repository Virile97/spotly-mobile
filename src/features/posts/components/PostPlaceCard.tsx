import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import type { Post } from '@/features/posts/types/post.types'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface PostPlaceCardProps {
  post: Post
}

export function PostPlaceCard({ post }: PostPlaceCardProps) {
  const router = useRouter()

  if (!post.placeName) return null

  const openPlaceMap = () => {
    if (!post.placeId) return
    router.push({ pathname: '/(tabs)/explore', params: { placeId: post.placeId } })
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Text style={styles.iconEmoji}>☕</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open map for ${post.placeName}`}
          style={styles.info}
          onPress={openPlaceMap}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {post.placeName}
            </Text>
            {post.isOpen !== null ? (
              <View style={[styles.badge, post.isOpen ? styles.badgeOpen : styles.badgeClosed]}>
                <View style={[styles.badgeDot, post.isOpen ? styles.dotOpen : styles.dotClosed]} />
                <Text style={styles.badgeText}>{post.isOpen ? 'OPEN' : 'CLOSED'}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.meta}>
            {post.distanceKm !== null ? `${post.distanceKm} km away` : null}
            {post.distanceKm !== null && post.location ? ' • ' : null}
            {post.location}
          </Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          style={styles.outlineButton}
          onPress={() => {
            if (post.placeId) router.push(`/places/${post.placeId}`)
          }}>
          <Text style={styles.outlineLabel}>View Place</Text>
        </Pressable>

        <Pressable accessibilityRole="button" style={styles.filledButton} onPress={openPlaceMap}>
          <Ionicons name="arrow-up" size={14} color={palette.white} style={styles.arrow} />
          <Text style={styles.filledLabel}>Get Directions</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#17161A',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  iconEmoji: {
    fontSize: 16,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    flexShrink: 1,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
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
  meta: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  arrow: {
    transform: [{ rotate: '45deg' }],
  },
  filledLabel: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
})
