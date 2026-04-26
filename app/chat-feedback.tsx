import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  ChatFeedbackAnswerCard,
  ChatFeedbackFollowUps,
  ChatFeedbackInputDock,
  ChatFeedbackPersona,
  ChatFeedbackSummaryCard,
  ChatFeedbackUserCard,
} from "@/components/chatFeedback/ChatFeedbackContent";
import { ChatFeedbackTopBar } from "@/components/chatFeedback/ChatFeedbackTopBar";
import type { MaterialSymbolName } from "@/components/MaterialSymbol";
import { PageContainer } from "@/components/PageContainer";
import { SoftBackdrop } from "@/components/SoftBackdrop";
import { layout, spacing } from "@/config/theme";
import { useChat } from "@/hooks/useChat";

const followUpGroups = [
  [
    "帮我拆解今天最重要的事",
    "把这个结论改成 3 个行动步骤",
    "结合最近记录继续分析我现在的状态",
    "帮我做一个更轻量的计划",
  ],
  [
    "如果我现在只做一件事，应该做什么",
    "把这段对话整理成一句提醒",
    "我为什么会拖延，帮我分析一下",
    "用更温和的方式再给我一次建议",
  ],
];

function createFeedbackPoints(answer: string) {
  const base: Array<{ icon: MaterialSymbolName; title: string; body: string }> = [
    {
      icon: "list",
      title: "理清重点",
      body: "先把当前最重要的 1 到 2 件事明确下来，避免同时背太多负担。",
    },
    {
      icon: "selfCare",
      title: "调整节奏",
      body: "把任务拆小一点，给自己留出恢复和喘息的空间。",
    },
    {
      icon: "water",
      title: "稳定情绪",
      body: "如果已经觉得乱，先停下来处理情绪，再继续推进任务。",
    },
  ];

  if (answer.includes("计划")) {
    base[0] = {
      icon: "task",
      title: "先定一个小计划",
      body: "把现在这段思路先转成一条最小可执行动作，马上开始会更轻松。",
    };
  }

  return base;
}

function createSummary(answer: string) {
  const normalized = answer.trim();
  if (!normalized) {
    return "这次对话已经生成，但摘要内容还不完整。你可以继续追问，让渊元帮你补全。";
  }

  return normalized.length > 110 ? `${normalized.slice(0, 110)}…` : normalized;
}

function createTags(text: string) {
  const tags = new Set<string>();
  const content = text.toLowerCase();

  if (content.includes("计划") || content.includes("任务")) {
    tags.add("# 任务管理");
  }
  if (content.includes("情绪") || content.includes("焦虑") || content.includes("压力")) {
    tags.add("# 情绪压力");
  }
  if (content.includes("休息") || content.includes("节奏") || content.includes("精力")) {
    tags.add("# 精力管理");
  }

  if (tags.size === 0) {
    tags.add("# 当前会话");
    tags.add("# 自我整理");
  }

  return [...tags].slice(0, 3);
}

export default function ChatFeedbackScreen() {
  const router = useRouter();
  const { messages } = useChat();
  const [followUpIndex, setFollowUpIndex] = useState(0);

  const lastUserMessage =
    [...messages].reverse().find((message) => message.role === "user")?.content ??
    "先从最近的感受、一个困扰，或者今天最重要的事开始。";

  const lastAssistantMessage =
    [...messages].reverse().find((message) => message.role === "assistant")?.content ??
    "我已经准备好继续和你整理这段会话。";

  const followUps = useMemo(() => followUpGroups[followUpIndex % followUpGroups.length], [followUpIndex]);
  const summary = createSummary(lastAssistantMessage);
  const tags = createTags(`${lastUserMessage} ${lastAssistantMessage}`);
  const feedbackPoints = createFeedbackPoints(lastAssistantMessage);

  return (
    <PageContainer ambient={false} contentStyle={styles.container}>
      <SoftBackdrop variant="chatFeedback" />

      <View style={styles.screen}>
        <ChatFeedbackTopBar onBack={() => router.back()} />
        <ChatFeedbackPersona subtitle="基于你刚刚的对话内容，先帮你整理当前结论和下一步。" />
        <ChatFeedbackUserCard content={lastUserMessage} />
        <ChatFeedbackAnswerCard content={lastAssistantMessage} points={feedbackPoints} />
        <ChatFeedbackSummaryCard content={summary} tags={tags} />
        <ChatFeedbackFollowUps
          items={followUps}
          onPressItem={(item) => router.push(`/chat?prompt=${encodeURIComponent(item)}`)}
          onRefresh={() => setFollowUpIndex((current) => current + 1)}
        />
        <ChatFeedbackInputDock
          onPressText={() => router.push("/chat")}
          onPressVoice={() => router.push("/chat")}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: layout.screenMaxWidth,
    paddingHorizontal: spacing.lg,
    paddingTop: 0,
  },
  screen: {
    flex: 1,
    gap: spacing.xl,
  },
});
