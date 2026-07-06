import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { photographer } from "@/data/mock";
import { Avatar } from "@/components/Avatar";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-line bg-surface/70 px-4 py-6 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-white shadow-soft">
          <Heart className="h-4 w-4 fill-current" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-[15px] text-ink">Lens & Love</p>
          <p className="text-[11px] text-ink-muted">Studio OS</p>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/app"}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "text-ink"
                  : "text-ink-muted hover:bg-blush-50 hover:text-ink",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-blush-100 shadow-soft"
                    transition={{ type: "spring", stiffness: 450, damping: 38 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "relative z-10 h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110",
                    isActive && "text-blush-600",
                  )}
                  strokeWidth={1.8}
                />
                <span className="relative z-10 font-medium">{item.label}</span>
                {item.badge && (
                  <span className="relative z-10 ml-auto rounded-full bg-blush-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface-2 p-3">
        <Avatar seed="blush" initials="MS" size="sm" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium text-ink">
            {photographer.name}
          </p>
          <p className="truncate text-[11px] text-ink-muted">
            {photographer.role}
          </p>
        </div>
      </div>
    </aside>
  );
}
