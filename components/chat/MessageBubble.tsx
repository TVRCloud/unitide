import { cn } from "@/lib/utils";
import { SignedAvatar } from "../ui/signed-avatar";
import { DateTime } from "luxon";
import { Check, CheckCheck } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Message {
  _id: string;
  senderId: any;
  content?: string;
  type: string;
  media?: any;
  isEdited: boolean;
  createdAt: string;
  status?: "sent" | "delivered" | "read";
  reactions?: any[];
  replyTo?: any;
}

type Props = {
  message: Message;
  isOwn: boolean;
  chatType: string;
};
const MessageBubble = ({ message, isOwn, chatType }: Props) => {
  function renderStatusIcon() {
    if (!isOwn) return null;

    if (message.status === "read") {
      return <CheckCheck className="h-4 w-4 text-blue-500" />;
    }
    if (message.status === "delivered") {
      return <CheckCheck className="h-4 w-4 text-muted-foreground" />;
    }
    return <Check className="h-4 w-4 text-muted-foreground" />;
  }

  return (
    <div className={cn("flex gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
      {!isOwn && chatType === "group" && (
        <SignedAvatar
          src={message.senderId.avatar}
          name={message.senderId.name}
        />
      )}

      <div
        className={cn(
          "flex max-w-[70%] flex-col gap-1",
          isOwn ? "items-end" : "items-start"
        )}
      >
        {!isOwn && chatType === "group" && (
          <span className="text-xs font-semibold text-foreground">
            {message.senderId.name}
          </span>
        )}
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isOwn
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {message.type === "text" && (
            <p className="wrap-break-word leading-relaxed">{message.content}</p>
          )}

          <div className="mt-1 flex items-center gap-1 text-xs opacity-70 justify-end">
            <span>{DateTime.fromISO(message.createdAt).toLocaleString()}</span>
            {message.isEdited && <span>(edited)</span>}
            {renderStatusIcon()}
          </div>
        </div>

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1">
            {message.reactions.map((reaction, index) => (
              <span key={index} className="text-lg">
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
