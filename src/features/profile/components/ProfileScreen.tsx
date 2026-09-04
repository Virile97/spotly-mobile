import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter, type Href } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { mockPosts } from '@/features/feed/data/mock-posts'
import { mockPlaces } from '@/features/places/data/mock-places'
import { getMockProfile, mockOwnProfile } from '@/features/profile/data/mock-profile'
import { getTabBarOverlayHeight } from '@/shared/constants/tab-bar'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const TABS = ['Posts', 'Places', 'Saved'] as const
type ProfileTab = (typeof TABS)[number]
const GRID_GAP = 2
const GRID_COLUMNS = 3

interface ProfileScreenProps {
  userId?: string
}

function formatCount(value: number): string {
  return value.toLocaleString('en-US')
}

function StripeFill({ emoji }: { emoji?: string }) {
  return (
    <View style={styles.stripeFill}>
      {Array.from({ length: 14 }, (_, index) => (
        <View key={index} style={[styles.stripe, { left: index * 18 - 40 }]} />
      ))}
      {emoji ? <Text style={styles.stripeEmoji}>{emoji}</Text> : null}
    </View>
  )
}

export function ProfileScreen({ userId }: ProfileScreenProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { width: windowWidth } = useWindowDimensions()
  const currentUser = useAuthStore((state) => state.user)
  const [tab, setTab] = useState<ProfileTab>('Posts')
  const [isFollowing, setIsFollowing] = useState(false)

  const profile = getMockProfile(userId) ?? mockOwnProfile
  const isOwn =
    !userId ||
    userId === currentUser?.id ||
    userId === mockOwnProfile.id ||
    userId === mockOwnProfile.username

  const displayName = isOwn && currentUser?.displayName ? currentUser.displayName : profile.displayName

  const posts = useMemo(() => {
    if (isOwn) return mockPosts
    return mockPosts.filter((post) => post.author.id === profile.id || post.author.username === profile.username)
  }, [isOwn, profile.id, profile.username])

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

  const places = useMemo(() => {
    const ids = [...new Set(posts.map((post) => post.placeId).filter(Boolean))] as string[]
    return ids
      .map((id) => mockPlaces.find((place) => place.id === id))
      .filter((place): place is NonNullable<typeof place> => place != null)
  }, [posts])

  const tileSize = (windowWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS
  const bottomPad = getTabBarOverlayHeight(insets.bottom) + spacing.md

  const onShare = () => {
    void Share.share({
      message: `Check out ${displayName} on Spotly (@${profile.username})`,
    }).catch(() => undefined)
  }

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}>
        <View style={styles.cover}>
          {profile.coverImageUrl ? (
            <Image source={{ uri: profile.coverImageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
          ) : (
            <StripeFill />
          )}
          <View style={styles.coverScrim} />
          {isOwn ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              hitSlop={8}
              style={[styles.coverButton, styles.menuButton, { top: insets.top + spacing.sm }]}
              onPress={() => router.push('/settings' as Href)}>
              <Ionicons name="menu" size={20} color={palette.white} />
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              style={[styles.coverButton, styles.backButton, { top: insets.top + spacing.sm }]}
              onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color={palette.white} />
            </Pressable>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.avatar}>
            {profile.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <StripeFill />
            )}
          </View>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.handle}>
            @{profile.username}
            {profile.location ? ` · 📍 ${profile.location}` : ''}
          </Text>

          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

          {profile.interests.length > 0 ? (
            <View style={styles.chips}>
              {profile.interests.map((interest) => (
                <View key={interest.label} style={styles.chip}>
                  <Text style={styles.chipText}>
                    {interest.emoji} {interest.label}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.stats}>
            {(
              [
                [profile.stats.postCount, 'Posts'],
                [profile.stats.followerCount, 'Followers'],
                [profile.stats.followingCount, 'Following'],
              ] as const
            ).map(([value, label]) => (
              <View key={label} style={styles.stat}>
                <Text style={styles.statValue}>{formatCount(value)}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            {isOwn ? (
              <Pressable
                accessibilityRole="button"
                style={styles.updateButton}
                onPress={() => router.push('/settings/account' as Href)}>
                <Ionicons name="pencil" size={16} color={palette.black} />
                <Text style={styles.updateLabel}>Update profile</Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                style={[styles.updateButton, !isFollowing && styles.followButton]}
                onPress={() => setIsFollowing((current) => !current)}>
                <Text style={[styles.updateLabel, !isFollowing && styles.followLabel]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </Pressable>
            )}
            <Pressable accessibilityRole="button" accessibilityLabel="Share profile" style={styles.shareButton} onPress={onShare}>
              <Ionicons name="share-social-outline" size={18} color={palette.white} />
            </Pressable>
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

        {tab === 'Posts' ? (
          postTiles.length === 0 ? (
            <Text style={styles.empty}>No posts yet</Text>
          ) : (
            <View style={styles.grid}>
              {postTiles.map((tile) => (
                <Pressable
                  key={tile.key}
                  accessibilityRole="button"
                  style={[styles.tile, { width: tileSize, height: tileSize }]}
                  onPress={() => router.push(`/posts/${tile.postId}`)}>
                  <Image source={{ uri: tile.uri }} style={styles.tileImage} contentFit="cover" />
                </Pressable>
              ))}
            </View>
          )
        ) : null}

        {tab === 'Places' ? (
          places.length === 0 ? (
            <Text style={styles.empty}>No tagged places yet</Text>
          ) : (
            <View style={styles.grid}>
              {places.map((place) => (
                <Pressable
                  key={place.id}
                  accessibilityRole="button"
                  style={[styles.tile, { width: tileSize, height: tileSize }]}
                  onPress={() => router.push(`/places/${place.id}`)}>
                  {place.coverImageUrl ? (
                    <Image source={{ uri: place.coverImageUrl }} style={styles.tileImage} contentFit="cover" />
                  ) : (
                    <View style={styles.tileImage} />
                  )}
                </Pressable>
              ))}
            </View>
          )
        ) : null}

        {tab === 'Saved' ? <Text style={styles.empty}>No saved posts yet</Text> : null}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  cover: {
    height: 148,
    backgroundColor: '#17161A',
    overflow: 'hidden',
  },
  coverScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  coverButton: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  menuButton: {
    right: spacing.md,
  },
  backButton: {
    left: spacing.md,
  },
  body: {
    paddingHorizontal: spacing.md,
    marginTop: -44,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#0A090B',
    backgroundColor: '#1C1B1F',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: spacing.sm,
    color: palette.white,
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bodySemiBold,
  },
  handle: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  bio: {
    marginTop: spacing.sm,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    lineHeight: 20,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  chip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: '#17161A',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    color: palette.white,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
  stats: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  statLabel: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  updateButton: {
    flex: 1,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: palette.pink500,
  },
  updateLabel: {
    color: palette.black,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  followButton: {
    backgroundColor: palette.pink500,
  },
  followLabel: {
    color: palette.black,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17161A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginTop: GRID_GAP,
  },
  tile: {
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#17161A',
  },
  tileImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#17161A',
  },
  empty: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  stripeFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1C1B1F',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripe: {
    position: 'absolute',
    top: -40,
    width: 10,
    height: 220,
    backgroundColor: 'rgba(255,255,255,0.04)',
    transform: [{ rotate: '45deg' }],
  },
  stripeEmoji: {
    fontSize: 28,
  },
})
