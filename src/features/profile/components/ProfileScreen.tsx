import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter, type Href } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  ActivityIndicator,
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
import { profileApi } from '@/features/profile/api/profile.api'
import { useDisplayedProfileImages } from '@/features/profile/hooks/useDisplayedProfileImages'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { useUploadProfileImage } from '@/features/profile/hooks/useUploadProfileImage'
import { useProfileImagePreviewStore } from '@/features/profile/store/profile-image-preview.store'
import { pickProfileImageFromSource } from '@/features/profile/utils/pick-profile-image'
import { profileDisplayName, profileStats } from '@/features/profile/utils/profile'
import { ErrorModal } from '@/shared/components/feedback/ErrorModal'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { getTabBarOverlayHeight } from '@/shared/constants/tab-bar'
import { getErrorMessage } from '@/shared/utils/error'
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
  const { data: profile, isLoading, isError, error, refetch } = useProfile(userId)
  const displayed = useDisplayedProfileImages(profile)
  const backgroundUpload = useUploadProfileImage()
  const setImagePreview = useProfileImagePreviewStore((state) => state.setImage)
  const clearImagePreview = useProfileImagePreviewStore((state) => state.clearImage)
  const [tab, setTab] = useState<ProfileTab>('Posts')
  const [isFollowing, setIsFollowing] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const isOwn = !userId || profile?.id === currentUser?.id || profile?.username === userId
  const displayName = profile ? profileDisplayName(profile) : ''
  const stats = profile ? profileStats(profile) : null

  const posts = useMemo(() => {
    if (!profile) return []
    return mockPosts.filter((post) => post.author.id === profile.id || post.author.username === profile.username)
  }, [profile])

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
    if (!profile?.username) {
      if (isOwn) router.push('/settings/account' as Href)
      return
    }

    void profileApi
      .getShareUrl(profile.username)
      .then(({ url }) => Share.share({ url, message: url }))
      .catch((err) => setActionError(getErrorMessage(err)))
  }

  const onChangeBackground = async () => {
    const picked = await pickProfileImageFromSource('background', 'library')
    if (!picked) return

    setImagePreview('background', picked.uri)
    setActionError(null)

    try {
      await backgroundUpload.mutateAsync({
        type: 'background',
        fileUri: picked.uri,
        contentType: picked.contentType,
      })
    } catch (err) {
      clearImagePreview('background')
      setActionError(getErrorMessage(err))
    }
  }

  if (isLoading) return <LoadingState />
  if (isError || !profile || !stats) {
    return <ErrorState onRetry={() => refetch()} message={getErrorMessage(error)} />
  }

  const handleLabel = profile.username ? `@${profile.username}` : isOwn ? 'Set a username' : null
  const avatarUrl = isOwn ? displayed.avatarUrl : profile.avatarUrl
  const backgroundUrl = isOwn ? displayed.backgroundImageUrl : profile.backgroundImageUrl
  const isUploadingBackground = backgroundUpload.isPending
  const Cover = isOwn ? Pressable : View

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}>
        <Cover
          accessibilityRole={isOwn ? 'button' : undefined}
          accessibilityLabel={isOwn ? 'Change background photo' : undefined}
          disabled={isUploadingBackground}
          onPress={isOwn ? () => void onChangeBackground() : undefined}
          style={styles.cover}>
          {backgroundUrl ? (
            <Image
              source={{ uri: backgroundUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              recyclingKey={backgroundUrl}
            />
          ) : (
            <StripeFill />
          )}
          <View style={styles.coverScrim} pointerEvents="none" />
          {isUploadingBackground ? (
            <View style={styles.coverOverlay} pointerEvents="none">
              <ActivityIndicator color={palette.white} />
            </View>
          ) : null}
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
        </Cover>

        <View style={styles.body}>
          {isOwn ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Update profile photo"
              style={styles.avatar}
              onPress={() => router.push('/settings/avatar' as Href)}>
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  recyclingKey={avatarUrl}
                />
              ) : (
                <StripeFill />
              )}
            </Pressable>
          ) : (
            <View style={styles.avatar}>
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  recyclingKey={avatarUrl}
                />
              ) : (
                <StripeFill />
              )}
            </View>
          )}

          <Text style={styles.name}>{displayName}</Text>
          {handleLabel ? (
            isOwn && !profile.username ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/settings/account' as Href)}>
                <Text style={styles.handle}>{handleLabel}</Text>
              </Pressable>
            ) : (
              <Text style={styles.handle}>{handleLabel}</Text>
            )
          ) : null}

          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

          <View style={styles.stats}>
            {(
              [
                [stats.postCount, 'Posts'],
                [stats.followerCount, 'Followers'],
                [stats.followingCount, 'Following'],
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
              <>
                <Pressable
                  accessibilityRole="button"
                  style={[styles.updateButton, isFollowing && styles.followButtonMuted]}
                  onPress={() => setIsFollowing((current) => !current)}>
                  <Text style={styles.updateLabel}>{isFollowing ? 'Following' : 'Follow'}</Text>
                </Pressable>
                <Pressable accessibilityRole="button" style={styles.messageButton}>
                  <Text style={styles.messageLabel}>Message</Text>
                </Pressable>
              </>
            )}
            <Pressable accessibilityRole="button" accessibilityLabel="Share profile" style={styles.shareButton} onPress={onShare}>
              <Ionicons name="share-social-outline" size={18} color={palette.white} />
            </Pressable>
          </View>
        </View>

        {isOwn ? (
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
        ) : null}

        {!isOwn || tab === 'Posts' ? (
          postTiles.length === 0 ? (
            <Text style={styles.empty}>No posts yet</Text>
          ) : (
            <View style={[styles.grid, !isOwn && styles.gridSolo]}>
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

        {isOwn && tab === 'Places' ? (
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

        {isOwn && tab === 'Saved' ? <Text style={styles.empty}>No saved posts yet</Text> : null}
      </ScrollView>

      <ErrorModal visible={actionError != null} message={actionError ?? undefined} onClose={() => setActionError(null)} />
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
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
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
  followButtonMuted: {
    opacity: 0.7,
  },
  messageButton: {
    flex: 1,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageLabel: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
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
  gridSolo: {
    marginTop: spacing.md,
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
    ...StyleSheet.absoluteFill,
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
