import { useCallback, useEffect, useMemo, useState } from "react";

import { hasSupabaseConfig } from "@/config/env";
import { aiService } from "@/services/ai/aiService";
import { chatService } from "@/services/chatService";
import { useAuthStore } from "@/store/authStore";
import { useMockAgentStore } from "@/store/mockAgentStore";
import type { ChatMessageDraft, ChatSession } from "@/types/chat";
import { getErrorMessage } from "@/utils/errors";

const localGreeting: ChatMessageDraft = {
  role: "assistant",
  content: "我会先作为你当前会话里的数字分身，帮你整理想法、计划和记录。",
};

export function useChat() {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const hasRemoteBackend = useAuthStore((state) => state.hasRemoteBackend);
  const localMessages = useMockAgentStore((state) => state.messages);
  const replaceLocalMessages = useMockAgentStore((state) => state.replaceMessages);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [remoteMessages, setRemoteMessages] = useState<ChatMessageDraft[]>([localGreeting]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canPersist = hasSupabaseConfig && hasRemoteBackend && Boolean(user);

  const messages = useMemo(() => {
    if (canPersist) {
      return remoteMessages;
    }

    return localMessages.length > 0 ? localMessages : [localGreeting];
  }, [canPersist, localMessages, remoteMessages]);

  const setMessages = useCallback(
    (nextMessages: ChatMessageDraft[]) => {
      if (canPersist) {
        setRemoteMessages(nextMessages);
        return;
      }

      replaceLocalMessages(nextMessages);
    },
    [canPersist, replaceLocalMessages],
  );

  const loadSession = useCallback(async () => {
    setError(null);

    if (!canPersist) {
      if (localMessages.length === 0) {
        replaceLocalMessages([localGreeting]);
      }
      return;
    }

    try {
      const nextSession = await chatService.getOrCreateSession();
      const storedMessages = await chatService.listMessages(nextSession.id);

      setSession(nextSession);
      setRemoteMessages(
        storedMessages.length > 0
          ? storedMessages.map((message) => ({ role: message.role, content: message.content }))
          : [localGreeting],
      );
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  }, [canPersist, localMessages.length, replaceLocalMessages]);

  useEffect(() => {
    if (!isAuthLoading) {
      void loadSession();
    }
  }, [isAuthLoading, loadSession]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessageDraft = { role: "user", content };
      const nextMessages = [...messages, userMessage];

      setMessages(nextMessages);
      setIsLoading(true);
      setError(null);

      try {
        let activeSession = session;

        if (canPersist && !activeSession) {
          activeSession = await chatService.getOrCreateSession();
          setSession(activeSession);
        }

        if (activeSession) {
          await chatService.addMessage({ sessionId: activeSession.id, role: "user", content });
        }

        const reply = await aiService.generateChatReply({ messages: nextMessages });
        const assistantMessage: ChatMessageDraft = { role: "assistant", content: reply };
        const finalMessages = [...nextMessages, assistantMessage];
        setMessages(finalMessages);

        if (activeSession) {
          await chatService.addMessage({ sessionId: activeSession.id, role: "assistant", content: reply });
        }

        return reply;
      } catch (sendError) {
        const message = getErrorMessage(sendError);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [canPersist, messages, session, setMessages],
  );

  return {
    messages,
    isLoading,
    error,
    canPersist,
    sendMessage,
    reload: loadSession,
  };
}
