import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { AppText, Surface } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

type SettingsSectionProps = {
  title: string;
  description?: string;
  highlighted?: boolean;
  children: ReactNode;
};

export function SettingsSection({
  title,
  description,
  highlighted = false,
  children,
}: SettingsSectionProps) {
  return (
    <Surface style={[styles.card, highlighted && styles.highlighted]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={[styles.headerDot, highlighted && styles.headerDotActive]} />
          <AppText variant="sectionTitle">{title}</AppText>
        </View>
        {description ? (
          <AppText variant="caption" style={styles.description}>
            {description}
          </AppText>
        ) : null}
      </View>
      <View style={styles.body}>{children}</View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.84)",
  },
  highlighted: {
    borderColor: "rgba(169, 153, 242, 0.42)",
    backgroundColor: "rgba(241, 236, 255, 0.82)",
  },
  header: {
    gap: spacing.xs,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.borderStrong,
  },
  headerDotActive: {
    backgroundColor: colors.accent,
  },
  description: {
    color: colors.textMuted,
  },
  body: {
    gap: spacing.sm,
    borderRadius: radius.xl,
    padding: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.42)",
  },
});
