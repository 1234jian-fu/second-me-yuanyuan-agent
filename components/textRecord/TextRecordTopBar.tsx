import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, layout, radius, spacing } from "@/config/theme";

type TextRecordTopBarProps = {
  disabled?: boolean;
  onBack: () => void;
  onSave: () => void;
};

export function TextRecordTopBar({ disabled = false, onBack, onSave }: TextRecordTopBarProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="返回"
        accessibilityRole="button"
        hitSlop={spacing.xs}
        onPress={onBack}
        style={styles.iconButton}
      >
        <MaterialSymbol name="back" size={22} color={colors.text} />
      </Pressable>

      <AppText variant="bodyStrong" style={styles.title}>
        文字记录
      </AppText>

      <Pressable
        accessibilityLabel="保存文字记录"
        accessibilityRole="button"
        disabled={disabled}
        hitSlop={spacing.xs}
        onPress={onSave}
        style={[styles.saveButton, disabled && styles.disabled]}
      >
        <AppText variant="micro" style={styles.saveText}>
          保存
        </AppText>
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
    fontSize: 16,
    fontWeight: "700",
  },
  saveButton: {
    minWidth: layout.touchTarget,
    minHeight: layout.touchTarget,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  saveText: {
    color: colors.accent,
  },
  disabled: {
    opacity: 0.5,
  },
});
