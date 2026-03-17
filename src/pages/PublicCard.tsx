import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CardPreview, { CardData } from "@/components/CardPreview";
import { Loader2 } from "lucide-react";

const PublicCard = () => {
  const { slug } = useParams<{ slug: string }>();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
          show_save_contact: data.show_save_contact,
          show_call: data.show_call,
          show_email: data.show_email,
          show_whatsapp: data.show_whatsapp,
          show_book_appointment: data.show_book_appointment,
          show_navigate: data.show_navigate,
        });
        // Increment views
        await supabase.rpc("increment_views" as any, { card_id: data.id }).catch(() => {});
      }
      setLoading(false);
    };
    fetchCard();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (notFound || !card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-2xl font-bold">Card not found</h1>
        <p className="text-muted-foreground">This card may have been removed or is not published.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <CardPreview card={card} interactive />
    </div>
  );
};

export default PublicCard;
