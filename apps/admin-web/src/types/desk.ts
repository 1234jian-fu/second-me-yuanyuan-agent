export type NavRoute =
  | "dashboard"
  | "library"
  | "summary"
  | "persona"
  | "chat"
  | "import"
  | "insights"
  | "settings";

export type ToastTone = "default" | "success" | "warning" | "danger";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type ToastItem = {
  id: string;
  title: string;
  tone: ToastTone;
};

export type LibraryItemType = "text" | "audio" | "chat" | "image" | "video";
export type LibrarySource = "mobile" | "web" | "import";
export type LibraryTimeFilter = "all" | "today" | "week" | "month" | "custom";
export type LibrarySort = "latest" | "importance" | "persona";

export type LibraryItem = {
  id: string;
  title: string;
  type: LibraryItemType;
  source: LibrarySource;
  createdAt: string;
  rawText: string;
  summary: string;
  tags: string[];
  emotion: string;
  inPersona: boolean;
  important: boolean;
  relatedMemoryIds: string[];
};

export type SummaryTab = "day" | "week" | "month" | "event" | "topic";

export type SummaryItem = {
  id: string;
  type: SummaryTab;
  title: string;
  abstract: string;
  generatedAt: string;
  modelVersion: string;
  evidenceRecordIds: string[];
  relatedChatIds: string[];
  relatedPersonaIds: string[];
};

export type PersonaModule = {
  id: string;
  title: string;
  summary: string;
  confidence: number;
  sourceRecordIds: string[];
  sourceSummaryIds: string[];
  updatedAt: string;
};

export type PersonaTimelineEvent = {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  moduleId: string;
};

export type ChatMode = "recent-memory" | "persona" | "deep-retrieval";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ContextReference = {
  id: string;
  type: "persona" | "summary" | "record";
  title: string;
  detail: string;
};

export type ChatSession = {
  id: string;
  title: string;
  group: "today" | "recent";
  updatedAt: string;
  messages: ChatMessage[];
  contextReferences: Record<ChatMode, ContextReference[]>;
};

export type ImportStepKey =
  | "clean"
  | "segment"
  | "summary"
  | "tag"
  | "index"
  | "persona";

export type ImportTaskStatus = "queued" | "processing" | "done" | "failed";

export type ImportStep = {
  key: ImportStepKey;
  label: string;
  detail: string;
  status: ImportTaskStatus;
};

export type ImportTask = {
  id: string;
  fileName: string;
  fileType: string;
  createdAt: string;
  status: ImportTaskStatus;
  progress: number;
  steps: ImportStep[];
  inPersona: boolean;
  detail: string;
};

export type InsightRange = "7d" | "30d" | "90d";

export type TrendPoint = {
  label: string;
  recordCount: number;
  moodScore: number;
};

export type ThemeStat = {
  theme: string;
  value: number;
};

export type InsightCard = {
  id: string;
  title: string;
  summary: string;
  detail: string;
};

export type Milestone = {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
};

export type InsightDataset = {
  range: InsightRange;
  recordTrend: TrendPoint[];
  themes: ThemeStat[];
  cards: InsightCard[];
  milestones: Milestone[];
};

export type SettingsState = {
  userName: string;
  email: string;
  autoSync: boolean;
  lastSyncAt: string;
  lightModel: "gpt-4.1-mini" | "deepseek-chat";
  deepModel: "gpt-5" | "deepseek-reasoner";
  autoUpdatePersona: boolean;
  dailyReminder: boolean;
  weeklyReviewReminder: boolean;
  analysisReadyReminder: boolean;
};
