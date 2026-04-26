# Cloudflare Tunnel

## Recommended Mode

Cloudflare currently recommends a remotely-managed tunnel from the dashboard for most setups. For a single personal computer hub, that is also the simplest path.

Official docs:

- https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-remote-tunnel/
- https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/local-management/
- https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/configure-tunnels/tunnel-run-parameters/

## What To Expose

- `http://localhost:8787` -> AI / hub API
- `http://localhost:3000` -> future admin page

Recommended hostnames:

- `api.secondme.yourdomain.com`
- `admin.secondme.yourdomain.com`

## Fast Setup

1. Install `cloudflared`
2. Login:

```bash
cloudflared tunnel login
```

3. Create a tunnel:

```bash
cloudflared tunnel create second-me-hub
```

4. Create DNS routes:

```bash
cloudflared tunnel route dns second-me-hub api.secondme.yourdomain.com
cloudflared tunnel route dns second-me-hub admin.secondme.yourdomain.com
```

5. Copy:

`cloudflared/config.example.yml`

to:

```text
%USERPROFILE%\\.cloudflared\\config.yml
```

6. Replace:

- `YOUR_TUNNEL_ID`
- credentials file path
- your real hostnames

7. Start the local hub:

```bash
npm run hub:start
```

The hub reads its settings from the project-root `.env`, so you can keep both the phone app and computer hub on the same config source.

8. Run the tunnel:

```bash
cloudflared tunnel run second-me-hub
```

## App Env

For the phone app, point the AI proxy to your tunnel URL:

```text
EXPO_PUBLIC_AI_PROXY_URL=https://api.secondme.yourdomain.com/v1/ai
EXPO_PUBLIC_AI_PROXY_TOKEN=your-shared-hub-token
```

If you set `HUB_API_TOKEN`, the app must send the same token.

## Local LAN Mode

If phone and computer are on the same Wi-Fi, you can skip the tunnel first and use:

```text
EXPO_PUBLIC_AI_PROXY_URL=http://YOUR_COMPUTER_LAN_IP:8787/v1/ai
```

Example:

```text
EXPO_PUBLIC_AI_PROXY_URL=http://192.168.1.23:8787/v1/ai
```
