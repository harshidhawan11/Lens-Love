import { useState } from "react";
import { motion } from "framer-motion";
import { Download, PartyPopper } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { PaymentFeed } from "@/components/PaymentFeed";
import { payments, currency } from "@/data/mock";
import { celebrate } from "@/lib/confetti";

export default function Payments() {
  const [collected] = useState(payments.reduce((s, p) => s + p.amount, 0));

  return (
    <div>
      <PageHeader
        eyebrow="Money in"
        title="Payments"
        subtitle="A calm, Stripe-style feed of every payment your studio receives."
        actions={
          <Button variant="ghost" icon={<Download className="h-4 w-4" />}>
            Export
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg text-ink">Recent payments</h2>
                <p className="text-sm text-ink-muted">{payments.length} transactions this week</p>
              </div>
              <Button
                variant="soft"
                icon={<PartyPopper className="h-4 w-4" />}
                onClick={() => celebrate()}
              >
                Simulate payment
              </Button>
            </div>
            <PaymentFeed />
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden"
          >
            <div className="bg-gold-sheen px-5 py-6 text-white">
              <p className="text-xs uppercase tracking-wider opacity-90">Collected this week</p>
              <p className="mt-1 font-display text-3xl font-semibold">{currency(collected)}</p>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Avg. payment</span>
                <span className="font-medium text-ink">{currency(collected / payments.length)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Largest</span>
                <span className="font-medium text-ink">
                  {currency(Math.max(...payments.map((p) => p.amount)))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Next payout</span>
                <span className="font-medium text-ink">Jun 27</span>
              </div>
            </div>
          </motion.div>

          <div className="card p-5">
            <h3 className="mb-3 font-display text-base text-ink">Payment methods</h3>
            <div className="space-y-3">
              {[
                { label: "Cards", pct: 64, color: "#DC9A8D" },
                { label: "Bank transfer", pct: 26, color: "#C9A85F" },
                { label: "Apple Pay", pct: 10, color: "#7E9B79" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-ink-soft">{m.label}</span>
                    <span className="font-medium text-ink">{m.pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-line-soft">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: m.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
