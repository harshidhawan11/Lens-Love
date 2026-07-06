import { avatarBg } from "@/lib/gradients";
import { cn } from "@/lib/cn";

interface AvatarProps {
  seed: string;
  initials: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  ring?: boolean;
  className?: string;
}

const sizes: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export function Avatar({
  seed,
  initials,
  size = "md",
  ring,
  className,
}: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-display font-medium text-white shadow-inset",
        sizes[size],
        ring && "ring-2 ring-white ring-offset-1 ring-offset-line",
        className,
      )}
      style={{ background: avatarBg(seed) }}
    >
      {initials}
    </span>
  );
}
