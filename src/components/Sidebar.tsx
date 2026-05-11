import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", label: "Início", icon: "✦" },
  { path: "/tarot", label: "Tarot de Marselha", icon: "🂡" },
  { path: "/runas", label: "Runas", icon: "ᚱ" },
  { path: "/mapa-astral", label: "Mapa Astral", icon: "☉" },
  { path: "/numerologia", label: "Numerologia", icon: "✡" },
  { path: "/limpeza", label: "Limpeza Espiritual", icon: "🌿" },
  { path: "/radiestesia", label: "Radiestesia", icon: "◎" },
  { path: "/loja", label: "Loja", icon: "🔮" },
  { path: "/diario", label: "Diário Lunar", icon: "📔" },
  { path: "/perfil", label: "Perfil", icon: "☽" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border bg-card/60 backdrop-blur-md fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-border">
        <h1 className="font-display text-2xl tracking-widest text-foreground text-glow">
          MYSTARA
        </h1>
        <p className="mt-1 text-xs text-muted-foreground italic font-body">
          Orientação espiritual e simbólica
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left group ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`text-xl transition-all ${isActive ? "scale-110" : "group-hover:scale-105"}`}>
                {tab.icon}
              </span>
              <span className={`text-sm font-display tracking-wider ${isActive ? "text-primary" : ""}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Não substitui aconselhamento profissional.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
