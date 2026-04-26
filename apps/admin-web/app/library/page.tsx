"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { SearchBar } from "@/components/ui/SearchBar";
import { TopBar } from "@/components/ui/TopBar";
import { useDeskStore, useVisibleLibraryItems } from "@/store/useDeskStore";

const typeOptions = [
  { key: "all", label: "全部" },
  { key: "text", label: "文字" },
  { key: "audio", label: "录音" },
  { key: "chat", label: "聊天记录" },
  { key: "image", label: "图片" },
  { key: "video", label: "视频" },
] as const;

const timeOptions = [
  { key: "today", label: "今日" },
  { key: "week", label: "本周" },
  { key: "month", label: "本月" },
  { key: "custom", label: "自定义" },
] as const;

const sourceOptions = [
  { key: "all", label: "全部来源" },
  { key: "mobile", label: "手机" },
  { key: "web", label: "网页" },
  { key: "import", label: "导入" },
] as const;

const sortOptions = [
  { key: "latest", label: "最新优先" },
  { key: "importance", label: "重要性" },
  { key: "persona", label: "已入画像" },
] as const;

function LibraryPageContent() {
  const searchParams = useSearchParams();
  const items = useVisibleLibraryItems();
  const allItems = useDeskStore((state) => state.libraryItems);
  const libraryQuery = useDeskStore((state) => state.libraryQuery);
  const libraryType = useDeskStore((state) => state.libraryType);
  const libraryTime = useDeskStore((state) => state.libraryTime);
  const librarySource = useDeskStore((state) => state.librarySource);
  const librarySort = useDeskStore((state) => state.librarySort);
  const selectedLibraryId = useDeskStore((state) => state.selectedLibraryId);
  const setLibraryQuery = useDeskStore((state) => state.setLibraryQuery);
  const setLibraryType = useDeskStore((state) => state.setLibraryType);
  const setLibraryTime = useDeskStore((state) => state.setLibraryTime);
  const setLibrarySource = useDeskStore((state) => state.setLibrarySource);
  const setLibrarySort = useDeskStore((state) => state.setLibrarySort);
  const selectLibraryItem = useDeskStore((state) => state.selectLibraryItem);
  const toggleLibraryImportant = useDeskStore((state) => state.toggleLibraryImportant);
  const updateLibraryTags = useDeskStore((state) => state.updateLibraryTags);
  const deleteLibraryItem = useDeskStore((state) => state.deleteLibraryItem);
  const pushToast = useDeskStore((state) => state.pushToast);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [relatedOpen, setRelatedOpen] = useState(false);
  const [tagDraft, setTagDraft] = useState("");

  useEffect(() => {
    const time = searchParams.get("time");
    const focus = searchParams.get("focus");
    if (time === "today" || time === "week" || time === "month") {
      setLibraryTime(time);
    }
    if (focus) {
      selectLibraryItem(focus);
    }
  }, [searchParams, selectLibraryItem, setLibraryTime]);

  useEffect(() => {
    if (!items.find((item) => item.id === selectedLibraryId)) {
      selectLibraryItem(items[0]?.id ?? null);
    }
  }, [items, selectedLibraryId, selectLibraryItem]);

  const selected = items.find((item) => item.id === selectedLibraryId) ?? items[0];
  const relatedItems = useMemo(
    () => allItems.filter((item) => selected?.relatedMemoryIds.includes(item.id)),
    [allItems, selected],
  );

  useEffect(() => {
    if (selected) {
      setTagDraft(selected.tags.join(", "));
    }
  }, [selected]);

  return (
    <div className="page">
      <TopBar title="资料库" subtitle="浏览长期原始资料，筛选、搜索、查看详情。" />

      <section className="surface section-card stack">
        <SearchBar value={libraryQuery} placeholder="搜索标题、内容、标签、情绪" onChange={setLibraryQuery} />
        <div className="filters">
          {typeOptions.map((option) => (
            <button
              key={option.key}
              className={`chip${libraryType === option.key ? " active" : ""}`}
              onClick={() => setLibraryType(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="filters">
          <button className={`chip${libraryTime === "all" ? " active" : ""}`} onClick={() => setLibraryTime("all")}>
            全部时间
          </button>
          {timeOptions.map((option) => (
            <button
              key={option.key}
              className={`chip${libraryTime === option.key ? " active" : ""}`}
              onClick={() => setLibraryTime(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="filters">
          {sourceOptions.map((option) => (
            <button
              key={option.key}
              className={`chip${librarySource === option.key ? " active" : ""}`}
              onClick={() => setLibrarySource(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="filters">
          {sortOptions.map((option) => (
            <button
              key={option.key}
              className={`chip${librarySort === option.key ? " active" : ""}`}
              onClick={() => setLibrarySort(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <div className="split">
        <section className="surface section-card">
          <div className="section-row">
            <h3 className="section-title" style={{ marginBottom: 0 }}>
              资料列表
            </h3>
            <span className="badge">{items.length} 条结果</span>
          </div>

          {items.length === 0 ? (
            <div className="empty-note">当前筛选条件下没有资料，试试切换时间或来源。</div>
          ) : (
            <div className="stack">
              {items.map((item) => (
                <button
                  key={item.id}
                  className="list-item"
                  style={{
                    cursor: "pointer",
                    border: 0,
                    textAlign: "left",
                    background: item.id === selected?.id ? "rgba(232, 225, 255, 0.42)" : "transparent",
                    borderRadius: 18,
                    padding: 16,
                  }}
                  onClick={() => selectLibraryItem(item.id)}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div className="tiny text-soft" style={{ marginTop: 4 }}>
                      {item.summary}
                    </div>
                    <div className="tiny text-faint" style={{ marginTop: 6 }}>
                      {item.source} · {item.createdAt.slice(0, 10)}
                    </div>
                  </div>
                  <div className="stack" style={{ gap: 8, alignItems: "flex-end" }}>
                    <span className="badge">{item.type}</span>
                    {item.important ? <span className="badge primary-badge">重要</span> : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="surface section-card">
          {selected ? (
            <div className="stack">
              <div>
                <div className="tiny text-soft">详情预览</div>
                <h3 className="section-title" style={{ marginTop: 10 }}>
                  {selected.title}
                </h3>
              </div>
              <div className="stack" style={{ gap: 10 }}>
                <div className="badge">{selected.type}</div>
                <div className="text-soft" style={{ lineHeight: 1.7 }}>
                  {selected.rawText}
                </div>
                <div className="empty-note">
                  <strong>摘要</strong>
                  <div style={{ marginTop: 8 }}>{selected.summary}</div>
                </div>
                <div>
                  <div className="tiny text-soft">标签</div>
                  <div className="filters" style={{ marginTop: 8 }}>
                    {selected.tags.map((tag) => (
                      <span className="badge" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="tiny text-soft">情绪倾向：{selected.emotion}</div>
                <div className="tiny text-soft">是否已入画像：{selected.inPersona ? "是" : "否"}</div>
              </div>
              <div className="stack">
                <button className="btn btn-secondary" onClick={() => setTagModalOpen(true)}>
                  编辑标签
                </button>
                <button className="btn btn-secondary" onClick={() => toggleLibraryImportant(selected.id)}>
                  {selected.important ? "取消重要" : "标记重要"}
                </button>
                <button className="btn btn-secondary" onClick={() => setDeleteOpen(true)}>
                  删除
                </button>
                <button className="btn btn-primary" onClick={() => setRelatedOpen(true)}>
                  查看相关记忆
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-note">请选择一条资料查看详情。</div>
          )}
        </aside>
      </div>

      <Modal
        open={tagModalOpen && Boolean(selected)}
        title="编辑标签"
        onClose={() => setTagModalOpen(false)}
        footer={
          <div className="section-row">
            <div className="tiny text-soft">使用逗号分隔多个标签</div>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!selected) return;
                updateLibraryTags(
                  selected.id,
                  tagDraft
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                );
                setTagModalOpen(false);
              }}
            >
              保存标签
            </button>
          </div>
        }
      >
        <textarea
          value={tagDraft}
          onChange={(event) => setTagDraft(event.target.value)}
          rows={4}
          style={{ width: "100%", borderRadius: 18, border: "1px solid var(--line)", padding: 16 }}
        />
      </Modal>

      <Modal
        open={deleteOpen && Boolean(selected)}
        title="删除资料"
        onClose={() => setDeleteOpen(false)}
        footer={
          <div className="section-row">
            <div className="tiny text-soft">该操作仅作用于本地 mock 数据。</div>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!selected) return;
                deleteLibraryItem(selected.id);
                setDeleteOpen(false);
              }}
            >
              确认删除
            </button>
          </div>
        }
      >
        <div className="text-soft">删除后该资料会从列表中移除。你可以继续通过导入或记录重新生成相关内容。</div>
      </Modal>

      <Modal open={relatedOpen && Boolean(selected)} title="相关记忆" onClose={() => setRelatedOpen(false)}>
        {relatedItems.length > 0 ? (
          relatedItems.map((item) => (
            <button
              key={item.id}
              className="list-item"
              style={{ background: "transparent", border: 0, textAlign: "left", cursor: "pointer" }}
              onClick={() => {
                selectLibraryItem(item.id);
                setRelatedOpen(false);
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{item.title}</div>
                <div className="tiny text-soft" style={{ marginTop: 4 }}>
                  {item.summary}
                </div>
              </div>
              <span className="badge">{item.type}</span>
            </button>
          ))
        ) : (
          <div className="empty-note">当前资料暂时没有关联记忆。</div>
        )}
        <button className="btn btn-ghost" onClick={() => pushToast("相关记忆检索已打开占位面板", "success")}>
          打开相关内容面板
        </button>
      </Modal>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="page">
          <div className="empty-note">正在加载资料库...</div>
        </div>
      }
    >
      <LibraryPageContent />
    </Suspense>
  );
}
