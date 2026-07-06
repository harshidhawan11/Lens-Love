import { Routes, Route } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import Landing from "@/pages/Landing";
import { VoiceAgentProvider } from "@/context/VoiceAgentContext";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/app/*"
        element={
          <VoiceAgentProvider>
            <AppShell />
          </VoiceAgentProvider>
        }
      />
    </Routes>
  );
}
