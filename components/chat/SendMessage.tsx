"use client";

import { useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import { Input } from "../ui/input";
import { useSendMessage } from "@/hooks/useChat";
import { toast } from "sonner";

interface SendMessageProps {
  chatId: string;
  replyTo?: string;
}

const SendMessage = ({ chatId, replyTo }: SendMessageProps) => {
  const sendMessage = useSendMessage();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessage.mutate(
      { chatId, content: message, replyTo },
      {
        onSuccess: () => {
          setMessage("");
        },
        onError: () => {
          toast.error("Failed to send message");
        },
      }
    );
  };

  return (
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 px-4 py-2 bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        />

        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || sendMessage.isPending}
          className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SendMessage;
