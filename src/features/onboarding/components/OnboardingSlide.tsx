import { LinearGradient } from 'expo-linear-gradient'
import { Image, type ImageSource } from 'expo-image'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface OnboardingSlideProps {
  image: ImageSource
  badgeText?: string
  title: string
  description: string
  step: number
  stepCount: number
  footerLabel?: string
}

export function OnboardingSlide({
  image,
  badgeText,
  title,
  description,
  step,
  stepCount,
  footerLabel,
}: OnboardingSlideProps) {
  return (
    <View style={styles.container}>
      <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(10,9,11,0.85)', '#0A090B']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        {badgeText ? (
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        ) : (
          <View />
        )}

        <View style={styles.bottom}>
          <View style={styles.dots}>
            {Array.from({ length: stepCount }).map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === step ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </SafeAreaView>

      {footerLabel ? (
        <Text style={styles.footer} pointerEvents="none">
          {footerLabel}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    gap: 8,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.green500,
  },
  badgeText: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  bottom: {
    paddingBottom: spacing.xxl * 1.5,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.lg,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 24,
    backgroundColor: palette.pink500,
  },
  dotInactive: {
    width: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  title: {
    color: palette.white,
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.headline,
    lineHeight: 40,
    marginBottom: spacing.sm,
  },
  description: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  footer: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.3)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
    letterSpacing: 1,
  },
})
