import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import AppLayout from "./components/AppLayout";
import SubscriptionGate from "./components/SubscriptionGate";
import Index from "./pages/Index";
import TarotPage from "./pages/TarotPage";
import TarotCardsPage from "./pages/TarotCardsPage";
import RunasPage from "./pages/RunasPage";

import CristaisPage from "./pages/CristaisPage";
import LojaPage from "./pages/LojaPage";
import LimpezaPage from "./pages/LimpezaPage";
import MapaAstralPage from "./pages/MapaAstralPage";
import DiarioPage from "./pages/DiarioPage";
import NumerologiaPage from "./pages/NumerologiaPage";
import RadiestesiaPage from "./pages/RadiestesiaPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/tarot" element={<TarotPage />} />
              <Route path="/tarot/cartas" element={<TarotCardsPage />} />
              <Route path="/runas" element={<RunasPage />} />
              
              <Route path="/cristais" element={<CristaisPage />} />
              <Route path="/limpeza" element={<LimpezaPage />} />
              <Route path="/mapa-astral" element={<MapaAstralPage />} />
              <Route path="/numerologia" element={<NumerologiaPage />} />
              <Route path="/radiestesia" element={<RadiestesiaPage />} />
              <Route path="/diario" element={<DiarioPage />} />
              <Route path="/loja" element={<LojaPage />} />
              
              <Route path="/perfil" element={<ProfilePage />} />
            </Route>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
