import { motion } from "framer-motion";

const cards = [
  { type: "Metal", description: "Premium brushed metal finish", gradient: "from-brand-blue to-brand-blue-dark" },
  { type: "Wood", description: "Eco-friendly bamboo design", gradient: "from-amber-700 to-amber-500" },
  { type: "PVC", description: "Classic matte card", gradient: "from-brand-navy to-brand-navy-light" },
];

const ProductCardsSection = () => (
  <section className="section-padding bg-secondary">
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold brand-gradient-text mb-3 uppercase tracking-wider">NFC Cards</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
          Cards that make an impression
        </h2>
        <p className="text-muted-foreground mt-4 max-w-[50ch] mx-auto">
          Choose from premium materials. Each card is customizable with your brand.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={card.type}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 space-y-4 card-shadow border border-border group hover:border-brand-blue/30 transition-colors duration-300"
          >
            <div className={`aspect-[1.6/1] rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
              <span className="text-sm font-bold tracking-wider uppercase text-primary-foreground/80">TAP & GO</span>
            </div>
            <h3 className="text-lg font-bold">{card.type}</h3>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductCardsSection;
