import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Json } from "@/integrations/supabase/types";

export interface UserSettings {
  id: string;
  theme: string;
  preferred_reading_type: string;
  language: string;
  spiritual_preferences: Record<string, unknown>;
  notifications_enabled: boolean;
}

export function useUserSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ["user-settings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .single();

      if (error) {
        // If no settings exist, create them
        if (error.code === "PGRST116") {
          const { data: newSettings, error: insertError } = await supabase
            .from("user_settings")
            .insert({ user_id: user!.id })
            .select()
            .single();

          if (insertError) throw insertError;
          return newSettings as unknown as UserSettings;
        }
        throw error;
      }
      return data as unknown as UserSettings;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<Omit<UserSettings, "id">>) => {
      if (!user) throw new Error("Não autenticado");

      const { error } = await supabase
        .from("user_settings")
        .update(updates as Record<string, Json>)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
    },
  });

  return {
    settings: settingsQuery.data ?? null,
    isLoading: settingsQuery.isLoading,
    updateSettings: updateSettings.mutate,
  };
}
