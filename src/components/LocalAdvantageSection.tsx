import { motion } from "framer-motion";

const tags = ["Swahili + English", "M-Pesa Ready", "Offline QR", "Local Support"];

const LocalAdvantageSection = () => (
  <section className="section-padding bg-card">
    <div className="relative mx-auto max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <p className="text-sm font-semibold brand-gradient-text uppercase tracking-wider">Local Advantage</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
          Built for Africa.{" "}
          <span className="brand-gradient-text">Designed for Growth.</span>
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
              className="rounded-full border border-brand-blue/30 bg-brand-sky px-5 py-2.5 text-sm font-semibold text-brand-navy"
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
