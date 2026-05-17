"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataPoint = {
  month: string;
  ca: number;
};

export default function CAChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="caGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F36B1F" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#F36B1F" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F36B1F10" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#0E0E22", opacity: 0.5 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#0E0E22", opacity: 0.5 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v.toLocaleString("fr-FR")}€`}
        />
        <Tooltip
          contentStyle={{
            background: "#0E0E22",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "13px",
            padding: "8px 14px",
          }}
          formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} €`, "CA"]}
          labelStyle={{ color: "#F36B1F", fontWeight: 700, marginBottom: 4 }}
        />
        <Area
          type="monotone"
          dataKey="ca"
          stroke="#F36B1F"
          strokeWidth={2.5}
          fill="url(#caGradient)"
          dot={false}
          activeDot={{ r: 5, fill: "#F36B1F", stroke: "#0E0E22", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
