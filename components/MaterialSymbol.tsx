import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import type { StyleProp, TextStyle } from "react-native";

import { colors } from "@/config/theme";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export type MaterialSymbolName =
  | "home"
  | "textRecord"
  | "voiceRecord"
  | "chat"
  | "plan"
  | "profile"
  | "save"
  | "back"
  | "more"
  | "cloud"
  | "analytics"
  | "review"
  | "choice"
  | "idea"
  | "memory"
  | "privacy"
  | "settings"
  | "mic"
  | "send"
  | "mood"
  | "tag"
  | "calendar"
  | "task"
  | "check"
  | "emptyCheck"
  | "ai"
  | "leaf"
  | "play"
  | "list"
  | "selfCare"
  | "water"
  | "summary"
  | "thumbUp"
  | "thumbDown"
  | "bookmark"
  | "keyboard"
  | "spa"
  | "homeMax"
  | "addCircle"
  | "bubble"
  | "planMotion"
  | "calendarMonth"
  | "article"
  | "chevronRight"
  | "bell"
  | "search"
  | "close"
  | "clock"
  | "copy"
  | "edit"
  | "heart"
  | "chart"
  | "photo"
  | "lock"
  | "download"
  | "help"
  | "info"
  | "crown"
  | "book"
  | "exercise"
  | "checkboxEmpty"
  | "upload"
  | "arrowUp"
  | "pause";

const symbolMap: Record<MaterialSymbolName, MaterialIconName> = {
  home: "home",
  textRecord: "edit-note",
  voiceRecord: "mic",
  chat: "chat-bubble-outline",
  plan: "event-note",
  profile: "person",
  save: "save",
  back: "arrow-back",
  more: "more-vert",
  cloud: "cloud-upload",
  analytics: "analytics",
  review: "history",
  choice: "psychology",
  idea: "lightbulb-outline",
  memory: "memory",
  privacy: "shield",
  settings: "settings",
  mic: "mic",
  send: "send",
  mood: "mood",
  tag: "local-offer",
  calendar: "calendar-today",
  task: "task-alt",
  check: "check-circle-outline",
  emptyCheck: "radio-button-unchecked",
  ai: "auto-awesome",
  leaf: "local-florist",
  play: "play-arrow",
  list: "format-list-bulleted",
  selfCare: "self-improvement",
  water: "water-drop",
  summary: "summarize",
  thumbUp: "thumb-up",
  thumbDown: "thumb-down",
  bookmark: "bookmark",
  keyboard: "keyboard",
  spa: "spa",
  homeMax: "home-max",
  addCircle: "add-circle",
  bubble: "bubble-chart",
  planMotion: "auto-awesome-motion",
  calendarMonth: "calendar-month",
  article: "article",
  chevronRight: "chevron-right",
  bell: "notifications-none",
  search: "search",
  close: "close",
  clock: "schedule",
  copy: "content-copy",
  edit: "edit",
  heart: "favorite",
  chart: "bar-chart",
  photo: "photo-library",
  lock: "lock",
  download: "download",
  help: "help-outline",
  info: "info-outline",
  crown: "workspace-premium",
  book: "menu-book",
  exercise: "sports-gymnastics",
  checkboxEmpty: "check-box-outline-blank",
  upload: "upload",
  arrowUp: "arrow-upward",
  pause: "pause",
};

type MaterialSymbolProps = {
  name: MaterialSymbolName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function MaterialSymbol({
  name,
  size = 22,
  color = colors.primaryPressed,
  style,
}: MaterialSymbolProps) {
  return <MaterialIcons name={symbolMap[name]} size={size} color={color} style={style} />;
}
