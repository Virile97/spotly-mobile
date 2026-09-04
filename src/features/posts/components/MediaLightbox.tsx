import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ZoomableImage } from '@/features/posts/components/ZoomableImage'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface MediaLightboxProps {
  uris: string[]
  initialIndex: number
  visible: boolean
  onClose: () => void
}

export function MediaLightbox({ uris, initialIndex, visible, onClose }: MediaLightboxProps) {
  const insets = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width)
    setActiveIndex(index)
    setIsZoomed(false)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      onShow={() => {
        setActiveIndex(initialIndex)
        setIsZoomed(false)
      }}>
      <GestureHandlerRootView style={styles.root}>
        <FlatList
          data={uris}
          keyExtractor={(uri, index) => `${uri}-${index}`}
          horizontal
          pagingEnabled
          scrollEnabled={!isZoomed}
          initialScrollIndex={Math.min(initialIndex, Math.max(uris.length - 1, 0))}
          getItemLayout={(_item, index) => ({ length: width, offset: width * index, index })}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={({ item, index }) => (
            <ZoomableImage
              key={`${item}-${index}-${index === activeIndex ? 'active' : 'idle'}`}
              uri={item}
              width={width}
              height={height}
              onZoomChange={setIsZoomed}
              onClose={onClose}
            />
          )}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close media"
          hitSlop={6}
          style={[styles.close, { top: insets.top + spacing.sm }]}
          onPress={onClose}>
          <Ionicons name="close" size={22} color={palette.white} />
        </Pressable>

        {uris.length > 1 ? (
          <View style={[styles.counter, { top: insets.top + spacing.sm }]}>
            <Text style={styles.counterText}>
              {activeIndex + 1}/{uris.length}
            </Text>
          </View>
        ) : null}
      </GestureHandlerRootView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  close: {
    position: 'absolute',
    left: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  counter: {
    position: 'absolute',
    alignSelf: 'center',
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
})
