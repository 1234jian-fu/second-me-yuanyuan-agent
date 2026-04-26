import { loadLocalEnv } from "./loadEnv.mjs";

loadLocalEnv();

function optionalEnv(key, fallback = "") {
  const value = process.env[key]?.trim();
  return value || fallback;
}

function optionalNumberEnv(key, fallback) {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function createProvider(prefix, fallbackProvider = "openai-compatible") {
  const baseUrl = optionalEnv(`${prefix}_BASE_URL`);
  const apiKey = optionalEnv(`${prefix}_API_KEY`);
  const provider = optionalEnv(`${prefix}_PROVIDER`, fallbackProvider);
  const model = optionalEnv(`${prefix}_MODEL`);

  if (!baseUrl || !apiKey) {
    return null;
  }

  return {
    name: prefix.toLowerCase(),
    provider,
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiKey,
    model,
  };
}

export const hubConfig = {
  host: optionalEnv("HUB_HOST", "0.0.0.0"),
  port: optionalNumberEnv("HUB_PORT", 8787),
  allowOrigin: optionalEnv("HUB_ALLOW_ORIGIN", "*"),
  apiToken: optionalEnv("HUB_API_TOKEN"),
  providers: [
    createProvider("AI_PRIMARY", "openai-compatible"),
    createProvider("AI_FALLBACK_1", "deepseek-compatible"),
    createProvider("AI_FALLBACK_2", "openai-compatible"),
  ].filter(Boolean),
};

export function getPublicHubStatus() {
  return {
    allowOrigin: hubConfig.allowOrigin,
    hasApiToken: Boolean(hubConfig.apiToken),
    host: hubConfig.host,
    port: hubConfig.port,
    providers: hubConfig.providers.map((provider) => ({
      baseUrl: provider.baseUrl,
      hasApiKey: Boolean(provider.apiKey),
      model: provider.model || null,
      name: provider.name,
      provider: provider.provider,
    })),
  };
}
