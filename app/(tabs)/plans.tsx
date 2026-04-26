import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PageContainer } from "@/components/PageContainer";
import { SettingsSheet } from "@/components/settings/SettingsSheet";
import { AppText, Surface } from "@/components/ui";
import { colors, layout, radius, spacing } from "@/config/theme";
import { usePlans } from "@/hooks/usePlans";
import { aiService } from "@/services/ai/aiService";
import { useAuthStore } from "@/store/authStore";
import { useMockAgentStore } from "@/store/mockAgentStore";
import type { Plan } from "@/types/plans";
import { getErrorMessage } from "@/utils/errors";

type VisiblePlan = {
  id: string;
  title: string;
  done: boolean;
};

function mapPlan(plan: Plan): VisiblePlan {
  return {
    id: plan.id,
    title: plan.title,
    done: plan.status === "done",
  };
}

export default function PlansTab() {
  const router = useRouter();
  const params = useLocalSearchParams<{ draft?: string | string[] }>();
  const localPlans = useMockAgentStore((state) => state.plans);
  const addPlanToStore = useMockAgentStore((state) => state.addManualPlan);
  const togglePlanInStore = useMockAgentStore((state) => state.togglePlan);
  const user = useAuthStore((state) => state.user);
  const hasRemoteBackend = useAuthStore((state) => state.hasRemoteBackend);
  const { plans: remotePlans, error: plansError, loadToday, createPlan, createPlans, toggleDone } = usePlans();
  const [status, setStatus] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [handledDraftParam, setHandledDraftParam] = useState<string | null>(null);
  const remoteReady = hasRemoteBackend && Boolean(user);
  const plans = remoteReady ? remotePlans.map(mapPlan) : localPlans;
  const doneCount = plans.filter((plan) => plan.done).length;
  const normalizedDraft = useMemo(
    () => (Array.isArray(params.draft) ? params.draft[0] : params.draft)?.trim() ?? "",
    [params.draft],
  );

  useEffect(() => {
    if (remoteReady) {
      void loadToday();
    }
  }, [loadToday, remoteReady]);

  useEffect(() => {
    if (!normalizedDraft || handledDraftParam === normalizedDraft) {
      return;
    }

    setDraftTitle(normalizedDraft);
    setComposerOpen(true);
    setHandledDraftParam(normalizedDraft);
  }, [handledDraftParam, normalizedDraft]);

  async function saveManualPlan(title: string) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setStatus("先写一点计划内容，再保存。");
      return;
    }

    try {
      if (remoteReady) {
        await createPlan({ title: trimmedTitle, source: "manual" });
      } else {
        addPlanToStore(trimmedTitle);
      }

      setStatus("已添加一条新计划。");
      setComposerOpen(false);
      setDraftTitle("");
    } catch (error) {
      addPlanToStore(trimmedTitle);
      setStatus(`云端添加失败，已先保存到本地：${getErrorMessage(error)}`);
      setComposerOpen(false);
      setDraftTitle("");
    }
  }

  async function generateAiPlan() {
    if (isGeneratingPlan) {
      return;
    }

    setIsGeneratingPlan(true);
    setStatus("正在生成今日计划...");

    try {
      const drafts = await aiService.generatePlan({
        prompt: "帮我制定一个今天真正可执行的简单计划。",
      });
      const validDrafts = drafts.filter((draft) => draft.title.trim());

      if (validDrafts.length === 0) {
        setStatus("这次没有生成有效计划，稍后再试一次。");
        return;
      }

      if (remoteReady) {
        await createPlans(validDrafts.map((draft) => ({ ...draft, source: "ai" })));
      } else {
        validDrafts
          .slice()
          .reverse()
          .forEach((draft) => addPlanToStore(draft.title));
      }

      setStatus(`已生成 ${validDrafts.length} 条今日计划。`);
    } catch (error) {
      setStatus(`AI 计划生成失败：${getErrorMessage(error)}`);
    } finally {
      setIsGeneratingPlan(false);
    }
  }

  async function togglePlan(id: string, done: boolean) {
    if (!remoteReady) {
      togglePlanInStore(id, done);
      return;
    }

    try {
      await toggleDone(id, done);
    } catch (error) {
      setStatus(`计划状态更新失败：${getErrorMessage(error)}`);
    }
  }

  return (
    <PageContainer ambient contentStyle={styles.container}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.iconButton}>
            <MaterialSymbol name="back" size={20} color={colors.primaryPressed} />
          </Pressable>
          <View style={styles.titleBlock}>
            <AppText variant="micro" style={styles.kicker}>
              PLAN
            </AppText>
            <AppText variant="title">今日计划</AppText>
          </View>
          <Pressable accessibilityRole="button" onPress={generateAiPlan} style={styles.iconButton}>
            <MaterialSymbol name="ai" size={20} color={colors.primaryPressed} />
          </Pressable>
        </View>

        <Surface style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <MaterialSymbol name="plan" size={24} color={colors.primaryPressed} />
          </View>
          <View style={styles.heroCopy}>
            <AppText variant="sectionTitle">让今天轻一点，但更清晰</AppText>
            <AppText variant="caption">
              渊元会把计划压缩成可执行的小动作。先做一件，再做下一件。
            </AppText>
          </View>
        </Surface>

        <View style={styles.statsRow}>
          <Surface style={styles.statCard}>
            <AppText variant="stat">{plans.length}</AppText>
            <AppText variant="caption">计划</AppText>
          </Surface>
          <Surface style={styles.statCard}>
            <AppText variant="stat">{doneCount}</AppText>
            <AppText variant="caption">完成</AppText>
          </Surface>
          <Surface style={styles.statCard}>
            <AppText variant="stat">{plans.length ? Math.round((doneCount / plans.length) * 100) : 0}%</AppText>
            <AppText variant="caption">进度</AppText>
          </Surface>
        </View>

        <View style={styles.sectionHeader}>
          <AppText variant="sectionTitle">计划清单</AppText>
          <Pressable accessibilityRole="button" onPress={() => setComposerOpen(true)}>
            <AppText variant="caption" style={styles.linkText}>
              + 添加
            </AppText>
          </Pressable>
        </View>

        <View style={styles.planList}>
          {plans.map((plan) => (
            <Pressable
              key={plan.id}
              accessibilityRole="button"
              onPress={() => void togglePlan(plan.id, !plan.done)}
              style={({ pressed }) => [styles.planItem, plan.done && styles.planDone, pressed && styles.pressed]}
            >
              <View style={styles.planIcon}>
                <MaterialSymbol name={plan.done ? "check" : "checkboxEmpty"} size={22} color={plan.done ? colors.onPrimary : colors.primaryPressed} />
              </View>
              <View style={styles.planCopy}>
                <AppText variant="bodyStrong" style={plan.done ? styles.doneTitle : undefined}>
                  {plan.title}
                </AppText>
                <AppText variant="caption">{plan.done ? "已完成" : "点击勾选完成"}</AppText>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.actionRow}>
          <AppButton title="新增计划" variant="secondary" onPress={() => setComposerOpen(true)} style={styles.actionButton} />
          <AppButton title={isGeneratingPlan ? "生成中..." : "AI 生成"} onPress={generateAiPlan} disabled={isGeneratingPlan} style={styles.actionButton} />
        </View>

        {status || plansError ? (
          <AppText variant="caption" style={styles.statusText}>
            {status ?? plansError}
          </AppText>
        ) : null}
      </View>

      <SettingsSheet
        visible={composerOpen}
        title="新增计划"
        onClose={() => setComposerOpen(false)}
        footer={<AppButton title="保存计划" onPress={() => void saveManualPlan(draftTitle)} />}
      >
        <AppInput
          accessibilityLabel="计划标题"
          onChangeText={setDraftTitle}
          placeholder="例如：完成今天的复盘"
          value={draftTitle}
        />
        <AppText variant="caption" style={styles.sheetHint}>
          可以先写一句最小可执行动作，保存后再回来继续细化。
        </AppText>
      </SettingsSheet>
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
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.xxl,
    padding: spacing.lg,
  },
  heroIcon: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xxs,
    borderRadius: radius.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkText: {
    color: colors.primary,
    fontWeight: "800",
  },
  planList: {
    gap: spacing.sm,
  },
  planItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.md,
    backgroundColor: colors.surfaceRaised,
  },
  planDone: {
    backgroundColor: colors.primarySoft,
  },
  planIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  planCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  doneTitle: {
    color: colors.primaryPressed,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  statusText: {
    color: colors.textMuted,
    textAlign: "center",
  },
  sheetHint: {
    color: colors.textMuted,
  },
});
