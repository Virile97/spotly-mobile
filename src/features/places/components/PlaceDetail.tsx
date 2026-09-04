import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { mockPosts } from '@/features/feed/data/mock-posts'
import { getPlaceExperiences } from '@/features/places/data/mock-experiences'
import type { Place } from '@/features/places/types/place.types'
import { Avatar } from '@/shared/components/ui'
import { formatShortRelativeTime } from '@/shared/utils/date'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const TABS = ['About', 'Menu', 'Community', 'Photos'] as const

const CATEGORY_LABEL = {
  cafe: 'Café',
  food: 'Food',
  nature: 'Nature',
  other: 'Place',
} as const

interface PlaceDetailProps {
  place: Place
}

export function PlaceDetail({ place }: PlaceDetailProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [tab, setTab] = useState<(typeof TABS)[number]>('Community')
  const [isSaved, setIsSaved] = useState(false)

  const experiences = useMemo(() => getPlaceExperiences(place.id), [place.id])
  const photos = useMemo(
    () => mockPosts.filter((post) => post.placeId === place.id).flatMap((post) => post.mediaUrls),
    [place.id]
  )

  const category = CATEGORY_LABEL[place.category ?? 'other']
  const meta = [category, place.city, place.distanceKm != null ? `${place.distanceKm} km away` : null]
    .filter(Boolean)
    .join(' · ')

  const openDirections = () => {
    router.push({ pathname: '/(tabs)/explore', params: { placeId: place.id } })
  }

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View>
          {place.coverImageUrl ? (
            <Image source={{ uri: place.coverImageUrl }} style={styles.hero} contentFit="cover" />
          ) : (
            <View style={styles.hero} />
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={6}
            style={[styles.heroButton, styles.backButton, { top: insets.top + spacing.sm }]}
            onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={palette.white} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="More options"
            hitSlop={6}
            style={[styles.heroButton, styles.moreButton, { top: insets.top + spacing.sm }]}>
            <Ionicons name="ellipsis-horizontal" size={20} color={palette.white} />
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.emojiWrap}>
              <Text style={styles.emoji}>{place.emoji ?? '📍'}</Text>
            </View>

            <View style={styles.titleBlock}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{place.name}</Text>
                {place.verified ? (
                  <Ionicons name="checkmark-circle" size={18} color={palette.blue500} />
                ) : null}
              </View>
              <Text style={styles.meta}>{meta}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.badge, place.isOpenNow ? styles.badgeOpen : styles.badgeClosed]}>
                  <View style={[styles.badgeDot, place.isOpenNow ? styles.dotOpen : styles.dotClosed]} />
                  <Text style={styles.badgeText}>{place.isOpenNow ? 'OPEN NOW' : 'CLOSED'}</Text>
                </View>
                {place.closesAt && place.isOpenNow ? (
                  <Text style={styles.hours}>Closes {place.closesAt}</Text>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable accessibilityRole="button" style={styles.directions} onPress={openDirections}>
              <Ionicons name="navigate" size={16} color={palette.black} />
              <Text style={styles.directionsLabel}>Get Directions</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.save}
              onPress={() => setIsSaved((current) => !current)}>
              <Text style={styles.saveLabel}>{isSaved ? 'Saved' : 'Save'}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.moreAction}>
              <Ionicons name="chevron-forward" size={18} color={palette.white} />
            </Pressable>
          </View>

          <View style={styles.tabs}>
            {TABS.map((item) => {
              const isActive = item === tab
              return (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  style={styles.tab}
                  onPress={() => setTab(item)}>
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{item}</Text>
                  {isActive ? <View style={styles.tabUnderline} /> : null}
                </Pressable>
              )
            })}
          </View>

          {tab === 'Community' ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Experiences at {place.name}</Text>
                <Text style={styles.sectionCount}>{place.postCount ?? experiences.length}</Text>
              </View>

              {experiences.map((experience) => (
                <View key={experience.id} style={styles.experience}>
                  <Avatar
                    fallback={experience.username}
                    size={36}
                    backgroundColor="rgba(255,255,255,0.1)"
                    color="rgba(255,255,255,0.8)"
                  />
                  <View style={styles.experienceBody}>
                    <View style={styles.experienceMeta}>
                      <Text style={styles.experienceName}>{experience.username}</Text>
                      <Text style={styles.experienceTime}>{formatShortRelativeTime(experience.createdAt)}</Text>
                    </View>
                    <Text style={styles.experienceText}>{experience.body}</Text>
                    {experience.mediaUrl ? (
                      <Image source={{ uri: experience.mediaUrl }} style={styles.experienceImage} contentFit="cover" />
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {tab === 'About' ? (
            <View style={styles.section}>
              <Text style={styles.aboutLine}>{place.address}</Text>
              {place.closesAt ? <Text style={styles.aboutLine}>Hours · Closes {place.closesAt}</Text> : null}
              {place.communityScore != null ? (
                <Text style={styles.aboutLine}>{place.communityScore.toFixed(1)} community score</Text>
              ) : null}
            </View>
          ) : null}

          {tab === 'Menu' ? (
            <Text style={styles.empty}>Menu coming soon</Text>
          ) : null}

          {tab === 'Photos' ? (
            <View style={styles.photoGrid}>
              {photos.length === 0 ? (
                <Text style={styles.empty}>No photos yet</Text>
              ) : (
                photos.map((uri, index) => (
                  <Image key={`${uri}-${index}`} source={{ uri }} style={styles.photo} contentFit="cover" />
                ))
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  scroll: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#17161A',
  },
  heroButton: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backButton: {
    left: spacing.md,
  },
  moreButton: {
    right: spacing.md,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  emojiWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  emoji: {
    fontSize: 26,
  },
  titleBlock: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    color: palette.white,
    fontSize: fontSize.xl,
    fontFamily: fontFamily.headline,
  },
  meta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  statusRow: {
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
  hours: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  directions: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.full,
    backgroundColor: palette.pink500,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  directionsLabel: {
    color: palette.black,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  save: {
    minHeight: 46,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveLabel: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  moreAction: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    paddingBottom: spacing.sm,
  },
  tabLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.sm,
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
    backgroundColor: palette.pink500,
    borderRadius: 1,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  sectionCount: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  experience: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  experienceBody: {
    flex: 1,
    gap: 4,
  },
  experienceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  experienceName: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  experienceTime: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
  experienceText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  experienceImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.md,
    backgroundColor: '#17161A',
    marginTop: spacing.xs,
  },
  aboutLine: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  empty: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    paddingVertical: spacing.lg,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photo: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: '#17161A',
  },
})
