import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface HubSpotConnectModalProps {
  open: boolean;
  onClose: () => void;
}

const HubSpotConnectModal = ({ open, onClose }: HubSpotConnectModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    supabase
      .from("profiles")
      .select("hubspot_api_key, hubspot_sync_enabled")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setApiKey((data as any)?.hubspot_api_key || "");
        setEnabled((data as any)?.hubspot_sync_enabled || false);
        setLoading(false);
      });
  }, [open, user]);

  const handleSave = async (nextEnabled: boolean) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ hubspot_api_key: apiKey.trim() || null, hubspot_sync_enabled: nextEnabled } as any)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
      return;
    }
    setEnabled(nextEnabled);
    toast({ title: nextEnabled ? "HubSpot connected" : "HubSpot disconnected" });
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
              <div className="h-10 w-10 rounded-xl bg-[#FF7A59]/10 flex items-center justify-center">
                <span className="text-[#FF7A59] font-extrabold text-sm">H</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">HubSpot CRM</h3>
                <p className="text-xs text-muted-foreground">Push every new lead straight into your HubSpot contacts.</p>
              </div>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Private App Access Token</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="pat-na1-xxxxxxxx-xxxx-xxxx..."
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm outline-none focus:border-primary/50 font-mono"
                  />
                  <a
                    href="https://developers.hubspot.com/docs/guides/api/private-apps"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-blue hover:underline"
                  >
                    How to create a Private App token <ExternalLink size={11} />
                  </a>
                </div>

                {enabled && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
                    <CheckCircle2 size={14} /> Sync is currently active
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleSave(true)}
                    disabled={saving || !apiKey.trim()}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full brand-gradient py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                    {enabled ? "Update & Save" : "Connect HubSpot"}
                  </button>
                  {enabled && (
                    <button
                      onClick={() => handleSave(false)}
                      disabled={saving}
                      className="px-4 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HubSpotConnectModal;
