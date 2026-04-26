import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import { colors, radius, shadows, spacing } from "@/config/theme";

type SurfaceVariant = "card" | "muted" | "floating" | "tint";

type SurfaceProps = {
  children: ReactNode;
  variant?: SurfaceVariant;
  style?: StyleProp<ViewStyle>;
};

function getSurfaceStyle(variant: SurfaceVariant): ViewStyle {
  if (variant === "muted") {
    return styles.muted;
  }

  if (variant === "tint") {
    return styles.tint;
  }

  if (variant === "floating") {
    return styles.floating;
  }

  return styles.card;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.md,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  floating: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    padding: spacing.md,
    backgroundColor: colors.surfaceRaised,
    ...shadows.floating,
  },
  muted: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.surfaceMuted,
  },
  tint: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.accentSoft,
  },
});

export function Surface({ children, variant = "card", style }: SurfaceProps) {
  return <View style={[getSurfaceStyle(variant), style]}>{children}</View>;
}
