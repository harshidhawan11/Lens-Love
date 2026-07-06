import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Camera,
  Package,
  Mail,
  Phone,
  Check,
  FileText,
  Download,
  Send,
  MessageCircle,
  Images,
  Plus,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { ProgressRing } from "@/components/ProgressRing";
import { InvoiceChip } from "@/components/StatusChip";
import { clients, invoices, payments, currency, formatDate } from "@/data/mock";
import { coverBg } from "@/lib/gradients";
import { cn } from "@/lib/cn";

const journeySteps = [
  "Inquiry",
  "Consultation",
  "Booking",
  "Contract Signed",
  "Deposit Paid",
  "Gallery Delivered",
  "Final Payment",
];

const messages = [
  { from: "Olivia", text: "We're so excited! Can we add a second shooter?", time: "2 days ago", me: false },
  { from: "Emma", text: "Absolutely — I'll update the package and send a revised invoice.", time: "2 days ago", me: true },
  { from: "Olivia", text: "Perfect, thank you Emma 💛", time: "1 day ago", me: false },
];

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="card p-10 text-center">
        <p className="text-ink-muted">Client not found.</p>
        <Link to="/app/clients" className="mt-3 inline-block text-blush-600 hover:underline">
          Back to clients
        </Link>
      </div>
    );
  }

  const clientInvoices = invoices.filter((i) => i.clientId === client.id);
  const clientPayments = payments.filter((p) => p.clientId === client.id);
  const completedSteps = Math.round(client.invoiceProgress * 4) + 2;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="card overflow-hidden"
      >
        <div className="relative h-44 sm:h-52" style={{ background: coverBg(client.cover) }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          <div className="absolute right-4 top-4 flex gap-2">
            <Button variant="ghost" className="!bg-white/80 backdrop-blur" icon={<Send className="h-4 w-4" />}>
              Message
            </Button>
            <Button variant="blush" icon={<FileText className="h-4 w-4" />} onClick={() => navigate("/app/invoices/new")}>
              New Invoice
            </Button>
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar seed={client.avatar} initials={client.initials} size="xl" ring />
              <div className="pb-1">
                <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {client.couple}
                </h1>
                <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                  <MapPin className="h-3.5 w-3.5" /> {client.venue} · {client.location}
                </p>
              </div>
            </div>
            <ProgressRing progress={client.invoiceProgress} size={64} stroke={7} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line-soft pt-5 sm:grid-cols-4">
            <Detail icon={Calendar} label="Wedding date" value={formatDate(client.weddingDate)} />
            <Detail icon={MapPin} label="Venue" value={client.venue} />
            <Detail icon={Package} label="Package" value={client.package} />
            <Detail icon={Camera} label="Photographer" value={client.photographer} />
          </div>
        </div>
      </motion.div>

      {/* Journey timeline */}
      <div className="card p-6">
        <h2 className="mb-6 font-display text-lg text-ink">Client journey</h2>
        <div className="relative">
          <div className="absolute left-0 right-0 top-3 hidden h-0.5 bg-line sm:block" />
          <div
            className="absolute left-0 top-3 hidden h-0.5 bg-gold-sheen sm:block"
            style={{ width: `${(Math.min(completedSteps, journeySteps.length - 1) / (journeySteps.length - 1)) * 100}%` }}
          />
          <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-7 sm:gap-y-0">
            {journeySteps.map((step, i) => {
              const done = i < completedSteps;
              const current = i === completedSteps;
              return (
                <div key={step} className="relative flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2 sm:text-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 400, damping: 20 }}
                    className={cn(
                      "z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 text-[10px]",
                      done
                        ? "border-transparent bg-gold-sheen text-white"
                        : current
                        ? "border-blush-400 bg-surface text-blush-500"
                        : "border-line bg-surface text-ink-faint",
                    )}
                  >
                    {done ? <Check className="h-3 w-3" /> : i + 1}
                  </motion.span>
                  <span className={cn("text-xs", done || current ? "font-medium text-ink" : "text-ink-faint")}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Invoices */}
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Invoices</h2>
              <Link to="/app/invoices" className="text-sm font-medium text-blush-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {clientInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-xl border border-line-soft px-4 py-3 transition-colors hover:bg-blush-50/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-blush-50 text-blush-600">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">{inv.number}</p>
                      <p className="text-xs text-ink-faint">Due {formatDate(inv.dueDate, { month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display text-sm font-semibold text-ink">{currency(inv.amount)}</span>
                    <InvoiceChip status={inv.status} />
                    <button aria-label="Download" className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted hover:bg-line-soft hover:text-ink">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery preview */}
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Gallery preview</h2>
              <span className="flex items-center gap-1.5 text-sm text-ink-muted">
                <Images className="h-4 w-4" /> 248 photos
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square rounded-lg"
                  style={{
                    background: `linear-gradient(${135 + i * 12}deg, ${
                      ["#F3D5CE", "#EBDBB4", "#BCCDB7", "#E9BAB0"][i % 4]
                    }, ${["#DC9A8D", "#C9A85F", "#7E9B79", "#C9897C"][i % 4]})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Contact + contract */}
          <div className="card p-6">
            <h2 className="mb-4 font-display text-lg text-ink">Contact</h2>
            <div className="space-y-3 text-sm">
              <a href={`mailto:${client.email}`} className="flex items-center gap-3 text-ink-soft hover:text-blush-600">
                <Mail className="h-4 w-4 text-ink-faint" /> {client.email}
              </a>
              <p className="flex items-center gap-3 text-ink-soft">
                <Phone className="h-4 w-4 text-ink-faint" /> {client.phone}
              </p>
            </div>
            <div className="mt-5 rounded-xl border border-line bg-surface-2 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink">Contract</p>
                <span className={cn(
                  "chip",
                  client.contractStatus === "signed" ? "bg-sage-100 text-sage-600" : "bg-gold-100 text-gold-600",
                )}>
                  {client.contractStatus}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">Wedding photography agreement · 6 pages</p>
              <button className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blush-600 hover:underline">
                <Download className="h-3.5 w-3.5" /> Download PDF
              </button>
            </div>
          </div>

          {/* Communication */}
          <div className="card p-6">
            <h2 className="mb-4 font-display text-lg text-ink">Communication</h2>
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.me ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                    m.me ? "bg-ink text-canvas" : "bg-blush-50 text-ink-soft",
                  )}>
                    <p>{m.text}</p>
                    <p className={cn("mt-1 text-[10px]", m.me ? "text-canvas/60" : "text-ink-faint")}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input className="input" placeholder="Write a message…" />
              <button aria-label="Send" className="btn-blush h-10 w-10 !px-0">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="card p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Notes</h2>
              <button className="grid h-7 w-7 place-items-center rounded-lg text-ink-muted hover:bg-line-soft hover:text-ink">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blush-400" />Golden hour ceremony — arrive 30 min early for venue scout.</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />Wants film + digital hybrid look.</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-500" />Surprise first dance with string quartet.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-faint">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
