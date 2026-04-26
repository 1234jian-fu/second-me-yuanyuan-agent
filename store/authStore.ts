import { create } from "zustand";

import type { AppUser } from "@/types/auth";

type AuthState = {
  user: AppUser | null;
  isAuthLoading: boolean;
  authError: string | null;
  hasRemoteBackend: boolean;
  setUser: (user: AppUser | null) => void;
  setAuthLoading: (isAuthLoading: boolean) => void;
  setAuthError: (authError: string | null) => void;
  setHasRemoteBackend: (hasRemoteBackend: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthLoading: false,
  authError: null,
  hasRemoteBackend: false,
  setUser: (user) => set({ user }),
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
  setAuthError: (authError) => set({ authError }),
  setHasRemoteBackend: (hasRemoteBackend) => set({ hasRemoteBackend }),
}));
