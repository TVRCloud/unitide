/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useInfiniteChats } from "@/hooks/useChats";
import { useInView } from "react-intersection-observer";
import { DateTime } from "luxon";

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
  const { ref, inView } = useInView();
  const { user } = useAuth();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteChats("");

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredChats = data?.pages.flat() || [];

  function getChatName(chat: Chat): string {
    if (chat.type === "group") {
      return chat.name || "Group Chat";
    }

    console.log("chat", chat);

    // For private chats, show the other participant's name
    const otherParticipant = chat.participants.find((p) => p._id !== user?._id);
    return otherParticipant?.name || "Unknown";
  }

  function getChatAvatar(chat: Chat): string | undefined {
    if (chat.type === "group") {
      return chat.avatar;
    }

    const otherParticipant = chat.participants.find((p) => p._id !== user?._id);
    return otherParticipant?.avatar;
  }

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function formatTime(date?: string): string {
    if (!date) return "";

    const messageDate = DateTime.fromISO(date);
    const now = DateTime.now();

    const diff = now.diff(messageDate, ["minutes", "hours", "days"]).toObject();

    if ((diff.minutes ?? 0) < 1) return "Now";
    if ((diff.minutes ?? 0) < 60) return `${Math.floor(diff.minutes!)}m`;
    if ((diff.hours ?? 0) < 24) return `${Math.floor(diff.hours!)}h`;
    if ((diff.days ?? 0) < 7) return `${Math.floor(diff.days!)}d`;

    return messageDate.toLocaleString(DateTime.DATE_SHORT);
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {filteredChats &&
          filteredChats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => onSelectChat(chat._id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                selectedChatId === chat._id && "bg-accent"
              )}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={getChatAvatar(chat) || "/placeholder.svg"}
                  alt={getChatName(chat)}
                />
                <AvatarFallback>
                  {getInitials(getChatName(chat))}
                </AvatarFallback>
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

        <div className="flex justify-center" ref={ref}>
          <span className="p-4 text-center text-muted-foreground text-xs">
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Scroll to load more"
              : "No more chats"}
          </span>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ChatList;
