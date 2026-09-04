import { Image } from 'expo-image'
import { useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native'

import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const { width } = Dimensions.get('window')

export function PostMedia({
  uris,
  aspectRatio = 1,
  onPress,
}: {
  uris: string[]
  aspectRatio?: number
  onPress?: (index: number) => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const isDragging = useRef(false)
  const mediaHeight = width / aspectRatio

  if (uris.length === 0) return null

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width)
    setActiveIndex(index)
  }

  return (
    <View style={[styles.container, { height: mediaHeight }]}>
      <FlatList
        data={uris}
        keyExtractor={(uri, index) => `${uri}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => {
          isDragging.current = true
        }}
        onScrollEndDrag={() => {
          setTimeout(() => {
            isDragging.current = false
          }, 0)
        }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item, index }) => {
          const image = (
            <Image source={{ uri: item }} style={[styles.media, { height: mediaHeight }]} contentFit="cover" />
          )

          if (!onPress) return image

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View full size media"
              style={styles.media}
              onPress={() => {
                if (isDragging.current) return
                onPress(index)
              }}>
              {image}
            </Pressable>
          )
        }}
      />

      {uris.length > 1 ? (
        <>
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {activeIndex + 1}/{uris.length}
            </Text>
          </View>

          <View style={styles.dots}>
            {uris.map((uri, index) => (
              <View
                key={`${uri}-${index}`}
                style={[styles.dot, index === activeIndex ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width,
  },
  media: {
    width,
  },
  counter: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  counterText: {
    color: palette.white,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bodySemiBold,
  },
  dots: {
    position: 'absolute',
    bottom: spacing.sm,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 16,
    backgroundColor: palette.white,
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
})
