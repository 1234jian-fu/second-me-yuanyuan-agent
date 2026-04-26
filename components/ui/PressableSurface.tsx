import type { ReactNode } from "react";
import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { colors, layout, radius, shadows, spacing } from "@/config/theme";

type PressableSurfaceProps = Omit<PressableProps, "style"> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function PressableSurface({ children, style, ...props }: PressableSurfaceProps) {
  return (
    <Pressable
      accessibilityRole={props.onPress ? "button" : undefined}
      style={({ pressed }) => [
        styles.base,
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.touchTarget,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});
