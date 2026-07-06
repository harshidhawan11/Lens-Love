import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface EmptyStateProps {
  illustration: "invoices" | "weddings" | "clients" | "payments" | "calendar";
  title: string;
  body: string;
  action?: ReactNode;
}

function Illustration({ kind }: { kind: EmptyStateProps["illustration"] }) {
  return (
    <div className="relative mb-5 grid h-28 w-28 place-items-center">
      <div className="absolute inset-0 rounded-full bg-blush-gradient blur-2xl opacity-70" />
      <svg
        viewBox="0 0 120 120"
        className="relative h-28 w-28"
        fill="none"
        stroke="#B06F62"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="60" cy="60" r="46" stroke="#E9BAB0" strokeDasharray="4 6" />
        {kind === "invoices" && (
          <>
            <rect x="42" y="36" width="36" height="48" rx="4" fill="#FDF6F4" />
            <path d="M50 48h20M50 58h20M50 68h12" />
          </>
        )}
        {kind === "weddings" && (
          <>
            <path d="M52 70a8 8 0 1 0 0-1M68 70a8 8 0 1 0 0-1" />
            <path d="M52 62l8-12 8 12" />
          </>
        )}
        {kind === "clients" && (
          <>
            <circle cx="60" cy="52" r="9" fill="#FDF6F4" />
            <path d="M44 80a16 16 0 0 1 32 0" />
          </>
        )}
        {kind === "payments" && (
          <>
            <rect x="40" y="46" width="40" height="28" rx="4" fill="#FDF6F4" />
            <path d="M40 56h40" />
            <circle cx="50" cy="66" r="2.5" fill="#B06F62" stroke="none" />
          </>
        )}
        {kind === "calendar" && (
          <>
            <rect x="42" y="42" width="36" height="34" rx="4" fill="#FDF6F4" />
            <path d="M42 52h36M52 40v6M68 40v6" />
          </>
        )}
      </svg>
    </div>
  );
}

export function EmptyState({ illustration, title, body, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center px-6 py-12 text-center"
    >
      <Illustration kind={illustration} />
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-ink-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
