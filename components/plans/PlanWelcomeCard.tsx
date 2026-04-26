import { StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

export function PlanWelcomeCard() {
  return (
    <View style={styles.card}>
      <View style={styles.landscape} />
      <View style={styles.glow} />

      <View style={styles.copy}>
        <View style={styles.textBlock}>
          <AppText variant="sectionTitle" style={styles.title}>
            今天也要照顾好自己的节奏
          </AppText>
          <AppText variant="body" style={styles.subtitle}>
            先完成最重要的几件事，再把剩下的留给更稳的状态。
          </AppText>
        </View>

        <View style={styles.badge}>
          <MaterialSymbol name="ai" size={14} color={colors.primary} />
          <AppText variant="micro" style={styles.badgeText}>
            AI 已优化今日计划
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 188,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.xxl,
    backgroundColor: colors.surfaceLavender,
    ...shadows.card,
  },
  landscape: {
    position: "absolute",
    left: -20,
    right: -20,
    bottom: -60,
    height: 150,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.56)",
  },
  glow: {
    position: "absolute",
    right: -26,
    top: -18,
    width: 148,
    height: 148,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBeige,
    opacity: 0.8,
  },
  copy: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  textBlock: {
    maxWidth: 270,
  },
  title: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  badgeText: {
    color: colors.primary,
  },
});
