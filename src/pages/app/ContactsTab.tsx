import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Phone, Mail, Building2, Calendar, UserPlus } from "lucide-react";

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

const ContactsTab = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchLeads = async () => {
      const { data: cards } = await supabase.from("cards").select("id, card_name").eq("user_id", user.id);
      if (!cards?.length) { setLoading(false); return; }

      const cardMap = Object.fromEntries(cards.map(c => [c.id, c.card_name]));
      const { data: leadsData } = await supabase
        .from("leads")
        .select("*")
        .in("card_id", cards.map(c => c.id))
        .order("created_at", { ascending: false })
        .limit(50);

      setLeads((leadsData || []).map(l => ({ ...l, card_name: cardMap[l.card_id] || "Unknown" })));
      setLoading(false);
    };
    fetchLeads();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold">Contacts</h1>
        <p className="text-xs text-muted-foreground">{leads.length} lead{leads.length !== 1 ? "s" : ""} collected</p>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-3xl border border-border">
          <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
            <UserPlus size={24} className="text-primary" />
          </div>
          <h3 className="font-bold mb-1">No Contacts Yet</h3>
          <p className="text-sm text-muted-foreground px-8">Share your card to start collecting leads</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card rounded-2xl border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {lead.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{lead.full_name}</h3>
                  {lead.company_name && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Building2 size={10} />{lead.company_name}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone size={10} />{lead.phone}</span>
                    {lead.email && <span className="flex items-center gap-1"><Mail size={10} />{lead.email}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{lead.source}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar size={8} />{new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <a href={`tel:${lead.phone}`} className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <Phone size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactsTab;
