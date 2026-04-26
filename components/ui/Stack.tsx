import type { ReactNode } from "react";
import type { FlexStyle, StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

import { spacing } from "@/config/theme";

type SpacingKey = keyof typeof spacing;

type StackProps = {
  children: ReactNode;
  direction?: "row" | "column";
  gap?: SpacingKey | number;
  align?: FlexStyle["alignItems"];
  justify?: FlexStyle["justifyContent"];
  style?: StyleProp<ViewStyle>;
};

export function Stack({
  children,
  direction = "column",
  gap = "md",
  align,
  justify,
  style,
}: StackProps) {
  const resolvedGap = typeof gap === "number" ? gap : spacing[gap];

  return (
    <View
      style={[
        {
          flexDirection: direction,
          gap: resolvedGap,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
