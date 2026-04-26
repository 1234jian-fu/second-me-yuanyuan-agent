"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  chatSessions,
  importTasks,
  insightsByRange,
  libraryItems,
  notifications,
  personaModules,
  personaTimeline,
  settingsState,
  summaries,
} from "@/lib/mock-data";
import {
  buildImportSteps,
  createContextByMode,
  createImportTask,
  deriveDashboardStats,
  exportAsJson,
  filterLibraryItems,
  generateAssistantReply,
  generateSummary,
  getInsightDataset,
  makeNewSession,
  nowLabel,
  regenerateSummaryCard,
} from "@/services/mockService";
import type {
  ChatMode,
  ImportTaskStatus,
  InsightRange,
  LibrarySort,
  LibraryTimeFilter,
  PersonaModule,
  SummaryTab,
  ToastItem,
} from "@/types/desk";

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

type DeskState = {
  notificationsOpen: boolean;
  dashboardQuery: string;
  toasts: ToastItem[];
  notifications: typeof notifications;

  libraryItems: typeof libraryItems;
  libraryQuery: string;
  libraryType: "all" | "text" | "audio" | "chat" | "image" | "video";
  libraryTime: LibraryTimeFilter;
  librarySource: "all" | "mobile" | "web" | "import";
  librarySort: LibrarySort;
  selectedLibraryId: string | null;

  activeSummaryTab: SummaryTab;
  summaryItems: typeof summaries;
  selectedSummaryId: string | null;

  personaModules: typeof personaModules;
  personaTimeline: typeof personaTimeline;
  selectedPersonaModuleId: string;

  chatMode: ChatMode;
  chatSessions: typeof chatSessions;
  activeChatId: string;
  chatGroupCollapsed: Record<"today" | "recent", boolean>;

  importTasks: typeof importTasks;
  selectedImportId: string | null;

  insightRange: InsightRange;
  selectedInsightId: string | null;
  selectedMilestoneId: string | null;
  selectedMetric: string | null;

  settings: typeof settingsState;

  setDashboardQuery: (query: string) => void;
  toggleNotifications: (open?: boolean) => void;
  pushToast: (title: string, tone?: ToastItem["tone"]) => void;
  removeToast: (id: string) => void;
  markNotificationRead: (id: string) => void;

  setLibraryQuery: (query: string) => void;
  setLibraryType: (type: DeskState["libraryType"]) => void;
  setLibraryTime: (time: LibraryTimeFilter) => void;
  setLibrarySource: (source: DeskState["librarySource"]) => void;
  setLibrarySort: (sort: LibrarySort) => void;
  selectLibraryItem: (id: string | null) => void;
  toggleLibraryImportant: (id: string) => void;
  updateLibraryTags: (id: string, tags: string[]) => void;
  deleteLibraryItem: (id: string) => void;

  setSummaryTab: (tab: SummaryTab) => void;
  selectSummary: (id: string | null) => void;
  generateNewSummary: () => void;
  regenerateSummary: (id: string) => void;

  selectPersonaModule: (id: string) => void;
  exportPersona: () => void;

  setChatMode: (mode: ChatMode) => void;
  toggleChatGroup: (group: "today" | "recent") => void;
  setActiveChat: (id: string) => void;
  createNewChat: (prompt?: string) => string;
  sendChatMessage: (content: string) => void;
  clearActiveChat: () => void;
  exportActiveChat: () => void;

  selectImportTask: (id: string | null) => void;
  createUploadTask: (fileName: string) => void;
  reprocessImportTask: (id: string) => void;
  deleteImportTask: (id: string) => void;
  failImportTask: (id: string) => void;

  setInsightRange: (range: InsightRange) => void;
  selectInsightCard: (id: string | null) => void;
  selectMilestone: (id: string | null) => void;
  setSelectedMetric: (metric: string | null) => void;

  updateSetting: <K extends keyof DeskState["settings"]>(key: K, value: DeskState["settings"][K]) => void;
  runManualSync: () => void;
  deleteAllRecords: () => void;
  deletePersona: () => void;
  exportAllData: () => void;
};

export const useDeskStore = create<DeskState>()(
  persist(
    (set, get) => ({
      notificationsOpen: false,
      dashboardQuery: "",
      toasts: [],
      notifications,

      libraryItems,
      libraryQuery: "",
      libraryType: "all",
      libraryTime: "all",
      librarySource: "all",
      librarySort: "latest",
      selectedLibraryId: libraryItems[0]?.id ?? null,

      activeSummaryTab: "day",
      summaryItems: summaries,
      selectedSummaryId: summaries[0]?.id ?? null,

      personaModules,
      personaTimeline,
      selectedPersonaModuleId: personaModules[0].id,

      chatMode: "recent-memory",
      chatSessions,
      activeChatId: chatSessions[0].id,
      chatGroupCollapsed: { today: false, recent: false },

      importTasks,
      selectedImportId: importTasks[0]?.id ?? null,

      insightRange: "30d",
      selectedInsightId: insightsByRange[1].cards[0].id,
      selectedMilestoneId: insightsByRange[1].milestones[0].id,
      selectedMetric: null,

      settings: settingsState,

      setDashboardQuery: (query) => set({ dashboardQuery: query }),
      toggleNotifications: (open) =>
        set((state) => ({
          notificationsOpen: open ?? !state.notificationsOpen,
        })),
      pushToast: (title, tone = "default") =>
        set((state) => ({
          toasts: [...state.toasts, { id: makeId("toast"), title, tone }],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((item) =>
            item.id === id ? { ...item, read: true } : item,
          ),
          toasts: [...state.toasts, { id: makeId("toast"), title: "通知已标为已读", tone: "success" }],
        })),

      setLibraryQuery: (query) => set({ libraryQuery: query }),
      setLibraryType: (type) => set({ libraryType: type }),
      setLibraryTime: (time) =>
        set((state) => ({
          libraryTime: time,
          toasts:
            time === "custom"
              ? [...state.toasts, { id: makeId("toast"), title: "自定义时间选择器后续可替换成真实日期面板。", tone: "warning" }]
              : state.toasts,
        })),
      setLibrarySource: (source) => set({ librarySource: source }),
      setLibrarySort: (sort) => set({ librarySort: sort }),
      selectLibraryItem: (id) => set({ selectedLibraryId: id }),
      toggleLibraryImportant: (id) =>
        set((state) => ({
          libraryItems: state.libraryItems.map((item) =>
            item.id === id ? { ...item, important: !item.important } : item,
          ),
          toasts: [...state.toasts, { id: makeId("toast"), title: "资料重要性已更新", tone: "success" }],
        })),
      updateLibraryTags: (id, tags) =>
        set((state) => ({
          libraryItems: state.libraryItems.map((item) => (item.id === id ? { ...item, tags } : item)),
          toasts: [...state.toasts, { id: makeId("toast"), title: "标签已保存", tone: "success" }],
        })),
      deleteLibraryItem: (id) =>
        set((state) => {
          const next = state.libraryItems.filter((item) => item.id !== id);
          return {
            libraryItems: next,
            selectedLibraryId: next[0]?.id ?? null,
            toasts: [...state.toasts, { id: makeId("toast"), title: "资料已删除", tone: "warning" }],
          };
        }),

      setSummaryTab: (tab) =>
        set((state) => ({
          activeSummaryTab: tab,
          selectedSummaryId: state.summaryItems.find((item) => item.type === tab)?.id ?? null,
        })),
      selectSummary: (id) => set({ selectedSummaryId: id }),
      generateNewSummary: () =>
        set((state) => {
          const next = generateSummary(state.activeSummaryTab);
          return {
            summaryItems: [next, ...state.summaryItems],
            selectedSummaryId: next.id,
            toasts: [...state.toasts, { id: makeId("toast"), title: "新的摘要已生成", tone: "success" }],
          };
        }),
      regenerateSummary: (id) =>
        set((state) => ({
          summaryItems: state.summaryItems.map((item) =>
            item.id === id ? regenerateSummaryCard(item) : item,
          ),
          toasts: [...state.toasts, { id: makeId("toast"), title: "摘要已重新生成", tone: "success" }],
        })),

      selectPersonaModule: (id) => set({ selectedPersonaModuleId: id }),
      exportPersona: () => {
        const { personaModules, personaTimeline } = get();
        exportAsJson("second-me-persona.json", { personaModules, personaTimeline });
        get().pushToast("人物画像 JSON 已导出", "success");
      },

      setChatMode: (mode) => set({ chatMode: mode }),
      toggleChatGroup: (group) =>
        set((state) => ({
          chatGroupCollapsed: {
            ...state.chatGroupCollapsed,
            [group]: !state.chatGroupCollapsed[group],
          },
        })),
      setActiveChat: (id) => set({ activeChatId: id }),
      createNewChat: (prompt) => {
        const next = makeNewSession(prompt);
        set((state) => ({
          chatSessions: [next, ...state.chatSessions],
          activeChatId: next.id,
          toasts: [...state.toasts, { id: makeId("toast"), title: "新的对话已创建", tone: "success" }],
        }));
        return next.id;
      },
      sendChatMessage: (content) =>
        set((state) => ({
          chatSessions: state.chatSessions.map((session) => {
            if (session.id !== state.activeChatId) return session;
            const userMessage = {
              id: makeId("msg-user"),
              role: "user" as const,
              content,
              createdAt: nowLabel(),
            };
            const assistantMessage = {
              id: makeId("msg-assistant"),
              role: "assistant" as const,
              content: generateAssistantReply(content, state.chatMode),
              createdAt: nowLabel(),
            };
            return {
              ...session,
              title: session.title === "新的对话" ? content.slice(0, 12) : session.title,
              updatedAt: nowLabel(),
              messages: [...session.messages, userMessage, assistantMessage],
              contextReferences: {
                ...session.contextReferences,
                [state.chatMode]: createContextByMode(state.chatMode, content),
              },
            };
          }),
        })),
      clearActiveChat: () =>
        set((state) => ({
          chatSessions: state.chatSessions.map((session) =>
            session.id === state.activeChatId
              ? { ...session, messages: [], updatedAt: nowLabel() }
              : session,
          ),
          toasts: [...state.toasts, { id: makeId("toast"), title: "当前对话已清空", tone: "warning" }],
        })),
      exportActiveChat: () => {
        const active = get().chatSessions.find((session) => session.id === get().activeChatId);
        if (!active) return;
        exportAsJson(`${active.title}.json`, active);
        get().pushToast("对话已导出", "success");
      },

      selectImportTask: (id) => set({ selectedImportId: id }),
      createUploadTask: (fileName) => {
        const task = createImportTask(fileName);
        set((state) => ({
          importTasks: [task, ...state.importTasks],
          selectedImportId: task.id,
          toasts: [...state.toasts, { id: makeId("toast"), title: `已添加导入任务：${fileName}`, tone: "success" }],
        }));

        setTimeout(() => {
          set((state) => ({
            importTasks: state.importTasks.map((item) =>
              item.id === task.id
                ? { ...item, status: "processing", progress: 58, detail: "正在生成摘要与标签。", steps: buildImportSteps("processing") }
                : item,
            ),
          }));
        }, 500);

        setTimeout(() => {
          set((state) => ({
            importTasks: state.importTasks.map((item) =>
              item.id === task.id
                ? {
                    ...item,
                    status: "done",
                    progress: 100,
                    inPersona: true,
                    detail: "导入完成，已入库并更新画像。",
                    steps: buildImportSteps("done"),
                  }
                : item,
            ),
            toasts: [...state.toasts, { id: makeId("toast"), title: `${fileName} 已处理完成`, tone: "success" }],
          }));
        }, 1800);
      },
      reprocessImportTask: (id) => {
        set((state) => ({
          importTasks: state.importTasks.map((item) =>
            item.id === id
              ? { ...item, status: "processing", progress: 42, detail: "重新处理中…", steps: buildImportSteps("processing") }
              : item,
          ),
          toasts: [...state.toasts, { id: makeId("toast"), title: "已开始重新处理", tone: "success" }],
        }));
        setTimeout(() => {
          set((state) => ({
            importTasks: state.importTasks.map((item) =>
              item.id === id
                ? { ...item, status: "done", progress: 100, inPersona: true, detail: "重新处理完成。", steps: buildImportSteps("done") }
                : item,
            ),
          }));
        }, 1400);
      },
      deleteImportTask: (id) =>
        set((state) => {
          const next = state.importTasks.filter((item) => item.id !== id);
          return {
            importTasks: next,
            selectedImportId: next[0]?.id ?? null,
            toasts: [...state.toasts, { id: makeId("toast"), title: "导入任务已删除", tone: "warning" }],
          };
        }),
      failImportTask: (id) =>
        set((state) => ({
          importTasks: state.importTasks.map((item) =>
            item.id === id
              ? { ...item, status: "failed", progress: 24, detail: "模拟失败，等待重新处理。", steps: buildImportSteps("failed") }
              : item,
          ),
          toasts: [...state.toasts, { id: makeId("toast"), title: "任务状态已切为失败", tone: "warning" }],
        })),

      setInsightRange: (range) => {
        const dataset = getInsightDataset(insightsByRange, range);
        set({
          insightRange: range,
          selectedInsightId: dataset.cards[0]?.id ?? null,
          selectedMilestoneId: dataset.milestones[0]?.id ?? null,
          selectedMetric: null,
        });
      },
      selectInsightCard: (id) => set({ selectedInsightId: id }),
      selectMilestone: (id) => set({ selectedMilestoneId: id }),
      setSelectedMetric: (metric) => set({ selectedMetric: metric }),

      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
          toasts: [...state.toasts, { id: makeId("toast"), title: "设置已更新", tone: "success" }],
        })),
      runManualSync: () =>
        set((state) => ({
          settings: { ...state.settings, lastSyncAt: nowLabel() },
          toasts: [...state.toasts, { id: makeId("toast"), title: "已完成一次手动同步", tone: "success" }],
        })),
      deleteAllRecords: () =>
        set((state) => ({
          libraryItems: [],
          selectedLibraryId: null,
          toasts: [...state.toasts, { id: makeId("toast"), title: "全部记录已清空（mock）", tone: "warning" }],
        })),
      deletePersona: () =>
        set((state) => ({
          personaModules: state.personaModules.map((module) => ({ ...module, summary: "该画像模块已清空。" })),
          toasts: [...state.toasts, { id: makeId("toast"), title: "人物画像已清空（mock）", tone: "warning" }],
        })),
      exportAllData: () => {
        const state = get();
        exportAsJson("second-me-data-export.json", {
          libraryItems: state.libraryItems,
          summaryItems: state.summaryItems,
          personaModules: state.personaModules,
          chatSessions: state.chatSessions,
          importTasks: state.importTasks,
          settings: state.settings,
        });
        state.pushToast("个人数据已导出", "success");
      },
    }),
    {
      name: "second-me-admin-web-v2",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        dashboardQuery: state.dashboardQuery,
        notifications: state.notifications,
        libraryItems: state.libraryItems,
        libraryQuery: state.libraryQuery,
        libraryType: state.libraryType,
        libraryTime: state.libraryTime,
        librarySource: state.librarySource,
        librarySort: state.librarySort,
        selectedLibraryId: state.selectedLibraryId,
        activeSummaryTab: state.activeSummaryTab,
        summaryItems: state.summaryItems,
        selectedSummaryId: state.selectedSummaryId,
        personaModules: state.personaModules,
        personaTimeline: state.personaTimeline,
        selectedPersonaModuleId: state.selectedPersonaModuleId,
        chatMode: state.chatMode,
        chatSessions: state.chatSessions,
        activeChatId: state.activeChatId,
        chatGroupCollapsed: state.chatGroupCollapsed,
        importTasks: state.importTasks,
        selectedImportId: state.selectedImportId,
        insightRange: state.insightRange,
        selectedInsightId: state.selectedInsightId,
        selectedMilestoneId: state.selectedMilestoneId,
        selectedMetric: state.selectedMetric,
        settings: state.settings,
      }),
    },
  ),
);

export function useDashboardStats() {
  const libraryItems = useDeskStore((state) => state.libraryItems);
  const summaryItems = useDeskStore((state) => state.summaryItems);
  const personaModules = useDeskStore((state) => state.personaModules);

  return useMemo(
    () => deriveDashboardStats(libraryItems, summaryItems, personaModules as PersonaModule[]),
    [libraryItems, summaryItems, personaModules],
  );
}

export function useVisibleLibraryItems() {
  const libraryItems = useDeskStore((state) => state.libraryItems);
  const libraryQuery = useDeskStore((state) => state.libraryQuery);
  const libraryType = useDeskStore((state) => state.libraryType);
  const libraryTime = useDeskStore((state) => state.libraryTime);
  const librarySource = useDeskStore((state) => state.librarySource);
  const librarySort = useDeskStore((state) => state.librarySort);

  return useMemo(
    () =>
      filterLibraryItems(libraryItems, {
        query: libraryQuery,
        type: libraryType,
        time: libraryTime,
        source: librarySource,
        sort: librarySort,
      }),
    [libraryItems, libraryQuery, libraryType, libraryTime, librarySource, librarySort],
  );
}

export function useCurrentInsightDataset() {
  const insightRange = useDeskStore((state) => state.insightRange);

  return useMemo(() => getInsightDataset(insightsByRange, insightRange), [insightRange]);
}
