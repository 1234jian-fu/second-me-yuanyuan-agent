import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import type { AiProvider } from "@/services/ai/providers";
import { exportMobileSnapshot, runMockSettingsSync } from "@/services/mobileSettingsService";
import { useMockAgentStore } from "@/store/mockAgentStore";
import type {
  BoundDevice,
  MobileCaptureSettings,
  MobileProfileSettings,
  MobileReminderSettings,
  MobileSettingsSnapshot,
} from "@/types/settings";
import { formatDateTime } from "@/utils/date";

const { createJSONStorage, persist } =
  require("zustand/middleware") as typeof import("zustand/middleware");

const initialProfile: MobileProfileSettings = {
  displayName: "行止",
  email: "xingzhi@yuanyuan.local",
  joinedAt: "2025.03.01",
};

const initialDevices: BoundDevice[] = [
  { id: "device-phone", name: "iPhone 15 Pro", lastActiveAt: "今天 21:30", isCurrent: true },
  { id: "device-hub", name: "Second Me Hub", lastActiveAt: "今天 20:48" },
];

const initialReminders: MobileReminderSettings = {
  dailyReminder: true,
  weeklyReviewReminder: true,
  analysisFinishedReminder: true,
};

const initialCapture: MobileCaptureSettings = {
  autoUploadAfterCapture: true,
  keepLocalCopy: true,
};

type MobileSettingsState = {
  profile: MobileProfileSettings;
  devices: BoundDevice[];
  autoSync: boolean;
  lastSyncAt: string | null;
  lightweightModel: AiProvider;
  deepAnalysisModel: AiProvider;
  autoUpdatePersona: boolean;
  personaStatus: "ready" | "cleared";
  reminders: MobileReminderSettings;
  capture: MobileCaptureSettings;
  isSyncing: boolean;
  isExporting: boolean;
  lastExportUri: string | null;
  updateProfile: (input: Partial<MobileProfileSettings>) => void;
  setAutoSync: (value: boolean) => void;
  setLightweightModel: (value: AiProvider) => void;
  setDeepAnalysisModel: (value: AiProvider) => void;
  setAutoUpdatePersona: (value: boolean) => void;
  setReminder: <K extends keyof MobileReminderSettings>(key: K, value: MobileReminderSettings[K]) => void;
  setCaptureSetting: <K extends keyof MobileCaptureSettings>(key: K, value: MobileCaptureSettings[K]) => void;
  runManualSync: () => Promise<string>;
  exportPersonalData: () => Promise<string>;
  deleteAllRecords: () => void;
  clearPersona: () => void;
  restorePersona: () => void;
};

function buildSnapshot(state: MobileSettingsState): MobileSettingsSnapshot {
  return {
    profile: state.profile,
    autoSync: state.autoSync,
    lastSyncAt: state.lastSyncAt,
    lightweightModel: state.lightweightModel,
    deepAnalysisModel: state.deepAnalysisModel,
    autoUpdatePersona: state.autoUpdatePersona,
    personaStatus: state.personaStatus,
    reminders: state.reminders,
    capture: state.capture,
    devices: state.devices,
    exportedAt: formatDateTime(new Date()),
  };
}

export const useMobileSettingsStore = create<MobileSettingsState>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      devices: initialDevices,
      autoSync: true,
      lastSyncAt: formatDateTime(new Date()),
      lightweightModel: "custom-proxy",
      deepAnalysisModel: "openai-compatible",
      autoUpdatePersona: true,
      personaStatus: "ready",
      reminders: initialReminders,
      capture: initialCapture,
      isSyncing: false,
      isExporting: false,
      lastExportUri: null,

      updateProfile: (input) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...input,
          },
        })),
      setAutoSync: (value) => set({ autoSync: value }),
      setLightweightModel: (value) => set({ lightweightModel: value }),
      setDeepAnalysisModel: (value) => set({ deepAnalysisModel: value }),
      setAutoUpdatePersona: (value) => set({ autoUpdatePersona: value }),
      setReminder: (key, value) =>
        set((state) => ({
          reminders: {
            ...state.reminders,
            [key]: value,
          },
        })),
      setCaptureSetting: (key, value) =>
        set((state) => ({
          capture: {
            ...state.capture,
            [key]: value,
          },
        })),

      runManualSync: async () => {
        set({ isSyncing: true });
        try {
          const timestamp = await runMockSettingsSync();
          set({ isSyncing: false, lastSyncAt: timestamp });
          return timestamp;
        } catch (error) {
          set({ isSyncing: false });
          throw error;
        }
      },

      exportPersonalData: async () => {
        set({ isExporting: true });
        try {
          const snapshot = buildSnapshot(get());
          const payload = {
            ...snapshot,
            localAgentData: useMockAgentStore.getState(),
          };
          const fileUri = await exportMobileSnapshot(payload as MobileSettingsSnapshot & { localAgentData: unknown });
          set({ isExporting: false, lastExportUri: fileUri });
          return fileUri;
        } catch (error) {
          set({ isExporting: false });
          throw error;
        }
      },

      deleteAllRecords: () => {
        useMockAgentStore.getState().clearAllData();
      },
      clearPersona: () => set({ personaStatus: "cleared" }),
      restorePersona: () => set({ personaStatus: "ready" }),
    }),
    {
      name: "second-me-mobile-settings",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        devices: state.devices,
        autoSync: state.autoSync,
        lastSyncAt: state.lastSyncAt,
        lightweightModel: state.lightweightModel,
        deepAnalysisModel: state.deepAnalysisModel,
        autoUpdatePersona: state.autoUpdatePersona,
        personaStatus: state.personaStatus,
        reminders: state.reminders,
        capture: state.capture,
        lastExportUri: state.lastExportUri,
      }),
    },
  ),
);
