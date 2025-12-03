import { Plus, MessageSquare, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatSidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative z-50 lg:z-auto h-full w-80 border-r bg-card flex flex-col transition-transform duration-300 ease-out shadow-2xl lg:shadow-none`}
      >
        {/* New Chat Button */}
        <div className="p-4 border-b bg-background/50">
          <Button
            onClick={onNewChat}
            className="w-full gradient-finance hover:shadow-lg transition-all"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  No conversations yet
                </p>
                <p className="text-xs text-muted-foreground/70 mt-2">
                  Start a new chat to begin
                </p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`relative flex items-center justify-between p-3 rounded-xl cursor-pointer group ${
                    activeConversationId === conv.id
                      ? "bg-accent/80 shadow-sm border border-border"
                      : "hover:bg-accent/40 border border-transparent"
                  }`}
                  onClick={() => onSelectChat(conv.id)}
                >
                  {/* Left: Message Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                      <h4 className="text-sm font-semibold truncate">{conv.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground/90 truncate leading-relaxed mb-1">
                      {conv.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {conv.timestamp.toLocaleDateString([], { month: "short", day: "numeric" })}
                    </p>
                  </div>

                  {/* Right: Hover 3-dots menu */}
                  <div className="relative flex-shrink-0 ml-2">
                    {/* 3-dots visible on hover */}
                    <Button
                      variant="ghost"
                      size="icon"
                     className="h-8 w-8 opacity-0 group-hover:opacity-100 transition relative z-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === conv.id ? null : conv.id);
                      }}
                    >
                       <MoreVertical className="h-4 w-4" />
                    </Button>

                    {/* Dropdown menu */}
                    {openMenuId === conv.id && (
                      <div className="absolute right-0 top-full mt-1 w-28 bg-card border border-border rounded-md shadow-lg z-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start rounded-none hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(conv.id);
                            setOpenMenuId(null);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t bg-background/50">
          <div className="text-xs text-muted-foreground text-center font-medium">
            {conversations.length} {conversations.length === 1 ? "conversation" : "conversations"}
          </div>
        </div>
      </div>
    </>
  );
}
