import { FileText, Calculator, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function TaxScreen() {
  const { toast } = useToast();
  return (
    <div className="container px-4 py-6 space-y-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Tax Optimization</h1>
        <p className="text-sm text-muted-foreground">Maximize deductions and minimize liability</p>
      </div>

      {/* Estimated Tax Savings */}
      <Card className="gradient-finance text-white border-0 card-shadow">
        <CardHeader>
          <CardDescription className="text-white/80">Potential Tax Savings</CardDescription>
          <CardTitle className="text-3xl font-bold">$3,456</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/90">Based on AI-identified deductions</p>
        </CardContent>
      </Card>

      {/* Filing Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Filing Progress</CardTitle>
          <CardDescription>2024 Tax Year</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Documents Collected</span>
              <span className="text-sm text-muted-foreground">8/10</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Review Completed</span>
              <span className="text-sm text-muted-foreground">60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Deductions Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Identified Deductions</CardTitle>
          <CardDescription>AI-discovered tax savings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Home Office", amount: 1200, status: "verified" },
            { name: "Charitable Donations", amount: 856, status: "verified" },
            { name: "Business Expenses", amount: 1400, status: "review" },
          ].map((deduction) => (
            <div key={deduction.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{deduction.name}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {deduction.status}
                </Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold text-secondary">
                  ${deduction.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Premium Tax Filing Feature */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Tax Filing Assistant</CardTitle>
              <CardDescription>Let AI handle your entire tax filing</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" />
              Premium
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 opacity-60">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Auto-fill tax forms</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Real-time optimization</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">E-file directly to IRS</span>
            </div>
          </div>
          <Button 
            className="w-full gradient-finance"
            onClick={() => toast({
              title: "Premium Required",
              description: "Upgrade to access AI Tax Filing Assistant with auto-fill forms and real-time optimization.",
            })}
          >
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
