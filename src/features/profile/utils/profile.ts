import type { AuthUser } from '@/features/auth/types/auth.types'
import type {
  Profile,
  ProfileImageContentType,
  ProfileStats,
  UpdateProfilePayload,
} from '@/features/profile/types/profile.types'

const ALLOWED_CONTENT_TYPES = new Set<ProfileImageContentType>(['image/jpeg', 'image/png', 'image/webp'])

export function profileDisplayName(profile: Pick<Profile, 'firstName' | 'middleName' | 'lastName'>): string {
  return [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(' ')
}

export function profileStats(profile: Profile): ProfileStats {
  return {
    postCount: profile.postsCount,
    followerCount: profile.followersCount,
    followingCount: profile.followingCount,
  }
}

export function applyProfileToAuthUser(user: AuthUser, profile: Profile): AuthUser {
  return {
    ...user,
    firstName: profile.firstName,
    middleName: profile.middleName,
    lastName: profile.lastName,
    displayName: profileDisplayName(profile),
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    isActive: profile.isActive,
    username: profile.username,
  }
}

export function resolveProfileImageContentType(
  mimeType: string | null | undefined,
  uri: string
): ProfileImageContentType {
  if (mimeType === 'image/jpg') return 'image/jpeg'
  if (mimeType && ALLOWED_CONTENT_TYPES.has(mimeType as ProfileImageContentType)) {
    return mimeType as ProfileImageContentType
  }

  const extension = uri.split('?')[0]?.split('.').pop()?.toLowerCase()
  if (extension === 'png') return 'image/png'
  if (extension === 'webp') return 'image/webp'
  return 'image/jpeg'
}

export interface ProfileFormValues {
  username: string
  firstName: string
  middleName: string
  lastName: string
  bio: string
  address: string
  maritalStatus?: 'SINGLE' | 'MARRIED'
}

export function buildProfileUpdatePayload(
  initial: ProfileFormValues,
  values: ProfileFormValues
): UpdateProfilePayload | null {
  const payload: UpdateProfilePayload = {}

  const username = values.username.trim()
  if (username !== initial.username.trim() && username.length > 0) {
    payload.username = username
  }

  if (values.firstName.trim() !== initial.firstName.trim()) {
    payload.firstName = values.firstName.trim()
  }

  if (values.middleName.trim() !== initial.middleName.trim()) {
    payload.middleName = values.middleName.trim() || null
  }

  if (values.lastName.trim() !== initial.lastName.trim()) {
    payload.lastName = values.lastName.trim()
  }

  if (values.bio.trim() !== initial.bio.trim()) {
    payload.bio = values.bio.trim() || null
  }

  if (values.address.trim() !== initial.address.trim()) {
    payload.address = values.address.trim() || null
  }

  if (values.maritalStatus !== initial.maritalStatus) {
    payload.maritalStatus = values.maritalStatus ?? null
  }

  return Object.keys(payload).length > 0 ? payload : null
}
