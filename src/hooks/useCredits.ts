import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface CreditsState {
  creditsRemaining: number | null;
  isUnlimited: boolean;
  loading: boolean;
  subscription: {
    status: string;
    planType: string;
  } | null;
}

export const useCredits = () => {
  const { user } = useAuth();
  const [state, setState] = useState<CreditsState>({
    creditsRemaining: null,
    isUnlimited: false,
    loading: true,
    subscription: null,
  });

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setState({ creditsRemaining: null, isUnlimited: false, loading: false, subscription: null });
      return;
    }

    const [creditsRes, subRes] = await Promise.all([
      supabase.from("user_credits").select("*").eq("user_id", user.id).single(),
      supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
    ]);

    const credits = creditsRes.data as { credits_remaining: number } | null;
    const sub = subRes.data as { status: string; plan_type: string } | null;

    setState({
      creditsRemaining: credits?.credits_remaining ?? 5,
      isUnlimited: credits?.credits_remaining === -1,
      loading: false,
      subscription: sub ? { status: sub.status, planType: sub.plan_type } : null,
    });
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const consumeCredit = async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const response = await supabase.functions.invoke("consume-credit", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (response.error || response.data?.error) {
        return false;
      }

      await fetchCredits();
      return true;
    } catch {
      return false;
    }
  };

  const createSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");

      const response = await supabase.functions.invoke("mercadopago-create-subscription", {
        body: { backUrl: window.location.origin + "/perfil" },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (response.error || response.data?.error) {
        throw new Error(response.data?.error || "Erro ao criar assinatura");
      }

      return response.data as { init_point: string; subscription_id: string };
    } catch (e) {
      throw e;
    }
  };

  return {
    ...state,
    consumeCredit,
    createSubscription,
    refreshCredits: fetchCredits,
  };
};
