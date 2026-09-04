import { useRouter, useSegments } from 'expo-router'
import { useEffect, useState, type ReactNode } from 'react'

import { authEvents } from '@/core/auth/auth-events'
import { session } from '@/core/auth/session'
import { authApi } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useProfileImagePreviewStore } from '@/features/profile/store/profile-image-preview.store'
import { LoadingState } from '@/shared/components/feedback/LoadingState'

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const segments = useSegments()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const clear = useAuthStore((state) => state.clear)
  const clearImagePreview = useProfileImagePreviewStore((state) => state.clearAll)
  const setUser = useAuthStore((state) => state.setUser)
  const [isRestoring, setIsRestoring] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      const hasSession = await session.isAuthenticated()
      if (!hasSession) return

      try {
        const { user } = await authApi.me()
        setUser(user)
      } catch {
        await session.end()
        clearImagePreview()
        clear()
      }
    }

    restoreSession().finally(() => setIsRestoring(false))

    return authEvents.on('unauthorized', () => {
      clearImagePreview()
      clear()
      router.replace('/(auth)/login')
    })
  }, [clear, clearImagePreview, router, setUser])

  // Guard route groups against the current auth state: signed-in users are
  // pushed out of (auth), signed-out users are pushed out of (tabs). This
  // runs on every navigation, not just boot, so it also catches session
  // expiry while the user is browsing a protected screen.
  useEffect(() => {
    if (isRestoring) return

    const inAuthGroup = segments[0] === '(auth)'
    const inProtectedGroup = segments[0] === '(tabs)'

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)')
    } else if (!isAuthenticated && inProtectedGroup) {
      router.replace('/(auth)/login')
    }
  }, [isAuthenticated, isRestoring, segments, router])

  if (isRestoring) {
    return <LoadingState />
  }

  return <>{children}</>
}
