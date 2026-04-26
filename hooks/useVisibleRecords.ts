import { useEffect } from "react";

import { useAudioEntries } from "@/hooks/useAudioEntries";
import { useTextEntries } from "@/hooks/useTextEntries";
import { useAuthStore } from "@/store/authStore";
import { useMockAgentStore } from "@/store/mockAgentStore";
import { mapAudioEntryToRecord, mapTextEntryToRecord } from "@/utils/recordMappers";

export function useVisibleRecords() {
  const localRecords = useMockAgentStore((state) => state.records);
  const user = useAuthStore((state) => state.user);
  const hasRemoteBackend = useAuthStore((state) => state.hasRemoteBackend);
  const textEntries = useTextEntries();
  const audioEntries = useAudioEntries();
  const remoteReady = hasRemoteBackend && Boolean(user);

  useEffect(() => {
    if (remoteReady) {
      void textEntries.loadRecent();
      void audioEntries.loadRecent();
    }
  }, [audioEntries.loadRecent, remoteReady, textEntries.loadRecent]);

  const localPendingRecords = localRecords.filter(
    (record) =>
      record.captureStatus === "queued" ||
      record.captureStatus === "uploading" ||
      record.captureStatus === "failed",
  );
  const records = remoteReady
    ? [
        ...textEntries.entries.map(mapTextEntryToRecord),
        ...audioEntries.entries.map(mapAudioEntryToRecord),
        ...localPendingRecords,
      ]
    : localRecords;

  return {
    records,
    remoteReady,
    isLoading: textEntries.isLoading || audioEntries.isLoading,
    error: textEntries.error ?? audioEntries.error,
  };
}
