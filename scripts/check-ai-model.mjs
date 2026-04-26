const hubBaseUrl = process.env.EXPO_PUBLIC_HUB_URL || "http://127.0.0.1:8787";

async function requestJson(path, options = {}) {
  const response = await fetch(`${hubBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}: ${text}`);
  }

  return data;
}

function assertModelResult(name, data) {
  if (!data?.provider || data.provider === "hub-local-mock" || data.provider === "local-fallback") {
    throw new Error(`${name} did not use a configured model provider.`);
  }

  if (!data?.model) {
    throw new Error(`${name} did not report a model.`);
  }

  return {
    model: data.model,
    provider: data.provider,
  };
}

async function main() {
  const status = await requestJson("/v1/status");
  const providers = status?.status?.providers ?? [];

  if (!providers.length) {
    throw new Error("Hub has no configured model providers.");
  }

  if (!providers.some((provider) => provider.hasApiKey && provider.model)) {
    throw new Error("Hub providers are missing API key or model configuration.");
  }

  const chat = await requestJson("/v1/ai", {
    method: "POST",
    body: JSON.stringify({
      type: "chat",
      messages: [{ role: "user", content: "Reply with one short sentence." }],
    }),
  });

  const plan = await requestJson("/v1/ai", {
    method: "POST",
    body: JSON.stringify({
      type: "plan",
      prompt: "Make a short plan for today.",
    }),
  });

  const summary = await requestJson("/v1/pipeline/summarize", {
    method: "POST",
    body: JSON.stringify({
      kind: "text",
      title: "模型验收",
      content: "今天需要确认渊元的聊天、计划和记忆分析都已经接入大模型。",
    }),
  });

  const classification = await requestJson("/v1/pipeline/classify", {
    method: "POST",
    body: JSON.stringify({
      kind: "text",
      title: "模型验收",
      content: "今天需要确认渊元的聊天、计划和记忆分析都已经接入大模型。",
    }),
  });

  const analyze = await requestJson("/v1/pipeline/analyze", {
    method: "POST",
    body: JSON.stringify({
      kind: "text",
      title: "模型验收",
      content: "今天需要确认渊元的聊天、计划和记忆分析都已经接入大模型。",
    }),
  });

  const results = {
    chat: assertModelResult("chat", chat),
    plan: assertModelResult("plan", plan),
    summary: assertModelResult("pipeline summary", summary),
    classification: assertModelResult("pipeline classification", classification),
    analyze: assertModelResult("pipeline analyze", analyze),
  };

  console.log(JSON.stringify({ ok: true, hubBaseUrl, results }, null, 2));
}

main().catch((error) => {
  console.error(`[ai:check] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
