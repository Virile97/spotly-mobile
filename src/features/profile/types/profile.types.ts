import type { MaritalStatus } from '@/features/auth/types/auth.types'

export type ProfileImageType = 'avatar' | 'background'
export type ProfileImageContentType = 'image/jpeg' | 'image/png' | 'image/webp'

export interface Profile {
  id: string
  username: string | null
  displayName?: string | null
  firstName: string
  middleName: string | null
  lastName: string
  bio: string | null
  avatarUrl: string | null
  backgroundImageUrl: string | null
  followersCount: number
  followingCount: number
  postsCount: number
  isActive: boolean
  createdAt: string
}

export interface ProfileResponse {
  profile: Profile
}

export interface UpdateProfilePayload {
  username?: string
  displayName?: string | null
  firstName?: string
  middleName?: string | null
  lastName?: string
  bio?: string | null
  address?: string | null
  maritalStatus?: MaritalStatus | null
}

export interface ImageUploadUrlRequest {
  type: ProfileImageType
  contentType: ProfileImageContentType
}

export interface ImageUploadUrlResponse {
  uploadUrl: string
  key: string
  expiresInSeconds: number
}

export interface ConfirmProfileImagePayload {
  type: ProfileImageType
  key: string
}

export interface ProfileShareResponse {
  url: string
}

export interface ProfileStats {
  postCount: number
  followerCount: number
  followingCount: number
}
