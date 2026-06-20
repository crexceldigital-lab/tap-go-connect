import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    freeShares: 5,
    freeScans: 3,
    freeCards: 1,
    proPrice: 25000,
    enableScanner: true,
    enableLeadCapture: true,
    enableAppleWallet: false,
  });

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Platform settings updated successfully." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">Global platform configuration</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Free Plan Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Max Cards</Label>
              <Input type="number" value={settings.freeCards} onChange={(e) => setSettings({ ...settings, freeCards: +e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Max Shares/Month</Label>
              <Input type="number" value={settings.freeShares} onChange={(e) => setSettings({ ...settings, freeShares: +e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Max AI Scans</Label>
              <Input type="number" value={settings.freeScans} onChange={(e) => setSettings({ ...settings, freeScans: +e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Feature Toggles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { key: "enableScanner" as const, label: "AI Business Card Scanner" },
              { key: "enableLeadCapture" as const, label: "Lead Capture Forms" },
              { key: "enableAppleWallet" as const, label: "Apple Wallet Integration" },
            ].map((f) => (
              <div key={f.key} className="flex items-center justify-between">
                <Label className="text-sm">{f.label}</Label>
                <Switch
                  checked={settings[f.key]}
                  onCheckedChange={(v) => setSettings({ ...settings, [f.key]: v })}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSave} className="bg-primary">Save Settings</Button>
    </div>
  );
};

export default AdminSettings;
