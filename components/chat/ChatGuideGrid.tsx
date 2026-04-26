import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

export type ChatGuideItem = {
  icon: MaterialSymbolName;
  label: string;
  prompt: string;
};

type ChatGuideGridProps = {
  disabled?: boolean;
  items: ChatGuideItem[];
  onPressItem: (prompt: string) => void;
};

export function ChatGuideGrid({ disabled = false, items, onPressItem }: ChatGuideGridProps) {
  return (
    <View style={styles.section}>
      <AppText variant="micro" style={styles.kicker}>
        你可以这样和我聊
      </AppText>
      <View style={styles.grid}>
        {items.map((item) => (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            disabled={disabled}
            onPress={() => onPressItem(item.prompt)}
            style={({ pressed }) => [styles.card, disabled && styles.disabled, pressed && styles.pressed]}
          >
            <View style={styles.iconBubble}>
              <MaterialSymbol name={item.icon} size={18} color={colors.primary} />
            </View>
            <AppText variant="caption" style={styles.label}>
              {item.label}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  kicker: {
    color: colors.textMuted,
    paddingLeft: spacing.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  card: {
    width: "47.8%",
    minHeight: 94,
    justifyContent: "space-between",
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  iconBubble: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  label: {
    color: colors.text,
    fontSize: 14,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
