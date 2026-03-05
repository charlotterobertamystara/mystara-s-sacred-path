import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Profile {
  full_name: string;
  phone: string;
  cpf: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zip: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { isSubscribed, subscriptionStatus, createSubscription, loading: creditsLoading } = useCredits();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Profile | null>(null);
  const [subscribing, setSubscribing] = useState(false);

  // Change password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, cpf, address_street, address_number, address_complement, address_neighborhood, address_city, address_state, address_zip")
      .eq("user_id", user!.id)
      .single();
    if (data) {
      setProfile(data as Profile);
      setEditData(data as Profile);
    }
  };

  const handleSave = async () => {
    if (!editData) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update(editData)
      .eq("user_id", user!.id);
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      setProfile(editData);
      setEditing(false);
      toast({ title: "Perfil atualizado! ✦" });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Senha deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setShowChangePassword(false);
      setNewPassword("");
      toast({ title: "Senha alterada! ✦" });
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const { error } = await supabase.functions.invoke("delete-account");
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao excluir conta", description: error.message, variant: "destructive" });
    } else {
      await signOut();
      toast({ title: "Conta excluída com sucesso" });
      navigate("/");
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Até logo! ☽" });
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="animate-pulse-glow text-xl text-primary font-display">✦</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border bg-secondary">
              <span className="font-display text-2xl text-primary">☽</span>
            </div>
            <h1 className="mt-3 font-display text-lg tracking-widest text-foreground">Sua Conta</h1>
            <p className="mt-1 font-body text-sm text-muted-foreground italic">Faça login para acessar</p>
          </div>
          <Button className="w-full font-display tracking-widest" size="lg" onClick={() => navigate("/auth")}>
            Entrar / Criar Conta
          </Button>

          {/* Menu items for unauthenticated */}
          {[
            { label: "Política de Privacidade", icon: "🔒" },
            { label: "Termos de Uso", icon: "📋" },
          ].map((item) => (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:shadow-mystical"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-display text-xs tracking-wider text-foreground">{item.label}</span>
            </button>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border bg-secondary">
            <span className="font-display text-2xl text-primary">
              {profile?.full_name?.charAt(0)?.toUpperCase() || "☽"}
            </span>
          </div>
          <h1 className="mt-3 font-display text-lg tracking-widest text-foreground">
            {profile?.full_name || "Seu Perfil"}
          </h1>
          <p className="mt-1 font-body text-xs text-muted-foreground">{user.email}</p>
        </div>

        {/* Subscription */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="font-display text-xs tracking-wider text-muted-foreground uppercase">Sua Assinatura</h2>
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-foreground">
              {creditsLoading ? "Carregando..." : isSubscribed ? "Plano Premium Ativo" : "Plano Gratuito"}
            </span>
            {isSubscribed && (
              <span className="rounded-full bg-primary/20 px-3 py-0.5 font-display text-[10px] tracking-wider text-primary">
                PREMIUM
              </span>
            )}
          </div>
          {!isSubscribed && (
            <div className="space-y-2 pt-1">
              <p className="font-body text-xs text-muted-foreground">
                Assine por R$ 5,99/mês para acesso ilimitado a todas as funcionalidades
              </p>
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
            </div>
          )}
          {isSubscribed && (
            <p className="font-body text-xs text-primary">Acesso ilimitado a todas as funcionalidades!</p>
          )}
        </div>

        {/* Profile fields */}
        {editing && editData ? (
          <div className="space-y-3">
            <ProfileField label="Nome" value={editData.full_name} onChange={(v) => setEditData({ ...editData, full_name: v })} />
            <ProfileField label="Celular" value={editData.phone} onChange={(v) => setEditData({ ...editData, phone: v })} />
            <ProfileField label="CPF" value={editData.cpf} onChange={(v) => setEditData({ ...editData, cpf: v })} />
            <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase pt-2">Endereço</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Input value={editData.address_street} onChange={(e) => setEditData({ ...editData, address_street: e.target.value })} placeholder="Rua" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
              </div>
              <Input value={editData.address_number} onChange={(e) => setEditData({ ...editData, address_number: e.target.value })} placeholder="Nº" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
            </div>
            <Input value={editData.address_complement} onChange={(e) => setEditData({ ...editData, address_complement: e.target.value })} placeholder="Complemento" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={editData.address_neighborhood} onChange={(e) => setEditData({ ...editData, address_neighborhood: e.target.value })} placeholder="Bairro" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
              <Input value={editData.address_city} onChange={(e) => setEditData({ ...editData, address_city: e.target.value })} placeholder="Cidade" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input value={editData.address_state} onChange={(e) => setEditData({ ...editData, address_state: e.target.value })} placeholder="Estado" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
              <Input value={editData.address_zip} onChange={(e) => setEditData({ ...editData, address_zip: e.target.value })} placeholder="CEP" className="border-border bg-card font-body text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditing(false)} className="flex-1 font-display tracking-wider">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={loading} className="flex-1 font-display tracking-wider">
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setEditing(true)} className="w-full font-display tracking-wider">
            Editar Perfil
          </Button>
        )}

        {/* Change password */}
        {showChangePassword ? (
          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Nova Senha</label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="border-border bg-muted font-body text-foreground placeholder:text-muted-foreground" />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowChangePassword(false)} className="flex-1 font-display tracking-wider text-xs">
                Cancelar
              </Button>
              <Button onClick={handleChangePassword} disabled={loading} className="flex-1 font-display tracking-wider text-xs">
                Alterar
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChangePassword(true)}
            className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:shadow-mystical"
          >
            <span className="text-lg">🔑</span>
            <span className="font-display text-xs tracking-wider text-foreground">Alterar Senha</span>
          </button>
        )}

        {/* Actions */}
        <Button variant="outline" onClick={handleLogout} className="w-full font-display tracking-wider">
          Sair da Conta
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full font-display tracking-wider">
              Excluir Conta Permanentemente
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-border bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display tracking-wider text-foreground">
                Excluir Conta
              </AlertDialogTitle>
              <AlertDialogDescription className="font-body text-muted-foreground">
                Esta ação é irreversível. Todos os seus dados pessoais, créditos e assinatura serão
                permanentemente apagados. Deseja continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-display tracking-wider">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive font-display tracking-wider">
                {loading ? "Excluindo..." : "Sim, Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <p className="text-center text-[10px] text-muted-foreground">
          Ao excluir sua conta, todos os dados pessoais serão apagados conforme LGPD/GDPR.
        </p>
      </motion.div>
    </div>
  );
};

const ProfileField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">{label}</label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 border-border bg-card font-body text-foreground" />
  </div>
);

export default ProfilePage;
