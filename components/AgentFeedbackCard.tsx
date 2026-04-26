import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText, Surface } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

type FeedbackPoint = {
  icon: MaterialSymbolName;
  title: string;
  description: string;
};

const feedbackPoints: FeedbackPoint[] = [
  {
    icon: "list",
    title: "理清重点",
    description: "先把任务拆开，聚焦最重要的 1~2 件事。",
  },
  {
    icon: "selfCare",
    title: "调整节奏",
    description: "降低压力，建立更可持续的工作与休息节奏。",
  },
  {
    icon: "water",
    title: "稳定情绪",
    description: "找到焦虑触发点，再给自己一个可执行的缓冲动作。",
  },
];

export function AgentFeedbackCard() {
  return (
    <View style={styles.container}>
      <Surface style={styles.feedbackCard}>
        <View style={styles.agentHeader}>
          <View style={styles.avatar}>
            <MaterialSymbol name="spa" size={17} color={colors.primary} />
          </View>
          <AppText variant="bodyStrong">渊元</AppText>
        </View>

        <AppText variant="body" style={styles.feedbackIntro}>
          我理解你现在的状态。结合最近记录，你可能处在“任务堆积、精力消耗、情绪压力”的循环中。
          我们先从三个方向把它变轻。
        </AppText>

        <View style={styles.pointList}>
          {feedbackPoints.map((point) => (
            <View key={point.title} style={styles.pointRow}>
              <View style={styles.pointIcon}>
                <MaterialSymbol name={point.icon} size={16} color={colors.textMuted} />
              </View>
              <View style={styles.pointCopy}>
                <AppText variant="bodyStrong" style={styles.pointTitle}>
                  {point.title}
                </AppText>
                <AppText variant="caption">{point.description}</AppText>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.feedbackFooter}>
          <View style={styles.actionRow}>
            {(["thumbUp", "thumbDown", "bookmark"] as const).map((name) => (
              <Pressable key={name} accessibilityRole="button" hitSlop={spacing.xs}>
                <MaterialSymbol name={name} size={18} color={colors.textFaint} />
              </Pressable>
            ))}
          </View>
          <AppText variant="micro">09:34</AppText>
        </View>
      </Surface>

      <Surface style={styles.summaryCard}>
        <View style={styles.summaryGlow} />
        <View style={styles.summaryTitle}>
          <MaterialSymbol name="summary" size={18} color={colors.primary} />
          <AppText variant="bodyStrong">本次对话摘要</AppText>
        </View>
        <AppText variant="caption" style={styles.summaryText}>
          当前重点是把模糊压力拆成可处理的小块：先选一个最重要任务，再安排一个短休息，
          最后记录焦虑触发点，方便后续形成记忆摘要。
        </AppText>
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <AppText variant="micro" style={styles.chipText}>
              压力识别
            </AppText>
          </View>
          <View style={styles.chip}>
            <AppText variant="micro" style={styles.chipText}>
              计划建议
            </AppText>
          </View>
          <View style={styles.chip}>
            <AppText variant="micro" style={styles.chipText}>
              记忆候选
            </AppText>
          </View>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  feedbackCard: {
    alignSelf: "flex-start",
    maxWidth: "94%",
    gap: spacing.lg,
    borderWidth: 0,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
    borderBottomLeftRadius: radius.sm,
    padding: spacing.lg,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  agentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceTint,
  },
  feedbackIntro: {
    color: colors.textMuted,
    fontSize: 15,
  },
  pointList: {
    gap: spacing.md,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  pointIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceTint,
  },
  pointCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  pointTitle: {
    fontSize: 14,
  },
  feedbackFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  summaryCard: {
    overflow: "hidden",
    gap: spacing.md,
    borderWidth: 0,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    backgroundColor: colors.surfaceTint,
  },
  summaryGlow: {
    position: "absolute",
    right: -28,
    top: -28,
    width: 132,
    height: 132,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    opacity: 0.46,
  },
  summaryTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  summaryText: {
    color: colors.textMuted,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceRaised,
  },
  chipText: {
    color: colors.primary,
  },
});
