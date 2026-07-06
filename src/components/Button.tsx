import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "blush" | "ghost" | "soft";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  children?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  blush: "btn-blush",
  ghost: "btn-ghost",
  soft: "btn-soft",
};

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function Button({
  variant = "primary",
  icon,
  children,
  className,
  onClick,
  ...rest
}: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  return (
    <button
      {...rest}
      className={cn(variantClass[variant], className)}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const id = Date.now();
        setRipples((r) => [
          ...r,
          { id, x: e.clientX - rect.left, y: e.clientY - rect.top, size },
        ]);
        setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 600);
        onClick?.(e);
      }}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/30"
          style={{
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
            animation: "ripple-out 0.6s ease-out forwards",
          }}
        />
      ))}
      {icon}
      {children}
    </button>
  );
}
