import { useEffect } from "react";

import { hasSupabaseConfig } from "@/config/env";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage } from "@/utils/errors";

export function AuthBootstrap() {
  const signInAnonymously = useAuth().signInAnonymously;
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
  const setAuthError = useAuthStore((state) => state.setAuthError);
  const setHasRemoteBackend = useAuthStore((state) => state.setHasRemoteBackend);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      setAuthLoading(true);
      setAuthError(null);

      if (!hasSupabaseConfig) {
        setHasRemoteBackend(false);
        setAuthLoading(false);
        return;
      }

      try {
        await signInAnonymously();

        if (isMounted) {
          setHasRemoteBackend(true);
        }
      } catch (error) {
        if (isMounted) {
          setHasRemoteBackend(false);
          setAuthError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [setAuthError, setAuthLoading, setHasRemoteBackend, signInAnonymously]);

  return null;
}
