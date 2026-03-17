import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Eye, MousePointerClick, Users, MoreVertical, Pencil, Trash2, ExternalLink, LogOut } from "lucide-react";
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
    const { data } = await supabase.from("cards").insert({ user_id: user.id, card_name: "New Card" }).select("id").single();
    if (data) navigate(`/editor/${data.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <img src={logo} alt="TAP & GO" className="h-8" />
          <div className="flex items-center gap-4">
            <button onClick={handleCreateNew} className="flex items-center gap-2 px-5 py-2.5 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow">
              <Plus size={16} /> New Card
            </button>
            <button onClick={() => { signOut(); navigate("/"); }} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-8">Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: "Total Views", value: totalViews, icon: Eye, color: "text-blue-500" },
              { label: "Total Taps", value: totalTaps, icon: MousePointerClick, color: "text-emerald-500" },
              { label: "Leads Captured", value: totalLeads, icon: Users, color: "text-amber-500" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-card rounded-2xl p-6 border border-border card-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-secondary ${color}`}><Icon size={18} /></div>
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
                <p className="text-3xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>

          {/* Cards List */}
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
                      className="flex-1 py-2 rounded-lg bg-secondary text-xs font-medium hover:bg-secondary/80 flex items-center justify-center gap-1"
                    >
                      <Pencil size={12} />Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(card.id); }}
                      className="py-2 px-3 rounded-lg bg-secondary text-xs text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
