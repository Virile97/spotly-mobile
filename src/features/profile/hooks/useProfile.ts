import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { queryKeys } from '@/core/query/query-keys'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { profileApi } from '@/features/profile/api/profile.api'
import { applyProfileToAuthUser } from '@/features/profile/utils/profile'

export function useMyProfile() {
  const setUser = useAuthStore((state) => state.setUser)
  const query = useQuery({
    queryKey: queryKeys.profileMe(),
    queryFn: () => profileApi.getMe(),
  })

  useEffect(() => {
    if (!query.data) return
    const user = useAuthStore.getState().user
    if (user) setUser(applyProfileToAuthUser(user, query.data))
  }, [query.data, setUser])

  return query
}

export function useProfile(username?: string) {
  const isOwn = !username
  const setUser = useAuthStore((state) => state.setUser)
  const query = useQuery({
    queryKey: isOwn ? queryKeys.profileMe() : queryKeys.profileUsername(username ?? ''),
    queryFn: () => (username ? profileApi.getByUsername(username) : profileApi.getMe()),
    enabled: isOwn || Boolean(username),
  })

  useEffect(() => {
    if (!isOwn || !query.data) return
    const user = useAuthStore.getState().user
    if (user) setUser(applyProfileToAuthUser(user, query.data))
  }, [isOwn, query.data, setUser])

  return query
}
