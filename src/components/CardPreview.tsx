import { Phone, Mail, Globe, Save, MessageCircle, Calendar, MapPin, UserPlus } from "lucide-react";

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
  card_theme?: string;
  show_save_contact: boolean;
  show_call: boolean;
  show_email: boolean;
  show_whatsapp: boolean;
  show_book_appointment: boolean;
  show_navigate: boolean;
}

interface CardPreviewProps {
  card: CardData;
  interactive?: boolean;
  onActionClick?: (actionType: string, href?: string) => void;
  onConnectClick?: () => void;
}

const hexToLuminance = (hex: string) => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16) || 0;
  const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const CardPreview = ({ card, interactive, onActionClick, onConnectClick }: CardPreviewProps) => {
  const isDark = card.card_theme === "dark";

  // "Dark theme" always forces a near-black background, so white text is always safe there.
  // In light theme, the actual chosen colors become the surface — compute real luminance
  // so a light/white card gets dark text instead of invisible white-on-white.
  const bgLuminance = isDark
    ? 0
    : card.background_style === "gradient"
      ? (hexToLuminance(card.primary_color) + hexToLuminance(card.secondary_color)) / 2
      : hexToLuminance(card.secondary_color);
  const isLightSurface = !isDark && bgLuminance > 0.55;

  const bgStyle = card.background_style === "gradient"
    ? { background: isDark
        ? `linear-gradient(135deg, #0f172a, ${card.secondary_color})`
        : `linear-gradient(135deg, ${card.primary_color}, ${card.secondary_color})` }
    : { backgroundColor: isDark ? "#0f172a" : card.secondary_color };

  const textColor = isLightSurface ? "text-slate-900" : "text-white";
  const subtextColor = isLightSurface ? "text-slate-500" : "text-white/60";
  const btnTextColor = isLightSurface ? "text-slate-600" : "text-white/70";
  const actionBg = isLightSurface ? "bg-slate-900/5" : "bg-white/10";
  const ringColor = isLightSurface ? "ring-slate-900/15" : "ring-white/30";
  const outlineBorder = isLightSurface ? "border-slate-900/15" : "border-white/30";

  const imgRadius = card.profile_image_style === "circle" ? "rounded-full"
    : card.profile_image_style === "rounded" ? "rounded-2xl" : "rounded-none";

  const btnRadius = card.button_style === "pill" ? "rounded-full"
    : card.button_style === "rounded" ? "rounded-xl" : "rounded-none";

  const btnClass = `${btnRadius} py-3 text-xs font-semibold text-center transition-all ${
    card.button_fill === "fill"
      ? "text-white"
      : `border ${outlineBorder} ${isLightSurface ? "text-slate-700" : "text-white/90"}`
  } ${card.button_shadow ? "shadow-lg" : ""}`;

  const btnBg = card.button_fill === "fill" ? { backgroundColor: card.primary_color } : {};

  const fontClass = card.font_style === "bold" ? "font-black tracking-tight" : "font-semibold";

  const initials = (card.full_name || "?").split(" ").map(n => n[0]).join("").slice(0, 2);

  const actionHrefs: Record<string, string | undefined> = {
    Call: interactive && card.phone ? `tel:${card.phone}` : undefined,
    Email: interactive && card.email ? `mailto:${card.email}` : undefined,
    WhatsApp: interactive && card.whatsapp ? `https://wa.me/${card.whatsapp.replace(/\D/g, "")}` : undefined,
  };

  const actions = [
    { show: card.show_call, icon: Phone, label: "Call" },
    { show: card.show_email, icon: Mail, label: "Email" },
    { show: card.show_whatsapp, icon: MessageCircle, label: "WhatsApp" },
    { show: card.show_book_appointment, icon: Calendar, label: "Book" },
    { show: card.show_navigate, icon: MapPin, label: "Navigate" },
  ].filter(a => a.show);

  const isModern = card.card_layout === "modern";
  const isCover = card.card_layout === "cover";

  const handleActionClick = (label: string) => {
    if (onActionClick) {
      onActionClick(label.toLowerCase(), actionHrefs[label]);
    } else if (interactive && actionHrefs[label]) {
      window.open(actionHrefs[label], "_blank", "noopener,noreferrer");
    }
  };

  const handleSaveContact = () => {
    if (onActionClick) {
      onActionClick("save_contact");
    }
  };

  const handleConnect = () => {
    if (onConnectClick) {
      onConnectClick();
    }
  };

  return (
    <div className={`w-[300px] rounded-[32px] border border-border ${isDark ? "bg-slate-900" : "bg-card"} p-3 ${isModern ? "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]" : "shadow-2xl"}`}>
      <div className="rounded-[24px] overflow-hidden relative" style={bgStyle}>
        {isCover && card.avatar_url && (
          <div className="absolute inset-0">
            <img src={card.avatar_url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}

        <div className={`relative p-6 space-y-5 ${isCover ? "pt-28" : ""}`}>
          {card.logo_url && card.logo_position === "top" && (
            <div className="flex justify-center">
              <img src={card.logo_url} alt="Logo" className="h-8 object-contain" />
            </div>
          )}

          {!isCover && (
            <div className={`text-center space-y-3 ${card.card_layout === "bold" ? "pt-4" : ""}`}>
              <div className={`mx-auto ${card.card_layout === "bold" ? "h-24 w-24" : isModern ? "h-20 w-20" : "h-16 w-16"} ${imgRadius} overflow-hidden flex items-center justify-center ${card.profile_image_border ? `ring-2 ${ringColor}` : ""}`}
                style={{ backgroundColor: card.primary_color + "40" }}>
                {card.avatar_url ? (
                  <img src={card.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className={`${card.card_layout === "bold" ? "text-2xl" : "text-lg"} font-bold ${textColor}`}>{initials}</span>
                )}
              </div>
              <div>
                <h3 className={`text-lg ${textColor} ${fontClass}`}>{card.full_name || "Your Name"}</h3>
                <p className={`text-sm ${subtextColor}`}>{card.job_title}{card.company_name ? ` • ${card.company_name}` : ""}</p>
              </div>
            </div>
          )}

          {isCover && (
            <div className="text-center space-y-2">
              <h3 className={`text-xl text-white ${fontClass}`}>{card.full_name || "Your Name"}</h3>
              <p className="text-sm text-white/70">{card.job_title}{card.company_name ? ` • ${card.company_name}` : ""}</p>
            </div>
          )}

          {card.logo_url && card.logo_position === "center" && (
            <div className="flex justify-center">
              <img src={card.logo_url} alt="Logo" className="h-8 object-contain" />
            </div>
          )}

          {actions.length > 0 && (
            <div className={`grid ${actions.length <= 3 ? `grid-cols-${actions.length}` : "grid-cols-3"} gap-2`}>
              {actions.map(({ icon: Icon, label }) => (
                <div key={label}
                  onClick={() => handleActionClick(label)}
                  className={`${isModern ? `rounded-2xl backdrop-blur-sm ${isLightSurface ? "bg-slate-900/5" : "bg-white/15"}` : `rounded-xl ${actionBg}`} py-3 flex flex-col items-center gap-1.5 cursor-pointer hover:bg-white/20 transition-colors`}>
                  <Icon size={16} className={btnTextColor} />
                  <span className={`text-[10px] ${btnTextColor}`}>{label}</span>
                </div>
              ))}
            </div>
          )}

          {card.card_layout === "corporate" && (
            <div className="space-y-2">
              {card.phone && <div className={`flex items-center gap-2 text-xs ${subtextColor}`}><Phone size={12} />{card.phone}</div>}
              {card.email && <div className={`flex items-center gap-2 text-xs ${subtextColor}`}><Mail size={12} />{card.email}</div>}
              {card.website && <div className={`flex items-center gap-2 text-xs ${subtextColor}`}><Globe size={12} />{card.website}</div>}
            </div>
          )}

          {/* Let's Connect CTA */}
          {interactive && (
            <div
              onClick={handleConnect}
              className="rounded-full py-3.5 text-xs font-bold text-center cursor-pointer text-white transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${card.primary_color}, ${card.primary_color}dd)` }}
            >
              <UserPlus size={14} className="inline mr-1.5" />Let's Connect
            </div>
          )}

          {card.show_save_contact && (
            <div className={`${btnClass} cursor-pointer`} style={btnBg} onClick={handleSaveContact}>
              <Save size={14} className="inline mr-1.5" />Save Contact
            </div>
          )}

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
