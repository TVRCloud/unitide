"use client";

import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useCreateChat } from "@/hooks/useChats";
import { DropdownMenuItem } from "../ui/dropdown-menu";

interface ChatWithUserProps {
  userId: string;
  userName: string;
}

export default function ChatWithUser({ userId, userName }: ChatWithUserProps) {
  const router = useRouter();
  const { mutate: createChat, isPending } = useCreateChat();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    setIsLoading(true);
    try {
      createChat(
        {
          title: userName,
          members: [userId],
          type: "DIRECT",
        },
        {
          onSuccess: (data) => {
            router.push(`/chat/${data._id}`);
          },
          onError: (error) => {
            console.error("Failed to start chat:", error);
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Error starting chat:", error);
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleStartChat}
      disabled={isPending || isLoading}
    >
      <Mail className="mr-2 h-4 w-4" />
      Start Chat
    </DropdownMenuItem>
  );
}
