import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

type ChatVoiceCoreProps = {
  onMicPress: () => void;
  onTextModePress: () => void;
};

export function ChatVoiceCore({ onMicPress, onTextModePress }: ChatVoiceCoreProps) {
  return (
    <View style={styles.container}>
      <View style={styles.rippleArea}>
        <View style={[styles.ripple, styles.rippleLarge]} />
        <View style={[styles.ripple, styles.rippleMedium]} />
        <View style={[styles.ripple, styles.rippleSmall]} />
        <Pressable
          accessibilityLabel="语音对话"
          accessibilityRole="button"
          onPress={onMicPress}
          style={({ pressed }) => [styles.micButton, pressed && styles.pressed]}
        >
          <MaterialSymbol name="mic" size={38} color={colors.onPrimary} />
        </Pressable>
      </View>

      <View style={styles.copy}>
        <AppText variant="sectionTitle" style={styles.listeningText}>
          想说点什么？
        </AppText>
        <AppText variant="caption" style={styles.hintText}>
          可以直接说，也可以切到文字输入
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onTextModePress}
        style={({ pressed }) => [styles.textModeButton, pressed && styles.pressed]}
      >
        <MaterialSymbol name="keyboard" size={18} color={colors.textMuted} />
        <AppText variant="micro" style={styles.textModeText}>
          切换为文字输入
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  rippleArea: {
    width: "100%",
    height: 212,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  ripple: {
    position: "absolute",
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
  },
  rippleLarge: {
    width: 224,
    height: 224,
    opacity: 0.32,
  },
  rippleMedium: {
    width: 182,
    height: 182,
    opacity: 0.5,
  },
  rippleSmall: {
    width: 142,
    height: 142,
    opacity: 0.78,
  },
  micButton: {
    width: 98,
    height: 98,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    ...shadows.floating,
  },
  copy: {
    alignItems: "center",
    gap: spacing.xs,
  },
  listeningText: {
    fontSize: 22,
  },
  hintText: {
    color: colors.textMuted,
  },
  textModeButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: "rgba(255,255,255,0.88)",
    ...shadows.card,
  },
  textModeText: {
    color: colors.textMuted,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});
