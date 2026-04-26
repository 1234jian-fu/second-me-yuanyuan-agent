type MetricCardProps = {
  label: string;
  value: string | number;
  hint: string;
  onClick: () => void;
};

export function MetricCard({ label, value, hint, onClick }: MetricCardProps) {
  return (
    <button className="surface section-card" onClick={onClick} style={{ textAlign: "left", cursor: "pointer" }}>
      <div className="tiny text-soft">{label}</div>
      <div className="metric-value" style={{ marginTop: 10 }}>
        {value}
      </div>
      <div className="tiny text-faint" style={{ marginTop: 10 }}>
        {hint}
      </div>
    </button>
  );
}
