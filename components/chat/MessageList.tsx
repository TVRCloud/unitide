/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Message,
  useCurrentUser,
  useMarkMessagesAsRead,
  useMessages,
} from "@/hooks/useChats";

export function MessageList({ chatId }: { chatId: string | null }) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(chatId);
  const { data: currentUser } = useCurrentUser();
  const { mutate: markAsRead } = useMarkMessagesAsRead(chatId || "");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [streamMessages, setStreamMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!chatId) return;

    const eventSource = new EventSource(`/api/chats/${chatId}/messages/stream`);

    eventSource.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data);
        setStreamMessages((prev) => {
          const exists = prev.some((m) => m._id === newMessage._id);
          return exists ? prev : [...prev, newMessage];
        });
      } catch (error) {
        console.error("[v0] SSE parse error:", error);
      }
    };

    eventSource.onerror = () => {
      console.error("[v0] SSE connection error");
      eventSource.close();
    };

    return () => eventSource.close();
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, streamMessages]);

  useEffect(() => {
    if (!currentUser || !data?.pages[0]?.messages) return;

    data.pages[0].messages.forEach((msg: Message) => {
      if (msg.status !== "READ" && msg.sender._id !== currentUser._id) {
        markAsRead(msg._id);
      }
    });
  }, [data?.pages[0]?.messages, currentUser, markAsRead]);

  if (isLoading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const allMessages = [
    ...(data?.pages.flatMap((page) => page.messages) || []),
    ...streamMessages,
  ];

  return (
    <ScrollArea className="flex-1 h-full w-full">
      <div className="flex flex-col gap-4 p-4">
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="mx-auto"
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Load older messages"
            )}
          </Button>
        )}

        {allMessages?.map((message: Message) => (
          <div key={message._id} className="flex gap-3 group">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage
                src={
                  message.sender.avatar || "/placeholder.svg?height=32&width=32"
                }
              />
              <AvatarFallback>{message.sender.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{message.sender.name}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
                {message.status === "READ" && (
                  <Badge variant="outline" className="text-xs">
                    Read
                  </Badge>
                )}
              </div>
              <p className="text-sm text-foreground mt-1 leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}
