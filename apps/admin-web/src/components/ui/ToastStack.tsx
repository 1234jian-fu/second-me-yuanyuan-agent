"use client";

import { useEffect } from "react";
import { useDeskStore } from "@/store/useDeskStore";

export function ToastStack() {
  const toasts = useDeskStore((state) => state.toasts);
  const removeToast = useDeskStore((state) => state.removeToast);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        removeToast(toast.id);
      }, 2400),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [removeToast, toasts]);

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.tone}`}>
          {toast.title}
        </div>
      ))}
    </div>
  );
}
