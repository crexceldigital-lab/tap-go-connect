CREATE TABLE public.team_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  team_size TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.team_inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.team_inquiries TO authenticated;
GRANT ALL ON public.team_inquiries TO service_role;

ALTER TABLE public.team_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit team inquiries"
  ON public.team_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view team inquiries"
  ON public.team_inquiries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage team inquiries"
  ON public.team_inquiries FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));