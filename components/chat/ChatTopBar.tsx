import { StyleSheet, View } from "react-native";

import { SoftIconButton } from "@/components/SoftIconButton";
import { AppText } from "@/components/ui";
import { colors, spacing } from "@/config/theme";

type ChatTopBarProps = {
  onBack: () => void;
};

export function ChatTopBar({ onBack }: ChatTopBarProps) {
  return (
    <View style={styles.container}>
      <SoftIconButton color={colors.primary} icon="back" onPress={onBack} size={48} />

      <View style={styles.titleBlock}>
        <AppText variant="sectionTitle" style={styles.title}>
          AI 对话
        </AppText>
        <AppText variant="caption" style={styles.subtitle}>
          和你的数字分身聊聊最近发生的事
        </AppText>
      </View>

      <SoftIconButton color={colors.textMuted} icon="settings" size={48} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xxs,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    color: colors.textMuted,
    textAlign: "center",
  },
});
