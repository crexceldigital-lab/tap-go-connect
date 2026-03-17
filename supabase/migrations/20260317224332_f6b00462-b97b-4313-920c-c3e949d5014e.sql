ALTER TABLE public.cards ADD COLUMN card_theme text NOT NULL DEFAULT 'light';
ALTER TABLE public.cards ADD COLUMN share_count integer NOT NULL DEFAULT 0;