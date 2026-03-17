import { useState } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, Globe, ChevronRight, CheckCircle2, Phone, Mail, Smartphone } from "lucide-react";

const DemoSection = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Doctar Ulimwengu");
  const [title, setTitle] = useState("CEO");
  const [company, setCompany] = useState("Revoltek Limited");

  return (
    <section className="section-padding bg-secondary">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold brand-gradient-text mb-3 uppercase tracking-wider">Live Demo</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">See it in action</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 space-y-6 card-shadow-lg border border-border"
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((s) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "brand-gradient" : "bg-secondary"}`} />
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Your Information</h3>
                <div className="space-y-3">
                  {[
                    { icon: User, value: name, setter: setName, placeholder: "Full name" },
                    { icon: Briefcase, value: title, setter: setTitle, placeholder: "Title" },
                    { icon: Globe, value: company, setter: setCompany, placeholder: "Company" },
                  ].map(({ icon: Icon, value, setter, placeholder }) => (
                    <div key={placeholder} className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3.5 border border-border focus-within:border-brand-blue/50 transition-colors">
                      <Icon size={16} className="text-muted-foreground" />
                      <input
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className="bg-transparent text-sm text-foreground outline-none w-full"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Social Links</h3>
                <div className="space-y-3">
                  {["WhatsApp", "LinkedIn", "Website"].map((link) => (
                    <div key={link} className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3.5 border border-border">
                      <span className="text-sm font-medium">{link}</span>
                      <div className="h-6 w-10 rounded-full brand-gradient relative cursor-pointer">
                        <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-card shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 text-center py-6">
                <div className="mx-auto h-16 w-16 rounded-full brand-gradient flex items-center justify-center gradient-glow">
                  <CheckCircle2 className="text-primary-foreground" size={28} />
                </div>
                <h3 className="text-lg font-bold">Card Generated!</h3>
                <p className="text-sm text-muted-foreground">Your TAP & GO profile is ready to share.</p>
              </div>
            )}

            <button
              onClick={() => setStep(Math.min(step + 1, 2))}
              disabled={step === 2}
              className="w-full flex items-center justify-center gap-2 rounded-full brand-gradient py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 gradient-glow transition-all"
            >
              {step === 2 ? "Done" : "Continue"}
              {step < 2 && <ChevronRight size={16} />}
            </button>

            {step > 0 && step < 2 && (
              <button onClick={() => setStep(step - 1)} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
                Back
              </button>
            )}
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="w-[280px] rounded-[36px] border border-border bg-card p-3 card-shadow-lg">
              <div className="rounded-[28px] bg-brand-navy p-6 space-y-5">
                <div className="text-center space-y-3">
                  <div className="mx-auto h-16 w-16 rounded-full brand-gradient flex items-center justify-center text-xl font-bold text-primary-foreground">
                    {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-foreground">{name || "Your Name"}</h3>
                    <p className="text-sm text-primary-foreground/60">{title}{company ? `, ${company}` : ""}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Call", icon: Phone },
                    { label: "Email", icon: Mail },
                    { label: "WhatsApp", icon: Smartphone },
                  ].map(({ label, icon: Icon }) => (
                    <div key={label} className="rounded-xl bg-primary-foreground/10 py-2.5 flex flex-col items-center gap-1">
                      <Icon size={12} className="text-primary-foreground/70" />
                      <span className="text-xs text-primary-foreground/70">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="brand-gradient rounded-xl py-3 text-center text-sm font-semibold text-primary-foreground">
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

export default DemoSection;
