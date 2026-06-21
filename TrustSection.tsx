import { motion } from "framer-motion";

const logos = ["Vodacom", "CRDB Bank", "NMB", "Bolt", "Jumia", "Selcom"];
const loopedLogos = [...logos, ...logos];

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
        className="marquee-row relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div className="marquee-track gap-16 pr-16">
          {loopedLogos.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-lg font-bold text-muted-foreground/40 tracking-wide uppercase whitespace-nowrap hover:text-brand-blue transition-colors duration-300"
            >
              {name}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default TrustSection;
