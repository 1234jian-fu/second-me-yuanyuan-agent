import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

type RecordingBottomActionsProps = {
  disabled?: boolean;
  isRecording: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onPrimaryPress: () => void;
};

export function RecordingBottomActions({
  disabled = false,
  isRecording,
  isSaving,
  onCancel,
  onPrimaryPress,
}: RecordingBottomActionsProps) {
  const primaryLabel = isSaving ? "保存中…" : isRecording ? "停止录音" : "开始录音";

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPrimaryPress}
        style={({ pressed }) => [
          styles.primaryButton,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <MaterialSymbol name="mic" size={22} color={colors.onPrimary} />
        <AppText variant="body" style={styles.primaryText}>
          {primaryLabel}
        </AppText>
      </Pressable>

      <Pressable accessibilityRole="button" hitSlop={spacing.xs} onPress={onCancel} style={styles.cancelButton}>
        <AppText variant="micro" style={styles.cancelText}>
          取消
        </AppText>
      </Pressable>

      <AppText variant="caption" style={styles.privacyText}>
        录音内容仅自己可见
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.sm,
  },
  primaryButton: {
    width: "100%",
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    ...shadows.floating,
  },
  primaryText: {
    color: colors.onPrimary,
    fontSize: 17,
    fontWeight: "600",
  },
  cancelButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  cancelText: {
    color: colors.clay,
  },
  privacyText: {
    color: colors.borderStrong,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
