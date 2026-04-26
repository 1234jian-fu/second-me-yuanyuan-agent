import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

type HomeFeatureCardProps = {
  title: string;
  description: string;
  icon: MaterialSymbolName;
  tint: string;
  primary?: boolean;
  onPress: () => void;
};

export function HomeFeatureCard({
  title,
  description,
  icon,
  tint,
  primary,
  onPress,
}: HomeFeatureCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: tint },
        primary && styles.primaryCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconBox, primary && styles.iconBoxPrimary]}>
        <MaterialSymbol name={icon} size={26} color={primary ? colors.onPrimary : colors.primary} />
      </View>

      <View style={styles.copy}>
        <AppText variant="bodyStrong" style={[styles.title, primary && styles.primaryText]}>
          {title}
        </AppText>
        <AppText variant="caption" style={[styles.description, primary && styles.primaryDescription]}>
          {description}
        </AppText>
      </View>

      <View style={[styles.arrowBubble, primary && styles.arrowBubblePrimary]}>
        <MaterialSymbol name="chevronRight" size={18} color={primary ? colors.onPrimary : colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "47.4%",
    flexGrow: 1,
    aspectRatio: 1.02,
    justifyContent: "space-between",
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  primaryCard: {
    backgroundColor: colors.primary,
  },
  iconBox: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.78)",
  },
  iconBoxPrimary: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  copy: {
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  description: {
    color: colors.textMuted,
    lineHeight: 18,
  },
  primaryText: {
    color: colors.onPrimary,
  },
  primaryDescription: {
    color: "rgba(255,255,255,0.84)",
  },
  arrowBubble: {
    alignSelf: "flex-end",
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.74)",
  },
  arrowBubblePrimary: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
