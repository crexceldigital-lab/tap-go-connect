import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import UpgradeModal from "@/components/UpgradeModal";
import { User, Crown, LogOut, ChevronRight, Shield, Bell, HelpCircle, Mail } from "lucide-react";

const SettingsTab = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string | null; email: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, email").eq("user_id", user.id).single().then(({ data }) => {
      setProfile(data);
    });
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const sections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Edit Profile", action: () => navigate("/onboarding") },
        { icon: Mail, label: user?.email || "Email", action: () => {} },
      ],
    },
    {
      title: "Subscription",
      items: [
        { icon: Crown, label: "Upgrade to Pro", action: () => setUpgradeOpen(true), accent: true },
        { icon: Shield, label: "Manage Plan", action: () => setUpgradeOpen(true) },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & FAQ", action: () => {} },
        { icon: Bell, label: "Notifications", action: () => {} },
      ],
    },
  ];

  return (
    <div className="px-4 pt-4">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold">Settings</h1>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-5 mb-6 card-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full brand-gradient flex items-center justify-center text-sm font-bold text-primary-foreground">
            {(profile?.full_name || user?.email || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate">{profile?.full_name || "Your Name"}</h3>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-secondary text-[10px] font-semibold text-muted-foreground">Free</span>
        </div>
      </motion.div>

      {/* Settings Sections */}
      {sections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.05 }}
          className="mb-4"
        >
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">{section.title}</h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden card-shadow">
            {section.items.map((item, i) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary/50 transition-colors ${
                  i < section.items.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <item.icon size={16} className={(item as any).accent ? "text-primary" : "text-muted-foreground"} />
                <span className={`flex-1 text-sm font-medium ${(item as any).accent ? "text-primary" : ""}`}>{item.label}</span>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-destructive/10 text-destructive text-sm font-semibold mt-4 mb-8"
      >
        <LogOut size={16} />Sign Out
      </button>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
};

export default SettingsTab;
