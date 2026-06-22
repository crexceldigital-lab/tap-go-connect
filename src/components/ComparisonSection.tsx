import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, X, RefreshCw, Leaf, TrendingUp } from "lucide-react";

const rows = [
  { label: "Never runs out", paper: false, digital: true },
  { label: "Updates instantly, anytime", paper: false, digital: true },
  { label: "Captures leads automatically", paper: false, digital: true },
  { label: "Works after you change roles", paper: false, digital: true },
  { label: "Eco-friendly, zero reprints", paper: false, digital: true },
  { label: "Makes a strong first impression", paper: true, digital: true },
];

const COST_PER_BOX_TZS = 35000; // typical cost per 100 printed cards in Dar es Salaam
const CARDS_PER_BOX = 100;

const ComparisonSection = () => {
  const [cardsPerYear, setCardsPerYear] = useState(300);

  const paperCost = useMemo(() => {
    const boxes = Math.ceil(cardsPerYear / CARDS_PER_BOX);
    return boxes * COST_PER_BOX_TZS;
  }, [cardsPerYear]);

  const tapGoCost = 25000; // flat annual Pro price
  const savings = Math.max(0, paperCost - tapGoCost);

  return (
    <section className="section-padding bg-card">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold brand-gradient-text mb-3 uppercase tracking-wider">Paper vs Digital</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
            Why businesses are switching
          </h2>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border overflow-hidden card-shadow-lg mb-14"
        >
          <div className="grid grid-cols-3 bg-secondary text-sm font-semibold">
            <div className="p-4">Feature</div>
            <div className="p-4 text-center border-l border-border">Paper Cards</div>
            <div className="p-4 text-center border-l border-border navy-bg text-primary-foreground">TAP & GO</div>
          </div>
          {rows.map((row, i) => (
            <div key={row.label} className={`grid grid-cols-3 text-sm ${i % 2 ? "bg-secondary/40" : "bg-card"}`}>
              <div className="p-4 font-medium">{row.label}</div>
              <div className="p-4 flex items-center justify-center border-l border-border">
                {row.paper ? <Check size={18} className="text-muted-foreground" /> : <X size={18} className="text-destructive/60" />}
              </div>
              <div className="p-4 flex items-center justify-center border-l border-border bg-brand-sky/30">
                {row.digital ? <Check size={18} className="text-brand-blue" /> : <X size={18} className="text-destructive/60" />}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Savings calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl navy-bg grain-overlay p-8 md:p-10 grid md:grid-cols-2 gap-10 items-center relative"
        >
          <div className="relative z-[1] space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground/70">
              <RefreshCw size={12} /> Savings Calculator
            </div>
            <h3 className="text-2xl font-bold text-primary-foreground">
              How many business cards do you reprint a year?
            </h3>
            <div className="space-y-3">
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={cardsPerYear}
                onChange={(e) => setCardsPerYear(Number(e.target.value))}
                className="w-full accent-brand-blue cursor-pointer"
              />
              <div className="flex justify-between text-xs text-primary-foreground/50">
                <span>50</span>
                <span className="font-bold text-primary-foreground text-base">{cardsPerYear.toLocaleString()} cards/year</span>
                <span>2,000</span>
              </div>
            </div>
            <p className="text-xs text-primary-foreground/40 flex items-center gap-1.5">
              <Leaf size={12} /> That's also {(cardsPerYear * 0.5).toFixed(0)}g of paper saved annually.
            </p>
          </div>

          <div className="relative z-[1] grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 p-5 space-y-1">
              <p className="text-xs text-primary-foreground/50">Paper cards / year</p>
              <p className="text-2xl font-extrabold text-primary-foreground">TZS {paperCost.toLocaleString()}</p>
            </div>
            <div className="rounded-xl brand-gradient p-5 space-y-1 gradient-glow">
              <p className="text-xs text-primary-foreground/70">TAP & GO Pro / year</p>
              <p className="text-2xl font-extrabold text-primary-foreground">TZS {tapGoCost.toLocaleString()}</p>
            </div>
            <div className="col-span-2 rounded-xl border border-brand-blue/30 bg-brand-blue/10 p-5 flex items-center gap-3">
              <TrendingUp size={20} className="text-brand-blue shrink-0" />
              <p className="text-sm text-primary-foreground">
                Estimated savings: <span className="font-bold text-brand-blue">TZS {savings.toLocaleString()}/year</span>
              </p>
            </div>
          </div>
        </motion.div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Estimate based on typical Dar es Salaam printing costs. Your actual savings may vary.
        </p>
      </div>
    </section>
  );
};

export default ComparisonSection;
