import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, layout, radius, spacing } from "@/config/theme";

type PlanItemProps = {
  title: string;
  done?: boolean;
  onToggle?: () => void;
};

export function PlanItem({ title, done = false, onToggle }: PlanItemProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      hitSlop={spacing.xs}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.checkbox, done && styles.checkboxDone]}>
        <MaterialSymbol
          name={done ? "check" : "emptyCheck"}
          size={22}
          color={done ? colors.onPrimary : colors.borderStrong}
        />
      </View>
      <AppText
        variant="body"
        style={[
          styles.title,
          done && styles.titleDone,
        ]}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: layout.touchTarget + spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.surfaceRaised,
  },
  pressed: {
    opacity: 0.82,
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: "transparent",
  },
  checkboxDone: {
    backgroundColor: colors.primary,
  },
  title: {
    flex: 1,
    color: colors.text,
  },
  titleDone: {
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
});
