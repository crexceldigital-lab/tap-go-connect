import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeadCaptureModalProps {
  open: boolean;
  onClose: () => void;
  cardId: string;
  source?: string;
  onSuccess: () => void;
  skipsRemaining: number;
  onSkip: () => void;
}

const LeadCaptureModal = ({ open, onClose, cardId, source = "link", onSuccess, skipsRemaining, onSkip }: LeadCaptureModalProps) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const { error: dbError } = await supabase.from("leads" as any).insert({
        card_id: cardId,
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        company_name: companyName.trim() || null,
        source,
      } as any);
      if (dbError) throw dbError;
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 relative border border-border card-shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
            <X size={18} />
          </button>

          {success ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="mx-auto w-16 h-16 rounded-full brand-gradient flex items-center justify-center">
                <CheckCircle2 size={32} className="text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">You're now connected 🎉</h3>
              <p className="text-sm text-muted-foreground">Your details have been shared successfully.</p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-6 space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full brand-gradient flex items-center justify-center mb-3">
                  <UserPlus size={22} className="text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold">Share your details to connect</h3>
                <p className="text-sm text-muted-foreground">Enter your info to stay connected.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  autoFocus
                  type="text"
                  placeholder="Full Name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={100}
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  inputMode="tel"
                  maxLength={20}
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={255}
                />
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={100}
                />

                {error && <p className="text-xs text-destructive text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  {submitting ? "Connecting..." : "Let's Connect"}
                </button>

                {skipsRemaining > 0 && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Skip for now
                  </button>
                )}
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadCaptureModal;
