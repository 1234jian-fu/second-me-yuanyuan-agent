import { Tabs } from "expo-router";

import { BottomTabBar } from "@/components/BottomTabBar";
import { colors } from "@/config/theme";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "记录" }} />
      <Tabs.Screen name="records" options={{ title: "记忆库" }} />
      <Tabs.Screen name="chat" options={{ title: "对话" }} />
      <Tabs.Screen name="profile" options={{ title: "我的" }} />
      <Tabs.Screen name="plans" options={{ href: null, title: "计划" }} />
    </Tabs>
  );
}
