export interface CardTheme {
  id: string;
  name: string;
  description: string;
  settings: {
    card_theme: "light" | "dark";
    background_style: "gradient" | "solid";
    primary_color: string;
    secondary_color: string;
    card_layout: "minimal" | "bold" | "corporate" | "modern" | "cover";
    profile_image_style: "circle" | "rounded" | "square";
    button_style: "pill" | "rounded" | "square";
    button_fill: "fill" | "outline";
    font_style: "modern" | "bold";
  };
}

export const cardThemes: CardTheme[] = [
  {
    id: "ocean",
    name: "Ocean",
    description: "The TAP & GO classic — clean and professional",
    settings: {
      card_theme: "light", background_style: "gradient",
      primary_color: "#3BB0D4", secondary_color: "#1a2332",
      card_layout: "modern", profile_image_style: "circle",
      button_style: "pill", button_fill: "fill", font_style: "modern",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Sleek and dark, for a premium feel",
    settings: {
      card_theme: "dark", background_style: "solid",
      primary_color: "#6366f1", secondary_color: "#0f172a",
      card_layout: "modern", profile_image_style: "circle",
      button_style: "pill", button_fill: "fill", font_style: "modern",
    },
  },
  {
    id: "minimal-white",
    name: "Minimal White",
    description: "Light, airy, and understated",
    settings: {
      card_theme: "light", background_style: "solid",
      primary_color: "#1a2332", secondary_color: "#ffffff",
      card_layout: "minimal", profile_image_style: "circle",
      button_style: "rounded", button_fill: "outline", font_style: "modern",
    },
  },
  {
    id: "sunset-bold",
    name: "Sunset Bold",
    description: "Warm, vivid, impossible to miss",
    settings: {
      card_theme: "light", background_style: "gradient",
      primary_color: "#f59e0b", secondary_color: "#ef4444",
      card_layout: "bold", profile_image_style: "circle",
      button_style: "pill", button_fill: "fill", font_style: "bold",
    },
  },
  {
    id: "forest-corporate",
    name: "Forest Corporate",
    description: "Grounded and trustworthy, built for business",
    settings: {
      card_theme: "light", background_style: "gradient",
      primary_color: "#10b981", secondary_color: "#064e3b",
      card_layout: "corporate", profile_image_style: "rounded",
      button_style: "rounded", button_fill: "fill", font_style: "modern",
    },
  },
  {
    id: "pure-black",
    name: "Pure Black",
    description: "High contrast and confident",
    settings: {
      card_theme: "dark", background_style: "solid",
      primary_color: "#f97316", secondary_color: "#000000",
      card_layout: "bold", profile_image_style: "square",
      button_style: "square", button_fill: "fill", font_style: "bold",
    },
  },
  {
    id: "rose-cover",
    name: "Rose Cover",
    description: "Full-bleed photo background — best with a photo",
    settings: {
      card_theme: "light", background_style: "gradient",
      primary_color: "#ec4899", secondary_color: "#4c1d95",
      card_layout: "cover", profile_image_style: "circle",
      button_style: "pill", button_fill: "fill", font_style: "modern",
    },
  },
  {
    id: "soft-cream",
    name: "Soft Cream",
    description: "Warm and approachable, easy on the eyes",
    settings: {
      card_theme: "light", background_style: "solid",
      primary_color: "#92400e", secondary_color: "#f5f1e8",
      card_layout: "minimal", profile_image_style: "rounded",
      button_style: "rounded", button_fill: "fill", font_style: "modern",
    },
  },
];
