import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0/mo",
    features: ["1 digital card", "5 shares/month", "3 AI scans", "Basic analytics"],
    badge: "Current Default",
  },
  {
    name: "Pro",
    price: "$9.99/mo",
    features: ["Unlimited cards", "Unlimited shares", "Unlimited scans", "Advanced analytics", "Priority support"],
    badge: "Premium",
  },
];

const AdminSubscriptions = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
      <p className="text-muted-foreground text-sm">Manage plans and pricing</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {plans.map((plan) => (
        <Card key={plan.name} className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{plan.name} Plan</CardTitle>
              <Badge variant="outline">{plan.badge}</Badge>
            </div>
            <p className="text-2xl font-bold text-primary">{plan.price}</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="text-sm flex items-center gap-2">
                  <Crown className="h-3 w-3 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default AdminSubscriptions;
