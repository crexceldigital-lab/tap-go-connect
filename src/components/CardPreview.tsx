import { Phone, Mail, Globe, Save, MessageCircle, Calendar, MapPin, UserPlus, Instagram, Linkedin, Twitter, Facebook, Youtube, Github, Send as TelegramIcon, Ghost, AtSign, Music2, Palette, Dribbble, Paperclip, Download } from "lucide-react";
import { getIconComponent } from "./IconPicker";

export interface CustomLink {
  label: string;
  url: string;
  icon?: string;
}

export interface CardAttachment {
  label: string;
  url: string;
  filename: string;
  size?: number;
  type?: string;
}

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
  bio?: string;
  address?: string;
  department?: string;
  pronouns?: string;
  secondary_phone?: string;
  secondary_email?: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  whatsapp: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  github?: string;
  behance?: string;
  dribbble?: string;
  telegram?: string;
  snapchat?: string;
  threads?: string;
  custom_links?: CustomLink[];
  attachments?: CardAttachment[];
  social_icons?: Record<string, string>;
<<<<<<< HEAD
  social_display_style?: "icons" | "buttons" | "compact";
=======
>>>>>>> dd343628e0a3826546811d7be466519d4f5f36e1
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

<<<<<<< HEAD
const SOCIAL_DEFS: { key: keyof CardData; label: string; icon: any; href: (v: string) => string }[] = [
  { key: "instagram", label: "Instagram", icon: Instagram, href: (v) => (v.startsWith("http") ? v : `https://instagram.com/${v.replace(/^@/, "")}`) },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, href: (v) => (v.startsWith("http") ? v : `https://linkedin.com/in/${v}`) },
  { key: "twitter", label: "Twitter / X", icon: Twitter, href: (v) => (v.startsWith("http") ? v : `https://x.com/${v.replace(/^@/, "")}`) },
  { key: "facebook", label: "Facebook", icon: Facebook, href: (v) => (v.startsWith("http") ? v : `https://facebook.com/${v}`) },
  { key: "tiktok", label: "TikTok", icon: Music2, href: (v) => (v.startsWith("http") ? v : `https://tiktok.com/@${v.replace(/^@/, "")}`) },
  { key: "youtube", label: "YouTube", icon: Youtube, href: (v) => (v.startsWith("http") ? v : `https://youtube.com/@${v.replace(/^@/, "")}`) },
  { key: "github", label: "GitHub", icon: Github, href: (v) => (v.startsWith("http") ? v : `https://github.com/${v}`) },
  { key: "behance", label: "Behance", icon: Palette, href: (v) => (v.startsWith("http") ? v : `https://behance.net/${v}`) },
  { key: "dribbble", label: "Dribbble", icon: Dribbble, href: (v) => (v.startsWith("http") ? v : `https://dribbble.com/${v}`) },
  { key: "telegram", label: "Telegram", icon: TelegramIcon, href: (v) => (v.startsWith("http") ? v : `https://t.me/${v.replace(/^@/, "")}`) },
  { key: "snapchat", label: "Snapchat", icon: Ghost, href: (v) => (v.startsWith("http") ? v : `https://snapchat.com/add/${v.replace(/^@/, "")}`) },
  { key: "threads", label: "Threads", icon: AtSign, href: (v) => (v.startsWith("http") ? v : `https://threads.net/@${v.replace(/^@/, "")}`) },
];



=======
const SOCIAL_DEFS: { key: keyof CardData; icon: any; href: (v: string) => string }[] = [
  { key: "instagram", icon: Instagram, href: (v) => (v.startsWith("http") ? v : `https://instagram.com/${v.replace(/^@/, "")}`) },
  { key: "linkedin", icon: Linkedin, href: (v) => (v.startsWith("http") ? v : `https://linkedin.com/in/${v}`) },
  { key: "twitter", icon: Twitter, href: (v) => (v.startsWith("http") ? v : `https://x.com/${v.replace(/^@/, "")}`) },
  { key: "facebook", icon: Facebook, href: (v) => (v.startsWith("http") ? v : `https://facebook.com/${v}`) },
  { key: "tiktok", icon: Music2, href: (v) => (v.startsWith("http") ? v : `https://tiktok.com/@${v.replace(/^@/, "")}`) },
  { key: "youtube", icon: Youtube, href: (v) => (v.startsWith("http") ? v : `https://youtube.com/@${v.replace(/^@/, "")}`) },
  { key: "github", icon: Github, href: (v) => (v.startsWith("http") ? v : `https://github.com/${v}`) },
  { key: "behance", icon: Palette, href: (v) => (v.startsWith("http") ? v : `https://behance.net/${v}`) },
  { key: "dribbble", icon: Dribbble, href: (v) => (v.startsWith("http") ? v : `https://dribbble.com/${v}`) },
  { key: "telegram", icon: TelegramIcon, href: (v) => (v.startsWith("http") ? v : `https://t.me/${v.replace(/^@/, "")}`) },
  { key: "snapchat", icon: Ghost, href: (v) => (v.startsWith("http") ? v : `https://snapchat.com/add/${v.replace(/^@/, "")}`) },
  { key: "threads", icon: AtSign, href: (v) => (v.startsWith("http") ? v : `https://threads.net/@${v.replace(/^@/, "")}`) },
];


>>>>>>> dd343628e0a3826546811d7be466519d4f5f36e1
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

          {card.bio && (
            <p className={`text-xs text-center leading-relaxed ${subtextColor}`}>{card.bio}</p>
          )}

          {card.address && (
            <div className={`flex items-start gap-2 text-xs ${subtextColor}`}>
              <MapPin size={12} className="mt-0.5 shrink-0" />
              <span>{card.address}</span>
            </div>
          )}

          {(() => {
            const socials = SOCIAL_DEFS
              .map((s) => ({ ...s, value: (card as any)[s.key] as string | undefined }))
              .filter((s) => s.value && s.value.trim().length > 0);
            if (socials.length === 0) return null;
<<<<<<< HEAD
            const mode = card.social_display_style || "icons";

            if (mode === "buttons") {
              return (
                <div className="space-y-2">
                  {socials.map(({ key, label, icon: DefaultIcon, href, value }) => {
                    const override = card.social_icons?.[key as string];
                    const Icon = override ? getIconComponent(override) : DefaultIcon;
                    const content = (
                      <>
                        <Icon size={14} />
                        <span>{label}</span>
                      </>
                    );
                    return interactive ? (
                      <a key={key as string} href={href(value!)} target="_blank" rel="noopener noreferrer" className={`${btnClass} flex items-center justify-center gap-2`} style={btnBg}>{content}</a>
                    ) : (
                      <div key={key as string} className={`${btnClass} flex items-center justify-center gap-2`} style={btnBg}>{content}</div>
                    );
                  })}
                </div>
              );
            }

            if (mode === "compact") {
              return (
                <div className={`rounded-xl ${actionBg} divide-y ${isLightSurface ? "divide-slate-900/10" : "divide-white/10"} overflow-hidden`}>
                  {socials.map(({ key, label, icon: DefaultIcon, href, value }) => {
                    const override = card.social_icons?.[key as string];
                    const Icon = override ? getIconComponent(override) : DefaultIcon;
                    const content = (
                      <>
                        <Icon size={13} className={btnTextColor} />
                        <span className={`text-xs flex-1 ${textColor}`}>{label}</span>
                        <span className={`text-[10px] ${subtextColor} truncate max-w-[90px]`}>{value}</span>
                      </>
                    );
                    return interactive ? (
                      <a key={key as string} href={href(value!)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 hover:bg-black/5 transition-colors">{content}</a>
                    ) : (
                      <div key={key as string} className="flex items-center gap-2 px-3 py-2">{content}</div>
                    );
                  })}
                </div>
              );
            }

            // default: icons-only
=======
>>>>>>> dd343628e0a3826546811d7be466519d4f5f36e1
            return (
              <div className="flex flex-wrap gap-2 justify-center">
                {socials.map(({ key, icon: DefaultIcon, href, value }) => {
                  const override = card.social_icons?.[key as string];
                  const Icon = override ? getIconComponent(override) : DefaultIcon;
                  const node = (
                    <Icon size={14} className={btnTextColor} />
                  );
                  const className = `h-9 w-9 rounded-full ${actionBg} flex items-center justify-center hover:scale-110 transition-transform`;
                  return interactive ? (
                    <a key={key as string} href={href(value!)} target="_blank" rel="noopener noreferrer" className={className}>{node}</a>
                  ) : (
                    <div key={key as string} className={className}>{node}</div>
                  );
                })}
              </div>
            );
          })()}

          {card.custom_links && card.custom_links.length > 0 && (
            <div className="space-y-2">
              {card.custom_links.filter(l => l.url && l.label).map((link, i) => {
                const Icon = getIconComponent(link.icon);
                const className = `flex items-center gap-3 px-4 py-2.5 rounded-xl ${actionBg} ${textColor} text-xs font-medium hover:scale-[1.02] transition-transform`;
                return interactive ? (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
                    <Icon size={14} /><span className="truncate">{link.label}</span>
                  </a>
                ) : (
                  <div key={i} className={className}>
                    <Icon size={14} /><span className="truncate">{link.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {card.attachments && card.attachments.length > 0 && (
            <div className="space-y-2">
              {card.attachments.filter(a => a.url).map((file, i) => {
                const className = `flex items-center gap-3 px-4 py-2.5 rounded-xl ${actionBg} ${textColor} text-xs font-medium hover:scale-[1.02] transition-transform`;
                const content = (
                  <>
                    <Paperclip size={14} className="shrink-0" />
                    <span className="truncate flex-1">{file.label || file.filename}</span>
                    <Download size={12} className={btnTextColor} />
                  </>
                );
                return interactive ? (
                  <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" download={file.filename} className={className}>{content}</a>
                ) : (
                  <div key={i} className={className}>{content}</div>
                );
              })}
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
