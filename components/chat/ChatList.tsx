/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/useUser";
import { useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useInfiniteChats } from "@/hooks/useChats";
import { useInView } from "react-intersection-observer";
import { DateTime } from "luxon";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

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

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

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
    if (chat.type === "group") return chat.name || "Group Chat";
    const otherParticipant = chat.participants.find((p) => p._id !== user?._id);
    return otherParticipant?.name || "Unknown";
  }

  function getChatAvatar(chat: Chat): string | undefined {
    if (chat.type === "group") return chat.avatar;
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

  return (
    <ScrollArea className="h-full">
      <motion.div className="space-y-1 p-2" initial="hidden" animate="visible">
        <AnimatePresence>
          {isLoading
            ? [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg"></Skeleton>
              ))
            : filteredChats.map((chat) => (
                <motion.button
                  key={chat._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  layout
                  whileTap={{ scale: 0.97 }}
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
                      <h3 className="truncate font-semibold">
                        {getChatName(chat)}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(chat.lastMessageAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm text-muted-foreground">
                        {chat.lastMessagePreview || "No messages yet"}
                      </p>

                      <AnimatePresence>
                        {chat.unreadCount && chat.unreadCount > 0 ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Badge className="h-5 min-w-5 rounded-full px-1.5 text-xs">
                              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                            </Badge>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              ))}
        </AnimatePresence>

        <div className="flex justify-center" ref={ref}>
          <span className="p-4 text-center text-muted-foreground text-xs">
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Scroll to load more"
              : "No more chats"}
          </span>
        </div>
      </motion.div>
    </ScrollArea>
  );
};

export default ChatList;
