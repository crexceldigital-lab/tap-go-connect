import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { getSolutionBySlug, solutions } from "@/data/solutions";
import { useGetStartedModal } from "@/contexts/GetStartedModalContext";

const SolutionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const solution = getSolutionBySlug(slug || "");
  const { open: openGetStarted, openTeam } = useGetStartedModal();

  if (!solution) return <Navigate to="/" replace />;

  const Icon = solution.icon;
  const others = solutions.filter((s) => s.slug !== solution.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 md:px-8 bg-card overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] pointer-events-none" />
        <div className="mx-auto max-w-4xl relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={14} /> Back to home
            </Link>
            <div className="mx-auto h-14 w-14 rounded-2xl brand-gradient flex items-center justify-center gradient-glow">
              <Icon size={26} className="text-primary-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold brand-gradient-text uppercase tracking-wider">{solution.subheadline}</p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{solution.headline}</h1>
            <p className="text-lg text-muted-foreground max-w-[55ch] mx-auto leading-relaxed">{solution.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <motion.button onClick={openGetStarted} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                className="brand-gradient rounded-full px-8 py-4 text-center font-semibold text-primary-foreground gradient-glow transition-all duration-200">
                Get Started Free
              </motion.button>
              <motion.button onClick={openTeam} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                className="rounded-full border-2 border-brand-navy px-8 py-4 text-center font-semibold text-brand-navy hover:bg-brand-navy hover:text-primary-foreground transition-all duration-200">
                Set Up My Team
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-secondary">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {solution.benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-7 space-y-3 card-shadow border border-border">
                <div className="h-10 w-10 rounded-lg brand-gradient flex items-center justify-center">
                  <Check size={18} className="text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl navy-bg grain-overlay p-10 text-center space-y-2 relative">
            <p className="relative z-[1] text-4xl md:text-5xl font-extrabold text-primary-foreground">{solution.stat.value}</p>
            <p className="relative z-[1] text-primary-foreground/60">{solution.stat.label}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-extrabold text-center mb-10">Other solutions</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {others.map((s) => (
              <Link key={s.slug} to={`/solutions/${s.slug}`}
                className="block rounded-2xl border border-border bg-card p-6 space-y-3 card-shadow hover:border-brand-blue/30 transition-colors duration-300">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon size={18} className="text-brand-blue" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-sm">{s.navLabel}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default SolutionPage;
