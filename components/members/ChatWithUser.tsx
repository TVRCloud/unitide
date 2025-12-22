import { MessageSquarePlus } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useCreateChat } from "@/hooks/useChats";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  userId: string;
  userName: string;
};

const ChatWithUser = ({ userId, userName }: Props) => {
  const router = useRouter();
  const createChat = useCreateChat();

  const onChatClick = () => {
    createChat.mutate(
      { participantId: userId },
      {
        onSuccess: (res) => {
          const chatId = res.data.data._id;
          toast.success("Chat with " + userName + " created successfully");
          router.push(`/chat?chatId=${chatId}`);
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
