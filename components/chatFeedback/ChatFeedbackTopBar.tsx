import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { VisualAsset } from "@/components/VisualAsset";
import { AppText } from "@/components/ui";
import { colors, layout, radius, spacing } from "@/config/theme";

type ChatFeedbackTopBarProps = {
  onBack: () => void;
};

export function ChatFeedbackTopBar({ onBack }: ChatFeedbackTopBarProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="返回"
        accessibilityRole="button"
        hitSlop={spacing.xs}
        onPress={onBack}
        style={styles.sideButton}
      >
        <MaterialSymbol name="back" size={22} color={colors.textFaint} />
      </Pressable>

      <View style={styles.titleBlock}>
        <AppText variant="bodyStrong" style={styles.title}>
          AI 对话
        </AppText>
        <AppText variant="caption" style={styles.subtitle}>
          与你的数字分身对话
        </AppText>
      </View>

      <View style={styles.avatar}>
        <VisualAsset assetId="momo.avatar.default" momoSize="xs" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sideButton: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  titleBlock: {
    alignItems: "center",
    gap: 2,
  },
  title: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  subtitle: {
    color: colors.textFaint,
    fontSize: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
  },
});
