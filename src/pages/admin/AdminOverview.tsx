import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, UserCheck, Share2, Eye, MousePointer } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from "recharts";

interface Stats {
  totalUsers: number;
  totalCards: number;
  totalLeads: number;
  totalShares: number;
  totalViews: number;
  totalClicks: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalCards: 0, totalLeads: 0, totalShares: 0, totalViews: 0, totalClicks: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [profilesRes, cardsRes, leadsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("cards").select("id, views_count, share_count, taps_count"),
        supabase.from("leads").select("id", { count: "exact", head: true }),
      ]);

      const cards = cardsRes.data || [];
      const totalViews = cards.reduce((s, c) => s + (c.views_count || 0), 0);
      const totalShares = cards.reduce((s, c) => s + (c.share_count || 0), 0);
      const totalClicks = cards.reduce((s, c) => s + (c.taps_count || 0), 0);

      setStats({
        totalUsers: profilesRes.count || 0,
        totalCards: cards.length,
        totalLeads: leadsRes.count || 0,
        totalShares,
        totalViews,
        totalClicks,
      });

      // Recent leads as activity
      const { data: recentLeads } = await supabase
        .from("leads")
        .select("full_name, source, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      setRecentActivity(recentLeads || []);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const metricCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { label: "Total Cards", value: stats.totalCards, icon: CreditCard, color: "text-emerald-500" },
    { label: "Total Leads", value: stats.totalLeads, icon: UserCheck, color: "text-violet-500" },
    { label: "Total Shares", value: stats.totalShares, icon: Share2, color: "text-amber-500" },
    { label: "Total Views", value: stats.totalViews, icon: Eye, color: "text-cyan-500" },
    { label: "Total Clicks", value: stats.totalClicks, icon: MousePointer, color: "text-rose-500" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm">Platform metrics at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((m) => (
          <Card key={m.label} className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
                  <p className="text-2xl font-bold mt-1">{m.value.toLocaleString()}</p>
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
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.full_name}</p>
                      <p className="text-xs text-muted-foreground">via {item.source}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <span className="text-sm font-bold">
                  {stats.totalViews > 0 ? ((stats.totalLeads / stats.totalViews) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Shares/Card</span>
                <span className="text-sm font-bold">
                  {stats.totalCards > 0 ? (stats.totalShares / stats.totalCards).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Views/Card</span>
                <span className="text-sm font-bold">
                  {stats.totalCards > 0 ? (stats.totalViews / stats.totalCards).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Leads/User</span>
                <span className="text-sm font-bold">
                  {stats.totalUsers > 0 ? (stats.totalLeads / stats.totalUsers).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
