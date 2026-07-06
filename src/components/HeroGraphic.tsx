import { motion } from "framer-motion";

// An abstract, wedding-inspired composition: interlocking rings,
// floating petals and a soft aperture — no literal clip art.
export function HeroGraphic() {
  return (
    <div className="relative hidden h-52 w-72 shrink-0 lg:block">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <div className="absolute right-6 top-4 h-40 w-40 rounded-full border border-blush-200/70" />
        <div className="absolute right-2 top-10 h-28 w-28 rounded-full border border-dashed border-gold-300/70" />
      </motion.div>

      <svg viewBox="0 0 280 200" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="ringA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E9BAB0" />
            <stop offset="100%" stopColor="#C9897C" />
          </linearGradient>
          <linearGradient id="ringB" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EBDBB4" />
            <stop offset="100%" stopColor="#C9A85F" />
          </linearGradient>
        </defs>

        {/* interlocking rings */}
        <motion.circle
          cx="135"
          cy="105"
          r="42"
          fill="none"
          stroke="url(#ringA)"
          strokeWidth="6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        <motion.circle
          cx="178"
          cy="105"
          r="42"
          fill="none"
          stroke="url(#ringB)"
          strokeWidth="6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.25, ease: "easeInOut" }}
        />

        {/* aperture blades */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.line
            key={i}
            x1="156"
            y1="105"
            x2={156 + 30 * Math.cos((i * Math.PI) / 3)}
            y2={105 + 30 * Math.sin((i * Math.PI) / 3)}
            stroke="#F3D5CE"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8 + i * 0.06 }}
          />
        ))}
      </svg>

      {/* floating petals */}
      {[
        { top: "12%", left: "10%", d: 4, c: "#DC9A8D" },
        { top: "70%", left: "18%", d: 5.5, c: "#C9A85F" },
        { top: "30%", left: "82%", d: 3.5, c: "#E9BAB0" },
        { top: "82%", left: "70%", d: 4.5, c: "#BCCDB7" },
      ].map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ top: p.top, left: p.left, width: p.d * 4, height: p.d * 4, background: p.c, opacity: 0.5 }}
          animate={{ y: [0, -10, 0], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
    </div>
  );
}
