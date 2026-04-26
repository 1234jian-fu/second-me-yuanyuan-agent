import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { SoftIconButton } from "@/components/SoftIconButton";
import { VisualAsset } from "@/components/VisualAsset";
import { AppText } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";

function getGreetingText(hour: number) {
  if (hour < 11) return "早上好，Cendy";
  if (hour < 14) return "中午好，Cendy";
  if (hour < 18) return "下午好，Cendy";
  return "晚上好，Cendy";
}

export function HomeGreetingHeader() {
  const now = useMemo(() => new Date(), []);
  const greeting = getGreetingText(now.getHours());
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("zh-CN", {
        month: "long",
        day: "numeric",
        weekday: "short",
      }).format(now),
    [now],
  );

  return (
    <View style={styles.header}>
      <View style={styles.greeting}>
        <AppText variant="hero" style={styles.title}>
          {greeting}
        </AppText>
        <AppText variant="subtitle" style={styles.subtitle}>
          {dateLabel} · 今天也在慢慢变得更清晰
        </AppText>
      </View>
      <View style={styles.headerActions}>
        <SoftIconButton icon="calendar" size={48} color={colors.textMuted} />
        <View style={styles.avatarBubble}>
          <VisualAsset assetId="profile.userAvatar" momoSize="xs" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  greeting: {
    flex: 1,
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
  subtitle: {
    color: colors.textMuted,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarBubble: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});
