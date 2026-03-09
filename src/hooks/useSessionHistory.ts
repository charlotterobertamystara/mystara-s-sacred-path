import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Json } from "@/integrations/supabase/types";

export type SessionType = "tarot" | "runas" | "mapa-astral" | "numerologia" | "radiestesia" | "cristais" | "limpeza";

export interface UserSession {
  id: string;
  session_type: string;
  question: string | null;
  session_data: Json | null;
  interpretation: string | null;
  created_at: string;
}

export function useSessionHistory(filterType?: SessionType) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ["user-sessions", user?.id, filterType],
    queryFn: async () => {
      let query = supabase
        .from("user_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (filterType) {
        query = query.eq("session_type", filterType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as UserSession[];
    },
    enabled: !!user,
  });

  const saveSession = useMutation({
    mutationFn: async (params: {
      session_type: SessionType;
      question?: string;
      session_data?: Record<string, unknown>;
      interpretation?: string;
    }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase.from("user_sessions").insert({
        user_id: user.id,
        session_type: params.session_type,
        question: params.question || null,
        session_data: (params.session_data as Json) || null,
        interpretation: params.interpretation || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
    },
  });

  return {
    sessions: sessionsQuery.data ?? [],
    isLoading: sessionsQuery.isLoading,
    saveSession: saveSession.mutate,
    saveSessionAsync: saveSession.mutateAsync,
  };
}
