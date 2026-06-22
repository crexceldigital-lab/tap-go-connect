import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { solutions } from "@/data/solutions";

const cases = [
  { ...solutions[0], title: "Sales Professionals", description: "Close deals faster with instant contact sharing and lead capture at every meeting." },
  { ...solutions[3], title: "Entrepreneurs", description: "Make a lasting impression and build your network without carrying stacks of paper cards." },
  { ...solutions[2], title: "Event Networking", description: "Capture every connection at conferences, expos, and meetups automatically." },
  { ...solutions[4], title: "Corporate Teams", description: "Equip your entire team with branded digital cards managed from one dashboard." },
];

const UseCasesSection = () => (
  <section id="business" className="section-padding bg-card">
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold brand-gradient-text mb-3 uppercase tracking-wider">Use Cases</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
          Built for every professional
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cases.map((item, i) => (
          <Link key={item.slug} to={`/solutions/${item.slug}`} className="block group">
            <SpotlightCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="h-full bg-card rounded-2xl p-7 space-y-4 card-shadow border border-border group-hover:border-brand-blue/30 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl brand-gradient flex items-center justify-center">
                <item.icon size={22} className="text-primary-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more <ArrowRight size={12} />
              </span>
            </SpotlightCard>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default UseCasesSection;
