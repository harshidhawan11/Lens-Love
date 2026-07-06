import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign,
  Wallet,
  CalendarHeart,
  ReceiptText,
  TrendingUp,
  FileText,
  UserPlus,
  CalendarPlus,
} from "lucide-react";
import { Button } from "@/components/Button";
import { KpiCard } from "@/components/KpiCard";
import { Section } from "@/components/Section";
import { RevenueChart } from "@/components/RevenueChart";
import { MiniCalendar } from "@/components/MiniCalendar";
import { InvoiceTable } from "@/components/InvoiceTable";
import { PaymentFeed } from "@/components/PaymentFeed";
import { UpcomingWeddings } from "@/components/UpcomingWeddings";
import { RecentClients } from "@/components/RecentClients";
import { HeroGraphic } from "@/components/HeroGraphic";
import { invoices, kpis, photographer } from "@/data/mock";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-line bg-hero-glow p-6 shadow-card sm:p-8"
      >
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow mb-2">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-balance text-3xl font-semibold sm:text-4xl">
              {greeting()}, {photographer.firstName}.
            </h1>
            <p className="mt-3 text-balance text-base text-ink-soft">
              You have{" "}
              <span className="font-semibold text-blush-600">3 weddings</span> this
              week and{" "}
              <span className="font-semibold text-gold-500">5 invoices</span>{" "}
              awaiting payment.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="blush"
                icon={<FileText className="h-4 w-4" />}
                onClick={() => navigate("/app/invoices/new")}
              >
                Create Invoice
              </Button>
              <Button
                variant="ghost"
                icon={<UserPlus className="h-4 w-4" />}
                onClick={() => navigate("/app/clients")}
              >
                Add Client
              </Button>
              <Button
                variant="ghost"
                icon={<CalendarPlus className="h-4 w-4" />}
                onClick={() => navigate("/app/calendar")}
              >
                Schedule Shoot
              </Button>
            </div>
          </div>
          <HeroGraphic />
        </div>
      </motion.section>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard
          index={0}
          label="Monthly Revenue"
          value={kpis.monthlyRevenue}
          prefix="$"
          delta={kpis.monthlyRevenueDelta}
          icon={DollarSign}
          accent="blush"
        />
        <KpiCard
          index={1}
          label="Pending Payments"
          value={kpis.pendingPayments}
          prefix="$"
          delta={kpis.pendingPaymentsDelta}
          icon={Wallet}
          accent="gold"
        />
        <KpiCard
          index={2}
          label="Upcoming Weddings"
          value={kpis.upcomingWeddings}
          delta={kpis.upcomingWeddingsDelta}
          deltaSuffix=""
          icon={CalendarHeart}
          accent="sage"
        />
        <KpiCard
          index={3}
          label="Outstanding Invoices"
          value={kpis.outstandingInvoices}
          delta={kpis.outstandingInvoicesDelta}
          deltaSuffix=""
          icon={ReceiptText}
          accent="ink"
        />
        <KpiCard
          index={4}
          label="Avg. Booking Value"
          value={kpis.avgBookingValue}
          prefix="$"
          delta={kpis.avgBookingValueDelta}
          icon={TrendingUp}
          accent="blush"
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="card p-5">
            <RevenueChart />
          </div>

          <Section
            title="Invoice management"
            subtitle="Track every payment at a glance"
            to="/app/invoices"
            bodyClassName="p-2"
          >
            <InvoiceTable invoices={invoices.slice(0, 5)} />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Upcoming weddings" to="/app/weddings" toLabel="All weddings">
            <UpcomingWeddings limit={4} />
          </Section>

          <Section title="Calendar" to="/app/calendar" toLabel="Open">
            <MiniCalendar />
          </Section>
        </div>
      </div>

      {/* Lower grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Section
          title="Recent clients"
          subtitle="Contracts & payment progress"
          to="/app/clients"
          className="xl:col-span-2"
        >
          <RecentClients />
        </Section>

        <Section title="Payment activity" subtitle="Live transaction feed" to="/app/payments">
          <PaymentFeed />
        </Section>
      </div>
    </div>
  );
}
