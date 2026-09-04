import { useMutation, useQueryClient } from '@tanstack/react-query'

import { profileApi } from '@/features/profile/api/profile.api'
import type { UpdateProfilePayload } from '@/features/profile/types/profile.types'
import { cacheProfile } from './cache-profile'

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileApi.updateMe(payload),
    onSuccess: (profile) => {
      cacheProfile(queryClient, profile)
    },
  })
}
