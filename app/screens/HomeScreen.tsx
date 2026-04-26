import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { DynamicHeroVideo } from "@/components/DynamicHeroVideo";
import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { PageContainer } from "@/components/PageContainer";
import { AppText } from "@/components/ui";
import { YuanGlass, YuanIconButton } from "@/components/yuanyuan/YuanUI";
import { colors, radius, shadows, spacing } from "@/config/theme";
import type { MockRecord } from "@/data/mockData";
import { useVisibleRecords } from "@/hooks/useVisibleRecords";
import { captureStatusLabels } from "@/types/capture";

function getRecordTag(record: MockRecord) {
  if (record.type === "audio") {
    return record.title.includes("朋友") ? "关系" : "灵感";
  }
  return record.title.includes("产品") ? "工作" : "文字";
}

function getRecordStatus(record: MockRecord): { label: string; icon: MaterialSymbolName; muted: boolean } {
  const status = record.captureStatus ?? "completed";

  if (status === "queued") {
    return { label: captureStatusLabels.queued, icon: "clock", muted: true };
  }

  if (status === "uploading") {
    return { label: captureStatusLabels.uploading, icon: "upload", muted: true };
  }

  if (status === "uploaded" || status === "processing") {
    return { label: status === "uploaded" ? captureStatusLabels.uploaded : captureStatusLabels.processing, icon: "cloud", muted: true };
  }

  if (status === "failed") {
    return { label: captureStatusLabels.failed, icon: "close", muted: true };
  }

  return { label: "已分析", icon: "check", muted: false };
}

export default function HomeScreen() {
  const router = useRouter();
  const { records } = useVisibleRecords();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((current) => current + 1), 180);
    return () => clearInterval(id);
  }, []);

  const bars = useMemo(
    () => Array.from({ length: 25 }, (_, index) => 10 + Math.abs(Math.sin((index + tick) * 0.58)) * 24),
    [tick],
  );

  return (
    <PageContainer ambient contentStyle={styles.container}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <View style={styles.brandBlock}>
            <AppText variant="micro" style={styles.kicker}>
              YUAN YUAN
            </AppText>
            <AppText variant="hero" style={styles.greeting}>
              晨安，行止
            </AppText>
          </View>
          <YuanIconButton label="行" onPress={() => router.push("/profile")} />
        </View>

        <View style={styles.heroCard}>
          <DynamicHeroVideo aspectRatio={5 / 4} rounded={false} />
          <View style={styles.heroCopy}>
            <View style={styles.heroMeta}>
              <View style={styles.heroDot} />
              <AppText variant="micro" style={styles.heroMetaText}>
                第 47 日 · 渊元正在生长
              </AppText>
            </View>
            <AppText variant="hero" style={styles.heroTitle}>
              已沉淀 {records.length + 308} 条记忆 · 画像新增 4 处
            </AppText>
            <AppText variant="caption" style={styles.heroSubtitle}>
              你的另一个我，正在变得越来越像你
            </AppText>
          </View>
        </View>

        <YuanGlass style={styles.recordPanel}>
          <View style={styles.panelHeader}>
            <View style={styles.panelTitleBlock}>
              <AppText variant="micro" style={styles.kicker}>
                RECORD
              </AppText>
              <AppText variant="sectionTitle" style={styles.panelTitle}>
                此刻，说点什么
              </AppText>
            </View>
            <View style={styles.uploadPill}>
              <MaterialSymbol name="cloud" size={14} color={colors.primaryPressed} />
              <AppText variant="micro" style={styles.uploadText}>
                录完即传
              </AppText>
            </View>
          </View>

          <View style={styles.recordRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/recording")}
              style={({ pressed }) => [styles.recordButton, pressed && styles.pressed]}
            >
              <MaterialSymbol name="mic" size={32} color={colors.onPrimary} />
            </Pressable>
            <View style={styles.wavePanel}>
              {bars.map((height, index) => (
                <View key={`${height}-${index}`} style={[styles.waveBar, { height }]} />
              ))}
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/text-record")}
            style={({ pressed }) => [styles.textEntry, pressed && styles.pressed]}
          >
            <MaterialSymbol name="edit" size={18} color={colors.primaryPressed} />
            <AppText variant="body" style={styles.textEntryLabel}>
              或者，写下来……
            </AppText>
            <MaterialSymbol name="chevronRight" size={18} color={colors.textMuted} />
          </Pressable>
        </YuanGlass>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/chat?prompt=${encodeURIComponent("最近我常提起自由与节奏，帮我分析一下。")}`)}
          style={({ pressed }) => [styles.discoveryCard, pressed && styles.pressed]}
        >
          <View style={styles.discoveryIcon}>
            <MaterialSymbol name="ai" size={23} color={colors.onPrimary} />
          </View>
          <View style={styles.discoveryCopy}>
            <AppText variant="caption" style={styles.discoveryKicker}>
              画像有新发现
            </AppText>
            <AppText variant="bodyStrong" style={styles.discoveryTitle}>
              最近你常提起「自由」与「节奏」
            </AppText>
          </View>
          <MaterialSymbol name="chevronRight" size={20} color={colors.textMuted} />
        </Pressable>

        <View style={styles.recentHeader}>
          <AppText variant="sectionTitle" style={styles.recentTitle}>
            最近记录
          </AppText>
          <Pressable accessibilityRole="button" onPress={() => router.push("/records")}>
            <AppText variant="caption" style={styles.recentAll}>
              全部 {records.length + 308} 条
            </AppText>
          </Pressable>
        </View>

        <View style={styles.recentList}>
          {records.slice(0, 3).map((record, index) => {
            const status = getRecordStatus(record);
            return (
              <Pressable
                key={record.id}
                accessibilityRole="button"
                onPress={() => router.push(`/records?recordId=${record.id}`)}
                style={({ pressed }) => [styles.recentCard, pressed && styles.pressed]}
              >
                <View style={styles.recentIcon}>
                  <MaterialSymbol name={record.type === "audio" ? "voiceRecord" : "article"} size={21} color={colors.primaryPressed} />
                </View>
                <View style={styles.recentCopy}>
                  <View style={styles.recentTitleRow}>
                    <AppText variant="bodyStrong" numberOfLines={1} style={styles.recentRecordTitle}>
                      {record.title}
                    </AppText>
                    <View style={styles.recentTag}>
                      <AppText variant="micro" style={styles.recentTagText}>
                        {getRecordTag(record)}
                      </AppText>
                    </View>
                  </View>
                  <AppText variant="caption" numberOfLines={1} style={styles.recentMeta}>
                    {index === 0 ? "今天" : "昨天"} · {record.description}
                  </AppText>
                </View>
                <View style={styles.statusWrap}>
                  <MaterialSymbol name={status.icon} size={15} color={status.muted ? colors.textMuted : colors.primary} />
                  <AppText variant="caption" style={[styles.statusText, status.muted && styles.statusMuted]}>
                    {status.label}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 390,
    paddingHorizontal: 22,
    paddingTop: spacing.lg,
  },
  screen: {
    gap: 24,
    width: "100%",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  brandBlock: {
    flex: 1,
  },
  kicker: {
    color: colors.primary,
    letterSpacing: 5,
  },
  greeting: {
    marginTop: spacing.xs,
    fontSize: 25,
    lineHeight: 34,
    letterSpacing: 4.5,
  },
  heroCard: {
    minHeight: 366,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.54)",
    ...shadows.floating,
  },
  heroCopy: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 18,
    gap: spacing.xs,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  heroMetaText: {
    color: colors.primary,
    letterSpacing: 3.2,
  },
  heroDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  heroTitle: {
    color: colors.primaryPressed,
    fontSize: 21,
    lineHeight: 31,
    letterSpacing: 2.6,
  },
  heroSubtitle: {
    color: colors.primaryPressed,
    fontSize: 12,
  },
  recordPanel: {
    gap: spacing.lg,
    borderRadius: 28,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.62)",
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  panelTitleBlock: {
    flex: 1,
  },
  panelTitle: {
    marginTop: spacing.xs,
    fontSize: 18,
    letterSpacing: 2.8,
  },
  uploadPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.accentSoft,
  },
  uploadText: {
    color: colors.primaryPressed,
    letterSpacing: 0,
  },
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  recordButton: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    ...shadows.floating,
  },
  wavePanel: {
    flex: 1,
    minWidth: 0,
    height: 66,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.56)",
  },
  waveBar: {
    width: 3,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    opacity: 0.72,
  },
  textEntry: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  textEntryLabel: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 16,
  },
  discoveryCard: {
    minHeight: 90,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.64)",
    ...shadows.card,
  },
  discoveryIcon: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  discoveryCopy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  discoveryKicker: {
    color: colors.primary,
    fontWeight: "700",
  },
  discoveryTitle: {
    fontSize: 16,
    lineHeight: 23,
  },
  recentHeader: {
    marginTop: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  recentTitle: {
    flex: 1,
    fontSize: 18,
  },
  recentAll: {
    color: colors.primary,
    fontWeight: "700",
  },
  recentList: {
    gap: spacing.sm,
    marginTop: -spacing.sm,
  },
  recentCard: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.66)",
    ...shadows.card,
  },
  recentIcon: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(191,222,245,0.86)",
  },
  recentCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  recentTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  recentRecordTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
  },
  recentMeta: {
    color: colors.textMuted,
    fontSize: 11,
  },
  recentTag: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    backgroundColor: colors.accentSoft,
  },
  recentTagText: {
    color: colors.primaryPressed,
    letterSpacing: 0,
  },
  statusWrap: {
    width: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  statusText: {
    color: colors.primary,
    fontSize: 11,
  },
  statusMuted: {
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
