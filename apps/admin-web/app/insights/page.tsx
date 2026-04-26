"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { useCurrentInsightDataset, useDeskStore } from "@/store/useDeskStore";

export default function InsightsPage() {
  const dataset = useCurrentInsightDataset();
  const insightRange = useDeskStore((state) => state.insightRange);
  const selectedInsightId = useDeskStore((state) => state.selectedInsightId);
  const selectedMilestoneId = useDeskStore((state) => state.selectedMilestoneId);
  const selectedMetric = useDeskStore((state) => state.selectedMetric);
  const setInsightRange = useDeskStore((state) => state.setInsightRange);
  const selectInsightCard = useDeskStore((state) => state.selectInsightCard);
  const selectMilestone = useDeskStore((state) => state.selectMilestone);
  const setSelectedMetric = useDeskStore((state) => state.setSelectedMetric);
  const [detail, setDetail] = useState<string | null>(null);

  const metrics = useMemo(
    () => [
      { key: "records", label: "记录总量", value: dataset.recordTrend.reduce((sum, item) => sum + item.recordCount, 0), detail: "当前范围内的记录总量趋势。" },
      { key: "mood", label: "平均心情分", value: Math.round(dataset.recordTrend.reduce((sum, item) => sum + item.moodScore, 0) / dataset.recordTrend.length), detail: "心情分越高代表状态越稳定。" },
      { key: "theme", label: "最高频主题", value: dataset.themes[0]?.theme ?? "-", detail: "当前最稳定出现的主题。" },
      { key: "persona", label: "画像变化", value: dataset.milestones.length, detail: "当前范围内的重要画像节点数。" },
    ],
    [dataset],
  );

  const selectedInsight = dataset.cards.find((item) => item.id === selectedInsightId) ?? dataset.cards[0];
  const selectedMilestone = dataset.milestones.find((item) => item.id === selectedMilestoneId) ?? dataset.milestones[0];
  const maxRecord = Math.max(...dataset.recordTrend.map((item) => item.recordCount), 1);
  const maxTheme = Math.max(...dataset.themes.map((item) => item.value), 1);

  return (
    <div className="page">
      <TopBar title="成长回顾" subtitle="查看记录频率、心情变化、高频主题和画像更新趋势。" />

      <div className="filters">
        {[
          { key: "7d", label: "最近 7 天" },
          { key: "30d", label: "最近 30 天" },
          { key: "90d", label: "最近 90 天" },
        ].map((option) => (
          <button
            key={option.key}
            className={`chip${insightRange === option.key ? " active" : ""}`}
            onClick={() => setInsightRange(option.key as typeof insightRange)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
        {metrics.map((item) => (
          <button
            key={item.key}
            className="surface section-card"
            style={{ textAlign: "left", cursor: "pointer", background: selectedMetric === item.key ? "var(--surface-soft)" : undefined }}
            onClick={() => {
              setSelectedMetric(item.key);
              setDetail(item.detail);
            }}
          >
            <div className="tiny text-soft">{item.label}</div>
            <div className="metric-value" style={{ marginTop: 10 }}>{item.value}</div>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
        <section className="surface section-card">
          <h3 className="section-title">最近 30 天心情与记录频率趋势图</h3>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${dataset.recordTrend.length}, minmax(0, 1fr))`, gap: 10, alignItems: "end", minHeight: 220 }}>
            {dataset.recordTrend.map((point) => (
              <button
                key={point.label}
                onClick={() => setDetail(`${point.label}：记录 ${point.recordCount}，心情分 ${point.moodScore}`)}
                style={{ border: 0, background: "transparent", cursor: "pointer" }}
              >
                <div style={{ display: "flex", gap: 6, alignItems: "end", height: 180 }}>
                  <div style={{ width: "50%", borderRadius: 999, height: `${(point.recordCount / maxRecord) * 100}%`, background: "linear-gradient(180deg, var(--primary), #f0c78e)" }} />
                  <div style={{ width: "50%", borderRadius: 999, height: `${point.moodScore}%`, background: "var(--surface-blue)" }} />
                </div>
                <div className="tiny text-faint" style={{ marginTop: 10 }}>{point.label}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="surface section-card">
          <h3 className="section-title">高频主题分布</h3>
          <div className="stack">
            {dataset.themes.map((theme) => (
              <button
                key={theme.theme}
                className="list-item"
                style={{ cursor: "pointer", border: 0, background: "transparent", textAlign: "left" }}
                onClick={() => setDetail(`${theme.theme} 占比 ${theme.value}%`)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{theme.theme}</div>
                  <div style={{ height: 8, borderRadius: 999, background: "var(--surface-soft)", marginTop: 10 }}>
                    <div style={{ width: `${(theme.value / maxTheme) * 100}%`, height: "100%", borderRadius: 999, background: "var(--primary)" }} />
                  </div>
                </div>
                <span className="badge">{theme.value}%</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="split">
        <section className="surface section-card">
          <h3 className="section-title">洞察卡片</h3>
          <div className="stack">
            {dataset.cards.map((card) => (
              <button
                key={card.id}
                className="surface section-card"
                onClick={() => selectInsightCard(card.id)}
                style={{ textAlign: "left", cursor: "pointer", background: card.id === selectedInsight?.id ? "var(--surface-soft)" : undefined }}
              >
                <div style={{ fontWeight: 700 }}>{card.title}</div>
                <div className="text-soft" style={{ marginTop: 10 }}>{card.summary}</div>
              </button>
            ))}
          </div>
        </section>
        <aside className="surface section-card">
          <h3 className="section-title">洞察详情</h3>
          {selectedInsight ? (
            <div className="empty-note">
              <strong>{selectedInsight.title}</strong>
              <div style={{ marginTop: 10 }}>{selectedInsight.detail}</div>
            </div>
          ) : (
            <div className="empty-note">请选择一张洞察卡。</div>
          )}
        </aside>
      </div>

      <div className="split">
        <section className="surface section-card">
          <h3 className="section-title">重要节点时间线</h3>
          <div className="stack">
            {dataset.milestones.map((item) => (
              <button
                key={item.id}
                className="list-item"
                style={{ cursor: "pointer", border: 0, background: "transparent", textAlign: "left" }}
                onClick={() => selectMilestone(item.id)}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{item.title}</div>
                  <div className="tiny text-soft" style={{ marginTop: 4 }}>{item.detail}</div>
                </div>
                <span className="badge">{item.createdAt}</span>
              </button>
            ))}
          </div>
        </section>
        <aside className="surface section-card">
          <h3 className="section-title">节点详情</h3>
          {selectedMilestone ? (
            <div className="empty-note">
              <strong>{selectedMilestone.title}</strong>
              <div style={{ marginTop: 10 }}>{selectedMilestone.detail}</div>
            </div>
          ) : null}
          {detail ? (
            <div className="empty-note" style={{ marginTop: 12 }}>
              <strong>交互反馈</strong>
              <div style={{ marginTop: 10 }}>{detail}</div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
