import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

type AgentOrbProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
  active?: boolean;
};

export function AgentOrb({ label = "ME", size = "md", active = false }: AgentOrbProps) {
  return (
    <View style={[styles.wrap, styles[size], active && styles.active]}>
      <View style={styles.ringOuter} />
      <View style={styles.ringInner} />
      <View style={styles.core}>
        <AppText variant={size === "lg" ? "sectionTitle" : "caption"} style={styles.label}>
          {label}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
  },
  sm: {
    width: 44,
    height: 44,
  },
  md: {
    width: 72,
    height: 72,
  },
  lg: {
    width: 132,
    height: 132,
  },
  active: {
    backgroundColor: colors.accentSoft,
  },
  ringOuter: {
    position: "absolute",
    width: "82%",
    height: "82%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
  },
  ringInner: {
    position: "absolute",
    width: "58%",
    height: "58%",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.full,
    opacity: 0.35,
  },
  core: {
    minWidth: 34,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.onPrimary,
    fontWeight: "800",
  },
});
