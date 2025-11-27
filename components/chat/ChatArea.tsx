import { useViewChat } from "@/hooks/useChat";
import { Button } from "../ui/button";
import {
  Menu,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import MessageBubble from "./MessageBubble";
import { useRef, useState } from "react";
import TypingIndicator from "./TypingIndicator";

type Props = {
  selectedChat: string;
};

const messages = [
  {
    id: "m1",
    from: "them",
    type: "text",
    content: "Are we still on for coffee?",
    time: "2 days ago 11:00 AM",
    seen: true,
  },
  {
    id: "m2",
    from: "me",
    type: "text",
    content: "Yes! See you tomorrow!",
    time: "2 days ago 11:05 AM",
    seen: true,
  },
  {
    id: "m3",
    from: "them",
    type: "text",
    content: "See you tomorrow!",
    time: "2 days ago 11:06 AM",
    seen: true,
  },
];
const ChatArea = ({ selectedChat }: Props) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const { data, isLoading } = useViewChat(selectedChat);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
        <Button className="md:hidden p-2 -ml-2">
          <Menu className="h-5 w-5" />
        </Button>

        <Avatar className="h-9 w-9">
          <AvatarImage src={data.avatar} />
          <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground font-semibold">
            {data.avatar}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm truncate">{data.title}</h2>
          <p className="text-xs text-muted-foreground">
            {data.isOnline ? "Online" : "Last seen recently"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="outline">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="outline">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-muted/10">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMe={message.from === "me"}
          />
        ))}

        {isTyping || (1 === 1 && <TypingIndicator />)}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-accent transition-colors">
            <Smile className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-accent transition-colors">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </button>
          <Input
            type="text"
            placeholder="Type a message..."
            //   value={message}
            //   onChange={(e) => setMessage(e.target.value)}
            //   onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-4 py-2 bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <button
            //   onClick={handleSendMessage}
            //   disabled={!message.trim()}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatArea;
