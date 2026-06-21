import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, ScanLine, Users, BarChart3, Settings } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { id: "cards", path: "/app", icon: CreditCard, label: "Cards" },
  { id: "scanner", path: "/app/scanner", icon: ScanLine, label: "Scanner" },
  { id: "contacts", path: "/app/contacts", icon: Users, label: "Contacts" },
  { id: "analytics", path: "/app/analytics", icon: BarChart3, label: "Analytics" },
  { id: "settings", path: "/app/settings", icon: Settings, label: "Settings" },
];

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = tabs.find(t => location.pathname === t.path)?.id || "cards";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-px left-3 right-3 h-0.5 brand-gradient rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon
                  size={20}
                  className={isActive ? "text-primary" : "text-muted-foreground"}
                />
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;
