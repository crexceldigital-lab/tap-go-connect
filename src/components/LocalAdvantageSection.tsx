import { motion } from "framer-motion";

const tags = [
  "Swahili + English",
  "M-Pesa Ready",
  "Offline QR",
  "Local Support",
];

const LocalAdvantageSection = () => (
  <section className="section-padding relative overflow-hidden">
    {/* Subtle map bg */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
      <svg width="600" height="600" viewBox="0 0 100 100" className="text-foreground">
        <text x="50" y="55" textAnchor="middle" fontSize="60" fill="currentColor">🌍</text>
      </svg>
    </div>

    <div className="relative mx-auto max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <p className="text-sm font-medium text-primary">Local Advantage</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
          Built for Africa.{" "}
          <span className="gold-text">Designed for Growth.</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-[50ch] mx-auto">
          TAP & GO is built from the ground up for African professionals and businesses, 
          with local language support and payment integrations.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {tags.map((tag) => (
            <motion.span
              key={tag}
              whileHover={{ y: -2 }}
              className="rounded-full border border-primary/30 bg-primary/5 px-5 py-2.5 text-sm font-medium text-primary"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default LocalAdvantageSection;
