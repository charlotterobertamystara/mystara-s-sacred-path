-- Tabela de sessões/histórico de tiragens
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_type TEXT NOT NULL, -- 'tarot', 'runes', 'mapa-astral', 'radiestesia', 'diary'
  question TEXT,
  interpretation TEXT,
  session_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON public.user_sessions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage sessions" ON public.user_sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_type ON public.user_sessions(user_id, session_type);
CREATE INDEX idx_user_sessions_created ON public.user_sessions(user_id, created_at DESC);
