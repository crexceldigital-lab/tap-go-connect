import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import UpgradeModal from "@/components/UpgradeModal";
import ShareModal from "@/components/ShareModal";
import { Plus, Eye, MousePointerClick, Users, Pencil, Share2, QrCode, Wallet, ChevronRight } from "lucide-react";
import logo from "@/assets/tapngo-logo.png";
import { QRCodeSVG } from "qrcode.react";

interface Card {
  id: string;
  card_name: string;
  full_name: string | null;
  job_title: string | null;
  company_name: string | null;
  is_published: boolean;
  views_count: number;
  taps_count: number;
  leads_count: number;
  primary_color: string;
  slug: string | null;
  created_at: string;
}

const CardsTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [shareCard, setShareCard] = useState<Card | null>(null);
  const [qrCard, setQrCard] = useState<Card | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchCards = async () => {
      const { data } = await supabase
        .from("cards")
        .select("id, card_name, full_name, job_title, company_name, is_published, views_count, taps_count, leads_count, primary_color, slug, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setCards((data as Card[]) || []);
      setLoading(false);
    };
    fetchCards();
  }, [user]);

  const handleCreateNew = async () => {
    if (!user) return;
    if (cards.length >= 1) {
      setUpgradeOpen(true);
      return;
    }
    const { data } = await supabase.from("cards").insert({ user_id: user.id, card_name: "New Card" }).select("id").single();
    if (data) navigate(`/editor/${data.id}`);
  };

  const getCardUrl = (card: Card) => {
    const base = window.location.origin;
    return card.slug ? `${base}/card/${card.slug}` : `${base}/card/${card.id}`;
  };

  const initials = (name: string | null) =>
    (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2);

  const totalViews = cards.reduce((s, c) => s + c.views_count, 0);
  const totalTaps = cards.reduce((s, c) => s + c.taps_count, 0);

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <img src={logo} alt="TAP & GO" className="h-7" />
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full brand-gradient text-xs font-semibold text-primary-foreground gradient-glow"
        >
          <Plus size={14} />New Card
        </button>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-3 mb-6">
        {[
          { label: "Views", value: totalViews, icon: Eye },
          { label: "Taps", value: totalTaps, icon: MousePointerClick },
          { label: "Leads", value: cards.reduce((s, c) => s + c.leads_count, 0), icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex-1 bg-card rounded-2xl p-3.5 border border-border card-shadow">
            <Icon size={14} className="text-primary mb-1.5" />
            <p className="text-lg font-extrabold">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Cards List */}
      <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
        Your Cards ({cards.length})
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="bg-card rounded-2xl h-32 border border-border animate-pulse" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-card rounded-3xl border border-border"
        >
          <div className="w-16 h-16 rounded-full brand-gradient mx-auto mb-4 flex items-center justify-center">
            <Plus size={24} className="text-primary-foreground" />
          </div>
          <h3 className="font-bold mb-1">Create Your First Card</h3>
          <p className="text-sm text-muted-foreground mb-5 px-8">Design a stunning digital business card in minutes</p>
          <button onClick={handleCreateNew} className="px-6 py-3 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow">
            Get Started
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border card-shadow overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="h-16 relative"
                  style={{ background: `linear-gradient(135deg, ${card.primary_color}, ${card.primary_color}88)` }}
                >
                  {card.is_published && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold backdrop-blur-sm">
                      Live
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 -mt-5">
                  <div className="flex items-end gap-3 mb-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0 ring-2 ring-card"
                      style={{ backgroundColor: card.primary_color }}
                    >
                      {initials(card.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{card.card_name}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {card.full_name}{card.job_title ? ` · ${card.job_title}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/editor/${card.id}`)}
                      className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Eye size={10} />{card.views_count} views</span>
                    <span className="flex items-center gap-1"><MousePointerClick size={10} />{card.taps_count} taps</span>
                    <span className="flex items-center gap-1"><Users size={10} />{card.leads_count} leads</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShareCard(card)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors"
                    >
                      <Share2 size={12} />Share
                    </button>
                    <button
                      onClick={() => setQrCard(card)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors"
                    >
                      <QrCode size={12} />
                    </button>
                    <button
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors"
                      onClick={() => setUpgradeOpen(true)}
                    >
                      <Wallet size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* QR Modal */}
      {qrCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setQrCard(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-3xl p-8 text-center mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold mb-4">{qrCard.card_name}</h3>
            <div className="bg-white p-4 rounded-2xl inline-block mb-4">
              <QRCodeSVG value={getCardUrl(qrCard)} size={180} />
            </div>
            <p className="text-xs text-muted-foreground">Scan to view card</p>
          </motion.div>
        </div>
      )}

      {shareCard && (
        <ShareModal
          open={!!shareCard}
          onClose={() => setShareCard(null)}
          cardUrl={getCardUrl(shareCard)}
          cardName={shareCard.card_name}
        />
      )}

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} reason="Upgrade to PRO for unlimited cards, shares, and scans." />
    </div>
  );
};

export default CardsTab;
