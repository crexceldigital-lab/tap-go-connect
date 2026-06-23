import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { buildZohoAuthorizeUrl } from "@/lib/oauth";

interface ZohoConnectModalProps {
  open: boolean;
  onClose: () => void;
}

const ZohoConnectModal = ({ open, onClose }: ZohoConnectModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    Promise.all([
      supabase.from("profiles").select("zoho_sync_enabled").eq("user_id", user.id).single(),
      supabase.functions.invoke("oauth-config"),
    ]).then(([profileRes, configRes]) => {
      setConnected(!!(profileRes.data as any)?.zoho_sync_enabled);
      setClientId(configRes.data?.zoho_client_id || null);
      setLoading(false);
    });
  }, [open, user]);

  const handleConnect = () => {
    if (!clientId) {
      toast({ title: "Zoho isn't configured yet", description: "Ask your admin to add ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET first.", variant: "destructive" });
      return;
    }
    window.location.href = buildZohoAuthorizeUrl(clientId);
  };

  const handleDisconnect = async () => {
    if (!user) return;
    setDisconnecting(true);
    const { error } = await supabase.from("profiles").update({
      zoho_sync_enabled: false,
      zoho_access_token: null,
      zoho_refresh_token: null,
    } as any).eq("user_id", user.id);
    setDisconnecting(false);
    if (error) {
      toast({ title: "Couldn't disconnect", description: error.message, variant: "destructive" });
      return;
    }
    setConnected(false);
    toast({ title: "Zoho disconnected" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="relative w-full max-w-md rounded-2xl bg-card border border-border card-shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[#E42527]/10 flex items-center justify-center">
                <span className="text-[#E42527] font-extrabold text-sm">Z</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Zoho CRM</h3>
                <p className="text-xs text-muted-foreground">Push every new lead straight into your Zoho CRM Leads module.</p>
              </div>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
            ) : connected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
                  <CheckCircle2 size={14} /> Connected and syncing
                </div>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {disconnecting ? <Loader2 size={14} className="animate-spin" /> : null}
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  You'll be redirected to Zoho to log in and authorize access to your own CRM account. We never see your password.
                </p>
                <button
                  onClick={handleConnect}
                  className="w-full flex items-center justify-center gap-2 rounded-full brand-gradient py-3 text-sm font-semibold text-primary-foreground"
                >
                  Connect with Zoho
                </button>
                <a
                  href="https://www.zoho.com/crm/developer/docs/api/v6/register-client.html"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-blue hover:underline"
                >
                  Admin: how to register the API client <ExternalLink size={11} />
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ZohoConnectModal;
