import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Phone, Mail, Building2, Calendar, Loader2 } from "lucide-react";

interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  company_name: string | null;
  source: string;
  created_at: string;
  card_name?: string;
}

const LeadsSection = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchLeads = async () => {
      // Get user's card IDs first
      const { data: cards } = await supabase
        .from("cards")
        .select("id, card_name")
        .eq("user_id", user.id);

      if (!cards || cards.length === 0) {
        setLoading(false);
        return;
      }

      const cardMap = Object.fromEntries(cards.map(c => [c.id, c.card_name]));
      const cardIds = cards.map(c => c.id);

      const { data: leadsData } = await supabase
        .from("leads" as any)
        .select("*")
        .in("card_id", cardIds)
        .order("created_at", { ascending: false })
        .limit(50);

      if (leadsData) {
        setLeads((leadsData as any[]).map(l => ({
          ...l,
          card_name: cardMap[l.card_id] || "Unknown Card",
        })));
      }
      setLoading(false);
    };
    fetchLeads();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border">
        <Phone size={40} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="font-bold mb-2">No contacts yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Share your published cards to start collecting leads.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Contacts Collected</h2>
        <span className="text-sm text-muted-foreground">{leads.length} lead{leads.length !== 1 ? "s" : ""}</span>
      </div>
      {leads.map((lead) => (
        <div key={lead.id} className="bg-card rounded-2xl border border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm truncate">{lead.full_name}</h4>
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase">{lead.source}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Phone size={11} />{lead.phone}</span>
              {lead.email && <span className="flex items-center gap-1"><Mail size={11} />{lead.email}</span>}
              {lead.company_name && <span className="flex items-center gap-1"><Building2 size={11} />{lead.company_name}</span>}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Calendar size={11} />
            {new Date(lead.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadsSection;
