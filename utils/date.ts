export function formatDateTime(value: string | number | Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
