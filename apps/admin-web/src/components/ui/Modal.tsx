import type { PropsWithChildren, ReactNode } from "react";

type ModalProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
  footer?: ReactNode;
}>;

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="section-row" style={{ marginBottom: 16 }}>
          <h3 className="section-title" style={{ marginBottom: 0 }}>
            {title}
          </h3>
          <button className="btn btn-secondary" onClick={onClose}>
            关闭
          </button>
        </div>
        <div className="stack">{children}</div>
        {footer ? <div style={{ marginTop: 20 }}>{footer}</div> : null}
      </div>
    </div>
  );
}
