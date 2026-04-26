import { aiEndpoints, env, hasAiProxyConfig } from "@/config/env";
import type { ChatMessageDraft } from "@/types/chat";
import type { PlanDraft } from "@/types/plans";
import { systemPrompts } from "./prompts";
import type { AiEndpoint } from "./types";

export type GenerateChatReplyInput = {
  messages: ChatMessageDraft[];
};

export type GeneratePlanInput = {
  prompt: string;
};

type AiProxyResponse = {
  reply?: string;
  content?: string;
  plan?: PlanDraft[];
  plans?: PlanDraft[];
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

async function callAiEndpoint<T>(endpoint: AiEndpoint, payload: Record<string, unknown>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.aiTimeoutMs);

  try {
    const response = await fetch(endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(endpoint.token ? { Authorization: `Bearer ${endpoint.token}` } : {}),
      },
      signal: controller.signal,
      body: JSON.stringify({
        provider: endpoint.provider,
        model: endpoint.model || undefined,
        ...payload,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`${endpoint.name} AI endpoint failed: ${response.status} ${body}`);
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}

async function callAiGateway<T>(payload: Record<string, unknown>): Promise<T> {
  if (!hasAiProxyConfig) {
    throw new Error("No AI proxy endpoints configured.");
  }

  const failures: string[] = [];

  for (const endpoint of aiEndpoints) {
    try {
      return await callAiEndpoint<T>(endpoint, payload);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : `${endpoint.name} failed`);
    }
  }

  throw new Error(`All AI endpoints failed. ${failures.join(" | ")}`);
}

function parseReply(response: AiProxyResponse) {
  return (
    response.reply ??
    response.content ??
    response.choices?.[0]?.message?.content ??
    "我收到了你的消息，但模型接口返回了空内容。"
  );
}

function parsePlans(response: AiProxyResponse) {
  const plans = response.plans ?? response.plan;
  if (Array.isArray(plans) && plans.length > 0) {
    return plans;
  }

  const content = parseReply(response);
  return content
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•\d.、\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((title) => ({ title }));
}

function createLocalPlan(prompt: string): PlanDraft[] {
  const goal = prompt.trim() || "今天的主要目标";

  return [
    { title: `先定义「${goal}」的完成标准` },
    { title: "挑一个最容易开始的第一步" },
    { title: "留出一段专注执行时间" },
    { title: "今天结束前复盘并调整" },
  ];
}

function createFallbackReply(input: GenerateChatReplyInput, reason?: string) {
  const lastUserMessage = [...input.messages].reverse().find((message) => message.role === "user");
  const prefix = lastUserMessage?.content ? `我收到了：「${lastUserMessage.content}」。` : "我收到了。";

  if (reason) {
    return `${prefix} 现在电脑中枢或模型接口暂时不可用，我先用本地模式回应：你可以继续说，我会先帮你整理重点；等 Hub 启动后会切回真实模型。`;
  }

  return `${prefix} 现在是本地 MVP 模式。配置并启动电脑中枢后，这里会返回真实模型回复。`;
}

export const aiService = {
  async generateChatReply(input: GenerateChatReplyInput): Promise<string> {
    if (!hasAiProxyConfig) {
      return createFallbackReply(input);
    }

    try {
      const response = await callAiGateway<AiProxyResponse>({
        type: "chat",
        system: systemPrompts.chat,
        messages: input.messages,
      });

      return parseReply(response);
    } catch (error) {
      return createFallbackReply(input, error instanceof Error ? error.message : "AI request failed");
    }
  },

  async generatePlan(input: GeneratePlanInput): Promise<PlanDraft[]> {
    if (!hasAiProxyConfig) {
      return createLocalPlan(input.prompt);
    }

    try {
      const response = await callAiGateway<AiProxyResponse>({
        type: "plan",
        system: systemPrompts.plan,
        prompt: input.prompt,
      });

      return parsePlans(response);
    } catch {
      return createLocalPlan(input.prompt);
    }
  },
};
