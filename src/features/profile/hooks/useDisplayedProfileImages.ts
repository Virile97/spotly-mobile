import { toPublicMediaUrl } from '@/config/public-media-url'
import { useProfileImagePreviewStore } from '@/features/profile/store/profile-image-preview.store'
import type { Profile } from '@/features/profile/types/profile.types'

export function useDisplayedProfileImages(
  profile?: Pick<Profile, 'avatarUrl' | 'backgroundImageUrl'> | null
) {
  const avatarUri = useProfileImagePreviewStore((state) => state.avatarUri)
  const backgroundUri = useProfileImagePreviewStore((state) => state.backgroundUri)

  return {
    avatarUrl: avatarUri ?? toPublicMediaUrl(profile?.avatarUrl),
    backgroundImageUrl: backgroundUri ?? toPublicMediaUrl(profile?.backgroundImageUrl),
  }
}
