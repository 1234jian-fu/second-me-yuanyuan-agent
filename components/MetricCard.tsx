import { StyleSheet } from "react-native";

import { AppText, Surface } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

type MetricCardProps = {
  label: string;
  value: string;
  tone?: "default" | "primary";
};

export function MetricCard({ label, value, tone = "default" }: MetricCardProps) {
  const isPrimary = tone === "primary";

  return (
    <Surface style={[styles.card, isPrimary && styles.primaryCard]}>
      <AppText variant="stat" style={isPrimary && styles.primaryText}>
        {value}
      </AppText>
      <AppText variant="caption" style={isPrimary && styles.primaryCaption}>
        {label}
      </AppText>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 74,
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceRaised,
  },
  primaryCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.onPrimary,
  },
  primaryCaption: {
    color: colors.onPrimary,
    opacity: 0.82,
  },
});
