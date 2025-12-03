import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
}

export default function TransactionScreen() {
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "expense",
      category: "Groceries",
      amount: 124.50,
      description: "Weekly shopping at Whole Foods",
      date: "2024-01-15",
    },
    {
      id: "2",
      type: "income",
      category: "Salary",
      amount: 5000.00,
      description: "Monthly salary",
      date: "2024-01-14",
    },
    {
      id: "3",
      type: "expense",
      category: "Subscription",
      amount: 14.99,
      description: "Netflix subscription",
      date: "2024-01-13",
    },
    {
      id: "4",
      type: "expense",
      category: "Transportation",
      amount: 45.00,
      description: "Uber rides",
      date: "2024-01-12",
    },
  ]);

  return (
    <div className="container px-4 py-6 space-y-4 pb-24 md:pb-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground">Track your income and expenses</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-finance">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Record a new income or expense transaction
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="groceries">Groceries</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Add a note..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="gradient-finance">Save Transaction</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="card-shadow hover:card-shadow-hover transition-shadow animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === "income" 
                      ? "bg-secondary/10 text-secondary" 
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {transaction.type === "income" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-bold ${
                  transaction.type === "income" ? "text-secondary" : "text-foreground"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
