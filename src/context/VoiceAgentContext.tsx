import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { parseVoiceCommand, type VoiceAction } from "@/lib/voiceAgent";
import { photographer } from "@/data/mock";

export interface InvoiceVoiceHandlers {
  addOvertime: () => void;
  setDiscount: (value: number) => void;
  setDeposit: (value: number) => void;
  setTax: (value: number) => void;
  applyPackage: (key: string) => void;
  adjustLastRate: (delta: number) => void;
  setLastRate: (value: number) => void;
  addLine: (description: string, rate: number) => void;
  selectClient: (clientId: string) => void;
}

export interface VoiceMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: Date;
}

type AgentStatus = "idle" | "listening" | "processing" | "speaking";

interface VoiceAgentContextValue {
  status: AgentStatus;
  messages: VoiceMessage[];
  supported: boolean;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  startListening: () => void;
  stopListening: () => void;
  processText: (text: string) => void;
  registerInvoiceHandlers: (handlers: InvoiceVoiceHandlers | null) => void;
}

const VoiceAgentContext = createContext<VoiceAgentContextValue | null>(null);

function speak(text: string, onEnd?: () => void) {
  if (!("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.onend = () => onEnd?.();
  utter.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utter);
}

export function VoiceAgentProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Hi ${photographer.firstName}! I'm Lens Assistant. Tap the mic and say help to get started.`,
      time: new Date(),
    },
  ]);
  const [panelOpen, setPanelOpen] = useState(false);
  const invoiceHandlers = useRef<InvoiceVoiceHandlers | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const supported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  const addMessage = useCallback((role: VoiceMessage["role"], text: string) => {
    setMessages((prev) => [
      ...prev.slice(-12),
      { id: `${Date.now()}-${role}`, role, text, time: new Date() },
    ]);
  }, []);

  const runActions = useCallback(
    (actions: VoiceAction[] | undefined) => {
      if (!actions?.length) return;
      for (const action of actions) {
        switch (action.type) {
          case "navigate":
            navigate(action.path);
            break;
          case "invoice.addOvertime":
            invoiceHandlers.current?.addOvertime();
            break;
          case "invoice.setDiscount":
            invoiceHandlers.current?.setDiscount(action.value);
            break;
          case "invoice.setDeposit":
            invoiceHandlers.current?.setDeposit(action.value);
            break;
          case "invoice.setTax":
            invoiceHandlers.current?.setTax(action.value);
            break;
          case "invoice.applyPackage":
            invoiceHandlers.current?.applyPackage(action.key);
            break;
          case "invoice.adjustRate":
            invoiceHandlers.current?.adjustLastRate(action.delta);
            break;
          case "invoice.setRate":
            invoiceHandlers.current?.setLastRate(action.value);
            break;
          case "invoice.addLine":
            invoiceHandlers.current?.addLine(action.description, action.rate);
            break;
          case "invoice.selectClient":
            invoiceHandlers.current?.selectClient(action.clientId);
            break;
        }
      }
    },
    [navigate],
  );

  const processText = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      addMessage("user", text);
      setStatus("processing");

      const result = parseVoiceCommand(text, photographer.firstName);
      addMessage("assistant", result.response);
      runActions(result.actions);

      setStatus("speaking");
      speak(result.response, () => setStatus("idle"));
    },
    [addMessage, runActions],
  );

  const startListening = useCallback(() => {
    if (!supported) {
      addMessage("assistant", "Voice isn't supported in this browser. Try Chrome or Safari, or type below.");
      setPanelOpen(true);
      return;
    }

    setPanelOpen(true);
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      if (last.isFinal) {
        const transcript = last[0].transcript;
        recognition.stop();
        processText(transcript);
      }
    };

    recognition.onerror = () => {
      setStatus("idle");
      addMessage("assistant", "I couldn't hear you clearly. Try again?");
    };

    recognition.onend = () => {
      setStatus((s) => (s === "listening" ? "idle" : s));
    };

    recognitionRef.current = recognition;
    setStatus("listening");
    recognition.start();
  }, [supported, addMessage, processText]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setStatus("idle");
  }, []);

  const registerInvoiceHandlers = useCallback((handlers: InvoiceVoiceHandlers | null) => {
    invoiceHandlers.current = handlers;
  }, []);

  const value = useMemo(
    () => ({
      status,
      messages,
      supported,
      panelOpen,
      setPanelOpen,
      startListening,
      stopListening,
      processText,
      registerInvoiceHandlers,
    }),
    [
      status,
      messages,
      supported,
      panelOpen,
      startListening,
      stopListening,
      processText,
      registerInvoiceHandlers,
    ],
  );

  return (
    <VoiceAgentContext.Provider value={value}>{children}</VoiceAgentContext.Provider>
  );
}

export function useVoiceAgent() {
  const ctx = useContext(VoiceAgentContext);
  if (!ctx) throw new Error("useVoiceAgent must be used within VoiceAgentProvider");
  return ctx;
}
