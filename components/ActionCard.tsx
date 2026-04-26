import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import { AppText, PressableSurface, Stack } from "@/components/ui";
import { colors, layout, radius, spacing } from "@/config/theme";

type ActionCardProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  rightSlot?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  featured?: boolean;
};

export function ActionCard({
  title,
  description,
  eyebrow,
  rightSlot,
  onPress,
  style,
  featured = false,
}: ActionCardProps) {
  return (
    <PressableSurface
      accessibilityLabel={title}
      onPress={onPress}
      style={[styles.card, featured && styles.featured, style]}
    >
      <Stack direction="row" gap="md" align="center">
        <Stack gap="xs" style={styles.content}>
          {eyebrow ? (
            <AppText variant="micro" style={featured && styles.featuredTextMuted}>
              {eyebrow}
            </AppText>
          ) : null}
          <AppText variant="sectionTitle" style={featured && styles.featuredText}>
            {title}
          </AppText>
          {description ? (
            <AppText
              numberOfLines={2}
              variant="caption"
              style={featured && styles.featuredTextMuted}
            >
              {description}
            </AppText>
          ) : null}
        </Stack>
        {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
      </Stack>
    </PressableSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: layout.cardMinHeight,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceRaised,
  },
  featured: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  featuredText: {
    color: colors.onPrimaryContainer,
  },
  featuredTextMuted: {
    color: colors.onPrimary,
    opacity: 0.78,
  },
  content: {
    flex: 1,
  },
  rightSlot: {
    minWidth: spacing.xl,
    alignItems: "flex-end",
  },
});
