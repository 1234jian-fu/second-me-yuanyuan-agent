import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

type GradientButtonProps = {
  title: string;
  icon?: MaterialSymbolName;
  disabled?: boolean;
  onPress?: () => void;
};

export function GradientButton({ title, icon, disabled, onPress }: GradientButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={[colors.primary, colors.accent, colors.primarySoft]}
        end={{ x: 1, y: 0.6 }}
        start={{ x: 0, y: 0.2 }}
        style={styles.button}
      >
        {icon ? <MaterialSymbol name={icon} size={25} color={colors.onPrimary} /> : null}
        <AppText variant="button" style={styles.title}>
          {title}
        </AppText>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.full,
    ...shadows.floating,
  },
  button: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
  },
  title: {
    color: colors.onPrimary,
    fontSize: 18,
    letterSpacing: 0.2,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
