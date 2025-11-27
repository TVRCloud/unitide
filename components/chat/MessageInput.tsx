"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { useSendMessage } from "@/hooks/useChats";

export function MessageInput({ chatId }: { chatId: string }) {
  const [content, setContent] = useState("");
  const { mutate: sendMessage, isPending } = useSendMessage(chatId);

  const handleSend = async () => {
    if (!content.trim()) return;
    sendMessage(content, {
      onSuccess: () => {
        setContent("");
      },
    });
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t border-border bg-card">
      <Button
        size="icon"
        variant="ghost"
        className="shrink-0 text-muted-foreground hover:text-foreground"
        disabled={isPending}
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      <Input
        placeholder="Type a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        className="flex-1"
        disabled={isPending}
      />
      <Button
        onClick={handleSend}
        disabled={isPending || !content.trim()}
        size="icon"
        className="shrink-0"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
