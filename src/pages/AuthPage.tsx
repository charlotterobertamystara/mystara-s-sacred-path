import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type AuthMode = "login" | "signup" | "forgot";

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [addressComplement, setAddressComplement] = useState("");
  const [addressNeighborhood, setAddressNeighborhood] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bem-vindo(a) ao Mystara! ✦" });
      navigate("/");
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !fullName) {
      toast({ title: "Preencha nome, e-mail e senha", variant: "destructive" });
      return;
    }
    if (!termsAccepted) {
      toast({ title: "Aceite os termos para continuar", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
    } else {
      // Update profile with extra fields
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          full_name: fullName,
          phone,
          cpf,
          address_street: addressStreet,
          address_number: addressNumber,
          address_complement: addressComplement,
          address_neighborhood: addressNeighborhood,
          address_city: addressCity,
          address_state: addressState,
          address_zip: addressZip,
        }).eq("user_id", user.id);
      }
      toast({
        title: "Conta criada! ✦",
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: "Informe seu e-mail", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "E-mail enviado!", description: "Verifique sua caixa de entrada." });
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-6"
      >
        <div className="text-center">
          <h1 className="font-display text-2xl tracking-widest text-foreground text-glow">
            MYSTARA
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            {mode === "login" && "Entre na sua conta"}
            {mode === "signup" && "Crie sua conta"}
            {mode === "forgot" && "Recuperar senha"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {mode === "signup" && (
              <>
                <FieldLabel label="Nome completo">
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome completo" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
                </FieldLabel>
              </>
            )}

            <FieldLabel label="E-mail">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
            </FieldLabel>

            {mode !== "forgot" && (
              <FieldLabel label="Senha">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
              </FieldLabel>
            )}

            {mode === "signup" && (
              <>
                <FieldLabel label="Celular (com DDD)">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
                </FieldLabel>
                <FieldLabel label="CPF">
                  <Input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
                </FieldLabel>

                <p className="font-display text-xs tracking-wider text-muted-foreground uppercase pt-2">Endereço</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Input value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} placeholder="Rua" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
                  </div>
                  <Input value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)} placeholder="Nº" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
                </div>
                <Input value={addressComplement} onChange={(e) => setAddressComplement(e.target.value)} placeholder="Complemento" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
                <div className="grid grid-cols-2 gap-2">
                  <Input value={addressNeighborhood} onChange={(e) => setAddressNeighborhood(e.target.value)} placeholder="Bairro" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
                  <Input value={addressCity} onChange={(e) => setAddressCity(e.target.value)} placeholder="Cidade" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={addressState} onChange={(e) => setAddressState(e.target.value)} placeholder="Estado" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
                  <Input value={addressZip} onChange={(e) => setAddressZip(e.target.value)} placeholder="CEP" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
                </div>
              </>
            )}

            {mode === "signup" && (
              <div className="flex items-start gap-3 pt-2 pb-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 cursor-pointer accent-primary"
                />
                <label htmlFor="terms" className="font-body text-[11px] text-muted-foreground leading-relaxed cursor-pointer">
                  Li e aceito os <span className="text-primary">Termos de Uso</span> e a{" "}
                  <span className="text-primary">Política de Privacidade</span>. Compreendo que o
                  Mystara é um serviço de orientação espiritual e simbólica, não substituindo
                  aconselhamento médico, psicológico, jurídico ou profissional.
                </label>
              </div>
            )}

            <div className="pt-2">
              {mode === "login" && (
                <Button onClick={handleLogin} disabled={loading} className="w-full font-display tracking-widest" size="lg">
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              )}
              {mode === "signup" && (
                <Button onClick={handleSignup} disabled={loading} className="w-full font-display tracking-widest" size="lg">
                  {loading ? "Criando..." : "Criar Conta"}
                </Button>
              )}
              {mode === "forgot" && (
                <Button onClick={handleForgotPassword} disabled={loading} className="w-full font-display tracking-widest" size="lg">
                  {loading ? "Enviando..." : "Enviar E-mail de Recuperação"}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col items-center gap-2 text-sm">
          {mode === "login" && (
            <>
              <button onClick={() => setMode("forgot")} className="font-body text-muted-foreground hover:text-primary transition-colors">
                Esqueci minha senha
              </button>
              <button onClick={() => setMode("signup")} className="font-body text-muted-foreground hover:text-primary transition-colors">
                Não tem conta? <span className="text-primary">Criar conta</span>
              </button>
            </>
          )}
          {mode === "signup" && (
            <button onClick={() => setMode("login")} className="font-body text-muted-foreground hover:text-primary transition-colors">
              Já tem conta? <span className="text-primary">Entrar</span>
            </button>
          )}
          {mode === "forgot" && (
            <button onClick={() => setMode("login")} className="font-body text-muted-foreground hover:text-primary transition-colors">
              Voltar ao login
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const FieldLabel = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">
      {label}
    </label>
    <div className="mt-1">{children}</div>
  </div>
);

export default AuthPage;
