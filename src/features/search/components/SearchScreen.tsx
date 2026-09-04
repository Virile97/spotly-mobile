import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { mockPosts } from '@/features/feed/data/mock-posts'
import { mockPlaces } from '@/features/places/data/mock-places'
import type { Place } from '@/features/places/types/place.types'
import {
  featuredPlaceIds,
  mockFollowingPeople,
  mockSuggestedPeople,
  trendingNearYou,
  type SearchPerson,
} from '@/features/search/data/mock-search'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const TABS = ['People', 'Places', 'Posts'] as const
type SearchTab = (typeof TABS)[number]
const POST_GRID_GAP = 1
const POST_GRID_COLUMNS = 3

const CATEGORY_LABEL = {
  cafe: 'Café',
  food: 'Food',
  nature: 'Nature',
  other: 'Place',
} as const

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle)
}

function PatternMark({
  emoji,
  size,
  rounded,
}: {
  emoji?: string
  size: number
  rounded: number
}) {
  return (
    <View style={[styles.pattern, { width: size, height: size, borderRadius: rounded }]}>
      {Array.from({ length: 7 }, (_, index) => (
        <View key={index} style={[styles.stripe, { left: index * 10 - 18 }]} />
      ))}
      {emoji ? <Text style={[styles.patternEmoji, { fontSize: size * 0.42 }]}>{emoji}</Text> : null}
    </View>
  )
}

function SectionTitle({ children, inset }: { children: string; inset?: boolean }) {
  return <Text style={[styles.sectionTitle, inset && styles.sectionTitleInset]}>{children}</Text>
}

export function SearchScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { width: windowWidth } = useWindowDimensions()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<SearchTab>('Places')
  const [followingIds, setFollowingIds] = useState(
    () => new Set(mockFollowingPeople.map((person) => person.id))
  )

  const needle = query.trim().toLowerCase()

  const places = useMemo(() => {
    if (needle) {
      return mockPlaces.filter(
        (place) =>
          matches(place.name, needle) ||
          matches(place.address, needle) ||
          matches(place.city ?? '', needle) ||
          matches(place.category ?? '', needle)
      )
    }

    return featuredPlaceIds
      .map((id) => mockPlaces.find((place) => place.id === id))
      .filter((place): place is Place => place != null)
  }, [needle])

  const allPeople = useMemo(() => [...mockSuggestedPeople, ...mockFollowingPeople], [])

  const suggestedPeople = useMemo(() => {
    return allPeople.filter((person) => {
      if (followingIds.has(person.id)) return false
      if (!needle) return true
      return matches(person.name, needle) || matches(person.location, needle)
    })
  }, [allPeople, followingIds, needle])

  const followingPeople = useMemo(() => {
    return allPeople.filter((person) => {
      if (!followingIds.has(person.id)) return false
      if (!needle) return true
      return matches(person.name, needle) || matches(person.location, needle)
    })
  }, [allPeople, followingIds, needle])

  const posts = useMemo(() => {
    if (!needle) return mockPosts
    return mockPosts.filter(
      (post) =>
        matches(post.caption, needle) ||
        matches(post.placeName ?? '', needle) ||
        matches(post.author.username, needle) ||
        matches(post.location ?? '', needle)
    )
  }, [needle])

  const postTiles = useMemo(
    () =>
      posts.flatMap((post) =>
        post.mediaUrls.map((uri, index) => ({
          key: `${post.id}-${index}`,
          uri,
          postId: post.id,
        }))
      ),
    [posts]
  )

  const tileSize =
    (windowWidth - POST_GRID_GAP * (POST_GRID_COLUMNS - 1)) / POST_GRID_COLUMNS

  const showDiscovery = tab === 'Places' && !needle
  const showPlaces = tab === 'Places'
  const showPeopleTab = tab === 'People'
  const showPosts = tab === 'Posts'

  const toggleFollow = (personId: string) => {
    setFollowingIds((current) => {
      const next = new Set(current)
      if (next.has(personId)) next.delete(personId)
      else next.add(personId)
      return next
    })
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.searchRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={palette.white} />
        </Pressable>

        <View style={styles.searchField}>
          <Ionicons name="search" size={16} color="rgba(255,255,255,0.4)" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search people, places, posts"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.tabs}>
        {TABS.map((item) => {
          const isActive = item === tab
          return (
            <Pressable
              key={item}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              onPress={() => setTab(item)}
              style={styles.tab}>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{item}</Text>
              {isActive ? <View style={styles.tabUnderline} /> : null}
            </Pressable>
          )
        })}
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          showPosts && styles.postsContent,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}>
        {showDiscovery ? (
          <View style={styles.section}>
            <SectionTitle>TRENDING NEAR YOU</SectionTitle>
            <View style={styles.chips}>
              {trendingNearYou.map((chip) => (
                <Pressable
                  key={chip.id}
                  accessibilityRole="button"
                  style={styles.chip}
                  onPress={() => setQuery(chip.label)}>
                  <Text style={styles.chipText}>
                    {chip.emoji} {chip.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {showPlaces ? (
          <View style={styles.section}>
            <SectionTitle>NEARBY PLACES</SectionTitle>
            {places.length === 0 ? (
              <Text style={styles.empty}>No places match that search</Text>
            ) : (
              places.map((place) => (
                <PlaceRow key={place.id} place={place} onPress={() => router.push(`/places/${place.id}`)} />
              ))
            )}
          </View>
        ) : null}

        {showDiscovery ? (
          <View style={styles.section}>
            <SectionTitle>PEOPLE TO FOLLOW</SectionTitle>
            {suggestedPeople.slice(0, 2).map((person) => (
              <PersonRow
                key={person.id}
                person={person}
                isFollowing={false}
                onPress={() => router.push(`/users/${person.id}`)}
                onFollow={() => toggleFollow(person.id)}
              />
            ))}
          </View>
        ) : null}

        {showPeopleTab ? (
          <>
            <View style={styles.section}>
              <SectionTitle>SUGGESTED FOR YOU</SectionTitle>
              {suggestedPeople.length === 0 ? (
                <Text style={styles.empty}>No people match that search</Text>
              ) : (
                suggestedPeople.map((person) => (
                  <PersonRow
                    key={person.id}
                    person={person}
                    isFollowing={false}
                    onPress={() => router.push(`/users/${person.id}`)}
                    onFollow={() => toggleFollow(person.id)}
                  />
                ))
              )}
            </View>

            <View style={styles.section}>
              <SectionTitle>FOLLOWING</SectionTitle>
              {followingPeople.length === 0 ? (
                <Text style={styles.empty}>You are not following anyone yet</Text>
              ) : (
                followingPeople.map((person) => (
                  <PersonRow
                    key={person.id}
                    person={person}
                    isFollowing
                    onPress={() => router.push(`/users/${person.id}`)}
                    onFollow={() => toggleFollow(person.id)}
                  />
                ))
              )}
            </View>
          </>
        ) : null}

        {showPosts ? (
          <View style={styles.postsSection}>
            <SectionTitle inset>RECENT & TRENDING POSTS</SectionTitle>
            {postTiles.length === 0 ? (
              <Text style={[styles.empty, styles.sectionTitleInset]}>No posts match that search</Text>
            ) : (
              <View style={styles.postGrid}>
                {postTiles.map((tile) => (
                  <Pressable
                    key={tile.key}
                    accessibilityRole="button"
                    accessibilityLabel="Open post"
                    style={{ width: tileSize, height: tileSize }}
                    onPress={() => router.push(`/posts/${tile.postId}`)}>
                    <Image source={{ uri: tile.uri }} style={styles.postTileImage} contentFit="cover" />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </View>
  )
}

function PlaceRow({ place, onPress }: { place: Place; onPress: () => void }) {
  const category = CATEGORY_LABEL[place.category ?? 'other']

  return (
    <Pressable accessibilityRole="button" style={styles.row} onPress={onPress}>
      <PatternMark emoji={place.emoji ?? '📍'} size={48} rounded={radius.md} />
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{place.name}</Text>
        <Text style={styles.rowMeta}>
          {category}
          {place.distanceKm != null ? ` · ${place.distanceKm} km` : ''}
          {' · '}
          <Text style={place.isOpenNow ? styles.open : styles.closed}>
            {place.isOpenNow ? 'Open' : 'Closed'}
          </Text>
        </Text>
      </View>
      {place.postCount != null ? (
        <Text style={styles.rowTrail}>{place.postCount} posts</Text>
      ) : null}
    </Pressable>
  )
}

function PersonRow({
  person,
  isFollowing,
  onPress,
  onFollow,
}: {
  person: SearchPerson
  isFollowing: boolean
  onPress: () => void
  onFollow: () => void
}) {
  return (
    <View style={styles.row}>
      <Pressable accessibilityRole="button" style={styles.personHit} onPress={onPress}>
        <PatternMark size={48} rounded={24} />
        <View style={styles.rowInfo}>
          <Text style={styles.rowTitle}>{person.name}</Text>
          <Text style={styles.rowMeta}>
            {person.experienceCount} experiences · {person.location}
          </Text>
        </View>
      </Pressable>
      {isFollowing ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Unfollow" hitSlop={8} onPress={onFollow}>
          <Text style={styles.followingStatus}>Following</Text>
        </Pressable>
      ) : (
        <Pressable accessibilityRole="button" style={styles.followButton} onPress={onFollow}>
          <Text style={styles.followLabel}>Follow</Text>
        </Pressable>
      )}
    </View>
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
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: '#17161A',
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
    paddingVertical: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  tab: {
    paddingBottom: spacing.sm,
  },
  tabLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodyMedium,
  },
  tabLabelActive: {
    color: palette.white,
    fontFamily: fontFamily.bodySemiBold,
  },
  tabUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: palette.pink400,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  postsContent: {
    paddingHorizontal: 0,
    gap: spacing.md,
  },
  postsSection: {
    gap: spacing.sm,
  },
  postGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: POST_GRID_GAP,
  },
  postTileImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#17161A',
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 11,
    fontFamily: fontFamily.bodySemiBold,
    letterSpacing: 0.8,
  },
  sectionTitleInset: {
    paddingHorizontal: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: '#17161A',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  chipText: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  personHit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  rowMeta: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
    marginTop: 2,
  },
  rowTrail: {
    color: 'rgba(255,255,255,0.4)',
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
    paddingVertical: spacing.sm,
  },
  pattern: {
    overflow: 'hidden',
    backgroundColor: '#1C1B1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripe: {
    position: 'absolute',
    top: -20,
    width: 5,
    height: 90,
    backgroundColor: 'rgba(255,255,255,0.045)',
    transform: [{ rotate: '45deg' }],
  },
  patternEmoji: {
    zIndex: 1,
  },
  followButton: {
    minWidth: 76,
    alignItems: 'center',
    backgroundColor: '#17161A',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  followLabel: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
  },
  followingStatus: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
})
