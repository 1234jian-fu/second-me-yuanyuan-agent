import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

export type PlanListItem = {
  id: string;
  title: string;
  done: boolean;
};

type PlanLook = {
  category: string;
  duration: string;
  icon: MaterialSymbolName;
  priority: string;
  time: string;
};

type PlanTaskListProps = {
  isGenerating?: boolean;
  onAdd: () => void;
  onGenerate: () => void;
  onToggle: (id: string, done: boolean) => void;
  plans: PlanListItem[];
};

const planLooks: PlanLook[] = [
  { icon: "task", category: "工作 · 核心", priority: "高优先级", time: "09:30 - 11:30", duration: "2h" },
  { icon: "book", category: "个人 · 学习", priority: "中优先级", time: "14:00 - 15:30", duration: "1.5h" },
  { icon: "exercise", category: "健康 · 运动", priority: "中优先级", time: "16:30 - 17:15", duration: "45m" },
  { icon: "article", category: "生活 · 复盘", priority: "低优先级", time: "19:00 - 19:30", duration: "30m" },
];

export function PlanTaskList({
  isGenerating = false,
  onAdd,
  onGenerate,
  onToggle,
  plans,
}: PlanTaskListProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            今日任务
          </AppText>
          <AppText variant="caption" style={styles.subtitle}>
            先做最重要的，再决定要不要加新的。
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={isGenerating}
          onPress={onGenerate}
          style={({ pressed }) => [styles.generateButton, pressed && styles.pressed, isGenerating && styles.disabled]}
        >
          <MaterialSymbol name="ai" size={16} color={colors.primary} />
          <AppText variant="micro" style={styles.generateText}>
            {isGenerating ? "生成中" : "AI 生成"}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.list}>
        {plans.map((plan, index) => {
          const look = planLooks[index % planLooks.length];

          return (
            <Pressable
              key={plan.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: plan.done }}
              onPress={() => onToggle(plan.id, !plan.done)}
              style={({ pressed }) => [styles.taskCard, pressed && styles.pressed]}
            >
              <View style={styles.taskTop}>
                <View style={styles.leftCluster}>
                  <View style={styles.iconBubble}>
                    <MaterialSymbol name={look.icon} size={16} color={colors.primary} />
                  </View>
                  <View style={styles.tags}>
                    <View style={styles.tag}>
                      <AppText variant="micro" style={styles.tagText}>
                        {look.category}
                      </AppText>
                    </View>
                    <View style={[styles.tag, index === 0 ? styles.priorityHigh : styles.priorityNormal]}>
                      <AppText variant="micro" style={styles.tagText}>
                        {look.priority}
                      </AppText>
                    </View>
                  </View>
                </View>
                <View style={[styles.checkbox, plan.done && styles.checkboxDone]}>
                  {plan.done ? <MaterialSymbol name="check" size={18} color={colors.onPrimary} /> : null}
                </View>
              </View>

              <AppText variant="bodyStrong" style={[styles.taskTitle, plan.done && styles.doneText]} numberOfLines={2}>
                {plan.title}
              </AppText>

              <View style={styles.metaLine}>
                <MaterialSymbol name="clock" size={14} color={colors.textFaint} />
                <AppText variant="caption" style={styles.metaText}>
                  {look.time}
                </AppText>
                <AppText variant="caption" style={styles.metaDot}>
                  ·
                </AppText>
                <AppText variant="caption" style={styles.metaText}>
                  {look.duration}
                </AppText>
              </View>
            </Pressable>
          );
        })}

        <Pressable accessibilityRole="button" onPress={onAdd} style={({ pressed }) => [styles.addTaskButton, pressed && styles.pressed]}>
          <MaterialSymbol name="addCircle" size={18} color={colors.primary} />
          <AppText variant="body" style={styles.addTaskText}>
            添加一条计划
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  sectionTitle: {
    fontSize: 22,
  },
  subtitle: {
    color: colors.textMuted,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.86)",
  },
  generateText: {
    color: colors.primary,
  },
  list: {
    gap: spacing.md,
  },
  taskCard: {
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  taskTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  leftCluster: {
    flex: 1,
    gap: spacing.sm,
  },
  iconBubble: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  tag: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  priorityHigh: {
    backgroundColor: colors.surfaceBeige,
  },
  priorityNormal: {
    backgroundColor: colors.surfaceMuted,
  },
  tagText: {
    color: colors.textMuted,
  },
  taskTitle: {
    fontSize: 18,
    lineHeight: 25,
  },
  doneText: {
    color: colors.textFaint,
    textDecorationLine: "line-through",
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  metaText: {
    color: colors.textFaint,
  },
  metaDot: {
    color: colors.textFaint,
  },
  checkbox: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.full,
  },
  checkboxDone: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  addTaskButton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.borderStrong,
    borderRadius: radius.xl,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  addTaskText: {
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.58,
  },
});
