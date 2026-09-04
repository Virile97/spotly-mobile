import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import type { Moment } from '@/features/feed/types/moment.types'
import { Avatar } from '@/shared/components/ui'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const CARD_WIDTH = 108
const CARD_HEIGHT = 152
const CARD_RADIUS = 22

interface MomentCardProps {
  moment: Moment
}

export function MomentCard({ moment }: MomentCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${moment.authorName}'s moment`}
      style={styles.card}>
      <Image source={{ uri: moment.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />

      <LinearGradient
        colors={['transparent', 'rgba(10,9,11,0.85)']}
        locations={[0.45, 1]}
        style={styles.gradient}
      />

      {moment.isUnseen ? <View style={styles.dot} /> : null}

      {moment.emoji ? <Text style={styles.emoji}>{moment.emoji}</Text> : null}

      <View style={styles.author}>
        <Avatar
          uri={moment.authorAvatarUrl}
          fallback={moment.authorName}
          size={18}
          backgroundColor="rgba(255,255,255,0.2)"
          color={palette.white}
        />
        <Text style={styles.name} numberOfLines={1}>
          {moment.authorName}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#17161A',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
  },
  dot: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.pink500,
  },
  emoji: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    fontSize: 12,
  },
  author: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bodySemiBold,
  },
})
