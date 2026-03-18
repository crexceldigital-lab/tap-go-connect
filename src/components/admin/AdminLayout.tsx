import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import {
  LayoutDashboard, Users, CreditCard, UserCheck, BarChart3,
  DollarSign, Crown, ScanLine, Settings, LogOut, ChevronRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import tapngoLogo from "@/assets/tapngo-logo.png";

const navItems = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Cards", path: "/admin/cards", icon: CreditCard },
  { label: "Contacts", path: "/admin/contacts", icon: UserCheck },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Payments", path: "/admin/payments", icon: DollarSign },
  { label: "Subscriptions", path: "/admin/subscriptions", icon: Crown },
  { label: "Scanner Logs", path: "/admin/scanner-logs", icon: ScanLine },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { isAdmin, loading } = useAdmin();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/auth");
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-[hsl(var(--brand-navy))] text-white flex flex-col fixed h-full z-30">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src={tapngoLogo} alt="TAP & GO" className="h-8 w-8" />
            <div>
              <h1 className="font-bold text-sm">TAP & GO</h1>
              <p className="text-[10px] text-white/50">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-white border-r-2 border-primary"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
                {active && <ChevronRight className="h-3 w-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
