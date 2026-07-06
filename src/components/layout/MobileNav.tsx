import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { mobileNavItems } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line glass px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/app"}
            className={({ isActive }) =>
              cn(
                "relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors",
                isActive ? "text-blush-600" : "text-ink-muted",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="mobile-active"
                    className="absolute -top-0.5 h-1 w-8 rounded-full bg-blush-500"
                  />
                )}
                <item.icon className="h-5 w-5" strokeWidth={1.8} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
