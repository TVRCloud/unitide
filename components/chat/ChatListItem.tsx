/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar } from "@radix-ui/react-avatar";
import { motion } from "framer-motion";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

type Props = { chat: any; isActive: boolean; onClick: () => void };
const ChatListItem = ({ chat, isActive, onClick }: Props) => {
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
        <AvatarImage src={chat.avatar} />
        <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground font-semibold">
          {chat.avatar}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-sm truncate">{chat.title}</h3>
          {/* <span className="text-xs text-muted-foreground whitespace-nowrap">
            {chat.lastMessageTime}
          </span> */}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground truncate">
            {chat.lastMessage}
          </p>
          <Badge>{chat.unreadMessages || 1}</Badge>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatListItem;
