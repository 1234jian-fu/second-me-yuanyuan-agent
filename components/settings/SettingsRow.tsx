import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

type SettingsRowProps = {
  icon: MaterialSymbolName;
  title: string;
  description?: string;
  value?: string;
  onPress?: () => void;
  right?: ReactNode;
  destructive?: boolean;
};

export function SettingsRow({
  icon,
  title,
  description,
  value,
  onPress,
  right,
  destructive = false,
}: SettingsRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      hitSlop={spacing.xs}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}
    >
      <View style={[styles.iconWrap, destructive && styles.iconWrapDanger]}>
        <MaterialSymbol name={icon} size={20} color={destructive ? colors.danger : colors.primary} />
      </View>
      <View style={styles.copy}>
        <AppText variant="bodyStrong" style={destructive ? styles.titleDanger : undefined}>
          {title}
        </AppText>
        {description ? (
          <AppText variant="caption" style={styles.description}>
            {description}
          </AppText>
        ) : null}
      </View>
      {right ?? (
        <View style={styles.right}>
          {value ? (
            <AppText variant="caption" style={styles.value}>
              {value}
            </AppText>
          ) : null}
          {onPress ? <MaterialSymbol name="chevronRight" size={18} color={colors.textFaint} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.76)",
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },
  iconWrapDanger: {
    backgroundColor: "#FFF0F1",
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  description: {
    color: colors.textMuted,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  value: {
    color: colors.textFaint,
  },
  titleDanger: {
    color: colors.danger,
  },
});
