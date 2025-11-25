import { MessageSquarePlus } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useCreateChat } from "@/hooks/useChat";
import { toast } from "sonner";

type Props = {
  userId: string;
  userName: string;
};

const ChatWithUser = ({ userId, userName }: Props) => {
  const createChat = useCreateChat();

  const onChatClick = () => {
    createChat.mutate(
      {
        title: userName,
        type: "DIRECT",
        members: [userId],
      },
      {
        onSuccess: () => {
          window.location.href = `/chat`;
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
