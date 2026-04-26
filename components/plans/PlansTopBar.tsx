import { StyleSheet, View } from "react-native";

import { SoftIconButton } from "@/components/SoftIconButton";
import { VisualAsset } from "@/components/VisualAsset";
import { AppText } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

export function PlansTopBar() {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <VisualAsset assetId="momo.avatar.calm" momoSize="xs" />
        </View>
        <View style={styles.copy}>
          <AppText variant="hero" style={styles.title}>
            计划
          </AppText>
          <AppText variant="subtitle" style={styles.subtitle}>
            把今天拆成几个真正能完成的小步骤
          </AppText>
        </View>
      </View>

      <View style={styles.actions}>
        <SoftIconButton icon="calendar" size={46} color={colors.primary} />
        <SoftIconButton icon="more" size={46} color={colors.textMuted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
  subtitle: {
    color: colors.textMuted,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
});
