import { StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText, Surface } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

const waveBars = [5, 9, 13, 18, 11, 6, 15, 10, 7];

type VoiceMemoCardProps = {
  transcript: string;
  duration?: string;
};

export function VoiceMemoCard({ transcript, duration = "00:48" }: VoiceMemoCardProps) {
  return (
    <Surface style={styles.card}>
      <View style={styles.player}>
        <View style={styles.playButton}>
          <MaterialSymbol name="play" size={18} color={colors.onPrimary} />
        </View>
        <View style={styles.waveform}>
          {waveBars.map((height, index) => (
            <View key={`${height}-${index}`} style={[styles.waveBar, { height }]} />
          ))}
        </View>
        <AppText variant="micro" style={styles.duration}>
          {duration}
        </AppText>
      </View>
      <AppText variant="body" style={styles.transcript}>
        {transcript}
      </AppText>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "flex-end",
    maxWidth: "88%",
    gap: spacing.md,
    borderWidth: 0,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.sm,
    backgroundColor: colors.surfaceTint,
  },
  player: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.full,
    padding: spacing.xs,
    paddingRight: spacing.md,
    backgroundColor: "rgba(255,255,255,0.62)",
  },
  playButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  waveform: {
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  waveBar: {
    width: 3,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    opacity: 0.68,
  },
  duration: {
    color: colors.textFaint,
  },
  transcript: {
    color: colors.textMuted,
    fontSize: 15,
  },
});
