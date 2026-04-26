import { getCurrentUserId, getSupabaseClient } from "@/services/supabaseClient";
import type { JsonValue } from "@/types/database";
import type { TextEntry } from "@/types/entries";

type TextEntryRow = ReturnType<typeof mapTextEntry>;

export type CreateTextEntryInput = {
  title?: string | null;
  content: string;
  mood?: string | null;
  tags?: string[];
  metadata?: JsonValue | null;
};

function mapTextEntry(row: {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood: string | null;
  summary: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}): TextEntry {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    mood: row.mood,
    summary: row.summary,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const textEntryService = {
  async create(input: CreateTextEntryInput): Promise<TextEntryRow> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("text_entries")
      .insert({
        user_id: userId,
        title: input.title?.trim() || null,
        content: input.content.trim(),
        mood: input.mood?.trim() || null,
        tags: input.tags ?? [],
        metadata: input.metadata ?? null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapTextEntry(data);
  },

  async listRecent(limit = 20): Promise<TextEntryRow[]> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("text_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data.map(mapTextEntry);
  },

  async getById(id: string): Promise<TextEntryRow | null> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("text_entries")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapTextEntry(data) : null;
  },
};
