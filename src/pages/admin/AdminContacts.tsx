import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";

interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  company_name: string | null;
  source: string;
  created_at: string;
}

const AdminContacts = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      setLeads(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    return l.full_name.toLowerCase().includes(q) || (l.email || "").toLowerCase().includes(q) || l.phone.includes(q);
  });

  const exportExcel = () => {
    const rows = filtered.map((l) => ({
      Name: l.full_name,
      Phone: l.phone,
      Email: l.email || "",
      Company: l.company_name || "",
      Source: l.source,
      Date: new Date(l.created_at).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [{ wch: 22 }, { wch: 16 }, { wch: 26 }, { wch: 22 }, { wch: 12 }, { wch: 12 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, `leads-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground text-sm">{leads.length} total leads</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportExcel}>
            <Download className="h-4 w-4 mr-1" /> Export Excel
          </Button>
          <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 border">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 p-0 h-auto focus-visible:ring-0 text-sm w-48"
            />
          </div>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No leads found</TableCell>
                </TableRow>
              ) : (
                filtered.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.full_name}</TableCell>
                    <TableCell className="text-sm">{l.phone}</TableCell>
                    <TableCell className="text-sm">{l.email || "—"}</TableCell>
                    <TableCell className="text-sm">{l.company_name || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{l.source}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</TableCell>
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

export default AdminContacts;
