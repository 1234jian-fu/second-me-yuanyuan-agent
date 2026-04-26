import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, layout, radius, spacing } from "@/config/theme";

type RecordingTopBarProps = {
  title: string;
  onBack: () => void;
  onMore?: () => void;
};

export function RecordingTopBar({ title, onBack, onMore }: RecordingTopBarProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="返回"
        accessibilityRole="button"
        hitSlop={spacing.xs}
        onPress={onBack}
        style={styles.iconButton}
      >
        <MaterialSymbol name="back" size={24} color={colors.accent} />
      </Pressable>

      <AppText variant="bodyStrong" style={styles.title}>
        {title}
      </AppText>

      <Pressable
        accessibilityLabel="更多"
        accessibilityRole="button"
        hitSlop={spacing.xs}
        onPress={onMore}
        style={styles.iconButton}
      >
        <MaterialSymbol name="more" size={24} color={colors.accent} />
      </Pressable>
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
  iconButton: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
});
