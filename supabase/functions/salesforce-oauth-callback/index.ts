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

    const CLIENT_ID = Deno.env.get("SALESFORCE_CLIENT_ID");
    const CLIENT_SECRET = Deno.env.get("SALESFORCE_CLIENT_SECRET");
    if (!CLIENT_ID || !CLIENT_SECRET) throw new Error("Salesforce is not configured (missing SALESFORCE_CLIENT_ID / SALESFORCE_CLIENT_SECRET)");

    // Identify the calling user from their Supabase session, scoped to the anon client + their JWT (not service role) for this lookup.
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) throw new Error("Could not identify the current user");

    // Exchange the authorization code for tokens.
    const tokenRes = await fetch("https://login.salesforce.com/services/oauth2/token", {
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
    if (!tokenRes.ok) throw new Error(tokenData.error_description || "Salesforce token exchange failed");

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // Salesforce access tokens are typically ~2hrs; refreshed proactively anyway

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { error: updateErr } = await adminClient
      .from("profiles")
      .update({
        salesforce_access_token: tokenData.access_token,
        salesforce_refresh_token: tokenData.refresh_token,
        salesforce_instance_url: tokenData.instance_url,
        salesforce_token_expires_at: expiresAt,
        salesforce_sync_enabled: true,
      })
      .eq("user_id", userData.user.id);
    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("salesforce-oauth-callback error:", error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
