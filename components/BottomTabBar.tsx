import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { primaryTabs } from "@/config/navigation";
import { colors, layout, radius, shadows, spacing } from "@/config/theme";

type BottomTabBarProps = {
  state: {
    index: number;
    routes: Array<{ key: string; name: string }>;
  };
  descriptors: Record<string, { options: Record<string, unknown> }>;
  navigation: {
    navigate: (name: string) => void;
  };
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const currentRoute = state.routes[state.index]?.name;

  return (
    <View style={styles.container}>
      {primaryTabs.map((tab) => {
        const tabRoute = state.routes.find((route) => route.name === tab.key);
        const visible = tabRoute ? descriptors[tabRoute.key]?.options.href !== null : true;
        const focused = currentRoute === tab.key;

        if (!visible || !tabRoute) {
          return null;
        }

        return (
          <Pressable
            key={tab.key}
            accessibilityLabel={tab.label}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            hitSlop={spacing.xs}
            onPress={() => navigation.navigate(tab.key)}
            style={({ pressed }) => [
              styles.item,
              focused && styles.itemActive,
              pressed && styles.itemPressed,
            ]}
          >
            <MaterialSymbol name={tab.icon} size={22} color={focused ? colors.primary : colors.textFaint} />
            <AppText variant="caption" style={[styles.label, focused && styles.labelActive]}>
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
    width: "86%",
    maxWidth: 360,
    alignSelf: "center",
    minHeight: layout.bottomTabHeight + 18,
    marginBottom: spacing.sm,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: "rgba(255,255,255,0.78)",
    flexDirection: "row",
    ...shadows.floating,
  },
  item: {
    flex: 1,
    minHeight: layout.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginHorizontal: 3,
    borderRadius: radius.xl,
  },
  itemActive: {
    backgroundColor: "rgba(226,246,255,0.58)",
  },
  itemPressed: {
    opacity: 0.88,
  },
  label: {
    color: colors.textFaint,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});
