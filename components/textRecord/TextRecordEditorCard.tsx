import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { MaterialSymbol, type MaterialSymbolName } from "@/components/MaterialSymbol";
import { AppText } from "@/components/ui";
import { colors, fontFamilies, radius, shadows, spacing } from "@/config/theme";

type ToolbarAction = {
  icon: MaterialSymbolName;
  label: string;
  onPress?: () => void;
};

type TextRecordEditorCardProps = {
  content: string;
  maxLength: number;
  onChangeContent: (content: string) => void;
  onChangeTitle: (title: string) => void;
  onVoicePress?: () => void;
  title: string;
};

export function TextRecordEditorCard({
  content,
  maxLength,
  onChangeContent,
  onChangeTitle,
  onVoicePress,
  title,
}: TextRecordEditorCardProps) {
  const toolbarActions: ToolbarAction[] = [
    { icon: "photo", label: "添加图片" },
    { icon: "tag", label: "添加标签" },
    { icon: "mood", label: "插入心情" },
    { icon: "mic", label: "语音转文字", onPress: onVoicePress },
  ];

  return (
    <View style={styles.card}>
      <TextInput
        accessibilityLabel="记录标题"
        maxLength={50}
        onChangeText={onChangeTitle}
        placeholder="请输入标题（可选）"
        placeholderTextColor={colors.textFaint}
        style={styles.titleInput}
        value={title}
      />

      <TextInput
        accessibilityLabel="记录正文"
        maxLength={maxLength}
        multiline
        onChangeText={onChangeContent}
        placeholder="此刻的想法、感受、灵感…"
        placeholderTextColor={colors.textFaint}
        style={styles.contentInput}
        textAlignVertical="top"
        value={content}
      />

      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          {toolbarActions.map((action) => (
            <Pressable
              key={action.label}
              accessibilityLabel={action.label}
              accessibilityRole="button"
              hitSlop={spacing.xs}
              onPress={action.onPress}
              style={styles.toolbarButton}
            >
              <MaterialSymbol name={action.icon} size={20} color={colors.textFaint} />
            </Pressable>
          ))}
        </View>

        <AppText variant="caption" style={styles.counter}>
          {content.length}/{maxLength}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    borderRadius: 32,
    padding: spacing.lg,
    backgroundColor: colors.surfaceRaised,
    ...shadows.card,
  },
  titleInput: {
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    color: colors.text,
    fontFamily: fontFamilies.medium,
    fontSize: 20,
    lineHeight: 26,
    paddingHorizontal: 0,
  },
  contentInput: {
    minHeight: 218,
    color: colors.text,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 26,
    paddingHorizontal: 0,
    paddingTop: spacing.sm,
  },
  toolbar: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  toolbarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  toolbarButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  counter: {
    color: colors.borderStrong,
  },
});
