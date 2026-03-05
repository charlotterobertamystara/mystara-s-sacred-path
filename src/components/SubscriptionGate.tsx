import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { toast } from "@/hooks/use-toast";

interface SubscriptionGateProps {
  children: React.ReactNode;
  featureName: string;
}

const SubscriptionGate = ({ children, featureName }: SubscriptionGateProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, loading: subLoading } = useCredits();
  const navigate = useNavigate();
  const [subscribing, setSubscribing] = useState(false);
  const { createSubscription } = useCredits();

  if (authLoading || subLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} className="text-4xl">
          ◎
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <span className="text-5xl">🔒</span>
          <h2 className="font-display text-lg tracking-widest text-foreground">Acesso Restrito</h2>
          <p className="font-body text-sm text-muted-foreground">
            Faça login para acessar {featureName}.
          </p>
          <Button className="w-full font-display tracking-wider" onClick={() => navigate("/auth")}>
            Entrar / Criar Conta
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <span className="text-5xl">✨</span>
          <h2 className="font-display text-lg tracking-widest text-foreground">Conteúdo Premium</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            <strong>{featureName}</strong> faz parte do plano premium.<br />
            Assine por apenas <span className="text-primary font-semibold">R$ 5,99/mês</span> e tenha acesso ilimitado a todas as funcionalidades do Mystara.
          </p>
          <div className="rounded-xl border border-border bg-card p-4 text-left space-y-2">
            <p className="font-display text-xs tracking-wider text-primary uppercase">Incluído no Premium:</p>
            <ul className="font-body text-xs text-muted-foreground space-y-1">
              <li>✦ Leitura de Runas Nórdicas</li>
              <li>✦ Mapa Astral Completo</li>
              <li>✦ Radiestesia & Gráficos</li>
              <li>✦ Guia de Cristais</li>
              <li>✦ Limpeza Energética</li>
              <li>✦ Uso ilimitado de todas as ferramentas</li>
            </ul>
          </div>
          <Button
            className="w-full font-display tracking-wider"
            disabled={subscribing}
            onClick={async () => {
              setSubscribing(true);
              try {
                const result = await createSubscription();
                window.open(result.init_point, "_blank");
              } catch (e) {
                toast({ title: "Erro", description: e instanceof Error ? e.message : "Erro ao criar assinatura", variant: "destructive" });
              } finally {
                setSubscribing(false);
              }
            }}
          >
            {subscribing ? "Processando..." : "✨ Assinar Plano Premium"}
          </Button>
          <button
            onClick={() => navigate("/")}
            className="font-body text-xs text-muted-foreground underline"
          >
            Voltar ao início
          </button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGate;
