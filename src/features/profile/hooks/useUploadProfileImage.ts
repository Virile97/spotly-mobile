import { useMutation, useQueryClient } from '@tanstack/react-query'

import { profileApi } from '@/features/profile/api/profile.api'
import type { ProfileImageContentType, ProfileImageType } from '@/features/profile/types/profile.types'
import { cacheProfile } from './cache-profile'

export function useUploadProfileImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      type,
      fileUri,
      contentType,
    }: {
      type: ProfileImageType
      fileUri: string
      contentType: ProfileImageContentType
    }) => profileApi.uploadProfileImage(type, fileUri, contentType),
    onSuccess: (profile) => {
      cacheProfile(queryClient, profile)
    },
  })
}
