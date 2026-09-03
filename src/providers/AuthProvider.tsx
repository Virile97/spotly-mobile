import { useRouter } from 'expo-router'
import { useEffect, useState, type ReactNode } from 'react'

import { authEvents } from '@/core/auth/auth-events'
import { session } from '@/core/auth/session'
import { authApi } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { LoadingState } from '@/shared/components/feedback/LoadingState'

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const clear = useAuthStore((state) => state.clear)
  const setUser = useAuthStore((state) => state.setUser)
  const [isRestoring, setIsRestoring] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      const isAuthenticated = await session.isAuthenticated()
      if (!isAuthenticated) return

      try {
        const { user } = await authApi.me()
        setUser(user)
      } catch {
        await session.end()
        clear()
      }
    }

    restoreSession().finally(() => setIsRestoring(false))

    return authEvents.on('unauthorized', () => {
      clear()
      router.replace('/(auth)/login')
    })
  }, [clear, router, setUser])

  if (isRestoring) {
    return <LoadingState />
  }

  return <>{children}</>
}
