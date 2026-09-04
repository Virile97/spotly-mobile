import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { type Href, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { mockThreads, type MessageThread } from '@/features/messages/data/mock-threads'
import { getMockPlace } from '@/features/places/data/mock-places'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const FILTERS = ['All', 'Unread', 'Groups'] as const
type FilterId = (typeof FILTERS)[number]

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle)
}

function StripeAvatar({ emoji, size, rounded }: { emoji?: string; size: number; rounded: number }) {
  return (
    <View style={[styles.stripeMark, { width: size, height: size, borderRadius: rounded }]}>
      {Array.from({ length: 7 }, (_, index) => (
        <View key={index} style={[styles.stripe, { left: index * 10 - 18 }]} />
      ))}
      {emoji ? <Text style={{ fontSize: size * 0.4 }}>{emoji}</Text> : null}
    </View>
  )
}

export function MessagesScreen() {
  const insets = useSafeAreaInsets()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterId>('All')

  const unreadTotal = mockThreads.reduce((sum, thread) => sum + thread.unreadCount, 0)

  const threads = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return mockThreads.filter((thread) => {
      if (filter === 'Unread' && thread.unreadCount === 0) return false
      if (filter === 'Groups' && thread.kind !== 'group') return false
      if (!needle) return true
      return matches(thread.name, needle) || matches(thread.snippet, needle)
    })
  }, [filter, query])

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <View style={styles.searchField}>
        <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.4)" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search messages"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.searchInput}
          returnKeyType="search"
          autoCorrect={false}
        />
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
                <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>{item}</Text>
                {item === 'Unread' && unreadTotal > 0 ? (
                  <View style={[styles.chipBadge, isActive && styles.chipBadgeOnActive]}>
                    <Text style={[styles.chipBadgeLabel, isActive && styles.chipBadgeLabelOnActive]}>
                      {unreadTotal}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            )
          })}
        </View>
      </ScrollView>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.lg }]}>
        {threads.length === 0 ? (
          <Text style={styles.empty}>No messages match that search</Text>
        ) : (
          threads.map((thread) => <ThreadRow key={thread.id} thread={thread} />)
        )}
      </ScrollView>
    </View>
  )
}

function ThreadRow({ thread }: { thread: MessageThread }) {
  const router = useRouter()
  const place = thread.placeId ? getMockPlace(thread.placeId) : undefined
  const rounded = thread.kind === 'place' ? 14 : 26

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open conversation with ${thread.name}`}
      style={styles.row}
      onPress={() => router.push(`/messages/${thread.id}` as Href)}>
      <View>
        {place?.coverImageUrl ? (
          <Image
            source={{ uri: place.coverImageUrl }}
            style={[styles.avatar, { borderRadius: rounded }]}
            contentFit="cover"
          />
        ) : (
          <StripeAvatar emoji={thread.emoji} size={52} rounded={rounded} />
        )}
        {thread.online ? <View style={styles.onlineDot} /> : null}
      </View>

      <View style={styles.rowCopy}>
        <View style={styles.rowTop}>
          <Text style={styles.name} numberOfLines={1}>
            {thread.name}
          </Text>
          <Text style={styles.time}>{thread.timeLabel}</Text>
        </View>
        <View style={styles.rowBottom}>
          <Text style={styles.snippet} numberOfLines={1}>
            {thread.snippet}
          </Text>
          {thread.unreadCount > 0 ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadLabel}>{thread.unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
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
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    flex: 1,
    color: palette.white,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fontFamily.headline,
    textAlign: 'center',
  },
  searchField: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  },
  chipLabelActive: {
    color: palette.black,
    fontFamily: fontFamily.bodySemiBold,
  },
  chipBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.pink500,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  chipBadgeOnActive: {
    backgroundColor: palette.black,
  },
  chipBadgeLabel: {
    color: palette.black,
    fontSize: 11,
    fontFamily: fontFamily.bodySemiBold,
  },
  chipBadgeLabelOnActive: {
    color: palette.white,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
  empty: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    paddingVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    backgroundColor: '#17161A',
  },
  stripeMark: {
    overflow: 'hidden',
    backgroundColor: '#2A292E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripe: {
    position: 'absolute',
    top: -12,
    width: 6,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '28deg' }],
  },
  onlineDot: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: palette.green500,
    borderWidth: 2,
    borderColor: '#0A090B',
  },
  rowCopy: {
    flex: 1,
    gap: 4,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  time: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontFamily: fontFamily.body,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  snippet: {
    flex: 1,
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.pink500,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadLabel: {
    color: palette.black,
    fontSize: 11,
    fontFamily: fontFamily.bodySemiBold,
  },
})
