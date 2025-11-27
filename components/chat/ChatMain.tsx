"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatList } from "./ChatList";

const ChatMain = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-sidebar flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h1 className="font-bold text-lg text-sidebar-foreground">Chats</h1>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <ChatList
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedChatId ? (
          <>
            <ChatHeader chatId={selectedChatId} />
            <MessageList chatId={selectedChatId} />
            <MessageInput chatId={selectedChatId} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No chat selected</p>
              <p className="text-sm">
                Select a chat to start messaging or create a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMain;
