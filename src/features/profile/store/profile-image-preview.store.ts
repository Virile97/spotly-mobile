import { create } from 'zustand'

import type { ProfileImageType } from '@/features/profile/types/profile.types'

interface ProfileImagePreviewState {
  avatarUri: string | null
  backgroundUri: string | null
  setImage: (type: ProfileImageType, uri: string) => void
  clearImage: (type: ProfileImageType) => void
  clearAll: () => void
}

export const useProfileImagePreviewStore = create<ProfileImagePreviewState>((set) => ({
  avatarUri: null,
  backgroundUri: null,
  setImage: (type, uri) => set(type === 'avatar' ? { avatarUri: uri } : { backgroundUri: uri }),
  clearImage: (type) => set(type === 'avatar' ? { avatarUri: null } : { backgroundUri: null }),
  clearAll: () => set({ avatarUri: null, backgroundUri: null }),
}))
