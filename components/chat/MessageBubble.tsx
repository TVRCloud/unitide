/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

const MessageBubble = ({ message, isMe }: { message: any; isMe: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-3 py-2 ${
          isMe
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        {!isMe && message.from !== "me" && (
          <p className="text-xs font-semibold mb-1 text-green-500">
            {message.from}
          </p>
        )}
        <p className="text-sm wrap-break-word">{message.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span
            className={`text-xs ${
              isMe ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          >
            {message.time}
          </span>
          {isMe &&
            (message.seen ? (
              <CheckCheck
                className={`h-3 w-3 ${
                  isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              />
            ) : (
              <Check
                className={`h-3 w-3 ${
                  isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              />
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
