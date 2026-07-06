import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { cn } from "@/lib/cn";

interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta: number;
  deltaSuffix?: string;
  icon: LucideIcon;
  accent: "blush" | "gold" | "sage" | "ink";
  index?: number;
}

const accentMap = {
  blush: { bg: "bg-blush-100", text: "text-blush-600" },
  gold: { bg: "bg-gold-100", text: "text-gold-500" },
  sage: { bg: "bg-sage-100", text: "text-sage-600" },
  ink: { bg: "bg-ink/5", text: "text-ink" },
};

export function KpiCard({
  label,
  value,
  prefix,
  suffix,
  decimals,
  delta,
  deltaSuffix,
  icon: Icon,
  accent,
  index = 0,
}: KpiCardProps) {
  const positive = delta >= 0;
  const a = accentMap[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="card card-hover group p-5"
    >
      <div className="flex items-center justify-between">
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl", a.bg, a.text)}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </span>
        <span
          className={cn(
            "chip",
            positive ? "bg-sage-100 text-sage-600" : "bg-blush-100 text-blush-700",
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(delta)}
          {deltaSuffix ?? "%"}
        </span>
      </div>
      <p className="mt-4 text-sm text-ink-muted">{label}</p>
      <p className="mt-1 font-display text-[26px] font-semibold tracking-tight text-ink">
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
        />
      </p>
    </motion.div>
  );
}
