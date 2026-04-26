import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

const waveBars = [12, 24, 16, 32, 20, 28, 12];

type RecordingCoreProps = {
  disabled?: boolean;
  isRecording: boolean;
  timer: string;
  onToggle: () => void;
};

export function RecordingCore({
  disabled = false,
  isRecording,
  timer,
  onToggle,
}: RecordingCoreProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.ring, styles.ringOuter]} />
      <View style={[styles.ring, styles.ringInner]} />

      <Pressable
        accessibilityLabel={isRecording ? "停止录音" : "开始录音"}
        accessibilityRole="button"
        disabled={disabled}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.micButton,
          isRecording && styles.micButtonActive,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <MaterialSymbol name="mic" size={48} color={colors.onPrimaryContainer} />
      </Pressable>

      <View style={styles.statusArea}>
        <View style={styles.waveRow}>
          {waveBars.map((height, index) => (
            <View
              key={`${height}-${index}`}
              style={[
                styles.waveBar,
                {
                  height,
                  backgroundColor: index % 2 === 0 ? colors.borderStrong : colors.accent,
                },
              ]}
            />
          ))}
        </View>

        <AppText variant="title" style={styles.timer}>
          {timer}
        </AppText>
        <AppText variant="micro" style={styles.statusText}>
          {isRecording ? "正在录音…" : "点击麦克风开始"}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 270,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(163, 177, 138, 0.24)",
    borderRadius: radius.full,
    backgroundColor: "rgba(163, 177, 138, 0.06)",
  },
  ringOuter: {
    top: 8,
    width: 238,
    height: 238,
  },
  ringInner: {
    top: 42,
    width: 170,
    height: 170,
    backgroundColor: "rgba(163, 177, 138, 0.10)",
  },
  micButton: {
    width: 112,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    ...shadows.floating,
  },
  micButtonActive: {
    backgroundColor: colors.primarySoft,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  statusArea: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    gap: spacing.sm,
  },
  waveRow: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  waveBar: {
    width: 4,
    borderRadius: radius.full,
  },
  timer: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: 3,
  },
  statusText: {
    color: colors.primary,
    opacity: 0.8,
  },
});
