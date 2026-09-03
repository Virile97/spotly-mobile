export interface AuthUser {
  id: string
  email: string
  username: string
  avatarUrl: string | null
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  contactNumber: string
  birthdate: string
  gender: string
  maritalStatus: string
  address: string
  password: string
}
