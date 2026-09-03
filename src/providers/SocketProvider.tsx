import { useEffect, type ReactNode } from 'react'

import { tokenStorage } from '@/core/auth/token-storage'
import { socketManager } from '@/core/realtime/socket-manager'
import { useAuthStore } from '@/features/auth/store/auth.store'

export function SocketProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      socketManager.disconnect()
      return
    }

    let cancelled = false
    tokenStorage.getAccessToken().then((token) => {
      if (!cancelled && token) {
        socketManager.connect(token)
      }
    })

    return () => {
      cancelled = true
      socketManager.disconnect()
    }
  }, [isAuthenticated])

  return <>{children}</>
}
