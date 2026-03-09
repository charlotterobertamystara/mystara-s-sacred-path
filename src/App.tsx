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
import RunasPage from "./pages/RunasPage";
import RadiestesiaPage from "./pages/RadiestesiaPage";
import CristaisPage from "./pages/CristaisPage";
import LimpezaPage from "./pages/LimpezaPage";
import MapaAstralPage from "./pages/MapaAstralPage";
import DiarioPage from "./pages/DiarioPage";
import NumerologiaPage from "./pages/NumerologiaPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HistoricoPage from "./pages/HistoricoPage";
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
              <Route path="/runas" element={<SubscriptionGate featureName="Runas Nórdicas"><RunasPage /></SubscriptionGate>} />
              <Route path="/radiestesia" element={<SubscriptionGate featureName="Radiestesia"><RadiestesiaPage /></SubscriptionGate>} />
              <Route path="/cristais" element={<SubscriptionGate featureName="Guia de Cristais"><CristaisPage /></SubscriptionGate>} />
              <Route path="/limpeza" element={<SubscriptionGate featureName="Limpeza Energética"><LimpezaPage /></SubscriptionGate>} />
              <Route path="/mapa-astral" element={<SubscriptionGate featureName="Mapa Astral"><MapaAstralPage /></SubscriptionGate>} />
              <Route path="/numerologia" element={<SubscriptionGate featureName="Numerologia"><NumerologiaPage /></SubscriptionGate>} />
              <Route path="/diario" element={<SubscriptionGate featureName="Diário Místico"><DiarioPage /></SubscriptionGate>} />
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
