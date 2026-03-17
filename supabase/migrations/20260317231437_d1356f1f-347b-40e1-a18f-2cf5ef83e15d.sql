
-- Leads table
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  company_name text,
  source text NOT NULL DEFAULT 'link',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert leads (public form submission)
CREATE POLICY "Anyone can submit leads" ON public.leads
  FOR INSERT TO public
  WITH CHECK (true);

-- Card owners can view their leads
CREATE POLICY "Card owners can view leads" ON public.leads
  FOR SELECT TO authenticated
  USING (
    card_id IN (SELECT id FROM public.cards WHERE user_id = auth.uid())
  );

-- Card events table for passive tracking
CREATE TABLE public.card_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  device_type text,
  country text,
  city text,
  visitor_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.card_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (passive tracking)
CREATE POLICY "Anyone can insert events" ON public.card_events
  FOR INSERT TO public
  WITH CHECK (true);

-- Card owners can view their events
CREATE POLICY "Card owners can view events" ON public.card_events
  FOR SELECT TO authenticated
  USING (
    card_id IN (SELECT id FROM public.cards WHERE user_id = auth.uid())
  );
