import { motion } from "framer-motion";
import { Wifi, QrCode, Link2, MessageCircle, UserCheck, Download, BarChart3, Users, Shield, Smartphone } from "lucide-react";

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
  <section id="features" className="section-padding">
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm font-medium text-primary mb-3">Features</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
          Everything you need to network smarter
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.tag}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, ease: [0.2, 0, 0, 1] }}
            className={`glass-card p-8 space-y-5 ${
              feature.highlight ? "lg:col-span-2 border-primary/30" : ""
            }`}
          >
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {feature.tag}
            </span>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed max-w-[55ch]">
              {feature.description}
            </p>
            <div className="flex gap-3 pt-2">
              {feature.icons.map((Icon, j) => (
                <div key={j} className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon size={18} className="text-muted-foreground" strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
