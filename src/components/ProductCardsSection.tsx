import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import cardMetal from "@/assets/card-metal.png";
import cardWood from "@/assets/card-wood.png";
import cardPvc from "@/assets/card-pvc.png";

const cards = [
  {
    type: "Metal",
    description: "Premium, luxury finish",
    label: "Premium",
    labelColor: "bg-amber-500/90 text-white",
    image: cardMetal,
  },
  {
    type: "Wood",
    description: "Natural, unique texture",
    label: "Eco",
    labelColor: "bg-emerald-600/90 text-white",
    image: cardWood,
  },
  {
    type: "PVC",
    description: "Clean, professional standard",
    label: "Classic",
    labelColor: "bg-primary/90 text-primary-foreground",
    image: cardPvc,
  },
];

const ProductCardsSection = () => {
  const [selectedCard, setSelectedCard] = useState<(typeof cards)[0] | null>(null);

  return (
    <>
      <section className="section-padding bg-secondary">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold brand-gradient-text mb-3 uppercase tracking-wider">
              NFC Cards
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
              Cards that make an impression
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[50ch] mx-auto">
              Choose from premium materials. Each card is customizable with your brand.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {cards.map((card, i) => (
              <motion.div
                key={card.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -6 }}
                onClick={() => setSelectedCard(card)}
                className="bg-card rounded-2xl overflow-hidden cursor-pointer border border-border group
                  shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_-8px_hsl(197_80%_55%/0.2)]
                  transition-shadow duration-300"
              >
                <div className="relative p-6 pb-4">
                  <span
                    className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${card.labelColor}`}
                  >
                    {card.label}
                  </span>
                  <img
                    src={card.image}
                    alt={`${card.type} NFC business card by Tap & Go`}
                    className="w-full h-auto rounded-xl"
                    loading="lazy"
                  />
                </div>
                <div className="px-6 pb-6 pt-2">
                  <h3 className="text-xl font-bold">{card.type}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expanded modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-background/80 p-2 text-foreground hover:bg-background transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="p-8">
                <img
                  src={selectedCard.image}
                  alt={`${selectedCard.type} NFC card — enlarged view`}
                  className="w-full h-auto rounded-xl"
                />
              </div>
              <div className="px-8 pb-8 text-center">
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${selectedCard.labelColor}`}
                >
                  {selectedCard.label}
                </span>
                <h3 className="text-2xl font-bold">{selectedCard.type} Card</h3>
                <p className="text-muted-foreground mt-2">{selectedCard.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCardsSection;
