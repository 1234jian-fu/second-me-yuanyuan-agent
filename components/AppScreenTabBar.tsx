import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { primaryTabs, type PrimaryTabKey } from "@/config/navigation";
import { colors, layout, radius, shadows, spacing } from "@/config/theme";

type AppScreenTabBarProps = {
  activeKey: PrimaryTabKey;
};

export function AppScreenTabBar({ activeKey }: AppScreenTabBarProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {primaryTabs.map((tab) => {
        const active = tab.key === activeKey;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            hitSlop={spacing.xs}
            onPress={() => {
              if (!active) {
                router.push(tab.route);
              }
            }}
            style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.itemPressed]}
          >
            <MaterialSymbol name={tab.icon} size={22} color={active ? colors.primary : colors.textFaint} />
            <AppText variant="caption" style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: layout.screenMaxWidth,
    alignSelf: "center",
    minHeight: layout.bottomTabHeight + 18,
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: "rgba(255,255,255,0.68)",
    ...shadows.floating,
  },
  item: {
    flex: 1,
    minHeight: layout.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xxs,
    marginHorizontal: 2,
    borderRadius: radius.xl,
  },
  itemActive: {
    backgroundColor: "rgba(255,255,255,0.64)",
  },
  itemPressed: {
    opacity: 0.88,
  },
  label: {
    color: colors.textFaint,
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: "800",
  },
});
