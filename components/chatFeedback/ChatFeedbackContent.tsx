import { Pressable, StyleSheet, View } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, radius, shadows, spacing } from "@/config/theme";

type FeedbackPoint = {
  icon: MaterialSymbolName;
  title: string;
  body: string;
};

type ChatFeedbackPersonaProps = {
  subtitle: string;
};

type ChatFeedbackUserCardProps = {
  content: string;
};

type ChatFeedbackAnswerCardProps = {
  content: string;
  points: FeedbackPoint[];
};

type ChatFeedbackSummaryCardProps = {
  content: string;
  tags: string[];
};

type ChatFeedbackFollowUpsProps = {
  items: string[];
  onPressItem: (item: string) => void;
  onRefresh: () => void;
};

type ChatFeedbackInputDockProps = {
  onPressText: () => void;
  onPressVoice: () => void;
};

export function ChatFeedbackPersona({ subtitle }: ChatFeedbackPersonaProps) {
  return (
    <View style={styles.persona}>
      <View style={styles.personaAvatar}>
        <MaterialSymbol name="spa" size={28} color={colors.primary} />
      </View>
      <AppText variant="sectionTitle" style={styles.personaName}>
        渊元
      </AppText>
      <View style={styles.personaBadge}>
        <AppText variant="micro" style={styles.personaBadgeText}>
          数字分身
        </AppText>
      </View>
      <AppText variant="caption" style={styles.personaCopy}>
        {subtitle}
      </AppText>
      <View style={styles.personaMeta}>
        <MaterialSymbol name="review" size={14} color={colors.accent} />
        <AppText variant="caption" style={styles.personaMetaText}>
          已结合最近会话上下文
        </AppText>
      </View>
    </View>
  );
}

export function ChatFeedbackUserCard({ content }: ChatFeedbackUserCardProps) {
  return (
    <View style={styles.userSection}>
      <View style={styles.userCard}>
        <View style={styles.voicePill}>
          <View style={styles.playCircle}>
            <MaterialSymbol name="play" size={18} color={colors.onPrimary} />
          </View>
          <View style={styles.waveform}>
            {[6, 10, 14, 18, 10, 6, 14, 10].map((height, index) => (
              <View key={`${height}-${index}`} style={[styles.waveBar, { height }]} />
            ))}
          </View>
          <AppText variant="caption" style={styles.duration}>
            刚刚
          </AppText>
        </View>
        <AppText variant="body" style={styles.userText}>
          {content}
        </AppText>
      </View>
    </View>
  );
}

export function ChatFeedbackAnswerCard({ content, points }: ChatFeedbackAnswerCardProps) {
  return (
    <View style={styles.answerCard}>
      <View style={styles.answerHeader}>
        <View style={styles.answerAvatar}>
          <MaterialSymbol name="spa" size={16} color={colors.primary} />
        </View>
        <AppText variant="caption" style={styles.answerName}>
          渊元
        </AppText>
      </View>

      <AppText variant="body" style={styles.answerIntro}>
        {content}
      </AppText>

      <View style={styles.pointList}>
        {points.map((point) => (
          <View key={point.title} style={styles.pointRow}>
            <View style={styles.pointIcon}>
              <MaterialSymbol name={point.icon} size={15} color={colors.textMuted} />
            </View>
            <View style={styles.pointCopy}>
              <AppText variant="bodyStrong" style={styles.pointTitle}>
                {point.title}
              </AppText>
              <AppText variant="caption" style={styles.pointBody}>
                {point.body}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.reactions}>
        <View style={styles.reactionLeft}>
          <MaterialSymbol name="thumbUp" size={18} color={colors.textFaint} />
          <MaterialSymbol name="thumbDown" size={18} color={colors.textFaint} />
          <MaterialSymbol name="bookmark" size={18} color={colors.textFaint} />
        </View>
        <AppText variant="caption" style={styles.duration}>
          已生成
        </AppText>
      </View>
    </View>
  );
}

export function ChatFeedbackSummaryCard({ content, tags }: ChatFeedbackSummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryGlow} />
      <View style={styles.summaryHeader}>
        <MaterialSymbol name="summary" size={18} color={colors.primary} />
        <AppText variant="bodyStrong" style={styles.summaryTitle}>
          本次对话摘要
        </AppText>
      </View>
      <AppText variant="caption" style={styles.summaryBody}>
        {content}
      </AppText>
      <View style={styles.tagRow}>
        {tags.map((tag) => (
          <View key={tag} style={styles.summaryTag}>
            <AppText variant="caption" style={styles.summaryTagText}>
              {tag}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ChatFeedbackFollowUps({
  items,
  onPressItem,
  onRefresh,
}: ChatFeedbackFollowUpsProps) {
  return (
    <View style={styles.followSection}>
      <View style={styles.followHeader}>
        <AppText variant="bodyStrong" style={styles.followTitle}>
          你可以继续问我
        </AppText>
        <Pressable accessibilityRole="button" onPress={onRefresh}>
          <AppText variant="caption" style={styles.refreshText}>
            换一批
          </AppText>
        </Pressable>
      </View>
      <View style={styles.followList}>
        {items.map((item) => (
          <Pressable key={item} accessibilityRole="button" onPress={() => onPressItem(item)} style={styles.followItem}>
            <AppText variant="caption" style={styles.followItemText}>
              {item}
            </AppText>
            <MaterialSymbol name="arrowUp" size={14} color={colors.accent} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function ChatFeedbackInputDock({
  onPressText,
  onPressVoice,
}: ChatFeedbackInputDockProps) {
  return (
    <View style={styles.inputDock}>
      <Pressable accessibilityRole="button" onPress={onPressVoice} style={styles.inputSide}>
        <MaterialSymbol name="mic" size={20} color={colors.textMuted} />
        <AppText variant="caption" style={styles.inputSideText}>
          按住说话
        </AppText>
      </Pressable>
      <View style={styles.inputMic}>
        <MaterialSymbol name="mic" size={26} color={colors.onPrimary} />
      </View>
      <Pressable accessibilityRole="button" onPress={onPressText} style={styles.inputSide}>
        <AppText variant="caption" style={styles.inputSideText}>
          文字输入
        </AppText>
        <MaterialSymbol name="keyboard" size={20} color={colors.textMuted} />
      </Pressable>
      <View style={styles.privacyRow}>
        <MaterialSymbol name="lock" size={12} color={colors.textFaint} />
        <AppText variant="caption" style={styles.privacyText}>
          对话内容仅自己可见
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  persona: {
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  personaAvatar: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  personaName: {
    fontSize: 24,
  },
  personaBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.surfaceMuted,
  },
  personaBadgeText: {
    color: colors.textMuted,
    fontSize: 10,
  },
  personaCopy: {
    maxWidth: 280,
    color: colors.textMuted,
    textAlign: "center",
  },
  personaMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  personaMetaText: {
    color: colors.accent,
  },
  userSection: {
    alignItems: "flex-end",
  },
  userCard: {
    maxWidth: "84%",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(228, 226, 222, 0.5)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 6,
    padding: spacing.lg,
    backgroundColor: colors.backgroundSoft,
    ...shadows.card,
  },
  voicePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.full,
    padding: spacing.xs,
    paddingRight: spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.58)",
  },
  playCircle: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 18,
  },
  waveBar: {
    width: 3,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    opacity: 0.7,
  },
  duration: {
    color: colors.textFaint,
    fontSize: 11,
  },
  userText: {
    fontSize: 15,
    lineHeight: 24,
  },
  answerCard: {
    gap: spacing.lg,
    maxWidth: "94%",
    borderWidth: 1,
    borderColor: "rgba(228, 226, 222, 0.42)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 6,
    padding: spacing.lg,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  answerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  answerAvatar: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSoft,
  },
  answerName: {
    color: colors.text,
    fontWeight: "700",
  },
  answerIntro: {
    fontSize: 15,
    lineHeight: 25,
  },
  pointList: {
    gap: spacing.md,
  },
  pointRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  pointIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
  },
  pointCopy: {
    flex: 1,
    gap: 2,
  },
  pointTitle: {
    fontSize: 14,
  },
  pointBody: {
    color: colors.textMuted,
  },
  reactions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: spacing.md,
  },
  reactionLeft: {
    flexDirection: "row",
    gap: spacing.md,
  },
  summaryCard: {
    overflow: "hidden",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(228, 226, 222, 0.42)",
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: colors.backgroundSoft,
    ...shadows.card,
  },
  summaryGlow: {
    position: "absolute",
    top: -32,
    right: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(86, 99, 66, 0.05)",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  summaryTitle: {
    fontSize: 16,
  },
  summaryBody: {
    color: colors.textMuted,
    lineHeight: 21,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  summaryTag: {
    borderWidth: 1,
    borderColor: "rgba(198, 200, 187, 0.42)",
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: "rgba(228, 226, 222, 0.4)",
  },
  summaryTagText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  followSection: {
    gap: spacing.md,
  },
  followHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
  },
  followTitle: {
    color: colors.textMuted,
    fontSize: 14,
  },
  refreshText: {
    color: colors.textFaint,
  },
  followList: {
    gap: spacing.sm,
  },
  followItem: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(228, 226, 222, 0.52)",
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceRaised,
  },
  followItemText: {
    color: colors.text,
  },
  inputDock: {
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(228, 226, 222, 0.48)",
    borderRadius: 32,
    padding: spacing.sm,
    backgroundColor: colors.surfaceRaised,
    ...shadows.floating,
  },
  inputSide: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundSoft,
  },
  inputSideText: {
    color: colors.textMuted,
  },
  inputMic: {
    position: "absolute",
    left: "50%",
    top: spacing.sm + 22,
    width: 56,
    height: 56,
    marginLeft: -28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    ...shadows.floating,
  },
  privacyRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  privacyText: {
    color: colors.textFaint,
    fontSize: 10,
  },
});
