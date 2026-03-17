import logo from "@/assets/tapngo-logo.png";

const footerLinks = {
  Product: ["Features", "Pricing", "NFC Cards", "For Teams"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Support: ["Help Center", "API Docs", "Privacy Policy", "Terms"],
};

const FooterSection = () => (
  <footer id="contact" className="border-t border-border py-16 px-4 md:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <img src={logo} alt="TAP & GO" className="h-8" />
          <p className="text-sm text-muted-foreground max-w-[30ch]">
            The smart networking platform for African professionals and businesses.
          </p>
        </div>
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="space-y-4">
            <h4 className="text-sm font-semibold">{title}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TAP & GO. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
        </div>
      </div>
    </div>
  </footer>
);

export default FooterSection;
