import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getPaddleEnvironment } from "@/lib/paddle";

export type SubscriptionRow = {
  id: string;
  user_id: string;
  paddle_subscription_id: string;
  paddle_customer_id: string;
  product_id: string;
  price_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  environment: string;
  created_at: string;
  updated_at: string;
};

function computeIsActive(row: SubscriptionRow | null): boolean {
  if (!row) return false;
  const end = row.current_period_end ? new Date(row.current_period_end).getTime() : null;
  const now = Date.now();
  if (["active", "trialing", "past_due"].includes(row.status)) {
    return end === null || end > now;
  }
  if (row.status === "canceled") {
    return end !== null && end > now;
  }
  return false;
}

export function useSubscription(userId: string | null | undefined) {
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const env = getPaddleEnvironment();

    const fetchSub = async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("environment", env)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) {
        setSubscription((data as SubscriptionRow) ?? null);
        setLoading(false);
      }
    };

    fetchSub();

    const channel = supabase
      .channel(`subscriptions:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${userId}` },
        () => fetchSub()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    subscription,
    isActive: computeIsActive(subscription),
    isPro: computeIsActive(subscription) && subscription?.product_id === "pro_plan",
    loading,
  };
}
