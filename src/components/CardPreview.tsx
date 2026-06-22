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
  social_display_style?: "icons" | "buttons" | "compact";
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

// Older theme presets used these layout names — map them onto the new four
// structural families so previously published cards don't break.
const LEGACY_LAYOUT_MAP: Record<string, string> = {
  minimal: "classic",
  bold: "classic",
  modern: "classic",
  corporate: "split",
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

  // Cover layout's bottom panel is always a neutral surface (not tinted by
  // primary/secondary), since the photo above already carries the color.
  const panelTextColor = isDark ? "text-white" : "text-slate-900";
  const panelSubtextColor = isDark ? "text-white/55" : "text-slate-500";
  const panelActionBg = isDark ? "bg-white/10" : "bg-slate-900/5";

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

  const layout = ["classic", "cover", "split", "list"].includes(card.card_layout)
    ? card.card_layout
    : LEGACY_LAYOUT_MAP[card.card_layout] || "classic";

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

  const handleActionClick = (label: string) => {
    if (onActionClick) {
      onActionClick(label.toLowerCase(), actionHrefs[label]);
    } else if (interactive && actionHrefs[label]) {
      window.open(actionHrefs[label], "_blank", "noopener,noreferrer");
    }
  };

  const handleSaveContact = () => {
    if (onActionClick) onActionClick("save_contact");
  };

  const handleConnect = () => {
    if (onConnectClick) onConnectClick();
  };

  const socials = SOCIAL_DEFS
    .map((s) => ({ ...s, value: (card as any)[s.key] as string | undefined }))
    .filter((s) => s.value && s.value.trim().length > 0);

  // ---------- Shared sub-renders, reused across layouts ----------

  const ActionsGrid = ({ tileBg, tileText }: { tileBg: string; tileText: string }) => actions.length > 0 ? (
    <div className={`grid ${actions.length <= 3 ? `grid-cols-${actions.length}` : "grid-cols-3"} gap-2`}>
      {actions.map(({ icon: Icon, label }) => (
        <div key={label} onClick={() => handleActionClick(label)}
          className={`rounded-xl ${tileBg} py-3 flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity`}>
          <Icon size={16} className={tileText} />
          <span className={`text-[10px] ${tileText}`}>{label}</span>
        </div>
      ))}
    </div>
  ) : null;

  const ActionsRows = ({ tileBg, tileText, mainText }: { tileBg: string; tileText: string; mainText: string }) => actions.length > 0 ? (
    <div className="grid grid-cols-2 gap-2">
      {actions.map(({ icon: Icon, label }) => (
        <div key={label} onClick={() => handleActionClick(label)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${tileBg} cursor-pointer hover:opacity-80 transition-opacity`}>
          <Icon size={13} className={tileText} />
          <span className={`text-xs ${mainText}`}>{label}</span>
        </div>
      ))}
    </div>
  ) : null;

  const ActionsList = ({ tileBg, tileText, mainText }: { tileBg: string; tileText: string; mainText: string }) => actions.length > 0 ? (
    <div className="space-y-2">
      {actions.map(({ icon: Icon, label }) => (
        <div key={label} onClick={() => handleActionClick(label)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl ${tileBg} cursor-pointer hover:opacity-80 transition-opacity`}>
          <Icon size={14} className={tileText} />
          <span className={`text-xs font-medium ${mainText}`}>{label}</span>
        </div>
      ))}
    </div>
  ) : null;

  const Socials = ({ tileBg, tileText, mainText, subText }: { tileBg: string; tileText: string; mainText: string; subText: string }) => {
    if (socials.length === 0) return null;
    const mode = card.social_display_style || "icons";

    if (mode === "buttons") {
      return (
        <div className="space-y-2">
          {socials.map(({ key, label, icon: DefaultIcon, href, value }) => {
            const override = card.social_icons?.[key as string];
            const Icon = override ? getIconComponent(override) : DefaultIcon;
            const content = <><Icon size={14} /><span>{label}</span></>;
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
        <div className={`rounded-xl ${tileBg} divide-y ${isLightSurface || tileBg === panelActionBg ? "divide-slate-900/10" : "divide-white/10"} overflow-hidden`}>
          {socials.map(({ key, label, icon: DefaultIcon, href, value }) => {
            const override = card.social_icons?.[key as string];
            const Icon = override ? getIconComponent(override) : DefaultIcon;
            const content = (
              <>
                <Icon size={13} className={tileText} />
                <span className={`text-xs flex-1 ${mainText}`}>{label}</span>
                <span className={`text-[10px] ${subText} truncate max-w-[90px]`}>{value}</span>
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

    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {socials.map(({ key, icon: DefaultIcon, href, value }) => {
          const override = card.social_icons?.[key as string];
          const Icon = override ? getIconComponent(override) : DefaultIcon;
          const className = `h-9 w-9 rounded-full ${tileBg} flex items-center justify-center hover:scale-110 transition-transform`;
          return interactive ? (
            <a key={key as string} href={href(value!)} target="_blank" rel="noopener noreferrer" className={className}><Icon size={14} className={tileText} /></a>
          ) : (
            <div key={key as string} className={className}><Icon size={14} className={tileText} /></div>
          );
        })}
      </div>
    );
  };

  const CustomLinksBlock = ({ tileBg, mainText, tileText }: { tileBg: string; mainText: string; tileText: string }) =>
    card.custom_links && card.custom_links.length > 0 ? (
      <div className="space-y-2">
        {card.custom_links.filter(l => l.url && l.label).map((link, i) => {
          const Icon = getIconComponent(link.icon);
          const className = `flex items-center gap-3 px-4 py-2.5 rounded-xl ${tileBg} ${mainText} text-xs font-medium hover:scale-[1.02] transition-transform`;
          return interactive ? (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={className}><Icon size={14} /><span className="truncate">{link.label}</span></a>
          ) : (
            <div key={i} className={className}><Icon size={14} /><span className="truncate">{link.label}</span></div>
          );
        })}
      </div>
    ) : null;

  const AttachmentsBlock = ({ tileBg, mainText, tileText }: { tileBg: string; mainText: string; tileText: string }) =>
    card.attachments && card.attachments.length > 0 ? (
      <div className="space-y-2">
        {card.attachments.filter(a => a.url).map((file, i) => {
          const className = `flex items-center gap-3 px-4 py-2.5 rounded-xl ${tileBg} ${mainText} text-xs font-medium hover:scale-[1.02] transition-transform`;
          const content = <><Paperclip size={14} className="shrink-0" /><span className="truncate flex-1">{file.label || file.filename}</span><Download size={12} className={tileText} /></>;
          return interactive ? (
            <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" download={file.filename} className={className}>{content}</a>
          ) : (
            <div key={i} className={className}>{content}</div>
          );
        })}
      </div>
    ) : null;

  const SaveContactButton = () => card.show_save_contact ? (
    <div className={`${btnClass} cursor-pointer`} style={btnBg} onClick={handleSaveContact}>
      <Save size={14} className="inline mr-1.5" />Save Contact
    </div>
  ) : null;

  const ConnectCTA = () => interactive ? (
    <div onClick={handleConnect}
      className="rounded-full py-3.5 text-xs font-bold text-center cursor-pointer text-white transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
      style={{ background: `linear-gradient(135deg, ${card.primary_color}, ${card.primary_color}dd)` }}>
      <UserPlus size={14} className="inline mr-1.5" />Let's Connect
    </div>
  ) : null;

  const LogoTop = () => card.logo_url && card.logo_position === "top" ? (
    <div className="flex justify-center"><img src={card.logo_url} alt="Logo" className="h-8 object-contain" /></div>
  ) : null;

  const LogoCenter = () => card.logo_url && card.logo_position === "center" ? (
    <div className="flex justify-center"><img src={card.logo_url} alt="Logo" className="h-8 object-contain" /></div>
  ) : null;

  const LogoFooter = () => card.logo_url && card.logo_position === "footer" ? (
    <div className="flex justify-center pt-2"><img src={card.logo_url} alt="Logo" className="h-6 object-contain opacity-60" /></div>
  ) : null;

  const Avatar = ({ size }: { size: number }) => (
    <div className={`overflow-hidden flex items-center justify-center shrink-0 ${imgRadius} ${card.profile_image_border ? `ring-2 ${ringColor}` : ""}`}
      style={{ width: size, height: size, backgroundColor: card.primary_color + "40" }}>
      {card.avatar_url ? (
        <img src={card.avatar_url} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className={`font-bold ${textColor}`} style={{ fontSize: size * 0.32 }}>{initials}</span>
      )}
    </div>
  );

  // ================= CLASSIC — centered, vertical stack =================
  if (layout === "classic") {
    return (
      <div className={`w-[300px] rounded-[32px] border border-border ${isDark ? "bg-slate-900" : "bg-card"} p-3 shadow-2xl`}>
        <div className="rounded-[24px] overflow-hidden relative p-6 space-y-5" style={bgStyle}>
          <LogoTop />
          <div className="text-center space-y-3">
            <div className="mx-auto" style={{ width: "fit-content" }}><Avatar size={72} /></div>
            <div>
              <h3 className={`text-lg ${textColor} ${fontClass}`}>{card.full_name || "Your Name"}</h3>
              <p className={`text-sm ${subtextColor}`}>{card.job_title}{card.company_name ? ` • ${card.company_name}` : ""}</p>
            </div>
          </div>
          <LogoCenter />
          {card.bio && <p className={`text-xs text-center leading-relaxed ${subtextColor}`}>{card.bio}</p>}
          <ActionsGrid tileBg={actionBg} tileText={btnTextColor} />
          <ConnectCTA />
          {card.address && (
            <div className={`flex items-start gap-2 text-xs ${subtextColor}`}><MapPin size={12} className="mt-0.5 shrink-0" /><span>{card.address}</span></div>
          )}
          <Socials tileBg={actionBg} tileText={btnTextColor} mainText={textColor} subText={subtextColor} />
          <CustomLinksBlock tileBg={actionBg} mainText={textColor} tileText={btnTextColor} />
          <AttachmentsBlock tileBg={actionBg} mainText={textColor} tileText={btnTextColor} />
          <SaveContactButton />
          <LogoFooter />
        </div>
      </div>
    );
  }

  // ================= COVER — full-bleed photo + neutral content panel =================
  if (layout === "cover") {
    const panelBg = isDark ? "bg-slate-900" : "bg-card";
    return (
      <div className={`w-[300px] rounded-[32px] border border-border ${panelBg} p-3 shadow-2xl`}>
        <div className="rounded-[24px] overflow-hidden relative">
          <div className="relative h-36" style={card.avatar_url ? undefined : bgStyle}>
            {card.avatar_url && <img src={card.avatar_url} alt="" className="absolute inset-0 h-full w-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
            {card.logo_url && (
              <div className="absolute top-3 left-3"><img src={card.logo_url} alt="Logo" className="h-6 object-contain brightness-0 invert" /></div>
            )}
          </div>
          <div className={`relative ${panelBg} px-6 pb-6 pt-0 space-y-4`}>
            <div className="flex justify-center -mt-10 mb-1">
              <div className={`rounded-full ring-4 ${isDark ? "ring-slate-900" : "ring-card"}`}>
                <Avatar size={80} />
              </div>
            </div>
            <div className="text-center space-y-0.5">
              <h3 className={`text-lg ${panelTextColor} ${fontClass}`}>{card.full_name || "Your Name"}</h3>
              <p className={`text-sm ${panelSubtextColor}`}>{card.job_title}{card.company_name ? ` • ${card.company_name}` : ""}</p>
            </div>
            {card.bio && <p className={`text-xs text-center leading-relaxed ${panelSubtextColor}`}>{card.bio}</p>}
            <ActionsGrid tileBg={panelActionBg} tileText={panelSubtextColor} />
            <ConnectCTA />
            {card.address && (
              <div className={`flex items-start gap-2 text-xs ${panelSubtextColor}`}><MapPin size={12} className="mt-0.5 shrink-0" /><span>{card.address}</span></div>
            )}
            <Socials tileBg={panelActionBg} tileText={panelSubtextColor} mainText={panelTextColor} subText={panelSubtextColor} />
            <CustomLinksBlock tileBg={panelActionBg} mainText={panelTextColor} tileText={panelSubtextColor} />
            <AttachmentsBlock tileBg={panelActionBg} mainText={panelTextColor} tileText={panelSubtextColor} />
            <SaveContactButton />
          </div>
        </div>
      </div>
    );
  }

  // ================= SPLIT — horizontal header, executive feel =================
  if (layout === "split") {
    return (
      <div className={`w-[300px] rounded-[32px] border border-border ${isDark ? "bg-slate-900" : "bg-card"} p-3 shadow-2xl`}>
        <div className="rounded-[24px] overflow-hidden relative p-6 space-y-5" style={bgStyle}>
          {card.logo_url && (
            <div className="absolute top-5 right-5"><img src={card.logo_url} alt="Logo" className="h-6 object-contain" /></div>
          )}
          <div className="flex items-center gap-3.5 pr-10">
            <Avatar size={60} />
            <div className="flex-1 min-w-0">
              <h3 className={`text-base leading-tight ${textColor} ${fontClass} truncate`}>{card.full_name || "Your Name"}</h3>
              <p className={`text-xs ${subtextColor} truncate`}>{card.job_title}</p>
              <p className={`text-xs ${subtextColor} truncate opacity-80`}>{card.company_name}{card.department ? ` · ${card.department}` : ""}</p>
            </div>
          </div>
          <div className={`h-px ${isLightSurface ? "bg-slate-900/10" : "bg-white/10"}`} />
          {(card.phone || card.email || card.website) && (
            <div className="space-y-1.5">
              {card.phone && <div className={`flex items-center gap-2 text-xs ${subtextColor}`}><Phone size={12} />{card.phone}</div>}
              {card.email && <div className={`flex items-center gap-2 text-xs ${subtextColor}`}><Mail size={12} />{card.email}</div>}
              {card.website && <div className={`flex items-center gap-2 text-xs ${subtextColor}`}><Globe size={12} />{card.website}</div>}
            </div>
          )}
          {card.bio && <p className={`text-xs leading-relaxed ${subtextColor}`}>{card.bio}</p>}
          <ActionsRows tileBg={actionBg} tileText={btnTextColor} mainText={textColor} />
          <ConnectCTA />
          <Socials tileBg={actionBg} tileText={btnTextColor} mainText={textColor} subText={subtextColor} />
          <CustomLinksBlock tileBg={actionBg} mainText={textColor} tileText={btnTextColor} />
          <AttachmentsBlock tileBg={actionBg} mainText={textColor} tileText={btnTextColor} />
          <SaveContactButton />
          <LogoFooter />
        </div>
      </div>
    );
  }

  // ================= LIST — compact header, everything as link rows =================
  return (
    <div className={`w-[300px] rounded-[32px] border border-border ${isDark ? "bg-slate-900" : "bg-card"} p-3 shadow-2xl`}>
      <div className="rounded-[24px] overflow-hidden relative p-5 space-y-4" style={bgStyle}>
        <div className="flex items-center gap-3">
          <Avatar size={44} />
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm leading-tight ${textColor} ${fontClass} truncate`}>{card.full_name || "Your Name"}</h3>
            <p className={`text-xs ${subtextColor} truncate`}>{card.job_title}{card.company_name ? ` • ${card.company_name}` : ""}</p>
          </div>
          {card.logo_url && <img src={card.logo_url} alt="Logo" className="h-6 object-contain shrink-0" />}
        </div>
        {card.bio && <p className={`text-xs leading-relaxed ${subtextColor}`}>{card.bio}</p>}
        <SaveContactButton />
        <ConnectCTA />
        <ActionsList tileBg={actionBg} tileText={btnTextColor} mainText={textColor} />
        <Socials tileBg={actionBg} tileText={btnTextColor} mainText={textColor} subText={subtextColor} />
        <CustomLinksBlock tileBg={actionBg} mainText={textColor} tileText={btnTextColor} />
        <AttachmentsBlock tileBg={actionBg} mainText={textColor} tileText={btnTextColor} />
        {card.address && (
          <div className={`flex items-start gap-2 text-xs ${subtextColor}`}><MapPin size={12} className="mt-0.5 shrink-0" /><span>{card.address}</span></div>
        )}
        <LogoFooter />
      </div>
    </div>
  );
};

export default CardPreview;
