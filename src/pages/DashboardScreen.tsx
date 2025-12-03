import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Shield, Calculator } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getProtectedData, logout } from "../api/auth";
import axios from "axios";

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [protectedData, setProtectedData] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Budget Live Sync States
  const [budgetSpent, setBudgetSpent] = useState(0);
  const [budgetUsedPercent, setBudgetUsedPercent] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(5000);

  // SAVINGS GOAL LIVE SYNC STATES
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<any>(null);

  // Fetch protected data (existing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProtectedData();
        setProtectedData(result);
        toast({
          title: "Success",
          description: "Dashboard data loaded successfully!",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
        toast({
          title: "Error",
          description: err.message || "Failed to load dashboard data",
          variant: "destructive",
        });
        logout();
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate, toast]);

  // LIVE SYNC: Fetch Budget + Savings Goals Every 3 Seconds
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [monthlyRes, expensesRes, goalsRes] = await Promise.all([
          axios.get("http://localhost:8081/api/budget/monthly-budget", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8081/api/budget", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8081/api/goals", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Budget
        const monthly = monthlyRes.data;
        const expenses = expensesRes.data || [];
        const totalSpent = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
        const usedPercent = monthly > 0 ? (totalSpent / monthly) * 100 : 0;

        setMonthlyBudget(monthly);
        setBudgetSpent(totalSpent);
        setBudgetUsedPercent(usedPercent);

        // Savings Goals
        const goals = goalsRes.data || [];
        setSavingsGoals(goals);
        setPrimaryGoal(goals.length > 0 ? goals[0] : null);

      } catch (err) {
        console.error("Dashboard sync failed:", err);
      }
    };

    // Initial fetch
    fetchAllData();

    // Sync every 3 seconds
    const interval = setInterval(fetchAllData, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container px-4 py-6 space-y-6 pb-24 md:pb-6">
      {/* Hero Card - Net Worth */}
      <Card className="gradient-finance text-white border-0 card-shadow animate-fade-in">
        <CardHeader>
          <CardDescription className="text-white/80">Total Net Worth</CardDescription>
          <CardTitle className="text-4xl font-bold">
            {isLoading ? "Loading..." : error ? "N/A" : "$124,567.89"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>+12.5% this month</span>
          </div>
        </CardContent>
      </Card>

      {/* Premium Upsell Banner */}
      <Card className="border-accent/50 bg-accent/5 animate-slide-up">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Upgrade to Premium</h3>
              <p className="text-sm text-muted-foreground">Unlock AI-powered investment simulations</p>
            </div>
            <Button 
              size="sm" 
              className="gradient-finance border-0"
              onClick={() => toast({
                title: "Premium Features",
                description: "Upgrade to unlock AI-powered investment simulations and advanced analytics.",
              })}
            >
              Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Agent Status Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* BUDGET AGENT */}
        <Card className="card-shadow hover:card-shadow-hover transition-shadow cursor-pointer" onClick={() => navigate("/budget")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Agent</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                ${budgetSpent.toFixed(0)}
              </div>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Monthly cash flow positive</p>
            <Progress value={budgetUsedPercent} className="h-2" />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {budgetUsedPercent.toFixed(0)}% of ${monthlyBudget} budget used
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/budget");
                }}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SAVINGS GOAL AGENT (NEW) */}
        <Card className="card-shadow hover:card-shadow-hover transition-shadow cursor-pointer" onClick={() => navigate("/savings")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
            <PiggyBank className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                ${primaryGoal ? primaryGoal.currentAmount.toFixed(0) : "0"} / ${primaryGoal ? primaryGoal.targetAmount : "0"}
              </div>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                {primaryGoal ? "Active" : "None"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {primaryGoal ? primaryGoal.name : "No goal set"}
            </p>
            <Progress 
              value={primaryGoal ? (primaryGoal.currentAmount / primaryGoal.targetAmount) * 100 : 0} 
              className="h-2" 
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {primaryGoal ? `${((primaryGoal.currentAmount / primaryGoal.targetAmount) * 100).toFixed(0)}% complete` : "Create your first goal"}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/goals");
                }}
              >
                View Goals
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* INVEST AGENT */}
        <Card className="card-shadow hover:card-shadow-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invest Agent</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : error ? "N/A" : "+18.2%"}
              </div>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Portfolio ROI this year</p>
            <div className="flex items-center gap-1 text-xs text-secondary">
              <TrendingUp className="h-3 w-3" />
              <span>Outperforming market by 4.2%</span>
            </div>
          </CardContent>
        </Card>

        {/* TAX AGENT */}
        <Card className="card-shadow hover:card-shadow-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Agent</CardTitle>
            <Calculator className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : error ? "N/A" : "$3,456"}
              </div>
              <Badge variant="secondary" className="bg-accent/10 text-accent">Optimizing</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Potential tax savings identified</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate("/tax")}
            >
              View Deductions
            </Button>
          </CardContent>
        </Card>

        {/* RISK AGENT */}
        <Card className="card-shadow hover:card-shadow-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Agent</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : error ? "N/A" : "Medium"}
              </div>
              <Badge variant="outline">Monitoring</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Risk score: 5.2/10</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate("/risk")}
            >
              Run Scenario
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* News Ticker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Market News</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-secondary mt-0.5" />
            <div>
              <p className="text-sm font-medium">S&P 500 reaches new high</p>
              <p className="text-xs text-muted-foreground">Markets rally on positive economic data</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingDown className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-medium">Fed signals rate hold</p>
              <p className="text-xs text-muted-foreground">Inflation concerns ease in latest report</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button 
        className="w-full max-w-md mx-auto gradient-finance"
        onClick={() => {
          logout();
          navigate("/login");
          toast({
            title: "Logged Out",
            description: "You have been logged out successfully.",
          });
        }}
      >
        Logout
      </Button>

      {/* Debug: Show protected data */}
      {protectedData && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Backend Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{protectedData}</p>
          </CardContent>
        </Card>
      )}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  );
}