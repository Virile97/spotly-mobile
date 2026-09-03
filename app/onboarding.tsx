import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useRef, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, View, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { OnboardingButton } from '@/features/onboarding/components/OnboardingButton'
import { OnboardingSlide } from '@/features/onboarding/components/OnboardingSlide'
import { onboardingSlides } from '@/features/onboarding/data/onboarding-slides'
import { useAppStore } from '@/store/app.store'
import { spacing } from '@/theme/spacing'

const { width, height } = Dimensions.get('window')

export default function OnboardingScreen() {
  const router = useRouter()
  const setOnboarded = useAppStore((state) => state.setOnboarded)
  const listRef = useRef<FlatList>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const isLastSlide = activeIndex === onboardingSlides.length - 1

  const finishOnboarding = () => {
    setOnboarded(true)
    router.replace('/(auth)/welcome')
  }

  const goToNext = () => {
    if (isLastSlide) {
      finishOnboarding()
      return
    }
    listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true })
  }

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width)
    setActiveIndex(index)
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <StatusBar style="light" />
      <FlatList
        ref={listRef}
        style={{ width, height }}
        data={onboardingSlides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            <OnboardingSlide
              image={item.image}
              badgeText={item.badgeText}
              title={item.title}
              description={item.description}
              step={activeIndex}
              stepCount={onboardingSlides.length}
            />
          </View>
        )}
      />

      <SafeAreaView edges={['bottom']} style={styles.actions} pointerEvents="box-none">
        <OnboardingButton
          label={isLastSlide ? 'Get Started' : 'Next'}
          variant="filled"
          onPress={goToNext}
        />
        <OnboardingButton label="Skip" variant="outline" onPress={finishOnboarding} />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A090B',
  },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
})
