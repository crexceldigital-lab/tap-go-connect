import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadPayload {
  leadId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const results: Record<string, string> = {};

  try {
    const { leadId }: LeadPayload = await req.json();
    if (!leadId) throw new Error("leadId is required");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Pull the lead, its card, and the card owner's profile in one go.
    const { data: lead, error: leadErr } = await supabase
      .from("leads")
      .select("*, cards!inner(id, full_name, company_name, slug, logo_url, primary_color, user_id)")
      .eq("id", leadId)
      .single();

    if (leadErr || !lead) throw new Error("Lead not found");
    const card = (lead as any).cards;

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "hubspot_api_key, hubspot_sync_enabled, " +
        "salesforce_access_token, salesforce_refresh_token, salesforce_instance_url, salesforce_token_expires_at, salesforce_sync_enabled, " +
        "zoho_access_token, zoho_refresh_token, zoho_api_domain, zoho_token_expires_at, zoho_sync_enabled"
      )
      .eq("user_id", card.user_id)
      .single();

    // --- 1. Automated "thanks for connecting" email -----------------------
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY && lead.email) {
      try {
        const cardUrl = `${Deno.env.get("PUBLIC_SITE_URL") || "https://tap-go-connect.lovable.app"}/card/${card.slug}`;
        const ownerName = card.full_name || "Your new connection";
        const companyLine = card.company_name ? ` at ${card.company_name}` : "";

        const emailHtml = `
          <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1a2332;">
            <p style="font-size:14px;color:#64748b;">Hi ${lead.full_name || "there"},</p>
            <p style="font-size:15px;line-height:1.6;">
              You just connected with <strong>${ownerName}</strong>${companyLine} via TAP &amp; GO.
              Save their contact or revisit their card anytime using the links below.
            </p>
            <div style="margin:24px 0;">
              <a href="${cardUrl}" style="display:inline-block;background:${card.primary_color || "#3BB0D4"};color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;font-size:14px;margin-right:8px;">View Their Card</a>
            </div>
            <p style="font-size:12px;color:#94a3b8;margin-top:32px;">Sent automatically by TAP &amp; GO on behalf of ${ownerName}.</p>
          </div>
        `;

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: Deno.env.get("RESEND_FROM_EMAIL") || "TAP & GO <onboarding@resend.dev>",
            to: [lead.email],
            subject: `You're connected with ${ownerName}`,
            html: emailHtml,
          }),
        });

        results.email = emailRes.ok ? "sent" : `failed (${emailRes.status})`;
      } catch (e) {
        results.email = `error: ${(e as Error).message}`;
      }
    } else {
      results.email = !RESEND_API_KEY ? "skipped (RESEND_API_KEY not configured)" : "skipped (lead has no email)";
    }

    // --- 2. Push to the card owner's HubSpot, if they've connected one ----
    if (profile?.hubspot_sync_enabled && profile?.hubspot_api_key) {
      try {
        const hsHeaders = {
          Authorization: `Bearer ${profile.hubspot_api_key}`,
          "Content-Type": "application/json",
        };

        // Try to find an existing contact by email first (if we have one) to upsert rather than duplicate.
        let existingId: string | null = null;
        if (lead.email) {
          const searchRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
            method: "POST",
            headers: hsHeaders,
            body: JSON.stringify({
              filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: lead.email }] }],
              limit: 1,
            }),
          });
          const searchData = await searchRes.json();
          existingId = searchData?.results?.[0]?.id || null;
        }

        const [firstName, ...rest] = (lead.full_name || "").split(" ");
        const properties = {
          firstname: firstName || lead.full_name || "",
          lastname: rest.join(" ") || "",
          phone: lead.phone || "",
          email: lead.email || undefined,
          company: lead.company_name || "",
        };

        const hsRes = existingId
          ? await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`, {
              method: "PATCH", headers: hsHeaders, body: JSON.stringify({ properties }),
            })
          : await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
              method: "POST", headers: hsHeaders, body: JSON.stringify({ properties }),
            });

        results.hubspot = hsRes.ok ? (existingId ? "updated" : "created") : `failed (${hsRes.status})`;
      } catch (e) {
        results.hubspot = `error: ${(e as Error).message}`;
      }
    } else {
      results.hubspot = "skipped (not connected)";
    }

    // --- 3. Push to the card owner's Salesforce, if connected -------------
    if (profile?.salesforce_sync_enabled && profile?.salesforce_refresh_token) {
      try {
        let accessToken = profile.salesforce_access_token as string;
        let instanceUrl = profile.salesforce_instance_url as string;
        const expiresAt = profile.salesforce_token_expires_at ? new Date(profile.salesforce_token_expires_at as string).getTime() : 0;

        // Refresh proactively if the token is expired or expiring in the next 2 minutes.
        if (Date.now() > expiresAt - 2 * 60 * 1000) {
          const SF_CLIENT_ID = Deno.env.get("SALESFORCE_CLIENT_ID");
          const SF_CLIENT_SECRET = Deno.env.get("SALESFORCE_CLIENT_SECRET");
          const refreshRes = await fetch("https://login.salesforce.com/services/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: profile.salesforce_refresh_token as string,
              client_id: SF_CLIENT_ID || "",
              client_secret: SF_CLIENT_SECRET || "",
            }),
          });
          const refreshData = await refreshRes.json();
          if (!refreshRes.ok) throw new Error(refreshData.error_description || "Salesforce token refresh failed");
          accessToken = refreshData.access_token;
          instanceUrl = refreshData.instance_url || instanceUrl;
          await supabase.from("profiles").update({
            salesforce_access_token: accessToken,
            salesforce_instance_url: instanceUrl,
            salesforce_token_expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          }).eq("user_id", card.user_id);
        }

        const sfHeaders = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };
        const apiBase = `${instanceUrl}/services/data/v59.0`;

        let existingId: string | null = null;
        if (lead.email) {
          const safeEmail = (lead.email as string).replace(/'/g, "\\'");
          const soql = `SELECT Id FROM Lead WHERE Email = '${safeEmail}' LIMIT 1`;
          const searchRes = await fetch(`${apiBase}/query?q=${encodeURIComponent(soql)}`, { headers: sfHeaders });
          const searchData = await searchRes.json();
          existingId = searchData?.records?.[0]?.Id || null;
        }

        const [firstName, ...rest] = (lead.full_name || "").split(" ");
        const sfFields = {
          FirstName: firstName || undefined,
          LastName: rest.join(" ") || lead.full_name || "Unknown",
          Company: lead.company_name || lead.full_name || "Unknown",
          Phone: lead.phone || undefined,
          Email: lead.email || undefined,
        };

        const sfRes = existingId
          ? await fetch(`${apiBase}/sobjects/Lead/${existingId}`, { method: "PATCH", headers: sfHeaders, body: JSON.stringify(sfFields) })
          : await fetch(`${apiBase}/sobjects/Lead`, { method: "POST", headers: sfHeaders, body: JSON.stringify(sfFields) });

        results.salesforce = sfRes.ok || sfRes.status === 204 ? (existingId ? "updated" : "created") : `failed (${sfRes.status})`;
      } catch (e) {
        results.salesforce = `error: ${(e as Error).message}`;
      }
    } else {
      results.salesforce = "skipped (not connected)";
    }

    // --- 4. Push to the card owner's Zoho CRM, if connected ----------------
    if (profile?.zoho_sync_enabled && profile?.zoho_refresh_token) {
      try {
        let accessToken = profile.zoho_access_token as string;
        const apiDomain = (profile.zoho_api_domain as string) || "https://www.zohoapis.com";
        const expiresAt = profile.zoho_token_expires_at ? new Date(profile.zoho_token_expires_at as string).getTime() : 0;

        if (Date.now() > expiresAt - 2 * 60 * 1000) {
          const ZOHO_CLIENT_ID = Deno.env.get("ZOHO_CLIENT_ID");
          const ZOHO_CLIENT_SECRET = Deno.env.get("ZOHO_CLIENT_SECRET");
          const refreshRes = await fetch("https://accounts.zoho.com/oauth/v2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: profile.zoho_refresh_token as string,
              client_id: ZOHO_CLIENT_ID || "",
              client_secret: ZOHO_CLIENT_SECRET || "",
            }),
          });
          const refreshData = await refreshRes.json();
          if (!refreshRes.ok || refreshData.error) throw new Error(refreshData.error || "Zoho token refresh failed");
          accessToken = refreshData.access_token;
          await supabase.from("profiles").update({
            zoho_access_token: accessToken,
            zoho_token_expires_at: new Date(Date.now() + (refreshData.expires_in || 3600) * 1000).toISOString(),
          }).eq("user_id", card.user_id);
        }

        const zohoHeaders = { Authorization: `Zoho-oauthtoken ${accessToken}`, "Content-Type": "application/json" };

        let existingId: string | null = null;
        if (lead.email) {
          const searchRes = await fetch(`${apiDomain}/crm/v6/Leads/search?email=${encodeURIComponent(lead.email as string)}`, { headers: zohoHeaders });
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            existingId = searchData?.data?.[0]?.id || null;
          }
        }

        const [zFirst, ...zRest] = (lead.full_name || "").split(" ");
        const zohoRecord = {
          First_Name: zFirst || undefined,
          Last_Name: zRest.join(" ") || lead.full_name || "Unknown",
          Company: lead.company_name || lead.full_name || "Unknown",
          Phone: lead.phone || undefined,
          Email: lead.email || undefined,
        };

        const zohoRes = existingId
          ? await fetch(`${apiDomain}/crm/v6/Leads/${existingId}`, { method: "PUT", headers: zohoHeaders, body: JSON.stringify({ data: [zohoRecord] }) })
          : await fetch(`${apiDomain}/crm/v6/Leads`, { method: "POST", headers: zohoHeaders, body: JSON.stringify({ data: [zohoRecord] }) });

        results.zoho = zohoRes.ok ? (existingId ? "updated" : "created") : `failed (${zohoRes.status})`;
      } catch (e) {
        results.zoho = `error: ${(e as Error).message}`;
      }
    } else {
      results.zoho = "skipped (not connected)";
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("handle-new-lead error:", error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message, results }), {
      status: 200, // never surface this as a hard failure to the lead-capture UX
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
