import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface CompatibilityProfile {
  id: string;
  user_id: string;
  name: string;
  relationship_type: string;
  birth_date: string;
  birth_time: string | null;
  birth_place: string | null;
  sun_sign: string | null;
  moon_sign: string | null;
  ascendant_sign: string | null;
  photo_url: string | null;
  created_at: string;
  last_viewed: string | null;
  updated_at: string;
}

export interface CompatibilityAnalysis {
  id: string;
  user_id: string;
  profile_id: string;
  overall_score: number;
  sun_score: number | null;
  moon_score: number | null;
  asc_score: number | null;
  cross_score: number | null;
  analysis_data: any;
  created_at: string;
}

export function useCompatibility() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<CompatibilityProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    if (!user) { setProfiles([]); setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("compatibility_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProfiles((data as CompatibilityProfile[]) || []);
    } catch {
      toast({ title: "Erro", description: "Erro ao carregar perfis", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const addProfile = async (profile: Omit<CompatibilityProfile, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_viewed'>) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("compatibility_profiles")
      .insert({ ...profile, user_id: user.id })
      .select()
      .single();
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return null; }
    await fetchProfiles();
    return data as CompatibilityProfile;
  };

  const deleteProfile = async (id: string) => {
    const { error } = await supabase.from("compatibility_profiles").delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    await fetchProfiles();
  };

  const saveAnalysis = async (analysis: Omit<CompatibilityAnalysis, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("compatibility_analyses")
      .insert({ ...analysis, user_id: user.id })
      .select()
      .single();
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return null; }
    return data;
  };

  return { profiles, loading, addProfile, deleteProfile, saveAnalysis, refetch: fetchProfiles };
}
