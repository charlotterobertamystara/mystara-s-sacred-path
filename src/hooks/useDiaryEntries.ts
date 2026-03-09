import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { getMoonPhase, getMoonSign } from "@/lib/lunar-utils";

export type EntryType = 'diario' | 'sonhos' | 'sincronicidades' | 'manifestacoes' | 'insights' | 'gratidao';

export interface DiaryEntry {
  id: string;
  user_id: string;
  entry_date: string;
  entry_types: EntryType[];
  // Personal diary
  personal_text?: string | null;
  emotional_scale?: number | null;
  energy_level?: 'baixa' | 'media' | 'alta' | null;
  spiritual_practice?: string | null;
  // Dreams
  dream_title?: string | null;
  dream_description?: string | null;
  dream_symbols?: string[] | null;
  dream_emotions?: string[] | null;
  dream_ai_analysis?: string | null;
  // Synchronicity
  sync_description?: string | null;
  sync_symbols?: string | null;
  sync_connections?: string | null;
  sync_feeling?: string | null;
  // Manifestation
  manifestation_what?: string | null;
  manifestation_intention?: string | null;
  manifestation_actions?: string | null;
  manifestation_signs?: string | null;
  manifestation_status?: 'em_progresso' | 'manifestado' | null;
  // Gratitude
  gratitude_1?: string | null;
  gratitude_2?: string | null;
  gratitude_3?: string | null;
  // Insights
  insight_text?: string | null;
  // Lunar context
  moon_phase?: string | null;
  moon_illumination?: number | null;
  moon_sign?: string | null;
  // Meta
  tags?: string[] | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiaryEntryInput {
  entry_date: string;
  entry_types: EntryType[];
  personal_text?: string;
  emotional_scale?: number;
  energy_level?: 'baixa' | 'media' | 'alta';
  spiritual_practice?: string;
  dream_title?: string;
  dream_description?: string;
  dream_symbols?: string[];
  dream_emotions?: string[];
  sync_description?: string;
  sync_symbols?: string;
  sync_connections?: string;
  sync_feeling?: string;
  manifestation_what?: string;
  manifestation_intention?: string;
  manifestation_actions?: string;
  manifestation_signs?: string;
  manifestation_status?: 'em_progresso' | 'manifestado';
  gratitude_1?: string;
  gratitude_2?: string;
  gratitude_3?: string;
  insight_text?: string;
  tags?: string[];
  is_private?: boolean;
}

export const useDiaryEntries = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [entriesCount, setEntriesCount] = useState(0);

  const fetchEntries = useCallback(async (filters?: {
    month?: number;
    year?: number;
    types?: EntryType[];
    phase?: string;
  }) => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let query = supabase
      .from("diary_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false });

    if (filters?.month !== undefined && filters?.year !== undefined) {
      const startDate = new Date(filters.year, filters.month, 1).toISOString().split('T')[0];
      const endDate = new Date(filters.year, filters.month + 1, 0).toISOString().split('T')[0];
      query = query.gte("entry_date", startDate).lte("entry_date", endDate);
    }

    if (filters?.types?.length) {
      query = query.overlaps("entry_types", filters.types);
    }

    if (filters?.phase) {
      query = query.eq("moon_phase", filters.phase);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching diary entries:", error);
    }

    setEntries((data as DiaryEntry[]) || []);
    setLoading(false);
  }, [user]);

  const fetchMonthEntriesCount = useCallback(async () => {
    if (!user) {
      setEntriesCount(0);
      return;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const { count } = await supabase
      .from("diary_entries")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user.id)
      .gte("entry_date", startOfMonth)
      .lte("entry_date", endOfMonth);

    setEntriesCount(count || 0);
  }, [user]);

  useEffect(() => {
    fetchEntries();
    fetchMonthEntriesCount();
  }, [fetchEntries, fetchMonthEntriesCount]);

  const createEntry = async (input: DiaryEntryInput) => {
    if (!user) throw new Error("Não autenticado");

    const entryDate = new Date(input.entry_date);
    const moonPhase = getMoonPhase(entryDate);
    const moonSign = getMoonSign(entryDate);

    const { data, error } = await supabase
      .from("diary_entries")
      .insert({
        ...input,
        user_id: user.id,
        moon_phase: moonPhase.phaseName,
        moon_illumination: moonPhase.illumination,
        moon_sign: moonSign.name,
        is_private: input.is_private ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    
    setEntries(prev => [data as DiaryEntry, ...prev]);
    await fetchMonthEntriesCount();
    return data as DiaryEntry;
  };

  const updateEntry = async (id: string, input: Partial<DiaryEntryInput>) => {
    if (!user) throw new Error("Não autenticado");

    const { data, error } = await supabase
      .from("diary_entries")
      .update(input)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    setEntries(prev => prev.map(e => e.id === id ? data as DiaryEntry : e));
    return data as DiaryEntry;
  };

  const deleteEntry = async (id: string) => {
    if (!user) throw new Error("Não autenticado");

    const { error } = await supabase
      .from("diary_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    setEntries(prev => prev.filter(e => e.id !== id));
    await fetchMonthEntriesCount();
  };

  const getEntryByDate = (date: string): DiaryEntry | undefined => {
    return entries.find(e => e.entry_date === date);
  };

  const getEntriesByDateRange = (startDate: string, endDate: string): DiaryEntry[] => {
    return entries.filter(e => e.entry_date >= startDate && e.entry_date <= endDate);
  };

  const getStats = () => {
    const totalEntries = entries.length;
    const byType = entries.reduce((acc, e) => {
      e.entry_types.forEach(t => {
        acc[t] = (acc[t] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const byPhase = entries.reduce((acc, e) => {
      if (e.moon_phase) {
        acc[e.moon_phase] = (acc[e.moon_phase] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const manifestationsCompleted = entries.filter(
      e => e.entry_types.includes('manifestacoes') && e.manifestation_status === 'manifestado'
    ).length;

    const manifestationsInProgress = entries.filter(
      e => e.entry_types.includes('manifestacoes') && e.manifestation_status === 'em_progresso'
    ).length;

    return {
      totalEntries,
      byType,
      byPhase,
      manifestationsCompleted,
      manifestationsInProgress,
    };
  };

  return {
    entries,
    loading,
    entriesCount,
    createEntry,
    updateEntry,
    deleteEntry,
    fetchEntries,
    getEntryByDate,
    getEntriesByDateRange,
    getStats,
    refreshEntries: fetchEntries,
  };
};
