import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Plus, 
  Trash2,
  Calendar,
  Receipt,
  Pencil
} from 'lucide-react';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
}

interface CategoryTotal {
  category: string;
  total: number;
  count: number;
}

const CATEGORY_ICONS: Record<string, string> = {
 'Food & Dining': '🍔',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Bills & Utilities': '💡',
  'Healthcare': '⚕️',
  'Education': '📚',
  'Travel': '✈️',
  'Other': '📦'
};

const PRESET_CATEGORIES = Object.keys(CATEGORY_ICONS);

export default function BudgetScreen() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [topCategories, setTopCategories] = useState<CategoryTotal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(5000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState('5000');

  useEffect(() => {
    loadData();
    fetchMonthlyBudget();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchExpenses(), fetchTopCategories()]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load budget data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/budget', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setExpenses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      setExpenses([]);
    }
  };

  const fetchTopCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/budget/top-categories', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setTopCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setTopCategories([]);
    }
  };

  const fetchMonthlyBudget = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/budget/monthly-budget', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMonthlyBudget(response.data);
      setTempBudget(response.data.toString());
    } catch (error) {
      console.error('Failed to fetch monthly budget:', error);
    }
  };

  const addExpense = async () => {
    if (!category || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please select a category and enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8081/api/budget', 
        { category, amount: parseFloat(amount) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCategory('');
      setAmount('');
      await loadData();
      await fetchMonthlyBudget(); // Update budget stats
      
      toast({
        title: "Success",
        description: `Added $${amount} to ${category}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add expense",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/budget/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      await loadData();
      await fetchMonthlyBudget(); // Update budget stats
      
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  const saveMonthlyBudget = async () => {
    const newBudget = parseFloat(tempBudget);
    if (isNaN(newBudget) || newBudget <= 0) {
      toast({
        title: "Invalid Budget",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8081/api/budget/monthly-budget', {
        monthlyBudget: newBudget
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMonthlyBudget(newBudget);
      setIsEditingBudget(false);
      toast({
        title: "Success",
        description: "Monthly budget updated!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update budget",
        variant: "destructive",
      });
    }
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budgetUsedPercentage = totalSpent > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const remainingBudget = monthlyBudget - totalSpent;

  return (
    <div className="container px-4 py-6 space-y-6 pb-24 md:pb-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
        <Card className="gradient-finance text-white border-0 card-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/80">Total Spent</CardDescription>
            <CardTitle className="text-3xl font-bold">
              ${totalSpent.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm">
              {budgetUsedPercentage > 90 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{budgetUsedPercentage.toFixed(1)}% of budget</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Remaining Budget</CardDescription>
            <CardTitle className="text-3xl font-bold text-secondary">
              ${remainingBudget.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100 - budgetUsedPercentage} className="h-2" />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Monthly Budget</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {isEditingBudget ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={tempBudget} 
                    onChange={(e) => setTempBudget(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-32"
                  />
                  <Button size="sm" onClick={saveMonthlyBudget}>Save</Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      setTempBudget(monthlyBudget.toString());
                      setIsEditingBudget(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  ${monthlyBudget.toFixed(2)}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsEditingBudget(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>This month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Form */}
      <Card className="card-shadow animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Expense
          </CardTitle>
          <CardDescription>Track your spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {PRESET_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <span>{CATEGORY_ICONS[cat]}</span>
                      <span>{cat}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input 
              placeholder="Amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              type="number"
              step="0.01"
              min="0"
            />
            
            <Button 
              onClick={addExpense} 
              disabled={isSubmitting}
              className="gradient-finance border-0"
            >
              {isSubmitting ? (
                "Adding..."
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Spending by Category
          </CardTitle>
          <CardDescription>
            Your top spending categories this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading categories...
            </div>
          ) : topCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No expenses yet. Add your first expense above!
            </div>
          ) : (
            <div className="space-y-4">
              {topCategories.map((cat, index) => {
                const percentage = totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{CATEGORY_ICONS[cat.category] || 'Package'}</span>
                        <div>
                          <p className="font-medium">{cat.category}</p>
                          <p className="text-xs text-muted-foreground">
                            {cat.count} transaction{cat.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${cat.total.toFixed(2)}</p>
                        <Badge variant="secondary" className="text-xs">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Expenses
          </CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading expenses...
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No expenses recorded yet
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 10).map((expense) => (
                <div 
                  key={expense.id} 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_ICONS[expense.category] || 'Package'}</span>
                    <div>
                      <p className="font-medium">{expense.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-lg">${expense.amount.toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExpense(expense.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}