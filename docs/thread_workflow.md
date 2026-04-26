# Multi-Window Thread Workflow

## Purpose
用多个 Codex 窗口并行推进 `Second Me / 渊元` 手机端 MVP，但避免多个窗口互相覆盖代码。

本文件是工程协作层规则。总项目按 PRD 拆分的版本见：

```text
docs/prd_based_thread_plan.md
```

如果两个文件冲突，以 `docs/prd_based_thread_plan.md` 的产品分层为准，以本文件的文件冲突规则为准。

总原则：
- 总窗口负责调度、验收、合并决策。
- 子窗口只做一个明确任务。
- 子窗口必须遵守文件边界，不跨模块乱改。
- 任何窗口都不能输出或提交 `.env` 里的 API key。

## Master Window: 总控窗口
这个窗口是总控窗口。

总窗口职责：
- 维护 `task_plan.md`、`findings.md`、`progress.md`。
- 拆分任务和指定文件所有权。
- 接收每个子窗口的结果。
- 检查 `git status`、`npm run typecheck`。
- 决定哪些改动进入下一轮。
- 处理跨模块冲突。

总窗口不应该长时间陷入单个页面细节；如果需要细节开发，拆给子窗口。

## Required First Prompt For Every Child Window
每个新窗口先发送这段，再追加具体任务：

```text
请进入 C:\codex-clean-test\personal-agent-mvp。
先读取 AGENTS.md、task_plan.md、findings.md、progress.md、docs/thread_workflow.md。
你是子窗口，不是总窗口。
只做我指定的任务和指定文件范围。
不要改 .env，不要泄露 API key。
改代码前先运行 git status --short，确认不要覆盖其他窗口改动。
完成后运行 npm run typecheck，并汇报：
1. 做了什么
2. 改了哪些文件
3. 如何验证
4. 是否有风险或需要总窗口处理的冲突
```

## Window Names

建议直接用这些名字标记浏览器 / Codex 窗口：

| 窗口名 | 原编号 | 职责 |
|--------|--------|------|
| 总控窗口 | Master | 调度、验收、合并、冲突处理 |
| 模型窗口 | Window A | AI Hub、模型接入、手机联网 |
| 对话窗口 | Window B | 文本对话、一对一语音对话 |
| 视觉窗口 | Window C | 全局 UI、底部导航、字体、主题 |
| 记录窗口 | Window D | 文字/录音记录、记忆库 |
| 计划窗口 | Window E | 今日计划、AI 生成计划 |
| 构建窗口 | Window F | Expo Go、APK、Cloudflare Tunnel |

## Child Window Assignments

## Recommended Execution Plan

### Round 1: Stabilize The Foundation
先开 3 个子窗口，不要一开始开太多。

1. `模型窗口`: AI Hub & Model Connectivity
   - 目的：先保证模型链路稳定，否则对话、计划、语音都会受影响。
   - 优先级：最高。

2. `视觉窗口`: UI Consistency & Navigation
   - 目的：先把底部导航、页面宽度、字体、主题统一，否则后面每个页面都会重复返工。
   - 优先级：最高。

3. `对话窗口`: Chat & Voice UX
   - 目的：对话是产品核心，先把文本对话和语音入口做顺。
   - 依赖：可以和 A 并行，但最终要等 A 的模型链路验收。

总窗口在 Round 1 结束后执行：

```powershell
git status --short
npm run typecheck
```

并人工检查：
- `/home`
- `/chat`
- Hub `/v1/status`
- 发送“你好”是否有模型回复

### Round 2: Close MVP User Flows
Round 1 稳定后，再开 2 个子窗口。

4. `记录窗口`: Records & Memory Library
   - 目的：完成记录和记忆库的基础闭环。
   - 重点：新增记录、筛选、详情反馈、mock store 保存。

5. `计划窗口`: Plans & Daily Action Loop
   - 目的：完成今日计划的基础闭环。
   - 重点：新增计划、AI/mock 生成、勾选完成、保存。

总窗口在 Round 2 结束后验收完整 MVP：
- 首页入口能进入记录/记忆库/对话/计划。
- 记忆库能看到记录。
- 对话能返回模型回复。
- 计划能新增和完成。
- 我的页设置入口不死。

### Round 3: Device Preview & Build
最后开 `构建窗口`。

6. `构建窗口`: Mobile Build & Device Preview
   - 目的：整理手机预览和 APK 构建，不要提前做。
   - 原因：功能和导航还没稳定时，提前打包会浪费时间。

总窗口最后执行：
- Expo Go 手机预览检查。
- Web 预览检查。
- Android preview build 方案确认。
- 手机访问电脑 Hub 的局域网 IP / Tunnel 方案确认。

## Master Window Timeline

总窗口每天/每轮只做这些事：
1. 发任务给子窗口。
2. 等子窗口返回“修改文件 + 验证结果 + 风险”。
3. 检查是否有文件冲突。
4. 运行 `npm run typecheck`。
5. 更新 `task_plan.md` 和 `progress.md`。
6. 决定下一轮任务。

总窗口不要直接大改页面，除非是合并冲突或最后验收修补。

### 模型窗口: AI Hub & Model Connectivity
目标：让 App 稳定接入电脑 Hub 和 rapi 模型，支持手机真机访问。

允许修改：
- `server/hub/**`
- `services/ai/**`
- `config/env.ts`
- `.env.example`
- `docs/**`

禁止修改：
- `app/(tabs)/**`
- `app/screens/**`
- `components/**`
- `.env`

验收：
- `npm run typecheck` 通过。
- `http://127.0.0.1:8787/v1/status` 可访问。
- `POST /v1/ai` 输入“你好”返回“渊元”身份的模型回复。
- 给出手机真机访问方案：局域网 IP 或 Cloudflare Tunnel。

可复制任务：

```text
任务：你负责【模型窗口】：AI Hub & Model Connectivity。
请稳定 App -> Hub -> rapi 的模型链路。
不要改 UI 文件，不要改 .env，只能改 server/hub、services/ai、config/env.ts、.env.example、docs。
重点解决：
1. 手机真机不能用 127.0.0.1 的问题；
2. Hub 状态检查；
3. 模型不可用时的清晰错误和 fallback；
4. 页面可读的连接状态接口。
完成后运行 npm run typecheck，并汇报文件改动。
```

### 对话窗口: Chat & Voice UX
目标：把对话页做成可用的文本 + 一对一语音对话体验。

允许修改：
- `app/(tabs)/chat.tsx`
- `hooks/useChat.ts`
- `components/**` 中只和 chat/voice 相关的新组件
- `types/chat.ts`

禁止修改：
- `server/hub/**`
- `.env`
- `services/ai/**`，除非先和总窗口确认

验收：
- 发送“你好”后必须显示用户消息和助手回复。
- 输入框固定在底部，不随滚动漂移。
- 麦克风入口可点击，Web 预览能打开语音 modal。
- 语音 modal 有明确状态：待机、聆听、思考、播放、错误。

可复制任务：

```text
任务：你负责【对话窗口】：Chat & Voice UX。
只改 app/(tabs)/chat.tsx、hooks/useChat.ts、chat/voice 相关 components、types/chat.ts。
不要改 server/hub、services/ai、.env。
目标：
1. 文本对话发送后一定显示助手回复；
2. 输入框固定底部；
3. 加强一对一语音对话 modal；
4. 保持渊元蓝白玻璃风格。
完成后运行 npm run typecheck，并汇报文件改动。
```

### 视觉窗口: UI Consistency & Navigation
目标：统一全 App 的蓝白玻璃 UI、字体、底部导航、页面宽度。

允许修改：
- `config/theme.ts`
- `theme/**`
- `components/BottomTabBar.tsx`
- `components/AppScreenTabBar.tsx`
- `components/PageContainer.tsx`
- `components/yuanyuan/**`
- `app/(tabs)/_layout.tsx`

禁止修改：
- `services/**`
- `server/**`
- `.env`
- 页面业务逻辑

验收：
- 底部导航只有一层，不出现双导航。
- Web 预览时导航宽度限制在手机容器内，不横跨整屏。
- 首页、记忆库、对话、我的的标题、字体、圆角、背景一致。
- `npm run typecheck` 通过。

可复制任务：

```text
任务：你负责【视觉窗口】：UI Consistency & Navigation。
只改 theme/config 和公共 UI/导航组件，不改业务逻辑和服务层。
目标：
1. 全局蓝白玻璃风统一；
2. 底部导航只保留一层；
3. Web 预览导航限制在手机宽度；
4. 修正字体层级和卡片圆角。
完成后运行 npm run typecheck，并汇报文件改动。
```

### 记录窗口: Records & Memory Library
目标：让记录和记忆库具备 MVP 级可交互功能。

允许修改：
- `app/(tabs)/home.tsx`
- `app/screens/HomeScreen.tsx`
- `app/(tabs)/records.tsx`
- `store/**`
- `data/**`
- `services/**` 中记录相关文件
- `types/**` 中记录相关文件

禁止修改：
- `server/hub/**`
- `app/(tabs)/chat.tsx`
- `.env`

验收：
- 首页 record 卡可进入记录流程或记录页。
- 记忆库列表可筛选。
- 记录条目可点击查看详情或触发明确反馈。
- mock store 中能新增记录。

可复制任务：

```text
任务：你负责【记录窗口】：Records & Memory Library。
只改首页、records 页面、mock store、记录相关 services/data/types。
不要改 chat、server/hub、.env。
目标：
1. 文字/录音记录入口可用；
2. 记忆库列表、筛选、点击详情可用；
3. 保存行为落到 mock store；
4. 保持渊元 UI 风格。
完成后运行 npm run typecheck，并汇报文件改动。
```

### 计划窗口: Plans & Daily Action Loop
目标：完成简单计划页和 AI 生成计划的 MVP 闭环。

允许修改：
- `app/(tabs)/plans.tsx`
- `hooks/usePlans.ts`
- `services/planService.ts`
- `types/plans.ts`
- `store/**` 中计划相关状态

禁止修改：
- `app/(tabs)/chat.tsx`
- `server/hub/**`
- `.env`

验收：
- 新增计划可用。
- 生成计划按钮可用。
- 勾选完成可用。
- 计划数据能保存到 mock store。

可复制任务：

```text
任务：你负责【计划窗口】：Plans & Daily Action Loop。
只改 plans 页面、usePlans、planService、types/plans、计划相关 store。
不要改 chat、server/hub、.env。
目标：
1. 新增计划；
2. AI/mock 生成简单计划；
3. 勾选完成；
4. 今日计划列表可用。
完成后运行 npm run typecheck，并汇报文件改动。
```

### 构建窗口: Mobile Build & Device Preview
目标：整理手机预览、Android APK、电脑中枢联网方案。

允许修改：
- `app.json`
- `eas.json`
- `.env.example`
- `docs/**`
- `package.json` scripts，需谨慎

禁止修改：
- 页面 UI
- 业务逻辑
- `.env`

验收：
- 写清 Expo Go、Web、Android preview build 的步骤。
- 写清手机连接电脑 Hub 的两种方案：局域网 IP、Cloudflare Tunnel。
- `npm run typecheck` 通过。

可复制任务：

```text
任务：你负责【构建窗口】：Mobile Build & Device Preview。
只改 app.json、eas.json、.env.example、docs、必要 package scripts。
不要改页面 UI、业务逻辑、.env。
目标：
1. 整理 Expo Go 手机预览步骤；
2. 整理 Android APK/EAS build 步骤；
3. 整理手机访问电脑 Hub 的局域网 IP 和 Cloudflare Tunnel 方案。
完成后运行 npm run typecheck，并汇报文件改动。
```

## Conflict Rules
如果两个窗口都需要改同一个文件：
1. 停止直接编辑。
2. 在总窗口报告冲突文件和原因。
3. 总窗口决定由哪个窗口拥有该文件。
4. 另一个窗口只能基于拥有者结果继续。

高风险冲突文件：
- `app/(tabs)/chat.tsx`
- `config/theme.ts`
- `components/PageContainer.tsx`
- `components/BottomTabBar.tsx`
- `store/mockAgentStore.ts`
- `services/ai/aiService.ts`

## Merge Checklist For Master Window
每个子窗口完成后，总窗口执行：

```powershell
git status --short
npm run typecheck
```

必要时再启动：

```powershell
npm run hub:start
npx expo start --web --port 8082 --clear
```

验收时至少看：
- 首页
- 记忆库
- 对话
- 我的
- 计划页如果本轮涉及

## Reporting Format For Child Windows
每个子窗口最终汇报必须使用：

```text
窗口：总控/模型/对话/视觉/记录/计划/构建
完成内容：
- ...

修改文件：
- ...

验证：
- npm run typecheck：通过/失败
- 其他验证：...

风险/需要总窗口处理：
- ...
```
