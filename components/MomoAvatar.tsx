import { StyleSheet, View } from "react-native";

import { getEmojiPlaceholder } from "@/assets/visualAssets";
import { AppText } from "@/components/ui";
import { colors, radius, shadows } from "@/config/theme";

export type MomoAvatarSize = "xs" | "sm" | "md" | "lg";
export type MomoAvatarMood = "happy" | "wink" | "calm" | "headphones";

type MomoAvatarProps = {
  size?: MomoAvatarSize;
  mood?: MomoAvatarMood;
};

const sizes = {
  xs: 46,
  sm: 66,
  md: 96,
  lg: 150,
};

export function MomoAvatar({ size = "md", mood = "happy" }: MomoAvatarProps) {
  const bodySize = sizes[size];
  const eyeSize = bodySize * 0.09;

  return (
    <View style={[styles.stage, { width: bodySize * 1.28, height: bodySize * 1.1 }]}>
      {mood === "headphones" ? (
        <>
          <View style={[styles.headband, { width: bodySize * 0.9, height: bodySize * 0.72 }]} />
          <View style={[styles.earLeft, { width: bodySize * 0.18, height: bodySize * 0.34 }]} />
          <View style={[styles.earRight, { width: bodySize * 0.18, height: bodySize * 0.34 }]} />
        </>
      ) : null}

      <View style={[styles.shadow, { width: bodySize * 0.88 }]} />
      <View
        style={[
          styles.body,
          {
            width: bodySize,
            height: bodySize * 0.82,
            borderRadius: bodySize * 0.3,
          },
        ]}
      >
        <View style={[styles.star, { top: -bodySize * 0.18 }]}>
          <AppText style={{ fontSize: bodySize * 0.18 }}>
            {getEmojiPlaceholder("decor.star", "*")}
          </AppText>
        </View>
        <View style={[styles.eye, { width: eyeSize, height: eyeSize, left: bodySize * 0.28 }]} />
        {mood === "wink" ? (
          <View style={[styles.winkEye, { right: bodySize * 0.27 }]} />
        ) : (
          <View style={[styles.eye, { width: eyeSize, height: eyeSize, right: bodySize * 0.28 }]} />
        )}
        <View style={[styles.cheek, { left: bodySize * 0.16 }]} />
        <View style={[styles.cheek, { right: bodySize * 0.16 }]} />
        <View style={mood === "calm" ? styles.calmMouth : styles.mouth} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  body: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF9E8",
    ...shadows.card,
  },
  shadow: {
    position: "absolute",
    bottom: 0,
    height: 13,
    borderRadius: radius.full,
    backgroundColor: "rgba(112,88,152,0.12)",
  },
  star: {
    position: "absolute",
    alignSelf: "center",
  },
  eye: {
    position: "absolute",
    top: "42%",
    borderRadius: radius.full,
    backgroundColor: colors.text,
  },
  winkEye: {
    position: "absolute",
    top: "43%",
    width: 16,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.text,
    transform: [{ rotate: "-16deg" }],
  },
  cheek: {
    position: "absolute",
    top: "54%",
    width: 24,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: "#FFDAD0",
    opacity: 0.82,
  },
  mouth: {
    position: "absolute",
    top: "56%",
    width: 18,
    height: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#7D6262",
    borderRadius: radius.full,
  },
  calmMouth: {
    position: "absolute",
    top: "58%",
    width: 18,
    height: 2,
    borderRadius: radius.full,
    backgroundColor: "#7D6262",
  },
  headband: {
    position: "absolute",
    bottom: 20,
    borderTopWidth: 10,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderColor: colors.primary,
    borderBottomWidth: 0,
    borderRadius: 80,
    opacity: 0.7,
  },
  earLeft: {
    position: "absolute",
    left: 4,
    bottom: 34,
    borderRadius: 18,
    backgroundColor: colors.primary,
  },
  earRight: {
    position: "absolute",
    right: 4,
    bottom: 34,
    borderRadius: 18,
    backgroundColor: colors.primary,
  },
});
