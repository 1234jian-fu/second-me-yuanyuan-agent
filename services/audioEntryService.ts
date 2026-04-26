import { getCurrentUserId, getSupabaseClient } from "@/services/supabaseClient";
import type { AudioEntry } from "@/types/audio";
import type { JsonValue } from "@/types/database";

export type CreateAudioEntryInput = {
  title?: string | null;
  storagePath: string;
  publicUrl?: string | null;
  durationSeconds?: number | null;
  mimeType?: string | null;
  fileSize?: number | null;
  metadata?: JsonValue | null;
};

function mapAudioEntry(row: {
  id: string;
  user_id: string;
  title: string | null;
  storage_path: string;
  public_url: string | null;
  duration_seconds: number | null;
  mime_type: string | null;
  file_size: number | null;
  transcript: string | null;
  transcript_status: "pending" | "processing" | "completed" | "failed" | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}): AudioEntry {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    storagePath: row.storage_path,
    publicUrl: row.public_url,
    durationSeconds: row.duration_seconds,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    transcript: row.transcript,
    transcriptStatus: row.transcript_status,
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const audioEntryService = {
  async create(input: CreateAudioEntryInput): Promise<AudioEntry> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("audio_entries")
      .insert({
        user_id: userId,
        title: input.title?.trim() || null,
        storage_path: input.storagePath,
        public_url: input.publicUrl ?? null,
        duration_seconds: input.durationSeconds ?? null,
        mime_type: input.mimeType ?? null,
        file_size: input.fileSize ?? null,
        transcript_status: "pending",
        metadata: input.metadata ?? null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapAudioEntry(data);
  },

  async listRecent(limit = 20): Promise<AudioEntry[]> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("audio_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data.map(mapAudioEntry);
  },

  async updateTranscript(
    id: string,
    transcript: string,
    status: "processing" | "completed" | "failed" = "completed",
  ): Promise<AudioEntry> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("audio_entries")
      .update({
        transcript,
        transcript_status: status,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapAudioEntry(data);
  },
};
