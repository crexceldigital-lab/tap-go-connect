import { useState, useMemo } from "react";
import { icons, Link as LinkIcon } from "lucide-react";
import { Search } from "lucide-react";

// Curated subset — full lucide list is ~1000+ icons (too heavy to render).
// Covers brand-style + common contact/social/file/action use cases.
export const ICON_NAMES = [
  // Social / brand
  "Instagram", "Facebook", "Twitter", "Linkedin", "Youtube", "Github", "Twitch", "Rss",
  // Messaging
  "MessageCircle", "MessageSquare", "Mail", "Send", "Phone", "PhoneCall", "Video",
  // Web / link
  "Globe", "Link", "Link2", "ExternalLink", "AtSign", "Hash", "Bookmark",
  // Media / content
  "Music", "Music2", "Headphones", "Mic", "Camera", "Image", "Film", "PlayCircle",
  // Files / docs
  "FileText", "File", "FileImage", "FolderOpen", "Download", "Paperclip", "BookOpen", "ClipboardList",
  // Business / commerce
  "Briefcase", "Building", "Building2", "Store", "ShoppingBag", "ShoppingCart", "CreditCard", "DollarSign",
  // Location / contact
  "MapPin", "Map", "Navigation", "Compass", "Home", "User", "Users", "UserPlus",
  // Calendar / time
  "Calendar", "CalendarDays", "Clock",
  // Misc
  "Star", "Heart", "Award", "Sparkles", "Zap", "Coffee", "Smile", "Gift", "Tag", "ThumbsUp",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export const getIconComponent = (name?: string | null) => {
  if (!name) return LinkIcon;
  return (icons as any)[name] || LinkIcon;
};

interface IconPickerProps {
  value?: string;
  onChange: (name: string) => void;
  label?: string;
}

const IconPicker = ({ value, onChange, label }: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICON_NAMES;
    return ICON_NAMES.filter((n) => n.toLowerCase().includes(q));
  }, [query]);

  const CurrentIcon = getIconComponent(value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={label || "Pick icon"}
        className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center hover:border-primary/50 transition-colors shrink-0"
      >
        <CurrentIcon size={16} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 top-12 left-0 w-72 max-h-80 bg-card border border-border rounded-2xl shadow-2xl p-3 flex flex-col">
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search icons…"
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-secondary border border-border text-xs outline-none focus:border-primary/50"
              />
            </div>
            <div className="grid grid-cols-7 gap-1 overflow-y-auto">
              {filtered.map((name) => {
                const Icon = getIconComponent(name);
                const isActive = value === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onChange(name);
                      setOpen(false);
                    }}
                    title={name}
                    className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="col-span-7 text-center text-xs text-muted-foreground py-4">No icons</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IconPicker;
