import { useCallback, useState } from "react";

import {
  type CreateTextEntryInput,
  textEntryService,
} from "@/services/textEntryService";
import type { TextEntry } from "@/types/entries";
import { getErrorMessage } from "@/utils/errors";

export function useTextEntries() {
  const [entries, setEntries] = useState<TextEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextEntries = await textEntryService.listRecent();
      setEntries(nextEntries);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEntry = useCallback(async (input: CreateTextEntryInput) => {
    setError(null);
    const created = await textEntryService.create(input);
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
