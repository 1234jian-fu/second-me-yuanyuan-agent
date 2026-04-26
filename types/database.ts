export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          persona_summary: string | null;
          memory_summary: string | null;
          settings: JsonValue | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          persona_summary?: string | null;
          memory_summary?: string | null;
          settings?: JsonValue | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          persona_summary?: string | null;
          memory_summary?: string | null;
          settings?: JsonValue | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      text_entries: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          content: string;
          mood: string | null;
          tags: string[];
          summary: string | null;
          metadata: JsonValue | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          content: string;
          mood?: string | null;
          tags?: string[];
          summary?: string | null;
          metadata?: JsonValue | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string | null;
          content?: string;
          mood?: string | null;
          tags?: string[];
          summary?: string | null;
          metadata?: JsonValue | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      audio_entries: {
        Row: {
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
          metadata: JsonValue | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          storage_path: string;
          public_url?: string | null;
          duration_seconds?: number | null;
          mime_type?: string | null;
          file_size?: number | null;
          transcript?: string | null;
          transcript_status?: "pending" | "processing" | "completed" | "failed" | null;
          summary?: string | null;
          metadata?: JsonValue | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string | null;
          public_url?: string | null;
          duration_seconds?: number | null;
          mime_type?: string | null;
          file_size?: number | null;
          transcript?: string | null;
          transcript_status?: "pending" | "processing" | "completed" | "failed" | null;
          summary?: string | null;
          metadata?: JsonValue | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          summary: string | null;
          memory_snapshot: JsonValue | null;
          metadata: JsonValue | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          summary?: string | null;
          memory_snapshot?: JsonValue | null;
          metadata?: JsonValue | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string | null;
          summary?: string | null;
          memory_snapshot?: JsonValue | null;
          metadata?: JsonValue | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          role: "system" | "user" | "assistant";
          content: string;
          provider: string | null;
          model: string | null;
          tokens: number | null;
          metadata: JsonValue | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          role: "system" | "user" | "assistant";
          content: string;
          provider?: string | null;
          model?: string | null;
          tokens?: number | null;
          metadata?: JsonValue | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          provider?: string | null;
          model?: string | null;
          tokens?: number | null;
          metadata?: JsonValue | null;
        };
        Relationships: [];
      };
      plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          plan_date: string;
          status: "todo" | "done" | "archived";
          source: "manual" | "ai";
          priority: number | null;
          sort_order: number | null;
          metadata: JsonValue | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          plan_date: string;
          status?: "todo" | "done" | "archived";
          source?: "manual" | "ai";
          priority?: number | null;
          sort_order?: number | null;
          metadata?: JsonValue | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          plan_date?: string;
          status?: "todo" | "done" | "archived";
          source?: "manual" | "ai";
          priority?: number | null;
          sort_order?: number | null;
          metadata?: JsonValue | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
