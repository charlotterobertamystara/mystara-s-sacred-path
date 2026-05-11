-- Corrigir créditos gratuitos: 5 → 3
ALTER TABLE public.user_credits ALTER COLUMN credits_remaining SET DEFAULT 3;

-- Atualizar a função que cria créditos ao registrar novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_remaining)
  VALUES (NEW.id, 3);
  INSERT INTO public.subscriptions (user_id, status, plan_type)
  VALUES (NEW.id, 'inactive', 'free');
  RETURN NEW;
END;
$$;

-- Corrigir preço do plano para R$9,90
UPDATE public.subscription_plans
SET price = 9.90, currency = 'BRL'
WHERE billing_period = 'monthly' AND is_active = true;

-- Inserir plano caso não exista ainda
INSERT INTO public.subscription_plans (name, description, price, currency, billing_period, features, is_active)
SELECT
  'Mystara Premium',
  'Acesso completo a todas as funcionalidades: Tarot ilimitado, Runas, Mapa Astral, Numerologia, Cristais, Limpeza Espiritual, Radiestesia, Diário Lunar.',
  9.90,
  'BRL',
  'monthly',
  '["Tarot ilimitado", "Leitura de Runas", "Mapa Astral completo", "Numerologia", "Cristais", "Limpeza Espiritual", "Radiestesia", "Diário Lunar"]'::jsonb,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE is_active = true);
