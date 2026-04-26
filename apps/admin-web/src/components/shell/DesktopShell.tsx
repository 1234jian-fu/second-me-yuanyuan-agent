"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { navItems } from "@/lib/mock-data";
import { useDeskStore } from "@/store/useDeskStore";
import { ToastStack } from "@/components/ui/ToastStack";

export function DesktopShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const notificationsOpen = useDeskStore((state) => state.notificationsOpen);
  const notifications = useDeskStore((state) => state.notifications);
  const toggleNotifications = useDeskStore((state) => state.toggleNotifications);
  const markNotificationRead = useDeskStore((state) => state.markNotificationRead);

  return (
    <>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-title">Second Me</div>
            <div className="brand-subtitle">数字分身 Agent · 电脑端中枢</div>
          </div>

          <nav className="nav-list">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`nav-link${active ? " active" : ""}`}>
                  <span className="nav-dot" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div style={{ marginTop: 28 }} className="surface section-card">
            <div className="tiny text-soft">系统状态</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>Mock Hub 已连接</div>
            <div style={{ marginTop: 8 }} className="badge primary-badge">
              所有页面可交互
            </div>
          </div>
        </aside>

        <main className="main">{children}</main>
      </div>

      {notificationsOpen ? (
        <aside className="drawer">
          <div className="section-row" style={{ marginBottom: 18 }}>
            <h3 className="section-title" style={{ marginBottom: 0 }}>
              通知
            </h3>
            <button className="btn btn-secondary" onClick={() => toggleNotifications(false)}>
              关闭
            </button>
          </div>

          <div className="stack">
            {notifications.map((item) => (
              <div key={item.id} className="surface section-card">
                <div className="section-row">
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div className="tiny text-faint" style={{ marginTop: 4 }}>
                      {item.createdAt}
                    </div>
                  </div>
                  {!item.read ? <span className="badge primary-badge">未读</span> : <span className="badge">已读</span>}
                </div>
                <div className="text-soft" style={{ marginTop: 12, lineHeight: 1.6 }}>
                  {item.body}
                </div>
                {!item.read ? (
                  <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => markNotificationRead(item.id)}>
                    标记已读
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </aside>
      ) : null}

      <ToastStack />
    </>
  );
}
