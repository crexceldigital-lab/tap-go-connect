import { motion } from "framer-motion";

const cards = [
  { type: "Metal", color: "from-primary to-gold-light", description: "Premium brushed metal finish" },
  { type: "Wood", color: "from-amber-800 to-amber-600", description: "Eco-friendly bamboo design" },
  { type: "PVC", color: "from-muted to-secondary", description: "Classic matte card" },
];

const ProductCardsSection = () => (
  <section className="section-padding border-y border-border">
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm font-medium text-primary mb-3">NFC Cards</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
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
            className="glass-card p-6 space-y-4 group"
          >
            <div className={`aspect-[1.6/1] rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
              <span className="text-sm font-bold tracking-wider uppercase text-primary-foreground/80">
                TAP & GO
              </span>
            </div>
            <h3 className="text-lg font-semibold">{card.type}</h3>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductCardsSection;
