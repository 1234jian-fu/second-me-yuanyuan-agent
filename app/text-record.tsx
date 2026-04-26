import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { AppScreenTabBar } from "@/components/AppScreenTabBar";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PageContainer } from "@/components/PageContainer";
import { AppText, Surface } from "@/components/ui";
import { colors, fontFamilies, layout, radius, spacing } from "@/config/theme";
import { useTextEntries } from "@/hooks/useTextEntries";
import { capturePipelineService } from "@/services/capturePipelineService";
import { useAuthStore } from "@/store/authStore";
import { useMobileSettingsStore } from "@/store/mobileSettingsStore";
import { useMockAgentStore } from "@/store/mockAgentStore";
import { getErrorMessage } from "@/utils/errors";

const tags = ["灵感", "成长", "工作", "情绪", "生活"];
const moods = ["平静", "开心", "有点累", "焦虑"];
const CONTENT_LIMIT = 5000;

export default function TextRecordScreen() {
  const router = useRouter();
  const addTextRecordToStore = useMockAgentStore((state) => state.addTextRecord);
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const hasRemoteBackend = useAuthStore((state) => state.hasRemoteBackend);
  const autoUploadAfterCapture = useMobileSettingsStore((state) => state.capture.autoUploadAfterCapture);
  const { createEntry, isLoading, error } = useTextEntries();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("平静");
  const [selectedTags, setSelectedTags] = useState<string[]>(["情绪"]);
  const [status, setStatus] = useState<string | null>(null);
  const remoteReady = hasRemoteBackend && Boolean(user) && autoUploadAfterCapture;
  const saving = isAuthLoading || isLoading;

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

  async function saveRecord() {
    const trimmedContent = content.trim();
    const trimmedTitle = title.trim();

    if (!trimmedContent) {
      setStatus("先写一点内容，再保存。");
      return;
    }

    const captureTask = capturePipelineService.createTask({
      source: "mobile-text",
      status: remoteReady ? "uploading" : "queued",
    });

    try {
      if (remoteReady) {
        await createEntry({
          title: trimmedTitle,
          content: trimmedContent,
          mood,
          tags: selectedTags,
          metadata: {
            source: "mobile-text-editor",
            pipelineTaskId: captureTask.id,
            captureStatus: "processing",
          },
        });
        setStatus("文字记录已上传，正在等待摘要与入库处理。");
      } else {
        addTextRecordToStore({
          title: trimmedTitle,
          content: trimmedContent,
          captureStatus: "queued",
          cloudTaskId: captureTask.id,
        });
        setStatus(autoUploadAfterCapture ? "已保存到本地待上传队列。" : "已保存到本地，自动上传已关闭。");
      }

      setTitle("");
      setContent("");
    } catch (saveError) {
      addTextRecordToStore({
        title: trimmedTitle,
        content: trimmedContent,
        captureStatus: "failed",
        cloudTaskId: captureTask.id,
      });
      setStatus(`云端保存失败，已先保存在本地：${getErrorMessage(saveError)}`);
    }
  }

  return (
    <PageContainer
      ambient
      contentStyle={styles.container}
      footer={<AppScreenTabBar activeKey="records" />}
    >
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.iconButton}>
            <MaterialSymbol name="back" size={20} color={colors.primaryPressed} />
          </Pressable>
          <View style={styles.titleBlock}>
            <AppText variant="micro" style={styles.kicker}>
              WRITE
            </AppText>
            <AppText variant="sectionTitle">文字记录</AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={saving}
            onPress={() => void saveRecord()}
            style={[styles.savePill, saving && styles.disabled]}
          >
            <AppText variant="caption" style={styles.saveText}>
              保存
            </AppText>
          </Pressable>
        </View>

        <Surface style={styles.editorCard}>
          <TextInput
            accessibilityLabel="记录标题"
            onChangeText={setTitle}
            placeholder="给这条记忆取个名字（可选）"
            placeholderTextColor={colors.textFaint}
            style={styles.titleInput}
            value={title}
          />
          <View style={styles.divider} />
          <TextInput
            accessibilityLabel="记录正文"
            multiline
            maxLength={CONTENT_LIMIT}
            onChangeText={setContent}
            placeholder="此刻的想法、感受、灵感..."
            placeholderTextColor={colors.textFaint}
            style={styles.bodyInput}
            textAlignVertical="top"
            value={content}
          />
          <View style={styles.editorFooter}>
            <Pressable accessibilityRole="button" onPress={() => router.push("/recording")} style={styles.toolButton}>
              <MaterialSymbol name="mic" size={18} color={colors.primaryPressed} />
              <AppText variant="caption" style={styles.toolText}>
                语音
              </AppText>
            </Pressable>
            <AppText variant="caption">{content.length}/{CONTENT_LIMIT}</AppText>
          </View>
        </Surface>

        <Surface style={styles.metaCard}>
          <AppText variant="bodyStrong">心情</AppText>
          <View style={styles.chipWrap}>
            {moods.map((item) => (
              <Pressable
                key={item}
                accessibilityRole="button"
                onPress={() => setMood(item)}
                style={[styles.chip, mood === item && styles.chipActive]}
              >
                <AppText variant="caption" style={mood === item ? styles.chipActiveText : styles.chipText}>
                  {item}
                </AppText>
              </Pressable>
            ))}
          </View>
          <AppText variant="bodyStrong">标签</AppText>
          <View style={styles.chipWrap}>
            {tags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  accessibilityRole="button"
                  onPress={() => toggleTag(tag)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <AppText variant="caption" style={active ? styles.chipActiveText : styles.chipText}>
                    {tag}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </Surface>

        {status || error ? (
          <AppText variant="caption" style={styles.statusText}>
            {status ?? error}
          </AppText>
        ) : null}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: layout.screenMaxWidth,
    paddingTop: spacing.md,
  },
  screen: {
    flex: 1,
    gap: spacing.lg,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceRaised,
  },
  titleBlock: {
    alignItems: "center",
  },
  kicker: {
    color: colors.primary,
    fontWeight: "800",
  },
  savePill: {
    minWidth: 64,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  saveText: {
    color: colors.onPrimary,
    fontWeight: "800",
  },
  editorCard: {
    gap: spacing.md,
    borderRadius: radius.xxl,
    padding: spacing.lg,
  },
  titleInput: {
    color: colors.text,
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    lineHeight: 27,
  },
  divider: {
    height: 1,
    backgroundColor: colors.hairlineStrong,
  },
  bodyInput: {
    minHeight: 260,
    color: colors.text,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 26,
  },
  editorFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toolButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accentSoft,
  },
  toolText: {
    color: colors.primaryPressed,
    fontWeight: "800",
  },
  metaCard: {
    gap: spacing.md,
    borderRadius: radius.xxl,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceMuted,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  chipText: {
    color: colors.textMuted,
  },
  chipActiveText: {
    color: colors.primaryPressed,
    fontWeight: "800",
  },
  statusText: {
    color: colors.textMuted,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});
