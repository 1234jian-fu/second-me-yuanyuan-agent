import { StyleSheet, View } from "react-native";

import { HomeFeatureCard } from "@/components/home/HomeFeatureCard";
import { colors, spacing } from "@/config/theme";

type HomeFeatureGridProps = {
  onTextRecord: () => void;
  onVoiceRecord: () => void;
  onChat: () => void;
  onPlan: () => void;
};

export function HomeFeatureGrid({
  onTextRecord,
  onVoiceRecord,
  onChat,
  onPlan,
}: HomeFeatureGridProps) {
  return (
    <View style={styles.grid}>
      <HomeFeatureCard
        title="文字记录"
        description="写下想法、感受和灵感"
        icon="textRecord"
        tint={colors.surfaceBeige}
        onPress={onTextRecord}
      />
      <HomeFeatureCard
        title="开始录音"
        description="用声音留下此刻的状态"
        icon="mic"
        tint={colors.primary}
        primary
        onPress={onVoiceRecord}
      />
      <HomeFeatureCard
        title="AI 对话"
        description="整理思路，获得更贴近你的回应"
        icon="bubble"
        tint={colors.surfaceBlue}
        onPress={onChat}
      />
      <HomeFeatureCard
        title="今日计划"
        description="把目标拆成几个可以执行的小步骤"
        icon="calendarMonth"
        tint={colors.surfacePink}
        onPress={onPlan}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
});
