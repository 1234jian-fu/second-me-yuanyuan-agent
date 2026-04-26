# PRD-Based Thread Plan

来源：`个人数字分身_Agent_PRD_完整方案版.docx`

## Product North Star
这不是普通笔记 App，也不是纯聊天机器人。

总项目目标是：
以云端数据库和长期记忆为底座，以手机采集为入口，以电脑管理为中枢，以人物画像持续更新为核心机制，并逐步向学习辅助、现状分析、决策支持、自我认知提升和部分代理执行延伸的个人数字分身系统。

## PRD Confirmed Execution Order
PRD 明确建议不要一次性做全，优先顺序是：

1. V1：录音 -> 转写 -> 摘要 -> 入库 -> 画像 -> 聊天
2. V1.5：导入聊天记录、周/月报、画像时间线、学习计划、现状分析、成长复盘
3. V2：图片上传与理解、视频转写与理解、多模态总结、主动提醒
4. V3：更强数字分身人格、生活 OS、任务/日历/目标联动、低风险代理执行

当前开发必须优先服务 V1，不要被 V2/V3 分散。

## PRD Product Layers

### 1. 手机端：采集入口
定位：录音采集入口。

职责：
- 一键开始录音
- 一键结束录音并自动上传
- 显示上传状态
- 显示处理状态
- 极简设置

原则：
- 少按钮、少配置、少干预
- 用户录完就结束
- 后续分析由云端自动完成

### 2. 云端：统一存储 + AI 处理 + 检索调度中心
职责：
- 对象存储
- 文本数据库
- 向量数据库
- 语音转写
- 摘要生成
- 分类标签
- 人物画像更新
- 对话调用
- 定时任务

### 3. 电脑端：网页中枢
定位：数据补充 + 中枢控制 + 结果查看。

职责：
- 控制台首页
- 资料库
- 摘要中心
- 人物画像中心
- 对话中心
- 导入中心
- 技能与路由配置

### 4. 记忆系统
层级：
- L0 原始证据层
- L1 片段摘要层
- L2 时间摘要层：日/周/月
- L3 人物画像层
- L4 对话上下文层

核心要求：
- 原始资料不能丢
- 摘要可追溯到原始记录
- 画像更新带证据来源
- 对话只动态调用相关上下文，不全量塞历史

### 5. 对话系统
回答流程：
1. 用户提问
2. 识别问题类型：闲聊 / 反思 / 决策 / 回忆 / 分析
3. 路由到对应 skill 或调用策略
4. 调用人物画像层
5. 调用近期摘要层
6. 检索相关历史内容
7. 必要时补充原始资料片段
8. 拼装 prompt
9. 生成回答
10. 判断是否写回记忆库

## New Window Names Based On PRD

建议把窗口从“页面/代码模块”升级为“产品系统模块”：

| 窗口名 | 负责范围 | V1 优先级 |
|--------|----------|-----------|
| 总控窗口 | 产品节奏、PRD 对齐、验收、合并、冲突处理 | 必开 |
| 手机采集窗口 | 手机端录音、文字记录、上传状态、极简设置 | 最高 |
| 云端管线窗口 | Supabase/Storage、Hub、转写、摘要、入库、处理状态 | 最高 |
| 记忆画像窗口 | 原始资料库、压缩记忆库、人物画像、证据链、向量检索接口 | 最高 |
| 对话路由窗口 | 聊天、上下文拼装、问题分类、skills/路由、写回候选 | 最高 |
| 电脑中枢窗口 | Dashboard、资料库、摘要中心、画像中心、导入中心、设置 | 中 |
| 体验视觉窗口 | 手机极简体验、蓝白渊元 UI、一致性、动效、导航 | 中 |
| 构建部署窗口 | Expo/EAS、Cloudflare Tunnel、环境变量、安全、手机真机访问 | 中 |

## Round Plan

### Round 1: V1 Backbone
先开 4 个子窗口：

1. `手机采集窗口`
   - 目标：手机端能完成文字/录音记录，并产生可上传/可入库的数据。

2. `云端管线窗口`
   - 目标：上传、存储、AI Hub、模型调用、处理状态链路稳定。

3. `记忆画像窗口`
   - 目标：定义 V1 数据结构，支持原始资料、摘要、画像候选、证据链。

4. `对话路由窗口`
   - 目标：聊天不再是普通 bot，而是预留画像 + 近期摘要 + 检索片段三段式上下文。

总控窗口验收标准：
- 一条手机记录能进入 mock/cloud service。
- 能生成或模拟转写/摘要。
- 能在记忆库看到记录。
- 能在对话里引用该记录或摘要。
- `npm run typecheck` 通过。

### Round 2: Computer Hub + Management
再开 2 个子窗口：

5. `电脑中枢窗口`
   - 目标：电脑端 Dashboard、资料库、摘要中心、画像中心、导入中心能跑通 mock 交互。

6. `体验视觉窗口`
   - 目标：把手机端和电脑端视觉统一到渊元风格，但不牺牲功能。

总控窗口验收标准：
- 电脑端能查看资料、摘要、画像、导入任务。
- 手机端仍保持极简。
- 页面导航一致，重要按钮不死。

### Round 3: Device + Deployment
最后开：

7. `构建部署窗口`
   - 目标：手机真机预览、电脑 Hub 联网、Cloudflare Tunnel、EAS build 文档。

总控窗口验收标准：
- 手机能访问电脑中枢或云端 Hub。
- `.env.example` 完整。
- 不泄露 API key。
- Android preview build 路径明确。

## Child Window Prompts

### 手机采集窗口
```text
请进入 C:\codex-clean-test\personal-agent-mvp。
先读取 AGENTS.md、task_plan.md、findings.md、progress.md、docs/prd_based_thread_plan.md。
你负责【手机采集窗口】。

目标来自 PRD：手机端是极简采集入口，优先录音和文字记录。
只做：
1. 一键录音 / 停止录音；
2. 文字记录；
3. 上传/处理状态；
4. 极简设置；
5. 数据进入 mock store 或 service，为云端管线预留接口。

不要做电脑端页面，不要做复杂画像系统，不要改 .env，不要泄露 API key。
完成后运行 npm run typecheck，并汇报修改文件和风险。
```

### 云端管线窗口
```text
请进入 C:\codex-clean-test\personal-agent-mvp。
先读取 AGENTS.md、task_plan.md、findings.md、progress.md、docs/prd_based_thread_plan.md。
你负责【云端管线窗口】。

目标来自 PRD：云端是统一存储 + AI 处理 + 检索调度中心。
只做：
1. Supabase/Storage service 抽象；
2. 本地 Hub / rapi 模型链路；
3. 上传后处理状态：待上传、上传中、已上传、分析中、已完成、失败；
4. 转写/摘要/分类的接口占位或 mock；
5. 手机真机访问 Hub 的配置方案。

不要改 UI 页面，不要改 .env，不要泄露 API key。
完成后运行 npm run typecheck，并汇报修改文件和风险。
```

### 记忆画像窗口
```text
请进入 C:\codex-clean-test\personal-agent-mvp。
先读取 AGENTS.md、task_plan.md、findings.md、progress.md、docs/prd_based_thread_plan.md。
你负责【记忆画像窗口】。

目标来自 PRD：建立双层记忆和持续画像的数据结构。
只做：
1. L0 原始资料层类型；
2. L1/L2 摘要层类型；
3. L3 人物画像层类型；
4. 画像更新候选、证据链、是否入画像字段；
5. mock service / store，让页面后续可调用。

不要做复杂真实向量库，不要做 UI 大改，不要改 .env。
完成后运行 npm run typecheck，并汇报修改文件和风险。
```

### 对话路由窗口
```text
请进入 C:\codex-clean-test\personal-agent-mvp。
先读取 AGENTS.md、task_plan.md、findings.md、progress.md、docs/prd_based_thread_plan.md。
你负责【对话路由窗口】。

目标来自 PRD：对话不是普通 bot，要预留三段式上下文和 skill 路由。
只做：
1. 问题类型识别：闲聊、反思、决策、回忆、分析；
2. 三段式上下文接口：画像层、近期记忆层、即时检索层；
3. 对话写回候选机制；
4. 聊天页调用这些接口；
5. 语音对话入口保持可用。

不要改云端管线底层，不要改 .env，不要泄露 API key。
完成后运行 npm run typecheck，并汇报修改文件和风险。
```

### 电脑中枢窗口
```text
请进入 C:\codex-clean-test\personal-agent-mvp。
先读取 AGENTS.md、task_plan.md、findings.md、progress.md、docs/prd_based_thread_plan.md。
你负责【电脑中枢窗口】。

目标来自 PRD：电脑端是网页中枢，承担管理、导入、查看分析结果。
只做电脑端：
1. Dashboard；
2. 资料库；
3. 摘要中心；
4. 人物画像中心；
5. 对话中心；
6. 导入中心；
7. 设置。

所有按钮必须有 mock 交互，不做静态页。
不要破坏手机端，不要改 .env。
完成后运行 npm run typecheck，并汇报修改文件和风险。
```

### 体验视觉窗口
```text
请进入 C:\codex-clean-test\personal-agent-mvp。
先读取 AGENTS.md、task_plan.md、findings.md、progress.md、docs/prd_based_thread_plan.md。
你负责【体验视觉窗口】。

目标来自 PRD：手机端极简、低操作成本；整体视觉保持渊元蓝白玻璃风。
只做：
1. 全局 theme；
2. 底部导航；
3. 页面宽度和安全区；
4. 字体层级；
5. 动态素材位；
6. 手机端交互路径压缩。

不要改服务层，不要改 .env，不要新增 PRD 之外的复杂模块。
完成后运行 npm run typecheck，并汇报修改文件和风险。
```

### 构建部署窗口
```text
请进入 C:\codex-clean-test\personal-agent-mvp。
先读取 AGENTS.md、task_plan.md、findings.md、progress.md、docs/prd_based_thread_plan.md。
你负责【构建部署窗口】。

目标来自 PRD：手机端、电脑端、云端协同。
只做：
1. Expo Go 预览说明；
2. Android APK / EAS build 说明；
3. 手机访问电脑 Hub 的局域网 IP 方案；
4. Cloudflare Tunnel 方案；
5. .env.example 完善；
6. 安全注意事项。

不要改业务页面，不要改 .env，不要泄露 API key。
完成后运行 npm run typecheck，并汇报修改文件和风险。
```

## Master Window Acceptance Gate
总控窗口每轮验收必须确认：
- 是否仍符合 PRD 当前阶段：优先手机记录 + 云端存储 + API 连接。
- 是否没有提前过度开发 V2/V3。
- 是否保持“录音 -> 转写 -> 摘要 -> 入库 -> 画像 -> 聊天”的 V1 主线。
- 是否能运行。
- 是否没有泄露 `.env`。
