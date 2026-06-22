
-- 1. Helper: is a card published? (SECURITY DEFINER to bypass RLS in inner check)
CREATE OR REPLACE FUNCTION public.is_card_published(_card_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.cards WHERE id = _card_id AND is_published = true);
$$;

REVOKE ALL ON FUNCTION public.is_card_published(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_card_published(uuid) TO anon, authenticated, service_role;

-- 2. Cards: drop broad public SELECT and expose only via RPC
DROP POLICY IF EXISTS "Published cards are viewable by everyone" ON public.cards;

CREATE OR REPLACE FUNCTION public.get_public_card_by_slug(_slug text)
RETURNS SETOF public.cards
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.cards WHERE slug = _slug AND is_published = true LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_card_by_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_card_by_slug(text) TO anon, authenticated;

-- Allow anon to increment views via a controlled RPC (used after fetch)
CREATE OR REPLACE FUNCTION public.increment_card_view(_card_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.cards SET views_count = views_count + 1
   WHERE id = _card_id AND is_published = true;
$$;

REVOKE ALL ON FUNCTION public.increment_card_view(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_card_view(uuid) TO anon, authenticated;

-- 3. card_events: restrict inserts to published cards
DROP POLICY IF EXISTS "Anyone can insert events" ON public.card_events;
CREATE POLICY "Events can be inserted for published cards"
  ON public.card_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (public.is_card_published(card_id));

-- 4. leads: restrict inserts to published cards
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;
CREATE POLICY "Leads can be submitted for published cards"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    public.is_card_published(card_id)
    AND length(full_name) > 0
    AND length(phone) > 0
  );

-- 5. team_inquiries: replace always-true policy with basic validation
DROP POLICY IF EXISTS "Anyone can submit team inquiries" ON public.team_inquiries;
CREATE POLICY "Team inquiries require basic info"
  ON public.team_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(full_name) > 0
    AND length(work_email) > 0
    AND work_email LIKE '%_@_%.__%'
  );

-- 6. user_roles: explicit restrictive policy to block self-insert by non-admins
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles AS RESTRICTIVE FOR INSERT
  TO authenticated, anon
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 7. Lock down SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.has_active_subscription(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid, text) TO service_role;

-- 8. Avatars storage: remove broad listing policy (public CDN URLs still work for direct file access)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
