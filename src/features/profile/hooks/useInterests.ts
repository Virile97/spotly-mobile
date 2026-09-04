import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/query/query-keys'
import { profileApi } from '@/features/profile/api/profile.api'

export function useInterests() {
  return useQuery({
    queryKey: queryKeys.interests(),
    queryFn: () => profileApi.listInterests(),
  })
}
