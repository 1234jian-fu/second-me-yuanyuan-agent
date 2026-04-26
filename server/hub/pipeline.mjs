import { hubConfig } from "./config.mjs";
import { callProvider } from "./providers.mjs";

function compactText(value, fallback) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}

function parseJsonObject(value) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function normalizeCategories(value, fallbackInput) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 8);
  }

  if (typeof value === "string") {
    return value
      .split(/[,，、\n]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  return createCategories(fallbackInput);
}

function createCategories(input) {
  const content = `${input.title ?? ""} ${input.content ?? ""}`.toLowerCase();
  const categories = new Set([input.kind === "audio" ? "voice" : "text"]);

  if (/plan|todo|goal|目标|计划/.test(content)) {
    categories.add("plan");
  }

  if (/mood|feel|情绪|开心|难过|焦虑/.test(content)) {
    categories.add("mood");
  }

  if (/work|项目|会议|任务/.test(content)) {
    categories.add("work");
  }

  categories.add("capture");
  return [...categories];
}

export function createMockPipelineAnalysis(input) {
  const seed = compactText(input.content, input.title || input.storagePath || "new capture");
  const transcript =
    input.kind === "audio"
      ? `Mock transcript for ${seed}`
      : compactText(input.content, "");

  return {
    transcript: transcript || null,
    summary: `Mock summary: ${seed}`.slice(0, 200),
    categories: createCategories(input),
    provider: "hub-local-mock",
    model: null,
  };
}

export function createMockTranscription(input) {
  return {
    transcript: input.kind === "audio" ? `Mock transcript for ${input.storagePath ?? "audio capture"}` : null,
    provider: "hub-local-mock",
    model: null,
  };
}

export function createMockSummary(input) {
  const seed = compactText(input.content, input.transcript || input.title || "new capture");
  return {
    summary: `Mock summary: ${seed}`.slice(0, 200),
    provider: "hub-local-mock",
    model: null,
  };
}

export function createMockClassification(input) {
  return {
    categories: createCategories(input),
    provider: "hub-local-mock",
    model: null,
  };
}

async function callConfiguredModel(input, instruction) {
  if (hubConfig.providers.length === 0) {
    return null;
  }

  const failures = [];
  const content = [
    input.title ? `Title: ${input.title}` : "",
    input.kind ? `Kind: ${input.kind}` : "",
    input.storagePath ? `Storage path: ${input.storagePath}` : "",
    input.transcript ? `Transcript: ${input.transcript}` : "",
    input.content ? `Content: ${input.content}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  for (const provider of hubConfig.providers) {
    try {
      const result = await callProvider(provider, {
        type: "chat",
        system:
          "You are the analysis engine for Yuan Yuan, a personal digital twin app. Return only valid compact JSON. Do not include markdown.",
        messages: [
          {
            role: "user",
            content: `${instruction}\n\nInput:\n${content || "No text content was provided."}`,
          },
        ],
      });
      return result;
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(`All configured pipeline model providers failed. ${failures.join(" | ")}`);
}

async function summarizeWithModel(input) {
  const result = await callConfiguredModel(
    input,
    'Summarize the input in Chinese for a memory library. Return JSON like {"summary":"..."}',
  );

  if (!result) {
    return createMockSummary(input);
  }

  const parsed = parseJsonObject(result.data.reply);
  return {
    summary: compactText(parsed?.summary, result.data.reply).slice(0, 500),
    provider: result.provider,
    model: result.model,
  };
}

async function classifyWithModel(input) {
  const result = await callConfiguredModel(
    input,
    'Classify the input into 3 to 6 short tags. Prefer Chinese tags. Return JSON like {"categories":["情绪","工作"]}',
  );

  if (!result) {
    return createMockClassification(input);
  }

  const parsed = parseJsonObject(result.data.reply);
  return {
    categories: normalizeCategories(parsed?.categories, input),
    provider: result.provider,
    model: result.model,
  };
}

async function analyzeWithModel(input) {
  const result = await callConfiguredModel(
    input,
    'Analyze the input for a memory pipeline. Return JSON like {"transcript":null,"summary":"...","categories":["..."]}. If the input is already text, transcript can equal the text or null. If it is audio without transcript text, say that transcription is pending in summary.',
  );

  if (!result) {
    return createMockPipelineAnalysis(input);
  }

  const parsed = parseJsonObject(result.data.reply);
  const fallbackSummary = compactText(result.data.reply, input.content || input.title || "已完成分析");

  return {
    transcript:
      typeof parsed?.transcript === "string" && parsed.transcript.trim()
        ? parsed.transcript.trim()
        : input.kind === "text"
          ? compactText(input.content, "")
          : null,
    summary: compactText(parsed?.summary, fallbackSummary).slice(0, 500),
    categories: normalizeCategories(parsed?.categories, input),
    provider: result.provider,
    model: result.model,
  };
}

export async function handlePipelineAnalyze(input) {
  return analyzeWithModel(input);
}

export async function handlePipelineTranscribe(input) {
  return createMockTranscription(input);
}

export async function handlePipelineSummarize(input) {
  return summarizeWithModel(input);
}

export async function handlePipelineClassify(input) {
  return classifyWithModel(input);
}
