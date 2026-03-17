import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "For individuals getting started",
    features: ["Digital profile", "Basic sharing (QR + Link)", "Up to 50 contacts", "Standard support"],
    cta: "Get Started Free",
    variant: "default" as const,
  },
  {
    name: "Pro",
    price: "15,000",
    currency: "TZS",
    period: "/mo",
    description: "For professionals who want to grow",
    features: ["Everything in Free", "Lead capture", "Analytics dashboard", "Custom branding", "Export contacts", "Priority support"],
    cta: "Start Pro Trial",
    variant: "primary" as const,
    popular: true,
  },
  {
    name: "Business",
    price: "Custom",
    description: "For teams and enterprises",
    features: ["Everything in Pro", "Team management", "Admin dashboard", "Brand control", "API access", "Dedicated account manager"],
    cta: "Contact Sales",
    variant: "inverted" as const,
  },
];

const PricingSection = () => (
  <section id="pricing" className="section-padding">
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm font-medium text-primary mb-3">Pricing</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
          Simple, transparent pricing
        </h2>
        <p className="text-muted-foreground mt-4 max-w-[50ch] mx-auto">
          Start free. Upgrade when you're ready to capture more leads and grow faster.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-2xl p-8 space-y-6 border transition-colors duration-200 ${
              plan.variant === "primary"
                ? "border-primary/50 bg-card"
                : plan.variant === "inverted"
                ? "border-border bg-foreground text-background"
                : "border-border bg-card"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                Most Popular
              </span>
            )}
            <div>
              <h3 className={`text-lg font-semibold ${plan.variant === "inverted" ? "" : ""}`}>{plan.name}</h3>
              <p className={`text-sm mt-1 ${plan.variant === "inverted" ? "opacity-60" : "text-muted-foreground"}`}>
                {plan.description}
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              {plan.currency && <span className="text-sm font-medium opacity-60">{plan.currency}</span>}
              <span className="text-4xl font-bold font-mono">{plan.price}</span>
              {plan.period && <span className="text-sm opacity-60">{plan.period}</span>}
            </div>
            <ul className="space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check size={16} className={`mt-0.5 shrink-0 ${plan.variant === "primary" ? "text-primary" : plan.variant === "inverted" ? "opacity-60" : "text-muted-foreground"}`} />
                  <span className={plan.variant === "inverted" ? "" : ""}>{f}</span>
                </li>
              ))}
            </ul>
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`block w-full rounded-full py-3.5 text-center text-sm font-semibold transition-all duration-200 ${
                plan.variant === "primary"
                  ? "bg-primary text-primary-foreground gold-glow"
                  : plan.variant === "inverted"
                  ? "bg-background text-foreground"
                  : "border border-border hover:bg-secondary"
              }`}
            >
              {plan.cta}
            </motion.a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
