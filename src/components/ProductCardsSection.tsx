import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import cardMetalGold from "@/assets/card-metal.png";
import cardMetalBlack from "@/assets/card-metal-black.png";
import cardMetalSilver from "@/assets/card-metal-silver.png";
import cardWood from "@/assets/card-wood.png";
import cardPvc from "@/assets/card-pvc.png";

const metalVariants = [
  {
    id: "gold",
    title: "Gold",
    label: "Luxury",
    popular: true,
    labelColor: "bg-amber-500/90 text-white",
    ringColor: "ring-amber-400",
    description: "Elegant, high-end finish for a premium look",
    image: cardMetalGold,
  },
  {
    id: "black",
    title: "Black",
    label: "Executive",
    popular: false,
    labelColor: "bg-foreground/90 text-background",
    ringColor: "ring-foreground",
    description: "Bold and modern, perfect for professionals",
    image: cardMetalBlack,
  },
  {
    id: "silver",
    title: "Silver",
    label: "Classic",
    popular: false,
    labelColor: "bg-muted-foreground/80 text-white",
    ringColor: "ring-muted-foreground",
    description: "Clean and timeless design for everyday use",
    image: cardMetalSilver,
  },
];

const otherCards = [
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
  const [selectedMetal, setSelectedMetal] = useState("gold");
  const [expandedCard, setExpandedCard] = useState<{ image: string; title: string; description: string; label: string; labelColor: string } | null>(null);

  const activeMetal = metalVariants.find((v) => v.id === selectedMetal)!;

  return (
    <>
      <section className="section-padding bg-secondary">
        <div className="mx-auto max-w-7xl">
          {/* Metal Premium Collection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold brand-gradient-text mb-3 uppercase tracking-wider">
              Premium Collection
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
              Metal Cards
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[44ch] mx-auto">
              Choose your style. Make a lasting impression.
            </p>
          </motion.div>

          {/* Metal variant selector */}
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {metalVariants.map((variant, i) => {
              const isActive = selectedMetal === variant.id;
              return (
                <motion.div
                  key={variant.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03, y: -6 }}
                  onClick={() => setSelectedMetal(variant.id)}
                  className={`relative bg-card rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300
                    shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]
                    ${isActive
                      ? `${variant.ringColor} border-current shadow-[0_12px_36px_-6px_hsl(197_80%_55%/0.25)]`
                      : "border-border hover:shadow-[0_12px_36px_-6px_hsl(197_80%_55%/0.15)]"
                    }`}
                >
                  {/* Popular badge */}
                  {variant.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0 z-10">
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-b-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Selection indicator */}
                  {isActive && (
                    <div className="absolute top-4 left-4 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}

                  <div className="relative p-6 pb-4">
                    <span
                      className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${variant.labelColor}`}
                    >
                      {variant.label}
                    </span>
                    <img
                      src={variant.image}
                      alt={`${variant.title} metal NFC card`}
                      className="w-full h-auto rounded-xl mt-2"
                      loading="lazy"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCard({
                          image: variant.image,
                          title: `${variant.title} Metal`,
                          description: variant.description,
                          label: variant.label,
                          labelColor: variant.labelColor,
                        });
                      }}
                    />
                  </div>
                  <div className="px-6 pb-6 pt-2">
                    <h3 className="text-xl font-bold">{variant.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{variant.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-28"
          >
            <Button size="lg" className="brand-gradient text-primary-foreground px-10 py-6 text-base font-semibold rounded-xl gradient-glow">
              Choose {activeMetal.title} Card
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Selected: <span className="font-semibold text-foreground">{activeMetal.title} Metal</span> — {activeMetal.label}
            </p>
          </motion.div>

          {/* Wood & PVC */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold brand-gradient-text mb-3 uppercase tracking-wider">
              More Options
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Wood & PVC Cards
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[44ch] mx-auto">
              Premium alternatives for every style and budget.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {otherCards.map((card, i) => (
              <motion.div
                key={card.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -6 }}
                onClick={() =>
                  setExpandedCard({
                    image: card.image,
                    title: card.type,
                    description: card.description,
                    label: card.label,
                    labelColor: card.labelColor,
                  })
                }
                className="bg-card rounded-2xl overflow-hidden cursor-pointer border border-border
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
                    alt={`${card.type} NFC business card`}
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
        {expandedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setExpandedCard(null)}
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
                onClick={() => setExpandedCard(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-background/80 p-2 text-foreground hover:bg-background transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="p-8">
                <img
                  src={expandedCard.image}
                  alt={`${expandedCard.title} card — enlarged view`}
                  className="w-full h-auto rounded-xl"
                />
              </div>
              <div className="px-8 pb-8 text-center">
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${expandedCard.labelColor}`}
                >
                  {expandedCard.label}
                </span>
                <h3 className="text-2xl font-bold">{expandedCard.title} Card</h3>
                <p className="text-muted-foreground mt-2">{expandedCard.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCardsSection;
