import { motion } from "framer-motion";

const logos = [
  "Vodacom", "CRDB Bank", "NMB", "Bolt", "Jumia", "Selcom"
];

const TrustSection = () => (
  <section className="border-y border-border py-16 px-4 md:px-8">
    <div className="mx-auto max-w-7xl">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-muted-foreground mb-10"
      >
        Trusted by professionals and businesses across Tanzania
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center gap-x-12 gap-y-6"
      >
        {logos.map((name) => (
          <span
            key={name}
            className="text-lg font-semibold text-muted-foreground/40 tracking-wide"
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TrustSection;
