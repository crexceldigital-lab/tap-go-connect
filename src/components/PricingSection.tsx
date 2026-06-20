import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Pro",
    price: "25,000",
    currency: "TZS",
    period: "/year",
    description: "For professionals and businesses who want full access to Tap & Go.",
    features: [
      "Unlimited Digital Cards",
      "Unlimited Sharing",
      "Advanced Customization",
      "Unlimited AI Scans",
      "Full Analytics",
      "Priority Support",
      "Full Access to the Tap & Go Mobile App",
      "Access to Future Feature Updates",
    ],
    cta: "Subscribe Now",
    variant: "primary" as const,
    popular: true,
  },
  {
    name: "Business",
    price: "Custom",
    description: "For teams and enterprises",
    features: ["Everything in Pro", "Team management", "Admin dashboard", "Brand control", "API access", "Dedicated account manager"],
    cta: "Contact Sales",
    variant: "default" as const,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="section-padding bg-card">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold brand-gradient-text mb-3 uppercase tracking-wider">Pricing</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[50ch] mx-auto">
            Start free. Upgrade when you're ready to capture more leads and grow faster.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto justify-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 space-y-6 border transition-all duration-300 ${
                plan.variant === "primary"
                  ? "border-brand-blue card-shadow-lg bg-card"
                  : "border-border bg-card card-shadow"
              }`}
              style={plan.variant === "primary" ? {
                boxShadow: "0 0 0 1px hsl(197 80% 55% / 0.3), 0 8px 40px -8px hsl(197 80% 55% / 0.2)"
              } : undefined}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full brand-gradient px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-sm mt-1 text-muted-foreground">{plan.description}</p>
              </div>
              <div className="flex items-baseline gap-1">
                {plan.currency && <span className="text-sm font-medium text-muted-foreground">{plan.currency}</span>}
                <span className="text-4xl font-extrabold">{plan.price}</span>
                {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
              </div>
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check size={16} className={`mt-0.5 shrink-0 ${plan.variant === "primary" ? "text-brand-blue" : "text-muted-foreground"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                onClick={() => navigate("/auth")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`block w-full rounded-full py-3.5 text-center text-sm font-semibold transition-all duration-200 ${
                  plan.variant === "primary"
                    ? "brand-gradient text-primary-foreground gradient-glow"
                    : "border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-primary-foreground"
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
