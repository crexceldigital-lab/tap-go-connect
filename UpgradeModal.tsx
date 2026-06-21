import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, Crown, Zap } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  reason?: string;
}

const features = [
  "Unlimited card sharing",
  "Advanced customization & themes",
  "Unlimited AI scans",
  "Full analytics dashboard",
  "Multiple cards",
  "Priority support",
];

const UpgradeModal = ({ open, onClose, reason }: UpgradeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl brand-gradient">
              <Crown size={28} className="text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">Upgrade to PRO</DialogTitle>
          <DialogDescription className="text-center">
            {reason || "Unlock the full power of TAP & GO with unlimited features."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-sm font-medium text-muted-foreground">TZS</span>
              <span className="text-4xl font-extrabold">25,000</span>
              <span className="text-sm text-muted-foreground">/year</span>
            </div>
          </div>

          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-primary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              // TODO: Integrate Stripe checkout
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow"
          >
            <Zap size={16} />Upgrade Now
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
