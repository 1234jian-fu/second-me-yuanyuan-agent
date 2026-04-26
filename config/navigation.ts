import type { Href } from "expo-router";

import type { MaterialSymbolName } from "@/components/MaterialSymbol";

export type PrimaryTabKey = "home" | "records" | "chat" | "profile";

export type PrimaryTabConfig = {
  key: PrimaryTabKey;
  label: string;
  icon: MaterialSymbolName;
  route: Href;
};

export const primaryTabs: PrimaryTabConfig[] = [
  { key: "home", label: "记录", icon: "home", route: "/home" },
  { key: "records", label: "记忆库", icon: "memory", route: "/records" },
  { key: "chat", label: "对话", icon: "chat", route: "/chat" },
  { key: "profile", label: "我的", icon: "profile", route: "/profile" },
];
