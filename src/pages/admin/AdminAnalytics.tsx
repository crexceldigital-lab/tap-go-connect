import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MousePointer, UserCheck, TrendingUp } from "lucide-react";

const AdminAnalytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [cardsRes, leadsRes, eventsRes] = await Promise.all([
        supabase.from("cards").select("id, views_count, taps_count, leads_count, share_count"),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("card_events").select("event_type, device_type").limit(1000),
      ]);

      const cards = cardsRes.data || [];
      const events = eventsRes.data || [];
      const totalViews = cards.reduce((s, c) => s + (c.views_count || 0), 0);
      const totalClicks = cards.reduce((s, c) => s + (c.taps_count || 0), 0);
      const totalLeads = leadsRes.count || 0;
      const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : "0";

      const mobile = events.filter((e) => e.device_type === "mobile").length;
      const desktop = events.filter((e) => e.device_type === "desktop").length;

      // Top cards by views
      const topCards = [...cards]
        .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
        .slice(0, 5);

      setData({ totalViews, totalClicks, totalLeads, conversionRate, mobile, desktop, topCards, totalEvents: events.length });
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  }

  const metrics = [
    { label: "Total Views", value: data.totalViews.toLocaleString(), icon: Eye, color: "text-blue-500" },
    { label: "Total Clicks", value: data.totalClicks.toLocaleString(), icon: MousePointer, color: "text-emerald-500" },
    { label: "Total Leads", value: data.totalLeads.toLocaleString(), icon: UserCheck, color: "text-violet-500" },
    { label: "Conversion Rate", value: `${data.conversionRate}%`, icon: TrendingUp, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm">Platform-wide performance data</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
                  <p className="text-2xl font-bold mt-1">{m.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-muted ${m.color}`}>
                  <m.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Mobile", value: data.mobile, pct: data.totalEvents > 0 ? ((data.mobile / data.totalEvents) * 100).toFixed(0) : 0 },
                { label: "Desktop", value: data.desktop, pct: data.totalEvents > 0 ? ((data.desktop / data.totalEvents) * 100).toFixed(0) : 0 },
              ].map((d) => (
                <div key={d.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{d.label}</span>
                    <span className="font-medium">{d.pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Cards by Views</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topCards.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No cards yet</p>
            ) : (
              <div className="space-y-3">
                {data.topCards.map((c: any, i: number) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                      <span className="text-sm font-medium truncate max-w-[180px]">{c.id.slice(0, 8)}</span>
                    </div>
                    <span className="text-sm font-medium">{c.views_count} views</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
