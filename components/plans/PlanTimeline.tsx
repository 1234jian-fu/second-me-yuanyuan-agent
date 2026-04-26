import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { colors, spacing } from "@/config/theme";

const timelineItems = [
  { time: "07:00", title: "晨间例行：阅读 / 咖啡", active: false },
  { time: "09:30", title: "完成 Q3 产品规划方案 · 2h", active: true },
  { time: "14:00", title: "阅读《设计心理学》第三章 · 1.5h", active: false },
  { time: "16:30", title: "瑜伽拉伸与冥想 · 45m", active: false },
  { time: "19:00", title: "做一次日终复盘", active: false },
];

export function PlanTimeline() {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <AppText variant="sectionTitle">时间安排</AppText>
          <AppText variant="caption" style={styles.subtitle}>
            先把重要时段留给最重要的事
          </AppText>
        </View>
        <AppText variant="micro" style={styles.viewMode}>
          日视图
        </AppText>
      </View>

      <View style={styles.timeline}>
        {timelineItems.map((item) => (
          <View key={`${item.time}-${item.title}`} style={styles.row}>
            <View style={[styles.dot, item.active && styles.dotActive]} />
            <View style={styles.copy}>
              <AppText variant="micro" style={[styles.time, item.active && styles.activeText]}>
                {item.time}
              </AppText>
              <AppText variant="body" style={[styles.title, item.active && styles.titleActive]}>
                {item.title}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  subtitle: {
    color: colors.textMuted,
  },
  viewMode: {
    color: colors.textMuted,
  },
  timeline: {
    gap: spacing.lg,
    borderLeftWidth: 2,
    borderLeftColor: colors.hairline,
    marginLeft: spacing.sm,
    paddingLeft: spacing.lg,
  },
  row: {
    position: "relative",
  },
  dot: {
    position: "absolute",
    left: -27,
    top: 5,
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: 5,
    backgroundColor: colors.surfaceRaised,
  },
  dotActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  copy: {
    gap: spacing.xxs,
  },
  time: {
    color: colors.textFaint,
  },
  activeText: {
    color: colors.primary,
  },
  title: {
    color: colors.text,
  },
  titleActive: {
    fontWeight: "700",
  },
});
