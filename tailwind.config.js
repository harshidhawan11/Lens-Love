/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm neutral canvas
        canvas: "#FAF7F4",
        surface: "#FFFFFF",
        "surface-2": "#FCFAF8",
        // Charcoal ink
        ink: {
          DEFAULT: "#2A2521",
          soft: "#4A433D",
          muted: "#8C837A",
          faint: "#B6ADA4",
        },
        // Muted blush accent
        blush: {
          50: "#FDF6F4",
          100: "#FAEAE6",
          200: "#F3D5CE",
          300: "#E9BAB0",
          400: "#DC9A8D",
          500: "#C9897C",
          600: "#B06F62",
          700: "#8F574C",
        },
        // Subtle gold highlight
        gold: {
          100: "#F6EFDD",
          200: "#EBDBB4",
          300: "#DCC189",
          400: "#C9A85F",
          500: "#B68F44",
          600: "#977234",
        },
        // Soft sage for success / secondary
        sage: {
          100: "#EDF2EC",
          300: "#BCCDB7",
          500: "#7E9B79",
          600: "#5F7D5B",
        },
        // Lens & Love — forest green accent
        forest: {
          DEFAULT: "#1B4332",
          dark: "#0D2818",
          light: "#2D6A4F",
        },
        ivory: "#FFF8F4",
        line: "#EDE6DF",
        "line-soft": "#F2ECE6",
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(42,37,33,0.04), 0 6px 16px rgba(42,37,33,0.05)",
        card: "0 1px 3px rgba(42,37,33,0.05), 0 12px 30px -12px rgba(42,37,33,0.12)",
        lift: "0 8px 24px -6px rgba(42,37,33,0.14), 0 24px 48px -18px rgba(42,37,33,0.18)",
        glow: "0 0 0 1px rgba(201,137,124,0.15), 0 10px 40px -12px rgba(201,137,124,0.35)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      backgroundImage: {
        "blush-gradient":
          "linear-gradient(135deg, #FAEAE6 0%, #F6EFDD 100%)",
        "gold-sheen":
          "linear-gradient(135deg, #DCC189 0%, #C9A85F 50%, #B68F44 100%)",
        "hero-glow":
          "radial-gradient(120% 120% at 0% 0%, #FAEAE6 0%, rgba(250,234,230,0) 55%), radial-gradient(120% 120% at 100% 0%, #F6EFDD 0%, rgba(246,239,221,0) 50%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "ripple-out": {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};
