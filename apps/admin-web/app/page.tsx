"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MetricCard } from "@/components/ui/MetricCard";
import { Modal } from "@/components/ui/Modal";
import { SearchBar } from "@/components/ui/SearchBar";
import { TopBar } from "@/components/ui/TopBar";
import { useDashboardStats, useDeskStore } from "@/store/useDeskStore";

const quickActions = [
  { key: "chat", label: "进入 AI 对话", route: "/chat" },
  { key: "import", label: "导入聊天记录", route: "/import" },
  { key: "summary", label: "查看摘要中心", route: "/summary" },
  { key: "analysis", label: "做一次现状分析", route: "/chat?prompt=分析一下我的现状" },
] as const;

export default function DashboardPage() {
  const router = useRouter();
  const stats = useDashboardStats();
  const dashboardQuery = useDeskStore((state) => state.dashboardQuery);
  const setDashboardQuery = useDeskStore((state) => state.setDashboardQuery);
  const toggleNotifications = useDeskStore((state) => state.toggleNotifications);
  const pushToast = useDeskStore((state) => state.pushToast);
  const libraryItems = useDeskStore((state) => state.libraryItems);
  const summaryItems = useDeskStore((state) => state.summaryItems);
  const importTasks = useDeskStore((state) => state.importTasks);
  const personaModules = useDeskStore((state) => state.personaModules);
  const selectLibraryItem = useDeskStore((state) => state.selectLibraryItem);
  const selectImportTask = useDeskStore((state) => state.selectImportTask);
  const [selectedRecordId, setSelectedRecordId] = useState(libraryItems[0]?.id ?? "");
  const [selectedImportId, setSelectedImportId] = useState(importTasks[0]?.id ?? "");
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [suggestionDetail, setSuggestionDetail] = useState<string | null>(null);

  const query = dashboardQuery.trim().toLowerCase();

  const visibleRecords = useMemo(
    () =>
      libraryItems
        .filter((item) =>
          [item.title, item.summary, item.tags.join(" "), item.source].join(" ").toLowerCase().includes(query),
        )
        .slice(0, 5),
    [libraryItems, query],
  );

  const visibleImports = useMemo(
    () => importTasks.filter((item) => item.fileName.toLowerCase().includes(query)).slice(0, 3),
    [importTasks, query],
  );

  const suggestions = useMemo(
    () => [
      {
        id: "s1",
        title: "把‘做重焦虑’拆成可执行问题",
        detail: summaryItems[0]?.abstract ?? "建议从最近摘要里定位最具体的问题。",
        action: () => router.push("/summary"),
      },
      {
        id: "s2",
        title: "查看最新画像变化",
        detail: `${personaModules[0]?.title ?? "画像模块"} 最近有新的来源依据。`,
        action: () => router.push("/persona"),
      },
      {
        id: "s3",
        title: "进入对话做一次现状分析",
        detail: "把当前状态和最近记录一起交给数字分身分析。",
        action: () => router.push("/chat?prompt=分析一下现状"),
      },
    ].filter((item) => item.title.toLowerCase().includes(query) || item.detail.toLowerCase().includes(query)),
    [personaModules, query, router, summaryItems],
  );

  const selectedRecord = libraryItems.find((item) => item.id === selectedRecordId) ?? visibleRecords[0];
  const selectedImport = importTasks.find((item) => item.id === selectedImportId) ?? visibleImports[0];

  return (
    <div className="page">
      <TopBar
        title="你好，Cendy"
        subtitle="今天也在慢慢变得更清晰"
        actions={
          <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 440 }}>
            <div style={{ flex: 1 }}>
              <SearchBar
                value={dashboardQuery}
                placeholder="搜索记录、摘要、画像或导入内容"
                onChange={setDashboardQuery}
                onSubmit={() => pushToast(`已按“${dashboardQuery || "全部"}”过滤首页内容`, "success")}
              />
            </div>
            <button className="icon-btn" onClick={() => toggleNotifications(true)} aria-label="通知">
              ⌁
            </button>
            <button className="icon-btn" onClick={() => router.push("/settings")} aria-label="用户设置">
              C
            </button>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
        <MetricCard label="今日新增记录" value={stats.todayCount} hint="点击查看今天的资料" onClick={() => router.push("/library?time=today")} />
        <MetricCard label="本周累计" value={stats.weekCount} hint="点击查看本周资料" onClick={() => router.push("/library?time=week")} />
        <MetricCard label="最近摘要" value={stats.summaryCount} hint="跳到摘要中心" onClick={() => router.push("/summary")} />
        <MetricCard label="画像更新" value={stats.personaUpdated} hint="跳到人物画像" onClick={() => router.push("/persona")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 0.9fr 0.9fr", gap: 16 }}>
        <section className="surface section-card">
          <div className="section-row">
            <h3 className="section-title" style={{ marginBottom: 0 }}>
              最近记录时间线
            </h3>
            <button className="btn btn-ghost" onClick={() => router.push("/library")}>
              查看全部
            </button>
          </div>
          <div className="stack">
            {visibleRecords.map((item) => (
              <button
                key={item.id}
                className="list-item"
                onClick={() => {
                  setSelectedRecordId(item.id);
                  selectLibraryItem(item.id);
                }}
                style={{ cursor: "pointer", background: "transparent", border: 0, textAlign: "left" }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{item.title}</div>
                  <div className="tiny text-soft" style={{ marginTop: 4 }}>
                    {item.summary}
                  </div>
                </div>
                <span className="badge">{item.type}</span>
              </button>
            ))}
          </div>
          {selectedRecord ? (
            <div className="empty-note" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700 }}>{selectedRecord.title}</div>
              <div className="tiny text-soft" style={{ marginTop: 8, lineHeight: 1.7 }}>
                {selectedRecord.rawText}
              </div>
            </div>
          ) : null}
        </section>

        <section className="surface section-card">
          <h3 className="section-title">Second Me 状态</h3>
          <div className="stack">
            <div className="badge primary-badge">最近理解到：结构先行比堆功能更有效</div>
            <div className="text-soft" style={{ lineHeight: 1.7 }}>
              系统最近把“决策风格”“高压状态表现”两个模块的置信度继续提升了。
            </div>
            <div className="empty-note">
              最近一次画像更新：{personaModules[0]?.updatedAt}
              <br />
              当前主要关注主题：{personaModules[2]?.summary}
            </div>
            <button className="btn btn-secondary" onClick={() => router.push("/persona")}>
              查看人物画像
            </button>
            <button className="btn btn-primary" onClick={() => setTrainingOpen(true)}>
              继续训练理解
            </button>
          </div>
        </section>

        <section className="surface section-card">
          <h3 className="section-title">快捷入口</h3>
          <div className="stack">
            {quickActions.map((item) => (
              <button key={item.key} className="btn btn-secondary" style={{ justifyContent: "space-between" }} onClick={() => router.push(item.route)}>
                <span>{item.label}</span>
                <span>↗</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <section className="surface section-card">
          <div className="section-row">
            <h3 className="section-title" style={{ marginBottom: 0 }}>
              最近导入内容
            </h3>
            <button className="btn btn-ghost" onClick={() => router.push("/import")}>
              查看全部
            </button>
          </div>
          <div className="stack">
            {visibleImports.map((task) => (
              <button
                key={task.id}
                className="list-item"
                onClick={() => {
                  setSelectedImportId(task.id);
                  selectImportTask(task.id);
                  router.push(`/import?task=${task.id}`);
                }}
                style={{ cursor: "pointer", background: "transparent", border: 0, textAlign: "left" }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{task.fileName}</div>
                  <div className="tiny text-soft" style={{ marginTop: 4 }}>
                    {task.detail}
                  </div>
                </div>
                <span className={`badge${task.status === "done" ? " primary-badge" : ""}`}>{task.status}</span>
              </button>
            ))}
          </div>
          {selectedImport ? (
            <div className="empty-note" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700 }}>{selectedImport.fileName}</div>
              <div className="tiny text-soft" style={{ marginTop: 8 }}>当前进度：{selectedImport.progress}%</div>
            </div>
          ) : null}
        </section>

        <section className="surface section-card">
          <h3 className="section-title">今日建议</h3>
          <div className="stack">
            {suggestions.map((item) => (
              <button
                key={item.id}
                className="list-item"
                onClick={() => {
                  setSuggestionDetail(item.detail);
                  item.action();
                }}
                style={{ cursor: "pointer", background: "transparent", border: 0, textAlign: "left" }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{item.title}</div>
                  <div className="tiny text-soft" style={{ marginTop: 4 }}>
                    {item.detail}
                  </div>
                </div>
                <span>↗</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <Modal
        open={trainingOpen}
        title="继续训练理解"
        onClose={() => setTrainingOpen(false)}
        footer={
          <div className="section-row">
            <div className="text-soft tiny">这里后续可以接真实训练队列和中枢任务调度。</div>
            <button
              className="btn btn-primary"
              onClick={() => {
                pushToast("已发起一次 mock 训练任务", "success");
                setTrainingOpen(false);
              }}
            >
              立即开始
            </button>
          </div>
        }
      >
        <div className="text-soft" style={{ lineHeight: 1.7 }}>
          当前会模拟执行一次“重新整理近期记录、更新摘要和画像置信度”的训练过程。
        </div>
      </Modal>

      <Modal open={Boolean(suggestionDetail)} title="建议详情" onClose={() => setSuggestionDetail(null)}>
        <div className="text-soft" style={{ lineHeight: 1.7 }}>
          {suggestionDetail}
        </div>
      </Modal>
    </div>
  );
}
