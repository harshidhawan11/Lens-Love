import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Bell,
  Plus,
  TrendingUp,
  FileText,
  UserPlus,
  CalendarPlus,
  Command,
  Mic,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { currency, kpis, photographer } from "@/data/mock";
import { useVoiceAgent } from "@/context/VoiceAgentContext";
import { cn } from "@/lib/cn";

const quickActions = [
  { label: "Create Invoice", icon: FileText, to: "/app/invoices/new", accent: "text-blush-600" },
  { label: "Add Client", icon: UserPlus, to: "/app/clients", accent: "text-gold-500" },
  { label: "Schedule Shoot", icon: CalendarPlus, to: "/app/calendar", accent: "text-sage-500" },
];

const notifications = [
  { id: 1, text: "Payment of $2,940 received from Olivia & James", time: "2h ago", dot: "bg-sage-500" },
  { id: 2, text: "INV-2042 is now overdue", time: "5h ago", dot: "bg-blush-500" },
  { id: 3, text: "Maya & Aria signed their contract", time: "Yesterday", dot: "bg-gold-400" },
];

export function TopNav({ onMenu }: { onMenu?: () => void }) {
  const [quickOpen, setQuickOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const { status, setPanelOpen, startListening, stopListening } = useVoiceAgent();
  const listening = status === "listening";

  const toggleVoice = () => {
    setQuickOpen(false);
    setNotifOpen(false);
    if (listening) {
      stopListening();
    } else {
      setPanelOpen(true);
      startListening();
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line glass">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/app" className="flex items-center gap-2 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white">
            <span className="font-display text-base italic">L</span>
          </span>
        </Link>

        {/* Global search */}
        <div className="relative ml-auto hidden w-full max-w-md md:block lg:ml-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            className="input pl-10 pr-16"
            placeholder="Search clients, invoices, weddings…"
            aria-label="Global search"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-line bg-surface px-1.5 py-0.5 text-[10px] text-ink-faint sm:flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {/* Current month revenue */}
          <div className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 shadow-soft xl:flex">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-sage-100 text-sage-600">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <div className="leading-none">
              <p className="text-[10px] uppercase tracking-wider text-ink-faint">
                June revenue
              </p>
              <p className="text-sm font-semibold text-ink">
                {currency(kpis.monthlyRevenue)}
              </p>
            </div>
          </div>

          {/* Voice assistant — always visible */}
          <button
            onClick={toggleVoice}
            aria-label="Voice assistant"
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium shadow-soft transition-colors",
              listening
                ? "border-blush-400 bg-blush-500 text-white"
                : "border-forest/20 bg-forest text-white hover:bg-forest-light",
            )}
          >
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">{listening ? "Listening…" : "Voice"}</span>
          </button>

          {/* Quick create */}
          <div className="relative">
            <button
              onClick={() => {
                setQuickOpen((v) => !v);
                setNotifOpen(false);
              }}
              aria-label="Quick create"
              className="btn-blush h-10 w-10 !px-0"
            >
              <motion.span animate={{ rotate: quickOpen ? 45 : 0 }}>
                <Plus className="h-5 w-5" />
              </motion.span>
            </button>
            <AnimatePresence>
              {quickOpen && (
                <Dropdown onClose={() => setQuickOpen(false)}>
                  <p className="px-3 pb-2 pt-1 eyebrow">Quick create</p>
                  {quickActions.map((a) => (
                    <button
                      key={a.label}
                      onClick={() => {
                        setQuickOpen(false);
                        navigate(a.to);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-blush-50"
                    >
                      <a.icon className={`h-4 w-4 ${a.accent}`} />
                      {a.label}
                    </button>
                  ))}
                </Dropdown>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setQuickOpen(false);
              }}
              aria-label="Notifications"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-soft transition-colors hover:border-blush-300 hover:text-ink"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blush-500 ring-2 ring-surface" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <Dropdown onClose={() => setNotifOpen(false)} wide>
                  <div className="flex items-center justify-between px-3 pb-2 pt-1">
                    <p className="eyebrow">Notifications</p>
                    <button className="text-[11px] font-medium text-blush-600 hover:underline">
                      Mark all read
                    </button>
                  </div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-blush-50"
                    >
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.dot}`} />
                      <div>
                        <p className="text-sm leading-snug text-ink-soft">{n.text}</p>
                        <p className="mt-0.5 text-[11px] text-ink-faint">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </Dropdown>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <button aria-label="Profile" className="rounded-full transition-transform hover:scale-105">
            <Avatar seed="blush" initials="MS" size="sm" ring />
          </button>
          <span className="hidden text-sm font-medium text-ink lg:block">
            {photographer.firstName}
          </span>
        </div>
      </div>
    </header>
  );
}

function Dropdown({
  children,
  onClose,
  wide,
}: {
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute right-0 z-20 mt-2 origin-top-right rounded-2xl border border-line bg-surface p-2 shadow-lift ${
          wide ? "w-80" : "w-56"
        }`}
      >
        {children}
      </motion.div>
    </>
  );
}
