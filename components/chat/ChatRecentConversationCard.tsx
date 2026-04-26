import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

type ChatRecentConversationCardProps = {
  meta: string;
  title: string;
  onPress: () => void;
};

export function ChatRecentConversationCard({
  meta,
  onPress,
  title,
}: ChatRecentConversationCardProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText variant="micro" style={styles.kicker}>
          最近对话
        </AppText>
        <MaterialSymbol name="chevronRight" size={18} color={colors.textMuted} />
      </View>

      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.playButton}>
          <MaterialSymbol name="play" size={20} color={colors.primary} />
        </View>
        <View style={styles.copy}>
          <AppText variant="bodyStrong" style={styles.title} numberOfLines={1}>
            {title}
          </AppText>
          <AppText variant="caption" style={styles.meta}>
            {meta}
          </AppText>
        </View>
        <View style={styles.badge}>
          <AppText variant="micro" style={styles.badgeText}>
            可继续
          </AppText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: spacing.xs,
  },
  kicker: {
    color: colors.textMuted,
  },
  card: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.md,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  playButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
  },
  meta: {
    color: colors.textFaint,
  },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceBeige,
  },
  badgeText: {
    color: colors.warning,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
