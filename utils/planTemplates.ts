export function createSimplePlanTitles(prompt: string) {
  const topic = prompt.trim() || "今天的目标";

  return [
    `先定义「${topic}」的完成标准`,
    "挑一个 15 分钟内能开始的小动作",
    "留出一段不被打断的专注时间",
    "睡前复盘一次，决定明天怎么调整",
  ];
}
