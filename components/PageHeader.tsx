import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { spacing } from "@/config/theme";

type PageHeaderProps = {
  kicker?: string;
  title: string;
  description?: string;
};

export function PageHeader({ kicker, title, description }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      {kicker ? <AppText variant="kicker">{kicker}</AppText> : null}
      <AppText variant="title">{title}</AppText>
      {description ? <AppText variant="subtitle">{description}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
});
