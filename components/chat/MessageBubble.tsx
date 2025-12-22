import { cn } from "@/lib/utils";

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
};
const MessageBubble = ({ message, isOwn }: Props) => {
  return (
    <div className={cn("flex gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
      MessageBubble
      {isOwn}
    </div>
  );
};

export default MessageBubble;
