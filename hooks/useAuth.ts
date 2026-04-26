import { useCallback } from "react";

import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { hasSupabaseConfig } from "@/config/env";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setHasRemoteBackend = useAuthStore((state) => state.setHasRemoteBackend);

  const loadCurrentUser = useCallback(async () => {
    if (!hasSupabaseConfig) {
      setHasRemoteBackend(false);
      setUser(null);
      return null;
    }

    const nextUser = await authService.getCurrentUser();
    setUser(nextUser);
    setHasRemoteBackend(Boolean(nextUser));
    return nextUser;
  }, [setHasRemoteBackend, setUser]);

  const signInAnonymously = useCallback(async () => {
    if (!hasSupabaseConfig) {
      setHasRemoteBackend(false);
      setUser(null);
      return null;
    }

    const nextUser = await authService.signInAnonymously();
    setUser(nextUser);
    setHasRemoteBackend(true);
    return nextUser;
  }, [setHasRemoteBackend, setUser]);

  const signOut = useCallback(async () => {
    if (!hasSupabaseConfig) {
      setHasRemoteBackend(false);
      setUser(null);
      return;
    }

    await authService.signOut();
    setUser(null);
    setHasRemoteBackend(false);
  }, [setHasRemoteBackend, setUser]);

  return {
    user,
    setUser,
    loadCurrentUser,
    signInAnonymously,
    signOut,
  };
}
