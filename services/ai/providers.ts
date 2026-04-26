export type AiProvider =
  | "openai-compatible"
  | "deepseek-compatible"
  | "custom-proxy";

export const supportedAiProviders: AiProvider[] = [
  "openai-compatible",
  "deepseek-compatible",
  "custom-proxy",
];
