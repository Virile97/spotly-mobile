import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import { AppProvider } from '@/providers/AppProvider'
import { useAppFonts } from '@/shared/hooks/useAppFonts'
import { useAppStoreHasHydrated } from '@/store/app.store'

SplashScreen.preventAutoHideAsync()

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AppProvider>
  )
}
