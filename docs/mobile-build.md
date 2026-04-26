# Mobile Build

本文件归【构建部署窗口】维护，范围只覆盖 Expo Go 预览、Android APK / EAS Build、环境变量、手机访问电脑 Hub。

## Checked Config

### `app.json`

当前配置可用于手机端预览和 EAS Build：

- App 名称：`渊元`
- Expo slug：`yuanyuan-digital-twin`
- Deep link scheme：`yuanyuan`
- iOS bundle id：`com.yuanyuan.digitaltwin`
- Android package：`com.yuanyuan.digitaltwin`
- Android 已开启 `edgeToEdgeEnabled`
- `expo-av` 插件已配置麦克风权限文案
- `expo-router`、`expo-secure-store`、`expo-font` 已在 plugins 中
- `assets/icon.png`、`assets/splash-icon.png`、`assets/adaptive-icon.png`、`assets/favicon.png` 均存在

结论：当前不需要改 `app.json`。

### `eas.json`

当前 EAS 配置已满足 Android preview APK：

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "environment": "preview",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

结论：

- `preview` 会生成可直接安装到 Android 设备的 `.apk`。
- `preview` 明确绑定 EAS `preview` 环境，便于管理 APK 构建时的 `EXPO_PUBLIC_*` 值。
- `production` 保持发布构建路径。
- `development`、`preview`、`production` 分别绑定同名 EAS environment。

参考：

- https://docs.expo.dev/build-reference/apk/
- https://docs.expo.dev/build/eas-json/

## Environment Rules

不要把真实模型供应商 API key 写进任何 `EXPO_PUBLIC_*` 变量。Expo 客户端变量会进入 App 包或运行时代码，只能放公开地址、公开 anon key 或临时共享 token。

推荐分层：

- 手机 App 只配置 `EXPO_PUBLIC_AI_PROXY_URL`、`EXPO_PUBLIC_HUB_URL`、可选 `EXPO_PUBLIC_AI_PROXY_TOKEN`
- 电脑 Hub 才配置 `AI_PRIMARY_API_KEY`、`AI_FALLBACK_1_API_KEY` 等真实模型密钥
- `.env` 只保存在本机，不提交
- `.env.example` 只放空值、示例 URL 和占位说明

Expo Go 本地调试可使用：

```text
EXPO_PUBLIC_AI_PROXY_URL=http://127.0.0.1:8787/v1/ai
EXPO_PUBLIC_HUB_URL=http://127.0.0.1:8787
```

真机连接电脑 Hub 时必须改成电脑局域网 IP 或 Tunnel 域名：

```text
EXPO_PUBLIC_AI_PROXY_URL=http://YOUR_COMPUTER_LAN_IP:8787/v1/ai
EXPO_PUBLIC_HUB_URL=http://YOUR_COMPUTER_LAN_IP:8787
```

或：

```text
EXPO_PUBLIC_AI_PROXY_URL=https://api.secondme.yourdomain.com/v1/ai
EXPO_PUBLIC_HUB_URL=https://api.secondme.yourdomain.com
```

改 `.env` 后必须重启 Expo。

参考：

- https://docs.expo.dev/guides/environment-variables/
- https://docs.expo.dev/eas/using-environment-variables/

## Expo Go Phone Preview

### 1. Install Dependencies

```powershell
npm ci
```

### 2. Prepare `.env`

从 `.env.example` 复制出本机 `.env`，只在 `.env` 中填真实值。

本机 Web 预览可以继续用 `127.0.0.1`：

```text
EXPO_PUBLIC_AI_PROXY_URL=http://127.0.0.1:8787/v1/ai
EXPO_PUBLIC_HUB_URL=http://127.0.0.1:8787
```

手机 Expo Go 预览要用电脑局域网 IP：

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '169.254*' -and $_.PrefixOrigin -ne 'WellKnown' } | Select-Object IPAddress, InterfaceAlias
```

假设查到电脑 IP 是 `192.168.1.23`，则 `.env` 中使用：

```text
EXPO_PUBLIC_AI_PROXY_URL=http://192.168.1.23:8787/v1/ai
EXPO_PUBLIC_HUB_URL=http://192.168.1.23:8787
```

### 3. Start Computer Hub

```powershell
npm run hub:start
```

Hub 默认读取：

```text
HUB_HOST=0.0.0.0
HUB_PORT=8787
```

电脑本机检查：

```text
http://127.0.0.1:8787/v1/status
```

同一 Wi-Fi 手机检查：

```text
http://YOUR_COMPUTER_LAN_IP:8787/v1/status
```

如果手机打不开，优先检查：

- 手机和电脑是否在同一 Wi-Fi
- Windows 防火墙是否允许 Node / 8787 入站
- 公司、校园、访客 Wi-Fi 是否隔离了设备互访

必要时在管理员 PowerShell 中放行端口：

```powershell
New-NetFirewallRule -DisplayName "Yuanyuan Hub 8787" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8787
```

### 4. Start Expo

局域网模式：

```powershell
$env:EXPO_NO_TELEMETRY='1'
npx expo start --host lan --port 8082 --clear
```

网络不稳定或局域网隔离时使用 Expo tunnel：

```powershell
$env:EXPO_NO_TELEMETRY='1'
npx expo start --tunnel --port 8082 --clear
```

然后在手机安装 Expo Go，扫描终端里的 QR code。

### 5. Quick Acceptance

手机上至少检查：

- App 能打开首页
- 录音权限弹窗能出现
- 对话页能发送文字
- Hub 状态不是离线
- 如果配置了模型供应商，发送消息后能返回真实模型回复

## Phone To Computer Hub

### Option A: LAN IP

适合手机和电脑在同一可信 Wi-Fi 的开发阶段。

优点：

- 最快
- 不需要域名
- 不需要 Cloudflare

限制：

- IP 可能变化
- 部分 Wi-Fi 会隔离设备
- APK 离开当前网络后无法访问电脑 Hub

配置：

```text
EXPO_PUBLIC_AI_PROXY_URL=http://YOUR_COMPUTER_LAN_IP:8787/v1/ai
EXPO_PUBLIC_HUB_URL=http://YOUR_COMPUTER_LAN_IP:8787
```

### Option B: Cloudflare Tunnel

适合 APK 分发、跨网络测试、长期使用。

优点：

- 手机不用和电脑在同一 Wi-Fi
- HTTPS URL 更适合真机和 APK
- 电脑 Hub 仍然不需要暴露公网 IP

配置：

```text
EXPO_PUBLIC_AI_PROXY_URL=https://api.secondme.yourdomain.com/v1/ai
EXPO_PUBLIC_HUB_URL=https://api.secondme.yourdomain.com
```

详细步骤见：

```text
docs/cloudflare-tunnel.md
```

## Android APK With EAS Build

### One-Time Setup

```powershell
npm install -g eas-cli
```

```powershell
eas login
```

```powershell
npx eas-cli whoami
```

当前机器检查结果：`npx --yes eas-cli whoami` 返回 `Not logged in`。登录 Expo 账号后才能触发远程 EAS Build。

如果是首次把本仓库连接到 Expo 项目，EAS 可能提示创建或关联 project，并可能写入 `app.json` 的 EAS project id。该变更应交给总控窗口确认后合并。

给 preview APK 配置公开构建变量：

```powershell
npx eas-cli env:create preview --name EXPO_PUBLIC_AI_PROXY_URL --value https://api.secondme.yourdomain.com/v1/ai --visibility plaintext
```

```powershell
npx eas-cli env:create preview --name EXPO_PUBLIC_HUB_URL --value https://api.secondme.yourdomain.com --visibility plaintext
```

查看 preview 环境变量：

```powershell
npx eas-cli env:list preview
```

这里不要创建 `AI_PRIMARY_API_KEY`、`AI_FALLBACK_1_API_KEY` 等模型供应商密钥；这些属于电脑 Hub 或服务器环境，不属于手机 App 构建环境。

### Build Preview APK

```powershell
npm run build:android:preview
```

等 EAS 云端构建完成后，在终端输出链接或 Expo dashboard 下载 `.apk`，传到 Android 手机安装。

### Build Production

```powershell
npm run build:android:production
```

生产构建用于正式发布，通常会生成发布渠道需要的产物，不等同于最快真机安装包。日常安卓真机测试优先用 `preview`。

### APK Env Choice

APK 会带上构建时可用的 `EXPO_PUBLIC_*` 值。远程 EAS Build 不应依赖本机未提交的 `.env`，应在 EAS dashboard 或 EAS CLI 中配置 `preview` / `production` environment variables。

用于分发测试时，优先在 EAS `preview` 环境配置稳定 HTTPS Hub：

```text
EXPO_PUBLIC_AI_PROXY_URL=https://api.secondme.yourdomain.com/v1/ai
EXPO_PUBLIC_HUB_URL=https://api.secondme.yourdomain.com
```

如果只给同一 Wi-Fi 下的一台 Android 手机临时安装，可以使用局域网 IP，但 IP 变化后需要重新构建或提供可配置入口。

真实模型 API key 不应进入 APK。Hub 的 `AI_PRIMARY_API_KEY`、`AI_FALLBACK_1_API_KEY` 等只放在电脑或服务器环境。

## Current Build Checklist

- [x] `app.json` 已检查，手机端基础配置可用
- [x] `eas.json` 已检查，Android preview build 已设置 `apk`
- [x] `.env.example` 包含手机 App、Hub、模型供应商的必要占位
- [x] Expo Go 局域网预览步骤已整理
- [x] 手机访问电脑 Hub 的 LAN 和 Cloudflare Tunnel 方案已整理
- [x] Android APK / EAS Build 步骤已整理

## Known Risks

- 当前仓库没有固定 Expo account/project id；首次 EAS build 可能产生 `app.json` 变更，需要总控窗口确认。
- 局域网 IP 会变，长期 APK 测试建议使用 Cloudflare Tunnel 或其它稳定 HTTPS Hub。
- Windows 防火墙或网络隔离会导致手机打不开电脑 Hub。
- `EXPO_PUBLIC_*` 会暴露到客户端，不要放真实模型供应商密钥。
