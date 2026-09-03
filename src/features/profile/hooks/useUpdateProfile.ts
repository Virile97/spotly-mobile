import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/query/query-keys'
import { profileApi, type UpdateProfilePayload } from '@/features/profile/api/profile.api'
import { useAuthStore } from '@/features/auth/store/auth.store'

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileApi.updateProfile(payload),
    onSuccess: (profile) => {
      setUser(profile)
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(profile.id) })
    },
  })
}
