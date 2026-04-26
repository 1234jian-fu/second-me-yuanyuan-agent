"use client";

import { useMemo, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { TopBar } from "@/components/ui/TopBar";
import { useDeskStore } from "@/store/useDeskStore";

export default function ImportPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const tasks = useDeskStore((state) => state.importTasks);
  const selectedImportId = useDeskStore((state) => state.selectedImportId);
  const selectImportTask = useDeskStore((state) => state.selectImportTask);
  const createUploadTask = useDeskStore((state) => state.createUploadTask);
  const reprocessImportTask = useDeskStore((state) => state.reprocessImportTask);
  const deleteImportTask = useDeskStore((state) => state.deleteImportTask);
  const failImportTask = useDeskStore((state) => state.failImportTask);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const selected = tasks.find((item) => item.id === selectedImportId) ?? tasks[0];

  const steps = useMemo(
    () => [
      { title: "清洗", desc: "去除格式噪声与重复内容" },
      { title: "分段", desc: "将资料切分为可处理片段" },
      { title: "摘要", desc: "提取可读的摘要与主题" },
      { title: "标签", desc: "生成标签、情绪和来源信息" },
      { title: "入库", desc: "写入资料库" },
      { title: "画像更新", desc: "更新相关画像模块" },
    ],
    [],
  );

  function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    Array.from(fileList).forEach((file) => createUploadTask(file.name));
  }

  return (
    <div className="page">
      <TopBar title="导入中心" subtitle="上传聊天记录和文档，观察处理进度与入库状态。" />

      <div className="split">
        <div className="stack">
          <section
            className="surface section-card surface-xl"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              handleFiles(event.dataTransfer.files);
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 22 }}>拖拽文件到这里，或点击上传</div>
            <div className="page-subtitle" style={{ marginTop: 10 }}>
              支持聊天记录、Markdown、音频、图片、视频等 mock 导入流程。
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
                选择本地文件
              </button>
              <button className="btn btn-secondary" onClick={() => createUploadTask(`mock-import-${Date.now()}.txt`)}>
                模拟上传
              </button>
            </div>
            <input
              ref={fileInputRef}
              hidden
              multiple
              type="file"
              onChange={(event) => handleFiles(event.target.files)}
            />
          </section>

          <section className="surface section-card">
            <h3 className="section-title">导入流程说明</h3>
            <div className="filters">
              {steps.map((step) => (
                <button key={step.title} className="chip" title={step.desc}>
                  {step.title}
                </button>
              ))}
            </div>
          </section>

          <section className="surface section-card">
            <h3 className="section-title">导入任务列表</h3>
            <div className="stack">
              {tasks.map((task) => (
                <div key={task.id} className="surface section-card" style={{ background: task.id === selected?.id ? "var(--surface-soft)" : undefined }}>
                  <div className="section-row">
                    <div>
                      <div style={{ fontWeight: 700 }}>{task.fileName}</div>
                      <div className="tiny text-soft" style={{ marginTop: 4 }}>
                        {task.createdAt} · {task.fileType}
                      </div>
                    </div>
                    <span className={`badge${task.status === "done" ? " primary-badge" : ""}`}>{task.status}</span>
                  </div>
                  <div className="tiny text-soft" style={{ marginTop: 12 }}>{task.detail}</div>
                  <div style={{ height: 8, borderRadius: 999, background: "var(--surface-soft)", marginTop: 12 }}>
                    <div style={{ width: `${task.progress}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #f0c78e, var(--primary))" }} />
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                    <button className="btn btn-secondary" onClick={() => selectImportTask(task.id)}>查看</button>
                    <button className="btn btn-secondary" onClick={() => reprocessImportTask(task.id)}>重新处理</button>
                    <button className="btn btn-secondary" onClick={() => failImportTask(task.id)}>模拟失败</button>
                    <button className="btn btn-primary" onClick={() => setDeleteId(task.id)}>删除</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="surface section-card">
          {selected ? (
            <div className="stack">
              <div>
                <div className="tiny text-soft">处理详情</div>
                <h3 className="section-title" style={{ marginTop: 10 }}>{selected.fileName}</h3>
              </div>
              <div className="empty-note">
                文件类型：{selected.fileType}
                <br />
                当前进度：{selected.progress}%
                <br />
                已入画像：{selected.inPersona ? "是" : "否"}
              </div>
              <div className="stack">
                {selected.steps.map((step) => (
                  <div key={step.key} className="list-item" title={step.detail}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{step.label}</div>
                      <div className="tiny text-soft" style={{ marginTop: 4 }}>{step.detail}</div>
                    </div>
                    <span className={`badge${step.status === "done" ? " primary-badge" : ""}`}>{step.status}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-note">选择一个任务查看处理详情。</div>
          )}
        </aside>
      </div>

      <Modal
        open={Boolean(deleteId)}
        title="删除导入任务"
        onClose={() => setDeleteId(null)}
        footer={
          <div className="section-row">
            <div className="tiny text-soft">该操作只会删除本地 mock 任务。</div>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!deleteId) return;
                deleteImportTask(deleteId);
                setDeleteId(null);
              }}
            >
              确认删除
            </button>
          </div>
        }
      >
        <div className="text-soft">删除后该导入任务会从列表中移除。</div>
      </Modal>
    </div>
  );
}
