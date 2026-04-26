"use client";

import { useState } from "react";
import { AppSwitch } from "@/components/ui/AppSwitch";
import { Modal } from "@/components/ui/Modal";
import { TopBar } from "@/components/ui/TopBar";
import { useDeskStore } from "@/store/useDeskStore";

export default function SettingsPage() {
  const settings = useDeskStore((state) => state.settings);
  const updateSetting = useDeskStore((state) => state.updateSetting);
  const runManualSync = useDeskStore((state) => state.runManualSync);
  const deleteAllRecords = useDeskStore((state) => state.deleteAllRecords);
  const deletePersona = useDeskStore((state) => state.deletePersona);
  const exportAllData = useDeskStore((state) => state.exportAllData);
  const pushToast = useDeskStore((state) => state.pushToast);
  const [modal, setModal] = useState<string | null>(null);

  return (
    <div className="page">
      <TopBar title="设置" subtitle="管理账号、同步、隐私、模型策略和提醒设置。" />

      <div className="split">
        <div className="stack">
          <section className="surface section-card">
            <h3 className="section-title">账号与设备</h3>
            <div className="stack">
              <div className="empty-note">
                <strong>{settings.userName}</strong>
                <div style={{ marginTop: 8 }}>{settings.email}</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setModal("edit-profile")}>
                  编辑资料
                </button>
                <button className="btn btn-secondary" onClick={() => setModal("devices")}>
                  查看绑定设备
                </button>
              </div>
            </div>
          </section>

          <section className="surface section-card">
            <h3 className="section-title">存储与同步</h3>
            <div className="stack">
              <AppSwitch
                label="自动同步"
                description={`最近同步时间：${settings.lastSyncAt}`}
                checked={settings.autoSync}
                onChange={(value) => updateSetting("autoSync", value)}
              />
              <button className="btn btn-primary" onClick={runManualSync}>
                手动同步
              </button>
            </div>
          </section>

          <section className="surface section-card">
            <h3 className="section-title">隐私与删除</h3>
            <div className="stack">
              <button className="btn btn-secondary" onClick={() => setModal("delete-records")}>
                删除全部记录
              </button>
              <button className="btn btn-secondary" onClick={() => setModal("delete-persona")}>
                删除人物画像
              </button>
              <button className="btn btn-primary" onClick={exportAllData}>
                下载个人数据
              </button>
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="surface section-card">
            <h3 className="section-title">模型策略</h3>
            <div className="stack">
              <div className="section-row">
                <div>
                  <div style={{ fontWeight: 700 }}>轻量模型策略</div>
                  <div className="tiny text-soft">用于普通回答与快速整理</div>
                </div>
                <select
                  value={settings.lightModel}
                  onChange={(event) => updateSetting("lightModel", event.target.value as typeof settings.lightModel)}
                  style={{ minHeight: 42, borderRadius: 14, border: "1px solid var(--line)", padding: "0 12px" }}
                >
                  <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                  <option value="deepseek-chat">deepseek-chat</option>
                </select>
              </div>
              <div className="section-row">
                <div>
                  <div style={{ fontWeight: 700 }}>深度分析模型策略</div>
                  <div className="tiny text-soft">用于深度检索与画像更新</div>
                </div>
                <select
                  value={settings.deepModel}
                  onChange={(event) => updateSetting("deepModel", event.target.value as typeof settings.deepModel)}
                  style={{ minHeight: 42, borderRadius: 14, border: "1px solid var(--line)", padding: "0 12px" }}
                >
                  <option value="gpt-5">gpt-5</option>
                  <option value="deepseek-reasoner">deepseek-reasoner</option>
                </select>
              </div>
              <AppSwitch
                label="自动更新画像"
                checked={settings.autoUpdatePersona}
                onChange={(value) => updateSetting("autoUpdatePersona", value)}
              />
            </div>
          </section>

          <section className="surface section-card">
            <h3 className="section-title">提醒设置</h3>
            <div className="stack">
              <AppSwitch label="每日提醒" checked={settings.dailyReminder} onChange={(value) => updateSetting("dailyReminder", value)} />
              <AppSwitch label="每周回顾提醒" checked={settings.weeklyReviewReminder} onChange={(value) => updateSetting("weeklyReviewReminder", value)} />
              <AppSwitch label="分析完成提醒" checked={settings.analysisReadyReminder} onChange={(value) => updateSetting("analysisReadyReminder", value)} />
            </div>
          </section>

          <section className="surface section-card">
            <h3 className="section-title">关于产品</h3>
            <div className="stack">
              <button className="btn btn-secondary" onClick={() => setModal("help")}>帮助中心</button>
              <button className="btn btn-secondary" onClick={() => setModal("support")}>联系支持</button>
              <button className="btn btn-secondary" onClick={() => setModal("policy")}>隐私政策</button>
            </div>
          </section>
        </div>
      </div>

      <Modal
        open={Boolean(modal)}
        title="设置操作"
        onClose={() => setModal(null)}
        footer={
          modal === "delete-records" ? (
            <button className="btn btn-primary" onClick={() => { deleteAllRecords(); setModal(null); }}>
              确认删除全部记录
            </button>
          ) : modal === "delete-persona" ? (
            <button className="btn btn-primary" onClick={() => { deletePersona(); setModal(null); }}>
              确认删除人物画像
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => { pushToast("占位动作已触发", "success"); setModal(null); }}>
              确认
            </button>
          )
        }
      >
        <div className="text-soft">
          {modal === "edit-profile" && "这里会进入个人资料编辑面板。当前先用 modal 占位，后续可替换为真实表单。"}
          {modal === "devices" && "这里会展示当前绑定的手机和网页设备信息。"}
          {modal === "delete-records" && "删除后资料库中的全部 mock 记录会被清空。"}
          {modal === "delete-persona" && "删除后人物画像模块会被清空为占位内容。"}
          {modal === "help" && "帮助中心入口已可点击，后续可接文档与 FAQ 页面。"}
          {modal === "support" && "联系支持入口已可点击，后续可接邮件或工单。"}
          {modal === "policy" && "隐私政策入口已可点击，后续可接独立政策页。"}
        </div>
      </Modal>
    </div>
  );
}
