import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SoftBackdrop } from "@/components/SoftBackdrop";
import { colors, layout, spacing } from "@/config/theme";

type PageContainerProps = {
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  ambient?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

export function PageContainer({
  children,
  footer,
  scroll = true,
  ambient = true,
  contentStyle,
}: PageContainerProps) {
  const content = (
    <View style={[styles.content, footer ? styles.contentWithFooter : styles.contentDefault, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {ambient ? <SoftBackdrop /> : null}
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: layout.screenMaxWidth,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingTop: spacing.lg,
  },
  contentDefault: {
    paddingBottom: spacing.xxl + 100,
  },
  contentWithFooter: {
    paddingBottom: spacing.lg,
  },
  footer: {
    width: "100%",
  },
});
