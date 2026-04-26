import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { SoftIconButton } from "@/components/SoftIconButton";
import { AppText, Surface } from "@/components/ui";
import { layout, radius, spacing } from "@/config/theme";

type SettingsSheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function SettingsSheet({
  visible,
  title,
  onClose,
  children,
  footer,
}: SettingsSheetProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Surface style={styles.sheet} variant="floating">
          <View style={styles.header}>
            <AppText variant="sectionTitle">{title}</AppText>
            <SoftIconButton icon="close" onPress={onClose} size={42} />
          </View>
          <View style={styles.body}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Surface>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    backgroundColor: "rgba(34, 34, 56, 0.14)",
  },
  sheet: {
    width: "100%",
    maxWidth: layout.screenMaxWidth,
    alignSelf: "center",
    gap: spacing.md,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.82)",
    backgroundColor: "rgba(255,252,254,0.98)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  body: {
    gap: spacing.md,
  },
  footer: {
    paddingTop: spacing.xs,
  },
});
