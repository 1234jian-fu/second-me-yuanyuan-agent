import type { VisualAssetId } from "@/assets/visualAssets";

export type AssetSlot = {
  id: VisualAssetId;
  slotPath: string;
  sourceSheetPosition: string;
};

export const assetSlots: AssetSlot[] = [
  { id: "feature.textRecord", slotPath: "assets/icons/feature-text-record.png", sourceSheetPosition: "row 1, col 1 checklist with pencil" },
  { id: "feature.voiceRecord", slotPath: "assets/icons/feature-voice-record.png", sourceSheetPosition: "row 1, col 2 purple microphone" },
  { id: "momo.hero.default", slotPath: "assets/mascot/momo-hero-default.png", sourceSheetPosition: "row 1, col 3 white Momo wink" },
  { id: "feature.aiChat", slotPath: "assets/icons/feature-ai-chat.png", sourceSheetPosition: "row 1, col 4 robot chat head" },
  { id: "brief.todayMood", slotPath: "assets/icons/brief-today-mood.png", sourceSheetPosition: "row 2, col 1 yellow calm face" },
  { id: "brief.recordCount", slotPath: "assets/icons/brief-record-count.png", sourceSheetPosition: "row 2, col 2 purple document" },
  { id: "brief.planCount", slotPath: "assets/icons/brief-plan-count.png", sourceSheetPosition: "row 2, col 3 green check card" },
  { id: "feature.todayPlan", slotPath: "assets/icons/feature-today-plan.png", sourceSheetPosition: "row 2, col 4 star plan card" },
  { id: "profile.crown", slotPath: "assets/icons/profile-crown.png", sourceSheetPosition: "row 3, col 4 crown" },
  { id: "decor.star", slotPath: "assets/icons/decor-star.png", sourceSheetPosition: "row 4, col 1 purple star" },
  { id: "decor.sparkle", slotPath: "assets/icons/decor-sparkle.png", sourceSheetPosition: "row 4, col 1 small sparkle next to purple star" },
  { id: "mood.terrible", slotPath: "assets/icons/mood-terrible.png", sourceSheetPosition: "row 6, col 1 red angry face" },
  { id: "mood.tired", slotPath: "assets/icons/mood-tired.png", sourceSheetPosition: "row 6, col 2 yellow tired face" },
  { id: "mood.okay", slotPath: "assets/icons/mood-okay.png", sourceSheetPosition: "row 2, col 1 yellow calm face" },
  { id: "mood.happy", slotPath: "assets/icons/mood-happy.png", sourceSheetPosition: "row 6, col 3 green happy face" },
  { id: "mood.excited", slotPath: "assets/icons/mood-excited.png", sourceSheetPosition: "row 6, col 4 purple excited face" },
];
