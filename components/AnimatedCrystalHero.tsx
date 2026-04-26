import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { colors, radius } from "@/config/theme";

type AnimatedCrystalHeroProps = {
  aspectRatio?: number;
  rounded?: boolean;
};

const crystalPieces = [
  { left: "43%", top: "10%", width: 46, height: 58, rotate: "-6deg", opacity: 0.72, depth: 1 },
  { left: "25%", top: "23%", width: 42, height: 55, rotate: "20deg", opacity: 0.58, depth: 0.7 },
  { left: "63%", top: "22%", width: 40, height: 56, rotate: "-18deg", opacity: 0.62, depth: 0.9 },
  { left: "36%", top: "40%", width: 54, height: 68, rotate: "4deg", opacity: 0.76, depth: 1.15 },
  { left: "55%", top: "43%", width: 50, height: 64, rotate: "-4deg", opacity: 0.7, depth: 1.05 },
  { left: "30%", top: "56%", width: 38, height: 50, rotate: "-24deg", opacity: 0.46, depth: 0.6 },
  { left: "66%", top: "55%", width: 34, height: 48, rotate: "21deg", opacity: 0.42, depth: 0.55 },
] as const;

const tinyPieces = [
  { left: "22%", top: "40%", size: 9 },
  { left: "73%", top: "33%", size: 7 },
  { left: "58%", top: "15%", size: 6 },
  { left: "35%", top: "69%", size: 5 },
] as const;

export function AnimatedCrystalHero({ aspectRatio = 5 / 4, rounded = false }: AnimatedCrystalHeroProps) {
  const [motion] = useState(() => new Animated.Value(0));
  const [drift] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.loop(
        Animated.timing(motion, {
          toValue: 1,
          duration: 9200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.timing(drift, {
          toValue: 1,
          duration: 13600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ),
    ]);

    animation.start();
    return () => animation.stop();
  }, [drift, motion]);

  const reverse = useMemo(() => Animated.subtract(1, motion), [motion]);
  const breathe = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.985, 1.035, 0.985],
  });
  const coreLift = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0],
  });
  const parallaxLeft = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-5, 7, -5],
  });
  const parallaxRight = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [6, -6, 6],
  });
  const slowTilt = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["-3deg", "4deg", "-3deg"],
  });
  const counterTilt = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["3deg", "-4deg", "3deg"],
  });
  const shimmerX = motion.interpolate({
    inputRange: [0, 1],
    outputRange: [-160, 260],
  });
  const shimmerOpacity = motion.interpolate({
    inputRange: [0, 0.18, 0.62, 1],
    outputRange: [0, 0.24, 0.1, 0],
  });
  const pulseOpacity = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.34, 0.56, 0.34],
  });
  const echoOpacity = reverse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.18, 0.42, 0.18],
  });

  return (
    <View style={[styles.container, rounded && styles.rounded, { aspectRatio }]}>
      <LinearGradient
        colors={["#FFFFFF", "#F7FCFF", "#E6F5FD", "#DDF0FA"]}
        locations={[0, 0.42, 0.78, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.halo, styles.haloBack, { opacity: echoOpacity, transform: [{ scale: breathe }] }]} />
      <Animated.View style={[styles.halo, styles.haloFront, { opacity: pulseOpacity, transform: [{ translateY: coreLift }, { scale: breathe }] }]} />
      <Animated.View style={[styles.orbit, styles.orbitOuter, { transform: [{ translateX: parallaxLeft }, { rotate: slowTilt }] }]} />
      <Animated.View style={[styles.orbit, styles.orbitInner, { transform: [{ translateX: parallaxRight }, { rotate: counterTilt }] }]} />

      {crystalPieces.map((item, index) => {
        const translateY = (index + 1) % 2 === 0 ? coreLift : reverse.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 8 * item.depth, 0],
        });
        const translateX = index % 2 === 0 ? parallaxLeft : parallaxRight;
        const tilt = index % 2 === 0 ? slowTilt : counterTilt;

        return (
          <Animated.View
            key={`${item.left}-${item.top}`}
            style={[
              styles.piece,
              {
                height: item.height,
                left: item.left,
                opacity: item.opacity,
                top: item.top,
                width: item.width,
                transform: [{ translateX }, { translateY }, { rotate: item.rotate }, { rotate: tilt }, { scale: item.depth }],
              },
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.98)",
                "rgba(220,238,250,0.72)",
                "rgba(255,255,255,0.64)",
              ]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.pieceHighlight} />
          </Animated.View>
        );
      })}

      {tinyPieces.map((item, index) => {
        const translateY = index % 2 === 0 ? coreLift : reverse.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 10, 0],
        });
        return (
          <Animated.View
            key={`${item.left}-${item.top}`}
            style={[
              styles.tiny,
              {
                height: item.size,
                left: item.left,
                top: item.top,
                width: item.size,
                transform: [{ translateY }, { rotate: "45deg" }],
              },
            ]}
          />
        );
      })}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmer,
          {
            opacity: shimmerOpacity,
            transform: [{ translateX: shimmerX }, { rotate: "18deg" }],
          },
        ]}
      />

      <Animated.View style={[styles.lightDot, styles.lightDotA, { transform: [{ translateY: coreLift }] }]} />
      <Animated.View style={[styles.lightDot, styles.lightDotB, { opacity: pulseOpacity, transform: [{ translateX: parallaxRight }] }]} />

      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0.94)"]}
        locations={[0, 0.62, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: colors.surfaceBlue,
  },
  rounded: {
    borderRadius: radius.xxl,
  },
  halo: {
    position: "absolute",
    borderRadius: radius.full,
  },
  haloBack: {
    left: "16%",
    top: "8%",
    width: "70%",
    height: "70%",
    backgroundColor: "rgba(164,218,247,0.34)",
  },
  haloFront: {
    left: "28%",
    top: "24%",
    width: "44%",
    height: "44%",
    backgroundColor: "rgba(255,255,255,0.82)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.72,
    shadowRadius: 28,
  },
  orbit: {
    position: "absolute",
    borderRadius: radius.full,
    borderWidth: 1,
  },
  orbitOuter: {
    left: "20%",
    top: "14%",
    width: "62%",
    height: "62%",
    borderColor: "rgba(78,138,184,0.16)",
  },
  orbitInner: {
    left: "30%",
    top: "26%",
    width: "42%",
    height: "42%",
    borderColor: "rgba(255,255,255,0.76)",
  },
  piece: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    shadowColor: colors.shadowStrong,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 26,
  },
  pieceHighlight: {
    position: "absolute",
    left: 6,
    right: 10,
    top: 6,
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  tiny: {
    position: "absolute",
    borderRadius: 2,
    backgroundColor: "rgba(74,147,207,0.38)",
  },
  shimmer: {
    position: "absolute",
    top: -80,
    bottom: -80,
    width: 58,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  lightDot: {
    position: "absolute",
    borderRadius: radius.full,
    backgroundColor: "rgba(74,147,207,0.44)",
  },
  lightDotA: {
    left: "23%",
    top: "33%",
    width: 8,
    height: 8,
  },
  lightDotB: {
    right: "22%",
    top: "30%",
    width: 12,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.86)",
  },
});
