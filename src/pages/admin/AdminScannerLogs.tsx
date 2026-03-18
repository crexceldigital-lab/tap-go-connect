import { Card, CardContent } from "@/components/ui/card";
import { ScanLine } from "lucide-react";

const AdminScannerLogs = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">AI Scanner Logs</h1>
      <p className="text-muted-foreground text-sm">Track scanner usage across the platform</p>
    </div>
    <Card className="border-none shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="p-4 rounded-full bg-muted mb-4">
          <ScanLine className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">Scanner logs coming soon</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Scanner activity will be tracked and displayed here.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default AdminScannerLogs;
