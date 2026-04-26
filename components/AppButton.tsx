import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { AppText } from "@/components/ui";
import { colors, layout, radius, shadows, spacing } from "@/config/theme";

type AppButtonProps = Omit<PressableProps, "style"> & {
  title: string;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary";
};

export function AppButton({ title, variant = "primary", style, ...props }: AppButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        props.disabled && styles.disabled,
        pressed && !props.disabled && styles.pressed,
        style,
      ]}
      {...props}
    >
      <AppText
        variant="button"
        style={isPrimary ? styles.primaryText : styles.secondaryText}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.touchTarget + spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadows.card,
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: "rgba(255,255,255,0.88)",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: colors.onPrimary,
  },
  secondaryText: {
    color: colors.text,
  },
});
