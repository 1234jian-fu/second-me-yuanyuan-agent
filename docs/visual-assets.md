# Visual Asset Registry

视觉素材统一从 `assets/visualAssets.ts` 注册，再通过 `components/VisualAsset.tsx` 渲染。

当前阶段的占位类型：

- `kind: "momo"`: 使用 RN 组件绘制 Momo，占位未来 3D Momo PNG/SVG。
- `kind: "emoji"`: 使用 emoji 占位拟物图标和小装饰。
- `kind: "material"`: 使用 Material Icons 占位通用功能图标。

后续替换方式：

1. 把 PNG/SVG 放到 `assets/images` 或对应资源目录。
2. 优先使用 `assets/icons` 和 `assets/mascot`，文件名按 `assets/assetSlots.ts` 的 `slotPath`。
3. 在 `assets/visualAssets.ts` 的对应资源 ID 上补充 `image.source`，例如：

```ts
image: {
  source: require("./icons/feature-text-record.png"),
  slotPath: "assets/icons/feature-text-record.png",
  alt: "文字记录拟物图标",
}
```

3. 页面无需改动，`VisualAsset` 会优先渲染图片资源。

命名约定：

- `momo.avatar.*`: 小头像资源。
- `momo.hero.*`: 页面主视觉 Momo。
- `feature.*`: 首页功能入口拟物图标。
- `mood.*`: 心情选择图标。
- `brief.*`: 首页今日简报图标。
- `profile.*`: 我的页面资源。
- `decor.*`: 通用装饰资源。
- `chat.*`: 对话相关头像/图标。
