import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { spacing } from "@/config/theme";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="sectionTitle">{title}</AppText>
      {description ? <AppText variant="caption">{description}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    paddingVertical: spacing.lg,
  },
});
