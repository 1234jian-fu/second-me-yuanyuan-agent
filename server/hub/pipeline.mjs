function compactText(value, fallback) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
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

export async function handlePipelineAnalyze(input) {
  return createMockPipelineAnalysis(input);
}

export async function handlePipelineTranscribe(input) {
  return createMockTranscription(input);
}

export async function handlePipelineSummarize(input) {
  return createMockSummary(input);
}

export async function handlePipelineClassify(input) {
  return createMockClassification(input);
}
