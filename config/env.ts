declare const process: {
  env: Record<string, string | undefined>;
};

const runtimeEnv = process.env;

function optionalEnv(key: string) {
  const value = runtimeEnv[key]?.trim();
  return value ? value : "";
}

function optionalNumberEnv(key: string, fallback: number) {
  const value = Number(runtimeEnv[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export const env = {
  supabaseUrl: optionalEnv("EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: optionalEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
  aiProxyUrl: optionalEnv("EXPO_PUBLIC_AI_PROXY_URL"),
  hubUrl: optionalEnv("EXPO_PUBLIC_HUB_URL"),
  aiProxyToken: optionalEnv("EXPO_PUBLIC_AI_PROXY_TOKEN"),
  aiProvider: optionalEnv("EXPO_PUBLIC_AI_PROVIDER") || "openai-compatible",
  aiModel: optionalEnv("EXPO_PUBLIC_AI_MODEL"),
  aiTimeoutMs: optionalNumberEnv("EXPO_PUBLIC_AI_TIMEOUT_MS", 30000),
  aiFallback1Url: optionalEnv("EXPO_PUBLIC_AI_FALLBACK_1_URL"),
  aiFallback1Token: optionalEnv("EXPO_PUBLIC_AI_FALLBACK_1_TOKEN"),
  aiFallback1Provider:
    optionalEnv("EXPO_PUBLIC_AI_FALLBACK_1_PROVIDER") || "deepseek-compatible",
  aiFallback1Model: optionalEnv("EXPO_PUBLIC_AI_FALLBACK_1_MODEL"),
  aiFallback2Url: optionalEnv("EXPO_PUBLIC_AI_FALLBACK_2_URL"),
  aiFallback2Token: optionalEnv("EXPO_PUBLIC_AI_FALLBACK_2_TOKEN"),
  aiFallback2Provider:
    optionalEnv("EXPO_PUBLIC_AI_FALLBACK_2_PROVIDER") || "openai-compatible",
  aiFallback2Model: optionalEnv("EXPO_PUBLIC_AI_FALLBACK_2_MODEL"),
};

export const aiEndpoints = [
  {
    name: "primary",
    url: env.aiProxyUrl,
    token: env.aiProxyToken,
    provider: env.aiProvider,
    model: env.aiModel,
  },
  {
    name: "fallback-1",
    url: env.aiFallback1Url,
    token: env.aiFallback1Token,
    provider: env.aiFallback1Provider,
    model: env.aiFallback1Model,
  },
  {
    name: "fallback-2",
    url: env.aiFallback2Url,
    token: env.aiFallback2Token,
    provider: env.aiFallback2Provider,
    model: env.aiFallback2Model,
  },
].filter((endpoint) => Boolean(endpoint.url));

export const hasSupabaseConfig = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const hasAiProxyConfig = aiEndpoints.length > 0;

export function getHubBaseUrl() {
  if (env.hubUrl) {
    return env.hubUrl.replace(/\/+$/, "");
  }

  if (!env.aiProxyUrl) {
    return "";
  }

  try {
    const url = new URL(env.aiProxyUrl);
    url.pathname = url.pathname.replace(/\/v1\/ai\/?$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
}
