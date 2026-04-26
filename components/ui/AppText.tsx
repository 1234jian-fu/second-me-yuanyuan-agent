import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { Text } from "react-native";

import { typography } from "@/config/theme";

type TextVariant = keyof typeof typography;

type AppTextProps = {
  children: ReactNode;
  variant?: TextVariant;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
};

export function AppText({
  children,
  variant = "body",
  numberOfLines,
  style,
}: AppTextProps) {
  return (
    <Text numberOfLines={numberOfLines} style={[typography[variant], style]}>
      {children}
    </Text>
  );
}
