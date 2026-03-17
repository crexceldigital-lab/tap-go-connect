import { Phone, Mail, Globe, Save, MessageCircle, Calendar, MapPin } from "lucide-react";

export interface CardData {
  full_name: string;
  job_title: string;
  company_name: string;
  avatar_url: string;
  logo_url: string;
  logo_position: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  whatsapp: string;
  primary_color: string;
  secondary_color: string;
  background_style: string;
  profile_image_style: string;
  profile_image_border: boolean;
  button_style: string;
  button_fill: string;
  button_shadow: boolean;
  card_layout: string;
  font_style: string;
  show_save_contact: boolean;
  show_call: boolean;
  show_email: boolean;
  show_whatsapp: boolean;
  show_book_appointment: boolean;
  show_navigate: boolean;
}

const CardPreview = ({ card }: { card: CardData }) => {
  const bgStyle = card.background_style === "gradient"
    ? { background: `linear-gradient(135deg, ${card.primary_color}, ${card.secondary_color})` }
    : { backgroundColor: card.secondary_color };

  const imgRadius = card.profile_image_style === "circle" ? "rounded-full"
    : card.profile_image_style === "rounded" ? "rounded-2xl" : "rounded-none";

  const btnRadius = card.button_style === "pill" ? "rounded-full"
    : card.button_style === "rounded" ? "rounded-xl" : "rounded-none";

  const btnClass = `${btnRadius} py-2.5 text-xs font-semibold text-center transition-all ${
    card.button_fill === "fill"
      ? "text-white"
      : "border border-white/30 text-white/90"
  } ${card.button_shadow ? "shadow-lg" : ""}`;

  const btnBg = card.button_fill === "fill" ? { backgroundColor: card.primary_color } : {};

  const fontClass = card.font_style === "bold" ? "font-black tracking-tight" : "font-semibold";

  const initials = (card.full_name || "?").split(" ").map(n => n[0]).join("").slice(0, 2);

  const actions = [
    { show: card.show_call, icon: Phone, label: "Call" },
    { show: card.show_email, icon: Mail, label: "Email" },
    { show: card.show_whatsapp, icon: MessageCircle, label: "WhatsApp" },
    { show: card.show_book_appointment, icon: Calendar, label: "Book" },
    { show: card.show_navigate, icon: MapPin, label: "Navigate" },
  ].filter(a => a.show);

  const isModern = card.card_layout === "modern";
  const isCover = card.card_layout === "cover";

  return (
    <div className={`w-[300px] rounded-[32px] border border-border bg-card p-3 ${isModern ? "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]" : "shadow-2xl"}`}>
      <div className="rounded-[24px] overflow-hidden relative" style={bgStyle}>
        {/* Cover layout: full-width bg image */}
        {isCover && card.avatar_url && (
          <div className="absolute inset-0">
            <img src={card.avatar_url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}

        <div className={`relative p-6 space-y-5 ${isCover ? "pt-28" : ""}`}>
          {/* Logo top */}
          {card.logo_url && card.logo_position === "top" && (
            <div className="flex justify-center">
              <img src={card.logo_url} alt="Logo" className="h-8 object-contain" />
            </div>
          )}

          {/* Profile */}
          {!isCover && (
            <div className={`text-center space-y-3 ${card.card_layout === "bold" ? "pt-4" : ""}`}>
              <div className={`mx-auto ${card.card_layout === "bold" ? "h-24 w-24" : isModern ? "h-20 w-20" : "h-16 w-16"} ${imgRadius} overflow-hidden flex items-center justify-center ${card.profile_image_border ? "ring-2 ring-white/30" : ""}`}
                style={{ backgroundColor: card.primary_color + "40" }}>
                {card.avatar_url ? (
                  <img src={card.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className={`${card.card_layout === "bold" ? "text-2xl" : "text-lg"} font-bold text-white`}>{initials}</span>
                )}
              </div>
              <div>
                <h3 className={`text-lg text-white ${fontClass}`}>{card.full_name || "Your Name"}</h3>
                <p className="text-sm text-white/60">{card.job_title}{card.company_name ? ` • ${card.company_name}` : ""}</p>
              </div>
            </div>
          )}

          {/* Cover layout profile */}
          {isCover && (
            <div className="text-center space-y-2">
              <h3 className={`text-xl text-white ${fontClass}`}>{card.full_name || "Your Name"}</h3>
              <p className="text-sm text-white/70">{card.job_title}{card.company_name ? ` • ${card.company_name}` : ""}</p>
            </div>
          )}

          {/* Logo center */}
          {card.logo_url && card.logo_position === "center" && (
            <div className="flex justify-center">
              <img src={card.logo_url} alt="Logo" className="h-8 object-contain" />
            </div>
          )}

          {/* Action buttons */}
          {actions.length > 0 && (
            <div className={`grid ${actions.length <= 3 ? `grid-cols-${actions.length}` : "grid-cols-3"} gap-2`}>
              {actions.map(({ icon: Icon, label }) => (
                <div key={label} className={`${isModern ? "rounded-2xl bg-white/15 backdrop-blur-sm" : "rounded-xl bg-white/10"} py-2.5 flex flex-col items-center gap-1 cursor-pointer hover:bg-white/20 transition-colors`}>
                  <Icon size={14} className="text-white/70" />
                  <span className="text-[10px] text-white/70">{label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Contact info for corporate layout */}
          {card.card_layout === "corporate" && (
            <div className="space-y-2">
              {card.phone && <div className="flex items-center gap-2 text-xs text-white/70"><Phone size={12} />{card.phone}</div>}
              {card.email && <div className="flex items-center gap-2 text-xs text-white/70"><Mail size={12} />{card.email}</div>}
              {card.website && <div className="flex items-center gap-2 text-xs text-white/70"><Globe size={12} />{card.website}</div>}
            </div>
          )}

          {/* Save contact */}
          {card.show_save_contact && (
            <div className={btnClass} style={btnBg}>
              <Save size={14} className="inline mr-1.5" />Save Contact
            </div>
          )}

          {/* Logo footer */}
          {card.logo_url && card.logo_position === "footer" && (
            <div className="flex justify-center pt-2">
              <img src={card.logo_url} alt="Logo" className="h-6 object-contain opacity-60" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
