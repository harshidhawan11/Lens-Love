import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight, Mouse, Hand } from "lucide-react";
import { LoginModal } from "@/components/landing/LoginModal";
import { cn } from "@/lib/cn";

const photos = [
  { src: "/images/hero-beach.png", label: "Beach sunset" },
  { src: "/images/wed-mountain.png", label: "Mountain vows" },
  { src: "/images/wed-garden.png", label: "Garden ceremony" },
  { src: "/images/wed-ballroom.png", label: "Ballroom dance" },
  { src: "/images/wed-winter.png", label: "Winter wonder" },
];

export default function Landing() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [entering, setEntering] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const lensScale = useTransform(scrollYProgress, [0, 0.45, 0.75], [1, 1.55, 2.2]);
  const lensOpacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0]);
  const carouselOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const carouselX = useTransform(scrollYProgress, [0.4, 1], ["0%", "-55%"]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const handleSignIn = () => {
    setLoginOpen(false);
    setEntering(true);
    setTimeout(() => navigate("/app"), 900);
  };

  return (
    <div className="bg-ivory text-forest">
      <AnimatePresence>
        {entering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-dark"
          >
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 8, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="h-32 w-32 rounded-full border-4 border-blush-300/40 bg-forest-dark"
              style={{
                boxShadow: "inset 0 0 0 12px rgba(255,255,255,0.08), 0 0 80px rgba(233,186,176,0.3)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSignIn={handleSignIn} />

      {/* Nav */}
      <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white">
            <Heart className="h-4 w-4 fill-current" />
          </span>
          <span className="font-display text-lg text-forest">Lens & Love</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-forest/80 md:flex">
          {["Features", "Pricing", "About", "Contact"].map((item) => (
            <button key={item} className="transition hover:text-forest">
              {item}
            </button>
          ))}
        </nav>
      </header>

      {/* Hero — first viewport */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(233,186,176,0.25),transparent_55%)]" />

        <motion.div style={{ opacity: heroTextOpacity }} className="relative z-10 mb-8 text-center">
          <h1 className="font-display text-4xl leading-tight text-forest sm:text-5xl md:text-6xl">
            Capture Love.
            <br />
            <span className="italic text-blush-500">Manage Everything.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink-muted sm:text-base">
            The all-in-one platform for photographers to manage weddings, clients,
            galleries, invoices, contracts and payments.
          </p>
          <button
            onClick={() => containerRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="mt-6 rounded-full bg-blush-400 px-8 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-blush-500"
          >
            Explore Through the Lens
          </button>
        </motion.div>

        {/* Camera lens */}
        <motion.div
          style={{ scale: lensScale, opacity: lensOpacity }}
          className="relative z-20 mt-4"
        >
          <div className="relative h-[min(62vw,420px)] w-[min(62vw,420px)]">
            {/* outer ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-forest via-forest-light to-forest-dark p-[14px] shadow-lift">
              <div className="absolute inset-2 rounded-full border border-white/10" />
              {/* engraved text */}
              <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-[spin_80s_linear_infinite]">
                <defs>
                  <path id="lensText" d="M 200,200 m -155,0 a 155,155 0 1,1 310,0 a 155,155 0 1,1 -310,0" />
                </defs>
                <text fill="rgba(255,255,255,0.35)" fontSize="11" letterSpacing="3">
                  <textPath href="#lensText">
                    50mm f/1.2 · LENS & LOVE · CAPTURING FOREVER · WEDDING STORIES ·
                  </textPath>
                </text>
              </svg>

              {/* glass */}
              <div className="absolute inset-[18px] overflow-hidden rounded-full bg-black shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]">
                <img
                  src="/images/hero-beach.png"
                  alt="Bride and groom on the beach at sunset"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.18),transparent_45%)]" />
                <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          style={{ opacity: heroTextOpacity }}
          className="mt-8 flex items-center gap-2 text-xs text-ink-muted"
        >
          <Mouse className="h-4 w-4" /> Scroll to zoom in
        </motion.p>
      </section>

      {/* Scroll driver + carousel */}
      <div ref={containerRef} className="relative h-[220vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <motion.div style={{ opacity: carouselOpacity }} className="absolute inset-0 flex items-center">
            <motion.div style={{ x: carouselX }} className="flex gap-6 px-[20vw]">
              {photos.map((photo, i) => (
                <motion.button
                  key={photo.src}
                  onClick={() => {
                    setActivePhoto(i);
                    setLoginOpen(true);
                  }}
                  onMouseEnter={() => setActivePhoto(i)}
                  whileHover={{ scale: 1.03 }}
                  className={cn(
                    "group relative shrink-0 overflow-hidden rounded-3xl shadow-lift transition-all duration-500",
                    activePhoto === i ? "h-[52vh] w-[38vw] max-w-md" : "h-[44vh] w-[28vw] max-w-xs opacity-80",
                  )}
                >
                  <img
                    src={photo.src}
                    alt={photo.label}
                    className="h-full w-full object-cover transition duration-500 group-hover:brightness-110 group-hover:contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                    <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-white/70 text-white">
                      <span className="h-8 w-8 rounded-full border border-white/60" />
                    </span>
                  </div>
                  <span className="absolute bottom-4 left-4 font-display text-lg text-white drop-shadow">
                    {photo.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          <div className="pointer-events-none absolute bottom-10 flex items-center gap-6 text-sm text-ink-muted">
            <span className="flex items-center gap-2">
              <Mouse className="h-4 w-4" /> Scroll to explore
            </span>
            <span className="flex items-center gap-2">
              <Hand className="h-4 w-4" /> Click a moment to sign in
            </span>
          </div>

          <div className="absolute bottom-10 right-10 hidden gap-2 sm:flex">
            <button
              onClick={() => setActivePhoto((p) => Math.max(0, p - 1))}
              className="grid h-10 w-10 place-items-center rounded-full bg-blush-200/80 text-forest shadow-soft hover:bg-blush-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActivePhoto((p) => Math.min(photos.length - 1, p + 1))}
              className="grid h-10 w-10 place-items-center rounded-full bg-blush-200/80 text-forest shadow-soft hover:bg-blush-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature strip — MVP highlights */}
      <section className="border-t border-line-soft bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="eyebrow text-blush-600">Built for wedding photographers</p>
          <h2 className="mt-2 font-display text-3xl text-forest sm:text-4xl">
            From deposit to final payment
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
            Custom packages, 40% deposits before the event, post-event payment links,
            overtime charges, and automatic invoice reminders — all in one calm workspace.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Custom packages", desc: "Build wedding or event packages with add-ons and overtime." },
            { title: "40% deposit", desc: "Collect deposit before the event, balance after." },
            { title: "Payment links", desc: "Send a polished invoice link when the event ends." },
            { title: "Smart reminders", desc: "Gentle nudges for unpaid invoices." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-ivory p-5 text-left shadow-soft">
              <h3 className="font-display text-lg text-forest">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button
            onClick={() => setLoginOpen(true)}
            className="rounded-full bg-forest px-8 py-3 text-sm font-semibold text-white shadow-soft hover:bg-forest-light"
          >
            Enter the Studio
          </button>
        </div>
      </section>
    </div>
  );
}
