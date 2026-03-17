import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const getVisitorId = (): string => {
  let id = localStorage.getItem("tng_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("tng_visitor_id", id);
  }
  return id;
};

const getDeviceType = (): string => {
  return window.innerWidth < 768 ? "mobile" : "desktop";
};

export const useCardTracking = (cardId: string | null) => {
  const tracked = useRef(false);

  const trackEvent = useCallback(async (eventType: string) => {
    if (!cardId) return;
    try {
      await supabase.from("card_events" as any).insert({
        card_id: cardId,
        event_type: eventType,
        device_type: getDeviceType(),
        visitor_id: getVisitorId(),
      } as any);
    } catch {}
  }, [cardId]);

  const trackPageView = useCallback(async () => {
    if (!cardId || tracked.current) return;
    tracked.current = true;
    await trackEvent("view");
  }, [cardId, trackEvent]);

  return { trackEvent, trackPageView };
};
