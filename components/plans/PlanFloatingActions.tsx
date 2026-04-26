import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

type PlanFloatingActionsProps = {
  disabled?: boolean;
  onAiPlan: () => void;
  onVoiceCreate: () => void;
};

export function PlanFloatingActions({
  disabled = false,
  onAiPlan,
  onVoiceCreate,
}: PlanFloatingActionsProps) {
  return (
    <View style={styles.row}>
      <Pressable accessibilityRole="button" onPress={onVoiceCreate} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <MaterialSymbol name="mic" size={18} color={colors.text} />
        <AppText variant="caption" style={styles.label}>
          语音创建任务
        </AppText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onAiPlan}
        style={({ pressed }) => [styles.button, disabled && styles.disabled, pressed && styles.pressed]}
      >
        <MaterialSymbol name="ai" size={18} color={colors.text} />
        <AppText variant="caption" style={styles.label}>
          智能调整计划
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
  },
  button: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  label: {
    color: colors.text,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
