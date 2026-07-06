import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number; // 0..1
  size?: number;
  stroke?: number;
  label?: string;
  gradientId?: string;
}

export function ProgressRing({
  progress,
  size = 48,
  stroke = 5,
  label,
  gradientId = "ringGrad",
}: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, progress));
  const uid = `${gradientId}-${size}-${Math.round(pct * 100)}`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DC9A8D" />
            <stop offset="100%" stopColor="#C9A85F" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#F2ECE6"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${uid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - c * pct }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span className="absolute font-display text-xs font-semibold text-ink">
        {label ?? `${Math.round(pct * 100)}%`}
      </span>
    </div>
  );
}
