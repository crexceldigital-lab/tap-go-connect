import { motion } from "framer-motion";
import { Smartphone, Wifi, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center section-padding pt-32 overflow-hidden bg-card">
      <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-brand-sky/60 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-sky/40 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl w-full relative">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
            className="lg:col-span-3 space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
              The #1 Smart Networking Platform in Africa
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05]">
              Turn Every Meeting{" "}
              <span className="brand-gradient-text">Into a Customer</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-[52ch] leading-relaxed">
              Instantly share your contact, capture leads, and grow your network with TAP & GO — no app needed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => navigate("/auth")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="brand-gradient rounded-full px-8 py-4 text-center font-semibold text-primary-foreground gradient-glow transition-all duration-200"
              >
                Create Your Card Free
              </motion.button>
              <motion.a
                href="#how-it-works"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border-2 border-brand-navy px-8 py-4 text-center font-semibold text-brand-navy hover:bg-brand-navy hover:text-primary-foreground transition-all duration-200"
              >
                See How It Works
              </motion.a>
            </div>

            <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                No app required
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Free forever plan</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Setup in 60s</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0, 0, 1] }}
            className="lg:col-span-2 flex justify-center"
          >
            <div className="relative animate-float">
              <div className="w-[280px] sm:w-[300px] rounded-[36px] border border-border bg-card p-3 card-shadow-lg">
                <div className="rounded-[28px] bg-brand-navy p-6 space-y-5">
                  <div className="flex justify-between items-center text-xs text-primary-foreground/50">
                    <span>9:41</span>
                    <div className="flex gap-1"><Wifi size={12} /></div>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="mx-auto h-20 w-20 rounded-full brand-gradient flex items-center justify-center text-2xl font-bold text-primary-foreground">
                      JH
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary-foreground">Juma Hamis</h3>
                      <p className="text-sm text-primary-foreground/60">Founder, TechTanzania</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Call", icon: Phone },
                      { label: "Email", icon: Mail },
                      { label: "WhatsApp", icon: Smartphone },
                    ].map(({ label, icon: Icon }) => (
                      <div key={label} className="rounded-xl bg-primary-foreground/10 py-3 flex flex-col items-center gap-1">
                        <Icon size={14} className="text-primary-foreground/70" />
                        <span className="text-xs text-primary-foreground/70">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="brand-gradient rounded-xl py-3.5 text-center text-sm font-semibold text-primary-foreground">
                    Save Contact
                  </div>
                  <div className="space-y-2">
                    {["LinkedIn", "Website", "Portfolio"].map((link) => (
                      <div key={link} className="flex items-center justify-between rounded-xl bg-primary-foreground/5 px-4 py-3 text-sm text-primary-foreground/80">
                        <span>{link}</span>
                        <span className="text-primary-foreground/40">→</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -top-3 -right-3">
                <div className="h-12 w-12 rounded-full brand-gradient animate-pulse flex items-center justify-center gradient-glow">
                  <Smartphone size={18} className="text-primary-foreground" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
