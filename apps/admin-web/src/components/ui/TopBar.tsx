import type { ReactNode } from "react";

type TopBarProps = {
  title: string;
  subtitle: string;
  actions?: ReactNode;
};

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {actions}
    </div>
  );
}
