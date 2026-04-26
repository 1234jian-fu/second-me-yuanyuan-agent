import { StyleSheet, View } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText, Surface } from "@/components/ui";
import { colors, spacing } from "@/config/theme";

type PlanMetric = {
  icon: MaterialSymbolName;
  label: string;
  value: string;
};

const metrics: PlanMetric[] = [
  { icon: "task", value: "3", label: "重点任务" },
  { icon: "clock", value: "6.5h", label: "预计时间" },
  { icon: "analytics", value: "80%", label: "专注目标" },
  { icon: "mood", value: "良好", label: "状态预测" },
];

export function PlanMetricsGrid() {
  return (
    <View style={styles.grid}>
      {metrics.map((metric) => (
        <Surface key={metric.label} style={styles.card}>
          <MaterialSymbol name={metric.icon} size={18} color={colors.primary} />
          <AppText variant="bodyStrong" style={styles.value}>
            {metric.value}
          </AppText>
          <AppText variant="caption" style={styles.label}>
            {metric.label}
          </AppText>
        </Surface>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  card: {
    width: "48.6%",
    minHeight: 92,
    alignItems: "flex-start",
    justifyContent: "center",
    gap: spacing.xs,
  },
  value: {
    fontSize: 18,
  },
  label: {
    color: colors.textMuted,
  },
});
