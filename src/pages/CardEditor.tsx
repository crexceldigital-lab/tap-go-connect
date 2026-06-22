import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import CardPreview, { CardData } from "@/components/CardPreview";
import ShareModal from "@/components/ShareModal";
import UpgradeModal from "@/components/UpgradeModal";
import {
  ArrowLeft, Save, Globe, Palette, Layout, Type, Image, ToggleLeft,
  Camera, Upload, Check, QrCode, Link2, Share2, Sun, Moon, Sparkles,
  AtSign, Paperclip, Plus, Trash2, FileText
} from "lucide-react";
import { cardThemes } from "@/data/cardThemes";
import IconPicker from "@/components/IconPicker";
import type { CustomLink, CardAttachment } from "@/components/CardPreview";
import logo from "@/assets/tapngo-logo.png";


const colorPresets = [
  "#3BB0D4", "#1a2332", "#6366f1", "#ec4899", "#f59e0b",
  "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316",
  "#000000", "#374151",
];

const tabs = [
  { id: "themes", label: "Themes", icon: Sparkles },
  { id: "info", label: "Info", icon: Type },
  { id: "social", label: "Social", icon: AtSign },
  { id: "files", label: "Files", icon: Paperclip },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "layout", label: "Layout", icon: Layout },
  { id: "buttons", label: "Buttons", icon: ToggleLeft },
  { id: "logo", label: "Logo", icon: Image },
];

const SOCIAL_FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "@username or URL" },
  { key: "linkedin", label: "LinkedIn", placeholder: "username or URL" },
  { key: "twitter", label: "Twitter / X", placeholder: "@username or URL" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "+255..." },
  { key: "facebook", label: "Facebook", placeholder: "username or URL" },
  { key: "tiktok", label: "TikTok", placeholder: "@username or URL" },
  { key: "youtube", label: "YouTube", placeholder: "@channel or URL" },
  { key: "github", label: "GitHub", placeholder: "username or URL" },
  { key: "behance", label: "Behance", placeholder: "username or URL" },
  { key: "dribbble", label: "Dribbble", placeholder: "username or URL" },
  { key: "telegram", label: "Telegram", placeholder: "@username or URL" },
  { key: "snapchat", label: "Snapchat", placeholder: "@username or URL" },
  { key: "threads", label: "Threads", placeholder: "@username or URL" },
];


const CardEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState("themes");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [slug, setSlug] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [card, setCard] = useState<CardData & { card_name: string }>({
    card_name: "My Card",
    full_name: "", job_title: "", company_name: "", avatar_url: "", logo_url: "", logo_position: "top",
    phone: "", email: "", website: "", instagram: "", linkedin: "", twitter: "", whatsapp: "",
    bio: "", address: "", department: "", pronouns: "",
    secondary_phone: "", secondary_email: "",
    facebook: "", tiktok: "", youtube: "", github: "", behance: "", dribbble: "",
    telegram: "", snapchat: "", threads: "",
    custom_links: [], attachments: [], social_icons: {},
    primary_color: "#3BB0D4", secondary_color: "#1a2332",
    background_style: "gradient", profile_image_style: "circle", profile_image_border: true,
    button_style: "pill", button_fill: "fill", button_shadow: true,
    card_layout: "minimal", font_style: "modern", card_theme: "light",
    show_save_contact: true, show_call: true, show_email: true, show_whatsapp: true,
    show_book_appointment: false, show_navigate: false,
  });


  useEffect(() => {
    if (!id || !user) return;
    supabase.from("cards").select("*").eq("id", id).eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setCard({
          card_name: data.card_name,
          full_name: data.full_name || "", job_title: data.job_title || "", company_name: data.company_name || "",
          avatar_url: data.avatar_url || "", logo_url: data.logo_url || "", logo_position: data.logo_position,
          phone: data.phone || "", email: data.email || "", website: data.website || "",
          instagram: data.instagram || "", linkedin: data.linkedin || "", twitter: data.twitter || "", whatsapp: data.whatsapp || "",
          primary_color: data.primary_color, secondary_color: data.secondary_color,
          background_style: data.background_style, profile_image_style: data.profile_image_style,
          profile_image_border: data.profile_image_border, button_style: data.button_style,
          button_fill: data.button_fill, button_shadow: data.button_shadow,
          card_layout: data.card_layout, font_style: data.font_style,
          card_theme: (data as any).card_theme || "light",
          show_save_contact: data.show_save_contact, show_call: data.show_call,
          show_email: data.show_email, show_whatsapp: data.show_whatsapp,
          show_book_appointment: data.show_book_appointment, show_navigate: data.show_navigate,
        });
        setPublished(data.is_published);
        setSlug(data.slug || "");
        setShareCount((data as any).share_count || 0);
      }
    });
  }, [id, user]);

  const update = (key: string, value: any) => setCard((c) => ({ ...c, [key]: value }));

  const applyTheme = (themeId: string) => {
    const theme = cardThemes.find((t) => t.id === themeId);
    if (!theme) return;
    setCard((c) => ({ ...c, ...theme.settings }));
  };

  const activeThemeId = cardThemes.find((t) =>
    Object.entries(t.settings).every(([key, value]) => (card as any)[key] === value)
  )?.id;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "avatar_url" | "logo_url") => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${field}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    update(field, urlData.publicUrl);
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    const { error } = await supabase.from("cards").update(card as any).eq("id", id);
    setSaving(false);
    if (error) toast({ title: "Error saving", description: error.message, variant: "destructive" });
    else toast({ title: "Card saved!" });
  };

  const handlePublish = async () => {
    if (!id || !user) return;
    setPublishing(true);
    const newSlug = slug || card.full_name.toLowerCase().replace(/\s+/g, "-") + "-" + id.slice(0, 6);
    const { error } = await supabase.from("cards").update({ ...card, is_published: true, slug: newSlug } as any).eq("id", id);
    setPublishing(false);
    if (error) toast({ title: "Error publishing", description: error.message, variant: "destructive" });
    else {
      setPublished(true);
      setSlug(newSlug);
      toast({ title: "Card published! 🎉", description: "Your digital card is now live." });
    }
  };

  const handleShare = () => {
    if (shareCount >= 5) {
      setUpgradeOpen(true);
      return;
    }
    setShareOpen(true);
    // Increment share count
    if (id) {
      const newCount = shareCount + 1;
      setShareCount(newCount);
      supabase.from("cards").update({ share_count: newCount } as any).eq("id", id);
    }
  };

  const Toggle = ({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <button onClick={() => onChange(!value)} className={`w-10 h-6 rounded-full transition-colors relative ${value ? "bg-primary" : "bg-secondary border border-border"}`}>
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </div>
  );

  const ColorPicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {colorPresets.map(c => (
        <button key={c} onClick={() => onChange(c)} className={`h-8 w-8 rounded-full border-2 transition-all ${value === c ? "border-foreground scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
      ))}
      <label className="h-8 w-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="absolute opacity-0 w-0 h-0" />
        <Palette size={14} className="text-muted-foreground" />
      </label>
    </div>
  );

  const OptionGroup = ({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex gap-2 flex-wrap">
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${value === o.value ? "brand-gradient text-primary-foreground" : "bg-secondary border border-border text-foreground hover:border-primary/30"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /><span className="hidden sm:inline">Dashboard</span>
          </button>
          <img src={logo} alt="TAP & GO" className="h-7 absolute left-1/2 -translate-x-1/2" />
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50">
              <Save size={14} /><span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
            </button>
            <button onClick={handlePublish} disabled={publishing} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow disabled:opacity-50">
              <Globe size={14} /><span className="hidden sm:inline">{publishing ? "Publishing..." : published ? "Update" : "Publish"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {published && slug && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <Check size={16} /> Your card is live!
              {shareCount >= 3 && shareCount < 5 && (
                <span className="text-xs text-amber-600 ml-2">({5 - shareCount} shares left)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={async () => { await navigator.clipboard.writeText(`${window.location.origin}/card/${slug}`); toast({ title: "Link copied!" }); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium hover:bg-secondary transition-colors">
                <Link2 size={12} />Copy Link
              </button>
              <button onClick={() => setShareOpen(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium hover:bg-secondary transition-colors">
                <QrCode size={12} />QR Code
              </button>
              <button onClick={handleShare} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium hover:bg-secondary transition-colors">
                <Share2 size={12} />Share
              </button>
            </div>
          </motion.div>
        )}

        <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} cardUrl={`${window.location.origin}/card/${slug}`} cardName={card.card_name} />
        <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} reason="You've reached your free share limit (5 shares). Upgrade to PRO for unlimited sharing." />

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 md:gap-8">
          {/* Controls */}
          <div className="order-2 lg:order-1">
            <div className="flex gap-1 mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? "brand-gradient text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                  <t.icon size={14} />{t.label}
                </button>
              ))}
            </div>

            <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border card-shadow space-y-6">
              {tab === "themes" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Choose a Theme</h3>
                    <p className="text-xs text-muted-foreground mt-1">Pick a starting point — you can fine-tune colors, layout, and buttons afterward.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {cardThemes.map((theme) => {
                      const isActive = activeThemeId === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => applyTheme(theme.id)}
                          className={`text-left rounded-2xl border-2 overflow-hidden transition-all ${
                            isActive ? "border-primary" : "border-border hover:border-primary/40"
                          }`}
                        >
                          <div className="relative h-40 bg-secondary/50 flex items-center justify-center overflow-hidden">
                            <div className="origin-top scale-[0.42] pointer-events-none">
                              <CardPreview card={{ ...card, ...theme.settings }} />
                            </div>
                            {isActive && (
                              <div className="absolute top-2 right-2 h-6 w-6 rounded-full brand-gradient flex items-center justify-center">
                                <Check size={13} className="text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="p-3 bg-card">
                            <p className="text-sm font-bold">{theme.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{theme.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {tab === "info" && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Card Name</h3>
                    <input value={card.card_name} onChange={e => update("card_name", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm outline-none focus:border-primary/50" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Personal Info</h3>
                    <div className="flex justify-center">
                      <label className="relative cursor-pointer group">
                        <div className="h-20 w-20 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-colors">
                          {card.avatar_url ? <img src={card.avatar_url} alt="" className="h-full w-full object-cover" /> : <Camera size={24} className="text-muted-foreground" />}
                        </div>
                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, "avatar_url")} className="hidden" />
                      </label>
                    </div>
                    {[
                      { field: "full_name", placeholder: "Full name" },
                      { field: "job_title", placeholder: "Job title" },
                      { field: "company_name", placeholder: "Company" },
                      { field: "phone", placeholder: "Phone" },
                      { field: "email", placeholder: "Email" },
                      { field: "website", placeholder: "Website" },
                    ].map(({ field, placeholder }) => (
                      <input key={field} value={(card as any)[field]} onChange={e => update(field, e.target.value)} placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm outline-none focus:border-primary/50" />
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Social Links</h3>
                    {[
                      { field: "instagram", placeholder: "Instagram" },
                      { field: "linkedin", placeholder: "LinkedIn" },
                      { field: "twitter", placeholder: "Twitter / X" },
                      { field: "whatsapp", placeholder: "WhatsApp" },
                    ].map(({ field, placeholder }) => (
                      <input key={field} value={(card as any)[field]} onChange={e => update(field, e.target.value)} placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm outline-none focus:border-primary/50" />
                    ))}
                  </div>
                </>
              )}

              {tab === "colors" && (
                <>
                  {/* Theme toggle */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Card Theme</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => update("card_theme", "light")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${card.card_theme === "light" ? "brand-gradient text-primary-foreground" : "bg-secondary border border-border text-foreground hover:border-primary/30"}`}
                      >
                        <Sun size={16} />Light
                      </button>
                      <button
                        onClick={() => update("card_theme", "dark")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${card.card_theme === "dark" ? "bg-slate-800 text-white border border-slate-700" : "bg-secondary border border-border text-foreground hover:border-primary/30"}`}
                      >
                        <Moon size={16} />Dark
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Primary Color</h3>
                    <ColorPicker value={card.primary_color} onChange={v => update("primary_color", v)} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Secondary Color</h3>
                    <ColorPicker value={card.secondary_color} onChange={v => update("secondary_color", v)} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Background Style</h3>
                    <OptionGroup options={[{ value: "gradient", label: "Gradient" }, { value: "solid", label: "Solid" }]} value={card.background_style} onChange={v => update("background_style", v)} />
                  </div>
                </>
              )}

              {tab === "layout" && (
                <>
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Card Layout</h3>
                    <OptionGroup options={[{ value: "minimal", label: "Minimal" }, { value: "bold", label: "Bold" }, { value: "corporate", label: "Corporate" }, { value: "modern", label: "Modern" }, { value: "cover", label: "Cover Image" }]} value={card.card_layout} onChange={v => update("card_layout", v)} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Profile Image</h3>
                    <OptionGroup options={[{ value: "circle", label: "Circle" }, { value: "rounded", label: "Rounded" }, { value: "square", label: "Square" }]} value={card.profile_image_style} onChange={v => update("profile_image_style", v)} />
                    <Toggle value={card.profile_image_border} onChange={v => update("profile_image_border", v)} label="Image border" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Font Style</h3>
                    <OptionGroup options={[{ value: "modern", label: "Clean Modern" }, { value: "bold", label: "Bold Professional" }]} value={card.font_style} onChange={v => update("font_style", v)} />
                  </div>
                </>
              )}

              {tab === "buttons" && (
                <>
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Button Style</h3>
                    <OptionGroup options={[{ value: "pill", label: "Pill" }, { value: "rounded", label: "Rounded" }, { value: "square", label: "Square" }]} value={card.button_style} onChange={v => update("button_style", v)} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Button Fill</h3>
                    <OptionGroup options={[{ value: "fill", label: "Filled" }, { value: "outline", label: "Outline" }]} value={card.button_fill} onChange={v => update("button_fill", v)} />
                  </div>
                  <Toggle value={card.button_shadow} onChange={v => update("button_shadow", v)} label="Button shadow" />
                  <div className="border-t border-border pt-4 space-y-1">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Action Buttons</h3>
                    <Toggle value={card.show_save_contact} onChange={v => update("show_save_contact", v)} label="Save Contact" />
                    <Toggle value={card.show_call} onChange={v => update("show_call", v)} label="Call" />
                    <Toggle value={card.show_email} onChange={v => update("show_email", v)} label="Email" />
                    <Toggle value={card.show_whatsapp} onChange={v => update("show_whatsapp", v)} label="WhatsApp" />
                    <Toggle value={card.show_book_appointment} onChange={v => update("show_book_appointment", v)} label="Book Appointment" />
                    <Toggle value={card.show_navigate} onChange={v => update("show_navigate", v)} label="Navigate to Office" />
                  </div>
                </>
              )}

              {tab === "logo" && (
                <>
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Company Logo</h3>
                    {card.logo_url ? (
                      <div className="flex items-center gap-4">
                        <img src={card.logo_url} alt="Logo" className="h-12 object-contain" />
                        <button onClick={() => update("logo_url", "")} className="text-xs text-destructive hover:underline">Remove</button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 px-4 py-8 rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
                        <Upload size={20} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload logo</span>
                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, "logo_url")} className="hidden" />
                      </label>
                    )}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Logo Position</h3>
                    <OptionGroup options={[{ value: "top", label: "Top" }, { value: "center", label: "Center" }, { value: "footer", label: "Footer" }]} value={card.logo_position} onChange={v => update("logo_position", v)} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="order-1 lg:order-2 flex justify-center lg:sticky lg:top-24 lg:self-start">
            <motion.div key={JSON.stringify(card).slice(0, 50)} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
              <CardPreview card={card} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEditor;
