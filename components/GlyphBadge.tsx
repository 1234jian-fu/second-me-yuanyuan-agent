import { StyleSheet, View } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

type GlyphBadgeTone = "sage" | "amber" | "clay" | "ink";

type GlyphBadgeProps = {
  glyph?: string;
  icon?: MaterialSymbolName;
  tone?: GlyphBadgeTone;
  size?: number;
};

export function GlyphBadge({ glyph, icon, tone = "sage", size = 22 }: GlyphBadgeProps) {
  const iconColor = tone === "ink" ? colors.onPrimary : colors.primaryPressed;

  return (
    <View style={[styles.badge, styles[tone]]}>
      {icon ? (
        <MaterialSymbol name={icon} size={size} color={iconColor} />
      ) : (
        <AppText variant="bodyStrong" style={[styles.text, tone === "ink" && styles.textOnDark]}>
          {glyph}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    padding: spacing.xs,
  },
  sage: {
    backgroundColor: colors.primarySoft,
  },
  amber: {
    backgroundColor: colors.amberSoft,
  },
  clay: {
    backgroundColor: colors.claySoft,
  },
  ink: {
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.primaryPressed,
  },
  textOnDark: {
    color: colors.onPrimary,
  },
});
