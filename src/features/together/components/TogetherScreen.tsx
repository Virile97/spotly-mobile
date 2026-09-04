import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useFocusEffect, useRouter, type Href } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  ACTIVITY_CATEGORIES,
  getActivities,
  type ActivityCategoryId,
  type ActivityItem,
} from '@/features/together/data/mock-activities'
import { getTabBarOverlayHeight } from '@/shared/constants/tab-bar'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

function formatDistance(km: number): string {
  const value = Number.isInteger(km) ? String(km) : km.toFixed(1)
  return `${value} km away`
}

export function TogetherScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [categoryId, setCategoryId] = useState<ActivityCategoryId>('coffee')
  const [activities, setActivities] = useState(getActivities)

  useFocusEffect(
    useCallback(() => {
      setActivities(getActivities())
    }, [])
  )

  const nearby = useMemo(() => {
    const selected = activities.filter((activity) => activity.category === categoryId)
    const rest = activities.filter((activity) => activity.category !== categoryId)
    return [...selected, ...rest]
  }, [activities, categoryId])

  const bottomPad = getTabBarOverlayHeight(insets.bottom) + spacing.lg

  const openActivity = (id: string) => {
    router.push(`/together/${id}` as Href)
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.heading}>🤝 Explore Together</Text>
          <Text style={styles.subhead}>Find people and activities to explore with.</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search activities"
            style={styles.iconButton}
            onPress={() => router.push('/together/search' as Href)}>
            <Ionicons name="search-outline" size={20} color={palette.white} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create activity"
            style={styles.iconButton}
            onPress={() => router.push('/together/create' as Href)}>
            <Ionicons name="add" size={22} color={palette.white} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}>
        <View style={styles.filters}>
          {ACTIVITY_CATEGORIES.map((category) => {
            const isActive = category.id === categoryId
            return (
              <Pressable
                key={category.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setCategoryId(category.id)}>
                <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]} numberOfLines={1}>
                  {category.emoji} {category.label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.feed, { paddingBottom: bottomPad }]}>
        <Text style={styles.sectionTitle}>📍 Activities Near You</Text>

        {nearby.length === 0 ? (
          <Text style={styles.empty}>Nothing happening nearby yet</Text>
        ) : (
          nearby.map((activity) => (
            <ActivityFeedCard
              key={activity.id}
              activity={activity}
              onPress={() => openActivity(activity.id)}
              onJoin={() => openActivity(activity.id)}
            />
          ))
        )}
      </ScrollView>

    </View>
  )
}

function ActivityFeedCard({
  activity,
  onPress,
  onJoin,
}: {
  activity: ActivityItem
  onPress: () => void
  onJoin: () => void
}) {
  return (
    <Pressable accessibilityRole="button" style={styles.card} onPress={onPress}>
      {activity.imageUrl ? (
        <Image source={{ uri: activity.imageUrl }} style={styles.hero} contentFit="cover" />
      ) : (
        <View style={styles.hero} />
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>
          {activity.emoji} {activity.title}
        </Text>
        <Text style={styles.cardMeta}>
          📍 {activity.placeName} · {formatDistance(activity.distanceKm)}
        </Text>
        <Text style={[styles.cardMeta, styles.cardMetaTight]}>
          📅 {activity.whenDay} · {activity.whenTime}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardMeta}>
            👥 {activity.spotsFilled} / {activity.spotsTotal} people
          </Text>
          <Pressable accessibilityRole="button" style={styles.joinButton} onPress={onJoin}>
            <Text style={styles.joinLabel}>Join Activity</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}

const CARD_RADIUS = 20

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heading: {
    color: palette.white,
    fontSize: 26,
    lineHeight: 32,
    fontFamily: fontFamily.headline,
    includeFontPadding: false,
  },
  subhead: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    lineHeight: 20,
    fontFamily: fontFamily.body,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  filtersContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chip: {
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: '#1C1C1E',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: palette.pink500,
    borderColor: palette.pink500,
  },
  chipLabel: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
    flexShrink: 0,
  },
  chipLabelActive: {
    color: palette.black,
    fontFamily: fontFamily.bodySemiBold,
  },
  feed: {
    paddingHorizontal: spacing.md,
    gap: 16,
  },
  sectionTitle: {
    color: palette.white,
    fontSize: fontSize.md,
    lineHeight: 22,
    fontFamily: fontFamily.bodySemiBold,
  },
  empty: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    paddingVertical: spacing.lg,
  },
  card: {
    backgroundColor: '#17161A',
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
  },
  hero: {
    width: '100%',
    height: 188,
    backgroundColor: '#111113',
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  cardTitle: {
    color: palette.white,
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fontFamily.bodySemiBold,
    marginBottom: 8,
  },
  cardMeta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fontFamily.body,
  },
  cardMetaTight: {
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  joinButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.full,
    backgroundColor: palette.pink500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinLabel: {
    color: palette.black,
    fontSize: 13,
    fontFamily: fontFamily.bodySemiBold,
  },
})
