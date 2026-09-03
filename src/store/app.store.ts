import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
  isOnboarded: boolean;
  setOnboarded: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      setOnboarded: (value) => set({ isOnboarded: value }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isOnboarded: state.isOnboarded }),
      onRehydrateStorage: () => () => {
        useHasHydratedStore.setState({ hasHydrated: true });
      },
    }
  )
);

interface HasHydratedState {
  hasHydrated: boolean;
}

const useHasHydratedStore = create<HasHydratedState>(() => ({
  hasHydrated: false,
}));

export function useAppStoreHasHydrated(): boolean {
  return useHasHydratedStore((state) => state.hasHydrated);
}
