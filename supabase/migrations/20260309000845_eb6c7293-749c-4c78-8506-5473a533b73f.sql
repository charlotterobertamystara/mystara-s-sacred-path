
-- User lunar profile table
CREATE TABLE public.user_lunar_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_city TEXT NOT NULL DEFAULT '',
  birth_state TEXT DEFAULT '',
  lunar_sign TEXT,
  birth_moon_phase TEXT,
  lunar_house TEXT,
  lunar_node TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_lunar_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lunar profile" ON public.user_lunar_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lunar profile" ON public.user_lunar_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lunar profile" ON public.user_lunar_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lunar profile" ON public.user_lunar_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_lunar_profiles_updated_at
BEFORE UPDATE ON public.user_lunar_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Diary entries table
CREATE TABLE public.diary_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL,
  entry_types TEXT[] NOT NULL DEFAULT '{}',
  -- Personal diary fields
  personal_text TEXT,
  emotional_scale INTEGER CHECK (emotional_scale >= 1 AND emotional_scale <= 10),
  energy_level TEXT CHECK (energy_level IN ('baixa', 'media', 'alta')),
  spiritual_practice TEXT,
  -- Dream fields
  dream_title TEXT,
  dream_description TEXT,
  dream_symbols TEXT[] DEFAULT '{}',
  dream_emotions TEXT[] DEFAULT '{}',
  dream_ai_analysis TEXT,
  -- Synchronicity fields
  sync_description TEXT,
  sync_symbols TEXT,
  sync_connections TEXT,
  sync_feeling TEXT,
  -- Manifestation fields
  manifestation_what TEXT,
  manifestation_intention TEXT,
  manifestation_actions TEXT,
  manifestation_signs TEXT,
  manifestation_status TEXT CHECK (manifestation_status IN ('em_progresso', 'manifestado')),
  -- Gratitude fields
  gratitude_1 TEXT,
  gratitude_2 TEXT,
  gratitude_3 TEXT,
  -- Insights
  insight_text TEXT,
  -- Lunar context (stored at creation time)
  moon_phase TEXT,
  moon_illumination NUMERIC,
  moon_sign TEXT,
  -- Tags and metadata
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diary entries" ON public.diary_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own diary entries" ON public.diary_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own diary entries" ON public.diary_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own diary entries" ON public.diary_entries FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_diary_entries_updated_at
BEFORE UPDATE ON public.diary_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_diary_entries_user_date ON public.diary_entries (user_id, entry_date);
CREATE INDEX idx_diary_entries_tags ON public.diary_entries USING GIN(tags);
CREATE INDEX idx_diary_entries_types ON public.diary_entries USING GIN(entry_types);
