import { motion } from "framer-motion";
import { UserPlus, Share2, TrendingUp } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create Your Profile", description: "Add your name, title, company, and social links in under 60 seconds." },
  { icon: Share2, title: "Share Instantly", description: "Tap your NFC card, show your QR code, or send a link — works on any smartphone." },
  { icon: TrendingUp, title: "Capture & Grow", description: "Collect leads automatically, track interactions, and grow your network." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="section-padding bg-card">
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold brand-gradient-text mb-3 uppercase tracking-wider">How It Works</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
          Three steps to smarter networking
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, ease: [0.2, 0, 0, 1] }}
            className="bg-card rounded-2xl p-8 space-y-5 card-shadow border border-border group hover:border-brand-blue/30 transition-colors duration-300"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-muted-foreground/40">0{i + 1}</span>
              <div className="h-12 w-12 rounded-xl brand-gradient flex items-center justify-center group-hover:gradient-glow transition-all duration-300">
                <step.icon size={22} className="text-primary-foreground" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-xl font-bold">{step.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
