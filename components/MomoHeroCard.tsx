import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import type { VisualAssetId } from "@/assets/visualAssets";
import type { MomoAvatarMood } from "@/components/MomoAvatar";
import { VisualAsset } from "@/components/VisualAsset";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

type MomoHeroCardProps = {
  bubbleText: string;
  mood?: MomoAvatarMood;
  assetId?: VisualAssetId;
  height?: number;
  children?: ReactNode;
};

const heroAssetByMood: Record<MomoAvatarMood, VisualAssetId> = {
  happy: "momo.hero.default",
  calm: "momo.hero.calm",
  wink: "momo.hero.wink",
  headphones: "momo.hero.headphones",
};

export function MomoHeroCard({
  assetId,
  bubbleText,
  mood = "happy",
  height = 210,
  children,
}: MomoHeroCardProps) {
  return (
    <View style={[styles.card, { minHeight: height }]}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <View style={styles.bubble}>
        <AppText variant="body" style={styles.bubbleText}>
          {bubbleText}
        </AppText>
      </View>
      <View style={styles.avatar}>
        <VisualAsset assetId={assetId ?? heroAssetByMood[mood]} momoSize="lg" />
      </View>
      {children ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    backgroundColor: colors.surfaceLavender,
    ...shadows.card,
  },
  glowOne: {
    position: "absolute",
    right: -30,
    top: -24,
    width: 180,
    height: 180,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  glowTwo: {
    position: "absolute",
    left: -54,
    bottom: -70,
    width: 180,
    height: 140,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,242,226,0.72)",
  },
  bubble: {
    alignSelf: "flex-start",
    maxWidth: 214,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  bubbleText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  avatar: {
    position: "absolute",
    right: 28,
    bottom: -2,
  },
  content: {
    marginTop: spacing.md,
  },
});
