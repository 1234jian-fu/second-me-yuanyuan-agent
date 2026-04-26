import type { TextInputProps } from "react-native";
import { StyleSheet, TextInput } from "react-native";

import { colors, layout, radius, spacing, typography } from "@/config/theme";

export function AppInput(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.textFaint}
      style={[
        typography.body,
        styles.input,
        props.style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: layout.touchTarget + spacing.xs,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    backgroundColor: "rgba(255,255,255,0.92)",
  },
});
