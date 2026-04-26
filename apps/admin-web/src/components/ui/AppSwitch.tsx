type AppSwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
};

export function AppSwitch({ checked, onChange, label, description }: AppSwitchProps) {
  return (
    <div className="section-row">
      <div>
        <div style={{ fontWeight: 700 }}>{label}</div>
        {description ? (
          <div className="tiny text-soft" style={{ marginTop: 4 }}>
            {description}
          </div>
        ) : null}
      </div>
      <button
        className={`switch${checked ? " active" : ""}`}
        aria-label={label}
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
      >
        <span className="switch-handle" />
      </button>
    </div>
  );
}
