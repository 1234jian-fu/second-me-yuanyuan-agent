"use client";

import { useMemo, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { TopBar } from "@/components/ui/TopBar";
import { useDeskStore } from "@/store/useDeskStore";

export default function PersonaPage() {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const modules = useDeskStore((state) => state.personaModules);
  const timeline = useDeskStore((state) => state.personaTimeline);
  const summaryItems = useDeskStore((state) => state.summaryItems);
  const libraryItems = useDeskStore((state) => state.libraryItems);
  const selectedPersonaModuleId = useDeskStore((state) => state.selectedPersonaModuleId);
  const selectPersonaModule = useDeskStore((state) => state.selectPersonaModule);
  const exportPersona = useDeskStore((state) => state.exportPersona);
  const [detailOpen, setDetailOpen] = useState(false);
  const [timelineDetail, setTimelineDetail] = useState<string | null>(null);

  const selected = modules.find((item) => item.id === selectedPersonaModuleId) ?? modules[0];
  const sourceRecords = useMemo(
    () => libraryItems.filter((item) => selected?.sourceRecordIds.includes(item.id)),
    [libraryItems, selected],
  );
  const sourceSummaries = useMemo(
    () => summaryItems.filter((item) => selected?.sourceSummaryIds.includes(item.id)),
    [selected, summaryItems],
  );

  return (
    <div className="page">
      <TopBar
        title="人物画像"
        subtitle="查看长期理解到的画像模块、来源依据与变化时间线。"
        actions={
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => setDetailOpen(true)}>
              查看详细画像
            </button>
            <button className="btn btn-primary" onClick={exportPersona}>
              导出画像
            </button>
          </div>
        }
      />

      <section className="surface section-card surface-xl">
        <div className="section-row">
          <div>
            <div className="tiny text-soft">画像总览</div>
            <div className="page-title" style={{ fontSize: 28, marginTop: 8 }}>
              当前长期理解趋于稳定
            </div>
            <div className="page-subtitle" style={{ marginTop: 10 }}>
              最近系统更确认你是一个偏结构化、追求清晰与节奏稳定的人。
            </div>
          </div>
          <div className="badge primary-badge">已更新 {modules.filter((item) => item.updatedAt >= "2026-04-22").length} 个模块</div>
        </div>
      </section>

      <div className="split">
        <section className="surface section-card">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
            {modules.map((item) => (
              <div key={item.id} className="surface section-card" style={{ background: item.id === selected?.id ? "var(--surface-soft)" : undefined }}>
                <div className="section-row">
                  <div style={{ fontWeight: 700 }}>{item.title}</div>
                  <span className="badge">{item.confidence}%</span>
                </div>
                <div className="text-soft" style={{ marginTop: 12, lineHeight: 1.7 }}>
                  {item.summary}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button className="btn btn-secondary" onClick={() => selectPersonaModule(item.id)}>
                    查看模块
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      selectPersonaModule(item.id);
                      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    来源依据
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside ref={panelRef} className="surface section-card">
          {selected ? (
            <div className="stack">
              <div>
                <div className="tiny text-soft">来源依据</div>
                <h3 className="section-title" style={{ marginTop: 10 }}>
                  {selected.title}
                </h3>
              </div>
              <div className="empty-note">
                <strong>画像结论</strong>
                <div style={{ marginTop: 8 }}>{selected.summary}</div>
                <div style={{ marginTop: 8 }}>最后更新：{selected.updatedAt}</div>
              </div>
              <div>
                <div className="tiny text-soft">来源记录</div>
                <div className="stack" style={{ marginTop: 10 }}>
                  {sourceRecords.map((item) => (
                    <div key={item.id} className="empty-note">
                      <strong>{item.title}</strong>
                      <div style={{ marginTop: 8 }}>{item.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="tiny text-soft">来源摘要</div>
                <div className="stack" style={{ marginTop: 10 }}>
                  {sourceSummaries.map((item) => (
                    <div key={item.id} className="empty-note">
                      <strong>{item.title}</strong>
                      <div style={{ marginTop: 8 }}>{item.abstract}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      <section className="surface section-card">
        <h3 className="section-title">画像变化时间线</h3>
        <div className="stack">
          {timeline.map((item) => (
            <button
              key={item.id}
              className="list-item"
              style={{ cursor: "pointer", border: 0, background: "transparent", textAlign: "left" }}
              onClick={() => setTimelineDetail(`${item.createdAt} · ${item.detail}`)}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{item.title}</div>
                <div className="tiny text-soft" style={{ marginTop: 4 }}>
                  {item.detail}
                </div>
              </div>
              <span className="badge">{item.createdAt}</span>
            </button>
          ))}
        </div>
      </section>

      <Modal open={detailOpen} title="详细画像" onClose={() => setDetailOpen(false)}>
        {modules.map((item) => (
          <div key={item.id} className="empty-note">
            <strong>{item.title}</strong>
            <div style={{ marginTop: 8 }}>{item.summary}</div>
          </div>
        ))}
      </Modal>

      <Modal open={Boolean(timelineDetail)} title="变化详情" onClose={() => setTimelineDetail(null)}>
        <div className="text-soft">{timelineDetail}</div>
      </Modal>
    </div>
  );
}
