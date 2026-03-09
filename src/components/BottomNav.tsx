import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", label: "Início", icon: "✦" },
  { path: "/tarot", label: "Tarot", icon: "🂡" },
  { path: "/runas", label: "Runas", icon: "ᚱ" },
  { path: "/mapa-astral", label: "Mapa", icon: "☉" },
  { path: "/numerologia", label: "Números", icon: "✡" },
  { path: "/limpeza", label: "Limpeza", icon: "🌿" },
  { path: "/radiestesia", label: "Radiestesia", icon: "◎" },
  { path: "/historico", label: "Histórico", icon: "📜" },
  { path: "/diario", label: "Diário", icon: "📔" },
  { path: "/perfil", label: "Perfil", icon: "☽" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 px-2 py-1 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 h-0.5 w-6 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`text-lg transition-all ${
                  isActive ? "text-primary scale-110" : "text-muted-foreground"
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-[10px] font-display tracking-wider ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
