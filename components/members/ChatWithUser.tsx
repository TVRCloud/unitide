import { MessageSquarePlus } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

type Props = {
  userId: string;
  userName: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChatWithUser = ({ userId, userName }: Props) => {
  // const onChatClick = () => {
  //   createChat.mutate(
  //     {
  //       title: userName,
  //       type: "DIRECT",
  //       members: [userId],
  //     },
  //     {
  //       onSuccess: () => {
  //         router.push(`/chat?chatId=${userId}`);
  //         toast.success("User created successfully");
  //       },
  //       onError: () => {
  //         toast.error("Something went wrong");
  //       },
  //     }
  //   );
  // };
  return (
    <DropdownMenuItem>
      <MessageSquarePlus className="mr-2 h-4 w-4" />
      Chat
    </DropdownMenuItem>
  );
};

export default ChatWithUser;
