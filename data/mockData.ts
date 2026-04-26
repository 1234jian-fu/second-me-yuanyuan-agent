import type { ChatMessageDraft } from "@/types/chat";
import type { CaptureSource, CaptureStatus } from "@/types/capture";

export type MockRecord = {
  id: string;
  title: string;
  type: "text" | "audio";
  description: string;
  time: string;
  captureStatus?: CaptureStatus;
  captureSource?: CaptureSource;
  cloudTaskId?: string;
};

export type MockPlan = {
  id: string;
  title: string;
  done: boolean;
};

export const mockRecords: MockRecord[] = [
  {
    id: "record_1",
    title: "晨间散步随想",
    type: "audio",
    description: "08:24 · 录音 4'12\"",
    time: "08:24",
    captureStatus: "completed",
    captureSource: "mock",
  },
  {
    id: "record_2",
    title: "想到的产品命名",
    type: "text",
    description: "10:02 · 文字 142 字",
    time: "10:02",
    captureStatus: "completed",
    captureSource: "mock",
  },
  {
    id: "record_3",
    title: "关于产品方向的几个想法",
    type: "text",
    description: "23:10 · 文字 320 字",
    time: "23:10",
    captureStatus: "processing",
    captureSource: "mock",
  },
  {
    id: "record_4",
    title: "和朋友聊到的成长困境",
    type: "audio",
    description: "19:45 · 录音 8'07\"",
    time: "19:45",
    captureStatus: "completed",
    captureSource: "mock",
  },
];

export const mockMessages: ChatMessageDraft[] = [
  {
    role: "assistant",
    content: "晨安。我看到你昨晚 23:10 写了关于「产品方向」的反思，要不要从那里聊起？",
  },
  {
    role: "user",
    content: "嗯，我最近老是在做了一半就想推翻重来。是不是我太焦虑了？",
  },
  {
    role: "assistant",
    content:
      "我翻了你最近 30 天的记录，「推翻重来」出现过 6 次，多发生在晚上独处的时候。但真正落地的版本，往往是你早晨散步后做出的决定。\n\n这未必是焦虑，更像是你独处时倾向于审视，而行动时更果断。",
  },
];

export const mockPlans: MockPlan[] = [
  { id: "plan_1", title: "完成一条有价值的记录", done: true },
  { id: "plan_2", title: "整理今天最重要的三个想法", done: false },
  { id: "plan_3", title: "晚上做一次十分钟复盘", done: false },
];
