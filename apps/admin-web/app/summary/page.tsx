"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { TopBar } from "@/components/ui/TopBar";
import { useDeskStore } from "@/store/useDeskStore";

const tabs = [
  { key: "day", label: "日摘要" },
  { key: "week", label: "周摘要" },
  { key: "month", label: "月摘要" },
  { key: "event", label: "事件摘要" },
  { key: "topic", label: "主题摘要" },
] as const;

export default function SummaryPage() {
  const activeSummaryTab = useDeskStore((state) => state.activeSummaryTab);
  const summaryItems = useDeskStore((state) => state.summaryItems);
  const selectedSummaryId = useDeskStore((state) => state.selectedSummaryId);
  const libraryItems = useDeskStore((state) => state.libraryItems);
  const personaModules = useDeskStore((state) => state.personaModules);
  const chatSessions = useDeskStore((state) => state.chatSessions);
  const setSummaryTab = useDeskStore((state) => state.setSummaryTab);
  const selectSummary = useDeskStore((state) => state.selectSummary);
  const generateNewSummary = useDeskStore((state) => state.generateNewSummary);
  const regenerateSummary = useDeskStore((state) => state.regenerateSummary);
  const [createOpen, setCreateOpen] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const visible = useMemo(
    () => summaryItems.filter((item) => item.type === activeSummaryTab),
    [activeSummaryTab, summaryItems],
  );

  useEffect(() => {
    if (!visible.find((item) => item.id === selectedSummaryId)) {
      selectSummary(visible[0]?.id ?? null);
    }
  }, [selectSummary, selectedSummaryId, visible]);

  const selected = visible.find((item) => item.id === selectedSummaryId) ?? visible[0];

  return (
    <div className="page">
      <TopBar
        title="摘要中心"
        subtitle="按周期、事件和主题浏览系统对你的理解。"
        actions={
          <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
            生成新摘要
          </button>
        }
      />

      <div className="filters">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`chip${activeSummaryTab === tab.key ? " active" : ""}`}
            onClick={() => setSummaryTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="split">
        <section className="surface section-card">
          <div className="stack">
            {visible.map((item) => (
              <div key={item.id} className="surface section-card" style={{ background: item.id === selected?.id ? "var(--surface-soft)" : undefined }}>
                <div className="section-row">
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div className="tiny text-faint" style={{ marginTop: 4 }}>
                      {item.generatedAt} · {item.modelVersion}
                    </div>
                  </div>
                  <span className="badge">{tabs.find((tab) => tab.key === item.type)?.label}</span>
                </div>
                <div className="text-soft" style={{ marginTop: 14, lineHeight: 1.7 }}>
                  {item.abstract}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button className="btn btn-secondary" onClick={() => selectSummary(item.id)}>
                    查看证据链
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setRegeneratingId(item.id);
                      setTimeout(() => {
                        regenerateSummary(item.id);
                        setRegeneratingId(null);
                      }, 900);
                    }}
                  >
                    {regeneratingId === item.id ? "重新生成中…" : "重新生成"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="surface section-card">
          {selected ? (
            <div className="stack">
              <div>
                <div className="tiny text-soft">证据链</div>
                <h3 className="section-title" style={{ marginTop: 10 }}>
                  {selected.title}
                </h3>
              </div>
              <div className="empty-note">
                <strong>生成时间</strong>
                <div style={{ marginTop: 8 }}>{selected.generatedAt}</div>
                <div style={{ marginTop: 8 }}>模型版本：{selected.modelVersion}</div>
              </div>
              <div>
                <div className="tiny text-soft">来源记录</div>
                <div className="stack" style={{ marginTop: 10 }}>
                  {libraryItems
                    .filter((item) => selected.evidenceRecordIds.includes(item.id))
                    .map((item) => (
                      <div key={item.id} className="empty-note">
                        <strong>{item.title}</strong>
                        <div style={{ marginTop: 8 }}>{item.summary}</div>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <div className="tiny text-soft">关联对话</div>
                <div className="stack" style={{ marginTop: 10 }}>
                  {chatSessions
                    .filter((item) => selected.relatedChatIds.includes(item.id))
                    .map((item) => (
                      <div key={item.id} className="empty-note">
                        <strong>{item.title}</strong>
                        <div style={{ marginTop: 8 }}>{item.messages[item.messages.length - 1]?.content}</div>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <div className="tiny text-soft">关联画像块</div>
                <div className="filters" style={{ marginTop: 10 }}>
                  {personaModules
                    .filter((item) => selected.relatedPersonaIds.includes(item.id))
                    .map((item) => (
                      <span key={item.id} className="badge primary-badge">
                        {item.title}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-note">当前 Tab 下暂无摘要。</div>
          )}
        </aside>
      </div>

      <Modal
        open={createOpen}
        title="生成新摘要"
        onClose={() => setCreateOpen(false)}
        footer={
          <div className="section-row">
            <div className="tiny text-soft">当前会基于现有 mock 资料生成新摘要。</div>
            <button
              className="btn btn-primary"
              onClick={() => {
                generateNewSummary();
                setCreateOpen(false);
              }}
            >
              开始生成
            </button>
          </div>
        }
      >
        <div className="text-soft">生成类型将使用当前已选中的摘要 Tab：{tabs.find((tab) => tab.key === activeSummaryTab)?.label}。</div>
      </Modal>
    </div>
  );
}
