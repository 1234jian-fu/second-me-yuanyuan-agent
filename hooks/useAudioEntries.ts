import { useCallback, useState } from "react";

import {
  audioEntryService,
  type CreateAudioEntryInput,
} from "@/services/audioEntryService";
import type { AudioEntry } from "@/types/audio";
import { getErrorMessage } from "@/utils/errors";

export function useAudioEntries() {
  const [entries, setEntries] = useState<AudioEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextEntries = await audioEntryService.listRecent();
      setEntries(nextEntries);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEntry = useCallback(async (input: CreateAudioEntryInput) => {
    setError(null);
    const created = await audioEntryService.create(input);
    setEntries((current) => [created, ...current]);
    return created;
  }, []);

  return {
    entries,
    isLoading,
    error,
    loadRecent,
    createEntry,
  };
}
