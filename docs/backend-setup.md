# Backend Setup

This step wires the app for a Supabase-backed text record flow while keeping local fallback.

## Supabase Project

1. Create a Supabase project.
2. Enable anonymous sign-ins in Supabase Auth if you want the MVP to run without email login.
3. Run `supabase/schema.sql` in the SQL editor.
4. Run `supabase/storage-policies.sql` in the SQL editor.
5. Copy your project URL and anon key into `.env`.

## Environment

Create `.env` from `.env.example`:

```text
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_AI_PROXY_URL=
EXPO_PUBLIC_AI_PROXY_TOKEN=
EXPO_PUBLIC_AI_PROVIDER=openai-compatible
```

Restart Expo after changing `.env`.
`npm run hub:start` will also read the same project-root `.env`.

## Current Wiring

- `AuthBootstrap` signs in anonymously on app startup when Supabase env values exist.
- `Records` saves text records to `text_entries` when auth is ready.
- `Records` captures audio with `expo-av`, uploads files to the private `audio-entries` bucket, and saves metadata to `audio_entries` when auth is ready.
- `Plans` creates manual plans, saves template-generated plans, and toggles done status in the `plans` table when auth is ready.
- `Chat` calls `aiService`, which can route across multiple AI proxy endpoints with fallback. See `docs/ai-gateway.md`.
- `server/hub/index.mjs` can run on your computer as the central AI gateway. See `docs/cloudflare-tunnel.md`.
- If Supabase config is missing or auth fails, `Records` keeps using local mock state after recording.
- If Supabase config is missing or auth fails, `Plans` keeps using local mock state.
- If AI proxy config is missing, `Chat` keeps using a local fallback reply.

## Next Backend Targets

- Add playback for saved audio by creating signed URLs from `storage_path`.
- Replace template plan generation with `aiService.generatePlan`.
