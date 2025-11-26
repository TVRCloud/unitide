/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

type Props = {
  chat: any;
  isActive: boolean;
  onClick: () => void;
};

const ChatListItem = ({ chat, isActive, onClick }: Props) => {
  const lastMessage = chat.lastMessage?.content;
  const lastMessageTime = chat.lastMessage?.createdAt
    ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const avatarText =
    chat.title
      ?.split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
        isActive ? "bg-accent" : "hover:bg-accent/50"
      }`}
    >
      <Avatar className="h-9 w-9">
        {chat.avatar ? (
          <AvatarImage src={chat.avatar} />
        ) : (
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {avatarText}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-sm truncate">{chat.title}</h3>
          {lastMessageTime && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {lastMessageTime}
            </span>
          )}
        </div>
        {lastMessage && (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground truncate">
              {lastMessage}
            </p>
            <Badge>{chat.unreadMessages || 0}</Badge>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatListItem;
