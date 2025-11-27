import { MessageSquarePlus } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateChat } from "@/hooks/useChats";

type Props = {
  userId: string;
  userName: string;
};

const ChatWithUser = ({ userId, userName }: Props) => {
  const createChat = useCreateChat();
  const router = useRouter();

  const onChatClick = () => {
    createChat.mutate(
      {
        title: userName,
        type: "DIRECT",
        members: [userId],
      },
      {
        onSuccess: () => {
          router.push(`/chat?chatId=${userId}`);
          toast.success("User created successfully");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };
  return (
    <DropdownMenuItem onClick={onChatClick}>
      <MessageSquarePlus className="mr-2 h-4 w-4" />
      Chat
    </DropdownMenuItem>
  );
};

export default ChatWithUser;
