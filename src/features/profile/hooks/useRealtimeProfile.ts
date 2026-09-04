import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { SOCKET_EVENTS } from '@/core/realtime/socket-events'
import { socketManager } from '@/core/realtime/socket-manager'
import { cacheProfile } from '@/features/profile/hooks/cache-profile'

export function useRealtimeProfile() {
  const queryClient = useQueryClient()

  useEffect(() => {
    return socketManager.on(SOCKET_EVENTS.PROFILE_UPDATED, (profile) => {
      cacheProfile(queryClient, profile)
    })
  }, [queryClient])
}
