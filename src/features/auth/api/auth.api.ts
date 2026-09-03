import { apiClient } from '@/core/api/client'
import type { AuthResponse, LoginRequest, RegisterRequest } from './auth.types'

export const authApi = {
  login: (payload: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', payload).then((res) => res.data),

  register: (payload: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', payload).then((res) => res.data),

  logout: () => apiClient.post('/auth/logout').then(() => undefined),

  requestPasswordReset: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }).then(() => undefined),
}
