import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { InvoiceStatus, WeddingStatus } from "@/data/mock";

const invoiceStyles: Record<InvoiceStatus, { label: string; cls: string; dot: string }> = {
  paid: { label: "Paid", cls: "bg-sage-100 text-sage-600", dot: "bg-sage-500" },
  partial: { label: "Partial", cls: "bg-gold-100 text-gold-600", dot: "bg-gold-400" },
  overdue: { label: "Overdue", cls: "bg-blush-100 text-blush-700", dot: "bg-blush-500" },
  draft: { label: "Draft", cls: "bg-line-soft text-ink-muted", dot: "bg-ink-faint" },
  pending: { label: "Pending", cls: "bg-blush-50 text-blush-600", dot: "bg-blush-300" },
};

const weddingStyles: Record<WeddingStatus, { label: string; cls: string; dot: string }> = {
  confirmed: { label: "Confirmed", cls: "bg-sage-100 text-sage-600", dot: "bg-sage-500" },
  deposit: { label: "Deposit paid", cls: "bg-gold-100 text-gold-600", dot: "bg-gold-400" },
  inquiry: { label: "Inquiry", cls: "bg-blush-50 text-blush-600", dot: "bg-blush-300" },
  delivered: { label: "Delivered", cls: "bg-line-soft text-ink-muted", dot: "bg-ink-faint" },
};

export function InvoiceChip({ status }: { status: InvoiceStatus }) {
  const s = invoiceStyles[status];
  return (
    <motion.span
      layout
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={cn("chip", s.cls)}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </motion.span>
  );
}

export function WeddingChip({ status }: { status: WeddingStatus }) {
  const s = weddingStyles[status];
  return (
    <span className={cn("chip", s.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
