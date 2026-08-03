"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface JobsByCategoryChartProps {
  data: { category: string; vacantes: number }[];
}

export function JobsByCategoryChart({ data }: JobsByCategoryChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin ofertas publicadas todavía.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        <XAxis type="number" allowDecimals={false} stroke="var(--muted-foreground)" fontSize={12} />
        <YAxis
          type="category"
          dataKey="category"
          width={140}
          stroke="var(--muted-foreground)"
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="vacantes" fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
