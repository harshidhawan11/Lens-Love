import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { MiniCalendar } from "@/components/MiniCalendar";
import { calendarEvents, formatDate, type CalendarEvent } from "@/data/mock";
import { cn } from "@/lib/cn";

const typeColor: Record<CalendarEvent["type"], string> = {
  wedding: "bg-blush-500",
  engagement: "bg-gold-400",
  invoice: "bg-sage-500",
  meeting: "bg-ink-faint",
};

export default function CalendarPage() {
  const upcoming = [...calendarEvents]
    .filter((e) => +new Date(e.date) >= +new Date("2026-06-25"))
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <div>
      <PageHeader
        eyebrow="Your schedule"
        title="Calendar"
        subtitle="Weddings, shoots, meetings and invoice due dates — all in one view."
        actions={
          <Button variant="blush" icon={<CalendarPlus className="h-4 w-4" />}>
            New Event
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <MiniCalendar large />
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Upcoming</h2>
          <div className="space-y-2">
            {upcoming.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-center gap-3 rounded-xl border border-line-soft px-3 py-2.5 transition-colors hover:bg-blush-50/40"
              >
                <div className="flex flex-col items-center rounded-lg bg-surface-2 px-2.5 py-1.5 text-center">
                  <span className="text-[10px] uppercase text-ink-faint">
                    {formatDate(e.date, { month: "short" })}
                  </span>
                  <span className="font-display text-base font-semibold text-ink">
                    {new Date(e.date + "T12:00:00").getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{e.title}</p>
                  <p className="text-xs capitalize text-ink-muted">{e.type}</p>
                </div>
                <span className={cn("h-2.5 w-2.5 rounded-full", typeColor[e.type])} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
