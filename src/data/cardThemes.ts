export interface CardTheme {
  id: string;
  name: string;
  description: string;
  settings: {
    card_theme: "light" | "dark";
    background_style: "gradient" | "solid";
    primary_color: string;
    secondary_color: string;
    card_layout: "classic" | "cover" | "split" | "list";
    profile_image_style: "circle" | "rounded" | "square";
    button_style: "pill" | "rounded" | "square";
    button_fill: "fill" | "outline";
    font_style: "modern" | "bold";
    social_display_style?: "icons" | "buttons" | "compact";
  };
}

// Four genuinely different card structures — not just four colors on the
// same layout. Each is a real starting point; every setting here stays
// fully editable afterward in the Colors / Layout / Buttons tabs.
export const cardThemes: CardTheme[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Centered and clean — the TAP & GO original",
    settings: {
      card_theme: "light", background_style: "gradient",
      primary_color: "#3BB0D4", secondary_color: "#1a2332",
      card_layout: "classic", profile_image_style: "circle",
      button_style: "pill", button_fill: "fill", font_style: "modern",
      social_display_style: "icons",
    },
  },
  {
    id: "cover",
    name: "Cover",
    description: "Photo-first profile with a clean panel below — best with a photo",
    settings: {
      card_theme: "light", background_style: "gradient",
      primary_color: "#fb923c", secondary_color: "#db2777",
      card_layout: "cover", profile_image_style: "circle",
      button_style: "pill", button_fill: "fill", font_style: "modern",
      social_display_style: "icons",
    },
  },
  {
    id: "split",
    name: "Split",
    description: "Horizontal header with contact details — an executive feel",
    settings: {
      card_theme: "dark", background_style: "gradient",
      primary_color: "#818cf8", secondary_color: "#1e1b4b",
      card_layout: "split", profile_image_style: "rounded",
      button_style: "rounded", button_fill: "outline", font_style: "bold",
      social_display_style: "compact",
    },
  },
  {
    id: "list",
    name: "List",
    description: "Compact header, everything else as a clean link list",
    settings: {
      card_theme: "light", background_style: "solid",
      primary_color: "#0f172a", secondary_color: "#ffffff",
      card_layout: "list", profile_image_style: "circle",
      button_style: "rounded", button_fill: "fill", font_style: "modern",
      social_display_style: "buttons",
    },
  },
];
