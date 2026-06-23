import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    const { code, redirectUri } = await req.json();
    if (!code || !redirectUri) throw new Error("code and redirectUri are required");

    const CLIENT_ID = Deno.env.get("ZOHO_CLIENT_ID");
    const CLIENT_SECRET = Deno.env.get("ZOHO_CLIENT_SECRET");
    if (!CLIENT_ID || !CLIENT_SECRET) throw new Error("Zoho is not configured (missing ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET)");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) throw new Error("Could not identify the current user");

    // Exchange the authorization code for tokens. Zoho's accounts server is
    // always accounts.zoho.com for the initial exchange regardless of the
    // user's data-center region — the region-specific API domain comes back
    // in the response as api_domain and must be used for all later API calls.
    const tokenRes = await fetch("https://accounts.zoho.com/oauth/v2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || tokenData.error) throw new Error(tokenData.error || "Zoho token exchange failed");
    if (!tokenData.refresh_token) {
      throw new Error("Zoho didn't return a refresh token — disconnect any prior authorization for this app in Zoho's account settings and try connecting again.");
    }

    const expiresAt = new Date(Date.now() + (tokenData.expires_in || 3600) * 1000).toISOString();

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { error: updateErr } = await adminClient
      .from("profiles")
      .update({
        zoho_access_token: tokenData.access_token,
        zoho_refresh_token: tokenData.refresh_token,
        zoho_api_domain: tokenData.api_domain || "https://www.zohoapis.com",
        zoho_token_expires_at: expiresAt,
        zoho_sync_enabled: true,
      })
      .eq("user_id", userData.user.id);
    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("zoho-oauth-callback error:", error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
