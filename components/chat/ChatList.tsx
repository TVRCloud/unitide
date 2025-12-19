/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/useUser";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface Chat {
  _id: string;
  type: "private" | "group";
  name?: string;
  avatar?: string;
  participants: any[];
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  isArchived?: boolean;
  isMuted?: boolean;
}

interface ChatListProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

const ChatList = ({ selectedChatId, onSelectChat }: ChatListProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {chats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => onSelectChat(chat._id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
              selectedChatId === chat._id && "bg-accent"
            )}
          >
            <Avatar className="h-12 w-12">
              {/* <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={getChatName(chat)} /> */}
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>

            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate font-semibold">test name</h3>
                <span className="text-xs text-muted-foreground">Time</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm text-muted-foreground">
                  {chat.lastMessagePreview || "No messages yet"}
                </p>
                {chat.unreadCount && chat.unreadCount > 0 ? (
                  <Badge
                    variant="default"
                    className="h-5 min-w-5 rounded-full px-1.5 text-xs"
                  >
                    {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                  </Badge>
                ) : null}
              </div>
            </div>
          </button>
        ))}

        {chats.length === 0 && (
          <div className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">No chats yet</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatList;
