import type { ReactNode } from "react";
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Switch, View } from "react-native";

import { AppButton } from "@/components/AppButton";
import { AppScreenTabBar } from "@/components/AppScreenTabBar";
import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { PageContainer } from "@/components/PageContainer";
import { AppText, Surface } from "@/components/ui";
import { colors, layout, radius, spacing } from "@/config/theme";
import { useMobileSettingsStore } from "@/store/mobileSettingsStore";

export default function SettingsScreen() {
  const router = useRouter();
  const profile = useMobileSettingsStore((state) => state.profile);
  const autoSync = useMobileSettingsStore((state) => state.autoSync);
  const lastSyncAt = useMobileSettingsStore((state) => state.lastSyncAt);
  const capture = useMobileSettingsStore((state) => state.capture);
  const reminders = useMobileSettingsStore((state) => state.reminders);
  const isSyncing = useMobileSettingsStore((state) => state.isSyncing);
  const lastExportUri = useMobileSettingsStore((state) => state.lastExportUri);
  const setAutoSync = useMobileSettingsStore((state) => state.setAutoSync);
  const setReminder = useMobileSettingsStore((state) => state.setReminder);
  const setCaptureSetting = useMobileSettingsStore((state) => state.setCaptureSetting);
  const runManualSync = useMobileSettingsStore((state) => state.runManualSync);
  const exportPersonalData = useMobileSettingsStore((state) => state.exportPersonalData);
  const deleteAllRecords = useMobileSettingsStore((state) => state.deleteAllRecords);

  async function handleManualSync() {
    try {
      const nextSync = await runManualSync();
      Alert.alert("同步完成", `最近同步时间：${nextSync}`);
    } catch (error) {
      Alert.alert("同步失败", error instanceof Error ? error.message : "稍后再试。");
    }
  }

  async function handleExportData() {
    try {
      const fileUri = await exportPersonalData();
      Alert.alert("导出成功", `个人数据已导出到：\n${fileUri}`);
    } catch (error) {
      Alert.alert("导出失败", error instanceof Error ? error.message : "稍后再试。");
    }
  }

  function confirmDeleteRecords() {
    Alert.alert("清空本地记录", "这会清空当前手机端本地记录、计划和对话。", [
      { text: "取消", style: "cancel" },
      {
        text: "确认清空",
        style: "destructive",
        onPress: () => {
          deleteAllRecords();
          Alert.alert("已清空", "本地数据已删除。");
        },
      },
    ]);
  }

  return (
    <PageContainer ambient contentStyle={styles.container} footer={<AppScreenTabBar activeKey="profile" />}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.iconButton}>
            <MaterialSymbol name="back" size={20} color={colors.primaryPressed} />
          </Pressable>
          <View style={styles.titleBlock}>
            <AppText variant="micro" style={styles.kicker}>
              SETTINGS
            </AppText>
            <AppText variant="title">设置</AppText>
          </View>
          <View style={styles.iconButton}>
            <MaterialSymbol name="settings" size={20} color={colors.primaryPressed} />
          </View>
        </View>

        <Surface style={styles.profileCard}>
          <View style={styles.avatar}>
            <AppText variant="sectionTitle" style={styles.avatarText}>
              行
            </AppText>
          </View>
          <View style={styles.profileCopy}>
            <AppText variant="sectionTitle">{profile.displayName}</AppText>
            <AppText variant="caption">{profile.email}</AppText>
            <AppText variant="caption">加入时间 {profile.joinedAt}</AppText>
          </View>
        </Surface>

        <Surface style={styles.section}>
          <AppText variant="bodyStrong">采集</AppText>
          <SettingLine title="录完自动上传" description="关闭后仅进入本地待上传队列" icon="upload">
            <AppSwitch
              value={capture.autoUploadAfterCapture}
              onValueChange={(value) => setCaptureSetting("autoUploadAfterCapture", value)}
            />
          </SettingLine>
          <SettingLine title="保留本地副本" description="云端管线接入后仍保留本机记录" icon="memory">
            <AppSwitch
              value={capture.keepLocalCopy}
              onValueChange={(value) => setCaptureSetting("keepLocalCopy", value)}
            />
          </SettingLine>
          <SettingLine title="处理完成提醒" description="转写、摘要或入库完成后提醒我" icon="bell">
            <AppSwitch
              value={reminders.analysisFinishedReminder}
              onValueChange={(value) => setReminder("analysisFinishedReminder", value)}
            />
          </SettingLine>
        </Surface>

        <Surface style={styles.section}>
          <AppText variant="bodyStrong">同步</AppText>
          <SettingLine title="云端同步" description={`最近同步：${lastSyncAt ?? "暂无"}`} icon="cloud">
            <AppSwitch value={autoSync} onValueChange={setAutoSync} />
          </SettingLine>
          <AppButton
            title={isSyncing ? "同步中..." : "立即同步"}
            disabled={isSyncing}
            variant="secondary"
            onPress={() => void handleManualSync()}
          />
        </Surface>

        <Surface style={styles.section}>
          <AppText variant="bodyStrong">数据</AppText>
          <SettingButton
            title="导出本地数据"
            description={lastExportUri ? `最近导出：${lastExportUri.split("/").pop()}` : "导出当前手机端数据快照"}
            icon="download"
            onPress={() => void handleExportData()}
          />
          <SettingButton title="清空本地记录" description="清空记录、计划和对话" icon="close" onPress={confirmDeleteRecords} danger />
        </Surface>
      </View>
    </PageContainer>
  );
}

type AppSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function AppSwitch({ value, onValueChange }: AppSwitchProps) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.borderStrong, true: colors.primarySoft }}
      thumbColor={value ? colors.primary : colors.surfaceRaised}
    />
  );
}

type SettingLineProps = {
  title: string;
  description: string;
  icon: MaterialSymbolName;
  children: ReactNode;
};

function SettingLine({ title, description, icon, children }: SettingLineProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <MaterialSymbol name={icon} size={18} color={colors.primaryPressed} />
      </View>
      <View style={styles.settingCopy}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="caption">{description}</AppText>
      </View>
      {children}
    </View>
  );
}

type SettingButtonProps = {
  title: string;
  description: string;
  icon: MaterialSymbolName;
  onPress: () => void;
  danger?: boolean;
};

function SettingButton({ title, description, icon, onPress, danger }: SettingButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}>
      <View style={[styles.settingIcon, danger && styles.dangerIcon]}>
        <MaterialSymbol name={icon} size={18} color={danger ? colors.danger : colors.primaryPressed} />
      </View>
      <View style={styles.settingCopy}>
        <AppText variant="bodyStrong" style={danger ? styles.dangerText : undefined}>
          {title}
        </AppText>
        <AppText variant="caption">{description}</AppText>
      </View>
      <MaterialSymbol name="chevronRight" size={18} color={colors.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: layout.screenMaxWidth,
    paddingTop: spacing.md,
  },
  screen: {
    flex: 1,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceRaised,
  },
  titleBlock: {
    alignItems: "center",
  },
  kicker: {
    color: colors.primary,
    fontWeight: "800",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.xxl,
    padding: spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
  },
  avatarText: {
    color: colors.primaryPressed,
  },
  profileCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  section: {
    gap: spacing.md,
    borderRadius: radius.xxl,
  },
  settingRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
  },
  dangerIcon: {
    backgroundColor: "rgba(214,91,101,0.12)",
  },
  settingCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  dangerText: {
    color: colors.danger,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.985 }],
  },
});
