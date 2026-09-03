export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
export type MaritalStatus = 'SINGLE' | 'MARRIED'

export interface AuthUser {
  id: string
  firstName: string
  middleName: string | null
  lastName: string
  displayName: string
  nickname: string | null
  gender: Gender
  birthdate: string
  maritalStatus: MaritalStatus | null
  isActive: boolean
  bio: string | null
  avatarUrl: string | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthSession {
  user: AuthUser
  tokens: AuthTokens
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  displayName: string
  nickname?: string
  firstName: string
  middleName?: string
  lastName: string
  gender: Gender
  birthdate: string
  contactNo?: string
  address?: string
  maritalStatus?: MaritalStatus
}
