import type { ImageSourcePropType } from "react-native";

import type { MaterialSymbolName } from "@/components/MaterialSymbol";
import type { MomoAvatarMood } from "@/components/MomoAvatar";

export type MoodValue = "很糟糕" | "有点累" | "还可以" | "开心" | "超开心";

export type VisualAssetId =
  | "momo.avatar.default"
  | "momo.avatar.calm"
  | "momo.avatar.wink"
  | "momo.avatar.headphones"
  | "momo.hero.default"
  | "momo.hero.calm"
  | "momo.hero.wink"
  | "momo.hero.headphones"
  | "feature.textRecord"
  | "feature.voiceRecord"
  | "feature.aiChat"
  | "feature.todayPlan"
  | "mood.terrible"
  | "mood.tired"
  | "mood.okay"
  | "mood.happy"
  | "mood.excited"
  | "profile.crown"
  | "profile.userAvatar"
  | "brief.todayMood"
  | "brief.recordCount"
  | "brief.planCount"
  | "goal.star"
  | "decor.star"
  | "decor.sparkle"
  | "chat.userAvatar";

type ImageReplacement = {
  source?: ImageSourcePropType;
  slotPath: string;
  alt: string;
};

export type VisualAsset =
  | {
      id: VisualAssetId;
      kind: "momo";
      mood: MomoAvatarMood;
      image?: ImageReplacement;
    }
  | {
      id: VisualAssetId;
      kind: "emoji";
      emoji: string;
      backgroundColor?: string;
      image?: ImageReplacement;
    }
  | {
      id: VisualAssetId;
      kind: "material";
      icon: MaterialSymbolName;
      color?: string;
      backgroundColor?: string;
      image?: ImageReplacement;
    };

export const visualAssets: Record<VisualAssetId, VisualAsset> = {
  "momo.avatar.default": {
    id: "momo.avatar.default",
    kind: "momo",
    mood: "happy",
    image: { slotPath: "assets/mascot/momo-default.png", alt: "Momo 默认头像" },
  },
  "momo.avatar.calm": {
    id: "momo.avatar.calm",
    kind: "momo",
    mood: "calm",
    image: { slotPath: "assets/mascot/momo-calm.png", alt: "Momo 平静头像" },
  },
  "momo.avatar.wink": {
    id: "momo.avatar.wink",
    kind: "momo",
    mood: "wink",
    image: { slotPath: "assets/mascot/momo-wink.png", alt: "Momo 眨眼头像" },
  },
  "momo.avatar.headphones": {
    id: "momo.avatar.headphones",
    kind: "momo",
    mood: "headphones",
    image: { slotPath: "assets/mascot/momo-headphones.png", alt: "Momo 录音头像" },
  },
  "momo.hero.default": {
    id: "momo.hero.default",
    kind: "momo",
    mood: "happy",
    image: { slotPath: "assets/mascot/momo-hero-default.png", alt: "首页 Momo 主视觉" },
  },
  "momo.hero.calm": {
    id: "momo.hero.calm",
    kind: "momo",
    mood: "calm",
    image: { slotPath: "assets/mascot/momo-hero-calm.png", alt: "平静 Momo 主视觉" },
  },
  "momo.hero.wink": {
    id: "momo.hero.wink",
    kind: "momo",
    mood: "wink",
    image: { slotPath: "assets/mascot/momo-hero-wink.png", alt: "计划页 Momo 主视觉" },
  },
  "momo.hero.headphones": {
    id: "momo.hero.headphones",
    kind: "momo",
    mood: "headphones",
    image: { slotPath: "assets/mascot/momo-hero-headphones.png", alt: "录音页 Momo 主视觉" },
  },
  "feature.textRecord": {
    id: "feature.textRecord",
    kind: "emoji",
    emoji: "📝",
    backgroundColor: "#FFF6DF",
    image: { slotPath: "assets/icons/feature-text-record.png", alt: "文字记录拟物图标" },
  },
  "feature.voiceRecord": {
    id: "feature.voiceRecord",
    kind: "emoji",
    emoji: "🎙️",
    backgroundColor: "#D5E1E8",
    image: { slotPath: "assets/icons/feature-voice-record.png", alt: "录音记录拟物图标" },
  },
  "feature.aiChat": {
    id: "feature.aiChat",
    kind: "emoji",
    emoji: "🤖",
    backgroundColor: "#EAF5F2",
    image: { slotPath: "assets/icons/feature-ai-chat.png", alt: "AI 对话拟物图标" },
  },
  "feature.todayPlan": {
    id: "feature.todayPlan",
    kind: "emoji",
    emoji: "📋",
    backgroundColor: "#FFF0EE",
    image: { slotPath: "assets/icons/feature-today-plan.png", alt: "今日计划拟物图标" },
  },
  "mood.terrible": {
    id: "mood.terrible",
    kind: "emoji",
    emoji: "😫",
    backgroundColor: "#FFE2E2",
    image: { slotPath: "assets/icons/mood-terrible.png", alt: "很糟糕心情图标" },
  },
  "mood.tired": {
    id: "mood.tired",
    kind: "emoji",
    emoji: "😥",
    backgroundColor: "#FFE6C9",
    image: { slotPath: "assets/icons/mood-tired.png", alt: "有点累心情图标" },
  },
  "mood.okay": {
    id: "mood.okay",
    kind: "emoji",
    emoji: "😐",
    backgroundColor: "#FFF0B8",
    image: { slotPath: "assets/icons/mood-okay.png", alt: "还可以心情图标" },
  },
  "mood.happy": {
    id: "mood.happy",
    kind: "emoji",
    emoji: "🙂",
    backgroundColor: "#DFF4C8",
    image: { slotPath: "assets/icons/mood-happy.png", alt: "开心心情图标" },
  },
  "mood.excited": {
    id: "mood.excited",
    kind: "emoji",
    emoji: "🤩",
    backgroundColor: "#EBE1D6",
    image: { slotPath: "assets/icons/mood-excited.png", alt: "超开心心情图标" },
  },
  "profile.crown": {
    id: "profile.crown",
    kind: "emoji",
    emoji: "👑",
    backgroundColor: "#FFF6DF",
    image: { slotPath: "assets/icons/profile-crown.png", alt: "会员皇冠拟物图标" },
  },
  "profile.userAvatar": {
    id: "profile.userAvatar",
    kind: "momo",
    mood: "happy",
    image: { slotPath: "assets/mascot/profile-momo-avatar.png", alt: "用户资料页 Momo 头像" },
  },
  "brief.todayMood": {
    id: "brief.todayMood",
    kind: "emoji",
    emoji: "😐",
    backgroundColor: "#FFF0B8",
    image: { slotPath: "assets/icons/brief-today-mood.png", alt: "今日心情简报图标" },
  },
  "brief.recordCount": {
    id: "brief.recordCount",
    kind: "material",
    icon: "article",
    backgroundColor: "#EFEEEA",
    image: { slotPath: "assets/icons/brief-record-count.png", alt: "记录条数简报图标" },
  },
  "brief.planCount": {
    id: "brief.planCount",
    kind: "material",
    icon: "check",
    backgroundColor: "#E7F7DF",
    image: { slotPath: "assets/icons/brief-plan-count.png", alt: "计划事项简报图标" },
  },
  "goal.star": {
    id: "goal.star",
    kind: "emoji",
    emoji: "⭐",
    backgroundColor: "#FFF6DF",
    image: { slotPath: "assets/icons/goal-star.png", alt: "小目标星星图标" },
  },
  "decor.star": {
    id: "decor.star",
    kind: "emoji",
    emoji: "⭐",
    image: { slotPath: "assets/icons/decor-star.png", alt: "Momo 头顶星星装饰" },
  },
  "decor.sparkle": {
    id: "decor.sparkle",
    kind: "emoji",
    emoji: "✨",
    image: { slotPath: "assets/icons/decor-sparkle.png", alt: "闪光装饰" },
  },
  "chat.userAvatar": {
    id: "chat.userAvatar",
    kind: "emoji",
    emoji: "👩🏻",
    backgroundColor: "#F8EFEA",
    image: { slotPath: "assets/icons/chat-user-avatar.png", alt: "用户聊天头像" },
  },
};

export const moodVisualOptions: Array<{
  value: MoodValue;
  assetId: VisualAssetId;
}> = [
  { value: "很糟糕", assetId: "mood.terrible" },
  { value: "有点累", assetId: "mood.tired" },
  { value: "还可以", assetId: "mood.okay" },
  { value: "开心", assetId: "mood.happy" },
  { value: "超开心", assetId: "mood.excited" },
];

export const moodAssetByValue = moodVisualOptions.reduce(
  (acc, option) => {
    acc[option.value] = option.assetId;
    return acc;
  },
  {} as Record<MoodValue, VisualAssetId>,
);

export function getVisualAsset(id: VisualAssetId) {
  return visualAssets[id];
}

export function getEmojiPlaceholder(id: VisualAssetId, fallback = "") {
  const asset = visualAssets[id];

  return asset.kind === "emoji" ? asset.emoji : fallback;
}
