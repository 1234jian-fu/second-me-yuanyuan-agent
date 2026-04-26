import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

const bars = [14, 22, 18, 30, 24, 16, 12];

type HomeLearningCardProps = {
  recordCount: number;
};

export function HomeLearningCard({ recordCount }: HomeLearningCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.accentOrb} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.pulseDot} />
          <AppText variant="bodyStrong" style={styles.title}>
            渊元正在持续理解你
          </AppText>
        </View>
        <AppText variant="caption" style={styles.description}>
          已学习 {recordCount} 条记录，后续会把摘要、画像和建议慢慢变得更准确。
        </AppText>
        <View style={styles.wave}>
          {bars.map((height, index) => (
            <View
              key={`${height}-${index}`}
              style={[
                styles.bar,
                {
                  height,
                  opacity: 0.22 + index * 0.06,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 148,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.xl,
    padding: spacing.xl,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  accentOrb: {
    position: "absolute",
    right: -30,
    top: -18,
    width: 128,
    height: 128,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    opacity: 0.75,
  },
  content: {
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  title: {
    fontWeight: "700",
  },
  description: {
    color: colors.textMuted,
    maxWidth: 280,
  },
  wave: {
    height: 32,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    marginTop: spacing.md,
  },
  bar: {
    width: 4,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
});
