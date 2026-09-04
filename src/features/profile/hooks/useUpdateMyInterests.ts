import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/query/query-keys'
import { profileApi } from '@/features/profile/api/profile.api'
import type { Profile, UpdateInterestsPayload } from '@/features/profile/types/profile.types'
import { cacheProfile } from './cache-profile'

export function useUpdateMyInterests() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateInterestsPayload) => profileApi.updateMyInterests(payload),
    onSuccess: ({ profile, interests }) => {
      if (profile) {
        cacheProfile(queryClient, profile)
        return
      }

      const current = queryClient.getQueryData<Profile>(queryKeys.profileMe())
      if (current) cacheProfile(queryClient, { ...current, interests })
    },
  })
}
