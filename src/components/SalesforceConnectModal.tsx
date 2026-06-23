import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { buildSalesforceAuthorizeUrl } from "@/lib/oauth";

interface SalesforceConnectModalProps {
  open: boolean;
  onClose: () => void;
}

const SalesforceConnectModal = ({ open, onClose }: SalesforceConnectModalProps) => {
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
      supabase.from("profiles").select("salesforce_sync_enabled").eq("user_id", user.id).single(),
      supabase.functions.invoke("oauth-config"),
    ]).then(([profileRes, configRes]) => {
      setConnected(!!(profileRes.data as any)?.salesforce_sync_enabled);
      setClientId(configRes.data?.salesforce_client_id || null);
      setLoading(false);
    });
  }, [open, user]);

  const handleConnect = () => {
    if (!clientId) {
      toast({ title: "Salesforce isn't configured yet", description: "Ask your admin to add SALESFORCE_CLIENT_ID and SALESFORCE_CLIENT_SECRET first.", variant: "destructive" });
      return;
    }
    window.location.href = buildSalesforceAuthorizeUrl(clientId);
  };

  const handleDisconnect = async () => {
    if (!user) return;
    setDisconnecting(true);
    const { error } = await supabase.from("profiles").update({
      salesforce_sync_enabled: false,
      salesforce_access_token: null,
      salesforce_refresh_token: null,
    } as any).eq("user_id", user.id);
    setDisconnecting(false);
    if (error) {
      toast({ title: "Couldn't disconnect", description: error.message, variant: "destructive" });
      return;
    }
    setConnected(false);
    toast({ title: "Salesforce disconnected" });
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
              <div className="h-10 w-10 rounded-xl bg-[#00A1E0]/10 flex items-center justify-center">
                <span className="text-[#00A1E0] font-extrabold text-sm">SF</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Salesforce</h3>
                <p className="text-xs text-muted-foreground">Push every new lead straight into your Salesforce org.</p>
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
                  You'll be redirected to Salesforce to log in and authorize access to your own org. We never see your password.
                </p>
                <button
                  onClick={handleConnect}
                  className="w-full flex items-center justify-center gap-2 rounded-full brand-gradient py-3 text-sm font-semibold text-primary-foreground"
                >
                  Connect with Salesforce
                </button>
                <a
                  href="https://help.salesforce.com/s/articleView?id=sf.connected_app_create.htm"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-blue hover:underline"
                >
                  Admin: how to set up the Connected App <ExternalLink size={11} />
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesforceConnectModal;
