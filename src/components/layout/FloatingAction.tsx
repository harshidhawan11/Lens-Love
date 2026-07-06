import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, FileText, UserPlus, CalendarPlus } from "lucide-react";

const actions = [
  { label: "Create Invoice", icon: FileText, to: "/app/invoices/new", bg: "bg-blush-500" },
  { label: "Add Client", icon: UserPlus, to: "/app/clients", bg: "bg-gold-400" },
  { label: "Schedule Shoot", icon: CalendarPlus, to: "/app/calendar", bg: "bg-sage-500" },
];

export function FloatingAction() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 lg:bottom-8 lg:right-8">
      <AnimatePresence>
        {open &&
          actions.map((a, i) => (
            <motion.button
              key={a.label}
              initial={{ opacity: 0, y: 16, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.8 }}
              transition={{ delay: open ? i * 0.05 : 0, type: "spring", stiffness: 400, damping: 24 }}
              onClick={() => {
                setOpen(false);
                navigate(a.to);
              }}
              className="flex items-center gap-3"
            >
              <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink shadow-card">
                {a.label}
              </span>
              <span className={`grid h-11 w-11 place-items-center rounded-full text-white shadow-lift ${a.bg}`}>
                <a.icon className="h-5 w-5" />
              </span>
            </motion.button>
          ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        aria-label="Quick actions"
        className="grid h-14 w-14 place-items-center rounded-full bg-ink text-canvas shadow-lift"
      >
        <motion.span animate={{ rotate: open ? 135 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <Plus className="h-6 w-6" />
        </motion.span>
      </motion.button>
    </div>
  );
}
