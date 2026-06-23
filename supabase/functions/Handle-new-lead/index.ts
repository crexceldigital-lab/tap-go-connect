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
      .select("hubspot_api_key, hubspot_sync_enabled")
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
