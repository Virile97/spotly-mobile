import { create } from 'zustand'

import type { ProfileImageContentType, ProfileImageType } from '@/features/profile/types/profile.types'

export interface PendingProfileImage {
  uri: string
  contentType: ProfileImageContentType
}

interface ProfileImagePreviewState {
  avatarUri: string | null
  backgroundUri: string | null
  pendingAvatar: PendingProfileImage | null
  setImage: (type: ProfileImageType, uri: string) => void
  setPendingAvatar: (pending: PendingProfileImage | null) => void
  clearImage: (type: ProfileImageType) => void
  clearAll: () => void
}

export const useProfileImagePreviewStore = create<ProfileImagePreviewState>((set) => ({
  avatarUri: null,
  backgroundUri: null,
  pendingAvatar: null,
  setImage: (type, uri) => set(type === 'avatar' ? { avatarUri: uri } : { backgroundUri: uri }),
  setPendingAvatar: (pendingAvatar) => set({ pendingAvatar }),
  clearImage: (type) => set(type === 'avatar' ? { avatarUri: null } : { backgroundUri: null }),
  clearAll: () => set({ avatarUri: null, backgroundUri: null, pendingAvatar: null }),
}))
