import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center">
            <img src={logo} alt="TAP & GO" className="h-9" />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => navigate("/auth")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log In
            </button>
            <motion.button
              onClick={() => navigate("/auth")}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="brand-gradient rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground gradient-glow transition-all duration-200"
            >
              Get Started
            </motion.button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2" aria-label="Toggle menu">
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
            className="md:hidden border-t border-border overflow-hidden bg-card"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-muted-foreground py-2">{link.label}</a>
              ))}
              <button onClick={() => { setIsOpen(false); navigate("/auth"); }} className="block w-full brand-gradient rounded-full px-5 py-3 text-center text-sm font-semibold text-primary-foreground mt-2">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
