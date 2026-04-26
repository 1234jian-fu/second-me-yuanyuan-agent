import type { MockRecord } from "@/data/mockData";
import type { CaptureStatus } from "@/types/capture";
import type { AudioEntry } from "@/types/audio";
import type { TextEntry } from "@/types/entries";
import { formatDuration } from "@/utils/format";

export function formatRecordTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function mapTranscriptStatus(status: AudioEntry["transcriptStatus"]): CaptureStatus {
  if (status === "completed") {
    return "completed";
  }

  if (status === "processing") {
    return "processing";
  }

  if (status === "failed") {
    return "failed";
  }

  return "uploaded";
}

export function mapTextEntryToRecord(entry: TextEntry): MockRecord {
  return {
    id: entry.id,
    title: entry.title ?? "未命名文字记录",
    type: "text",
    description: entry.content,
    time: formatRecordTime(entry.createdAt),
    captureStatus: entry.summary ? "completed" : "processing",
    captureSource: "mobile-text",
    cloudTaskId: entry.id,
  };
}

export function mapAudioEntryToRecord(entry: AudioEntry): MockRecord {
  return {
    id: entry.id,
    title: entry.title ?? "语音记录",
    type: "audio",
    description: `时长 ${formatDuration(entry.durationSeconds)}，转写状态：${
      entry.transcriptStatus ?? "pending"
    }。`,
    time: formatRecordTime(entry.createdAt),
    captureStatus: mapTranscriptStatus(entry.transcriptStatus),
    captureSource: "mobile-audio",
    cloudTaskId: entry.id,
  };
}
