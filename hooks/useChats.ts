import {
  createPrivateChat,
  fetchChatDetails,
  fetchChatMessages,
  fetchChats,
  sendMessage,
} from "@/lib/api-client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrivateChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-chats"] });
    },
  });
};

export const useInfiniteChats = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["all-chats", search],
    queryFn: ({ pageParam = 0 }) =>
      fetchChats({
        skip: pageParam,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
};

export const useGetChatById = (id: string) => {
  return useQuery({
    queryKey: ["chat", id],
    queryFn: () => fetchChatDetails(id),
  });
};

export const useGetMessagesByChatId = (id: string) => {
  return useQuery({
    queryKey: ["messages", id],
    queryFn: () => fetchChatMessages(id),
  });
};

export const useSendMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { content: string; type: string }) =>
      sendMessage(chatId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    },
  });
};
