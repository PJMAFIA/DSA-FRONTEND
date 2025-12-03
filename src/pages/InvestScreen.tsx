import { TrendingUp, Lock, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function InvestScreen() {
  return (
    <div className="container px-4 py-6 space-y-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Investment Portfolio</h1>
        <p className="text-sm text-muted-foreground">Track and optimize your investments</p>
      </div>

      {/* Portfolio Overview */}
      <Card className="gradient-finance text-white border-0 card-shadow">
        <CardHeader>
          <CardDescription className="text-white/80">Total Portfolio Value</CardDescription>
          <CardTitle className="text-3xl font-bold">$87,543.21</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>+18.2% YTD</span>
          </div>
        </CardContent>
      </Card>

      {/* Asset Allocation */}
      
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Your portfolio distribution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Stocks</span>
              <span className="text-sm text-muted-foreground">60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Bonds</span>
              <span className="text-sm text-muted-foreground">25%</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Cash</span>
              <span className="text-sm text-muted-foreground">15%</span>
            </div>
            <Progress value={15} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* RL Trading Simulations - Premium Feature */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Trading Simulations</CardTitle>
              <CardDescription>Run what-if scenarios with RL models</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" />
              Premium
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 opacity-60">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Job Loss Scenario</span>
              <Button size="sm" variant="outline" disabled>
                <Play className="h-3 w-3 mr-1" />
                Simulate
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Market Crash Scenario</span>
              <Button size="sm" variant="outline" disabled>
                <Play className="h-3 w-3 mr-1" />
                Simulate
              </Button>
            </div>
          </div>
          <Button className="w-full gradient-finance">
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>

      {/* Top Holdings */}
      <Card>
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "AAPL", value: "$12,345", change: "+2.5%" },
            { name: "GOOGL", value: "$10,234", change: "+1.8%" },
            { name: "MSFT", value: "$9,876", change: "-0.5%" },
          ].map((holding) => (
            <div key={holding.name} className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">{holding.name}</span>
              <div className="text-right">
                <div className="font-semibold">{holding.value}</div>
                <div className={`text-xs ${
                  holding.change.startsWith("+") ? "text-secondary" : "text-destructive"
                }`}>
                  {holding.change}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
