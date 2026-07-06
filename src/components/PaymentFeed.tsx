import { motion } from "framer-motion";
import { Download, CreditCard, Building2, Apple } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { clients, currency, payments, type Payment } from "@/data/mock";

function methodIcon(method: Payment["method"]) {
  if (method === "Bank transfer") return Building2;
  if (method === "Apple Pay") return Apple;
  return CreditCard;
}

function timeAgo(iso: string) {
  const now = new Date("2026-06-25T19:00:00");
  const diff = (+now - +new Date(iso)) / 3600000;
  if (diff < 24) return `${Math.round(diff)}h ago`;
  return `${Math.round(diff / 24)}d ago`;
}

export function PaymentFeed({ limit }: { limit?: number }) {
  const list = limit ? payments.slice(0, limit) : payments;
  return (
    <div className="space-y-1">
      {list.map((p, i) => {
        const client = clients.find((c) => c.id === p.clientId)!;
        const Icon = methodIcon(p.method);
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-blush-50/50"
          >
            <div className="relative">
              <Avatar seed={client.avatar} initials={client.initials} size="sm" />
              <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-surface text-sage-600 shadow-soft">
                <Icon className="h-2.5 w-2.5" />
              </span>
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-ink">{p.couple}</p>
              <p className="truncate text-xs text-ink-faint">
                {p.method} · {p.invoiceNumber} · {timeAgo(p.date)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-sm font-semibold text-sage-600">
                +{currency(p.amount)}
              </p>
            </div>
            <button
              aria-label="Download receipt"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-faint opacity-0 transition-all hover:bg-surface hover:text-blush-600 hover:shadow-soft group-hover:opacity-100"
            >
              <Download className="h-4 w-4" />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
