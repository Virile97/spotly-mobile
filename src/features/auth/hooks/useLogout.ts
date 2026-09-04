import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'

import { session } from '@/core/auth/session'
import { tokenStorage } from '@/core/auth/token-storage'
import { authApi } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useProfileImagePreviewStore } from '@/features/profile/store/profile-image-preview.store'

export function useLogout() {
  const router = useRouter()
  const clear = useAuthStore((state) => state.clear)
  const clearImagePreview = useProfileImagePreviewStore((state) => state.clearAll)

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await tokenStorage.getRefreshToken()
      if (refreshToken) {
        await authApi.logout({ refreshToken })
      }
    },
    onSettled: async () => {
      await session.end()
      clearImagePreview()
      clear()
      router.replace('/(auth)/login')
    },
  })
}
