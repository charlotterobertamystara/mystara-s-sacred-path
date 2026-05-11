
-- 1. reading_items: specific cards/runes/pendulum results per reading
CREATE TABLE public.reading_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.user_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL, -- 'tarot_card', 'rune', 'pendulum'
  item_name TEXT NOT NULL,
  item_position TEXT,
  item_data JSONB DEFAULT '{}'::jsonb,
  is_reversed BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reading_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reading items" ON public.reading_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reading items" ON public.reading_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reading items" ON public.reading_items FOR DELETE USING (auth.uid() = user_id);

-- 2. favorites: saved readings/interpretations
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- 3. user_settings: preferences
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  theme TEXT DEFAULT 'dark',
  preferred_reading_type TEXT DEFAULT 'tarot',
  language TEXT DEFAULT 'pt-BR',
  spiritual_preferences JSONB DEFAULT '{}'::jsonb,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. subscription_plans: plan definitions
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  billing_period TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'yearly', 'lifetime'
  credits_included INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Plans are readable by everyone
CREATE POLICY "Anyone can view active plans" ON public.subscription_plans FOR SELECT USING (is_active = true);

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. payment_history: payment events and status changes
CREATE TABLE public.payment_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  payment_id UUID REFERENCES public.payment_transactions(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'created', 'approved', 'rejected', 'refunded', 'cancelled'
  status TEXT NOT NULL,
  amount NUMERIC,
  currency TEXT DEFAULT 'BRL',
  provider TEXT DEFAULT 'mercadopago',
  provider_event_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment history" ON public.payment_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage payment history" ON public.payment_history FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 6. Add plan_id FK to subscriptions table
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true;

-- 7. Add plan_id to payment_transactions
ALTER TABLE public.payment_transactions ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL;
ALTER TABLE public.payment_transactions ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'mercadopago';

-- 8. Update handle_new_user trigger to also create user_settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reading_items_session ON public.reading_items(session_id);
CREATE INDEX IF NOT EXISTS idx_reading_items_user ON public.reading_items(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_user ON public.payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_type ON public.user_sessions(user_id, session_type);
