<<<<<<< HEAD
import { useState, useMemo, useEffect } from "react";
=======
import { useState, useMemo } from "react";
>>>>>>> dd343628e0a3826546811d7be466519d4f5f36e1
import { icons, Link as LinkIcon } from "lucide-react";
import { Search } from "lucide-react";

// Curated subset — full lucide list is ~1000+ icons (too heavy to render).
<<<<<<< HEAD
// Each icon is tagged with a category for filtering.
const ICON_CATALOG = {
  Brand: ["Instagram", "Facebook", "Twitter", "Linkedin", "Youtube", "Github", "Twitch", "Rss"],
  Messaging: ["MessageCircle", "MessageSquare", "Mail", "Send", "Phone", "PhoneCall", "Video", "AtSign"],
  Web: ["Globe", "Link", "Link2", "ExternalLink", "Hash", "Bookmark"],
  Media: ["Music", "Music2", "Headphones", "Mic", "Camera", "Image", "Film", "PlayCircle"],
  Files: ["FileText", "File", "FileImage", "FolderOpen", "Download", "Paperclip", "BookOpen", "ClipboardList"],
  Business: ["Briefcase", "Building", "Building2", "Store", "ShoppingBag", "ShoppingCart", "CreditCard", "DollarSign"],
  Location: ["MapPin", "Map", "Navigation", "Compass", "Home"],
  General: [
    "User", "Users", "UserPlus", "Calendar", "CalendarDays", "Clock",
    "Star", "Heart", "Award", "Sparkles", "Zap", "Coffee", "Smile", "Gift", "Tag", "ThumbsUp",
  ],
} as const;

export const ICON_NAMES = Object.values(ICON_CATALOG).flat();
export type IconName = (typeof ICON_NAMES)[number];

const CATEGORY_NAMES = Object.keys(ICON_CATALOG) as (keyof typeof ICON_CATALOG)[];

const RECENT_KEY = "tapngo_recent_icons";
const RECENT_LIMIT = 12;

const getRecents = (): string[] => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const pushRecent = (name: string) => {
  try {
    const current = getRecents().filter((n) => n !== name);
    const next = [name, ...current].slice(0, RECENT_LIMIT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable — recents just won't persist, not critical
  }
};

=======
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

>>>>>>> dd343628e0a3826546811d7be466519d4f5f36e1
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
<<<<<<< HEAD
  const [category, setCategory] = useState<"All" | "Recent" | keyof typeof ICON_CATALOG>("All");
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    if (open) setRecents(getRecents());
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base: string[];
    if (q) {
      base = ICON_NAMES.filter((n) => n.toLowerCase().includes(q));
    } else if (category === "Recent") {
      base = recents;
    } else if (category === "All") {
      base = ICON_NAMES as unknown as string[];
    } else {
      base = ICON_CATALOG[category] as unknown as string[];
    }
    return base;
  }, [query, category, recents]);

  const handlePick = (name: string) => {
    onChange(name);
    pushRecent(name);
    setOpen(false);
  };
=======

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICON_NAMES;
    return ICON_NAMES.filter((n) => n.toLowerCase().includes(q));
  }, [query]);
>>>>>>> dd343628e0a3826546811d7be466519d4f5f36e1

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
<<<<<<< HEAD
          <div className="absolute z-50 top-12 left-0 w-80 max-h-96 bg-card border border-border rounded-2xl shadow-2xl p-3 flex flex-col">
=======
          <div className="absolute z-50 top-12 left-0 w-72 max-h-80 bg-card border border-border rounded-2xl shadow-2xl p-3 flex flex-col">
>>>>>>> dd343628e0a3826546811d7be466519d4f5f36e1
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
<<<<<<< HEAD

            {!query && (
              <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
                {(["All", ...(recents.length ? ["Recent"] as const : []), ...CATEGORY_NAMES] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                      category === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

=======
>>>>>>> dd343628e0a3826546811d7be466519d4f5f36e1
            <div className="grid grid-cols-7 gap-1 overflow-y-auto">
              {filtered.map((name) => {
                const Icon = getIconComponent(name);
                const isActive = value === name;
                return (
                  <button
                    key={name}
                    type="button"
<<<<<<< HEAD
                    onClick={() => handlePick(name)}
=======
                    onClick={() => {
                      onChange(name);
                      setOpen(false);
                    }}
>>>>>>> dd343628e0a3826546811d7be466519d4f5f36e1
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
<<<<<<< HEAD
                <p className="col-span-7 text-center text-xs text-muted-foreground py-4">
                  {category === "Recent" ? "No recent icons yet" : "No icons"}
                </p>
=======
                <p className="col-span-7 text-center text-xs text-muted-foreground py-4">No icons</p>
>>>>>>> dd343628e0a3826546811d7be466519d4f5f36e1
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IconPicker;
