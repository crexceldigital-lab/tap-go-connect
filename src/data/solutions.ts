import { Briefcase, Building2, CalendarDays, Rocket, Users2, Store, LucideIcon } from "lucide-react";

export interface SolutionData {
  slug: string;
  icon: LucideIcon;
  navLabel: string;
  headline: string;
  subheadline: string;
  description: string;
  benefits: { title: string; description: string }[];
  stat: { value: string; label: string };
}

export const solutions: SolutionData[] = [
  {
    slug: "sales-teams",
    icon: Briefcase,
    navLabel: "For Sales Teams",
    headline: "Capture every lead your sales team meets",
    subheadline: "For Sales Teams",
    description:
      "Equip every rep with a branded digital card. Every meeting, every event, every handshake becomes a tracked contact — automatically.",
    benefits: [
      { title: "Automatic lead capture", description: "Every person who views a rep's card can be captured as a lead, no manual entry needed." },
      { title: "Consistent branding", description: "Roll out the same professional look across your entire sales floor." },
      { title: "Exportable pipeline", description: "Pull every captured contact into a spreadsheet whenever you need it." },
    ],
    stat: { value: "3x", label: "more contacts captured per event" },
  },
  {
    slug: "real-estate",
    icon: Building2,
    navLabel: "For Real Estate",
    headline: "Share listings and capture buyer leads instantly",
    subheadline: "For Real Estate",
    description:
      "Hand a buyer your card at a viewing and they leave with your number, your listings link, and your WhatsApp — and you leave with their contact.",
    benefits: [
      { title: "One tap, full contact", description: "Buyers save your number without typing a single digit." },
      { title: "Always up to date", description: "Change agencies or listings without reprinting a single card." },
      { title: "Works at open houses", description: "Capture every visitor's details automatically as they view your card." },
    ],
    stat: { value: "60s", label: "to set up your first card" },
  },
  {
    slug: "events",
    icon: CalendarDays,
    navLabel: "For Events & Trade Shows",
    headline: "Turn every conference conversation into a contact",
    subheadline: "For Events & Trade Shows",
    description:
      "Trade shows move fast. TAP & GO captures contact details the moment someone views your card, so no connection gets lost in the noise.",
    benefits: [
      { title: "Built for crowds", description: "No app install needed for anyone you meet — works instantly on any phone." },
      { title: "QR code or NFC tap", description: "Use whichever works best for the booth or stand you're working." },
      { title: "Export after the event", description: "Download every contact captured during the show in one CSV file." },
    ],
    stat: { value: "300%", label: "more leads captured on average" },
  },
  {
    slug: "entrepreneurs",
    icon: Rocket,
    navLabel: "For Entrepreneurs",
    headline: "Make a lasting impression without printing a single card",
    subheadline: "For Entrepreneurs",
    description:
      "Building something new means meeting a lot of people fast. Your TAP & GO card keeps up — update it the moment your business evolves.",
    benefits: [
      { title: "Free to start", description: "Create your first card at no cost and upgrade only when you need to." },
      { title: "Update anytime", description: "Pivoted your business? Change your card in seconds, no reprint required." },
      { title: "Look established", description: "A polished digital card signals credibility from day one." },
    ],
    stat: { value: "0", label: "printing costs to get started" },
  },
  {
    slug: "corporate-teams",
    icon: Users2,
    navLabel: "For Corporate Teams",
    headline: "Equip your whole company with branded digital cards",
    subheadline: "For Corporate Teams",
    description:
      "Give every employee a consistent, on-brand digital card and manage the whole rollout from a single dashboard — we set it up with you.",
    benefits: [
      { title: "Centralized control", description: "Manage branding and card details for your whole team in one place." },
      { title: "Consistent identity", description: "Every employee shares the same professional, on-brand experience." },
      { title: "Sales-assisted setup", description: "Our team helps you roll out cards across your organization — just tell us your team size." },
    ],
    stat: { value: "1", label: "business day to hear back from our team" },
  },
  {
    slug: "small-business",
    icon: Store,
    navLabel: "For Small Business",
    headline: "Look as professional as a global brand, for a fraction of the cost",
    subheadline: "For Small Business",
    description:
      "Whether you run a shop, a salon, or a consultancy, your digital card carries your contact, your socials, and your services everywhere you go.",
    benefits: [
      { title: "All your links, one card", description: "WhatsApp, Instagram, your shop location, and more — all from a single tap." },
      { title: "No tech skills needed", description: "Set up your card in minutes, no design or developer help required." },
      { title: "Affordable, local pricing", description: "Priced in TZS, with mobile money support — built for the East African market." },
    ],
    stat: { value: "TZS 25,000", label: "per year for the full Pro plan" },
  },
];

export const getSolutionBySlug = (slug: string) => solutions.find((s) => s.slug === slug);
