import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import type { VisualAssetId } from "@/assets/visualAssets";
import { VisualAsset } from "@/components/VisualAsset";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

type TextMood = {
  label: string;
  assetId: VisualAssetId;
};

type TextRecordMetaCardProps = {
  mood: string;
  onMoodChange: (mood: string) => void;
  onTagToggle: (tag: string) => void;
  selectedTags: string[];
};

const moods: TextMood[] = [
  { label: "平静", assetId: "mood.okay" },
  { label: "开心", assetId: "mood.happy" },
  { label: "焦虑", assetId: "mood.tired" },
  { label: "疲惫", assetId: "mood.tired" },
  { label: "难过", assetId: "mood.terrible" },
];

const tags = ["灵感", "成长", "反思", "情绪", "生活"];

export function TextRecordMetaCard({
  mood,
  onMoodChange,
  onTagToggle,
  selectedTags,
}: TextRecordMetaCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.block}>
        <AppText variant="bodyStrong" style={styles.blockTitle}>
          心情（可选）
        </AppText>
        <ScrollView
          horizontal
          contentContainerStyle={styles.moodRow}
          showsHorizontalScrollIndicator={false}
        >
          {moods.map((item) => {
            const active = mood === item.label;

            return (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => onMoodChange(item.label)}
                style={[styles.moodItem, active && styles.moodItemActive]}
              >
                <View style={[styles.moodIcon, active && styles.moodIconActive]}>
                  <VisualAsset assetId={item.assetId} size={28} />
                </View>
                <AppText variant="caption" style={[styles.moodLabel, active && styles.activeText]}>
                  {item.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.block}>
        <View style={styles.tagHeader}>
          <AppText variant="bodyStrong" style={styles.blockTitle}>
            标签（可选）
          </AppText>
          <Pressable accessibilityRole="button" hitSlop={spacing.xs}>
            <AppText variant="micro" style={styles.addTag}>
              + 添加标签
            </AppText>
          </Pressable>
        </View>

        <View style={styles.tagWrap}>
          {tags.map((tag) => {
            const active = selectedTags.includes(tag);

            return (
              <Pressable
                key={tag}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => onTagToggle(tag)}
                style={[styles.tagChip, active && styles.tagChipActive]}
              >
                <AppText variant="caption" style={[styles.tagText, active && styles.activeText]}>
                  {tag}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    borderRadius: 32,
    padding: spacing.lg,
    backgroundColor: "#FBF1E4",
    ...shadows.card,
  },
  block: {
    gap: spacing.md,
  },
  blockTitle: {
    color: colors.textMuted,
    fontWeight: "600",
  },
  moodRow: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  moodItem: {
    width: 66,
    alignItems: "center",
    gap: spacing.xs,
  },
  moodItemActive: {},
  moodIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  moodIconActive: {
    borderColor: "rgba(163, 177, 138, 0.35)",
    backgroundColor: "rgba(163, 177, 138, 0.18)",
  },
  moodLabel: {
    color: colors.textFaint,
    textAlign: "center",
  },
  tagHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  addTag: {
    color: colors.accent,
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  tagChipActive: {
    borderColor: "rgba(163, 177, 138, 0.35)",
    backgroundColor: colors.surfaceBlue,
  },
  tagText: {
    color: colors.textMuted,
  },
  activeText: {
    color: colors.primary,
    fontWeight: "700",
  },
});
