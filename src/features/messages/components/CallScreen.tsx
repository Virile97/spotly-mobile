import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { getThread } from '@/features/messages/data/mock-threads'
import { getMockPlace } from '@/features/places/data/mock-places'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

function StripeAvatar({ emoji, size }: { emoji?: string; size: number }) {
  return (
    <View style={[styles.stripeMark, { width: size, height: size, borderRadius: size / 2 }]}>
      {Array.from({ length: 10 }, (_, index) => (
        <View key={index} style={[styles.stripe, { left: index * 18 - 40 }]} />
      ))}
      {emoji ? <Text style={{ fontSize: size * 0.28 }}>{emoji}</Text> : null}
    </View>
  )
}

function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

export function CallScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { threadId } = useLocalSearchParams<{ threadId: string }>()
  const id = Array.isArray(threadId) ? threadId[0] : threadId
  const thread = getThread(id)
  const place = thread?.placeId ? getMockPlace(thread.placeId) : undefined

  const [elapsed, setElapsed] = useState(0)
  const [muted, setMuted] = useState(false)
  const [speakerOn, setSpeakerOn] = useState(false)
  const [cameraOff, setCameraOff] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((value) => value + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!thread) return <ErrorState />

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#2A1635', '#1A0F22', '#0A090B']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.body, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg }]}>
        <Text style={styles.status}>CALLING...</Text>

        <View style={styles.identity}>
          {place?.coverImageUrl ? (
            <Image source={{ uri: place.coverImageUrl }} style={styles.avatar} contentFit="cover" />
          ) : (
            <StripeAvatar emoji={thread.emoji} size={168} />
          )}
          <Text style={styles.name}>{thread.name}</Text>
          <Text style={styles.timer}>{formatElapsed(elapsed)}</Text>
        </View>

        <View style={styles.controls}>
          <ControlButton
            icon="mic-off-outline"
            label="Mute"
            active={muted}
            onPress={() => setMuted((value) => !value)}
          />
          <ControlButton icon="call" label="End" variant="end" onPress={() => router.back()} />
          <ControlButton
            icon="volume-high-outline"
            label="Speaker"
            active={speakerOn}
            onPress={() => setSpeakerOn((value) => !value)}
          />
          <ControlButton
            icon="videocam-outline"
            label="Camera off"
            active={!cameraOff}
            onPress={() => setCameraOff((value) => !value)}
          />
        </View>
      </View>
    </View>
  )
}

function ControlButton({
  icon,
  label,
  onPress,
  active,
  variant = 'default',
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress: () => void
  active?: boolean
  variant?: 'default' | 'end'
}) {
  const isEnd = variant === 'end'

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={active != null ? { selected: active } : undefined}
      style={styles.control}
      onPress={onPress}>
      <View
        style={[
          styles.controlButton,
          isEnd && styles.endButton,
          active && !isEnd && styles.controlButtonActive,
        ]}>
        <Ionicons
          name={icon}
          size={isEnd ? 28 : 24}
          color={palette.white}
          style={isEnd ? styles.hangupIcon : undefined}
        />
      </View>
      <Text style={styles.controlLabel}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  status: {
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    letterSpacing: 1.4,
    fontFamily: fontFamily.bodyMedium,
  },
  identity: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  avatar: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: '#2A292E',
  },
  stripeMark: {
    overflow: 'hidden',
    backgroundColor: '#3A3940',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripe: {
    position: 'absolute',
    top: -30,
    width: 10,
    height: 230,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ rotate: '28deg' }],
  },
  name: {
    color: palette.white,
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.headline,
    textAlign: 'center',
  },
  timer: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  control: {
    alignItems: 'center',
    gap: 10,
    width: 76,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2A292E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: palette.pink500,
  },
  endButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.red500,
    shadowColor: palette.red500,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 18,
    elevation: 10,
  },
  hangupIcon: {
    transform: [{ rotate: '135deg' }],
  },
  controlLabel: {
    color: palette.white,
    fontSize: 12,
    fontFamily: fontFamily.body,
    textAlign: 'center',
  },
})
