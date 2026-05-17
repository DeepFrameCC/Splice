"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type BarData = { label: string; value: number }[];
type PieData = { name: string; value: number }[];

const COLORS = ["#F36B1F", "#F36B1F", "#10B981", "#8B5CF6", "#F43F5E", "#0EA5E9"];

export function CABarChart({ data }: { data: BarData }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F36B1F10" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#0E0E22", opacity: 0.5 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#0E0E22", opacity: 0.5 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}€`} />
        <Tooltip
          contentStyle={{ background: "#0E0E22", border: "none", borderRadius: "12px", color: "#fff", fontSize: "13px" }}
          formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} €`, "CA"]}
        />
        <Bar dataKey="value" fill="#F36B1F" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function FunnelPieChart({ data }: { data: PieData }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#0E0E22", border: "none", borderRadius: "12px", color: "#fff", fontSize: "13px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ExportCSVButton({ data, filename }: { data: string; filename: string }) {
  function download() {
    const blob = new Blob(["\uFEFF" + data], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex items-center gap-2 rounded-full bg-df-blue px-4 py-2 text-xs font-bold text-white transition hover:bg-df-blue-dark"
    >
      Exporter CSV
    </button>
  );
}
