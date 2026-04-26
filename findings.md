# Findings & Decisions

## Requirements
- 产品名称和当前手机端风格核心为“渊元 / Yuan Yuan”。
- 最初目标是“个人数字分身 Agent”手机端 MVP，不是普通笔记，也不是只做 UI。
- 第一阶段必须优先跑通：文字记录、录音记录、AI 对话、简单计划。
- 代码架构要为后续长期记忆、画像、摘要、向量检索预留空间，但当前不要过度设计。
- 用户希望新窗口能无缝接上，不丢上下文。
- PRD 总项目定位是手机采集 + 电脑中枢 + 云端处理 + 长期记忆 + 人物画像 + 对话路由的个人数字分身系统。
- PRD 明确当前优先 V1 主线：录音 -> 转写 -> 摘要 -> 入库 -> 画像 -> 聊天。

## Research Findings
- 当前项目路径：`C:\codex-clean-test\personal-agent-mvp`
- 技术栈：Expo Router、React Native、TypeScript、Zustand、Supabase 预留、本地 Hub AI 网关。
- 本地 Hub 路径：`server/hub/index.mjs`
- AI service 路径：`services/ai/aiService.ts`
- Chat hook 路径：`hooks/useChat.ts`
- 聊天页路径：`app/(tabs)/chat.tsx`
- 首页路径：`app/screens/HomeScreen.tsx`
- 动态视频组件路径：`components/DynamicHeroVideo.tsx`
- 动态视频素材：
  - `assets/mascot/yuanyuan-home-hero.mp4`
  - `assets/mascot/yuanyuan-hero.mp4`
- PRD 的端分工：
  - 手机端：录音采集入口，极简操作，一键录音/上传/状态。
  - 电脑端：网页中枢，资料库、摘要、画像、导入、对话、设置。
  - 云端：存储、转写、摘要、画像更新、检索、对话调度。
- PRD 的记忆层级：
  - L0 原始证据层。
  - L1 片段摘要层。
  - L2 日/周/月时间摘要层。
  - L3 人物画像层。
  - L4 动态对话上下文层。
- PRD 的对话机制：
  - 识别问题类型。
  - 调用画像层。
  - 调用近期摘要层。
  - 检索相关历史片段。
  - 生成回答并判断是否写回记忆。

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| App 不直接请求 rapi，而是请求本地 Hub | 防止 API key 暴露在客户端，方便未来接多模型和电脑中枢 |
| Hub 监听 `0.0.0.0:8787` | 电脑本机和同局域网手机都可访问 |
| Expo Web 当前常用端口为 `8082` | 之前多次预览和修复都围绕该端口 |
| 聊天页保留开场样例，但真实消息追加显示 | 保持参考 UI 氛围，同时不遮挡模型回复 |
| 规划文件放项目根目录 | 新窗口进入项目后能直接恢复上下文 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Sonnet 模型在 rapi 当前分组不可用 | 使用已测通的 Haiku，后续需要 rapi 可用模型名或分组权限 |
| DeepSeek fallback 已接入 | `AI_FALLBACK_1` 使用 DeepSeek-compatible，模型 `deepseek-v4-flash`，已通过 Hub provider 直测 |
| App Web 发送消息后无助手回复 | 修复消息显示逻辑，并保留 AI service 失败兜底 |
| 电脑可访问 Hub，但手机访问 `127.0.0.1` 会失败 | 手机必须用电脑局域网 IP，例如 `http://10.71.171.246:8787/v1/ai`，或使用 Cloudflare Tunnel |
| PowerShell 读取某些中文文件时可能显示乱码 | 用 `Get-Content -Encoding UTF8` 读取；编辑时保持 UTF-8 |

## Resources
- Expo Web preview: `http://127.0.0.1:8082/home`
- Chat preview: `http://127.0.0.1:8082/chat`
- Hub status: `http://127.0.0.1:8787/v1/status`
- Hub AI endpoint: `http://127.0.0.1:8787/v1/ai`
- 当前电脑 WLAN IPv4：`10.71.171.246`
- PRD extraction cache: `.codex/prd_extracted.txt`
- PRD-based thread plan: `docs/prd_based_thread_plan.md`

## Visual/Browser Findings
- 新 UI 方向来自用户提供的蓝白玻璃手机截图：
  - 首页：`YUAN YUAN / 晨安，行止`，大动态画像卡，Record 卡，底部 4 tab。
  - 记忆库：`MEMORY / 记忆库`，搜索框、统计卡、类型 chip、记录列表。
  - 对话：顶部“渊元”，消息气泡，底部固定输入框，不随滚动移动。
  - 我的：`PROFILE / 行止`，画像完整度卡、我的画像、数据中心、同步设置。
- 用户要求动态卡片位置加入视频式动态效果，不只是静态白卡。
- 用户要求导航不要出现双层，也不要横跨整个桌面宽度；应限制在手机宽度范围内。

## New Window Recovery Checklist
新窗口接手时必须先检查：
- `task_plan.md`
- `findings.md`
- `progress.md`
- `.env.example`
- `services/ai/aiService.ts`
- `server/hub/config.mjs`
- `hooks/useChat.ts`
- `app/(tabs)/chat.tsx`

然后运行：

```powershell
npm run typecheck
```

如果要验证模型：

```powershell
npm run hub:start
```

另开窗口：

```powershell
$env:EXPO_NO_TELEMETRY='1'
npx expo start --web --port 8082 --clear
```

## Security Notes
- `.env` 包含用户 API key，不要输出、提交、截图。
- 给用户说明配置时只说“已配置 / 未配置 / 需要替换”，不要复述密钥。
