import { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { AppScreenTabBar } from "@/components/AppScreenTabBar";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PageContainer } from "@/components/PageContainer";
import { AppText, Surface } from "@/components/ui";
import { colors, fontFamilies, layout, radius, shadows, spacing } from "@/config/theme";
import { useMockAgentStore } from "@/store/mockAgentStore";

const moodItems = ["很糟糕", "有点累", "还可以", "开心", "超开心"];

export default function MoodRecordScreen() {
  const router = useRouter();
  const addMoodRecord = useMockAgentStore((state) => state.addMoodRecord);
  const [mood, setMood] = useState("还可以");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  function saveMood() {
    addMoodRecord({ mood, note });
    setStatus(note.trim() ? "心情记录已保存到本地记忆库。" : "已记录今天的心情。");
    setNote("");
  }

  return (
    <PageContainer
      ambient
      contentStyle={styles.container}
      footer={<AppScreenTabBar activeKey="records" />}
    >
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.iconButton}>
            <MaterialSymbol name="back" size={20} color={colors.primaryPressed} />
          </Pressable>
          <View style={styles.titleBlock}>
            <AppText variant="micro" style={styles.kicker}>
              MOOD
            </AppText>
            <AppText variant="sectionTitle">心情记录</AppText>
          </View>
          <View style={styles.iconButton}>
            <MaterialSymbol name="bell" size={20} color={colors.primaryPressed} />
          </View>
        </View>

        <View style={styles.heading}>
          <AppText variant="title" style={styles.question}>
            今天感觉怎么样？
          </AppText>
          <AppText variant="caption" style={styles.subtitle}>
            选一个最接近此刻的状态，轻轻记录下来。
          </AppText>
        </View>

        <LinearGradient
          colors={["rgba(255,255,255,0.88)", "rgba(220,241,255,0.72)", "rgba(255,255,255,0.64)"]}
          style={styles.moodCard}
        >
          <View style={styles.orb}>
            <AppText variant="hero">☁</AppText>
          </View>
          <View style={styles.currentMood}>
            <AppText variant="sectionTitle" style={styles.currentMoodText}>
              {mood}
            </AppText>
          </View>
        </LinearGradient>

        <View style={styles.moodRow}>
          {moodItems.map((item) => {
            const active = item === mood;
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                onPress={() => setMood(item)}
                style={[styles.moodChip, active && styles.moodChipActive]}
              >
                <AppText variant="caption" style={active ? styles.moodActiveText : styles.moodText}>
                  {item}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <Surface style={styles.noteBox}>
          <TextInput
            accessibilityLabel="心情备注"
            multiline
            onChangeText={setNote}
            placeholder="想对自己说点什么..."
            placeholderTextColor={colors.textFaint}
            style={styles.noteInput}
            textAlignVertical="top"
            value={note}
          />
          <View style={styles.smileIcon}>
            <MaterialSymbol name="mood" size={30} color={colors.primary} />
          </View>
        </Surface>

        <Pressable accessibilityRole="button" onPress={saveMood} style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
          <MaterialSymbol name="calendar" size={22} color={colors.onPrimary} />
          <AppText variant="bodyStrong" style={styles.saveText}>
            打卡记录
          </AppText>
        </Pressable>

        {status ? (
          <AppText variant="caption" style={styles.statusText}>
            {status}
          </AppText>
        ) : null}
      </View>
    </PageContainer>
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
  topBar: {
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
  heading: {
    alignItems: "center",
    gap: spacing.xs,
  },
  question: {
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 300,
    textAlign: "center",
  },
  moodCard: {
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    ...shadows.floating,
  },
  orb: {
    width: 132,
    height: 132,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  currentMood: {
    position: "absolute",
    bottom: spacing.lg,
    minWidth: 120,
    alignItems: "center",
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.86)",
  },
  currentMoodText: {
    color: colors.primaryPressed,
  },
  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.sm,
  },
  moodChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceRaised,
  },
  moodChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  moodText: {
    color: colors.textMuted,
  },
  moodActiveText: {
    color: colors.primaryPressed,
    fontWeight: "800",
  },
  noteBox: {
    minHeight: 150,
    borderRadius: radius.xxl,
  },
  noteInput: {
    minHeight: 104,
    color: colors.text,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 26,
  },
  smileIcon: {
    alignSelf: "flex-end",
  },
  saveButton: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    ...shadows.floating,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  saveText: {
    color: colors.onPrimary,
    fontSize: 17,
  },
  statusText: {
    color: colors.textMuted,
    textAlign: "center",
  },
});
