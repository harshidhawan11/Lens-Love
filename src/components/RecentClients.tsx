import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, MessageCircle, Check, Clock } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { ProgressRing } from "@/components/ProgressRing";
import { clients, type Client } from "@/data/mock";
import { cn } from "@/lib/cn";

const contractMeta: Record<Client["contractStatus"], { label: string; cls: string; icon: typeof Check }> = {
  signed: { label: "Signed", cls: "text-sage-600", icon: Check },
  sent: { label: "Sent", cls: "text-gold-500", icon: Clock },
  draft: { label: "Draft", cls: "text-ink-faint", icon: FileText },
};

export function RecentClients({ list = clients.slice(0, 4) }: { list?: Client[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {list.map((c, i) => {
        const cm = contractMeta[c.contractStatus];
        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            className="card card-hover group p-4"
          >
            <div className="flex items-start gap-3">
              <Avatar seed={c.avatar} initials={c.initials} size="md" />
              <div className="min-w-0 flex-1">
                <Link
                  to={`/app/clients/${c.id}`}
                  className="truncate font-display text-[15px] text-ink transition-colors hover:text-blush-600"
                >
                  {c.couple}
                </Link>
                <p className="truncate text-xs text-ink-muted">{c.package}</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                  <cm.icon className={cn("h-3.5 w-3.5", cm.cls)} />
                  <span className={cm.cls}>{cm.label}</span>
                </div>
              </div>
              <ProgressRing progress={c.invoiceProgress} size={46} />
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-line-soft pt-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Link
                to={`/app/clients/${c.id}`}
                className="flex-1 rounded-lg bg-blush-50 py-1.5 text-center text-xs font-medium text-blush-700 transition-colors hover:bg-blush-100"
              >
                View profile
              </Link>
              <button
                aria-label="Message"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-line-soft hover:text-ink"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
              <button
                aria-label="New invoice"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-line-soft hover:text-ink"
              >
                <FileText className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
