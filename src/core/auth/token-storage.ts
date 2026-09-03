import { secureStorage } from '@/core/storage/secure-storage'

const ACCESS_TOKEN_KEY = 'auth.accessToken'
const REFRESH_TOKEN_KEY = 'auth.refreshToken'

export const tokenStorage = {
  getAccessToken: () => secureStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => secureStorage.setItem(ACCESS_TOKEN_KEY, token),
  getRefreshToken: () => secureStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => secureStorage.setItem(REFRESH_TOKEN_KEY, token),
  async clear(): Promise<void> {
    await Promise.all([
      secureStorage.removeItem(ACCESS_TOKEN_KEY),
      secureStorage.removeItem(REFRESH_TOKEN_KEY),
    ])
  },
}
