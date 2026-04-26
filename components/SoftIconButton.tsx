import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { colors, radius, shadows, spacing } from "@/config/theme";

type SoftIconButtonProps = {
  icon?: MaterialSymbolName;
  children?: ReactNode;
  onPress?: () => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function SoftIconButton({
  icon,
  children,
  onPress,
  size = 54,
  color = colors.text,
  style,
}: SoftIconButtonProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      hitSlop={spacing.xs}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size },
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? <MaterialSymbol name={icon} size={24} color={color} /> : children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: "rgba(255,255,255,0.88)",
    ...shadows.card,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});
