import { motion } from "framer-motion";

const logos = ["Vodacom", "CRDB Bank", "NMB", "Bolt", "Jumia", "Selcom"];

const TrustSection = () => (
  <section className="py-16 px-4 md:px-8 bg-secondary border-y border-border">
    <div className="mx-auto max-w-7xl">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm font-medium text-muted-foreground mb-10"
      >
        Trusted by professionals and businesses across Tanzania
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-x-14 gap-y-6"
      >
        {logos.map((name) => (
          <span key={name} className="text-lg font-bold text-muted-foreground/30 tracking-wide uppercase">
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TrustSection;
