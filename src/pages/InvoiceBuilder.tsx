import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  Sparkles,
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  Mic,
} from "lucide-react";
import { Button } from "@/components/Button";
import { clients, currency } from "@/data/mock";
import { celebrate } from "@/lib/confetti";
import { useVoiceAgent } from "@/context/VoiceAgentContext";
import { cn } from "@/lib/cn";

interface LineItem {
  id: number;
  description: string;
  qty: number;
  rate: number;
}

let nextId = 5;

const packagePresets: Record<string, { label: string; items: Omit<LineItem, "id">[] }> = {
  essential: {
    label: "Essential Collection",
    items: [
      { description: "6 hours wedding coverage", qty: 1, rate: 4200 },
      { description: "Online gallery delivery", qty: 1, rate: 0 },
    ],
  },
  signature: {
    label: "Signature Collection",
    items: [
      { description: "10 hours wedding coverage", qty: 1, rate: 6500 },
      { description: "Second photographer", qty: 1, rate: 1200 },
      { description: "Engagement session", qty: 1, rate: 700 },
    ],
  },
  heirloom: {
    label: "Heirloom Collection",
    items: [
      { description: "Full-day wedding coverage", qty: 1, rate: 9200 },
      { description: "Second photographer", qty: 1, rate: 1200 },
      { description: "Album design & print", qty: 1, rate: 1800 },
    ],
  },
};

export default function InvoiceBuilder() {
  const navigate = useNavigate();
  const { registerInvoiceHandlers, setPanelOpen } = useVoiceAgent();
  const [clientId, setClientId] = useState(clients[0].id);
  const [packageKey, setPackageKey] = useState("signature");
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "Signature wedding coverage — 10 hours", qty: 1, rate: 6500 },
    { id: 2, description: "Second photographer", qty: 1, rate: 1200 },
    { id: 3, description: "Engagement session", qty: 1, rate: 700 },
  ]);
  const [taxRate, setTaxRate] = useState(8.5);
  const [discount, setDiscount] = useState(5);
  const [deposit, setDeposit] = useState(40);
  const [files, setFiles] = useState<string[]>(["moodboard.pdf"]);
  const [dragging, setDragging] = useState(false);
  const [paid, setPaid] = useState(false);

  const applyPackage = (key: string) => {
    setPackageKey(key);
    const preset = packagePresets[key];
    if (!preset) return;
    setItems(preset.items.map((item) => ({ ...item, id: nextId++ })));
  };

  const addOvertime = useCallback(() => {
    setItems((arr) => [
      ...arr,
      { id: nextId++, description: "Overtime / overages (per hour)", qty: 1, rate: 350 },
    ]);
  }, []);

  const addLine = useCallback((description: string, rate: number) => {
    setItems((arr) => [...arr, { id: nextId++, description, qty: 1, rate }]);
  }, []);

  const adjustLastRate = useCallback((delta: number) => {
    setItems((arr) => {
      if (!arr.length) return arr;
      const copy = [...arr];
      const last = copy[copy.length - 1];
      copy[copy.length - 1] = { ...last, rate: Math.max(0, last.rate + delta) };
      return copy;
    });
  }, []);

  const setLastRate = useCallback((value: number) => {
    setItems((arr) => {
      if (!arr.length) return arr;
      const copy = [...arr];
      copy[copy.length - 1] = { ...copy[copy.length - 1], rate: Math.max(0, value) };
      return copy;
    });
  }, []);

  useEffect(() => {
    registerInvoiceHandlers({
      addOvertime,
      setDiscount,
      setDeposit,
      setTax: setTaxRate,
      applyPackage,
      adjustLastRate,
      setLastRate,
      addLine,
      selectClient: setClientId,
    });
    return () => registerInvoiceHandlers(null);
  }, [
    registerInvoiceHandlers,
    addOvertime,
    addLine,
    adjustLastRate,
    setLastRate,
    applyPackage,
  ]);

  const client = clients.find((c) => c.id === clientId)!;

  const { subtotal, discountAmt, taxAmt, total, depositAmt, balance } = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
    const discountAmt = (subtotal * discount) / 100;
    const taxable = subtotal - discountAmt;
    const taxAmt = (taxable * taxRate) / 100;
    const total = taxable + taxAmt;
    const depositAmt = (total * deposit) / 100;
    return { subtotal, discountAmt, taxAmt, total, depositAmt, balance: total - depositAmt };
  }, [items, taxRate, discount, deposit]);

  const update = (id: number, patch: Partial<LineItem>) =>
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const invoiceNumber = "INV-2046";

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to invoices
      </button>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-1">New invoice</p>
          <h1 className="text-2xl font-semibold sm:text-[28px]">Invoice builder</h1>
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-blush-600 hover:underline"
          >
            <Mic className="h-3.5 w-3.5" /> Voice edit — say add overtime, set deposit to 40%, etc.
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost">Save draft</Button>
          <Button variant="ghost" icon={<Send className="h-4 w-4" />}>
            Send payment link
          </Button>
          <Button
            variant="blush"
            icon={<Send className="h-4 w-4" />}
            onClick={(e) => {
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              setPaid(true);
              celebrate({ x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight });
            }}
          >
            Send & mark paid
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left — live preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.div
            layout
            className="card overflow-hidden"
          >
            {/* branded header */}
            <div className="bg-hero-glow px-8 py-7">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-white">
                    <span className="font-display text-lg italic">L</span>
                  </span>
                  <div>
                    <p className="font-display text-lg text-ink">Lens & Love</p>
                    <p className="text-xs text-ink-muted">emma@lensandlove.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="eyebrow">Invoice</p>
                  <p className="font-display text-lg text-ink">{invoiceNumber}</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-faint">Billed to</p>
                  <p className="mt-1 font-display text-base text-ink">{client.couple}</p>
                  <p className="text-xs text-ink-muted">{client.email}</p>
                  <p className="text-xs text-ink-muted">{client.venue}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wider text-ink-faint">Wedding date</p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {new Date(client.weddingDate + "T12:00:00").toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-3">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={paid ? "paid" : "due"}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        className={cn(
                          "chip",
                          paid ? "bg-sage-100 text-sage-600" : "bg-gold-100 text-gold-600",
                        )}
                      >
                        {paid ? <CheckCircle2 className="h-3 w-3" /> : null}
                        {paid ? "Paid in full" : "Awaiting payment"}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between border-b border-line pb-2 text-[11px] uppercase tracking-wider text-ink-faint">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                {items.map((it) => (
                  <motion.div
                    layout
                    key={it.id}
                    className="flex items-start justify-between gap-4 py-1.5 text-sm"
                  >
                    <span className="text-ink-soft">
                      {it.description || "—"}
                      {it.qty > 1 && <span className="text-ink-faint"> × {it.qty}</span>}
                    </span>
                    <span className="shrink-0 font-medium text-ink">{currency(it.qty * it.rate)}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm">
                <Row label="Subtotal" value={currency(subtotal)} />
                <Row label={`Discount (${discount}%)`} value={`– ${currency(discountAmt)}`} muted />
                <Row label={`Tax (${taxRate}%)`} value={currency(taxAmt)} muted />
                <motion.div layout className="mt-2 flex items-center justify-between border-t border-line pt-3">
                  <span className="font-display text-base text-ink">Total</span>
                  <motion.span
                    key={total}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    className="font-display text-xl font-semibold text-ink"
                  >
                    {currency(total)}
                  </motion.span>
                </motion.div>
                <div className="mt-3 rounded-xl bg-surface-2 p-3 text-xs">
                  <div className="flex justify-between text-ink-muted">
                    <span>Deposit due now ({deposit}%)</span>
                    <span className="font-medium text-ink">{currency(depositAmt)}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-ink-muted">
                    <span>Balance before wedding</span>
                    <span className="font-medium text-ink">{currency(balance)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right — editor */}
        <div className="space-y-5">
          <div className="card p-5">
            <label className="eyebrow">Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="input mt-2"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.couple} — {c.venue}
                </option>
              ))}
            </select>

            <label className="eyebrow mt-4 block">Package</label>
            <select
              value={packageKey}
              onChange={(e) => applyPackage(e.target.value)}
              className="input mt-2"
            >
              {Object.entries(packagePresets).map(([key, pkg]) => (
                <option key={key} value={key}>
                  {pkg.label}
                </option>
              ))}
              <option value="custom">Custom package</option>
            </select>
            <p className="mt-2 text-xs text-ink-muted">
              40% deposit due before the event · balance sent as payment link after.
            </p>
          </div>

          <div className="card p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base text-ink">Services</h3>
              <div className="flex gap-2">
                <button onClick={addOvertime} className="btn-soft">
                  + Overtime
                </button>
                <button
                  onClick={() => setItems((a) => [...a, { id: nextId++, description: "", qty: 1, rate: 0 }])}
                  className="btn-soft"
                >
                  <Plus className="h-4 w-4" /> Add line
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {items.map((it) => (
                  <motion.div
                    key={it.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2"
                  >
                    <input
                      value={it.description}
                      onChange={(e) => update(it.id, { description: e.target.value })}
                      placeholder="Service description"
                      className="input flex-1"
                    />
                    <input
                      type="number"
                      value={it.qty}
                      min={1}
                      onChange={(e) => update(it.id, { qty: Math.max(1, +e.target.value) })}
                      className="input w-16 text-center"
                    />
                    <div className="relative w-28">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-faint">$</span>
                      <input
                        type="number"
                        value={it.rate}
                        onChange={(e) => update(it.id, { rate: +e.target.value })}
                        className="input pl-6"
                      />
                    </div>
                    <button
                      onClick={() => setItems((a) => a.filter((x) => x.id !== it.id))}
                      aria-label="Remove"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-blush-50 hover:text-blush-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 font-display text-base text-ink">Adjustments</h3>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Discount %" value={discount} onChange={setDiscount} />
              <Field label="Tax %" value={taxRate} onChange={setTaxRate} step={0.5} />
              <Field label="Deposit %" value={deposit} onChange={setDeposit} step={5} />
            </div>
          </div>

          {/* Drag & drop attachments */}
          <div className="card p-5">
            <h3 className="mb-3 font-display text-base text-ink">Attachments</h3>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const dropped = Array.from(e.dataTransfer.files).map((f) => f.name);
                setFiles((f) => [...f, ...(dropped.length ? dropped : ["contract-addendum.pdf"])]);
              }}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors",
                dragging ? "border-blush-400 bg-blush-50" : "border-line bg-surface-2",
              )}
            >
              <motion.div animate={{ y: dragging ? -4 : 0 }}>
                <UploadCloud className={cn("h-7 w-7", dragging ? "text-blush-500" : "text-ink-faint")} />
              </motion.div>
              <p className="mt-2 text-sm text-ink-soft">
                Drag & drop files, or{" "}
                <button
                  onClick={() => setFiles((f) => [...f, `attachment-${f.length + 1}.pdf`])}
                  className="font-medium text-blush-600 hover:underline"
                >
                  browse
                </button>
              </p>
            </div>
            <div className="mt-3 space-y-2">
              <AnimatePresence>
                {files.map((f) => (
                  <motion.div
                    key={f}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="flex items-center gap-2 rounded-xl border border-line-soft px-3 py-2 text-sm"
                  >
                    <FileCheck2 className="h-4 w-4 text-sage-600" />
                    <span className="flex-1 truncate text-ink-soft">{f}</span>
                    <button
                      onClick={() => setFiles((arr) => arr.filter((x) => x !== f))}
                      className="text-ink-faint hover:text-blush-600"
                      aria-label="Remove file"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-blush-50 px-4 py-3 text-sm text-blush-700">
            <Sparkles className="h-4 w-4" />
            Tip: a 40% deposit secures the date — your average is 38%.
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={cn("flex justify-between", muted ? "text-ink-muted" : "text-ink-soft")}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-ink-faint">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(+e.target.value)}
        className="input mt-1.5"
      />
    </div>
  );
}
