import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Camera, Package, CalendarPlus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { WeddingChip } from "@/components/StatusChip";
import { weddings, clients, daysUntil, formatDate, currency } from "@/data/mock";
import { coverBg } from "@/lib/gradients";

export default function Weddings() {
  const sorted = [...weddings].sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <div>
      <PageHeader
        eyebrow="The calendar of love"
        title="Weddings"
        subtitle="Upcoming celebrations, counting down to each unforgettable day."
        actions={
          <Button variant="blush" icon={<CalendarPlus className="h-4 w-4" />}>
            Schedule Shoot
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((w, i) => {
          const client = clients.find((c) => c.id === w.clientId)!;
          const countdown = daysUntil(w.date);
          return (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/app/clients/${w.clientId}`} className="card card-hover block overflow-hidden">
                <div className="relative h-36" style={{ background: coverBg(w.cover) }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute left-4 top-4">
                    <WeddingChip status={w.status} />
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <p className="font-display text-xl">{w.couple}</p>
                      <p className="flex items-center gap-1 text-xs opacity-90">
                        <MapPin className="h-3 w-3" /> {w.location}
                      </p>
                    </div>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur">
                      <Camera className="h-5 w-5" />
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{formatDate(w.date)}</p>
                      <p className="text-xs text-ink-muted">{formatDate(w.date, { weekday: "long" })}</p>
                    </div>
                    <span className="rounded-full bg-blush-100 px-3 py-1 text-sm font-semibold text-blush-700">
                      {countdown === 0 ? "Today" : countdown > 0 ? `${countdown}d` : "Done"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3 text-xs text-ink-muted">
                    <span className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5" /> {w.package}
                    </span>
                    <span className="font-display font-semibold text-ink">
                      {currency(client.packageValue)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
