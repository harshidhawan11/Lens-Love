import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { FloatingAction } from "@/components/layout/FloatingAction";
import { VoiceAgent } from "@/components/voice/VoiceAgent";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import ClientDetail from "@/pages/ClientDetail";
import Weddings from "@/pages/Weddings";
import CalendarPage from "@/pages/CalendarPage";
import Invoices from "@/pages/Invoices";
import InvoiceBuilder from "@/pages/InvoiceBuilder";
import Payments from "@/pages/Payments";
import Analytics from "@/pages/Analytics";
import Placeholder from "@/pages/Placeholder";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="weddings" element={<Weddings />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/new" element={<InvoiceBuilder />} />
          <Route path="payments" element={<Payments />} />
          <Route path="analytics" element={<Analytics />} />
          <Route
            path="contracts"
            element={
              <Placeholder
                title="Contracts"
                subtitle="Send, track, and e-sign wedding agreements in one calm place."
                illustration="invoices"
              />
            }
          />
          <Route
            path="galleries"
            element={
              <Placeholder
                title="Galleries"
                subtitle="Deliver breathtaking online galleries your couples will adore."
                illustration="weddings"
              />
            }
          />
          <Route
            path="settings"
            element={
              <Placeholder
                title="Settings"
                subtitle="Studio branding, payment rails, templates, and team."
                illustration="clients"
              />
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AppShell() {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="lg:pl-[264px]">
        <TopNav />
        <main className="mx-auto max-w-[1320px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          <AnimatedRoutes />
        </main>
      </div>
      <MobileNav />
      <FloatingAction />
      <VoiceAgent />
    </div>
  );
}
