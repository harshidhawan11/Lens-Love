// Centralized mock data for Lumière Studio.
// All numbers are illustrative and chosen to make the UI feel alive.

export type InvoiceStatus =
  | "paid"
  | "partial"
  | "overdue"
  | "draft"
  | "pending";

export type WeddingStatus = "confirmed" | "deposit" | "inquiry" | "delivered";

export interface Client {
  id: string;
  couple: string;
  partnerA: string;
  partnerB: string;
  initials: string;
  email: string;
  phone: string;
  avatar: string; // gradient seed
  cover: string; // gradient seed
  package: string;
  packageValue: number;
  weddingDate: string; // ISO
  venue: string;
  location: string;
  photographer: string;
  contractStatus: "signed" | "sent" | "draft";
  invoiceProgress: number; // 0..1 paid
  status: WeddingStatus;
}

export interface Wedding {
  id: string;
  clientId: string;
  couple: string;
  date: string; // ISO
  venue: string;
  location: string;
  package: string;
  status: WeddingStatus;
  cover: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  couple: string;
  amount: number;
  paid: number;
  dueDate: string; // ISO
  status: InvoiceStatus;
}

export interface Payment {
  id: string;
  clientId: string;
  couple: string;
  amount: number;
  method: "Visa" | "Mastercard" | "Bank transfer" | "Amex" | "Apple Pay";
  date: string; // ISO
  invoiceNumber: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO (yyyy-mm-dd)
  type: "wedding" | "engagement" | "invoice" | "meeting";
}

export const photographer = {
  name: "Matt Sullivan",
  firstName: "Matt",
  studio: "Lens & Love",
  email: "matt@lensandlove.com",
  role: "Lead Photographer",
};

// gradient seeds rendered by the Avatar/Cover components
export const clients: Client[] = [
  {
    id: "c1",
    couple: "Olivia & James",
    partnerA: "Olivia Bennett",
    partnerB: "James Carter",
    initials: "OJ",
    email: "olivia.bennett@email.com",
    phone: "+1 (415) 555-0142",
    avatar: "blush",
    cover: "dusk",
    package: "Signature Collection",
    packageValue: 8400,
    weddingDate: "2026-06-27",
    venue: "Beaulieu Garden",
    location: "Napa Valley, CA",
    photographer: "Emma Hartwell",
    contractStatus: "signed",
    invoiceProgress: 0.65,
    status: "confirmed",
  },
  {
    id: "c2",
    couple: "Sofia & Daniel",
    partnerA: "Sofia Reyes",
    partnerB: "Daniel Kim",
    initials: "SD",
    email: "sofia.reyes@email.com",
    phone: "+1 (212) 555-0188",
    avatar: "gold",
    cover: "champagne",
    package: "Heirloom Collection",
    packageValue: 12200,
    weddingDate: "2026-06-29",
    venue: "The Foundry",
    location: "Long Island City, NY",
    photographer: "Emma Hartwell",
    contractStatus: "signed",
    invoiceProgress: 0.5,
    status: "confirmed",
  },
  {
    id: "c3",
    couple: "Maya & Aria",
    partnerA: "Maya Patel",
    partnerB: "Aria Lindgren",
    initials: "MA",
    email: "maya.patel@email.com",
    phone: "+1 (310) 555-0119",
    avatar: "sage",
    cover: "garden",
    package: "Signature Collection",
    packageValue: 9100,
    weddingDate: "2026-07-02",
    venue: "Sunstone Villa",
    location: "Santa Ynez, CA",
    photographer: "Emma Hartwell",
    contractStatus: "sent",
    invoiceProgress: 0.3,
    status: "deposit",
  },
  {
    id: "c4",
    couple: "Chloé & Marc",
    partnerA: "Chloé Dubois",
    partnerB: "Marc Laurent",
    initials: "CM",
    email: "chloe.dubois@email.com",
    phone: "+1 (646) 555-0173",
    avatar: "blush",
    cover: "dusk",
    package: "Destination Collection",
    packageValue: 15800,
    weddingDate: "2026-07-18",
    venue: "Château de Varennes",
    location: "Burgundy, France",
    photographer: "Emma Hartwell",
    contractStatus: "signed",
    invoiceProgress: 0.4,
    status: "confirmed",
  },
  {
    id: "c5",
    couple: "Isabella & Noah",
    partnerA: "Isabella Russo",
    partnerB: "Noah Fischer",
    initials: "IN",
    email: "bella.russo@email.com",
    phone: "+1 (305) 555-0150",
    avatar: "gold",
    cover: "champagne",
    package: "Essential Collection",
    packageValue: 6200,
    weddingDate: "2026-08-09",
    venue: "Vizcaya Gardens",
    location: "Miami, FL",
    photographer: "Emma Hartwell",
    contractStatus: "draft",
    invoiceProgress: 0,
    status: "inquiry",
  },
  {
    id: "c6",
    couple: "Grace & Ethan",
    partnerA: "Grace Whitfield",
    partnerB: "Ethan Brooks",
    initials: "GE",
    email: "grace.whitfield@email.com",
    phone: "+1 (503) 555-0166",
    avatar: "sage",
    cover: "garden",
    package: "Heirloom Collection",
    packageValue: 11400,
    weddingDate: "2026-05-16",
    venue: "Columbia Gorge",
    location: "Portland, OR",
    photographer: "Emma Hartwell",
    contractStatus: "signed",
    invoiceProgress: 1,
    status: "delivered",
  },
];

export const weddings: Wedding[] = clients
  .filter((c) => c.status !== "inquiry")
  .map((c) => ({
    id: `w-${c.id}`,
    clientId: c.id,
    couple: c.couple,
    date: c.weddingDate,
    venue: c.venue,
    location: c.location,
    package: c.package,
    status: c.status,
    cover: c.cover,
  }))
  .sort((a, b) => +new Date(a.date) - +new Date(b.date));

export const invoices: Invoice[] = [
  {
    id: "i1",
    number: "INV-2041",
    clientId: "c1",
    couple: "Olivia & James",
    amount: 8400,
    paid: 5460,
    dueDate: "2026-06-30",
    status: "partial",
  },
  {
    id: "i2",
    number: "INV-2042",
    clientId: "c2",
    couple: "Sofia & Daniel",
    amount: 12200,
    paid: 6100,
    dueDate: "2026-06-20",
    status: "overdue",
  },
  {
    id: "i3",
    number: "INV-2043",
    clientId: "c3",
    couple: "Maya & Aria",
    amount: 9100,
    paid: 2730,
    dueDate: "2026-07-05",
    status: "partial",
  },
  {
    id: "i4",
    number: "INV-2044",
    clientId: "c4",
    couple: "Chloé & Marc",
    amount: 15800,
    paid: 6320,
    dueDate: "2026-07-10",
    status: "pending",
  },
  {
    id: "i5",
    number: "INV-2045",
    clientId: "c5",
    couple: "Isabella & Noah",
    amount: 6200,
    paid: 0,
    dueDate: "2026-08-01",
    status: "draft",
  },
  {
    id: "i6",
    number: "INV-2039",
    clientId: "c6",
    couple: "Grace & Ethan",
    amount: 11400,
    paid: 11400,
    dueDate: "2026-05-20",
    status: "paid",
  },
  {
    id: "i7",
    number: "INV-2038",
    clientId: "c1",
    couple: "Olivia & James",
    amount: 1200,
    paid: 1200,
    dueDate: "2026-04-15",
    status: "paid",
  },
];

export const payments: Payment[] = [
  {
    id: "p1",
    clientId: "c1",
    couple: "Olivia & James",
    amount: 2940,
    method: "Visa",
    date: "2026-06-24T14:22:00",
    invoiceNumber: "INV-2041",
  },
  {
    id: "p2",
    clientId: "c6",
    couple: "Grace & Ethan",
    amount: 5700,
    method: "Bank transfer",
    date: "2026-06-23T09:05:00",
    invoiceNumber: "INV-2039",
  },
  {
    id: "p3",
    clientId: "c2",
    couple: "Sofia & Daniel",
    amount: 6100,
    method: "Mastercard",
    date: "2026-06-21T17:48:00",
    invoiceNumber: "INV-2042",
  },
  {
    id: "p4",
    clientId: "c4",
    couple: "Chloé & Marc",
    amount: 6320,
    method: "Amex",
    date: "2026-06-19T11:30:00",
    invoiceNumber: "INV-2044",
  },
  {
    id: "p5",
    clientId: "c3",
    couple: "Maya & Aria",
    amount: 2730,
    method: "Apple Pay",
    date: "2026-06-17T08:14:00",
    invoiceNumber: "INV-2043",
  },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", title: "Olivia & James · Wedding", date: "2026-06-27", type: "wedding" },
  { id: "e2", title: "Sofia & Daniel · Wedding", date: "2026-06-29", type: "wedding" },
  { id: "e3", title: "Maya & Aria · Wedding", date: "2026-07-02", type: "wedding" },
  { id: "e4", title: "Bennett engagement shoot", date: "2026-06-25", type: "engagement" },
  { id: "e5", title: "INV-2041 due", date: "2026-06-30", type: "invoice" },
  { id: "e6", title: "INV-2042 due", date: "2026-06-20", type: "invoice" },
  { id: "e7", title: "Consult · Isabella & Noah", date: "2026-06-26", type: "meeting" },
  { id: "e8", title: "Reyes pre-wedding call", date: "2026-06-28", type: "meeting" },
  { id: "e9", title: "Patel engagement shoot", date: "2026-06-22", type: "engagement" },
];

export const revenueSeries = {
  week: [
    { label: "Mon", income: 2940, paid: 2940, outstanding: 1200 },
    { label: "Tue", income: 0, paid: 0, outstanding: 1200 },
    { label: "Wed", income: 6100, paid: 6100, outstanding: 3100 },
    { label: "Thu", income: 0, paid: 0, outstanding: 3100 },
    { label: "Fri", income: 5700, paid: 5700, outstanding: 2400 },
    { label: "Sat", income: 6320, paid: 6320, outstanding: 2400 },
    { label: "Sun", income: 2730, paid: 2730, outstanding: 2400 },
  ],
  month: [
    { label: "Wk 1", income: 9200, paid: 8400, outstanding: 4200 },
    { label: "Wk 2", income: 14800, paid: 12200, outstanding: 6800 },
    { label: "Wk 3", income: 11500, paid: 11500, outstanding: 5200 },
    { label: "Wk 4", income: 18740, paid: 17790, outstanding: 8100 },
  ],
  quarter: [
    { label: "Apr", income: 38200, paid: 35100, outstanding: 9200 },
    { label: "May", income: 42600, paid: 41000, outstanding: 7400 },
    { label: "Jun", income: 54240, paid: 49890, outstanding: 12400 },
  ],
  year: [
    { label: "Jan", income: 22400, paid: 22400, outstanding: 3200 },
    { label: "Feb", income: 18600, paid: 18600, outstanding: 2800 },
    { label: "Mar", income: 31200, paid: 29800, outstanding: 6400 },
    { label: "Apr", income: 38200, paid: 35100, outstanding: 9200 },
    { label: "May", income: 42600, paid: 41000, outstanding: 7400 },
    { label: "Jun", income: 54240, paid: 49890, outstanding: 12400 },
    { label: "Jul", income: 48900, paid: 0, outstanding: 31200 },
    { label: "Aug", income: 36400, paid: 0, outstanding: 24800 },
    { label: "Sep", income: 41200, paid: 0, outstanding: 0 },
    { label: "Oct", income: 52800, paid: 0, outstanding: 0 },
    { label: "Nov", income: 29400, paid: 0, outstanding: 0 },
    { label: "Dec", income: 18200, paid: 0, outstanding: 0 },
  ],
};

export const packageMix = [
  { name: "Heirloom", value: 38, color: "#C9A85F" },
  { name: "Signature", value: 32, color: "#DC9A8D" },
  { name: "Destination", value: 18, color: "#7E9B79" },
  { name: "Essential", value: 12, color: "#B6ADA4" },
];

export const leadSources = [
  { source: "Referrals", value: 42 },
  { source: "Instagram", value: 28 },
  { source: "The Knot", value: 16 },
  { source: "Website", value: 14 },
];

// Derived KPI values
export const kpis = {
  monthlyRevenue: 54240,
  monthlyRevenueDelta: 12.4,
  pendingPayments: 18420,
  pendingPaymentsDelta: -4.2,
  upcomingWeddings: 5,
  upcomingWeddingsDelta: 2,
  outstandingInvoices: 5,
  outstandingInvoicesDelta: -1,
  avgBookingValue: 10516,
  avgBookingValueDelta: 6.8,
};

export function currency(n: number, compact = false): string {
  if (compact && Math.abs(n) >= 1000) {
    return "$" + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
  }
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function daysUntil(iso: string): number {
  const today = new Date("2026-06-25T12:00:00");
  const target = new Date(iso + "T12:00:00");
  return Math.round((+target - +today) / 86400000);
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(iso + (iso.length === 10 ? "T12:00:00" : "")).toLocaleDateString(
    "en-US",
    opts ?? { month: "short", day: "numeric", year: "numeric" },
  );
}
