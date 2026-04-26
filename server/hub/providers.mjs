function parseReply(data) {
  return (
    data.reply ??
    data.content ??
    data.choices?.[0]?.message?.content ??
    ""
  );
}

function parsePlansFromReply(reply) {
  return reply
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•\d.、\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((title) => ({ title }));
}

async function callOpenAiCompatible(provider, payload) {
  const model = payload.model || provider.model;

  if (!model) {
    throw new Error(`Provider ${provider.name} is missing a model.`);
  }

  const messages =
    payload.type === "plan"
      ? [
          ...(payload.system ? [{ role: "system", content: payload.system }] : []),
          { role: "user", content: payload.prompt ?? "" },
        ]
      : [
          ...(payload.system ? [{ role: "system", content: payload.system }] : []),
          ...(payload.messages ?? []),
        ];

  const response = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: payload.type === "plan" ? 0.7 : 0.8,
      stream: false,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${provider.name} failed: ${response.status} ${message}`);
  }

  const data = await response.json();
  const reply = parseReply(data);

  if (!reply) {
    throw new Error(`${provider.name} returned an empty response.`);
  }

  if (payload.type === "plan") {
    return {
      data: {
        plans: parsePlansFromReply(reply),
      },
      model,
      provider: provider.provider,
    };
  }

  return {
    data: {
      reply,
    },
    model,
    provider: provider.provider,
  };
}

export async function callProvider(provider, payload) {
  switch (provider.provider) {
    case "openai-compatible":
    case "deepseek-compatible":
      return callOpenAiCompatible(provider, payload);
    default:
      throw new Error(`Unsupported provider: ${provider.provider}`);
  }
}
