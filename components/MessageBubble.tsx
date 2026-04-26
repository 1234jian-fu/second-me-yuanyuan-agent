import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { colors, radius, spacing } from "@/config/theme";
import type { ChatRole } from "@/types/chat";

type MessageBubbleProps = {
  role: ChatRole;
  content: string;
};

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <View
      style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      <AppText variant="body" style={isUser ? styles.userText : styles.assistantText}>
        {content}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "86%",
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius.sm,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: radius.sm,
  },
  userText: {
    color: colors.onPrimary,
  },
  assistantText: {
    color: colors.text,
  },
});
