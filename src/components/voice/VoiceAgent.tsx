import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, X, Sparkles, Send } from "lucide-react";
import { useVoiceAgent } from "@/context/VoiceAgentContext";
import { cn } from "@/lib/cn";

export function VoiceAgent() {
  const {
    status,
    messages,
    supported,
    panelOpen,
    setPanelOpen,
    startListening,
    stopListening,
    processText,
  } = useVoiceAgent();

  const [textInput, setTextInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, panelOpen]);

  const listening = status === "listening";

  const openAssistant = () => {
    setPanelOpen(true);
    if (!listening) startListening();
  };

  return (
    <>
      {/* Floating mic — positioned beside main content, not under sidebar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] lg:pl-[264px]">
        <div className="pointer-events-auto absolute bottom-24 left-4 sm:bottom-8 sm:left-6">
          <motion.button
            onClick={() => {
              if (listening) stopListening();
              else openAssistant();
            }}
            whileTap={{ scale: 0.94 }}
            aria-label={listening ? "Stop listening" : "Open voice assistant"}
            className={cn(
              "relative grid h-14 w-14 place-items-center rounded-full shadow-lift ring-4 transition-colors",
              listening
                ? "bg-blush-500 text-white ring-blush-200"
                : "bg-forest text-white ring-forest/25 hover:bg-forest-light",
            )}
          >
            {listening && (
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-white/50"
                animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
            {listening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </motion.button>
          <span className="mt-2 block text-center text-[10px] font-semibold uppercase tracking-wider text-forest">
            Voice
          </span>
        </div>
      </div>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed z-[100] flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-line bg-white/95 shadow-lift backdrop-blur-xl bottom-44 left-4 sm:bottom-28 sm:left-6 lg:bottom-8 lg:left-[280px]"
          >
            <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-forest text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Lens Assistant</p>
                  <p className="text-[11px] capitalize text-ink-muted">{status}</p>
                </div>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted hover:bg-blush-50 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="max-h-64 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug",
                    m.role === "assistant"
                      ? "bg-blush-50 text-ink-soft"
                      : "ml-auto bg-forest text-white",
                  )}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {!supported && (
              <p className="px-4 pb-2 text-xs text-blush-600">
                Voice requires Chrome or Safari. You can still type commands below.
              </p>
            )}

            <form
              className="flex items-center gap-2 border-t border-line-soft p-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!textInput.trim()) return;
                processText(textInput.trim());
                setTextInput("");
              }}
            >
              <input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder='Try "create invoice" or "add overtime"'
                className="input flex-1 py-2 text-sm"
              />
              <button
                type="submit"
                aria-label="Send"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-white hover:bg-forest-light"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="border-t border-line-soft px-4 py-2">
              <p className="text-[10px] leading-relaxed text-ink-faint">
                Say: go to invoices · create invoice · add overtime · set deposit to 40% ·
                what's my revenue · upcoming weddings
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
