export type CaptureStatus =
  | "pending_upload"
  | "queued"
  | "uploading"
  | "uploaded"
  | "analyzing"
  | "processing"
  | "completed"
  | "failed";

export type CloudPipelineStatus =
  | "pending_upload"
  | "uploading"
  | "uploaded"
  | "analyzing"
  | "completed"
  | "failed";

export type CaptureSource = "mobile-audio" | "mobile-text" | "mock";

export type CapturePipelineTask = {
  id: string;
  recordId?: string;
  source: CaptureSource;
  status: CaptureStatus;
  createdAt: string;
  updatedAt: string;
  localUri?: string;
  remotePath?: string;
  errorMessage?: string;
  analysis?: CaptureAnalysisResult;
};

export const captureStatusLabels: Record<CaptureStatus, string> = {
  pending_upload: "待上传",
  queued: "待上传",
  uploading: "上传中",
  uploaded: "已上传",
  analyzing: "分析中",
  processing: "分析中",
  completed: "已完成",
  failed: "失败",
};

export type CaptureAnalysisResult = {
  transcript: string | null;
  summary: string | null;
  categories: string[];
  provider?: string | null;
  model?: string | null;
};

export function normalizeCaptureStatus(status: CaptureStatus): CloudPipelineStatus {
  if (status === "queued") {
    return "pending_upload";
  }

  if (status === "processing") {
    return "analyzing";
  }

  return status;
}
