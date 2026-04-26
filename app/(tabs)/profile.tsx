import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { DynamicHeroVideo } from "@/components/DynamicHeroVideo";
import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { PageContainer } from "@/components/PageContainer";
import { AppText, Surface } from "@/components/ui";
import { YuanGlass, YuanIconButton, YuanPageHeader, YuanSectionTitle, YuanStatTile } from "@/components/yuanyuan/YuanUI";
import { colors, radius, shadows, spacing } from "@/config/theme";
import { useMobileSettingsStore } from "@/store/mobileSettingsStore";
import { useMockAgentStore } from "@/store/mockAgentStore";

const traits = [
  { label: "决策风格", value: "夜审视，晨果断" },
  { label: "关注主题", value: "自由 · 节奏 · 创造" },
  { label: "情绪基调", value: "稳中带探索" },
  { label: "近期目标", value: "把产品落地到 MVP" },
];

const settingRows: Array<{ label: string; icon: MaterialSymbolName; route: string; value?: string; danger?: boolean }> = [
  { icon: "cloud", label: "云端同步", route: "/settings?focus=sync", value: "已开启 · WiFi 自动" },
  { icon: "memory", label: "本地缓存", route: "/settings?focus=privacy", value: "录完即清" },
  { icon: "upload", label: "上传策略", route: "/settings?focus=model", value: "仅 WiFi" },
  { icon: "lock", label: "隐私与端到端加密", route: "/settings?focus=privacy", value: "已启用" },
  { icon: "download", label: "导出我的全部数据", route: "/settings?focus=privacy" },
  { icon: "close", label: "一键销毁数字分身", route: "/settings?focus=privacy", danger: true },
];

export default function ProfileTab() {
  const router = useRouter();
  const personaStatus = useMobileSettingsStore((state) => state.personaStatus);
  const records = useMockAgentStore((state) => state.records);

  return (
    <PageContainer ambient contentStyle={styles.container}>
      <View style={styles.screen}>
        <YuanPageHeader
          eyebrow="PROFILE"
          title="行止"
          action={<YuanIconButton icon="settings" onPress={() => router.push("/settings")} />}
        />

        <View style={styles.heroCard}>
          <DynamicHeroVideo aspectRatio={16 / 9} rounded={false} />

          <View style={styles.heroCopy}>
            <AppText variant="micro" style={styles.kicker}>
              渊元 · 第 47 日
            </AppText>
            <AppText variant="sectionTitle" style={styles.heroTitle}>
              画像完整度 38% · {personaStatus === "ready" ? "仍在生长" : "等待恢复"}
            </AppText>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>

        <YuanSectionTitle
          icon="ai"
          title="我的画像"
          action={
            <Pressable accessibilityRole="button" onPress={() => router.push(`/chat?prompt=${encodeURIComponent("帮我解释一下我的当前画像")}`)}>
              <AppText variant="caption" style={styles.linkText}>
                查看全部
              </AppText>
            </Pressable>
          }
        />

        <View style={styles.traitGrid}>
          {traits.map((trait) => (
            <YuanGlass key={trait.label} style={styles.traitCard} soft>
              <AppText variant="caption" style={styles.traitLabel}>
                {trait.label}
              </AppText>
              <AppText variant="bodyStrong" style={styles.traitValue}>
                {trait.value}
              </AppText>
            </YuanGlass>
          ))}
        </View>

        <YuanSectionTitle icon="memory" title="数据中心" />

        <View style={styles.statsRow}>
          <YuanStatTile value="1.4 GB" label="云端" />
          <YuanStatTile value={records.length + 308} label="原始" />
          <YuanStatTile value="1.2k" label="记忆" />
        </View>

        <Surface style={styles.settingsCard}>
          {settingRows.map((item, index) => (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              onPress={() => {
                if (item.danger) {
                  Alert.alert("清空数字分身", "这个入口已连接到隐私设置，进入后会有二次确认。");
                }
                router.push(item.route);
              }}
              style={({ pressed }) => [styles.settingRow, index !== settingRows.length - 1 && styles.settingBorder, pressed && styles.pressed]}
            >
              <MaterialSymbol name={item.icon} size={18} color={item.danger ? colors.danger : colors.primaryPressed} />
              <AppText variant="bodyStrong" style={[styles.settingLabel, item.danger && styles.dangerText]}>
                {item.label}
              </AppText>
              {item.value ? (
                <AppText variant="caption" style={styles.settingValue}>
                  {item.value}
                </AppText>
              ) : null}
              <MaterialSymbol name="chevronRight" size={18} color={colors.textFaint} />
            </Pressable>
          ))}
        </Surface>

        <AppText variant="micro" style={styles.version}>
          渊元 · v0.1.0 · 你的另一个我
        </AppText>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 390,
    paddingHorizontal: 22,
  },
  screen: {
    gap: spacing.lg,
    width: "100%",
  },
  kicker: {
    color: colors.primary,
    letterSpacing: 4.8,
  },
  heroCard: {
    minHeight: 214,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    backgroundColor: colors.surfaceRaised,
    ...shadows.floating,
  },
  heroCopy: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 18,
    gap: spacing.xs,
  },
  heroTitle: {
    color: colors.primaryPressed,
    fontSize: 18,
    letterSpacing: 2.2,
  },
  progressTrack: {
    height: 5,
    width: "54%",
    overflow: "hidden",
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  progressFill: {
    width: "38%",
    height: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  linkText: {
    color: colors.primary,
    fontWeight: "700",
  },
  traitGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  traitCard: {
    width: "48%",
    minHeight: 84,
    gap: spacing.xs,
    borderRadius: 22,
    padding: spacing.md,
  },
  traitLabel: {
    color: colors.primary,
    fontWeight: "700",
  },
  traitValue: {
    color: colors.text,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  settingsCard: {
    overflow: "hidden",
    borderRadius: 26,
    paddingVertical: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.64)",
  },
  settingRow: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  settingLabel: {
    flex: 1,
  },
  settingValue: {
    color: colors.textMuted,
  },
  dangerText: {
    color: colors.danger,
  },
  version: {
    color: colors.textFaint,
    textAlign: "center",
    paddingBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
