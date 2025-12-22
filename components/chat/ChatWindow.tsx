import { useGetChatById, useGetMessagesByChatId } from "@/hooks/useChats";
import { Button } from "../ui/button";
import { MoreVertical, Phone, Video } from "lucide-react";
import { SignedAvatar } from "../ui/signed-avatar";
import { getChatAvatar, getChatName } from "@/utils/chats";
import { useAuth } from "@/hooks/useUser";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";

type Props = {
  chatId: string;
};
const ChatWindow = ({ chatId }: Props) => {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: chat, isLoading } = useGetChatById(chatId);
  const { data: messages } = useGetMessagesByChatId(chatId);

  function scrollToBottom() {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <div className="flex items-center gap-3 border-b bg-background p-2">
        <SignedAvatar
          src={getChatAvatar(chat, user)}
          name={getChatName(chat, user)}
          avatarClassName="h-12 w-12"
        />

        <div className="flex-1">
          <h2 className="font-semibold">{getChatName(chat, user)}</h2>
          <p className="text-sm text-muted-foreground">
            {chat?.type === "group"
              ? `${chat.participants.length} participants`
              : "Online"}
          </p>
        </div>

        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}

      <ScrollArea className="flex-1 p-4 h-[calc(100vh-240px)]">
        <div className="space-y-4">
          <pre>{JSON.stringify(messages, null, 2)}</pre>
          {Array.from({ length: 30 }).map((_, index) => (
            <h1 key={index} className="text-2xl">
              helloooo
            </h1>
          ))}
          {/* {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={message.senderId._id === user?.id}
            />
          ))} */}
          <div ref={scrollRef} />
        </div>

        {/* {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        )} */}
      </ScrollArea>

      {/* typing indicator */}

      {/* input */}

      <MessageInput chatId={chatId} />
    </div>
  );
};

export default ChatWindow;
