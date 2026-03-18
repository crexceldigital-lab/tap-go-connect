import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import CardEditor from "./pages/CardEditor";
import Scanner from "./pages/Scanner";
import PublicCard from "./pages/PublicCard";
import MobileLayout from "./components/mobile/MobileLayout";
import CardsTab from "./pages/app/CardsTab";
import ScannerTab from "./pages/app/ScannerTab";
import ContactsTab from "./pages/app/ContactsTab";
import AnalyticsTab from "./pages/app/AnalyticsTab";
import SettingsTab from "./pages/app/SettingsTab";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCards from "./pages/admin/AdminCards";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminScannerLogs from "./pages/admin/AdminScannerLogs";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/editor/:id" element={<ProtectedRoute><CardEditor /></ProtectedRoute>} />
            <Route path="/scanner" element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
            <Route path="/card/:slug" element={<PublicCard />} />

            {/* Mobile App Routes */}
            <Route path="/app" element={<ProtectedRoute><MobileLayout><CardsTab /></MobileLayout></ProtectedRoute>} />
            <Route path="/app/scanner" element={<ProtectedRoute><MobileLayout><ScannerTab /></MobileLayout></ProtectedRoute>} />
            <Route path="/app/contacts" element={<ProtectedRoute><MobileLayout><ContactsTab /></MobileLayout></ProtectedRoute>} />
            <Route path="/app/analytics" element={<ProtectedRoute><MobileLayout><AnalyticsTab /></MobileLayout></ProtectedRoute>} />
            <Route path="/app/settings" element={<ProtectedRoute><MobileLayout><SettingsTab /></MobileLayout></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout><AdminOverview /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
            <Route path="/admin/cards" element={<AdminLayout><AdminCards /></AdminLayout>} />
            <Route path="/admin/contacts" element={<AdminLayout><AdminContacts /></AdminLayout>} />
            <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
            <Route path="/admin/payments" element={<AdminLayout><AdminPayments /></AdminLayout>} />
            <Route path="/admin/subscriptions" element={<AdminLayout><AdminSubscriptions /></AdminLayout>} />
            <Route path="/admin/scanner-logs" element={<AdminLayout><AdminScannerLogs /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
