import { create } from "zustand";
import type { User } from "@/lib/types";

/**
 * Signed-in user for the current session. The real session lives in an
 * httpOnly cookie set by the server; this store only mirrors the user
 * object for display (header, panels). It resets on full page reload —
 * hydrate it from a GET /api/auth/me call once the backend supports it.
 */
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
