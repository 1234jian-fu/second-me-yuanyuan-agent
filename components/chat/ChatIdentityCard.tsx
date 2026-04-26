import { StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { VisualAsset } from "@/components/VisualAsset";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

export function ChatIdentityCard() {
  return (
    <View style={styles.card}>
      <View style={styles.glow} />
      <View style={styles.header}>
        <View style={styles.avatar}>
          <VisualAsset assetId="momo.avatar.default" momoSize="xs" />
        </View>
        <View style={styles.identityCopy}>
          <AppText variant="sectionTitle" style={styles.name}>
            渊元
          </AppText>
          <View style={styles.badge}>
            <AppText variant="micro" style={styles.badgeText}>
              数字分身
            </AppText>
          </View>
        </View>
      </View>

      <AppText variant="caption" style={styles.description}>
        我会结合你最近的记录、计划和对话，尽量给出更贴近你的回应。
      </AppText>

      <View style={styles.footer}>
        <MaterialSymbol name="ai" size={16} color={colors.primary} />
        <AppText variant="caption" style={styles.footerText}>
          当前基于近期记录做轻量理解
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    overflow: "hidden",
    borderRadius: radius.xxl,
    padding: spacing.lg,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  glow: {
    position: "absolute",
    right: -22,
    top: -18,
    width: 118,
    height: 118,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
  },
  identityCopy: {
    gap: spacing.xs,
  },
  name: {
    fontSize: 22,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primarySoft,
  },
  badgeText: {
    color: colors.primary,
  },
  description: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: spacing.md,
  },
  footerText: {
    color: colors.textMuted,
  },
});
