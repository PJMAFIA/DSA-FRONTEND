import { BarChart3, TrendingUp, DollarSign, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ReportsScreen() {
  return (
    <div className="container px-4 py-6 space-y-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <p className="text-sm text-muted-foreground">Insights and analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,234</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,111</div>
            <p className="text-xs text-muted-foreground">33% savings rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <BarChart3 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Of monthly budget used</p>
          </CardContent>
        </Card>
      </div>

      {/* Spending by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Top categories this month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { category: "Groceries", amount: 1234, percent: 45 },
            { category: "Transportation", amount: 856, percent: 32 },
            { category: "Entertainment", amount: 543, percent: 20 },
            { category: "Shopping", amount: 321, percent: 12 },
          ].map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{item.category}</span>
                <span className="text-sm text-muted-foreground">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
              <Progress value={item.percent} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Income vs Expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-end justify-around gap-2">
            {[
              { month: "Jan", income: 80, expense: 60 },
              { month: "Feb", income: 85, expense: 65 },
              { month: "Mar", income: 75, expense: 70 },
              { month: "Apr", income: 90, expense: 55 },
              { month: "May", income: 95, expense: 60 },
              { month: "Jun", income: 88, expense: 58 },
            ].map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full space-y-1">
                  <div
                    className="w-full bg-secondary rounded-t"
                    style={{ height: `${data.income}px` }}
                  />
                  <div
                    className="w-full bg-destructive/50 rounded-t"
                    style={{ height: `${data.expense}px` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded" />
              <span className="text-xs">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive/50 rounded" />
              <span className="text-xs">Expenses</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
