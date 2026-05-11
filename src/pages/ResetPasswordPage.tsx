import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });
  }, []);

  const handleReset = async () => {
    if (password !== confirmPassword) {
      toast({ title: "Senhas não coincidem", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Senha deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Senha atualizada! ✦" });
      navigate("/");
    }
  };

  if (!isRecovery) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="font-body text-muted-foreground">Link de recuperação inválido ou expirado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-6"
      >
        <div className="text-center">
          <h1 className="font-display text-xl tracking-widest text-foreground">Nova Senha</h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">Defina sua nova senha</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Nova senha</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
          </div>
          <div>
            <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Confirmar senha</label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="mt-1 border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
          </div>
          <Button onClick={handleReset} disabled={loading} className="w-full font-display tracking-widest" size="lg">
            {loading ? "Atualizando..." : "Atualizar Senha"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
