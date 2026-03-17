import { motion } from "framer-motion";

const FinalCTASection = () => (
  <section className="section-padding">
    <div className="mx-auto max-w-4xl text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
          Start Networking Smarter{" "}
          <span className="gold-text">Today</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-[45ch] mx-auto">
          Join thousands of professionals who are growing their network with TAP & GO.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <motion.a
          href="#pricing"
          whileHover={{ y: -2, boxShadow: "0 10px 30px -5px hsl(45 60% 52% / 0.3)" }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full bg-primary px-8 py-4 text-center font-semibold text-primary-foreground transition-all duration-200"
        >
          Create Your Card Free
        </motion.a>
        <motion.a
          href="#contact"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full border border-border px-8 py-4 text-center font-semibold text-foreground hover:bg-secondary transition-all duration-200"
        >
          Book a Demo
        </motion.a>
      </motion.div>
    </div>
  </section>
);

export default FinalCTASection;
