import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, UserPlus, MapPin, Heart } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { ProgressRing } from "@/components/ProgressRing";
import { WeddingChip } from "@/components/StatusChip";
import { EmptyState } from "@/components/EmptyState";
import { clients, currency, formatDate, daysUntil } from "@/data/mock";
import { cn } from "@/lib/cn";

const filters = ["All", "Confirmed", "Deposit", "Inquiry", "Delivered"] as const;

export default function Clients() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filtered = clients.filter((c) => {
    const matchesQuery =
      c.couple.toLowerCase().includes(query.toLowerCase()) ||
      c.venue.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === "All" || c.status === filter.toLowerCase();
    return matchesQuery && matchesFilter;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Relationships"
        title="Clients"
        subtitle="Every couple you're working with, beautifully organized."
        actions={
          <Button variant="blush" icon={<UserPlus className="h-4 w-4" />}>
            Add Client
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-10"
            placeholder="Search couples or venues…"
          />
        </div>
        <div className="flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-ink text-canvas"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            illustration="clients"
            title="No clients found"
            body="Try a different search, or add your first couple to begin their story."
            action={
              <Button variant="blush" icon={<UserPlus className="h-4 w-4" />}>
                Add Client
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={`/app/clients/${c.id}`}
                className="card card-hover block overflow-hidden"
              >
                <div
                  className="h-20 w-full"
                  style={{
                    background:
                      c.cover === "dusk"
                        ? "linear-gradient(135deg,#F3D5CE,#DC9A8D)"
                        : c.cover === "champagne"
                        ? "linear-gradient(135deg,#F6EFDD,#DCC189)"
                        : "linear-gradient(135deg,#EDF2EC,#BCCDB7)",
                  }}
                />
                <div className="px-4 pb-4">
                  <div className="-mt-7 flex items-end justify-between">
                    <Avatar seed={c.avatar} initials={c.initials} size="lg" ring />
                    <div className="mb-1">
                      <WeddingChip status={c.status} />
                    </div>
                  </div>
                  <h3 className="mt-3 font-display text-lg text-ink">{c.couple}</h3>
                  <p className="flex items-center gap-1 text-xs text-ink-muted">
                    <MapPin className="h-3 w-3" /> {c.venue} · {c.location}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-ink-faint">
                        {c.package}
                      </p>
                      <p className="font-display text-base font-semibold text-ink">
                        {currency(c.packageValue)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-blush-600">
                        <Heart className="h-3 w-3" />
                        {daysUntil(c.weddingDate) >= 0
                          ? `${daysUntil(c.weddingDate)} days to go`
                          : formatDate(c.weddingDate)}
                      </p>
                    </div>
                    <ProgressRing progress={c.invoiceProgress} size={56} stroke={6} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
