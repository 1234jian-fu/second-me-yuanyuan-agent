import http from "node:http";

import { hubConfig, getPublicHubStatus } from "./config.mjs";
import { createLocalChatReply, createLocalPlans } from "./fallbacks.mjs";
import {
  handlePipelineAnalyze,
  handlePipelineClassify,
  handlePipelineSummarize,
  handlePipelineTranscribe,
} from "./pipeline.mjs";
import { callProvider } from "./providers.mjs";

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Origin": hubConfig.allowOrigin,
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

function sendHtml(response, statusCode, html) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": hubConfig.allowOrigin,
    "Content-Type": "text/html; charset=utf-8",
  });
  response.end(html);
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function isAuthorized(request) {
  if (!hubConfig.apiToken) {
    return true;
  }

  const authHeader = request.headers.authorization;
  return authHeader === `Bearer ${hubConfig.apiToken}`;
}

async function handleAiRequest(request, response) {
  if (!isAuthorized(request)) {
    sendJson(response, 401, {
      error: "Unauthorized",
      message: "Missing or invalid hub token.",
    });
    return;
  }

  const payload = await readJsonBody(request);

  if (payload.type !== "chat" && payload.type !== "plan") {
    sendJson(response, 400, {
      error: "Bad Request",
      message: "Payload type must be either 'chat' or 'plan'.",
    });
    return;
  }

  if (hubConfig.providers.length === 0) {
    sendJson(response, 200, {
      ...(payload.type === "chat"
        ? { reply: createLocalChatReply(payload.messages ?? []) }
        : { plans: createLocalPlans(payload.prompt ?? "") }),
      model: null,
      provider: "local-fallback",
    });
    return;
  }

  const failures = [];

  for (const provider of hubConfig.providers) {
    try {
      const result = await callProvider(provider, payload);
      sendJson(response, 200, {
        ...result.data,
        model: result.model,
        provider: result.provider,
      });
      return;
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }

  sendJson(response, 502, {
    error: "Upstream Failure",
    failures,
    message: "All configured AI providers failed.",
  });
}

async function handlePipelineAnalyzeRequest(request, response) {
  if (!isAuthorized(request)) {
    sendJson(response, 401, {
      error: "Unauthorized",
      message: "Missing or invalid hub token.",
    });
    return;
  }

  const payload = await readJsonBody(request);

  if (payload.kind !== "audio" && payload.kind !== "text") {
    sendJson(response, 400, {
      error: "Bad Request",
      message: "Payload kind must be either 'audio' or 'text'.",
    });
    return;
  }

  const analysis = await handlePipelineAnalyze(payload);
  sendJson(response, 200, {
    ok: true,
    ...analysis,
  });
}

async function handlePipelineStepRequest(request, response, handler) {
  if (!isAuthorized(request)) {
    sendJson(response, 401, {
      error: "Unauthorized",
      message: "Missing or invalid hub token.",
    });
    return;
  }

  const payload = await readJsonBody(request);
  const result = await handler(payload);
  sendJson(response, 200, {
    ok: true,
    ...result,
  });
}

const server = http.createServer(async (request, response) => {
  try {
    if (!request.url || !request.method) {
      sendJson(response, 400, { error: "Bad Request" });
      return;
    }

    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Origin": hubConfig.allowOrigin,
      });
      response.end();
      return;
    }

    if (request.method === "GET" && request.url === "/health") {
      sendJson(response, 200, {
        ok: true,
        service: "second-me-hub",
        time: new Date().toISOString(),
      });
      return;
    }

    if (request.method === "GET" && request.url === "/v1/status") {
      sendJson(response, 200, {
        ok: true,
        status: getPublicHubStatus(),
        time: new Date().toISOString(),
      });
      return;
    }

    if (request.method === "POST" && request.url === "/v1/ai") {
      await handleAiRequest(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/v1/pipeline/analyze") {
      await handlePipelineAnalyzeRequest(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/v1/pipeline/transcribe") {
      await handlePipelineStepRequest(request, response, handlePipelineTranscribe);
      return;
    }

    if (request.method === "POST" && request.url === "/v1/pipeline/summarize") {
      await handlePipelineStepRequest(request, response, handlePipelineSummarize);
      return;
    }

    if (request.method === "POST" && request.url === "/v1/pipeline/classify") {
      await handlePipelineStepRequest(request, response, handlePipelineClassify);
      return;
    }

    if (request.method === "GET" && request.url === "/") {
      sendHtml(
        response,
        200,
        `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Second Me Hub</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; background:#fbf9f5; color:#1b1c1a; padding:40px; }
      .card { max-width:720px; background:#fff; border-radius:24px; padding:24px; box-shadow:0 12px 28px rgba(86,99,66,.08); }
      code { background:#f5f3ef; padding:2px 6px; border-radius:8px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Second Me Hub</h1>
      <p>电脑中枢服务已启动。</p>
      <p>健康检查：<code>/health</code></p>
      <p>状态接口：<code>/v1/status</code></p>
      <p>AI 网关：<code>/v1/ai</code></p>
      <p>管线分析：<code>/v1/pipeline/analyze</code></p>
      <p>管线占位：<code>/v1/pipeline/transcribe</code> / <code>/v1/pipeline/summarize</code> / <code>/v1/pipeline/classify</code></p>
    </div>
  </body>
</html>`,
      );
      return;
    }

    sendJson(response, 404, {
      error: "Not Found",
      message: "Unknown route.",
    });
  } catch (error) {
    sendJson(response, 500, {
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

server.listen(hubConfig.port, hubConfig.host, () => {
  console.log(`[second-me-hub] listening on http://${hubConfig.host}:${hubConfig.port}`);
});
