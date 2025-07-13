export function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return dateStr === today;
}

