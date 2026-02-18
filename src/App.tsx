import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import TarotPage from "./pages/TarotPage";
import RunasPage from "./pages/RunasPage";
import RadiestesiaPage from "./pages/RadiestesiaPage";
import CristaisPage from "./pages/CristaisPage";
import BanhosErvasPage from "./pages/BanhosErvasPage";
import MapaAstralPage from "./pages/MapaAstralPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/tarot" element={<TarotPage />} />
            <Route path="/runas" element={<RunasPage />} />
            <Route path="/radiestesia" element={<RadiestesiaPage />} />
            <Route path="/cristais" element={<CristaisPage />} />
            <Route path="/banhos" element={<BanhosErvasPage />} />
            <Route path="/mapa-astral" element={<MapaAstralPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
