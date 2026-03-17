import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding navy-bg">
      <div className="mx-auto max-w-4xl text-center space-y-8">
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
            onClick={() => navigate("/auth")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="brand-gradient rounded-full px-8 py-4 text-center font-semibold text-primary-foreground gradient-glow transition-all duration-200"
          >
            Create Your Card Free
          </motion.button>
          <motion.a
            href="#contact"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border-2 border-primary-foreground/30 px-8 py-4 text-center font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-200"
          >
            Book a Demo
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
