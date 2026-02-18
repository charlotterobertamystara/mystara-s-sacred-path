import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Meus Créditos", desc: "5 créditos disponíveis", icon: "✦" },
  { label: "Assinatura", desc: "Plano gratuito", icon: "☽" },
  { label: "Histórico de Leituras", desc: "Ver consultas anteriores", icon: "📜" },
  { label: "Política de Privacidade", desc: "LGPD / GDPR", icon: "🔒" },
  { label: "Termos de Uso", desc: "Regras do aplicativo", icon: "📋" },
];

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border bg-secondary">
            <span className="font-display text-2xl text-primary">☽</span>
          </div>
          <h1 className="mt-3 font-display text-lg tracking-widest text-foreground">
            Sua Conta
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            Faça login para acessar
          </p>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full font-display tracking-widest"
            size="lg"
            onClick={() => navigate("/auth")}
          >
            Entrar / Criar Conta
          </Button>
        </div>

        <div className="space-y-2">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:shadow-mystical"
            >
              <span className="text-lg">{item.icon}</span>
              <div>
                <span className="font-display text-xs tracking-wider text-foreground">{item.label}</span>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
