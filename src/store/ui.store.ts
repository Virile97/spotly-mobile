import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ThemeOverride = 'light' | 'dark' | 'system'

interface UiState {
  activeBottomSheet: string | null
  openBottomSheet: (id: string) => void
  closeBottomSheet: () => void
  isLoading: boolean
  setLoading: (value: boolean) => void
  themeOverride: ThemeOverride
  setThemeOverride: (value: ThemeOverride) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      activeBottomSheet: null,
      openBottomSheet: (id) => set({ activeBottomSheet: id }),
      closeBottomSheet: () => set({ activeBottomSheet: null }),
      isLoading: false,
      setLoading: (value) => set({ isLoading: value }),
      themeOverride: 'system',
      setThemeOverride: (value) => set({ themeOverride: value }),
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themeOverride: state.themeOverride }),
    }
  )
)
