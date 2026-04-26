type SearchBarProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
};

export function SearchBar({ value, placeholder, onChange, onSubmit }: SearchBarProps) {
  return (
    <div className="search">
      <span>⌕</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSubmit?.();
          }
        }}
      />
    </div>
  );
}
