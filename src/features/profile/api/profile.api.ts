import { File, UploadType } from 'expo-file-system'
import type { AxiosError } from 'axios'

import { toPublicMediaUrl } from '@/config/public-media-url'
import { apiClient } from '@/core/api/client'
import { ApiError } from '@/core/api/api-error'
import { endpoints } from '@/core/api/endpoints'
import { ERROR_MESSAGES } from '@/shared/constants/error-messages'
import type {
  ConfirmProfileImagePayload,
  ImageUploadUrlRequest,
  ImageUploadUrlResponse,
  Interest,
  Profile,
  ProfileImageContentType,
  ProfileImageType,
  ProfileResponse,
  ProfileShareResponse,
  UpdateInterestsPayload,
  UpdateProfilePayload,
} from '@/features/profile/types/profile.types'
import { normalizeInterestList } from '@/features/profile/utils/interests'

function withPublicMediaUrls(profile: Profile): Profile {
  return {
    ...profile,
    avatarUrl: toPublicMediaUrl(profile.avatarUrl),
    backgroundImageUrl: toPublicMediaUrl(profile.backgroundImageUrl),
    interests: profile.interests ? normalizeInterestList(profile.interests) : profile.interests,
  }
}

function logImageUpload(step: string, payload: Record<string, unknown>) {
  if (!__DEV__) return
  console.warn(`[profile-image] ${step}`, payload)
}

async function putFileToPresignedUrl(
  uploadUrl: string,
  fileUri: string,
  contentType: ProfileImageContentType
): Promise<void> {
  const file = new File(fileUri)
  const result = await file.upload(uploadUrl, {
    httpMethod: 'PUT',
    uploadType: UploadType.BINARY_CONTENT,
    mimeType: contentType,
    headers: { 'Content-Type': contentType },
    sessionType: 'foreground',
  })

  logImageUpload('step2 PUT R2', {
    status: result.status,
    body: result.body,
    contentType,
  })

  if (result.status < 200 || result.status >= 300) {
    throw new ApiError(ERROR_MESSAGES.GENERIC, result.status, 'UPLOAD_FAILED')
  }
}

async function confirmImage(payload: ConfirmProfileImagePayload): Promise<Profile> {
  logImageUpload('step3 PATCH about to fire', {
    url: endpoints.profiles.image,
    type: payload.type,
    key: payload.key,
    keyLength: payload.key.length,
  })

  try {
    const res = await apiClient.patch<ProfileResponse>(endpoints.profiles.image, payload)
    logImageUpload('step3 PATCH response', {
      status: res.status,
      body: res.data,
      returnedAvatarUrl: res.data?.profile?.avatarUrl ?? null,
    })

    if (!res.data?.profile) {
      throw new ApiError(ERROR_MESSAGES.GENERIC, res.status, 'CONFIRM_MISSING_PROFILE')
    }

    return withPublicMediaUrls(res.data.profile)
  } catch (error) {
    const axiosError = error as AxiosError
    const apiError = error instanceof ApiError ? error : null
    logImageUpload('step3 PATCH failed', {
      status: apiError?.status ?? axiosError.response?.status ?? 0,
      code: apiError?.code,
      message: apiError?.message ?? (error instanceof Error ? error.message : String(error)),
      body: axiosError.response?.data ?? null,
    })
    throw error
  }
}

export const profileApi = {
  getMe: () =>
    apiClient.get<ProfileResponse>(endpoints.profiles.me).then((res) => withPublicMediaUrls(res.data.profile)),

  getByUsername: (username: string) =>
    apiClient
      .get<ProfileResponse>(endpoints.profiles.byUsername(username))
      .then((res) => withPublicMediaUrls(res.data.profile)),

  updateMe: (payload: UpdateProfilePayload) =>
    apiClient
      .patch<ProfileResponse>(endpoints.profiles.me, payload)
      .then((res) => withPublicMediaUrls(res.data.profile)),

  requestImageUploadUrl: (payload: ImageUploadUrlRequest) =>
    apiClient
      .post<ImageUploadUrlResponse>(endpoints.profiles.imageUploadUrl, payload)
      .then((res) => res.data),

  confirmImage,

  getShareUrl: (username: string) =>
    apiClient.get<ProfileShareResponse>(endpoints.profiles.share(username)).then((res) => res.data),

  listInterests: () =>
    apiClient
      .get<Interest[] | { interests: Interest[] }>(endpoints.interests)
      .then((res) => normalizeInterestList(Array.isArray(res.data) ? res.data : res.data.interests)),

  updateMyInterests: (payload: UpdateInterestsPayload) =>
    apiClient
      .put<{ interests?: Interest[]; profile?: Profile }>(endpoints.profiles.interests, payload)
      .then((res) => {
        if (res.data.profile) {
          const profile = withPublicMediaUrls(res.data.profile)
          return { profile, interests: profile.interests ?? [] }
        }
        return { interests: normalizeInterestList(res.data.interests) }
      }),

  async uploadProfileImage(
    type: ProfileImageType,
    fileUri: string,
    contentType: ProfileImageContentType
  ): Promise<Profile> {
    const upload = await profileApi.requestImageUploadUrl({ type, contentType })
    const key = upload.key

    logImageUpload('step1 POST image-upload-url', {
      type,
      contentType,
      key,
      keyLength: key.length,
      expiresInSeconds: upload.expiresInSeconds,
    })

    await putFileToPresignedUrl(upload.uploadUrl, fileUri, contentType)

    const confirmed = await profileApi.confirmImage({ type, key })
    logImageUpload('step3 key unchanged', {
      step1Key: key,
      sentKey: key,
      sameReference: true,
    })
    return confirmed
  },
}
