import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useGetStartedModal } from "@/contexts/GetStartedModalContext";

const faqs = [
  {
    q: "Do the people I share my card with need an app?",
    a: "No. They open your card in their phone's browser — works on any iPhone or Android with no download required. They can save your contact with one tap.",
  },
  {
    q: "What's the real benefit over a paper business card?",
    a: "Paper cards run out, get lost, and can't be updated once printed. Your TAP & GO card is always current, never runs out, and automatically captures the contact details of everyone who views it — something paper simply can't do.",
  },
  {
    q: "How do I share my card?",
    a: "Tap your NFC card on any modern smartphone, show your QR code, or send your card link directly via WhatsApp, SMS, or email. All three work side by side — use whichever fits the moment.",
  },
  {
    q: "Does TAP & GO work for teams and companies?",
    a: "Yes — we set up branded cards for your whole team and manage rollout with you directly. Tap \"For My Team\" on the Get Started button and we'll reach out within one business day.",
  },
  {
    q: "Can I export the leads my card captures?",
    a: "Yes. Every contact captured through your card is available in your dashboard and can be exported to CSV at any time. Your data is yours.",
  },
  {
    q: "Is my data secure?",
    a: "Your data is encrypted in transit and at rest, and only you (and your team admins, if applicable) can access the contacts your card captures.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { openTeam } = useGetStartedModal();

  return (
    <section id="faq" className="section-padding bg-secondary">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold brand-gradient-text mb-3 uppercase tracking-wider">FAQ</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-sm md:text-base">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-muted-foreground"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          Still have questions?{" "}
          <button onClick={openTeam} className="font-semibold text-brand-blue hover:underline">
            Talk to us directly
          </button>
        </motion.p>
      </div>
    </section>
  );
};

export default FAQSection;
