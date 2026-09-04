import type { ReactNode } from 'react'

import { useRealtimeConnection } from '@/core/realtime'
import { useRealtimeProfile } from '@/features/profile/hooks/useRealtimeProfile'

export function SocketProvider({ children }: { children: ReactNode }) {
  useRealtimeConnection()
  useRealtimeProfile()
  return <>{children}</>
}
