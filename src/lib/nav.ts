import {
  LayoutDashboard,
  Users,
  Heart,
  Calendar,
  FileText,
  ScrollText,
  Images,
  CreditCard,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "Clients", to: "/app/clients", icon: Users },
  { label: "Weddings", to: "/app/weddings", icon: Heart },
  { label: "Calendar", to: "/app/calendar", icon: Calendar },
  { label: "Invoices", to: "/app/invoices", icon: FileText, badge: 5 },
  { label: "Contracts", to: "/app/contracts", icon: ScrollText },
  { label: "Galleries", to: "/app/galleries", icon: Images },
  { label: "Payments", to: "/app/payments", icon: CreditCard },
  { label: "Analytics", to: "/app/analytics", icon: BarChart3 },
  { label: "Settings", to: "/app/settings", icon: Settings },
];

export const mobileNavItems: NavItem[] = [
  { label: "Home", to: "/app", icon: LayoutDashboard },
  { label: "Clients", to: "/app/clients", icon: Users },
  { label: "Invoices", to: "/app/invoices", icon: FileText },
  { label: "Calendar", to: "/app/calendar", icon: Calendar },
];
