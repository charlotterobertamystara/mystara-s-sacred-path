import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Json } from "@/integrations/supabase/types";

export type SessionType = "tarot" | "runas" | "mapa-astral" | "numerologia" | "cristais" | "limpeza";

export interface UserSession {
  id: string;
  session_type: string;
  question: string | null;
  session_data: Json | null;
  interpretation: string | null;
  created_at: string;
}

interface ReadingItem {
  item_type: string;
  item_name: string;
  item_position?: string;
  item_data?: Record<string, unknown>;
  is_reversed?: boolean;
  sort_order?: number;
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
      reading_items?: ReadingItem[];
    }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: session, error } = await supabase
        .from("user_sessions")
        .insert({
          user_id: user.id,
          session_type: params.session_type,
          question: params.question || null,
          session_data: (params.session_data as Json) || null,
          interpretation: params.interpretation || null,
        })
        .select("id")
        .single();

      if (error) throw error;

      // Save individual reading items if provided
      if (params.reading_items?.length && session) {
        const items = params.reading_items.map((item, i) => ({
          session_id: session.id,
          user_id: user.id,
          item_type: item.item_type,
          item_name: item.item_name,
          item_position: item.item_position || null,
          item_data: (item.item_data as Json) || null,
          is_reversed: item.is_reversed ?? false,
          sort_order: item.sort_order ?? i,
        }));

        const { error: itemsError } = await supabase
          .from("reading_items")
          .insert(items);

        if (itemsError) console.error("Error saving reading items:", itemsError);
      }

      return session.id;
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
