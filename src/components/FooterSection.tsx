import { motion } from "framer-motion";
import { Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react";
import logo from "@/assets/tapngo-logo.png";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
  ],
  Solutions: [
    { label: "Sales Teams", href: "/solutions/sales-teams" },
    { label: "Real Estate", href: "/solutions/real-estate" },
    { label: "Events & Trade Shows", href: "/solutions/events" },
    { label: "Corporate Teams", href: "/solutions/corporate-teams" },
  ],
  Support: [
    { label: "Help Center", href: "/#faq" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

const socials = [
  { icon: Twitter, label: "Twitter" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Instagram, label: "Instagram" },
];

const FooterSection = () => (
  <footer id="contact" className="navy-bg border-t border-primary-foreground/10 py-16 px-4 md:px-8">
    <div className="mx-auto max-w-7xl">
      {/* Newsletter row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-12 mb-12 border-b border-primary-foreground/10">
        <div>
          <h3 className="text-xl font-bold text-primary-foreground">Stay in the loop</h3>
          <p className="text-sm text-primary-foreground/50 mt-1">Product updates and networking tips, once a month.</p>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full max-w-sm items-center gap-2 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 p-1.5"
        >
          <input
            type="email"
            required
            placeholder="you@email.com"
            className="w-full bg-transparent px-4 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Subscribe"
            className="brand-gradient shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-primary-foreground"
          >
            <ArrowRight size={16} />
          </motion.button>
        </form>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <img alt="TAP & GO" className="h-8 brightness-0 invert" src={logo} />
          <p className="text-sm text-primary-foreground/50 max-w-[30ch]">
            The smart networking platform for African professionals and businesses.
          </p>
        </div>
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="space-y-4">
            <h4 className="text-sm font-semibold text-primary-foreground">{title}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} TAP & GO. All rights reserved.
        </p>
        <div className="flex gap-3">
          {socials.map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="h-9 w-9 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 hover:text-primary-foreground hover:border-brand-blue/40 transition-all duration-200"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default FooterSection;