ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS hubspot_api_key text,
  ADD COLUMN IF NOT EXISTS hubspot_sync_enabled boolean NOT NULL DEFAULT false;
