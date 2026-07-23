import { create } from "zustand";

/** Header-level UI state shared across pages. */
interface UiState {
  search: string;
  setSearch: (value: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
}));
