import type { AiProvider } from "@/services/ai/providers";

export type SettingsFocus =
  | "account"
  | "sync"
  | "privacy"
  | "model"
  | "notifications"
  | "about";

export type BoundDevice = {
  id: string;
  name: string;
  lastActiveAt: string;
  isCurrent?: boolean;
};

export type MobileProfileSettings = {
  displayName: string;
  email: string;
  joinedAt: string;
};

export type MobileReminderSettings = {
  dailyReminder: boolean;
  weeklyReviewReminder: boolean;
  analysisFinishedReminder: boolean;
};

export type MobileCaptureSettings = {
  autoUploadAfterCapture: boolean;
  keepLocalCopy: boolean;
};

export type MobileSettingsSnapshot = {
  profile: MobileProfileSettings;
  autoSync: boolean;
  lastSyncAt: string | null;
  lightweightModel: AiProvider;
  deepAnalysisModel: AiProvider;
  autoUpdatePersona: boolean;
  personaStatus: "ready" | "cleared";
  reminders: MobileReminderSettings;
  capture: MobileCaptureSettings;
  devices: BoundDevice[];
  exportedAt: string;
};
