import { toPublicMediaUrl } from '@/config/public-media-url'
import { apiClient } from '@/core/api/client'
import { endpoints } from '@/core/api/endpoints'
import type { AuthUser } from '@/features/auth/types/auth.types'
import type {
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  MeResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
} from './auth.types'

function withPublicAvatar(user: AuthUser): AuthUser {
  return { ...user, avatarUrl: toPublicMediaUrl(user.avatarUrl) }
}

export const authApi = {
  login: (payload: LoginRequest) =>
    apiClient.post<AuthResponse>(endpoints.auth.login, payload).then((res) => ({
      ...res.data,
      user: withPublicAvatar(res.data.user),
    })),

  register: (payload: RegisterRequest) =>
    apiClient.post<AuthResponse>(endpoints.auth.register, payload).then((res) => ({
      ...res.data,
      user: withPublicAvatar(res.data.user),
    })),

  refresh: (payload: RefreshRequest) =>
    apiClient.post<RefreshResponse>(endpoints.auth.refresh, payload).then((res) => res.data),

  logout: (payload: LogoutRequest) =>
    apiClient.post(endpoints.auth.logout, payload).then(() => undefined),

  me: () =>
    apiClient.get<MeResponse>(endpoints.auth.me).then((res) => ({
      ...res.data,
      user: withPublicAvatar(res.data.user),
    })),

  requestPasswordReset: (email: string) =>
    apiClient.post(endpoints.auth.forgotPassword, { email }).then(() => undefined),
}
