function createSimplePlanTitles(prompt) {
  const topic = prompt.trim() || "今天的目标";

  return [
    `先定义「${topic}」的完成标准`,
    "挑一件 15 分钟内就能开始的小动作",
    "留出一段不被打断的专注时间",
    "睡前复盘一次，决定明天怎么调整",
  ];
}

export function createLocalChatReply(messages) {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  return `本地中枢已收到：「${lastUserMessage?.content ?? "你的输入"}」。接入真实模型后，这里会返回正式的 AI 回复。`;
}

export function createLocalPlans(prompt) {
  return createSimplePlanTitles(prompt).map((title) => ({ title }));
}
