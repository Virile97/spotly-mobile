import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useFocusEffect, useRouter, type Href } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { getActivities, type ActivityItem } from '@/features/together/data/mock-activities'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const FILTERS = ['Category', 'Distance', 'Date', 'Open spots'] as const
type FilterId = (typeof FILTERS)[number]

function formatDistance(km: number): string {
  const value = Number.isInteger(km) ? String(km) : km.toFixed(1)
  return `${value} km`
}

function formatSearchWhen(activity: ActivityItem): string {
  const day = activity.whenDay
  if (/\d/.test(day)) return `${day}, ${activity.whenTime}`
  return `${day.slice(0, 3)} ${activity.whenTime}`
}

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle)
}

export function ActivitySearchScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterId>('Distance')
  const [activities, setActivities] = useState(getActivities)

  useFocusEffect(
    useCallback(() => {
      setActivities(getActivities())
    }, [])
  )

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = activities.filter((activity) => {
      if (!needle) return true
      return (
        matches(activity.title, needle) ||
        matches(activity.placeName, needle) ||
        matches(activity.category, needle)
      )
    })

    return [...filtered].sort((a, b) => {
      if (filter === 'Date') return a.sortDate.localeCompare(b.sortDate)
      if (filter === 'Open spots') {
        return b.spotsTotal - b.spotsFilled - (a.spotsTotal - a.spotsFilled)
      }
      if (filter === 'Category') return a.category.localeCompare(b.category)
      return a.distanceKm - b.distanceKm
    })
  }, [activities, filter, query])

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.searchRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={palette.white} />
        </Pressable>
        <View style={styles.searchField}>
          <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.4)" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search activities"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            autoFocus
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}>
        <View style={styles.filters}>
          {FILTERS.map((item) => {
            const isActive = item === filter
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setFilter(item)}>
                <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]} numberOfLines={1}>
                  {item}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Text style={styles.count}>{results.length} RESULTS</Text>
        {results.length === 0 ? (
          <Text style={styles.empty}>No activities match that search</Text>
        ) : (
          results.map((activity) => (
            <ResultCard
              key={activity.id}
              activity={activity}
              onPress={() => router.push(`/together/${activity.id}` as Href)}
            />
          ))
        )}
      </ScrollView>
    </View>
  )
}

function ResultCard({ activity, onPress }: { activity: ActivityItem; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" style={styles.card} onPress={onPress}>
      {activity.imageUrl ? (
        <Image source={{ uri: activity.imageUrl }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={styles.thumbPlaceholder}>
          <Ionicons name="image-outline" size={18} color="rgba(255,255,255,0.35)" />
          <Text style={styles.thumbPlaceholderLabel}>photo or browse files</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {activity.emoji} {activity.title}
        </Text>
        <Text style={styles.cardMeta} numberOfLines={1}>
          {formatDistance(activity.distanceKm)} · 👥 {activity.spotsFilled}/{activity.spotsTotal} ·{' '}
          {formatSearchWhen(activity)}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#17161A',
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  filtersScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  filtersContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: palette.pink500,
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
  list: {
    paddingHorizontal: spacing.md,
    gap: 10,
  },
  count: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    letterSpacing: 0.8,
    fontFamily: fontFamily.bodySemiBold,
    marginBottom: 4,
  },
  empty: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    paddingVertical: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#17161A',
    borderRadius: 16,
    padding: 10,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#111113',
  },
  thumbPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#111113',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 2,
  },
  thumbPlaceholderLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 8,
    lineHeight: 10,
    textAlign: 'center',
    fontFamily: fontFamily.body,
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    color: palette.white,
    fontSize: fontSize.sm,
    lineHeight: 20,
    fontFamily: fontFamily.bodySemiBold,
  },
  cardMeta: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamily.body,
  },
})
