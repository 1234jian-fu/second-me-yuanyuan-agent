import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { colors } from "@/config/theme";

type SoftBackdropVariant =
  | "default"
  | "records"
  | "plans"
  | "profile"
  | "recording"
  | "editor"
  | "mood"
  | "chat"
  | "chatFeedback";

type SoftBackdropProps = {
  variant?: SoftBackdropVariant;
};

const tintByVariant: Record<SoftBackdropVariant, string> = {
  default: "rgba(160,216,246,0.26)",
  records: "rgba(176,225,248,0.3)",
  plans: "rgba(235,230,215,0.32)",
  profile: "rgba(190,222,244,0.3)",
  recording: "rgba(140,207,242,0.4)",
  editor: "rgba(232,238,244,0.28)",
  mood: "rgba(230,236,248,0.3)",
  chat: "rgba(175,224,247,0.32)",
  chatFeedback: "rgba(220,235,246,0.3)",
};

export function SoftBackdrop({ variant = "default" }: SoftBackdropProps) {
  const [motion] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(motion, {
        toValue: 1,
        duration: 7600,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [motion]);

  const topScale = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.06, 1],
  });
  const bottomTranslate = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -16, 0],
  });
  const opacity = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.72, 0.92, 0.72],
  });

  return (
    <View pointerEvents="none" style={styles.layer}>
      <LinearGradient
        colors={["#FBFDFF", "#EDF8FE", "#DDEFF8"]}
        locations={[0, 0.58, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.topWash, { backgroundColor: tintByVariant[variant], opacity, transform: [{ scale: topScale }] }]} />
      <Animated.View style={[styles.bottomWash, { transform: [{ translateY: bottomTranslate }] }]} />
      <Animated.View style={[styles.floatGlow, styles.floatGlowA, { opacity, transform: [{ translateY: bottomTranslate }] }]} />
      <Animated.View style={[styles.floatGlow, styles.floatGlowB, { opacity, transform: [{ scale: topScale }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  topWash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  bottomWash: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  floatGlow: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(139,211,247,0.18)",
  },
  floatGlowA: {
    right: -70,
    top: 160,
    width: 190,
    height: 190,
  },
  floatGlowB: {
    left: -88,
    bottom: 120,
    width: 220,
    height: 220,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
});
