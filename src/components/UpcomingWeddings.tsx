import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Camera, ArrowUpRight } from "lucide-react";
import { WeddingChip } from "@/components/StatusChip";
import { coverBg } from "@/lib/gradients";
import { weddings, clients, daysUntil, formatDate } from "@/data/mock";

export function UpcomingWeddings({ limit }: { limit?: number }) {
  const upcoming = weddings
    .filter((w) => daysUntil(w.date) >= 0)
    .slice(0, limit ?? weddings.length);

  return (
    <div className="relative">
      <div className="absolute bottom-2 left-[27px] top-2 w-px bg-line" />
      <div className="space-y-3">
        {upcoming.map((w, i) => {
          const client = clients.find((c) => c.id === w.clientId)!;
          const countdown = daysUntil(w.date);
          return (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex gap-4"
            >
              <div className="relative z-10 mt-1.5 flex flex-col items-center">
                <span
                  className="h-3.5 w-3.5 rounded-full border-2 border-surface shadow-soft"
                  style={{ background: coverBg(w.cover) }}
                />
              </div>

              <Link
                to={`/app/clients/${w.clientId}`}
                className="group flex-1 overflow-hidden rounded-2xl border border-line bg-surface p-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-blush-200 hover:shadow-card"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-inset"
                    style={{ background: coverBg(w.cover) }}
                  >
                    <Camera className="h-5 w-5 opacity-90" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-display text-[15px] text-ink">{w.couple}</p>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="flex items-center gap-1 truncate text-xs text-ink-muted">
                      <MapPin className="h-3 w-3" /> {w.venue} · {w.location}
                    </p>
                  </div>
                </div>

                {/* reveal-on-hover detail row */}
                <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line-soft pt-3 text-xs text-ink-muted">
                      <span>{w.package}</span>
                      <span>·</span>
                      <span>{client.photographer}</span>
                      <span>·</span>
                      <span>{formatDate(w.date, { weekday: "long" })}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-ink">
                      {formatDate(w.date, { month: "short", day: "numeric" })}
                    </span>
                    <span className="rounded-full bg-blush-100 px-2 py-0.5 font-semibold text-blush-700">
                      {countdown === 0 ? "Today" : `${countdown} days`}
                    </span>
                  </div>
                  <WeddingChip status={w.status} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
