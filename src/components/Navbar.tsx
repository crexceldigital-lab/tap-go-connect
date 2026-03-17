import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/tapngo-logo.png";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "For Business", href: "#business" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <img src={logo} alt="TAP & GO" className="h-8" />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Log In
            </a>
            <motion.a
              href="#pricing"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors"
            >
              Get Started
            </motion.a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border overflow-hidden bg-background"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-muted-foreground hover:text-foreground py-2"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#pricing"
                className="block w-full rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground mt-2"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
