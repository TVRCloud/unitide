/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useChatMembers } from "@/hooks/useChats";
import { Phone, Video, Info, MoreVertical, Loader2 } from "lucide-react";

export function ChatHeader({ chatId }: { chatId: string }) {
  const { data: members, isLoading } = useChatMembers(chatId);

  if (isLoading || !members) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  // Assuming members have an 'isOnline' or 'status' field
  const onlineMembers =
    members?.filter((m: any) => m.isOnline || m.status === "online")?.length ||
    0;

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={members?.[0]?.avatar || "/placeholder.svg?height=40&width=40"}
          />
          <AvatarFallback>{members?.[0]?.name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-foreground">Chat</h2>
          <p className="text-xs text-muted-foreground">
            {onlineMembers} online · {members?.length} total
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <Info className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
