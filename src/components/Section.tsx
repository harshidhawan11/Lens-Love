import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface SectionProps {
  title: string;
  subtitle?: string;
  to?: string;
  toLabel?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Section({
  title,
  subtitle,
  to,
  toLabel = "View all",
  action,
  children,
  className,
  bodyClassName,
}: SectionProps) {
  return (
    <section className={cn("card overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
        <div>
          <h2 className="font-display text-lg text-ink">{title}</h2>
          {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
        </div>
        {action ??
          (to && (
            <Link
              to={to}
              className="group inline-flex items-center gap-1 text-sm font-medium text-blush-600 hover:text-blush-700"
            >
              {toLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
      </div>
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
