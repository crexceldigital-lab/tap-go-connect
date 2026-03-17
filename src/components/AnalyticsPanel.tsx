import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Eye, MousePointerClick, Users, TrendingUp, Loader2, Smartphone, Monitor } from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  totalLeads: number;
  conversionRate: number;
  deviceBreakdown: { mobile: number; desktop: number };
  clickBreakdown: Record<string, number>;
}

const AnalyticsPanel = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAnalytics = async () => {
      const { data: cards } = await supabase
        .from("cards")
        .select("id")
        .eq("user_id", user.id);

      if (!cards || cards.length === 0) {
        setData({ totalViews: 0, totalClicks: 0, totalLeads: 0, conversionRate: 0, deviceBreakdown: { mobile: 0, desktop: 0 }, clickBreakdown: {} });
        setLoading(false);
        return;
      }

      const cardIds = cards.map(c => c.id);

      const { data: events } = await supabase
        .from("card_events" as any)
        .select("event_type, device_type")
        .in("card_id", cardIds)
        .limit(1000);

      const { data: leads } = await supabase
        .from("leads" as any)
        .select("id")
        .in("card_id", cardIds);

      const evts = (events as any[]) || [];
      const totalViews = evts.filter(e => e.event_type === "view").length;
      const clicks = evts.filter(e => e.event_type !== "view");
      const totalClicks = clicks.length;
      const totalLeads = (leads as any[])?.length || 0;
      const conversionRate = totalViews > 0 ? Math.round((totalLeads / totalViews) * 100) : 0;

      const mobile = evts.filter(e => e.device_type === "mobile").length;
      const desktop = evts.filter(e => e.device_type === "desktop").length;

      const clickBreakdown: Record<string, number> = {};
      clicks.forEach(e => {
        const type = e.event_type.replace("click_", "");
        clickBreakdown[type] = (clickBreakdown[type] || 0) + 1;
      });

      setData({ totalViews, totalClicks, totalLeads, conversionRate, deviceBreakdown: { mobile, desktop }, clickBreakdown });
      setLoading(false);
    };
    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    { label: "Total Views", value: data.totalViews, icon: Eye },
    { label: "Total Clicks", value: data.totalClicks, icon: MousePointerClick },
    { label: "Leads Collected", value: data.totalLeads, icon: Users },
    { label: "Conversion Rate", value: `${data.conversionRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Analytics Overview</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card rounded-2xl p-4 sm:p-5 border border-border card-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-secondary text-primary"><Icon size={14} /></div>
            </div>
            <p className="text-2xl font-extrabold">{value}</p>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Device breakdown */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-bold text-sm mb-4">Device Breakdown</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-primary" />
            <div>
              <p className="font-bold text-sm">{data.deviceBreakdown.mobile}</p>
              <p className="text-xs text-muted-foreground">Mobile</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Monitor size={16} className="text-primary" />
            <div>
              <p className="font-bold text-sm">{data.deviceBreakdown.desktop}</p>
              <p className="text-xs text-muted-foreground">Desktop</p>
            </div>
          </div>
        </div>
      </div>

      {/* Click breakdown */}
      {Object.keys(data.clickBreakdown).length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-sm mb-4">Click Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(data.clickBreakdown).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                <span className="text-xs font-medium capitalize">{type}</span>
                <span className="text-sm font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;
