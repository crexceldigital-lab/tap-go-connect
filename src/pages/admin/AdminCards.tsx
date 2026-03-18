import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface CardItem {
  id: string;
  card_name: string;
  full_name: string | null;
  is_published: boolean;
  views_count: number;
  taps_count: number;
  leads_count: number;
  created_at: string;
  slug: string | null;
}

const AdminCards = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("cards")
        .select("id, card_name, full_name, is_published, views_count, taps_count, leads_count, created_at, slug")
        .order("created_at", { ascending: false });
      setCards(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = cards.filter((c) => {
    const q = search.toLowerCase();
    return c.card_name.toLowerCase().includes(q) || (c.full_name || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cards</h1>
          <p className="text-muted-foreground text-sm">{cards.length} total cards</p>
        </div>
        <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 p-0 h-auto focus-visible:ring-0 text-sm w-48"
          />
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Card Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Taps</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No cards found</TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.card_name}</TableCell>
                    <TableCell className="text-sm">{c.full_name || "—"}</TableCell>
                    <TableCell className="text-sm">{c.views_count}</TableCell>
                    <TableCell className="text-sm">{c.taps_count}</TableCell>
                    <TableCell className="text-sm">{c.leads_count}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={c.is_published ? "default" : "secondary"} className="text-xs">
                        {c.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCards;
