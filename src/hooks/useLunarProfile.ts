import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { calculateBirthMoonPhase, calculateLunarSign, calculateLunarNode, getLunarHouse } from "@/lib/lunar-utils";

export interface LunarProfile {
  id: string;
  user_id: string;
  full_name: string;
  birth_date: string;
  birth_time: string | null;
  birth_city: string;
  birth_state: string | null;
  lunar_sign: string | null;
  birth_moon_phase: string | null;
  lunar_house: string | null;
  lunar_node: string | null;
}

export const useLunarProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<LunarProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("user_lunar_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching lunar profile:", error);
    }

    setProfile(data as LunarProfile | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const createOrUpdateProfile = async (data: {
    full_name: string;
    birth_date: string;
    birth_time?: string;
    birth_city: string;
    birth_state?: string;
  }) => {
    if (!user) throw new Error("Não autenticado");

    const birthDate = new Date(data.birth_date);
    const lunarSign = calculateLunarSign(birthDate);
    const birthMoonPhase = calculateBirthMoonPhase(birthDate);
    const lunarNode = calculateLunarNode(birthDate);
    const lunarHouse = getLunarHouse(birthDate, data.birth_time);

    const profileData = {
      user_id: user.id,
      full_name: data.full_name,
      birth_date: data.birth_date,
      birth_time: data.birth_time || null,
      birth_city: data.birth_city,
      birth_state: data.birth_state || null,
      lunar_sign: lunarSign.name,
      birth_moon_phase: birthMoonPhase,
      lunar_house: lunarHouse,
      lunar_node: `Nodo ${lunarNode}`,
    };

    const { data: result, error } = await supabase
      .from("user_lunar_profiles")
      .upsert(profileData, { onConflict: "user_id" })
      .select()
      .single();

    if (error) throw error;
    setProfile(result as LunarProfile);
    return result;
  };

  return {
    profile,
    loading,
    hasProfile: !!profile,
    createOrUpdateProfile,
    refreshProfile: fetchProfile,
  };
};
