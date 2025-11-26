/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useInfiniteChats } from "@/hooks/useChat";
import { MoreVertical, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "../ui/scroll-area";
import ChatListItem from "./ChatListItem";
import { useRouter, useSearchParams } from "next/navigation";
import ChatArea from "./ChatArea";

const ChatMain = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatIdFromURL = searchParams.get("chatId");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState<any>(chatIdFromURL ?? null);
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteChats(searchTerm);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredChats = data?.pages.flat() || [];

  //   const pinnedChats = filteredChats.filter((chat) => chat.isPinned);
  //   const regularChats = filteredChats.filter((chat) => !chat.isPinned);

  return (
    <div className="flex h-[calc(100vh-100px)]">
      <div className="flex w-full">
        <div className="hidden md:flex md:w-96 border-r border-border flex-col ">
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Chats</h1>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-accent transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
          </div>

          {/* chat list */}
          <ScrollArea className="h-[calc(100vh-210px)]">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              filteredChats.map((chat, index) => {
                console.log(chat);
                return (
                  <ChatListItem
                    key={index}
                    chat={chat}
                    isActive={selectedChat === chat._id}
                    onClick={() => {
                      setSelectedChat(chat._id);

                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.set("chatId", chat._id);
                      router.push(`?${params.toString()}`);
                    }}
                  />
                );
              })
            )}

            <div className="flex justify-center" ref={ref}>
              <span className="p-4 text-center text-muted-foreground text-xs">
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                  ? "Scroll to load more"
                  : "No more chats"}
              </span>
            </div>
          </ScrollArea>
        </div>

        {/* chqt sidebar */}
        {/* chqt sidebar */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <ChatArea selectedChat={selectedChat} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/10">
              <div className="text-center">
                <div className="mb-4 text-6xl">💬</div>
                <h2 className="text-xl font-semibold mb-2">Select a chat</h2>
                <p className="text-muted-foreground">
                  Choose a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMain;
