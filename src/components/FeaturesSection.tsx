import { motion } from "framer-motion";
import { Wifi, QrCode, Link2, MessageCircle, UserCheck, Download, BarChart3, Users, Shield, Smartphone } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";

const features = [
  {
    tag: "Smart Sharing",
    title: "Share your way",
    description: "NFC tap, QR code, direct link, WhatsApp, or email — your contact goes where you go.",
    icons: [Wifi, QrCode, Link2, MessageCircle],
    highlight: false,
  },
  {
    tag: "Lead Capture",
    title: "Turn taps into leads",
    description: "Automatically collect name and phone from everyone who views your profile. Export anytime.",
    icons: [UserCheck, Download],
    highlight: true,
  },
  {
    tag: "Analytics",
    title: "Know your impact",
    description: "Track profile views, monitor taps, and measure engagement with real-time analytics.",
    icons: [BarChart3],
    highlight: false,
  },
  {
    tag: "Team Tools",
    title: "Scale your team",
    description: "Manage employee cards, control branding, and oversee your team from one admin dashboard.",
    icons: [Users, Shield],
    highlight: false,
  },
  {
    tag: "No App Needed",
    title: "Works instantly",
    description: "No downloads. No setup. TAP & GO works on every smartphone with a browser.",
    icons: [Smartphone],
    highlight: false,
  },
];

const FeaturesSection = () => (
  <section id="features" className="section-padding navy-bg grain-overlay relative">
    <div className="absolute inset-0 bg-dot-grid-light opacity-30 pointer-events-none" />
    <div className="mx-auto max-w-7xl relative z-[1]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold text-brand-blue mb-3 uppercase tracking-wider">Features</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground">
          Everything you need to network smarter
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <SpotlightCard
            key={feature.tag}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, ease: [0.2, 0, 0, 1] }}
            className={`rounded-2xl border p-8 space-y-5 transition-colors duration-300 ${
              feature.highlight
                ? "lg:col-span-2 border-brand-blue/40 bg-brand-navy-light"
                : "border-primary-foreground/10 bg-primary-foreground/5 hover:border-brand-blue/30"
            }`}
          >
            <span className="inline-block rounded-full brand-gradient px-3 py-1 text-xs font-semibold text-primary-foreground">
              {feature.tag}
            </span>
            <h3 className="text-xl font-bold text-primary-foreground">{feature.title}</h3>
            <p className="text-primary-foreground/60 leading-relaxed max-w-[55ch]">{feature.description}</p>
            <div className="flex gap-3 pt-2">
              {feature.icons.map((Icon, j) => (
                <div key={j} className="h-10 w-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                  <Icon size={18} className="text-brand-blue" strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
