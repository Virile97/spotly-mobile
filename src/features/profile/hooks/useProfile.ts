import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/query/query-keys'
import { profileApi } from '@/features/profile/api/profile.api'

export function useProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.profile(userId),
    queryFn: () => profileApi.getProfile(userId),
    enabled: Boolean(userId),
  })
}
