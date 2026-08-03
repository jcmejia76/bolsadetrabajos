"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ApplicationsByDayChartProps {
  data: { date: string; count: number }[];
}

function formatDay(value: string) {
  const d = new Date(value);
  return d.toLocaleDateString("es", { day: "2-digit", month: "2-digit" });
}

function formatDayLabel(label: React.ReactNode) {
  return typeof label === "string" ? formatDay(label) : label;
}

export function ApplicationsByDayChart({ data }: ApplicationsByDayChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ left: 8, right: 16 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDay}
          stroke="var(--muted-foreground)"
          fontSize={12}
          minTickGap={24}
        />
        <YAxis allowDecimals={false} stroke="var(--muted-foreground)" fontSize={12} />
        <Tooltip
          labelFormatter={formatDayLabel}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="count"
          name="Postulaciones"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
