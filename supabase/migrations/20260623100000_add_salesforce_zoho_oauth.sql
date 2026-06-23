ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS salesforce_access_token text,
  ADD COLUMN IF NOT EXISTS salesforce_refresh_token text,
  ADD COLUMN IF NOT EXISTS salesforce_instance_url text,
  ADD COLUMN IF NOT EXISTS salesforce_token_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS salesforce_sync_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS zoho_access_token text,
  ADD COLUMN IF NOT EXISTS zoho_refresh_token text,
  ADD COLUMN IF NOT EXISTS zoho_api_domain text,
  ADD COLUMN IF NOT EXISTS zoho_token_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS zoho_sync_enabled boolean NOT NULL DEFAULT false;
