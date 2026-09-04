import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { categoryMeta, getActivity } from '@/features/together/data/mock-activities'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const HERO_HEIGHT = 340

function formatDistance(km: number): string {
  const value = Number.isInteger(km) ? String(km) : km.toFixed(1)
  return `${value} km away`
}

function joinerNames(names: string[]): string {
  if (names.length === 0) return 'No one has joined yet'
  if (names.length === 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

function StripeAvatar({ size }: { size: number }) {
  return (
    <View style={[styles.stripeMark, { width: size, height: size, borderRadius: size / 2 }]}>
      {Array.from({ length: 7 }, (_, index) => (
        <View key={index} style={[styles.stripe, { left: index * 10 - 18 }]} />
      ))}
    </View>
  )
}

export default function ActivityDetailScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { activityId } = useLocalSearchParams<{ activityId: string }>()
  const id = Array.isArray(activityId) ? activityId[0] : activityId
  const activity = getActivity(id)
  const [requested, setRequested] = useState(false)

  if (!activity) return <ErrorState />

  const category = categoryMeta(activity.category)
  const names = activity.joiners.map((person) => person.name)
  const meta = [
    { icon: '📍', label: activity.placeName },
    { icon: '📅', label: activity.whenShort },
    { icon: '👥', label: `${activity.spotsFilled} of ${activity.spotsTotal} spots` },
    { icon: '📏', label: formatDistance(activity.distanceKm) },
  ]

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.heroWrap}>
          {activity.imageUrl ? (
            <Image source={{ uri: activity.imageUrl }} style={styles.hero} contentFit="cover" />
          ) : (
            <View style={styles.hero} />
          )}
          <LinearGradient
            colors={['transparent', 'rgba(10,9,11,0.55)', '#0A090B']}
            locations={[0.35, 0.72, 1]}
            style={styles.heroGradient}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={[styles.backButton, { top: insets.top + spacing.sm }]}
            onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color={palette.white} />
          </Pressable>
          <View style={styles.heroCopy}>
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>
                {category.emoji} {category.label}
              </Text>
            </View>
            <Text style={styles.title}>{activity.title}</Text>
          </View>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaRow}>
            <MetaCell icon={meta[0]!.icon} label={meta[0]!.label} />
            <MetaCell icon={meta[1]!.icon} label={meta[1]!.label} />
          </View>
          <View style={styles.metaRow}>
            <MetaCell icon={meta[2]!.icon} label={meta[2]!.label} />
            <MetaCell icon={meta[3]!.icon} label={meta[3]!.label} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this activity</Text>
          <Text style={styles.about}>{activity.about}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activity.joiners.length} {activity.joiners.length === 1 ? 'person is' : 'people are'} joining
          </Text>
          <View style={styles.joiners}>
            <View style={styles.avatars}>
              {activity.joiners.slice(0, 3).map((person, index) => (
                <View
                  key={person.id}
                  style={[styles.avatarWrap, { marginLeft: index === 0 ? 0 : -10, zIndex: 3 - index }]}>
                  {person.avatarUrl ? (
                    <Image source={{ uri: person.avatarUrl }} style={styles.avatar} contentFit="cover" />
                  ) : (
                    <StripeAvatar size={32} />
                  )}
                </View>
              ))}
            </View>
            <Text style={styles.joinerNames}>{joinerNames(names)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <Pressable
          accessibilityRole="button"
          style={[styles.requestButton, requested && styles.requestButtonDone]}
          onPress={() => setRequested(true)}>
          <Text style={styles.requestLabel}>{requested ? 'Request sent' : 'Request to Join'}</Text>
        </Pressable>
      </View>
    </View>
  )
}

function MetaCell({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaIcon}>{icon}</Text>
      <Text style={styles.metaText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  scroll: {
    paddingBottom: spacing.lg,
  },
  heroWrap: {
    height: HERO_HEIGHT,
  },
  hero: {
    width: '100%',
    height: HERO_HEIGHT,
    backgroundColor: '#17161A',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroCopy: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    gap: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeLabel: {
    color: palette.white,
    fontSize: 12,
    fontFamily: fontFamily.bodyMedium,
  },
  title: {
    color: palette.white,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fontFamily.headline,
  },
  metaGrid: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    gap: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaIcon: {
    fontSize: 16,
    lineHeight: 20,
  },
  metaText: {
    flex: 1,
    flexShrink: 1,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: 10,
  },
  sectionTitle: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  about: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    lineHeight: 22,
  },
  joiners: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    borderWidth: 2,
    borderColor: '#0A090B',
    borderRadius: 18,
    overflow: 'hidden',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '28deg' }],
  },
  joinerNames: {
    flex: 1,
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: '#0A090B',
  },
  requestButton: {
    height: 52,
    borderRadius: radius.full,
    backgroundColor: palette.pink500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButtonDone: {
    opacity: 0.7,
  },
  requestLabel: {
    color: palette.black,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
})
