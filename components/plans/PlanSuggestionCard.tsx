import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

export function PlanSuggestionCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialSymbol name="idea" size={20} color={colors.primary} />
        <AppText variant="sectionTitle" style={styles.title}>
          今日状态建议
        </AppText>
      </View>
      <AppText variant="body" style={styles.copy}>
        你今天上午更适合处理深度工作，下午尽量留一点缓冲，不要把安排塞得太满。
      </AppText>
      <Pressable accessibilityRole="button" style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <AppText variant="body" style={styles.buttonText}>
          查看详情
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontSize: 22,
  },
  copy: {
    color: colors.textMuted,
  },
  button: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
  },
  buttonText: {
    color: colors.text,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
