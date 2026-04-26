# Voice TTS

本文件记录当前语音交互和本地 TTS 接入方案。

## Current Voice Flow

当前聊天页已经支持 Web 预览语音回合：

```text
浏览器语音识别 -> Hub / 大模型回复 -> 浏览器 speechSynthesis 播放 -> 继续聆听
```

这是为了先跑通体验，不依赖原生模块。

## sherpa-onnx Findings

已阅读参考项目：

```text
D:\Digital human\sherpa-onnx-reference
https://github.com/k2-fsa/sherpa-onnx
```

关键结论：

- sherpa-onnx 支持本地离线 TTS。
- Android 示例使用 `OfflineTts` 和 `AudioTrack` 直接流式播放。
- Node 示例使用 npm 包 `sherpa-onnx` 创建 `OfflineTts`，生成 wav 文件。
- Expo Go 不能直接加载 sherpa-onnx Android 原生库；真机原生离线 TTS 需要 development build / EAS native module。
- 当前项目最稳的第一阶段是把 sherpa-onnx 放在电脑 Hub 里运行，手机请求 Hub TTS，再播放返回音频。

## Recommended Integration Path

### Phase 1: Computer Hub TTS

适合当前项目，不破坏 Expo Go。

```text
App -> /v1/tts -> computer Hub -> sherpa-onnx Node addon -> wav/base64 or audio URL -> App playback
```

优点：

- 不需要 eject。
- 模型文件只放电脑本地。
- 手机端和 APK 不膨胀。
- 可复用 Cloudflare Tunnel / LAN Hub。

### Phase 2: Native Android Offline TTS

适合后续正式 APK。

```text
Expo development build -> Android native module -> sherpa-onnx OfflineTts -> AudioTrack playback
```

需要：

- EAS development / preview build。
- Android native module 或 config plugin。
- 把模型资产放到 Android assets 或下载到 app private storage。

## Model Asset Rules

不要把 TTS 模型提交到 GitHub。当前 `.gitignore` 已忽略：

```text
models/
*.onnx
*.ort
*.bin
*.far
*.fst
```

请把你准备的 TTS 模型放到：

```text
models/<model-name>/
```

例如 Matcha 中文模型：

```text
models/matcha-icefall-zh-baker/
  model-steps-3.onnx
  lexicon.txt
  tokens.txt
  phone.fst
  date.fst
  number.fst

models/vocos-22khz-univ.onnx
```

对应 `.env`：

```text
TTS_PROVIDER=sherpa-onnx
SHERPA_ONNX_TTS_ENGINE=matcha
SHERPA_ONNX_TTS_MODEL_DIR=./models/matcha-icefall-zh-baker
SHERPA_ONNX_TTS_ACOUSTIC_MODEL=model-steps-3.onnx
SHERPA_ONNX_TTS_VOCODER=./models/vocos-22khz-univ.onnx
SHERPA_ONNX_TTS_LEXICON=lexicon.txt
SHERPA_ONNX_TTS_TOKENS=tokens.txt
SHERPA_ONNX_TTS_RULE_FSTS=phone.fst,date.fst,number.fst
SHERPA_ONNX_TTS_VOICE_ID=0
SHERPA_ONNX_TTS_SPEED=1.0
SHERPA_ONNX_TTS_SILENCE_SCALE=0.2
```

Kokoro 多语言模型通常还需要：

```text
SHERPA_ONNX_TTS_ENGINE=kokoro
SHERPA_ONNX_TTS_MODEL=model.onnx
SHERPA_ONNX_TTS_VOICES=voices.bin
SHERPA_ONNX_TTS_DATA_DIR=espeak-ng-data
SHERPA_ONNX_TTS_LEXICON=lexicon-us-en.txt,lexicon-zh.txt
```

## Next Implementation Step

等模型文件确认后，实现：

- `server/hub/tts.mjs`
- `POST /v1/tts`
- App 端 `voiceService.speak(text)`
- Web fallback 继续保留 `speechSynthesis`

验收标准：

- `GET /v1/status` 能显示 `tts.provider=sherpa-onnx`
- `POST /v1/tts` 输入一句中文能返回可播放音频
- 聊天语音播放优先用 Hub TTS，失败再回退浏览器 TTS
