import { motion } from "framer-motion";
import { Smartphone, Wifi } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center section-padding pt-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl w-full">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left content - 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
            className="lg:col-span-3 space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-gold" />
              The #1 Smart Networking Platform in Africa
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight">
              Turn Every Meeting Into a{" "}
              <span className="gold-text">Customer</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-[55ch]">
              Instantly share your contact, capture leads, and grow your network
              with TAP & GO — no app needed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#pricing"
                whileHover={{ y: -2, boxShadow: "0 10px 30px -5px hsl(45 60% 52% / 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full bg-primary px-8 py-4 text-center font-semibold text-primary-foreground transition-all duration-200"
              >
                Create Your Card Free
              </motion.a>
              <motion.a
                href="#how-it-works"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border border-border px-8 py-4 text-center font-semibold text-foreground hover:bg-secondary transition-all duration-200"
              >
                See How It Works
              </motion.a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                No app required
              </span>
              <span>•</span>
              <span>Free forever plan</span>
              <span>•</span>
              <span>Setup in 60s</span>
            </div>
          </motion.div>

          {/* Right visual - 2 cols */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0, 0, 1] }}
            className="lg:col-span-2 flex justify-center"
          >
            <div className="relative">
              {/* Phone mockup */}
              <div className="relative w-[280px] sm:w-[300px]">
                <div className="glass-card p-3 rounded-[32px]">
                  <div className="bg-secondary rounded-[24px] p-6 space-y-6">
                    {/* Status bar */}
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <Wifi size={12} />
                      </div>
                    </div>

                    {/* Profile */}
                    <div className="text-center space-y-3">
                      <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-gold-light flex items-center justify-center text-2xl font-bold text-primary-foreground">
                        JH
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Juma Hamis</h3>
                        <p className="text-sm text-muted-foreground">Founder, TechTanzania</p>
                      </div>
                    </div>

                    {/* Contact buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      {["Call", "Email", "WhatsApp"].map((label) => (
                        <div
                          key={label}
                          className="rounded-xl bg-background/50 py-3 text-center text-xs font-medium text-foreground"
                        >
                          {label}
                        </div>
                      ))}
                    </div>

                    {/* Save contact */}
                    <div className="rounded-xl bg-primary py-3.5 text-center text-sm font-semibold text-primary-foreground">
                      Save Contact
                    </div>

                    {/* Links */}
                    <div className="space-y-2">
                      {["LinkedIn", "Website", "Portfolio"].map((link) => (
                        <div
                          key={link}
                          className="flex items-center justify-between rounded-xl bg-background/50 px-4 py-3 text-sm text-foreground"
                        >
                          <span>{link}</span>
                          <span className="text-muted-foreground">→</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NFC pulse */}
                <div className="absolute -top-4 -right-4">
                  <div className="relative flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 animate-pulse-gold flex items-center justify-center">
                      <Smartphone size={20} className="text-primary" />
                    </div>
                  </div>
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
