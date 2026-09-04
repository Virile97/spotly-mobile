import { Image } from 'expo-image'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const MIN_SCALE = 1
const MAX_SCALE = 4
const DOUBLE_TAP_SCALE = 2.5

interface ZoomableImageProps {
  uri: string
  width: number
  height: number
  onZoomChange?: (isZoomed: boolean) => void
  onClose?: () => void
}

export function ZoomableImage({ uri, width, height, onZoomChange, onClose }: ZoomableImageProps) {
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const savedTranslateX = useSharedValue(0)
  const savedTranslateY = useSharedValue(0)
  const wasZoomed = useSharedValue(false)

  const clampTranslation = (nextScale: number, x: number, y: number) => {
    'worklet'
    const boundX = (Math.max(nextScale, 1) - 1) * width * 0.5
    const boundY = (Math.max(nextScale, 1) - 1) * height * 0.5
    return {
      x: Math.min(boundX, Math.max(-boundX, x)),
      y: Math.min(boundY, Math.max(-boundY, y)),
    }
  }

  const reportZoom = (nextScale: number) => {
    'worklet'
    const zoomed = nextScale > 1.02
    if (zoomed === wasZoomed.value) return
    wasZoomed.value = zoomed
    if (onZoomChange) {
      runOnJS(onZoomChange)(zoomed)
    }
  }

  const reset = () => {
    'worklet'
    scale.value = withTiming(MIN_SCALE)
    savedScale.value = MIN_SCALE
    translateX.value = withTiming(0)
    translateY.value = withTiming(0)
    savedTranslateX.value = 0
    savedTranslateY.value = 0
    reportZoom(MIN_SCALE)
  }

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, savedScale.value * event.scale))
      const clamped = clampTranslation(scale.value, translateX.value, translateY.value)
      translateX.value = clamped.x
      translateY.value = clamped.y
      reportZoom(scale.value)
    })
    .onEnd(() => {
      savedScale.value = scale.value
      savedTranslateX.value = translateX.value
      savedTranslateY.value = translateY.value
      reportZoom(scale.value)
    })

  const pan = Gesture.Pan()
    .maxPointers(1)
    .manualActivation(true)
    .onTouchesMove((_event, state) => {
      if (scale.value > 1.02) {
        state.activate()
      } else {
        state.fail()
      }
    })
    .onStart(() => {
      savedTranslateX.value = translateX.value
      savedTranslateY.value = translateY.value
    })
    .onUpdate((event) => {
      if (scale.value <= 1.02) return

      const clamped = clampTranslation(
        scale.value,
        savedTranslateX.value + event.translationX,
        savedTranslateY.value + event.translationY
      )
      translateX.value = clamped.x
      translateY.value = clamped.y
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value
      savedTranslateY.value = translateY.value
    })

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1.02) {
        reset()
        return
      }

      scale.value = withTiming(DOUBLE_TAP_SCALE)
      savedScale.value = DOUBLE_TAP_SCALE
      reportZoom(DOUBLE_TAP_SCALE)
    })

  const singleTap = Gesture.Tap()
    .onEnd(() => {
      if (scale.value <= 1.02 && onClose) {
        runOnJS(onClose)()
      }
    })

  const composed = Gesture.Simultaneous(pinch, pan, Gesture.Exclusive(doubleTap, singleTap))

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={{ width, height, overflow: 'hidden' }}>
        <Animated.View style={[{ width, height }, imageStyle]}>
          <Image source={{ uri }} style={{ width, height }} contentFit="contain" />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
}
