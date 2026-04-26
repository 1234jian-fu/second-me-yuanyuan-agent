import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PageContainer } from "@/components/PageContainer";
import { AppText } from "@/components/ui";
import { colors, layout, radius, shadows, spacing } from "@/config/theme";
import { useAudioEntries } from "@/hooks/useAudioEntries";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { capturePipelineService } from "@/services/capturePipelineService";
import { storageService } from "@/services/storageService";
import type { CaptureStatus } from "@/types/capture";
import { captureStatusLabels } from "@/types/capture";
import { useAuthStore } from "@/store/authStore";
import { useMobileSettingsStore } from "@/store/mobileSettingsStore";
import { useMockAgentStore } from "@/store/mockAgentStore";
import { getErrorMessage } from "@/utils/errors";

function formatRecordingTimer(seconds: number | null | undefined) {
  const safeSeconds = Math.max(0, seconds ?? 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = Math.floor(safeSeconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function RecordingScreen() {
  const router = useRouter();
  const addAudioPlaceholder = useMockAgentStore((state) => state.addAudioPlaceholder);
  const user = useAuthStore((state) => state.user);
  const hasRemoteBackend = useAuthStore((state) => state.hasRemoteBackend);
  const autoUploadAfterCapture = useMobileSettingsStore((state) => state.capture.autoUploadAfterCapture);
  const { createEntry } = useAudioEntries();
  const {
    durationSeconds: recordingDurationSeconds,
    isRecording,
    startRecording,
    stopRecording,
  } = useAudioRecorder();
  const [isSavingAudio, setIsSavingAudio] = useState(false);
  const [status, setStatus] = useState<string | null>("点击中间按钮开始录音。");
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus | null>(null);
  const [lastDurationSeconds, setLastDurationSeconds] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const remoteReady = hasRemoteBackend && Boolean(user);
  const canUploadNow = remoteReady && autoUploadAfterCapture;
  const displayDuration = isRecording ? recordingDurationSeconds : lastDurationSeconds;

  useEffect(() => {
    const id = setInterval(() => setTick((current) => current + 1), 100);
    return () => clearInterval(id);
  }, []);

  const bars = useMemo(
    () => Array.from({ length: 56 }, (_, index) => 4 + Math.abs(Math.sin((index + tick) * 0.4)) * 38),
    [tick],
  );

  async function toggleAudioRecording() {
    if (isSavingAudio) {
      return;
    }

    if (!isRecording) {
      try {
        await startRecording();
        setCaptureStatus(null);
        setStatus("渊元正在聆听……");
        setLastDurationSeconds(null);
      } catch (error) {
        setStatus(`无法开始录音：${getErrorMessage(error)}`);
      }

      return;
    }

    setIsSavingAudio(true);
    setStatus("正在保存录音……");
    setCaptureStatus("queued");
    let recordedAudio: { uri: string; durationSeconds: number | null; fileSize: number | null } | null = null;

    try {
      recordedAudio = await stopRecording();
      setLastDurationSeconds(recordedAudio.durationSeconds);
      const captureTask = capturePipelineService.createTask({
        source: "mobile-audio",
        localUri: recordedAudio.uri,
      });

      if (!canUploadNow) {
        addAudioPlaceholder({
          durationSeconds: recordedAudio.durationSeconds,
          fileSize: recordedAudio.fileSize,
          localUri: recordedAudio.uri,
          captureStatus: "queued",
          cloudTaskId: captureTask.id,
        });
        setCaptureStatus("queued");
        setStatus(autoUploadAfterCapture ? "录音已进入本地待上传队列。" : "录音已保存到本地，自动上传已关闭。");
        return;
      }

      setCaptureStatus("uploading");
      setStatus("正在上传录音……");
      const uploaded = await storageService.uploadAudio({
        uri: recordedAudio.uri,
        fileName: `voice-record-${Date.now()}.m4a`,
        contentType: "audio/m4a",
      });
      const uploadedTask = capturePipelineService.transition(captureTask, "uploaded", {
        remotePath: uploaded.storagePath,
      });

      setCaptureStatus("processing");
      setStatus("录音已上传，正在创建云端处理任务……");
      await createEntry({
        title: "语音记录",
        storagePath: uploaded.storagePath,
        publicUrl: null,
        durationSeconds: recordedAudio.durationSeconds,
        mimeType: "audio/m4a",
        fileSize: recordedAudio.fileSize,
        metadata: {
          source: "expo-av",
          pipelineTaskId: uploadedTask.id,
          captureStatus: "processing",
          transcriptionStatus: "pending",
          uploadedAt: new Date().toISOString(),
        },
      });

      setCaptureStatus("processing");
      setStatus("语音已上传，等待转写、摘要和入库处理。");
    } catch (error) {
      const message = getErrorMessage(error);
      setCaptureStatus("failed");
      if (recordedAudio) {
        const failedTask = capturePipelineService.createTask({
          source: "mobile-audio",
          localUri: recordedAudio.uri,
          status: "failed",
          errorMessage: message,
        });
        addAudioPlaceholder({
          durationSeconds: recordedAudio.durationSeconds,
          fileSize: recordedAudio.fileSize,
          localUri: recordedAudio.uri,
          captureStatus: "failed",
          cloudTaskId: failedTask.id,
          errorMessage: message,
        });
      }
      setStatus(`语音云端保存失败，已保留本地记录：${message}`);
    } finally {
      setIsSavingAudio(false);
    }
  }

  async function cancelRecording() {
    if (isRecording && !isSavingAudio) {
      try {
        await stopRecording();
      } catch {
        // Best-effort cleanup.
      }
    }

    router.back();
  }

  return (
    <PageContainer ambient={false} contentStyle={styles.container} scroll={false}>
      <LinearGradient
        colors={["#F7FCFF", "#E8F6FE", "#DDEFF8"]}
        locations={[0, 0.56, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={cancelRecording} style={styles.iconButton}>
            <MaterialSymbol name="close" size={20} color={colors.primaryPressed} />
          </Pressable>
          <View style={styles.recordingPill}>
            <View style={[styles.liveDot, isRecording && styles.liveDotActive]} />
            <AppText variant="micro" style={styles.pillText}>
              {isRecording ? "RECORDING" : captureStatus ? captureStatusLabels[captureStatus] : "READY"}
            </AppText>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.center}>
          <Pressable
            accessibilityRole="button"
            disabled={isSavingAudio}
            onPress={toggleAudioRecording}
            style={({ pressed }) => [styles.orbWrap, pressed && styles.pressed, isSavingAudio && styles.disabled]}
          >
            <View style={[styles.orbGlow, isRecording && styles.orbGlowActive]} />
            <LinearGradient colors={["#FFFFFF", "#DDF4FF", "#83BADF"]} style={styles.orb}>
              <View style={styles.orbInner} />
              <View style={styles.orbShine} />
              <MaterialSymbol name={isRecording ? "pause" : "mic"} size={42} color={colors.primaryPressed} />
            </LinearGradient>
          </Pressable>

          <AppText variant="hero" style={styles.timer}>
            {formatRecordingTimer(displayDuration)}
          </AppText>
          <AppText variant="caption" style={styles.statusText}>
            {status}
          </AppText>

          <View style={styles.waveform}>
            {bars.map((height, index) => (
              <View key={`${height}-${index}`} style={[styles.waveBar, { height }]} />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.uploadHint}>
            <MaterialSymbol name="cloud" size={14} color={colors.primaryPressed} />
            <AppText variant="micro" style={styles.hintText}>
              {autoUploadAfterCapture ? "停止后自动进入上传与处理队列" : "停止后先保存在本地待上传队列"}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={isRecording || isSavingAudio}
            onPress={() => router.push("/records")}
            style={({ pressed }) => [styles.recordsButton, pressed && styles.pressed, (isRecording || isSavingAudio) && styles.disabled]}
          >
            <MaterialSymbol name="list" size={18} color={colors.primaryPressed} />
            <AppText variant="bodyStrong" style={styles.recordsButtonText}>
              查看记忆库
            </AppText>
          </Pressable>
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: layout.screenMaxWidth,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  screen: {
    flex: 1,
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.72)",
    ...shadows.card,
  },
  recordingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.textFaint,
  },
  liveDotActive: {
    backgroundColor: colors.danger,
  },
  pillText: {
    color: colors.primaryPressed,
    letterSpacing: 2,
  },
  headerSpacer: {
    width: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  orbWrap: {
    width: 194,
    height: 194,
    alignItems: "center",
    justifyContent: "center",
  },
  orbGlow: {
    position: "absolute",
    width: 232,
    height: 232,
    borderRadius: radius.full,
    backgroundColor: "rgba(137,207,245,0.24)",
  },
  orbGlowActive: {
    transform: [{ scale: 1.08 }],
  },
  orb: {
    width: 176,
    height: 176,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    ...shadows.floating,
  },
  orbInner: {
    position: "absolute",
    inset: 12,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.26)",
  },
  orbShine: {
    position: "absolute",
    left: 42,
    top: 34,
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.54)",
  },
  timer: {
    color: colors.primaryPressed,
    fontSize: 42,
    lineHeight: 48,
    textAlign: "center",
  },
  statusText: {
    color: colors.primaryPressed,
    textAlign: "center",
  },
  waveform: {
    height: 76,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  waveBar: {
    width: 3,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    opacity: 0.72,
  },
  footer: {
    gap: spacing.lg,
  },
  uploadHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  hintText: {
    color: colors.primaryPressed,
    letterSpacing: 0,
  },
  recordsButton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.78)",
    ...shadows.card,
  },
  recordsButtonText: {
    color: colors.primaryPressed,
  },
  disabled: {
    opacity: 0.58,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
