import { Image, StyleSheet, View } from "react-native";

import { getVisualAsset, type VisualAssetId } from "@/assets/visualAssets";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { MomoAvatar, type MomoAvatarSize } from "@/components/MomoAvatar";
import { AppText } from "@/components/ui";
import { colors, radius } from "@/config/theme";

type VisualAssetProps = {
  assetId: VisualAssetId;
  size?: number;
  momoSize?: MomoAvatarSize;
  color?: string;
};

export function VisualAsset({ assetId, size = 40, momoSize = "md", color }: VisualAssetProps) {
  const asset = getVisualAsset(assetId);

  if (asset.image?.source) {
    return (
      <Image
        accessibilityLabel={asset.image.alt}
        resizeMode="contain"
        source={asset.image.source}
        style={{ width: size, height: size }}
      />
    );
  }

  if (asset.kind === "momo") {
    return <MomoAvatar size={momoSize} mood={asset.mood} />;
  }

  if (asset.kind === "material") {
    return (
      <View
        style={[
          styles.iconFrame,
          {
            width: size,
            height: size,
            backgroundColor: asset.backgroundColor ?? "transparent",
          },
        ]}
      >
        <MaterialSymbol
          name={asset.icon}
          size={Math.max(18, size * 0.54)}
          color={color ?? asset.color ?? colors.primary}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.iconFrame,
        {
          width: size,
          height: size,
          backgroundColor: asset.backgroundColor ?? "transparent",
        },
      ]}
    >
      <AppText style={{ fontSize: size * 0.58 }}>{asset.emoji}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  iconFrame: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
  },
});
