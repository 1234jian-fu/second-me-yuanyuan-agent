export type AudioEntry = {
  id: string;
  userId: string;
  title: string | null;
  storagePath: string;
  publicUrl: string | null;
  durationSeconds: number | null;
  mimeType: string | null;
  fileSize: number | null;
  transcript: string | null;
  transcriptStatus: "pending" | "processing" | "completed" | "failed" | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
};
