import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DollarSign, Users, Star, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { RevenueChart } from "@/components/RevenueChart";
import { packageMix, leadSources, currency } from "@/data/mock";

export default function Analytics() {
  return (
    <div>
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        subtitle="Understand the rhythm of your studio — revenue, bookings, and demand."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Revenue YTD" value={285340} prefix="$" delta={18.2} icon={DollarSign} accent="blush" />
        <KpiCard index={1} label="Bookings" value={27} delta={4} deltaSuffix="" icon={Users} accent="gold" />
        <KpiCard index={2} label="Avg. rating" value={4.9} decimals={1} delta={2.1} icon={Star} accent="sage" />
        <KpiCard index={3} label="Inquiry → book" value={62} suffix="%" delta={6.4} icon={Clock} accent="ink" />
      </div>

      <div className="mb-6 card p-6">
        <RevenueChart height={320} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-6"
        >
          <h3 className="mb-1 font-display text-lg text-ink">Package mix</h3>
          <p className="mb-4 text-sm text-ink-muted">Share of bookings by collection</p>
          <div className="flex items-center gap-6">
            <div className="h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packageMix}
                    dataKey="value"
                    innerRadius={48}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {packageMix.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {packageMix.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-ink-soft">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-medium text-ink">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-6"
        >
          <h3 className="mb-1 font-display text-lg text-ink">Where couples find you</h3>
          <p className="mb-4 text-sm text-ink-muted">Lead source breakdown</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadSources} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC9A8D" />
                    <stop offset="100%" stopColor="#E9BAB0" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F2ECE6" vertical={false} />
                <XAxis dataKey="source" tickLine={false} axisLine={false} dy={6} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "#FAEAE6" }} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="value" fill="url(#barGrad)" radius={[8, 8, 0, 0]} barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Most booked month", value: "October", sub: "6 weddings" },
          { label: "Avg. days to pay", value: "12 days", sub: "↓ 3 days vs last quarter" },
          { label: "Lifetime revenue", value: currency(1248900), sub: "Since 2019" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="card p-5"
          >
            <p className="text-sm text-ink-muted">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink">{s.value}</p>
            <p className="mt-0.5 text-xs text-sage-600">{s.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
