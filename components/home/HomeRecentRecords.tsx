import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { RecordListItem } from "@/components/RecordListItem";
import { AppText } from "@/components/ui";
import { colors, spacing } from "@/config/theme";
import type { MockRecord } from "@/data/mockData";

type HomeRecentRecordsProps = {
  records: MockRecord[];
  onPressRecord: (record: MockRecord) => void;
  onViewAll: () => void;
};

export function HomeRecentRecords({ records, onPressRecord, onViewAll }: HomeRecentRecordsProps) {
  const visibleRecords = records.slice(0, 2);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <AppText variant="sectionTitle">最近记录</AppText>
          <AppText variant="caption" style={styles.subtitle}>
            先留住最近的想法，后面再慢慢整理
          </AppText>
        </View>
        <Pressable accessibilityRole="button" onPress={onViewAll} style={styles.viewAll}>
          <AppText variant="caption" style={styles.viewAllText}>
            查看全部
          </AppText>
          <MaterialSymbol name="chevronRight" size={16} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.list}>
        {visibleRecords.map((record) => (
          <RecordListItem key={record.id} record={record} onPress={() => onPressRecord(record)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  subtitle: {
    color: colors.textMuted,
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  viewAllText: {
    color: colors.primary,
    fontWeight: "700",
  },
  list: {
    gap: spacing.sm,
  },
});
