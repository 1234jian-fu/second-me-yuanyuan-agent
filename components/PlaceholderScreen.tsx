import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppButton } from "@/components/AppButton";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { AppText, Surface } from "@/components/ui";
import { spacing } from "@/config/theme";

type PlaceholderScreenProps = {
  title: string;
  description: string;
};

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  const router = useRouter();

  return (
    <PageContainer>
      <View style={styles.container}>
        <PageHeader kicker="MVP shell" title={title} />
        <Surface>
          <AppText variant="caption">{description}</AppText>
        </Surface>
        <AppButton title="Back home" variant="secondary" onPress={() => router.back()} />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
});
