import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

const AdminPayments = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Payments</h1>
      <p className="text-muted-foreground text-sm">Track all transactions</p>
    </div>
    <Card className="border-none shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="p-4 rounded-full bg-muted mb-4">
          <DollarSign className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">Payment tracking coming soon</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Connect a payment provider to start tracking transactions.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default AdminPayments;
