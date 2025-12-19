"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { MessageSquarePlus } from "lucide-react";
import ChatList from "./ChatList";
import { useState } from "react";
import { usePresence } from "@/hooks/useChats";

const ChatMain = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  usePresence();

  return (
    <div className="flex h-[calc(100vh-144px)]">
      {/* Sidebar */}
      <div
        className={cn(
          "w-full border-r bg-background md:w-96",
          selectedChatId && "hidden md:block"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h1 className="text-xl font-bold">Chats</h1>
          <Button variant="ghost" size="icon">
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </div>

        <ChatList
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      </div>

      {/* Main Chat Area */}
      <div
        className={cn(
          "flex-1 bg-muted/30",
          !selectedChatId && "hidden md:flex"
        )}
      >
        {/* {selectedChatId ? (
          <ChatWindow
            chatId={selectedChatId}
            onBack={() => setSelectedChatId(null)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Welcome to Chat</h2>
              <p className="text-muted-foreground">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ChatMain;
