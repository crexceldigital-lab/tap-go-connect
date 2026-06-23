import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { verifyOAuthState, ZOHO_REDIRECT_PATH } from "@/lib/oauth";

const ZohoCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"working" | "success" | "error">("working");
  const [message, setMessage] = useState("Connecting your Zoho CRM account…");

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const oauthError = params.get("error");

      if (oauthError) {
        setStatus("error");
        setMessage(oauthError);
        return;
      }
      if (!code || !verifyOAuthState("zoho", state)) {
        setStatus("error");
        setMessage("This connection request is invalid or expired. Please try connecting again.");
        return;
      }

      const redirectUri = `${window.location.origin}${ZOHO_REDIRECT_PATH}`;
      const { data, error } = await supabase.functions.invoke("zoho-oauth-callback", {
        body: { code, redirectUri },
      });

      if (error || !data?.success) {
        setStatus("error");
        setMessage(data?.error || error?.message || "Something went wrong connecting Zoho.");
        return;
      }

      setStatus("success");
      setMessage("Zoho CRM connected! Redirecting you back…");
      setTimeout(() => navigate("/app/settings"), 1800);
    };
    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-4 max-w-sm">
        {status === "working" && <Loader2 size={32} className="mx-auto animate-spin text-primary" />}
        {status === "success" && <CheckCircle2 size={32} className="mx-auto text-emerald-500" />}
        {status === "error" && <XCircle size={32} className="mx-auto text-destructive" />}
        <p className="text-sm text-muted-foreground">{message}</p>
        {status === "error" && (
          <button onClick={() => navigate("/app/settings")} className="text-sm font-semibold text-brand-blue hover:underline">
            Back to Settings
          </button>
        )}
      </div>
    </div>
  );
};

export default ZohoCallback;
