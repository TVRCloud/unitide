"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

export interface ChatMember {
  _id: string;
  name: string;
  avatar?: string;
  email: string;
  status?: string;
}

export interface User {
  _id: string;
  name: string;
  avatar?: string;
  email: string;
  status?: string;
}

export interface Chat {
  _id: string;
  title: string;
  type: "GROUP" | "DIRECT";
  members: User[];
  admins: User[];
  avatar?: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface CreateChatPayload {
  title: string;
  members: string[];
  type?: "DIRECT" | "GROUP";
  avatar?: string;
}

export interface Message {
  _id: string;
  chatId: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
    email: string;
  };
  content: string;
  attachments: Array<{ url: string; type: string }>;
  status: "SENT" | "DELIVERED" | "READ";
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

const MESSAGES_PER_PAGE = 30;

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json() as Promise<CurrentUser>;
    },
    staleTime: Number.POSITIVE_INFINITY, // User data rarely changes
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateChatPayload) => {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create chat");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await fetch("/api/chats");
      if (!res.ok) throw new Error("Failed to fetch chats");
      return res.json() as Promise<Chat[]>;
    },
    refetchInterval: 5000,
  });
}

export function useChatMembers(chatId: string | null) {
  return useQuery({
    queryKey: ["chatMembers", chatId],
    queryFn: async () => {
      if (!chatId) return [];
      const res = await fetch(`/api/chats/${chatId}/members`);
      if (!res.ok) throw new Error("Failed to fetch members");
      return res.json() as Promise<ChatMember[]>;
    },
    enabled: !!chatId,
  });
}

export function useAddChatMember(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/chats/${chatId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to add member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMembers", chatId] });
    },
  });
}

export function useRemoveChatMember(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      const res = await fetch(`/api/chats/${chatId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });
      if (!res.ok) throw new Error("Failed to remove member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMembers", chatId] });
    },
  });
}

export function useMessages(chatId: string | null) {
  return useInfiniteQuery({
    queryKey: ["messages", chatId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!chatId) return { messages: [], hasMore: false };

      const res = await fetch(
        `/api/chats/${chatId}/messages?limit=${MESSAGES_PER_PAGE}&skip=${
          pageParam * MESSAGES_PER_PAGE
        }`
      );
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      return {
        messages: data,
        hasMore: data.length === MESSAGES_PER_PAGE,
      };
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length : undefined,
    enabled: !!chatId,
    initialPageParam: 0,
  });
}

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json() as Promise<Message>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    },
  });
}

export function useMarkMessagesAsRead(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const res = await fetch(
        `/api/chats/${chatId}/messages/${messageId}/read`,
        {
          method: "POST",
        }
      );
      if (!res.ok) throw new Error("Failed to mark as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    },
  });
}
