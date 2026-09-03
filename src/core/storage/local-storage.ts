import AsyncStorage from '@react-native-async-storage/async-storage'

export const localStorage = {
  async getItem<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  },
  async setItem<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  },
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key)
  },
}
