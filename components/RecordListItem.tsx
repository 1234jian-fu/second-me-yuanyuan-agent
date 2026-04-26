import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText, Surface } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";
import type { MockRecord } from "@/data/mockData";

type RecordListItemProps = {
  record: MockRecord;
  onPress?: () => void;
};

export function RecordListItem({ record, onPress }: RecordListItemProps) {
  const isAudio = record.type === "audio";
  const typeLabel = isAudio ? "分析中" : "已整理";
  const typeIcon = isAudio ? "voiceRecord" : "article";

  const content = (
    <Surface style={styles.card}>
      <View style={[styles.iconBox, isAudio && styles.audioIconBox]}>
        <MaterialSymbol name={typeIcon} size={22} color={isAudio ? colors.primary : colors.textMuted} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <AppText numberOfLines={1} variant="bodyStrong" style={styles.title}>
            {record.title}
          </AppText>
          <View style={[styles.metaPill, isAudio && styles.metaPillPending]}>
            <AppText variant="micro" style={[styles.metaText, isAudio && styles.metaTextPending]}>
              {typeLabel}
            </AppText>
          </View>
        </View>
        {isAudio ? (
          <View style={styles.audioRow}>
            <View style={styles.audioTrack}>
              <View style={styles.audioProgress} />
            </View>
            <AppText variant="micro" style={styles.duration}>
              00:36
            </AppText>
          </View>
        ) : (
          <AppText variant="caption" numberOfLines={2} style={styles.description}>
            {record.description}
          </AppText>
        )}
        <AppText variant="micro" style={styles.timeText}>
          今天 {record.time}
        </AppText>
      </View>
    </Surface>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  iconBox: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
  },
  audioIconBox: {
    backgroundColor: colors.primarySoft,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 15,
  },
  description: {
    color: colors.textMuted,
  },
  metaPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    backgroundColor: colors.surfaceBeige,
  },
  metaPillPending: {
    backgroundColor: colors.primarySoft,
  },
  metaText: {
    color: colors.warning,
  },
  metaTextPending: {
    color: colors.primary,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: 2,
  },
  audioTrack: {
    flex: 1,
    height: 6,
    overflow: "hidden",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
  },
  audioProgress: {
    width: "36%",
    height: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  duration: {
    color: colors.textFaint,
  },
  timeText: {
    color: colors.textFaint,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.988 }],
  },
});
