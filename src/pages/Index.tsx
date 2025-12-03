import { Link } from "react-router-dom";
import { ArrowRight, Brain, TrendingUp, Shield, Calculator, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Financial Intelligence</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your 24/7 Virtual
              <span className="gradient-finance bg-clip-text text-transparent"> CFO</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              FinSight Lite AI combines cutting-edge AI agents to manage your budget, 
              optimize investments, minimize taxes, and protect your financial future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="gradient-finance text-lg">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Your AI Financial Agents
            </h2>
            <p className="text-muted-foreground text-lg">
              Four specialized AI agents working together to optimize your finances
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-shadow hover:card-shadow-hover transition-all animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Budget Agent</h3>
                    <p className="text-muted-foreground">
                      Smart cash flow analysis, automatic categorization, and personalized 
                      spending insights to keep you on track.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow hover:card-shadow-hover transition-all animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Invest Agent</h3>
                    <p className="text-muted-foreground">
                      AI-powered portfolio optimization with reinforcement learning simulations 
                      for smarter investment decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow hover:card-shadow-hover transition-all animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Calculator className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Tax Agent</h3>
                    <p className="text-muted-foreground">
                      Automatic deduction discovery, real-time optimization, and simplified 
                      filing to maximize your returns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow hover:card-shadow-hover transition-all animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Risk Agent</h3>
                    <p className="text-muted-foreground">
                      AI-driven scenario forecasting, risk assessment, and proactive 
                      recommendations to secure your future.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-finance">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of users leveraging AI to build wealth and financial security.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link to="/signup">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 FinSight Lite AI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
