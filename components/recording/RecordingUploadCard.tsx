import { StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

type RecordingUploadCardProps = {
  durationLabel: string;
  fileName?: string;
  statusLabel: string;
};

export function RecordingUploadCard({
  durationLabel,
  fileName = "晨间记录.m4a",
  statusLabel,
}: RecordingUploadCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText variant="micro" style={styles.kicker}>
          上传状态
        </AppText>
        <MaterialSymbol name="cloud" size={22} color={colors.borderStrong} />
      </View>

      <View style={styles.body}>
        <View style={styles.fileIcon}>
          <MaterialSymbol name="article" size={24} color={colors.accent} />
        </View>

        <View style={styles.copy}>
          <AppText variant="body" numberOfLines={1} style={styles.fileName}>
            {fileName}
          </AppText>
          <AppText variant="caption" style={styles.duration}>
            时长 {durationLabel}
          </AppText>
        </View>

        <View style={styles.chip}>
          <AppText variant="caption" style={styles.chipText}>
            {statusLabel}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    padding: spacing.md,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  kicker: {
    color: colors.clay,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  fileIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  fileName: {
    color: colors.text,
  },
  duration: {
    color: colors.textFaint,
  },
  chip: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceBlue,
  },
  chipText: {
    color: colors.textMuted,
    fontWeight: "700",
  },
});
