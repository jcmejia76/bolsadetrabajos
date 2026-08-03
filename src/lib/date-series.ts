/** Zero-fills missing days in a [date, count] series so chart x-axes have no gaps. */
export function fillDailySeries(
  rows: { date: Date; count: number }[],
  days: number
): { date: string; count: number }[] {
  const counts = new Map(rows.map((r) => [r.date.toISOString().slice(0, 10), r.count]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return result;
}

/** Zero-fills missing months in a [month, count] series. */
export function fillMonthlySeries(
  rows: { month: Date; count: number }[],
  months: number
): { month: string; count: number }[] {
  const counts = new Map(
    rows.map((r) => [`${r.month.getUTCFullYear()}-${String(r.month.getUTCMonth() + 1).padStart(2, "0")}`, r.count])
  );
  const today = new Date();

  const result: { month: string; count: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    result.push({ month: key, count: counts.get(key) ?? 0 });
  }
  return result;
}
