"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { TopBar } from "@/components/ui/TopBar";
import { useDeskStore } from "@/store/useDeskStore";

const quickPrompts = [
  "帮我梳理今天",
  "给我一个方案",
  "分析一下现状",
  "只想随便聊聊",
];

const modeOptions = [
  { key: "recent-memory", label: "近期记忆模式" },
  { key: "persona", label: "长期画像模式" },
  { key: "deep-retrieval", label: "深度检索模式" },
] as const;

function ChatPageContent() {
  const searchParams = useSearchParams();
  const chatSessions = useDeskStore((state) => state.chatSessions);
  const activeChatId = useDeskStore((state) => state.activeChatId);
  const chatMode = useDeskStore((state) => state.chatMode);
  const chatGroupCollapsed = useDeskStore((state) => state.chatGroupCollapsed);
  const setChatMode = useDeskStore((state) => state.setChatMode);
  const toggleChatGroup = useDeskStore((state) => state.toggleChatGroup);
  const setActiveChat = useDeskStore((state) => state.setActiveChat);
  const createNewChat = useDeskStore((state) => state.createNewChat);
  const sendChatMessage = useDeskStore((state) => state.sendChatMessage);
  const clearActiveChat = useDeskStore((state) => state.clearActiveChat);
  const exportActiveChat = useDeskStore((state) => state.exportActiveChat);
  const pushToast = useDeskStore((state) => state.pushToast);
  const [draft, setDraft] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedContext, setExpandedContext] = useState<string | null>(null);
  const [menuModal, setMenuModal] = useState<string | null>(null);
  const activeSession = chatSessions.find((session) => session.id === activeChatId) ?? chatSessions[0];
  const prompt = searchParams.get("prompt");

  useEffect(() => {
    if (prompt) {
      const id = createNewChat();
      setActiveChat(id);
      sendChatMessage(prompt);
      pushToast("已自动带入快捷分析 prompt", "success");
    }
    // only consume initial prompt
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = useMemo(
    () => ({
      today: chatSessions.filter((item) => item.group === "today"),
      recent: chatSessions.filter((item) => item.group === "recent"),
    }),
    [chatSessions],
  );

  const contextItems = activeSession?.contextReferences[chatMode] ?? [];

  function submitMessage(content: string) {
    if (!content.trim()) return;
    sendChatMessage(content.trim());
    setDraft("");
  }

  return (
    <div className="page">
      <TopBar
        title="AI 对话"
        subtitle="和数字分身对话，并查看它调用了哪些上下文。"
        actions={
          <div style={{ position: "relative" }}>
            <button className="btn btn-secondary" onClick={() => setMenuOpen((value) => !value)}>
              更多菜单
            </button>
            {menuOpen ? (
              <div className="surface section-card" style={{ position: "absolute", top: 52, right: 0, width: 220, zIndex: 10 }}>
                <div className="stack">
                  <button className="btn btn-ghost" onClick={() => { clearActiveChat(); setMenuOpen(false); }}>
                    清空当前对话
                  </button>
                  <button className="btn btn-ghost" onClick={() => { exportActiveChat(); setMenuOpen(false); }}>
                    导出对话
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      const next = chatMode === "recent-memory" ? "persona" : chatMode === "persona" ? "deep-retrieval" : "recent-memory";
                      setChatMode(next);
                      setMenuOpen(false);
                    }}
                  >
                    切换模式
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "260px minmax(0, 1fr) 320px", gap: 16 }}>
        <aside className="surface section-card">
          <div className="section-row">
            <h3 className="section-title" style={{ marginBottom: 0 }}>会话</h3>
            <button className="btn btn-primary" onClick={() => setActiveChat(createNewChat())}>
              新建对话
            </button>
          </div>
          <div className="stack">
            {(["today", "recent"] as const).map((group) => (
              <div key={group}>
                <button className="btn btn-ghost" onClick={() => toggleChatGroup(group)}>
                  {group === "today" ? "今天" : "最近"} {chatGroupCollapsed[group] ? "展开" : "收起"}
                </button>
                {!chatGroupCollapsed[group] ? (
                  <div className="stack">
                    {grouped[group].map((session) => (
                      <button
                        key={session.id}
                        className="list-item"
                        onClick={() => setActiveChat(session.id)}
                        style={{
                          cursor: "pointer",
                          border: 0,
                          textAlign: "left",
                          background: session.id === activeSession?.id ? "var(--surface-soft)" : "transparent",
                          borderRadius: 18,
                          padding: 12,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700 }}>{session.title}</div>
                          <div className="tiny text-soft" style={{ marginTop: 4 }}>
                            {session.updatedAt}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </aside>

        <section className="surface section-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="filters">
            {modeOptions.map((option) => (
              <button
                key={option.key}
                className={`chip${chatMode === option.key ? " active" : ""}`}
                onClick={() => setChatMode(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div style={{ maxHeight: 420, overflow: "auto" }} className="stack">
            {activeSession?.messages.length ? (
              activeSession.messages.map((message) => (
                <div
                  key={message.id}
                  className="surface section-card"
                  style={{
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    width: "min(82%, 100%)",
                    background: message.role === "user" ? "var(--primary-soft)" : "var(--surface)",
                  }}
                >
                  <div className="tiny text-faint">{message.createdAt}</div>
                  <div style={{ marginTop: 8, lineHeight: 1.7 }}>{message.content}</div>
                </div>
              ))
            ) : (
              <div className="empty-note">当前对话已清空，输入一句话重新开始。</div>
            )}
          </div>

          <div className="filters">
            {quickPrompts.map((promptItem) => (
              <button
                key={promptItem}
                className="chip"
                onClick={() => {
                  if (promptItem === "只想随便聊聊") {
                    setDraft(promptItem);
                  } else {
                    submitMessage(promptItem);
                  }
                }}
              >
                {promptItem}
              </button>
            ))}
          </div>

          <div className="surface section-card">
            <textarea
              value={draft}
              rows={4}
              placeholder="输入你现在最想说的一句"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submitMessage(draft);
                }
              }}
              style={{ width: "100%", border: 0, background: "transparent", resize: "vertical", outline: "none" }}
            />
            <div className="section-row" style={{ marginTop: 12 }}>
              <div className="tiny text-soft">回车发送，Shift + 回车换行</div>
              <button className="btn btn-primary" onClick={() => submitMessage(draft)}>
                发送消息
              </button>
            </div>
          </div>
        </section>

        <aside className="surface section-card">
          <h3 className="section-title">上下文调用</h3>
          <div className="stack">
            {contextItems.map((item) => (
              <button
                key={item.id}
                className="list-item"
                style={{ cursor: "pointer", border: 0, background: "transparent", textAlign: "left" }}
                onClick={() => setExpandedContext(expandedContext === item.id ? null : item.id)}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{item.title}</div>
                  <div className="tiny text-soft" style={{ marginTop: 4 }}>
                    {item.type}
                  </div>
                  {expandedContext === item.id ? (
                    <div className="tiny text-soft" style={{ marginTop: 10, lineHeight: 1.7 }}>
                      {item.detail}
                    </div>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <Modal open={Boolean(menuModal)} title="菜单动作" onClose={() => setMenuModal(null)}>
        <div>{menuModal}</div>
      </Modal>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="page">
          <div className="empty-note">正在加载对话中心...</div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
