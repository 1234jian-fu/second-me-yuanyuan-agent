import "react-native-url-polyfill/auto";

import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import {
  NotoSansSC_400Regular,
  NotoSansSC_500Medium,
  NotoSansSC_700Bold,
} from "@expo-google-fonts/noto-sans-sc";
import {
  NotoSerifSC_400Regular,
  NotoSerifSC_500Medium,
  NotoSerifSC_600SemiBold,
} from "@expo-google-fonts/noto-serif-sc";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthBootstrap } from "@/components/AuthBootstrap";
import { colors } from "@/config/theme";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    NotoSansSC_400Regular,
    NotoSansSC_500Medium,
    NotoSansSC_700Bold,
    NotoSerifSC_400Regular,
    NotoSerifSC_500Medium,
    NotoSerifSC_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <AuthBootstrap />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}
