import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface SubscriptionState {
  isSubscribed: boolean;
  subscriptionStatus: string | null;
  loading: boolean;
}

export const useCredits = () => {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    isSubscribed: false,
    subscriptionStatus: null,
    loading: true,
  });

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setState({ isSubscribed: false, subscriptionStatus: null, loading: false });
      return;
    }

    const { data } = await supabase
      .from("subscriptions")
      .select("status, plan_type")
      .eq("user_id", user.id)
      .single();

    const sub = data as { status: string; plan_type: string } | null;

    setState({
      isSubscribed: sub?.status === "active" && sub?.plan_type === "premium",
      subscriptionStatus: sub?.status ?? null,
      loading: false,
    });
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const createSubscription = async () => {
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
  };

  return {
    ...state,
    createSubscription,
    refreshSubscription: fetchSubscription,
  };
};
