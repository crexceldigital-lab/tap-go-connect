import { Lock } from "lucide-react";

const ProBadge = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider hover:bg-primary/20 transition-colors"
  >
    <Lock size={10} />PRO
  </button>
);

export default ProBadge;
