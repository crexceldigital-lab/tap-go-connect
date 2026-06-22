ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS social_display_style text NOT NULL DEFAULT 'icons';
