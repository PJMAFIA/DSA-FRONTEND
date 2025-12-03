import { useState, useEffect } from 'react';
import { PiggyBank, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'http://localhost:8081/api';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export default function SavingsGoalScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [progressAmount, setProgressAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const { toast } = useToast();

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(response.data);
    } catch (error: any) {
      console.error('Failed to fetch goals:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
    const interval = setInterval(fetchGoals, 3000);
    return () => clearInterval(interval);
  }, []);

  const createGoal = async () => {
    if (!name || !target) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/goals`,
        { name, targetAmount: parseFloat(target) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: 'Success', description: 'Goal created successfully' });
      setName('');
      setTarget('');
      fetchGoals();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to create goal', variant: 'destructive' });
    }
  };

  const addProgress = async (goalId: string) => {
    if (!progressAmount) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/goals/${goalId}/progress`,
        { amount: parseFloat(progressAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: 'Success', description: 'Progress added successfully' });
      setProgressAmount('');
      setSelectedGoalId('');
      fetchGoals();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to add progress', variant: 'destructive' });
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'Success', description: 'Goal deleted successfully' });
      fetchGoals();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to delete goal', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <PiggyBank className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Savings Goals</h1>
        </div>

        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                placeholder="Goal Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Target Amount ($)"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
              <Button
                onClick={createGoal}
                className="gradient-finance"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
            </div>
          </CardContent>
        </Card>

        {goals.length === 0 ? (
          <Card className="text-center p-12 animate-fade-in">
            <p className="text-muted-foreground">No goals set. Create your first goal above!</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {goals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <Card key={goal.id} className="animate-fade-in">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-bold">{goal.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                        </span>
                        <Badge variant="secondary">
                          {percentage.toFixed(0)}% Complete
                        </Badge>
                      </div>
                      <Progress value={percentage} className="h-3" />
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Add Progress $"
                        value={selectedGoalId === goal.id ? progressAmount : ''}
                        onChange={(e) => {
                          setSelectedGoalId(goal.id);
                          setProgressAmount(e.target.value);
                        }}
                      />
                      <Button
                        onClick={() => addProgress(goal.id)}
                        disabled={selectedGoalId !== goal.id || !progressAmount}
                      >
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}