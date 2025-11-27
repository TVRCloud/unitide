"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useChats } from "@/hooks/useChats";

export function ChatList({
  selectedChatId,
  onSelectChat,
}: {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}) {
  const { data: chats, isLoading } = useChats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="space-y-2 p-4">
        {chats?.map((chat) => (
          <Button
            key={chat._id}
            onClick={() => onSelectChat(chat._id)}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-auto py-3 px-3 rounded-lg transition-colors hover:bg-sidebar-accent text-left",
              selectedChatId === chat._id && "bg-sidebar-accent"
            )}
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage
                src={chat.avatar || "/placeholder.svg?height=40&width=40"}
              />
              <AvatarFallback>{chat.title?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{chat.title}</p>
              <p className="text-xs text-muted-foreground">
                {chat.members.length} members
              </p>
            </div>
            {chat.isPinned && (
              <Badge variant="secondary" className="ml-auto">
                Pinned
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
