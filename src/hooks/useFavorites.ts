import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Favorite {
  id: string;
  session_id: string | null;
  note: string | null;
  created_at: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Favorite[];
    },
    enabled: !!user,
  });

  const addFavorite = useMutation({
    mutationFn: async (params: { session_id: string; note?: string }) => {
      if (!user) throw new Error("Não autenticado");

      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        session_id: params.session_id,
        note: params.note || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (favoriteId: string) => {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const isFavorited = (sessionId: string) =>
    favoritesQuery.data?.some((f) => f.session_id === sessionId) ?? false;

  const getFavoriteBySession = (sessionId: string) =>
    favoritesQuery.data?.find((f) => f.session_id === sessionId);

  return {
    favorites: favoritesQuery.data ?? [],
    isLoading: favoritesQuery.isLoading,
    addFavorite: addFavorite.mutate,
    removeFavorite: removeFavorite.mutate,
    isFavorited,
    getFavoriteBySession,
  };
}
