import { StyleSheet, View } from "react-native";

import { AppButton } from "@/components/AppButton";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { SettingsSheet } from "@/components/settings/SettingsSheet";
import { AppText, Surface } from "@/components/ui";
import type { MockRecord } from "@/data/mockData";
import { colors, radius, spacing } from "@/config/theme";
import { captureStatusLabels } from "@/types/capture";

type RecordDetailSheetProps = {
  record: MockRecord | null;
  visible: boolean;
  onClose: () => void;
  onAskAgent: (record: MockRecord) => void;
  onCreatePlan: (record: MockRecord) => void;
};

export function RecordDetailSheet({
  record,
  visible,
  onClose,
  onAskAgent,
  onCreatePlan,
}: RecordDetailSheetProps) {
  if (!record) {
    return null;
  }

  const isAudio = record.type === "audio";
  const statusLabel = captureStatusLabels[record.captureStatus ?? "completed"];

  return (
    <SettingsSheet
      visible={visible}
      title="记录详情"
      onClose={onClose}
      footer={
        <View style={styles.footer}>
          <AppButton title="继续对话" variant="secondary" onPress={() => onAskAgent(record)} style={styles.flexButton} />
          <AppButton title="生成计划" onPress={() => onCreatePlan(record)} style={styles.flexButton} />
        </View>
      }
    >
      <Surface variant="muted" style={styles.metaCard}>
        <View style={[styles.iconBox, isAudio && styles.iconBoxAudio]}>
          <MaterialSymbol name={isAudio ? "voiceRecord" : "article"} size={22} color={colors.primary} />
        </View>
        <View style={styles.metaCopy}>
          <AppText variant="bodyStrong">{record.title}</AppText>
          <AppText variant="caption" style={styles.metaText}>
            {isAudio ? "语音记录" : "文字记录"} · 今天 {record.time} · {statusLabel}
          </AppText>
        </View>
      </Surface>

      <View style={styles.block}>
        <AppText variant="micro" style={styles.blockLabel}>
          原始内容
        </AppText>
        <AppText variant="body" style={styles.bodyText}>
          {record.description}
        </AppText>
      </View>

      <View style={styles.block}>
        <AppText variant="micro" style={styles.blockLabel}>
          云端管线
        </AppText>
        <AppText variant="caption" style={styles.metaText}>
          状态：{statusLabel} · 后续转写、摘要和入库会沿用这条采集记录。
        </AppText>
      </View>

      <View style={styles.block}>
        <AppText variant="micro" style={styles.blockLabel}>
          下一步
        </AppText>
        <AppText variant="caption" style={styles.metaText}>
          可以把这条记录继续展开成对话，或者直接转成一个可执行的小计划。
        </AppText>
      </View>
    </SettingsSheet>
  );
}

const styles = StyleSheet.create({
  metaCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.xl,
  },
  iconBox: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.surfaceBeige,
  },
  iconBoxAudio: {
    backgroundColor: colors.primarySoft,
  },
  metaCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  metaText: {
    color: colors.textMuted,
  },
  block: {
    gap: spacing.xs,
  },
  blockLabel: {
    color: colors.primary,
  },
  bodyText: {
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
});
