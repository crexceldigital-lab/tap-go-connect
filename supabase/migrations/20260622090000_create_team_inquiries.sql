-- Team / enterprise interest capture (sales-assisted onboarding, mirrors marketing site "For My Team" flow)
CREATE TABLE IF NOT EXISTS public.team_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  work_email text NOT NULL,
  company_name text NOT NULL,
  team_size text,
  phone text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous marketing-site visitors) can submit an inquiry
CREATE POLICY "Anyone can submit a team inquiry"
ON public.team_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read submitted inquiries
CREATE POLICY "Admins can view team inquiries"
ON public.team_inquiries
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update team inquiries"
ON public.team_inquiries
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
