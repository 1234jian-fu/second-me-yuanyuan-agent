import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

type RecordButtonProps = {
  isRecording: boolean;
  onPress: () => void;
};

export function RecordButton({ isRecording, onPress }: RecordButtonProps) {
  return (
    <Pressable
      accessibilityLabel={isRecording ? "Stop recording" : "Start recording"}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isRecording && styles.buttonRecording,
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={styles.content}>
        <AppText variant="sectionTitle" style={styles.title}>
          {isRecording ? "Stop" : "Record"}
        </AppText>
        <AppText variant="caption" style={styles.caption}>
          {isRecording ? "Recording" : "Tap to start"}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 148,
    height: 148,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  buttonRecording: {
    backgroundColor: colors.danger,
  },
  buttonPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },
  content: {
    gap: spacing.xs,
    alignItems: "center",
  },
  title: {
    color: colors.onPrimary,
  },
  caption: {
    color: colors.onPrimary,
    opacity: 0.82,
  },
});
