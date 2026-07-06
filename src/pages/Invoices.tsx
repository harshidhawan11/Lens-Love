import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, ArrowUpRight, Wallet, Clock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { InvoiceTable } from "@/components/InvoiceTable";
import { EmptyState } from "@/components/EmptyState";
import { invoices, currency, type InvoiceStatus } from "@/data/mock";
import { cn } from "@/lib/cn";

const tabs: Array<{ key: "all" | InvoiceStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "partial", label: "Partial" },
  { key: "overdue", label: "Overdue" },
  { key: "paid", label: "Paid" },
  { key: "draft", label: "Draft" },
];

export default function Invoices() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("all");

  const filtered = tab === "all" ? invoices : invoices.filter((i) => i.status === tab);

  const totalBilled = invoices.reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices.reduce((s, i) => s + i.paid, 0);
  const outstanding = totalBilled - totalPaid;

  return (
    <div>
      <PageHeader
        eyebrow="Cash flow"
        title="Invoices"
        subtitle="Send polished invoices and watch payments roll in."
        actions={
          <Button variant="blush" icon={<Plus className="h-4 w-4" />} onClick={() => navigate("/app/invoices/new")}>
            Create Invoice
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Total billed" value={currency(totalBilled)} icon={Wallet} accent="ink" />
        <Stat label="Collected" value={currency(totalPaid)} icon={CheckCircle2} accent="sage" delta="78%" />
        <Stat label="Outstanding" value={currency(outstanding)} icon={Clock} accent="blush" />
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 border-b border-line-soft p-2">
          {tabs.map((t) => {
            const count = t.key === "all" ? invoices.length : invoices.filter((i) => i.status === t.key).length;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  tab === t.key ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {tab === t.key && (
                  <motion.span
                    layoutId="invoice-tab"
                    className="absolute inset-0 rounded-full bg-blush-100"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">
                  {t.label}
                  <span className="ml-1.5 text-xs text-ink-faint">{count}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-2">
          {filtered.length === 0 ? (
            <EmptyState
              illustration="invoices"
              title="No invoices here yet"
              body="When you create or receive invoices in this status, they'll appear here."
              action={
                <Button variant="blush" icon={<Plus className="h-4 w-4" />} onClick={() => navigate("/app/invoices/new")}>
                  Create Invoice
                </Button>
              }
            />
          ) : (
            <InvoiceTable invoices={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  accent,
  delta,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
  accent: "ink" | "sage" | "blush";
  delta?: string;
}) {
  const map = {
    ink: "bg-ink/5 text-ink",
    sage: "bg-sage-100 text-sage-600",
    blush: "bg-blush-100 text-blush-600",
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl", map[accent])}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </span>
        {delta && (
          <span className="chip bg-sage-100 text-sage-600">
            <ArrowUpRight className="h-3 w-3" /> {delta}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-ink-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
