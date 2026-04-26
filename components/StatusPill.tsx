import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

type StatusPillProps = {
  label: string;
  tone?: "ready" | "quiet" | "warn";
};

export function StatusPill({ label, tone = "quiet" }: StatusPillProps) {
  return (
    <View style={[styles.pill, styles[tone]]}>
      <View style={[styles.dot, tone === "ready" && styles.dotReady, tone === "warn" && styles.dotWarn]} />
      <AppText variant="micro" style={tone === "ready" ? styles.readyText : styles.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  quiet: {
    backgroundColor: colors.surfaceTint,
  },
  ready: {
    backgroundColor: colors.primary,
  },
  warn: {
    backgroundColor: colors.amberSoft,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.textFaint,
  },
  dotReady: {
    backgroundColor: colors.onPrimary,
  },
  dotWarn: {
    backgroundColor: colors.warning,
  },
  text: {
    color: colors.primaryPressed,
  },
  readyText: {
    color: colors.onPrimary,
  },
});
