import { motion } from "framer-motion";
import { Eye, Bell, Copy, Download } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { InvoiceChip } from "@/components/StatusChip";
import { clients, currency, formatDate, type Invoice } from "@/data/mock";
import { cn } from "@/lib/cn";

const actions = [
  { label: "View", icon: Eye },
  { label: "Send reminder", icon: Bell },
  { label: "Duplicate", icon: Copy },
  { label: "Download PDF", icon: Download },
];

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="overflow-x-auto scrollbar-none">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="border-b border-line text-left">
            {["Client", "Invoice", "Amount", "Due date", "Status", "Payment progress", ""].map(
              (h) => (
                <th
                  key={h}
                  className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, i) => {
            const client = clients.find((c) => c.id === inv.clientId)!;
            const progress = inv.amount > 0 ? inv.paid / inv.amount : 0;
            return (
              <motion.tr
                key={inv.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="group border-b border-line-soft transition-colors hover:bg-blush-50/40"
              >
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar seed={client.avatar} initials={client.initials} size="sm" />
                    <div className="leading-tight">
                      <p className="text-sm font-medium text-ink">{inv.couple}</p>
                      <p className="text-xs text-ink-faint">{client.package}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-sm font-medium text-ink-soft">{inv.number}</td>
                <td className="px-3 py-3.5">
                  <span className="font-display text-sm font-semibold text-ink">
                    {currency(inv.amount)}
                  </span>
                  {inv.paid > 0 && inv.paid < inv.amount && (
                    <p className="text-xs text-ink-faint">{currency(inv.paid)} paid</p>
                  )}
                </td>
                <td className="px-3 py-3.5 text-sm text-ink-muted">
                  {formatDate(inv.dueDate, { month: "short", day: "numeric" })}
                </td>
                <td className="px-3 py-3.5">
                  <InvoiceChip status={inv.status} />
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-line-soft">
                      <motion.div
                        className="h-full rounded-full bg-gold-sheen"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span className="text-xs font-medium text-ink-muted">
                      {Math.round(progress * 100)}%
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {actions.map((a) => (
                      <button
                        key={a.label}
                        title={a.label}
                        aria-label={a.label}
                        className={cn(
                          "grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-surface hover:text-blush-600 hover:shadow-soft",
                        )}
                      >
                        <a.icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
