import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import { type MockPlan, type MockRecord, mockMessages, mockPlans, mockRecords } from "@/data/mockData";
import type { CaptureStatus } from "@/types/capture";
import type { ChatMessageDraft } from "@/types/chat";
import { formatDuration } from "@/utils/format";
import { createSimplePlanTitles } from "@/utils/planTemplates";

const { createJSONStorage, persist } =
  require("zustand/middleware") as typeof import("zustand/middleware");

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function buildAudioDescription(input: AddAudioPlaceholderInput) {
  const duration = formatDuration(input.durationSeconds);
  if (input.errorMessage) {
    return `录音 ${duration} · 云端保存失败，已保留本地待处理记录。`;
  }

  return `录音 ${duration} · 已进入本地采集队列。`;
}

function createMockReply(input: string) {
  if (input.includes("计划") || input.includes("安排") || input.includes("目标")) {
    return "我建议先把目标压小：选一件最重要的事，给它 25 分钟，然后记录完成后的感受。这样更容易开始，也更容易形成连续性。";
  }

  if (input.includes("焦虑") || input.includes("累") || input.includes("压力")) {
    return "我听到你有点紧。先不用急着解决全部问题，可以先写下此刻最消耗你的一个点，再决定下一步最小动作。";
  }

  if (input.includes("复盘")) {
    return "可以。我们先看三个问题：今天最值得保留的瞬间是什么？最消耗你的环节是什么？明天只推进一件事的话，它会是什么？";
  }

  return `我听到了：「${input}」。我会先帮你把它整理成更清晰的想法，后续接入真实 AI 后会结合你的记录和画像给出更贴近的建议。`;
}

function createMockGeneratedPlan(prompt: string): MockPlan[] {
  return createSimplePlanTitles(prompt).map((title) => ({
    id: createId("plan"),
    title,
    done: false,
  }));
}

type MockAgentState = {
  records: MockRecord[];
  plans: MockPlan[];
  messages: ChatMessageDraft[];
  replaceMessages: (messages: ChatMessageDraft[]) => void;
  addTextRecord: (input: {
    title?: string;
    content: string;
    captureStatus?: CaptureStatus;
    cloudTaskId?: string;
  }) => MockRecord;
  addMoodRecord: (input: { mood: string; note?: string }) => void;
  addAudioPlaceholder: (input?: AddAudioPlaceholderInput) => MockRecord;
  updateRecordCaptureStatus: (
    id: string,
    input: { captureStatus: CaptureStatus; cloudTaskId?: string; description?: string },
  ) => void;
  addManualPlan: (title: string) => void;
  generatePlan: (prompt: string) => void;
  togglePlan: (id: string, done: boolean) => void;
  sendMockMessage: (content: string) => void;
  clearAllData: () => void;
};

type AddAudioPlaceholderInput = {
  durationSeconds?: number | null;
  fileSize?: number | null;
  localUri?: string;
  captureStatus?: CaptureStatus;
  cloudTaskId?: string;
  errorMessage?: string;
};

const defaultGreeting: ChatMessageDraft = {
  role: "assistant",
  content: "我会先作为你当前会话里的数字分身，帮你整理想法、计划和记录。",
};

export const useMockAgentStore = create<MockAgentState>()(
  persist(
    (set) => ({
      records: mockRecords,
      plans: mockPlans,
      messages: mockMessages,

      replaceMessages: (messages) =>
        set({
          messages: messages.length > 0 ? messages : [defaultGreeting],
        }),

      addTextRecord: ({ title, content, captureStatus = "queued", cloudTaskId }) => {
        const record: MockRecord = {
          id: createId("record"),
          title: title?.trim() || "未命名文字记录",
          type: "text",
          description: content.trim(),
          time: getCurrentTimeLabel(),
          captureStatus,
          captureSource: "mobile-text",
          cloudTaskId,
        };

        set((state) => ({
          records: [record, ...state.records],
        }));

        return record;
      },

      addMoodRecord: ({ mood, note }) =>
        set((state) => ({
          records: [
            {
              id: createId("record"),
              title: `心情记录：${mood}`,
              type: "text",
              description: note?.trim() || `今天的心情是「${mood}」。`,
              time: getCurrentTimeLabel(),
              captureStatus: "completed",
              captureSource: "mock",
            },
            ...state.records,
          ],
        })),

      addAudioPlaceholder: (input = {}) => {
        const record: MockRecord = {
          id: createId("record"),
          title: input.errorMessage ? "待重试语音记录" : "本地语音记录",
          type: "audio",
          description: buildAudioDescription(input),
          time: getCurrentTimeLabel(),
          captureStatus: input.captureStatus ?? "queued",
          captureSource: "mobile-audio",
          cloudTaskId: input.cloudTaskId,
        };

        set((state) => ({
          records: [record, ...state.records],
        }));

        return record;
      },

      updateRecordCaptureStatus: (id, input) =>
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id
              ? {
                  ...record,
                  captureStatus: input.captureStatus,
                  cloudTaskId: input.cloudTaskId ?? record.cloudTaskId,
                  description: input.description ?? record.description,
                }
              : record,
          ),
        })),

      addManualPlan: (title) =>
        set((state) => ({
          plans: [{ id: createId("plan"), title: title.trim(), done: false }, ...state.plans],
        })),

      generatePlan: (prompt) =>
        set((state) => ({
          plans: [...createMockGeneratedPlan(prompt), ...state.plans],
        })),

      togglePlan: (id, done) =>
        set((state) => ({
          plans: state.plans.map((plan) => (plan.id === id ? { ...plan, done } : plan)),
        })),

      sendMockMessage: (content) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { role: "user", content },
            { role: "assistant", content: createMockReply(content) },
          ],
        })),

      clearAllData: () =>
        set({
          records: [],
          plans: [],
          messages: [defaultGreeting],
        }),
    }),
    {
      name: "second-me-local-agent",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        messages: state.messages,
        plans: state.plans,
        records: state.records,
      }),
    },
  ),
);
