import { tokenStorage } from './token-storage'

export const session = {
  async isAuthenticated(): Promise<boolean> {
    const token = await tokenStorage.getAccessToken()
    return token !== null
  },
  async end(): Promise<void> {
    await tokenStorage.clear()
  },
}
