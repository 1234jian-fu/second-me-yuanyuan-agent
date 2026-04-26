import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

export function YuanGlass({
  children,
  style,
  soft = false,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  soft?: boolean;
}) {
  return <View style={[styles.glass, soft && styles.glassSoft, style]}>{children}</View>;
}

export function YuanIconButton({
  icon,
  label,
  onPress,
  danger = false,
}: {
  icon?: MaterialSymbolName;
  label?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
      {icon ? <MaterialSymbol name={icon} size={20} color={danger ? colors.danger : colors.primaryPressed} /> : null}
      {label ? (
        <AppText variant="caption" style={[styles.iconLabel, danger && styles.dangerText]}>
          {label}
        </AppText>
      ) : null}
    </Pressable>
  );
}

export function YuanPageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View>
        <AppText variant="micro" style={styles.eyebrow}>
          {eyebrow}
        </AppText>
        <AppText variant="hero" style={styles.pageTitle}>
          {title}
        </AppText>
      </View>
      {action}
    </View>
  );
}

export function YuanSectionTitle({
  icon,
  title,
  action,
}: {
  icon?: MaterialSymbolName;
  title: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleWrap}>
        {icon ? <MaterialSymbol name={icon} size={20} color={colors.primary} /> : null}
        <AppText variant="sectionTitle" style={styles.sectionTitle}>
          {title}
        </AppText>
      </View>
      {action}
    </View>
  );
}

export function YuanStatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <YuanGlass style={styles.statTile} soft>
      <AppText variant="sectionTitle" style={styles.statValue}>
        {value}
      </AppText>
      <AppText variant="caption" style={styles.statLabel}>
        {label}
      </AppText>
    </YuanGlass>
  );
}

export function YuanChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}>
      <AppText variant="caption" style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glass: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.66)",
    ...shadows.card,
  },
  glassSoft: {
    backgroundColor: "rgba(255,255,255,0.42)",
    shadowOpacity: 0.1,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  iconButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.62)",
    ...shadows.card,
  },
  iconLabel: {
    color: colors.primaryPressed,
    fontWeight: "700",
  },
  dangerText: {
    color: colors.danger,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.primary,
    letterSpacing: 5.2,
  },
  pageTitle: {
    marginTop: spacing.xs,
    fontSize: 31,
    lineHeight: 39,
    letterSpacing: 4.2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  sectionTitle: {
    letterSpacing: 2.4,
  },
  statTile: {
    flex: 1,
    minHeight: 92,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xxs,
    borderRadius: 20,
  },
  statValue: {
    color: colors.primaryPressed,
    letterSpacing: 2.4,
  },
  statLabel: {
    color: colors.textMuted,
  },
  chip: {
    minHeight: 44,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    backgroundColor: "rgba(255,255,255,0.46)",
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.primaryPressed,
    fontWeight: "700",
  },
  chipTextActive: {
    color: colors.onPrimary,
  },
});
