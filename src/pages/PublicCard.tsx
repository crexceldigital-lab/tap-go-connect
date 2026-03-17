import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CardPreview, { CardData } from "@/components/CardPreview";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { useCardTracking } from "@/hooks/useCardTracking";
import { useLeadGate } from "@/hooks/useLeadGate";
import { Loader2 } from "lucide-react";

const PublicCard = () => {
  const { slug } = useParams<{ slug: string }>();
  const [card, setCard] = useState<CardData | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: string; href?: string } | null>(null);

  const { trackEvent, trackPageView } = useCardTracking(cardId);
  const { hasSubmitted, shouldGate, skipsRemaining, markSubmitted, useSkip } = useLeadGate(cardId);

  useEffect(() => {
    if (!slug) return;
    const fetchCard = async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setCardId(data.id);
        setCard({
          full_name: data.full_name || "",
          job_title: data.job_title || "",
          company_name: data.company_name || "",
          avatar_url: data.avatar_url || "",
          logo_url: data.logo_url || "",
          logo_position: data.logo_position,
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          instagram: data.instagram || "",
          linkedin: data.linkedin || "",
          twitter: data.twitter || "",
          whatsapp: data.whatsapp || "",
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          background_style: data.background_style,
          profile_image_style: data.profile_image_style,
          profile_image_border: data.profile_image_border,
          button_style: data.button_style,
          button_fill: data.button_fill,
          button_shadow: data.button_shadow,
          card_layout: data.card_layout,
          font_style: data.font_style,
          card_theme: (data as any).card_theme || "light",
          show_save_contact: data.show_save_contact,
          show_call: data.show_call,
          show_email: data.show_email,
          show_whatsapp: data.show_whatsapp,
          show_book_appointment: data.show_book_appointment,
          show_navigate: data.show_navigate,
        });
        // Increment views
        try {
          await supabase.from("cards").update({ views_count: (data.views_count || 0) + 1 } as any).eq("id", data.id);
        } catch {}
      }
      setLoading(false);
    };
    fetchCard();
  }, [slug]);

  // Track page view once card is loaded
  useEffect(() => {
    if (cardId) trackPageView();
  }, [cardId, trackPageView]);

  const executeAction = useCallback((type: string, href?: string) => {
    trackEvent(`click_${type}`);
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }, [trackEvent]);

  const handleActionClick = useCallback((actionType: string, href?: string) => {
    if (shouldGate) {
      setPendingAction({ type: actionType, href });
      setShowLeadModal(true);
      return;
    }
    executeAction(actionType, href);
  }, [shouldGate, executeAction]);

  const handleConnectClick = useCallback(() => {
    if (hasSubmitted) return; // already connected
    setShowLeadModal(true);
  }, [hasSubmitted]);

  const handleLeadSuccess = useCallback(() => {
    markSubmitted();
    // Execute pending action if any
    if (pendingAction) {
      setTimeout(() => {
        executeAction(pendingAction.type, pendingAction.href);
        setPendingAction(null);
      }, 1600);
    }
  }, [markSubmitted, pendingAction, executeAction]);

  const handleSkip = useCallback(() => {
    useSkip();
    if (pendingAction) {
      executeAction(pendingAction.type, pendingAction.href);
      setPendingAction(null);
    }
  }, [useSkip, pendingAction, executeAction]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (notFound || !card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4">
        <h1 className="text-2xl font-bold">Card not found</h1>
        <p className="text-muted-foreground text-center">This card may have been removed or is not published.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <CardPreview
        card={card}
        interactive
        onActionClick={handleActionClick}
        onConnectClick={handleConnectClick}
      />
      {cardId && (
        <LeadCaptureModal
          open={showLeadModal}
          onClose={() => { setShowLeadModal(false); setPendingAction(null); }}
          cardId={cardId}
          onSuccess={handleLeadSuccess}
          skipsRemaining={skipsRemaining}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
};

export default PublicCard;
