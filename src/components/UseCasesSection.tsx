import { motion } from "framer-motion";
import { Briefcase, Rocket, CalendarDays, Building2 } from "lucide-react";

const cases = [
  { icon: Briefcase, title: "Sales Professionals", description: "Close deals faster with instant contact sharing and lead capture at every meeting." },
  { icon: Rocket, title: "Entrepreneurs", description: "Make a lasting impression and build your network without carrying stacks of paper cards." },
  { icon: CalendarDays, title: "Event Networking", description: "Capture every connection at conferences, expos, and meetups automatically." },
  { icon: Building2, title: "Corporate Teams", description: "Equip your entire team with branded digital cards managed from one dashboard." },
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
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-7 space-y-4 card-shadow border border-border group hover:border-brand-blue/30 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-xl brand-gradient flex items-center justify-center">
              <item.icon size={22} className="text-primary-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default UseCasesSection;
