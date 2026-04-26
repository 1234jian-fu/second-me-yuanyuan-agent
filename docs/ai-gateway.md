# AI Gateway

The phone app calls AI through proxy endpoints. Do not put raw OpenAI, DeepSeek, or other model provider secret keys in Expo env values.

## Endpoint Order

The app tries endpoints in this order:

1. `EXPO_PUBLIC_AI_PROXY_URL`
2. `EXPO_PUBLIC_AI_FALLBACK_1_URL`
3. `EXPO_PUBLIC_AI_FALLBACK_2_URL`

If one endpoint fails or times out, the next endpoint is tried automatically.

## Environment

```text
EXPO_PUBLIC_AI_PROXY_URL=https://your-primary-ai-proxy.example.com/chat
EXPO_PUBLIC_AI_PROXY_TOKEN=
EXPO_PUBLIC_AI_PROVIDER=openai-compatible
EXPO_PUBLIC_AI_MODEL=

EXPO_PUBLIC_AI_FALLBACK_1_URL=https://your-backup-ai-proxy.example.com/chat
EXPO_PUBLIC_AI_FALLBACK_1_TOKEN=
EXPO_PUBLIC_AI_FALLBACK_1_PROVIDER=deepseek-compatible
EXPO_PUBLIC_AI_FALLBACK_1_MODEL=

EXPO_PUBLIC_AI_FALLBACK_2_URL=
EXPO_PUBLIC_AI_FALLBACK_2_TOKEN=
EXPO_PUBLIC_AI_FALLBACK_2_PROVIDER=custom-proxy
EXPO_PUBLIC_AI_FALLBACK_2_MODEL=
```

## Request Contract

Each proxy should accept a JSON POST body:

```json
{
  "provider": "openai-compatible",
  "model": "optional-model-name",
  "type": "chat",
  "system": "system prompt",
  "messages": [
    { "role": "user", "content": "hello" }
  ]
}
```

Plan generation uses:

```json
{
  "provider": "openai-compatible",
  "model": "optional-model-name",
  "type": "plan",
  "system": "system prompt",
  "prompt": "plan request"
}
```

## Response Contract

The app accepts any of these response shapes:

```json
{ "reply": "text" }
```

```json
{ "content": "text" }
```

```json
{ "choices": [{ "message": { "content": "text" } }] }
```

For plans:

```json
{ "plans": [{ "title": "Task one" }] }
```

## Computer Hub Mode

If your computer is the central node, expose the local hub API through Cloudflare Tunnel:

```text
EXPO_PUBLIC_AI_PROXY_URL=https://api.secondme.yourdomain.com/v1/ai
EXPO_PUBLIC_AI_PROXY_TOKEN=your-shared-hub-token
```

See:

- `docs/cloudflare-tunnel.md`
- `server/hub/index.mjs`
