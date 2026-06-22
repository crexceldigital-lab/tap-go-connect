import { motion } from "framer-motion";
import { useGetStartedModal } from "@/contexts/GetStartedModalContext";

const FinalCTASection = () => {
  const { open: openGetStarted } = useGetStartedModal();

  return (
    <section className="section-padding navy-bg grain-overlay relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid-light opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />
      <div className="relative mx-auto max-w-4xl text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground">
            Start Networking Smarter{" "}
            <span className="brand-gradient-text">Today</span>
          </h2>
          <p className="text-lg text-primary-foreground/60 max-w-[45ch] mx-auto">
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
          <motion.button
            onClick={openGetStarted}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="brand-gradient rounded-full px-8 py-4 text-center font-semibold text-primary-foreground gradient-glow transition-all duration-200"
          >
            Create Your Card Free
          </motion.button>
          <motion.a
            href="#faq"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border-2 border-primary-foreground/30 px-8 py-4 text-center font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-200"
          >
            Have Questions?
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
