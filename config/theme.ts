import { Platform } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

export const colors = {
  background: "#F8FCFF",
  backgroundSoft: "#EEF8FE",
  backgroundWash: "#DDEFF8",
  surface: "rgba(255,255,255,0.62)",
  surfaceRaised: "rgba(255,255,255,0.78)",
  surfaceMuted: "rgba(255,255,255,0.44)",
  surfaceTint: "rgba(207,234,250,0.56)",
  surfaceBlue: "#E3F2FC",
  surfaceBeige: "#F6F1E6",
  surfacePink: "#F4ECF4",
  surfaceLavender: "#EDF1FF",
  border: "rgba(255,255,255,0.66)",
  borderStrong: "rgba(92,135,164,0.2)",
  primary: "#4A93CF",
  primaryPressed: "#285D8A",
  primarySoft: "rgba(194,227,248,0.66)",
  accent: "#77C7E8",
  accentSoft: "rgba(226,246,255,0.82)",
  onPrimaryContainer: "#174C73",
  amber: "#C59645",
  amberSoft: "#F5E8CD",
  clay: "#6C7C8C",
  claySoft: "#E8EEF4",
  onPrimary: "#FFFFFF",
  text: "#142436",
  textMuted: "#61778A",
  textFaint: "#8EA7B7",
  success: "#5D9E81",
  warning: "#BC8B3E",
  danger: "#D65B65",
  hairline: "rgba(255,255,255,0.55)",
  hairlineStrong: "rgba(92,135,164,0.22)",
  shadow: "rgba(56,120,164,0.14)",
  shadowStrong: "rgba(38,101,152,0.2)",
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  xxl: 44,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 28,
  full: 999,
};

export const layout = {
  screenMaxWidth: 440,
  touchTarget: 48,
  bottomTabHeight: 82,
  cardMinHeight: 88,
};

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 5,
  } satisfies ViewStyle,
  floating: {
    shadowColor: colors.shadowStrong,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.2,
    shadowRadius: 42,
    elevation: 10,
  } satisfies ViewStyle,
};

export const fontFamilies = {
  light: "Manrope_300Light",
  regular: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  semibold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
  extrabold: "Manrope_800ExtraBold",
  cnRegular: Platform.select({
    web: '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif',
    default: "NotoSansSC_400Regular",
  }) as string,
  cnMedium: Platform.select({
    web: '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif',
    default: "NotoSansSC_500Medium",
  }) as string,
  cnBold: Platform.select({
    web: '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif',
    default: "NotoSansSC_700Bold",
  }) as string,
  display: Platform.select({
    web: '"Noto Serif SC", "SimSun", "Songti SC", serif',
    default: "NotoSerifSC_400Regular",
  }) as string,
  displayMedium: Platform.select({
    web: '"Noto Serif SC", "SimSun", "Songti SC", serif',
    default: "NotoSerifSC_500Medium",
  }) as string,
  displaySemiBold: Platform.select({
    web: '"Noto Serif SC", "SimSun", "Songti SC", serif',
    default: "NotoSerifSC_600SemiBold",
  }) as string,
};

export const typography = {
  hero: {
    color: colors.text,
    fontFamily: fontFamilies.display,
    fontSize: 31,
    fontWeight: "400",
    lineHeight: 39,
    letterSpacing: 3.4,
  } satisfies TextStyle,
  kicker: {
    color: colors.primary,
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0,
  } satisfies TextStyle,
  title: {
    color: colors.text,
    fontFamily: fontFamilies.display,
    fontSize: 25,
    fontWeight: "400",
    lineHeight: 33,
    letterSpacing: 3.4,
  } satisfies TextStyle,
  subtitle: {
    color: colors.textMuted,
    fontFamily: fontFamilies.cnRegular,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  } satisfies TextStyle,
  sectionTitle: {
    color: colors.text,
    fontFamily: fontFamilies.display,
    fontSize: 19,
    fontWeight: "400",
    lineHeight: 25,
    letterSpacing: 2.4,
  } satisfies TextStyle,
  body: {
    color: colors.text,
    fontFamily: fontFamilies.cnRegular,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  } satisfies TextStyle,
  bodyStrong: {
    color: colors.text,
    fontFamily: fontFamilies.cnBold,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    letterSpacing: 0,
  } satisfies TextStyle,
  caption: {
    color: colors.textMuted,
    fontFamily: fontFamilies.cnRegular,
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0,
  } satisfies TextStyle,
  micro: {
    color: colors.textFaint,
    fontFamily: fontFamilies.medium,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 14,
  } satisfies TextStyle,
  stat: {
    color: colors.text,
    fontFamily: fontFamilies.display,
    fontSize: 23,
    fontWeight: "400",
    lineHeight: 29,
    letterSpacing: 3,
  } satisfies TextStyle,
  button: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: 0,
  } satisfies TextStyle,
};

export const theme = {
  colors,
  layout,
  spacing,
  radius,
  shadows,
  fontFamilies,
  typography,
};
