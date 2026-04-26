# Cloud Pipeline

This window owns the service-layer path for storage, Hub processing, and phone access. UI pages and `.env` are intentionally not changed here.

## Scope

- Supabase Storage remains the object store abstraction through `services/storageService.ts`.
- The app-side cloud pipeline entry point is `services/cloudPipelineService.ts`.
- The local computer Hub exposes mock processing endpoints from `server/hub/index.mjs`.
- The Hub can still call rapi through the existing OpenAI-compatible `/v1/ai` route.

## Status Model

The PRD upload and post-processing states are:

| Status | Label |
| --- | --- |
| `pending_upload` | 待上传 |
| `uploading` | 上传中 |
| `uploaded` | 已上传 |
| `analyzing` | 分析中 |
| `completed` | 已完成 |
| `failed` | 失败 |

Compatibility aliases are kept for current app code:

- `queued` maps to `pending_upload`
- `processing` maps to `analyzing`

## App Service Flow

`cloudPipelineService.uploadAudio()` runs:

1. Create a pending task.
2. Upload audio through `storageService.uploadAudio()`.
3. Create an `audio_entries` row.
4. Mark task as analyzing.
5. POST to Hub `/v1/pipeline/analyze`.
6. Return completed task with mock transcript, summary, and categories.
7. Return failed task if upload, DB, or Hub processing fails.

If no Hub URL is configured, the service returns local mock analysis instead of blocking capture.

## Hub Processing Endpoints

Run:

```powershell
npm run hub:start
```

Available endpoints:

```text
GET  /health
GET  /v1/status
POST /v1/ai
POST /v1/pipeline/analyze
POST /v1/pipeline/transcribe
POST /v1/pipeline/summarize
POST /v1/pipeline/classify
```

Pipeline endpoint payload:

```json
{
  "id": "optional-record-id",
  "kind": "audio",
  "title": "optional title",
  "storagePath": "user/audio/file.m4a",
  "signedUrl": "optional signed url"
}
```

Response:

```json
{
  "ok": true,
  "transcript": "mock transcript",
  "summary": "mock summary",
  "categories": ["voice", "capture"],
  "provider": "hub-local-mock",
  "model": null
}
```

## Phone Device Access

Phones cannot use `127.0.0.1` to reach the computer Hub. Use one of these:

1. LAN mode: set the phone app proxy URL to `http://YOUR_COMPUTER_LAN_IP:8787/v1/ai`.
2. Tunnel mode: expose `http://localhost:8787` with Cloudflare Tunnel and use `https://api.yourdomain.com/v1/ai`.

For pipeline analysis, `cloudPipelineService` derives the Hub base URL from `EXPO_PUBLIC_HUB_URL` when present, otherwise from `EXPO_PUBLIC_AI_PROXY_URL` by stripping `/v1/ai`.

Do not put provider API keys in Expo public env values. Provider keys stay on the Hub side.
