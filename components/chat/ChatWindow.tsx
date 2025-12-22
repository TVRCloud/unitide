import { useGetChatById } from "@/hooks/useChats";

type Props = {
  chatId: string;
  onBack: () => void;
};
const ChatWindow = ({ chatId, onBack }: Props) => {
  const chatDetails = useGetChatById(chatId);

  return <div>ChatWindow</div>;
};

export default ChatWindow;
