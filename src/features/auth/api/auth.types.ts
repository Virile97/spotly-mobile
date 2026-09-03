import type { AuthSession, AuthTokens, AuthUser, LoginPayload, RegisterPayload } from '@/features/auth/types/auth.types'

export type LoginRequest = LoginPayload
export type RegisterRequest = RegisterPayload
export type AuthResponse = AuthSession

export interface RefreshRequest {
  refreshToken: string
}

export interface RefreshResponse {
  tokens: AuthTokens
}

export interface LogoutRequest {
  refreshToken: string
}

export interface MeResponse {
  user: AuthUser
}
