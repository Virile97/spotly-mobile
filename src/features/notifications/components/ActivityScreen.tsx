import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { mockActivity, type ActivityItem } from '@/features/notifications/data/mock-activity'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

function StripeMark({
  emoji,
  size,
  rounded,
}: {
  emoji?: string
  size: number
  rounded: number
}) {
  return (
    <View style={[styles.stripeMark, { width: size, height: size, borderRadius: rounded }]}>
      {Array.from({ length: 7 }, (_, index) => (
        <View key={index} style={[styles.stripe, { left: index * 10 - 18 }]} />
      ))}
      {emoji ? <Text style={{ fontSize: size * 0.42 }}>{emoji}</Text> : null}
    </View>
  )
}

function ActivityMessage({ item }: { item: ActivityItem }) {
  const time = <Text style={styles.time}> · {item.timeLabel}</Text>

  if (item.kind === 'like') {
    return (
      <Text style={styles.message}>
        <Text style={styles.emphasis}>{item.actorName}</Text>
        {' liked your post'}
        {time}
      </Text>
    )
  }

  if (item.kind === 'comment') {
    return (
      <Text style={styles.message}>
        <Text style={styles.emphasis}>{item.actorName}</Text>
        {' commented on your experience: '}
        <Text style={styles.quote}>'{item.quote}'</Text>
        {time}
      </Text>
    )
  }

  if (item.kind === 'save') {
    return (
      <Text style={styles.message}>
        {item.peopleCount} people saved <Text style={styles.emphasis}>{item.placeName}</Text>
        {' from your experience'}
        {time}
      </Text>
    )
  }

  if (item.kind === 'follow') {
    return (
      <Text style={styles.message}>
        <Text style={styles.emphasis}>{item.actorName}</Text>
        {' started following you'}
        {time}
      </Text>
    )
  }

  if (item.kind === 'place_update') {
    return (
      <Text style={styles.message}>
        <Text style={styles.emphasis}>{item.placeName}</Text>
        {' posted an update: '}
        <Text style={styles.quote}>'{item.quote}'</Text>
        {time}
      </Text>
    )
  }

  return (
    <Text style={styles.message}>
      <Text style={styles.emphasis}>{item.actorName}</Text>
      {' mentioned you at '}
      <Text style={styles.emphasis}>{item.placeName}</Text>
      {time}
    </Text>
  )
}

export function ActivityScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [followingBack, setFollowingBack] = useState<Record<string, boolean>>({})

  const today = useMemo(() => mockActivity.filter((item) => item.group === 'today'), [])
  const week = useMemo(() => mockActivity.filter((item) => item.group === 'week'), [])

  const openItem = (item: ActivityItem) => {
    if (item.kind === 'follow' && item.actorId) {
      router.push(`/users/${item.actorId}`)
      return
    }
    if ((item.kind === 'save' || item.kind === 'place_update' || item.kind === 'mention') && item.placeId) {
      router.push(`/places/${item.placeId}`)
      return
    }
    if (item.postId) {
      router.push(`/posts/${item.postId}`)
    }
  }

  const renderItem = (item: ActivityItem) => (
    <Pressable key={item.id} accessibilityRole="button" style={styles.row} onPress={() => openItem(item)}>
      {item.kind === 'save' ? (
        <StripeMark emoji="📍" size={44} rounded={radius.md} />
      ) : item.kind === 'place_update' ? (
        <StripeMark emoji="☕" size={44} rounded={radius.md} />
      ) : item.actorAvatarUrl ? (
        <Image source={{ uri: item.actorAvatarUrl }} style={styles.avatar} contentFit="cover" />
      ) : (
        <StripeMark size={44} rounded={22} />
      )}

      <View style={styles.body}>
        <ActivityMessage item={item} />
      </View>

      {item.kind === 'follow' ? (
        <Pressable
          accessibilityRole="button"
          style={styles.followBack}
          onPress={() =>
            setFollowingBack((current) => ({ ...current, [item.id]: !current[item.id] }))
          }>
          <Text style={styles.followBackLabel}>{followingBack[item.id] ? 'Following' : 'Follow back'}</Text>
        </Pressable>
      ) : item.thumbUrl ? (
        <Image source={{ uri: item.thumbUrl }} style={styles.thumb} contentFit="cover" />
      ) : null}
    </Pressable>
  )

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={palette.white} />
        </Pressable>
        <Text style={styles.title}>Activity</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TODAY</Text>
          {today.map(renderItem)}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THIS WEEK</Text>
          {week.map(renderItem)}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17161A',
  },
  title: {
    color: palette.white,
    fontSize: fontSize.xl,
    fontFamily: fontFamily.headline,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 11,
    fontFamily: fontFamily.bodySemiBold,
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  body: {
    flex: 1,
  },
  message: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    lineHeight: 20,
  },
  emphasis: {
    color: palette.white,
    fontFamily: fontFamily.bodySemiBold,
  },
  quote: {
    color: palette.white,
    fontFamily: fontFamily.body,
  },
  time: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: fontFamily.body,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#17161A',
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#17161A',
  },
  followBack: {
    borderRadius: radius.md,
    backgroundColor: 'rgba(208,95,200,0.28)',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  followBackLabel: {
    color: palette.pink400,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
  },
  stripeMark: {
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
})
