import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { SoftIconButton } from "@/components/SoftIconButton";
import { AppText } from "@/components/ui";
import { colors, spacing } from "@/config/theme";

type SoftHeaderProps = {
  title: string;
  subtitle?: string;
  leftIcon?: "back" | null;
  right?: ReactNode;
  onBack?: () => void;
  align?: "center" | "left";
};

export function SoftHeader({
  title,
  subtitle,
  leftIcon = "back",
  right,
  onBack,
  align = "center",
}: SoftHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>{leftIcon ? <SoftIconButton icon="back" onPress={onBack} /> : null}</View>
      <View style={[styles.copy, align === "left" && styles.copyLeft]}>
        <AppText variant="sectionTitle" style={styles.title}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  side: {
    width: 58,
    alignItems: "flex-start",
  },
  sideRight: {
    alignItems: "flex-end",
  },
  copy: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xxs,
  },
  copyLeft: {
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
