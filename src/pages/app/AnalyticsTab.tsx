import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Eye, MousePointerClick, Users, TrendingUp, Smartphone, Monitor } from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  totalLeads: number;
  conversionRate: number;
  mobile: number;
  desktop: number;
}

const AnalyticsTab = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: cards } = await supabase.from("cards").select("id, views_count, taps_count, leads_count").eq("user_id", user.id);
      if (!cards?.length) { setLoading(false); return; }

      const totalViews = cards.reduce((s, c) => s + c.views_count, 0);
      const totalClicks = cards.reduce((s, c) => s + c.taps_count, 0);
      const totalLeads = cards.reduce((s, c) => s + c.leads_count, 0);

      const { data: events } = await supabase
        .from("card_events")
        .select("device_type")
        .in("card_id", cards.map(c => c.id))
        .limit(1000);

      let mobile = 0, desktop = 0;
      (events || []).forEach(e => {
        if (e.device_type === "mobile") mobile++;
        else desktop++;
      });

      setData({
        totalViews,
        totalClicks,
        totalLeads,
        conversionRate: totalViews > 0 ? Math.round((totalLeads / totalViews) * 100) : 0,
        mobile,
        desktop,
      });
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 pt-4">
        <h1 className="text-xl font-extrabold mb-2">Analytics</h1>
        <p className="text-sm text-muted-foreground">Create a card to see analytics.</p>
      </div>
    );
  }

  const stats = [
    { label: "Total Views", value: data.totalViews, icon: Eye, color: "text-blue-500" },
    { label: "Total Clicks", value: data.totalClicks, icon: MousePointerClick, color: "text-emerald-500" },
    { label: "Leads", value: data.totalLeads, icon: Users, color: "text-violet-500" },
    { label: "Conversion", value: `${data.conversionRate}%`, icon: TrendingUp, color: "text-amber-500" },
  ];

  const totalDevices = data.mobile + data.desktop || 1;

  return (
    <div className="px-4 pt-4">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold">Analytics</h1>
        <p className="text-xs text-muted-foreground">Your card performance overview</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-2xl border border-border p-4 card-shadow"
          >
            <Icon size={16} className={`${color} mb-2`} />
            <p className="text-2xl font-extrabold">{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Device Split */}
      <div className="bg-card rounded-2xl border border-border p-4 card-shadow">
        <h3 className="text-sm font-bold mb-3">Device Breakdown</h3>
        <div className="space-y-3">
          {[
            { label: "Mobile", value: data.mobile, icon: Smartphone, pct: Math.round((data.mobile / totalDevices) * 100) },
            { label: "Desktop", value: data.desktop, icon: Monitor, pct: Math.round((data.desktop / totalDevices) * 100) },
          ].map(({ label, value, icon: Icon, pct }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-muted-foreground"><Icon size={12} />{label}</span>
                <span className="font-semibold">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="h-full brand-gradient rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
