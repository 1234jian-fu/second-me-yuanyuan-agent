import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { VisualAsset } from "@/components/VisualAsset";
import { AppText, Surface } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

type HomeBriefCardProps = {
  recordsCount: number;
  plansCount: number;
  doneCount: number;
  onMoodPress: () => void;
  onViewAll: () => void;
};

export function HomeBriefCard({
  recordsCount,
  plansCount,
  doneCount,
  onMoodPress,
  onViewAll,
}: HomeBriefCardProps) {
  return (
    <Surface style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <VisualAsset assetId="feature.todayPlan" size={28} />
          <AppText variant="sectionTitle" style={styles.title}>
            今日简报
          </AppText>
        </View>
        <Pressable accessibilityRole="button" onPress={onViewAll} style={styles.viewAll}>
          <AppText variant="caption">查看全部</AppText>
          <MaterialSymbol name="chevronRight" size={18} color={colors.textFaint} />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <Pressable style={styles.statBlock} onPress={onMoodPress}>
          <VisualAsset assetId="brief.todayMood" size={46} />
          <AppText variant="caption">今日心情</AppText>
          <View style={styles.inlineValue}>
            <AppText variant="bodyStrong" style={styles.statValue}>
              还不错
            </AppText>
            <View style={styles.statusDot} />
          </View>
        </Pressable>
        <View style={styles.divider} />
        <View style={styles.statBlock}>
          <VisualAsset assetId="brief.recordCount" size={46} />
          <AppText variant="caption">记录条数</AppText>
          <AppText variant="bodyStrong" style={styles.statValue}>
            {recordsCount} 条
          </AppText>
          <AppText variant="caption" style={styles.primaryHint}>
            比昨天多 1 条
          </AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBlock}>
          <VisualAsset assetId="brief.planCount" size={46} />
          <AppText variant="caption">计划事项</AppText>
          <AppText variant="bodyStrong" style={styles.statValue}>
            {plansCount} 项
          </AppText>
          <AppText variant="caption" style={styles.successHint}>
            完成 {doneCount} 项
          </AppText>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  statBlock: {
    flex: 1,
    gap: spacing.sm,
  },
  inlineValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 18,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.amber,
  },
  primaryHint: {
    color: colors.primary,
  },
  successHint: {
    color: colors.success,
  },
  divider: {
    width: 1,
    marginHorizontal: spacing.md,
    backgroundColor: colors.hairline,
  },
});
