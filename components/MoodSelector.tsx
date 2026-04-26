import { Pressable, StyleSheet, View } from "react-native";

import { moodVisualOptions, visualAssets, type MoodValue } from "@/assets/visualAssets";
import { VisualAsset } from "@/components/VisualAsset";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

export type { MoodValue } from "@/assets/visualAssets";

type MoodSelectorProps = {
  value: MoodValue;
  onChange: (value: MoodValue) => void;
};

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <View style={styles.row}>
      {moodVisualOptions.map((mood) => {
        const active = mood.value === value;
        const asset = visualAssets[mood.assetId];
        const backgroundColor = "backgroundColor" in asset ? asset.backgroundColor : undefined;

        return (
          <Pressable
            key={mood.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(mood.value)}
            style={({ pressed }) => [
              styles.item,
              active && styles.itemActive,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.emojiCircle, { backgroundColor }]}>
              <VisualAsset assetId={mood.assetId} size={42} />
            </View>
            <AppText variant="caption" style={styles.label}>
              {mood.value}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  item: {
    flex: 1,
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  itemActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.84,
  },
  emojiCircle: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
  },
  label: {
    color: colors.text,
    textAlign: "center",
  },
});
