import { NavigationBar } from 'expo-navigation-bar'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import { AppProvider } from '@/providers/AppProvider'
import { useAppFonts } from '@/shared/hooks/useAppFonts'
import { useAppStoreHasHydrated } from '@/store/app.store'

const APP_BACKGROUND = '#0A090B'

SplashScreen.preventAutoHideAsync()

// Android draws edge-to-edge, so the root view shows through the transparent
// system bars. Left unset it is white, which reads as bars at the top and
// bottom of the screen.
SystemUI.setBackgroundColorAsync(APP_BACKGROUND)

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts()
  const hasHydrated = useAppStoreHasHydrated()
  const isReady = (fontsLoaded || fontError) && hasHydrated

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync()
    }
  }, [isReady])

  if (!isReady) {
    return null
  }

  return (
    <AppProvider>
      {/* Android runs immersive: both system bars are hidden so screens own the
          full display. `NavigationBar` renders null on iOS. */}
      <StatusBar hidden={Platform.OS === 'android'} style="light" />
      <NavigationBar hidden />

      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: APP_BACKGROUND } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="posts/[postId]" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AppProvider>
  )
}
