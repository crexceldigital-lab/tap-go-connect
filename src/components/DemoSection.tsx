import { useState } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, Globe, ChevronRight } from "lucide-react";

const DemoSection = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Amina Salim");
  const [title, setTitle] = useState("CEO");
  const [company, setCompany] = useState("AfriTech Solutions");

  return (
    <section className="section-padding border-y border-border">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary mb-3">Live Demo</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
            See it in action
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Onboarding form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 space-y-6"
          >
            {/* Steps indicator */}
            <div className="flex gap-2">
              {[0, 1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                    s <= step ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
                    <User size={16} className="text-muted-foreground" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent text-sm text-foreground outline-none w-full"
                      placeholder="Full name"
                    />
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
                    <Briefcase size={16} className="text-muted-foreground" />
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-transparent text-sm text-foreground outline-none w-full"
                      placeholder="Title"
                    />
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
                    <Globe size={16} className="text-muted-foreground" />
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="bg-transparent text-sm text-foreground outline-none w-full"
                      placeholder="Company"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Links</h3>
                <div className="space-y-3">
                  {["WhatsApp", "LinkedIn", "Website"].map((link) => (
                    <div key={link} className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
                      <span className="text-sm text-foreground">{link}</span>
                      <div className="h-5 w-9 rounded-full bg-primary/80 relative">
                        <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 text-center py-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="text-primary" size={28} />
                </div>
                <h3 className="text-lg font-semibold">Card Generated!</h3>
                <p className="text-sm text-muted-foreground">Your TAP & GO profile is ready to share.</p>
              </div>
            )}

            <button
              onClick={() => setStep(Math.min(step + 1, 2))}
              disabled={step === 2}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 transition-opacity"
            >
              {step === 2 ? "Done" : "Continue"}
              {step < 2 && <ChevronRight size={16} />}
            </button>

            {step > 0 && step < 2 && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back
              </button>
            )}
          </motion.div>

          {/* Live preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="glass-card p-3 rounded-[32px] w-[280px]">
              <div className="bg-secondary rounded-[24px] p-6 space-y-5">
                <div className="text-center space-y-3">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-gold-light flex items-center justify-center text-xl font-bold text-primary-foreground">
                    {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{name || "Your Name"}</h3>
                    <p className="text-sm text-muted-foreground">{title}{company ? `, ${company}` : ""}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Call", "Email", "WhatsApp"].map((l) => (
                    <div key={l} className="rounded-xl bg-background/50 py-2.5 text-center text-xs font-medium text-foreground">{l}</div>
                  ))}
                </div>
                <div className="rounded-xl bg-primary py-3 text-center text-sm font-semibold text-primary-foreground">
                  Save Contact
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Check = ({ className, size }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default DemoSection;
