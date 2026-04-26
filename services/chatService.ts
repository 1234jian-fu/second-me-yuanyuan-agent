import { getCurrentUserId, getSupabaseClient } from "@/services/supabaseClient";
import type { ChatMessage, ChatRole, ChatSession } from "@/types/chat";
import type { JsonValue } from "@/types/database";

export type CreateChatSessionInput = {
  title?: string | null;
  memorySnapshot?: JsonValue | null;
  metadata?: JsonValue | null;
};

export type AddChatMessageInput = {
  sessionId: string;
  role: ChatRole;
  content: string;
  provider?: string | null;
  model?: string | null;
  tokens?: number | null;
  metadata?: JsonValue | null;
};

function mapSession(row: {
  id: string;
  user_id: string;
  title: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}): ChatSession {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMessage(row: {
  id: string;
  session_id: string;
  user_id: string;
  role: ChatRole;
  content: string;
  provider: string | null;
  model: string | null;
  created_at: string;
}): ChatMessage {
  return {
    id: row.id,
    sessionId: row.session_id,
    userId: row.user_id,
    role: row.role,
    content: row.content,
    provider: row.provider,
    model: row.model,
    createdAt: row.created_at,
  };
}

export const chatService = {
  async createSession(input: CreateChatSessionInput = {}): Promise<ChatSession> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: userId,
        title: input.title?.trim() || "New conversation",
        memory_snapshot: input.memorySnapshot ?? null,
        metadata: input.metadata ?? null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapSession(data);
  },

  async getOrCreateSession(): Promise<ChatSession> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapSession(data) : this.createSession();
  },

  async addMessage(input: AddChatMessageInput): Promise<ChatMessage> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: input.sessionId,
        user_id: userId,
        role: input.role,
        content: input.content,
        provider: input.provider ?? null,
        model: input.model ?? null,
        tokens: input.tokens ?? null,
        metadata: input.metadata ?? null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    await supabase
      .from("chat_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", input.sessionId)
      .eq("user_id", userId);

    return mapMessage(data);
  },

  async listMessages(sessionId: string): Promise<ChatMessage[]> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return data.map(mapMessage);
  },
};
