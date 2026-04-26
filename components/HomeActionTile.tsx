import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText, PressableSurface } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

type HomeActionTileProps = {
  title: string;
  description: string;
  icon: MaterialSymbolName;
  tone?: "light" | "primary" | "blue" | "beige";
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const toneStyles = {
  light: {
    card: { backgroundColor: colors.surfaceTint },
    icon: { backgroundColor: colors.surfaceRaised },
    iconColor: colors.textMuted,
    title: colors.text,
    caption: colors.textFaint,
  },
  primary: {
    card: { backgroundColor: colors.accent },
    icon: { backgroundColor: "rgba(255,255,255,0.22)" },
    iconColor: colors.onPrimary,
    title: colors.onPrimary,
    caption: "rgba(255,255,255,0.78)",
  },
  blue: {
    card: { backgroundColor: "rgba(213,225,232,0.62)" },
    icon: { backgroundColor: colors.surfaceRaised },
    iconColor: "#556066",
    title: colors.text,
    caption: colors.textFaint,
  },
  beige: {
    card: { backgroundColor: colors.claySoft },
    icon: { backgroundColor: colors.surfaceRaised },
    iconColor: colors.clay,
    title: colors.text,
    caption: colors.textFaint,
  },
} satisfies Record<
  NonNullable<HomeActionTileProps["tone"]>,
  {
    card: ViewStyle;
    icon: ViewStyle;
    iconColor: string;
    title: string;
    caption: string;
  }
>;

export function HomeActionTile({
  title,
  description,
  icon,
  tone = "light",
  onPress,
  style,
}: HomeActionTileProps) {
  const palette = toneStyles[tone];

  return (
    <PressableSurface
      accessibilityLabel={title}
      onPress={onPress}
      style={[styles.card, palette.card, style]}
    >
      <View style={[styles.iconBox, palette.icon]}>
        <MaterialSymbol name={icon} size={26} color={palette.iconColor} />
      </View>
      <View style={styles.copy}>
        <AppText variant="bodyStrong" style={[styles.title, { color: palette.title }]}>
          {title}
        </AppText>
        <AppText variant="caption" style={[styles.description, { color: palette.caption }]}>
          {description}
        </AppText>
      </View>
    </PressableSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: "47%",
    maxWidth: "48%",
    aspectRatio: 1,
    justifyContent: "space-between",
    borderWidth: 0,
    borderRadius: radius.xxl,
    padding: spacing.lg,
  },
  iconBox: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
  },
  copy: {
    gap: spacing.xs,
  },
  title: {
    lineHeight: 22,
  },
  description: {
    opacity: 0.82,
  },
});
