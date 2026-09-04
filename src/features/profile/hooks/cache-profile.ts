import type { QueryClient } from '@tanstack/react-query'

import { toPublicMediaUrl } from '@/config/public-media-url'
import { queryKeys } from '@/core/query/query-keys'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { Profile } from '@/features/profile/types/profile.types'
import { normalizeInterestList } from '@/features/profile/utils/interests'
import { applyProfileToAuthUser } from '@/features/profile/utils/profile'

export function cacheProfile(queryClient: QueryClient, profile: Profile) {
  const next: Profile = {
    ...profile,
    avatarUrl: toPublicMediaUrl(profile.avatarUrl),
    backgroundImageUrl: toPublicMediaUrl(profile.backgroundImageUrl),
    interests: normalizeInterestList(profile.interests),
  }

  queryClient.setQueryData(queryKeys.profileMe(), next)
  if (next.username) {
    queryClient.setQueryData(queryKeys.profileUsername(next.username), next)
  }

  const user = useAuthStore.getState().user
  if (user) useAuthStore.getState().setUser(applyProfileToAuthUser(user, next))
}
