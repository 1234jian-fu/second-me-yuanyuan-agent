import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { spacing } from "@/config/theme";

type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <AppText variant="sectionTitle">{title}</AppText>
      {description ? (
        <AppText variant="caption">{description}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
});
