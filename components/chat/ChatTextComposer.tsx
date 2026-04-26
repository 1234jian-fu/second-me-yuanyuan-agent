import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, fontFamilies, radius, shadows, spacing } from "@/config/theme";

type ChatTextComposerProps = {
  disabled?: boolean;
  input: string;
  onChangeInput: (input: string) => void;
  onSend: () => void;
};

export function ChatTextComposer({
  disabled = false,
  input,
  onChangeInput,
  onSend,
}: ChatTextComposerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputBar}>
        <View style={styles.leadingIcon}>
          <MaterialSymbol name="keyboard" size={18} color={colors.primary} />
        </View>
        <TextInput
          accessibilityLabel="AI 对话文字输入"
          onChangeText={onChangeInput}
          onSubmitEditing={onSend}
          placeholder="输入你现在的想法…"
          placeholderTextColor={colors.textFaint}
          returnKeyType="send"
          style={styles.input}
          value={input}
        />
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={onSend}
          style={({ pressed }) => [styles.sendButton, disabled && styles.disabled, pressed && styles.pressed]}
        >
          <MaterialSymbol name="send" size={18} color={colors.onPrimary} />
        </Pressable>
      </View>
      <AppText variant="caption" style={styles.note}>
        对话内容仅自己可见
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  inputBar: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceRaised,
    ...shadows.floating,
  },
  leadingIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: fontFamilies.regular,
    fontSize: 15,
  },
  sendButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  note: {
    color: colors.textFaint,
    textAlign: "center",
  },
});
