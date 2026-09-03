import { create } from 'zustand';

interface UiState {
  activeBottomSheet: string | null;
  openBottomSheet: (id: string) => void;
  closeBottomSheet: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeBottomSheet: null,
  openBottomSheet: (id) => set({ activeBottomSheet: id }),
  closeBottomSheet: () => set({ activeBottomSheet: null }),
}));
