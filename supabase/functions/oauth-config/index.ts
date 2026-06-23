import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Client IDs are not secret (the OAuth spec assumes they're public — only the
// client_secret must stay server-side), so it's safe to hand these back to
// the frontend. Keeping them in Supabase Secrets just means everything for
// this integration lives in one place instead of split across .env files too.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  return new Response(
    JSON.stringify({
      salesforce_client_id: Deno.env.get("SALESFORCE_CLIENT_ID") || null,
      zoho_client_id: Deno.env.get("ZOHO_CLIENT_ID") || null,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
