import type {
  ChatMode,
  ChatSession,
  ContextReference,
  ImportStep,
  ImportTask,
  ImportTaskStatus,
  InsightRange,
  LibraryItem,
  LibrarySort,
  LibraryTimeFilter,
  PersonaModule,
  SummaryItem,
  SummaryTab,
} from "@/types/desk";

export function nowLabel() {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function isWithinRange(dateString: string, filter: LibraryTimeFilter) {
  if (filter === "all" || filter === "custom") {
    return true;
  }

  const date = new Date(dateString);
  const now = new Date("2026-04-23T23:59:59+08:00");
  const diff = now.getTime() - date.getTime();
  const day = 1000 * 60 * 60 * 24;

  if (filter === "today") return diff <= day;
  if (filter === "week") return diff <= day * 7;
  if (filter === "month") return diff <= day * 31;
  return true;
}

export function filterLibraryItems(
  items: LibraryItem[],
  {
    query,
    type,
    time,
    source,
    sort,
  }: {
    query: string;
    type: string;
    time: LibraryTimeFilter;
    source: string;
    sort: LibrarySort;
  },
) {
  const lowered = query.trim().toLowerCase();
  const filtered = items.filter((item) => {
    const byQuery =
      !lowered ||
      [item.title, item.rawText, item.summary, item.tags.join(" "), item.emotion]
        .join(" ")
        .toLowerCase()
        .includes(lowered);
    const byType = type === "all" || item.type === type;
    const bySource = source === "all" || item.source === source;
    const byTime = isWithinRange(item.createdAt, time);
    return byQuery && byType && bySource && byTime;
  });

  return filtered.sort((left, right) => {
    if (sort === "importance") {
      return Number(right.important) - Number(left.important) || +new Date(right.createdAt) - +new Date(left.createdAt);
    }
    if (sort === "persona") {
      return Number(right.inPersona) - Number(left.inPersona) || +new Date(right.createdAt) - +new Date(left.createdAt);
    }
    return +new Date(right.createdAt) - +new Date(left.createdAt);
  });
}

export function generateSummary(tab: SummaryTab): SummaryItem {
  const labels: Record<SummaryTab, string> = {
    day: "日摘要",
    week: "周摘要",
    month: "月摘要",
    event: "事件摘要",
    topic: "主题摘要",
  };

  return {
    id: `summary-${tab}-${Date.now()}`,
    type: tab,
    title: `新的${labels[tab]}`,
    abstract: `这是一次模拟生成的${labels[tab]}，已基于当前 mock 数据完成。`,
    generatedAt: nowLabel(),
    modelVersion: "mock-second-me-v2",
    evidenceRecordIds: ["lib-1", "lib-3"],
    relatedChatIds: ["chat-1"],
    relatedPersonaIds: ["persona-goals"],
  };
}

export function regenerateSummaryCard(summary: SummaryItem): SummaryItem {
  return {
    ...summary,
    abstract: `${summary.abstract}（已重新生成）`,
    generatedAt: nowLabel(),
    modelVersion: `${summary.modelVersion}-r`,
  };
}

export function exportAsJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function createContextByMode(mode: ChatMode, prompt: string): ContextReference[] {
  if (mode === "persona") {
    return [
      {
        id: `ctx-${Date.now()}-1`,
        type: "persona",
        title: "决策风格",
        detail: `由于你提到“${prompt.slice(0, 16)}”，本轮优先调用了决策风格与高压状态画像块。`,
      },
      {
        id: `ctx-${Date.now()}-2`,
        type: "persona",
        title: "高压状态表现",
        detail: "最近画像显示你在复杂度不清时更容易焦虑。",
      },
    ];
  }

  if (mode === "deep-retrieval") {
    return [
      {
        id: `ctx-${Date.now()}-3`,
        type: "record",
        title: "网页端结构草案",
        detail: "深度检索命中了关于‘电脑端中枢’的历史记录。",
      },
      {
        id: `ctx-${Date.now()}-4`,
        type: "summary",
        title: "主题摘要：节奏与做重焦虑",
        detail: "检索到了和当前问题最相近的高频主题摘要。",
      },
    ];
  }

  return [
    {
      id: `ctx-${Date.now()}-5`,
      type: "record",
      title: "今天早上的产品思考",
      detail: "近期记忆命中了今天的记录片段。",
    },
    {
      id: `ctx-${Date.now()}-6`,
      type: "summary",
      title: "4 月 23 日日摘要",
      detail: "调用了今天最新的摘要结果。",
    },
  ];
}

export function generateAssistantReply(prompt: string, mode: ChatMode) {
  const lowered = prompt.toLowerCase();

  if (lowered.includes("梳理今天")) {
    return "今天最值得保留的信号有三个：一是你把桌面端重新定义成了中枢；二是你明确了所有页面不能做成死按钮；三是你依然在主动控制复杂度，这是一种成熟的产品判断。";
  }

  if (lowered.includes("方案")) {
    return "我建议你继续采用“两层推进”：先把 8 个页面的结构与交互跑通，再逐步把真实后端替换进来。这样既不会卡死在空设计，也不会一开始做重。";
  }

  if (lowered.includes("现状")) {
    return "你目前处在“方向逐渐稳定，但仍对实现重量保持警惕”的阶段。这个状态并不坏，说明你既在推进，也在守边界。";
  }

  if (mode === "persona") {
    return "从长期画像看，你的强项是结构搭建和目标清晰化；当前更需要的是把这些结构稳定转成可执行动作。";
  }

  if (mode === "deep-retrieval") {
    return "我从历史记录里看到，你已经多次把‘理解自己’置于‘堆更多功能’之前。当前最好的动作不是扩功能，而是把中枢的主路径打通。";
  }

  return `我收到了：“${prompt}”。如果把它放回当前系统里，我会建议先聚焦一件最关键的事，并只为它补足最必要的功能。`;
}

export function makeNewSession(prompt?: string): ChatSession {
  const starter = prompt?.trim()
    ? [
        {
          id: `msg-user-${Date.now()}`,
          role: "user" as const,
          content: prompt,
          createdAt: nowLabel(),
        },
      ]
    : [];

  return {
    id: `chat-${Date.now()}`,
    title: prompt ? prompt.slice(0, 12) : "新的对话",
    group: "today",
    updatedAt: nowLabel(),
    messages: starter,
    contextReferences: {
      "recent-memory": [],
      persona: [],
      "deep-retrieval": [],
    },
  };
}

export function buildImportSteps(status: ImportTaskStatus): ImportStep[] {
  const steps: ImportStep[] = [
    { key: "clean", label: "清洗", detail: "去噪与格式归一", status: "queued" },
    { key: "segment", label: "分段", detail: "切片整理内容块", status: "queued" },
    { key: "summary", label: "摘要", detail: "生成摘要与主题", status: "queued" },
    { key: "tag", label: "标签", detail: "补充标签与情绪", status: "queued" },
    { key: "index", label: "入库", detail: "写入资料库", status: "queued" },
    { key: "persona", label: "画像更新", detail: "写回画像模块", status: "queued" },
  ];

  if (status === "queued") return steps;
  if (status === "failed") {
    return steps.map((step, index) =>
      index === 1 ? { ...step, status: "failed" } : index === 0 ? { ...step, status: "done" } : step,
    );
  }
  if (status === "processing") {
    return steps.map((step, index) =>
      index < 2 ? { ...step, status: "done" } : index === 2 ? { ...step, status: "processing" } : step,
    );
  }
  return steps.map((step) => ({ ...step, status: "done" }));
}

export function createImportTask(fileName: string): ImportTask {
  const fileType = fileName.split(".").pop()?.toUpperCase() || "FILE";
  return {
    id: `imp-${Date.now()}`,
    fileName,
    fileType,
    createdAt: nowLabel(),
    status: "queued",
    progress: 0,
    inPersona: false,
    detail: "任务已创建，等待进入处理流程。",
    steps: buildImportSteps("queued"),
  };
}

export function deriveDashboardStats(items: LibraryItem[], summaryItems: SummaryItem[], personaItems: PersonaModule[]) {
  const todayCount = items.filter((item) => isWithinRange(item.createdAt, "today")).length;
  const weekCount = items.filter((item) => isWithinRange(item.createdAt, "week")).length;
  const summaryCount = summaryItems.filter((item) => item.type === "day" || item.type === "week").length;
  const personaUpdated = personaItems.filter((item) => item.updatedAt >= "2026-04-22").length;

  return {
    todayCount,
    weekCount,
    summaryCount,
    personaUpdated,
  };
}

export function getInsightDataset<T extends { range: InsightRange }>(items: T[], range: InsightRange) {
  return items.find((item) => item.range === range) ?? items[0];
}
