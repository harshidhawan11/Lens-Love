import { useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { revenueSeries, currency } from "@/data/mock";
import { cn } from "@/lib/cn";

type Period = "week" | "month" | "quarter" | "year";
const periods: Period[] = ["week", "month", "quarter", "year"];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-surface/95 px-3.5 py-2.5 shadow-lift backdrop-blur">
      <p className="mb-1.5 text-xs font-semibold text-ink">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize text-ink-muted">{p.dataKey}</span>
          <span className="ml-auto font-medium text-ink">{currency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart({ height = 300 }: { height?: number }) {
  const [period, setPeriod] = useState<Period>("month");
  const data = revenueSeries[period];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-ink">Revenue overview</h3>
          <p className="text-sm text-ink-muted">Income, paid & outstanding balance</p>
        </div>
        <div className="flex rounded-full border border-line bg-surface-2 p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "relative rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors",
                period === p ? "text-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {period === p && (
                <motion.span
                  layoutId="period-pill"
                  className="absolute inset-0 rounded-full bg-surface shadow-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{p}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC9A8D" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#DC9A8D" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A85F" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#C9A85F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#F2ECE6" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} dy={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => currency(v, true)}
              width={56}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#E9BAB0", strokeDasharray: 4 }} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#C9897C"
              strokeWidth={2.5}
              fill="url(#incomeGrad)"
              animationDuration={900}
            />
            <Area
              type="monotone"
              dataKey="paid"
              stroke="#C9A85F"
              strokeWidth={2}
              fill="url(#paidGrad)"
              animationDuration={1100}
            />
            <Area
              type="monotone"
              dataKey="outstanding"
              stroke="#B6ADA4"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="none"
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
        <Legend color="#C9897C" label="Income" />
        <Legend color="#C9A85F" label="Paid" />
        <Legend color="#B6ADA4" label="Outstanding" dashed />
      </div>
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: dashed ? "transparent" : color, border: dashed ? `1.5px dashed ${color}` : "none" }}
      />
      {label}
    </span>
  );
}
