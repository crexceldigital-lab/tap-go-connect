import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import UpgradeModal from "@/components/UpgradeModal";
import ProBadge from "@/components/ProBadge";
import { Plus, Eye, MousePointerClick, Users, Pencil, Trash2, LogOut, ScanLine, CreditCard, BarChart3, Crown } from "lucide-react";
import logo from "@/assets/tapngo-logo.png";

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
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"cards" | "analytics" | "scanner">("cards");
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchCards = async () => {
      const { data } = await supabase.from("cards").select("id, card_name, full_name, job_title, company_name, is_published, views_count, taps_count, leads_count, primary_color, created_at").eq("user_id", user.id).order("created_at", { ascending: false });
      setCards((data as Card[]) || []);
      setLoading(false);
    };
    fetchCards();
  }, [user]);

  const totalViews = cards.reduce((s, c) => s + c.views_count, 0);
  const totalTaps = cards.reduce((s, c) => s + c.taps_count, 0);
  const totalLeads = cards.reduce((s, c) => s + c.leads_count, 0);

  const handleDelete = async (id: string) => {
    await supabase.from("cards").delete().eq("id", id);
    setCards(cards.filter(c => c.id !== id));
  };

  const handleCreateNew = async () => {
    if (!user) return;
    // Free plan: limit to 1 card
    if (cards.length >= 1) {
      setUpgradeOpen(true);
      return;
    }
    const { data } = await supabase.from("cards").insert({ user_id: user.id, card_name: "New Card" }).select("id").single();
    if (data) navigate(`/editor/${data.id}`);
  };

  const dashTabs = [
    { id: "cards" as const, label: "My Cards", icon: CreditCard },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "scanner" as const, label: "AI Scanner", icon: ScanLine },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <img src={logo} alt="TAP & GO" className="h-8" />
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setUpgradeOpen(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-full border border-primary/30 text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
              <Crown size={14} /><span className="hidden sm:inline">Upgrade</span>
            </button>
            <button onClick={() => navigate("/scanner")} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors">
              <ScanLine size={16} /><span className="hidden sm:inline">Scan</span>
            </button>
            <button onClick={handleCreateNew} className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow">
              <Plus size={16} /><span className="hidden sm:inline">New Card</span>
            </button>
            <button onClick={() => { signOut(); navigate("/"); }} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} reason="Upgrade to PRO to create unlimited cards and unlock all features." />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-6">Dashboard</h1>

          <div className="flex gap-1 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {dashTabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === t.id ? "brand-gradient text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                <t.icon size={14} />{t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: "Total Views", value: totalViews, icon: Eye },
              { label: "Total Taps", value: totalTaps, icon: MousePointerClick },
              { label: "Leads Captured", value: totalLeads, icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-card rounded-2xl p-5 sm:p-6 border border-border card-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-secondary text-primary"><Icon size={18} /></div>
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
                <p className="text-3xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>

          {activeTab === "cards" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Your Cards</h2>
                <span className="text-sm text-muted-foreground">{cards.length} card{cards.length !== 1 ? "s" : ""}</span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-card rounded-2xl h-48 border border-border animate-pulse" />
                  ))}
                </div>
              ) : cards.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border">
                  <p className="text-muted-foreground mb-4">No cards yet. Create your first digital card!</p>
                  <button onClick={handleCreateNew} className="px-6 py-3 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow">
                    <Plus size={16} className="inline mr-2" />Create Card
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cards.map((card) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-2xl border border-border card-shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group"
                      onClick={() => navigate(`/editor/${card.id}`)}
                    >
                      <div className="h-24 brand-gradient relative">
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent" />
                        {card.is_published && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 text-xs font-semibold">Live</span>
                        )}
                      </div>
                      <div className="p-5 -mt-6 relative">
                        <div className="h-12 w-12 rounded-full brand-gradient flex items-center justify-center text-sm font-bold text-primary-foreground mb-3">
                          {(card.full_name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <h3 className="font-bold text-sm">{card.card_name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{card.full_name}{card.job_title ? ` • ${card.job_title}` : ""}</p>
                        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Eye size={12} />{card.views_count}</span>
                          <span className="flex items-center gap-1"><MousePointerClick size={12} />{card.taps_count}</span>
                          <span className="flex items-center gap-1"><Users size={12} />{card.leads_count}</span>
                        </div>
                      </div>
                      <div className="px-5 pb-4 flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/editor/${card.id}`); }}
                          className="flex-1 py-2.5 rounded-full bg-secondary text-xs font-medium hover:bg-secondary/80 flex items-center justify-center gap-1"
                        >
                          <Pencil size={12} />Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(card.id); }}
                          className="py-2.5 px-3 rounded-full bg-secondary text-xs text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Analytics Overview</h2>
                <ProBadge onClick={() => setUpgradeOpen(true)} />
              </div>
              {cards.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <BarChart3 size={40} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Create and publish cards to see analytics.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cards.map(card => (
                    <div key={card.id} className="bg-card rounded-2xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-sm">{card.card_name}</h3>
                        <p className="text-xs text-muted-foreground">{card.full_name}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-bold">{card.views_count}</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold">{card.taps_count}</p>
                          <p className="text-xs text-muted-foreground">Taps</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold">{card.leads_count}</p>
                          <p className="text-xs text-muted-foreground">Leads</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "scanner" && (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <ScanLine size={48} className="mx-auto text-primary mb-4" />
              <h2 className="text-lg font-bold mb-2">AI Business Card Scanner</h2>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                Scan physical business cards using AI and instantly convert them into digital TAP & GO cards.
              </p>
              <button
                onClick={() => navigate("/scanner")}
                className="px-6 py-3 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow"
              >
                <ScanLine size={16} className="inline mr-2" />Open Scanner
              </button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
