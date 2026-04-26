import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PageContainer } from "@/components/PageContainer";
import { RecordDetailSheet } from "@/components/records/RecordDetailSheet";
import { AppText } from "@/components/ui";
import { YuanChip, YuanGlass, YuanIconButton, YuanPageHeader, YuanStatTile } from "@/components/yuanyuan/YuanUI";
import { colors, fontFamilies, layout, radius, spacing } from "@/config/theme";
import type { MockRecord } from "@/data/mockData";
import { useVisibleRecords } from "@/hooks/useVisibleRecords";
import { captureStatusLabels } from "@/types/capture";

type TaggedRecord = MockRecord & { tag: string };
type MemoryFilter = "全部" | "录音" | "文字" | "聊天记录" | "灵感" | "工作" | "关系";

const filters: MemoryFilter[] = ["全部", "录音", "文字", "聊天记录", "灵感", "工作", "关系"];

function getRecordTag(record: MockRecord) {
  if (record.type === "audio") {
    return record.title.includes("朋友") ? "关系" : "灵感";
  }

  if (record.title.includes("产品") || record.description.includes("产品")) {
    return "工作";
  }

  return "文字";
}

function getRecordStatusLabel(record: MockRecord) {
  return captureStatusLabels[record.captureStatus ?? "completed"];
}

function toRecordGroups(records: MockRecord[]) {
  return [
    {
      date: "今天 · 4 月 24 日",
      items: records.slice(0, 2).map((record) => ({ ...record, tag: getRecordTag(record) })),
    },
    {
      date: "昨天 · 4 月 23 日",
      items: records.slice(2).map((record) => ({ ...record, tag: getRecordTag(record) })),
    },
  ].filter((group) => group.items.length > 0);
}

export default function RecordsTab() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recordId?: string | string[] }>();
  const { records } = useVisibleRecords();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<MemoryFilter>("全部");
  const [selectedRecord, setSelectedRecord] = useState<MockRecord | null>(null);
  const normalizedRecordId = Array.isArray(params.recordId) ? params.recordId[0] : params.recordId;

  const sourceGroups = useMemo(() => toRecordGroups(records), [records]);
  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sourceGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((record) => {
          const matchesFilter =
            activeFilter === "全部" ||
            (activeFilter === "录音" && record.type === "audio") ||
            (activeFilter === "文字" && record.type === "text") ||
            activeFilter === record.tag;
          const matchesQuery = q ? `${record.title} ${record.description}`.toLowerCase().includes(q) : true;
          return matchesFilter && matchesQuery;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeFilter, query, sourceGroups]);

  useEffect(() => {
    if (!normalizedRecordId) {
      return;
    }

    const nextRecord = records.find((record) => record.id === normalizedRecordId);
    if (nextRecord) {
      setSelectedRecord(nextRecord);
    }
  }, [normalizedRecordId, records]);

  function openChatFromRecord(record: MockRecord) {
    setSelectedRecord(null);
    router.push(`/chat?prompt=${encodeURIComponent(`结合这条记录和我聊聊：${record.title}。内容：${record.description}`)}`);
  }

  function createPlanFromRecord(record: MockRecord) {
    setSelectedRecord(null);
    router.push(`/plans?draft=${encodeURIComponent(`围绕「${record.title}」整理一个可执行的小计划`)}`);
  }

  return (
    <PageContainer ambient contentStyle={styles.container}>
      <View style={styles.screen}>
        <YuanPageHeader
          eyebrow="MEMORY"
          title="记忆库"
          action={
            <View style={styles.headerActions}>
              <YuanIconButton icon="calendar" />
              <YuanIconButton icon="choice" />
            </View>
          }
        />

        <YuanGlass style={styles.searchBox} soft>
          <MaterialSymbol name="search" size={22} color={colors.textMuted} />
          <TextInput
            accessibilityLabel="搜索记忆"
            onChangeText={setQuery}
            placeholder="搜索记忆 · 关键词、人物、情绪……"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            value={query}
          />
        </YuanGlass>

        <View style={styles.statsRow}>
          <YuanStatTile value={records.length + 308} label="总记录" />
          <YuanStatTile value="47" label="记录天" />
          <YuanStatTile value="1.2k" label="记忆条目" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((filter) => (
            <YuanChip key={filter} label={filter} active={activeFilter === filter} onPress={() => setActiveFilter(filter)} />
          ))}
        </ScrollView>

        <View style={styles.groups}>
          {filteredGroups.map((group) => (
            <View key={group.date} style={styles.group}>
              <AppText variant="micro" style={styles.groupDate}>
                {group.date}
              </AppText>
              <View style={styles.recordList}>
                {group.items.map((record: TaggedRecord) => (
                  <Pressable
                    key={record.id}
                    accessibilityRole="button"
                    onPress={() => setSelectedRecord(record)}
                    style={({ pressed }) => [styles.recordCard, pressed && styles.pressed]}
                  >
                    <View style={styles.recordIcon}>
                      <MaterialSymbol name={record.type === "audio" ? "voiceRecord" : "article"} size={22} color={colors.primaryPressed} />
                    </View>
                    <View style={styles.recordCopy}>
                      <AppText variant="bodyStrong" numberOfLines={1} style={styles.recordTitle}>
                        {record.title}
                      </AppText>
                      <AppText variant="caption" style={styles.recordMeta}>
                        {record.description}
                      </AppText>
                    </View>
                    <View style={styles.pillStack}>
                      <View style={styles.tagPill}>
                        <AppText variant="caption" style={styles.tagText}>
                          {record.tag}
                        </AppText>
                      </View>
                      <View style={styles.statusPill}>
                        <AppText variant="micro" style={styles.statusText}>
                          {getRecordStatusLabel(record)}
                        </AppText>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      <RecordDetailSheet
        record={selectedRecord}
        visible={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        onCreatePlan={createPlanFromRecord}
        onAskAgent={openChatFromRecord}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: layout.screenMaxWidth,
    paddingHorizontal: 22,
  },
  screen: {
    gap: spacing.lg,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  searchBox: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontFamily: fontFamilies.cnMedium,
    fontSize: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  filterRow: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  groups: {
    gap: spacing.xl,
  },
  group: {
    gap: spacing.sm,
  },
  groupDate: {
    color: colors.primary,
    fontWeight: "800",
    letterSpacing: 4,
    paddingLeft: spacing.xs,
  },
  recordList: {
    gap: spacing.sm,
  },
  recordCard: {
    minHeight: 102,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.62)",
  },
  recordIcon: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "rgba(191,222,245,0.84)",
  },
  recordCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  recordTitle: {
    fontSize: 17,
  },
  recordMeta: {
    color: colors.textMuted,
    fontSize: 14,
  },
  tagPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.accentSoft,
  },
  pillStack: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  statusPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    backgroundColor: colors.surfaceRaised,
  },
  tagText: {
    color: colors.primaryPressed,
    fontWeight: "800",
  },
  statusText: {
    color: colors.textMuted,
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
