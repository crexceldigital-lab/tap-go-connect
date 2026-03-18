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

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
