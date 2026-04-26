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
  tts: {
    provider: optionalEnv("TTS_PROVIDER", "browser"),
    sherpaOnnx: {
      acousticModel: optionalEnv("SHERPA_ONNX_TTS_ACOUSTIC_MODEL"),
      dataDir: optionalEnv("SHERPA_ONNX_TTS_DATA_DIR"),
      engine: optionalEnv("SHERPA_ONNX_TTS_ENGINE", "matcha"),
      lexicon: optionalEnv("SHERPA_ONNX_TTS_LEXICON"),
      modelDir: optionalEnv("SHERPA_ONNX_TTS_MODEL_DIR"),
      modelName: optionalEnv("SHERPA_ONNX_TTS_MODEL"),
      ruleFsts: optionalEnv("SHERPA_ONNX_TTS_RULE_FSTS"),
      silenceScale: optionalNumberEnv("SHERPA_ONNX_TTS_SILENCE_SCALE", 0.2),
      speed: optionalNumberEnv("SHERPA_ONNX_TTS_SPEED", 1),
      tokens: optionalEnv("SHERPA_ONNX_TTS_TOKENS"),
      vocoder: optionalEnv("SHERPA_ONNX_TTS_VOCODER"),
      voiceId: optionalNumberEnv("SHERPA_ONNX_TTS_VOICE_ID", 0),
      voices: optionalEnv("SHERPA_ONNX_TTS_VOICES"),
    },
  },
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
    tts: {
      provider: hubConfig.tts.provider,
      sherpaOnnx: {
        engine: hubConfig.tts.sherpaOnnx.engine,
        hasAcousticModel: Boolean(hubConfig.tts.sherpaOnnx.acousticModel),
        hasModelDir: Boolean(hubConfig.tts.sherpaOnnx.modelDir),
        hasModelName: Boolean(hubConfig.tts.sherpaOnnx.modelName),
        hasVocoder: Boolean(hubConfig.tts.sherpaOnnx.vocoder),
      },
    },
  };
}
