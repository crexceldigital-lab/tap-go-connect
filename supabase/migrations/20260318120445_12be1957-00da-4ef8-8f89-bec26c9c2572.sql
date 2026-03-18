
-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all cards
CREATE POLICY "Admins can view all cards"
ON public.cards
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all leads
CREATE POLICY "Admins can view all leads"
ON public.leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all card events
CREATE POLICY "Admins can view all events"
ON public.card_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
