import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { sendChatMessage, getChatHistory } from "../api/auth";
import axios from "axios";
import ChatSidebar from "@/components/ChatSidebar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastMessage: string;
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [userProfile, setUserProfile] = useState<any>({
    name: "Friend",
    firstName: "Friend",
    monthlyBudget: 5000,
    totalSpentThisMonth: 0,
    remainingBudget: 5000,
    savingsGoals: []
  });

  // ---------------- FETCH USER PROFILE ----------------
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:8081/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserProfile(res.data);
      } catch (err) {
        console.log("Profile fetch failed, using defaults");
      }
    };

    fetchUserProfile();
    const interval = setInterval(fetchUserProfile, 10000); // Har 10 sec update
    return () => clearInterval(interval);
  }, []);

  // ---------------- FETCH CHAT HISTORY ----------------
 // ---------------- FETCH CHAT HISTORY ----------------
useEffect(() => {
  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:8081/api/chat/history", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const historyMessages: Message[] = res.data.map((m: any) => ({
        id: m.id.toString(),
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp),
      }));

      setMessages(historyMessages);
      if (historyMessages.length > 0) {
        const firstConv: Conversation = {
          id: "1",
          title: "Chat History",
          messages: historyMessages,
          lastMessage: historyMessages[historyMessages.length - 1].content,
          timestamp: new Date(),
        };
        setConversations([firstConv]);
        setActiveConversationId("1");
      }
    } catch (err) {
      console.log("Chat history fetch failed", err);
    }
  };

  fetchChatHistory();
}, []);


  // ---------------- SMART RESPONSE FALLBACK ----------------
  const generateSmartResponse = (userInput: string): string => {
    const { firstName, monthlyBudget, totalSpentThisMonth, remainingBudget, savingsGoals } = userProfile;
    const lower = userInput.toLowerCase();

    if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey") || lower.includes("salam")) {
      return `Hello ${firstName}! 👋 I'm your Personal CFO.\nYour budget: $${monthlyBudget}\nSpent: $${totalSpentThisMonth}\nRemaining: $${remainingBudget}\nHow can I help you today?`;
    }

    if (lower.includes("budget") || lower.includes("spending") || lower.includes("kharcha")) {
      return `${firstName}, here's your budget update:\n💰 Monthly Budget: $${monthlyBudget}\n🛍️ Spent this month: $${totalSpentThisMonth}\n💸 Remaining: $${remainingBudget}\n${remainingBudget > 1000 ? "You're doing great! Keep it up!" : "Let's control spending a bit!"}`;
    }

    if (lower.includes("save") || lower.includes("bachat") || lower.includes("goal") || lower.includes("target")) {
      if (savingsGoals.length === 0) {
        return `${firstName}, you don't have any savings goals yet!\nGo to Savings tab and create one — I'll help you reach it fast! 🚀`;
      }

      const goal = savingsGoals[0];
      const left = goal.targetAmount - goal.currentAmount;
      const months = remainingBudget > 500 ? Math.ceil(left / (remainingBudget * 0.4)) : "many";

      return `${firstName}, your goal "${goal.name}" is on track!\n🎯 Progress: $${goal.currentAmount} / $${goal.targetAmount}\n💔 Left: $${left}\n⏰ Estimated: ~${months} months (if you save 40% of remaining budget)\nYou're killing it! 🔥`;
    }

    if (lower.includes("coffee") || lower.includes("zomato") || lower.includes("food") || lower.includes("swiggy")) {
      return `Haha ${firstName}, food delivery pe control kar lo!\nLast month you spent a lot on Zomato/Swiggy.\nCut it by 50% → extra $200-300/month save ho jayega! ☕➡️🏦`;
    }

    if (lower.includes("risk") || lower.includes("crash")) {
      return `Go to Risk Agent tab, ${firstName}!\nI can simulate market crash and tell you how much your portfolio survives! 📉`;
    }

    return `${firstName}, ask me anything!\nTry: "How's my budget?" or "When will I buy iPhone?" or "Give me saving tips"`;
  };

  // ---------------- CHAT MANAGEMENT ----------------
  const createNewChat = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      lastMessage: "",
      timestamp: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMessages([]);
  };

  const selectChat = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setActiveConversationId(id);
      setMessages(conv.messages);
    }
  };

  const deleteChat = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        selectChat(remaining[0].id);
      } else {
        createNewChat();
      }
    }
  };

  useEffect(() => {
    if (conversations.length === 0) {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- SEND MESSAGE ----------------
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const currentInput = input;
    setInput("");

    try {
      const aiResponse = await sendChatMessage(currentInput);
      const aiMessage: Message = {
        id: aiResponse.id.toString(),
        role: "assistant",
        content: aiResponse.content,
        timestamp: new Date(aiResponse.timestamp),
      };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: finalMessages,
                title: finalMessages.length === 2 ? currentInput.slice(0, 30) + "..." : conv.title,
                lastMessage: aiMessage.content.slice(0, 50) + "...",
                timestamp: new Date(),
              }
            : conv
        )
      );
    } catch (err: any) {
      const smartReply = generateSmartResponse(currentInput);
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: smartReply,
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, fallbackMessage];
      setMessages(finalMessages);
      
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: finalMessages,
                title: finalMessages.length === 2 ? currentInput.slice(0, 30) + "..." : conv.title,
                lastMessage: fallbackMessage.content.slice(0, 50) + "...",
                timestamp: new Date(),
              }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="flex h-[calc(100vh-3.5rem-4rem)] md:h-[calc(100vh-3.5rem)] bg-background">
      {sidebarOpen && (
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewChat={createNewChat}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}
      
      <div className="flex flex-col flex-1 relative">
        <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">
                {conversations.find((c) => c.id === activeConversationId)?.title || "New Chat"}
              </h2>
              <p className="text-xs text-muted-foreground">Personal CFO • {userProfile.firstName}</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto px-4 py-6">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Hello {userProfile.firstName}!</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  I'm your Personal CFO. I know your budget, goals, and spending habits.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  <Card className="p-4 hover:bg-accent cursor-pointer transition-colors" onClick={() => setInput("How much can I save this month?")}>
                    <p className="text-sm font-medium">Savings Potential</p>
                    <p className="text-xs text-muted-foreground mt-1">Calculate monthly savings</p>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer transition-colors" onClick={() => setInput("Show my budget overview")}>
                    <p className="text-sm font-medium">Budget Overview</p>
                    <p className="text-xs text-muted-foreground mt-1">Review spending patterns</p>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer transition-colors" onClick={() => setInput("When will I reach my savings goal?")}>
                    <p className="text-sm font-medium">Goal Timeline</p>
                    <p className="text-xs text-muted-foreground mt-1">Track progress to goals</p>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer transition-colors" onClick={() => setInput("Give me money-saving tips")}>
                    <p className="text-sm font-medium">Smart Tips</p>
                    <p className="text-xs text-muted-foreground mt-1">Personalized advice</p>
                  </Card>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-4 animate-fade-in ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-10 w-10 shrink-0 border-2 border-border">
                    <AvatarFallback className={message.role === "user" ? "bg-gradient-to-br from-primary to-primary/60" : "bg-gradient-to-br from-secondary to-secondary/60"}>
                      {message.role === "user" ? <User className="h-5 w-5 text-primary-foreground" /> : <Sparkles className="h-5 w-5 text-secondary-foreground" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col gap-2 max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground px-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 animate-fade-in">
                  <Avatar className="h-10 w-10 shrink-0 border-2 border-border">
                    <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/60">
                      <Sparkles className="h-5 w-5 text-secondary-foreground animate-pulse" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 mb-16 md:mb-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <Input
                  placeholder={`Ask ${userProfile.firstName}'s Personal CFO anything...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="pr-12 min-h-[52px] resize-none rounded-xl border-2 focus-visible:ring-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSend} 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg gradient-finance"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
