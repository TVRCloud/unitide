/* eslint-disable @typescript-eslint/no-explicit-any */
interface Chat {
  _id: string;
  type: "private" | "group";
  name?: string;
  avatar?: string;
  participants: any[];
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  isArchived?: boolean;
  isMuted?: boolean;
}

interface User {
  _id: string;
}

export function getChatName(chat: Chat, user: User): string {
  if (chat.type === "group") return chat.name || "Group Chat";
  const otherParticipant = chat.participants.find((p) => p._id !== user?._id);
  return otherParticipant?.name || "Unknown";
}

export function getChatAvatar(chat: Chat, user: User): string | undefined {
  if (chat.type === "group") return chat.avatar;
  const otherParticipant = chat.participants.find((p) => p._id !== user?._id);
  return otherParticipant?.avatar;
}
