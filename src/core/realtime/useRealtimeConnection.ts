import { useEffect } from "react"

import { useAuthStore } from "@/features/auth/store/auth.store"
import { socketManager } from "./socket-manager"

export function useRealtimeConnection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      socketManager.stop()
      return
    }

    socketManager.start()
    return () => socketManager.stop()
  }, [isAuthenticated])
}
