import { useViewChat, useViewChatMessages } from "@/hooks/useChat";
import { Button } from "../ui/button";
import { Menu, MoreVertical, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MessageBubble from "./MessageBubble";
import { useRef, useState } from "react";
import TypingIndicator from "./TypingIndicator";
import { ScrollArea } from "../ui/scroll-area";
import SendMessage from "./SendMessage";

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
  {
    id: "m4",
    from: "me",
    type: "text",
    content: "See you tomorrow!",
    time: "2 days ago 11:06 AM",
    seen: true,
  },
  {
    id: "m5",
    from: "them",
    type: "text",
    content: "See you tomorrow!",
    time: "2 days ago 11:06 AM",
    seen: true,
  },
  {
    id: "m6",
    from: "me",
    type: "text",
    content: "See you tomorrow!",
    time: "2 days ago 11:06 AM",
    seen: true,
  },
  {
    id: "m7",
    from: "them",
    type: "text",
    content: "See you tomorrow!",
    time: "2 days ago 11:06 AM",
    seen: true,
  },
  {
    id: "m8",
    from: "me",
    type: "text",
    content: "See you tomorrow!",
    time: "2 days ago 11:06 AM",
    seen: true,
  },
  {
    id: "m9",
    from: "them",
    type: "text",
    content: "See you tomorrow!",
    time: "2 days ago 11:06 AM",
    seen: true,
  },
  {
    id: "m10",
    from: "me",
    type: "text",
    content: "See you tomorrow!",
    time: "2 days ago 11:06 AM",
    seen: true,
  },
  {
    id: "m11",
    from: "them",
    type: "text",
    content: "See you tomorrow!",
    time: "2 days ago 11:06 AM",
    seen: true,
  },
  {
    id: "m12",
    from: "me",
    type: "text",
    content: "See you tomorrow!",
    time: "2 days ago 11:06 AM",
    seen: true,
  },
  {
    id: "m13",
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

  const {
    data: messagesss,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingMessages,
    isFetchingNextPage,
  } = useViewChatMessages(selectedChat);

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

      <ScrollArea className="flex-1 overflow-y-auto p-4 bg-muted/10">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMe={message.from === "me"}
          />
        ))}

        {isTyping || (1 === 1 && <TypingIndicator />)}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <SendMessage chatId={selectedChat} />
    </>
  );
};

export default ChatArea;
