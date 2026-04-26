# Task Plan: Second Me / 渊元移动端 MVP

## Goal
把当前 Expo + React Native 项目持续推进成可运行的“个人数字分身 Agent”手机端 MVP：记录、记忆库、AI 对话、语音对话、计划、我的，并通过电脑端 Hub 接入大模型。

## Current Phase
Phase 2

## Phases

### Phase 1: Context Recovery & Handoff Setup
- [x] 建立 `task_plan.md`
- [x] 建立 `findings.md`
- [x] 建立 `progress.md`
- [x] 写清楚新窗口恢复方式
- **Status:** complete

### Phase 2: AI Model Integration Stabilization
- [x] App 通过 `EXPO_PUBLIC_AI_PROXY_URL` 指向本地 Hub
- [x] 本地 Hub 通过 rapi OpenAI-compatible 接口调用模型
- [x] 验证 `claude-haiku-4-5-20251001` 可返回“渊元”回复
- [ ] 手机真机访问时，把代理地址从 `127.0.0.1` 改为电脑局域网 IP 或 Cloudflare Tunnel 地址
- [ ] 在聊天页显示模型连接状态，避免用户误以为没有接模型
- **Status:** in_progress

### Phase 3: Chat & Voice Interaction
- [x] 文本发送后显示用户消息
- [x] 修复开场样例覆盖真实助手回复的问题
- [x] 加入麦克风入口和 Web 语音识别 / TTS 预览
- [ ] 移动端录音权限和真实语音输入方案落地
- [ ] 语音对话做成 ChatGPT 类似的“一对一通话”状态机
- **Status:** in_progress

### Phase 4: Mobile UI Consolidation
- [x] 舍弃旧 Second Me 粉紫 UI，转向用户新给的“渊元”蓝白玻璃风格
- [x] 首页、记忆库、对话、我的基本对齐新参考
- [ ] 统一底部导航尺寸、位置、选中态
- [ ] 统一字体、标题层级、卡片圆角、浅蓝背景
- [ ] 动态英雄视频在首页和我的页稳定播放
- **Status:** in_progress

### Phase 5: Core MVP Function Closure
- [ ] 记录页：文字 / 录音基础保存流程稳定
- [ ] 记忆库：记录列表、筛选、详情可用
- [ ] 对话页：接入模型、上下文钩子、语音入口可用
- [ ] 计划页：AI 生成计划、保存、勾选完成可用
- [ ] 我的页：设置、同步、导出、清除数据等基础交互可用
- **Status:** pending

### Phase 6: Phone Build & Deployment
- [ ] 明确 Expo Go 预览、EAS Android APK、iOS TestFlight 的路径
- [ ] 手机访问模型时确定电脑中枢地址方案：局域网 IP 或 Cloudflare Tunnel
- [ ] 配置 `.env.example`，避免泄露真实 API key
- [ ] 生成 Android preview build
- **Status:** pending

## New Window Seamless Handoff
在新 Codex 窗口中直接发送下面这段即可恢复上下文：

```text
请进入 C:\codex-clean-test\personal-agent-mvp，先读取 AGENTS.md、task_plan.md、findings.md、progress.md，然后继续 Second Me / 渊元移动端 MVP。
当前优先级：
1. 保持最初目标：个人数字分身 Agent 手机端 MVP，不做无关后台。
2. 先保证可运行、可对话、可记录、可计划。
3. 当前 AI 链路是 App -> 本地 Hub -> rapi。
4. 先检查 npm run typecheck，再启动 Hub 和 Expo Web。
5. 不要泄露 .env 里的 API key。
```

## Multi-Window Threading
详细多窗口任务拆分见：

```text
docs/thread_workflow.md
```

基于总 PRD 的产品级拆分见：

```text
docs/prd_based_thread_plan.md
```

当前建议窗口：
- 总控窗口：维护计划、验收、合并，不直接陷入单点细节。
- 模型窗口：AI Hub & Model Connectivity。
- 对话窗口：Chat & Voice UX。
- 视觉窗口：UI Consistency & Navigation。
- 记录窗口：Records & Memory Library。
- 计划窗口：Plans & Daily Action Loop。
- 构建窗口：Mobile Build & Device Preview。

所有子窗口都必须先读 `docs/thread_workflow.md`，并严格遵守文件所有权。

## Recommended Parallel Plan
执行顺序：

1. Round 1 同时开 `模型窗口 + 视觉窗口 + 对话窗口`。
   - 模型窗口负责模型链路。
   - 视觉窗口负责全局 UI / 导航。
   - 对话窗口负责对话和语音体验。
2. Round 1 结束后，总窗口跑 `npm run typecheck` 并验收 `/home`、`/chat`、Hub `/v1/status`。
3. Round 2 开 `记录窗口 + 计划窗口`。
   - 记录窗口负责记录和记忆库。
   - 计划窗口负责计划闭环。
4. Round 2 结束后，总窗口验收完整 MVP 流程。
5. Round 3 开 `构建窗口`。
   - 构建窗口负责手机预览、Cloudflare Tunnel、Android build 文档。

当前不建议一次开 6 个窗口，先开 3 个最稳：模型窗口、视觉窗口、对话窗口。

## PRD-Based Revised Window Plan
根据 `个人数字分身_Agent_PRD_完整方案版.docx`，总项目应按产品系统层拆分，而不是只按当前页面拆分。

新的推荐窗口：
- 总控窗口：PRD 对齐、节奏、验收、合并。
- 手机采集窗口：录音、文字记录、上传状态、极简设置。
- 云端管线窗口：Supabase/Storage、Hub、转写、摘要、处理状态。
- 记忆画像窗口：原始资料库、压缩记忆库、人物画像、证据链。
- 对话路由窗口：问题分类、三段式上下文、skills/路由、写回候选。
- 电脑中枢窗口：Dashboard、资料库、摘要中心、画像中心、导入中心。
- 体验视觉窗口：渊元 UI、一致性、导航、动效、低操作成本。
- 构建部署窗口：Expo/EAS、手机联网、Cloudflare Tunnel、安全配置。

V1 当前主线：
录音 -> 转写 -> 摘要 -> 入库 -> 画像 -> 聊天。

## Required Startup Commands
在两个 PowerShell 窗口分别运行：

```powershell
cd "C:\codex-clean-test\personal-agent-mvp"
npm run hub:start
```

```powershell
cd "C:\codex-clean-test\personal-agent-mvp"
$env:EXPO_NO_TELEMETRY='1'
npx expo start --web --port 8082 --clear
```

本地浏览器预览：

```text
http://127.0.0.1:8082/home
http://127.0.0.1:8082/chat
```

Hub 健康检查：

```text
http://127.0.0.1:8787/v1/status
```

## Key Questions
1. 手机真机最终通过局域网 IP 还是 Cloudflare Tunnel 访问电脑 Hub？
2. 语音对话在 MVP 阶段先做 Web 预览，还是直接接移动端录音 + STT？
3. 计划页是否保留为隐藏路由，还是恢复成底部导航入口？
4. 现阶段数据先继续 mock store，还是开始接 Supabase？

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 使用 Expo + React Native + TypeScript | 符合手机端 MVP 目标，后续可打 Android/iOS 包 |
| 使用本地 Hub 转发大模型请求 | 避免在 App 暴露真实 API key，也方便多模型切换 |
| rapi 当前使用 `claude-haiku-4-5-20251001` | 用户给的 Sonnet 模型在当前分组返回 model_not_found，Haiku 已验证可用 |
| UI 以“渊元”蓝白玻璃风为准 | 用户明确要求舍弃旧界面，按新 GitHub/截图风格 1:1 靠近 |
| `.env` 不提交，`.env.example` 提供模板 | 避免泄露 API key |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `claude-sonnet-4-5-20250929` 返回 `model_not_found` | 1 | 暂用已验证的 `claude-haiku-4-5-20251001`，后续可换成 rapi 账号实际可用的 Sonnet 渠道 |
| 发送“你好”只显示用户气泡、不显示助手 | 1 | 修复聊天页 `visibleMessages` 逻辑，避免 starter messages 覆盖真实会话 |
| 手机访问 `127.0.0.1` 无法连电脑 Hub | 1 | 规划改为电脑局域网 IP 或 Cloudflare Tunnel 地址 |

## Notes
- 每次新窗口开始，先读本文件和 `findings.md / progress.md`。
- 不要把真实 API key 写进回复、截图、提交信息或文档。
- 当前最重要的产品闭环：记录 -> 记忆库 -> AI 对话 -> 计划 -> 我的设置。
