import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import BudgetScreen from "./pages/BudgetScreen";
import Index from "./pages/Index";
import DashboardScreen from "./pages/DashboardScreen";
import ChatbotScreen from "./pages/ChatbotScreen";
import TransactionScreen from "./pages/TransactionScreen";
import InvestScreen from "./pages/InvestScreen";
import ReportsScreen from "./pages/ReportsScreen";
import TaxScreen from "./pages/TaxScreen";
import RiskScreen from "./pages/RiskScreen";
import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";
import SavingsGoalScreen from "./pages/SavingsGoalScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout wrapper for authenticated pages
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <TopHeader />
    <main className="flex-1">{children}</main>
    <BottomNavigation />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          
          {/* Protected routes with layout */}
          <Route path="/dashboard" element={<AppLayout><DashboardScreen /></AppLayout>} />
          <Route path="/chat" element={<AppLayout><ChatbotScreen /></AppLayout>} />
          <Route path="/transactions" element={<AppLayout><TransactionScreen /></AppLayout>} />
          <Route path="/budget" element={<AppLayout><BudgetScreen /></AppLayout>} />
          <Route path="/invest" element={<AppLayout><InvestScreen /></AppLayout>} />
          <Route path="/reports" element={<AppLayout><ReportsScreen /></AppLayout>} />
          <Route path="/tax" element={<AppLayout><TaxScreen /></AppLayout>} />
          <Route path="/risk" element={<AppLayout><RiskScreen /></AppLayout>} />
          <Route path="/savings" element={<AppLayout><SavingsGoalScreen /></AppLayout>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;