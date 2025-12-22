export type ChatType = "private" | "group";

export interface Participant {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Chat {
  _id: string;
  type: ChatType;
  participants: Participant[];
  admins: string[];
  createdBy: string;
  isArchived: boolean;
  isMuted: boolean;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  lastMessagePreview: string;
  __v: number;
}

export type ChatListResponse = Chat[];
