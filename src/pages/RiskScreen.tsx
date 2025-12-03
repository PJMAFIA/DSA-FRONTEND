import { Shield, AlertTriangle, TrendingDown, Play } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function RiskScreen() {
  const [openScenarios, setOpenScenarios] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleScenario = (scenario: string) => {
    setOpenScenarios(prev => 
      prev.includes(scenario) 
        ? prev.filter(s => s !== scenario)
        : [...prev, scenario]
    );
  };
  return (
    <div className="container px-4 py-6 space-y-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Risk Assessment</h1>
        <p className="text-sm text-muted-foreground">Protect your financial future</p>
      </div>

      {/* Risk Score */}
      <Card className="border-accent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Overall Risk Score</CardTitle>
              <CardDescription>Based on AI analysis</CardDescription>
            </div>
            <Shield className="h-8 w-8 text-accent" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">5.2</span>
            <span className="text-muted-foreground">/10</span>
          </div>
          <Badge variant="outline" className="mt-2">Medium Risk</Badge>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Factors</CardTitle>
          <CardDescription>Areas requiring attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { factor: "Market Volatility Exposure", level: "Medium", color: "warning" },
            { factor: "Emergency Fund Coverage", level: "Low", color: "destructive" },
            { factor: "Insurance Protection", level: "High", color: "secondary" },
          ].map((risk) => (
            <div key={risk.factor} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{risk.factor}</span>
              </div>
              <Badge
                variant="outline"
                className={
                  risk.color === "destructive"
                    ? "bg-destructive/10 text-destructive"
                    : risk.color === "warning"
                    ? "bg-warning/10 text-warning"
                    : "bg-secondary/10 text-secondary"
                }
              >
                {risk.level}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Scenario Simulations */}
      <Card>
        <CardHeader>
          <CardTitle>What-If Scenarios</CardTitle>
          <CardDescription>AI-powered risk forecasting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Collapsible open={openScenarios.includes('job-loss')} onOpenChange={() => toggleScenario('job-loss')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Job Loss Scenario</span>
                </div>
                <Button size="sm" variant="ghost" onClick={(e) => {
                  e.stopPropagation();
                  if (!openScenarios.includes('job-loss')) {
                    toast({ title: "Running scenario...", description: "Analyzing job loss impact on your finances." });
                  }
                }}>
                  <Play className="h-3 w-3" />
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pt-3">
              <p className="text-sm text-muted-foreground mb-3">
                If you lose your primary income source, your emergency fund can sustain you for approximately 4 months. 
                Consider building reserves to 6-8 months for optimal protection.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Current runway:</span>
                  <span className="font-medium">4 months</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Recommended:</span>
                  <span className="font-medium text-secondary">6-8 months</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openScenarios.includes('market-crash')} onOpenChange={() => toggleScenario('market-crash')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Market Crash (20%)</span>
                </div>
                <Button size="sm" variant="ghost" onClick={(e) => {
                  e.stopPropagation();
                  if (!openScenarios.includes('market-crash')) {
                    toast({ title: "Running scenario...", description: "Simulating market crash impact." });
                  }
                }}>
                  <Play className="h-3 w-3" />
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pt-3">
              <p className="text-sm text-muted-foreground mb-3">
                In a 20% market correction, your portfolio would drop to approximately $70,000. 
                With your current allocation, recovery time is estimated at 18 months.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Projected loss:</span>
                  <span className="font-medium text-destructive">-$17,500</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Recovery time:</span>
                  <span className="font-medium">18 months</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openScenarios.includes('medical')} onOpenChange={() => toggleScenario('medical')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Medical Emergency</span>
                </div>
                <Button size="sm" variant="ghost" onClick={(e) => {
                  e.stopPropagation();
                  if (!openScenarios.includes('medical')) {
                    toast({ title: "Running scenario...", description: "Analyzing medical emergency financial impact." });
                  }
                }}>
                  <Play className="h-3 w-3" />
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pt-3">
              <p className="text-sm text-muted-foreground mb-3">
                With current insurance coverage, out-of-pocket costs for major medical event could reach $8,000. 
                Your HSA balance covers 75% of this exposure.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Max exposure:</span>
                  <span className="font-medium">$8,000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>HSA coverage:</span>
                  <span className="font-medium text-secondary">$6,000 (75%)</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border-l-4 border-accent bg-accent/5 rounded">
            <p className="text-sm font-medium mb-1">Build Emergency Fund</p>
            <p className="text-xs text-muted-foreground">
              Increase savings by $500/month to reach 6-month target
            </p>
          </div>
          <div className="p-3 border-l-4 border-primary bg-primary/5 rounded">
            <p className="text-sm font-medium mb-1">Rebalance Portfolio</p>
            <p className="text-xs text-muted-foreground">
              Consider shifting 10% from stocks to bonds for better risk balance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
