import { Asset } from "expo-asset";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { createElement } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { dynamicAssets } from "@/assets/dynamicAssets";
import { colors, radius } from "@/config/theme";

type DynamicHeroVideoProps = {
  aspectRatio?: number;
  overlay?: boolean;
  rounded?: boolean;
  fit?: "cover" | "contain";
};

export function DynamicHeroVideo({
  aspectRatio = 5 / 4,
  overlay = true,
  rounded = true,
  fit = "cover",
}: DynamicHeroVideoProps) {
  const webVideoUri =
    Platform.OS === "web"
      ? Asset.fromModule(dynamicAssets.yuanyuanHeroVideo).uri
      : undefined;

  return (
    <View style={[styles.container, rounded && styles.rounded, { aspectRatio }]}>
      {Platform.OS === "web" && webVideoUri
        ? createElement("video", {
            autoPlay: true,
            controls: false,
            defaultMuted: true,
            loop: true,
            muted: true,
            playsInline: true,
            preload: "auto",
            src: webVideoUri,
            style: {
              backgroundColor: colors.surfaceBlue,
              height: "100%",
              inset: 0,
              objectFit: fit,
              pointerEvents: "none",
              position: "absolute",
              width: "100%",
            },
            onCanPlay: (event: { currentTarget?: HTMLVideoElement }) => {
              void event.currentTarget?.play?.().catch(() => undefined);
            },
          })
        : (
          <Video
            isLooping
            isMuted
            progressUpdateIntervalMillis={1000}
            resizeMode={fit === "contain" ? ResizeMode.CONTAIN : ResizeMode.COVER}
            shouldPlay
            source={dynamicAssets.yuanyuanHeroVideo}
            style={StyleSheet.absoluteFill}
            useNativeControls={false}
            volume={0}
          />
        )}
      {overlay ? (
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.08)",
            "rgba(255,255,255,0.48)",
            "rgba(255,255,255,0.88)",
          ]}
          locations={[0, 0.34, 0.72, 1]}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
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
});
