export type ChatRole = "system" | "user" | "assistant";

export type ChatMessageDraft = {
  role: ChatRole;
  content: string;
};

export type ChatMessage = ChatMessageDraft & {
  id: string;
  sessionId: string;
  userId: string;
  provider?: string | null;
  model?: string | null;
  createdAt: string;
};

export type ChatSession = {
  id: string;
  userId: string;
  title: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
};
