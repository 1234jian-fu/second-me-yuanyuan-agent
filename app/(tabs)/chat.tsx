import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PageContainer } from "@/components/PageContainer";
import { AppText } from "@/components/ui";
import { YuanChip, YuanGlass, YuanIconButton } from "@/components/yuanyuan/YuanUI";
import { colors, fontFamilies, layout, radius, shadows, spacing } from "@/config/theme";
import { useChat } from "@/hooks/useChat";
import type { ChatMessageDraft } from "@/types/chat";

type ChatMessageWithRefs = ChatMessageDraft & { refs?: string[] };
type WebSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type VoiceState = "idle" | "listening" | "processing" | "speaking" | "error";

const skills = ["复盘", "目标对齐", "自我观察", "决策辅助"];

const starterMessages: ChatMessageWithRefs[] = [
  {
    role: "assistant",
    content: "晨安。我看到你昨晚 23:10 写了关于「产品方向」的反思，要不要从那里聊起？",
    refs: ["记忆 · 昨天 23:10 · 文字"],
  },
  {
    role: "user",
    content: "嗯，我最近老是在做了一半就想推翻重来。是不是我太焦虑了？",
  },
  {
    role: "assistant",
    content:
      "我翻了你最近 30 天的记录，「推翻重来」出现过 6 次，多发生在晚上独处的时候。但真正落地的版本，往往是你早晨散步后做出的决定。\n\n这未必是焦虑，更像是你独处时倾向于审视，而行动时更果断。",
    refs: ["画像 · 决策模式", "记忆 · 近 30 天 · 6 条"],
  },
];

function getWebSpeechRecognition() {
  const scope = globalThis as unknown as {
    SpeechRecognition?: new () => WebSpeechRecognition;
    webkitSpeechRecognition?: new () => WebSpeechRecognition;
  };

  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition;
}

function speakReply(text: string) {
  return new Promise<void>((resolve) => {
    if (Platform.OS !== "web") {
      resolve();
      return;
    }

    const scope = globalThis as unknown as {
      speechSynthesis?: {
        cancel: () => void;
        speak: (utterance: SpeechSynthesisUtterance) => void;
      };
      SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance;
    };

    if (!scope.speechSynthesis || !scope.SpeechSynthesisUtterance) {
      resolve();
      return;
    }

    scope.speechSynthesis.cancel();
    const utterance = new scope.SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    scope.speechSynthesis.speak(utterance);
  });
}

function stopSpeaking() {
  if (Platform.OS !== "web") {
    return;
  }

  const scope = globalThis as unknown as { speechSynthesis?: { cancel: () => void } };
  scope.speechSynthesis?.cancel();
}

export default function ChatTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ prompt?: string | string[] }>();
  const { isLoading, error, messages, sendMessage } = useChat();
  const recognitionRef = useRef<WebSpeechRecognition | null>(null);
  const voiceLoopRef = useRef(false);
  const voiceOpenRef = useRef(false);
  const voiceRestartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [handledPrompt, setHandledPrompt] = useState<string | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceLoopEnabled, setVoiceLoopEnabled] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("点击开始，像打电话一样和渊元说话");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceReply, setVoiceReply] = useState("");
  const normalizedPrompt = useMemo(
    () => (Array.isArray(params.prompt) ? params.prompt[0] : params.prompt)?.trim() ?? "",
    [params.prompt],
  );

  useEffect(() => {
    if (!normalizedPrompt || handledPrompt === normalizedPrompt) {
      return;
    }

    setInput(normalizedPrompt);
    setHandledPrompt(normalizedPrompt);
  }, [handledPrompt, normalizedPrompt]);

  useEffect(() => {
    voiceOpenRef.current = voiceOpen;
  }, [voiceOpen]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (voiceRestartTimerRef.current) {
        clearTimeout(voiceRestartTimerRef.current);
      }
      stopSpeaking();
    };
  }, []);

  const conversationMessages = messages.filter((message) => message.content !== "我会先作为你当前会话里的数字分身，帮你整理想法、计划和记录。");
  const visibleMessages: ChatMessageWithRefs[] =
    conversationMessages.length > 0 ? [...starterMessages, ...conversationMessages] : starterMessages;

  async function handleSend(contentOverride?: string) {
    const content = (contentOverride ?? input).trim();

    if (!content) {
      setStatus("先输入一点想聊的内容。");
      return;
    }

    try {
      await sendMessage(content);
      setInput("");
      setStatus(null);
    } catch {
      setStatus("发送失败，稍后再试。");
    }
  }

  function scheduleNextListeningTurn() {
    if (!voiceLoopRef.current || !voiceOpenRef.current) {
      setVoiceState("idle");
      setVoiceStatus("本轮语音已结束，可以继续说话。");
      return;
    }

    setVoiceStatus("我会继续听，你可以接着说。");
    voiceRestartTimerRef.current = setTimeout(() => {
      if (voiceLoopRef.current && voiceOpenRef.current) {
        startVoiceChat(true);
      }
    }, 650);
  }

  async function sendVoiceText(text: string) {
    setVoiceState("processing");
    setVoiceStatus("渊元正在思考…");
    setVoiceReply("");

    try {
      const reply = await sendMessage(text);
      setVoiceReply(reply);
      setVoiceState("speaking");
      setVoiceStatus("正在播放回复");
      await speakReply(reply);
      scheduleNextListeningTurn();
    } catch {
      setVoiceState("error");
      setVoiceStatus("语音对话失败，请稍后再试。");
    }
  }

  function startVoiceChat(continueLoop = false) {
    if (Platform.OS !== "web") {
      setVoiceState("error");
      setVoiceStatus("移动端语音识别接口已预留。当前先在 Web 预览中体验语音对话。");
      return;
    }

    const SpeechRecognition = getWebSpeechRecognition();
    if (!SpeechRecognition) {
      setVoiceState("error");
      setVoiceStatus("当前浏览器不支持语音识别，请用 Chrome / Edge 打开。");
      return;
    }

    if (voiceRestartTimerRef.current) {
      clearTimeout(voiceRestartTimerRef.current);
      voiceRestartTimerRef.current = null;
    }

    recognitionRef.current?.stop();
    stopSpeaking();
    voiceLoopRef.current = true;
    setVoiceLoopEnabled(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    if (!continueLoop) {
      setVoiceTranscript("");
      setVoiceReply("");
    }
    setVoiceState("listening");
    setVoiceStatus("我在听，你可以开始说话。说完后会自动发送。");
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() ?? "";
      setVoiceTranscript(transcript);
      setIsListening(false);

      if (!transcript) {
        setVoiceState("error");
        setVoiceStatus("没有听清，可以再说一次。");
        return;
      }

      void sendVoiceText(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setVoiceState("error");
      setVoiceStatus("没有成功识别到语音，请检查浏览器麦克风权限。");
    };
    recognition.onend = () => {
      setIsListening(false);
      if (voiceState === "listening") {
        setVoiceStatus("聆听已暂停，可以再点一次开始说话。");
      }
    };
    recognition.start();
  }

  function pauseVoiceChat() {
    voiceLoopRef.current = false;
    setVoiceLoopEnabled(false);
    if (voiceRestartTimerRef.current) {
      clearTimeout(voiceRestartTimerRef.current);
      voiceRestartTimerRef.current = null;
    }
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    stopSpeaking();
    setIsListening(false);
    setVoiceState("idle");
    setVoiceStatus("语音通话已暂停。");
  }

  function closeVoiceChat() {
    pauseVoiceChat();
    setVoiceOpen(false);
  }

  return (
    <PageContainer ambient contentStyle={styles.container}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <MaterialSymbol name="ai" size={20} color={colors.primaryPressed} />
            </View>
            <View>
              <AppText variant="sectionTitle" style={styles.agentName}>
                渊元
              </AppText>
              <AppText variant="caption" style={styles.agentMeta}>
                另一个我 · 已读取 {messages.length + 308} 条记忆
              </AppText>
            </View>
          </View>
          <View style={styles.headerActions}>
            <YuanIconButton icon="mic" onPress={() => setVoiceOpen(true)} />
            <YuanIconButton icon="bookmark" onPress={() => router.push("/chat-feedback")} />
          </View>
        </View>

        <View style={styles.messages}>
          {visibleMessages.map((message, index) => {
            const isUser = message.role === "user";
            const refs = message.refs ?? (!isUser ? ["记忆 · 最近记录", "画像 · 当前模式"] : []);

            return (
              <View key={`${message.role}-${index}`} style={[styles.messageBlock, isUser && styles.messageBlockUser]}>
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                  <AppText variant="body" style={isUser ? styles.userText : styles.aiText}>
                    {message.content}
                  </AppText>
                </View>
                {!isUser && refs.length > 0 ? (
                  <View style={styles.refRow}>
                    {refs.map((ref) => (
                      <View key={ref} style={styles.refPill}>
                        <AppText variant="micro" style={styles.refText}>
                          {ref}
                        </AppText>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.skillRow}>
          {skills.map((skill) => (
            <YuanChip key={skill} label={skill} onPress={() => void handleSend(`帮我做一次${skill}`)} />
          ))}
        </View>

        {status || error ? (
          <AppText variant="caption" style={styles.statusText}>
            {status ?? error}
          </AppText>
        ) : null}
      </View>

      <View pointerEvents="box-none" style={[styles.composerDock, { bottom: insets.bottom + 96 }]}>
        <YuanGlass style={styles.composer}>
          <Pressable accessibilityRole="button" style={styles.plusButton}>
            <MaterialSymbol name="addCircle" size={21} color={colors.primaryPressed} />
          </Pressable>
          <TextInput
            accessibilityLabel="输入对话"
            onChangeText={setInput}
            onSubmitEditing={() => void handleSend()}
            placeholder="对渊元说点什么……"
            placeholderTextColor={colors.textFaint}
            returnKeyType="send"
            style={styles.input}
            value={input}
          />
          <Pressable
            accessibilityLabel="打开语音对话"
            accessibilityRole="button"
            onPress={() => setVoiceOpen(true)}
            style={({ pressed }) => [styles.voiceMiniButton, pressed && styles.pressed]}
          >
            <MaterialSymbol name="mic" size={19} color={colors.primaryPressed} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={isLoading}
            onPress={() => void handleSend()}
            style={({ pressed }) => [styles.sendButton, pressed && styles.pressed, isLoading && styles.disabled]}
          >
            <MaterialSymbol name="send" size={18} color={colors.onPrimary} />
          </Pressable>
        </YuanGlass>
      </View>

      <Modal animationType="fade" transparent visible={voiceOpen} onRequestClose={closeVoiceChat}>
        <View style={styles.voiceOverlay}>
          <YuanGlass style={styles.voicePanel}>
            <View style={styles.voiceHeader}>
              <View>
                <AppText variant="micro" style={styles.voiceKicker}>
                  VOICE CHAT
                </AppText>
                <AppText variant="sectionTitle">和渊元语音对话</AppText>
              </View>
              <YuanIconButton icon="close" onPress={closeVoiceChat} />
            </View>

            <View style={[styles.voiceOrb, isListening && styles.voiceOrbListening, voiceState === "speaking" && styles.voiceOrbSpeaking]}>
              <MaterialSymbol name={isListening ? "pause" : "mic"} size={42} color={colors.onPrimary} />
            </View>

            <View style={styles.voiceStateRow}>
              {[
                { key: "listening", label: "聆听" },
                { key: "processing", label: "思考" },
                { key: "speaking", label: "播放" },
              ].map((item) => (
                <View key={item.key} style={[styles.voiceStep, voiceState === item.key && styles.voiceStepActive]}>
                  <AppText variant="micro" style={voiceState === item.key ? styles.voiceStepActiveText : styles.voiceStepText}>
                    {item.label}
                  </AppText>
                </View>
              ))}
            </View>

            <AppText variant="bodyStrong" style={styles.voiceStatus}>
              {voiceStatus}
            </AppText>
            {voiceTranscript ? (
              <View style={styles.voiceTextCard}>
                <AppText variant="caption" style={styles.voiceLabel}>你说</AppText>
                <AppText variant="body">{voiceTranscript}</AppText>
              </View>
            ) : null}
            {voiceReply ? (
              <View style={styles.voiceTextCard}>
                <AppText variant="caption" style={styles.voiceLabel}>渊元回复</AppText>
                <AppText variant="body">{voiceReply}</AppText>
              </View>
            ) : null}

            <View style={styles.voiceActions}>
              <Pressable
                accessibilityRole="button"
                disabled={isLoading}
                onPress={() => startVoiceChat()}
                style={({ pressed }) => [styles.voicePrimaryButton, pressed && styles.pressed, isLoading && styles.disabled]}
              >
                <MaterialSymbol name="mic" size={22} color={colors.onPrimary} />
                <AppText variant="bodyStrong" style={styles.voicePrimaryText}>
                  {voiceLoopEnabled ? "继续说话" : "开始通话"}
                </AppText>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={pauseVoiceChat} style={styles.voiceSecondaryButton}>
                <AppText variant="bodyStrong" style={styles.voiceSecondaryText}>
                  暂停
                </AppText>
              </Pressable>
            </View>
          </YuanGlass>
        </View>
      </Modal>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: layout.screenMaxWidth,
    paddingHorizontal: 22,
  },
  screen: {
    gap: spacing.lg,
    paddingBottom: 112,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
    ...shadows.card,
  },
  agentName: {
    letterSpacing: 3,
  },
  agentMeta: {
    color: colors.primary,
    fontWeight: "800",
  },
  messages: {
    gap: spacing.lg,
  },
  messageBlock: {
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  messageBlockUser: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "86%",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.card,
  },
  aiBubble: {
    borderRadius: 23,
    borderTopLeftRadius: 9,
    backgroundColor: "rgba(255,255,255,0.68)",
  },
  userBubble: {
    borderRadius: 23,
    borderTopRightRadius: 9,
    backgroundColor: colors.primary,
  },
  aiText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 27,
  },
  userText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 27,
  },
  refRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  refPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    backgroundColor: "rgba(255,255,255,0.74)",
  },
  refText: {
    color: colors.primary,
  },
  skillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  composer: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: 24,
    padding: spacing.sm,
  },
  composerDock: {
    position: "absolute",
    left: 22,
    right: 22,
    zIndex: 20,
  },
  plusButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.58)",
  },
  voiceMiniButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
  },
  input: {
    flex: 1,
    minHeight: 42,
    color: colors.text,
    fontFamily: fontFamilies.cnMedium,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  voiceOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: "rgba(16,35,52,0.26)",
  },
  voicePanel: {
    width: "100%",
    maxWidth: layout.screenMaxWidth,
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: 32,
    backgroundColor: "rgba(248,252,255,0.95)",
  },
  voiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  voiceKicker: {
    color: colors.primary,
    letterSpacing: 4,
  },
  voiceOrb: {
    alignSelf: "center",
    width: 126,
    height: 126,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 30,
  },
  voiceOrbListening: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 1.04 }],
  },
  voiceOrbSpeaking: {
    backgroundColor: colors.success,
  },
  voiceStateRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  voiceStep: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.58)",
  },
  voiceStepActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  voiceStepText: {
    color: colors.textMuted,
  },
  voiceStepActiveText: {
    color: colors.primaryPressed,
    fontWeight: "800",
  },
  voiceStatus: {
    textAlign: "center",
  },
  voiceTextCard: {
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.68)",
  },
  voiceLabel: {
    color: colors.primary,
    fontWeight: "800",
  },
  voiceActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  voicePrimaryButton: {
    flex: 1,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  voicePrimaryText: {
    color: colors.onPrimary,
  },
  voiceSecondaryButton: {
    width: 86,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  voiceSecondaryText: {
    color: colors.primaryPressed,
  },
  statusText: {
    color: colors.danger,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
