import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { calendarEvents, type CalendarEvent } from "@/data/mock";
import { cn } from "@/lib/cn";

const typeColor: Record<CalendarEvent["type"], string> = {
  wedding: "bg-blush-500",
  engagement: "bg-gold-400",
  invoice: "bg-sage-500",
  meeting: "bg-ink-faint",
};

const typeLabel: Record<CalendarEvent["type"], string> = {
  wedding: "Wedding",
  engagement: "Engagement",
  invoice: "Invoice due",
  meeting: "Meeting",
};

const DOW = ["S", "M", "T", "W", "T", "F", "S"];

export function MiniCalendar({ large = false }: { large?: boolean }) {
  const [view, setView] = useState({ year: 2026, month: 5 }); // June 2026
  const [hovered, setHovered] = useState<string | null>(null);

  const first = new Date(view.year, view.month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const today = "2026-06-25";

  const monthName = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const eventsByDay: Record<string, CalendarEvent[]> = {};
  calendarEvents.forEach((e) => {
    const d = new Date(e.date + "T12:00:00");
    if (d.getFullYear() === view.year && d.getMonth() === view.month) {
      const key = e.date;
      (eventsByDay[key] ??= []).push(e);
    }
  });

  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const shift = (dir: number) => {
    setView((v) => {
      const m = v.month + dir;
      if (m < 0) return { year: v.year - 1, month: 11 };
      if (m > 11) return { year: v.year + 1, month: 0 };
      return { ...v, month: m };
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base text-ink">{monthName}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="grid h-7 w-7 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-blush-50 hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => shift(1)}
            aria-label="Next month"
            className="grid h-7 w-7 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-blush-50 hover:text-ink"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DOW.map((d, i) => (
          <span key={i} className="pb-1 text-[10px] font-semibold uppercase text-ink-faint">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} />;
          const key = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayEvents = eventsByDay[key] ?? [];
          const isToday = key === today;
          return (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => dayEvents.length && setHovered(key)}
              onMouseLeave={() => setHovered(null)}
            >
              <button
                className={cn(
                  "relative flex w-full flex-col items-center justify-center rounded-xl text-sm transition-colors",
                  large ? "h-16 gap-1 pt-1.5" : "h-9",
                  isToday
                    ? "bg-ink font-semibold text-canvas"
                    : dayEvents.length
                    ? "text-ink hover:bg-blush-50"
                    : "text-ink-muted hover:bg-line-soft",
                )}
              >
                {day}
                {dayEvents.length > 0 && (
                  <span className="mt-0.5 flex items-center gap-0.5">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          typeColor[e.type],
                          isToday && "ring-1 ring-canvas",
                        )}
                      />
                    ))}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {hovered === key && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.14 }}
                    className="absolute bottom-full left-1/2 z-30 mb-2 w-52 -translate-x-1/2 rounded-2xl border border-line bg-surface p-3 text-left shadow-lift"
                  >
                    <p className="mb-2 text-[11px] font-semibold text-ink-faint">
                      {new Date(key + "T12:00:00").toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <div className="space-y-2">
                      {dayEvents.map((e) => (
                        <div key={e.id} className="flex items-start gap-2">
                          <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", typeColor[e.type])} />
                          <div className="leading-tight">
                            <p className="text-xs font-medium text-ink">{e.title}</p>
                            <p className="text-[10px] text-ink-faint">{typeLabel[e.type]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-ink-muted">
        {(Object.keys(typeColor) as CalendarEvent["type"][]).map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", typeColor[t])} />
            {typeLabel[t]}
          </span>
        ))}
      </div>
    </div>
  );
}
