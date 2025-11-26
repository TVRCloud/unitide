import {
  createChat,
  fetchChatMessages,
  fetchChats,
  fetchSingleChat,
  sendMessage,
} from "@/lib/api-client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useCreateChat = () => {
  return useMutation({
    mutationFn: createChat,
  });
};

export const useInfiniteChats = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["chats", search],

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

export const useViewChat = (id: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["chat", id],
    queryFn: () => fetchSingleChat(id),
  });
};

export const useViewChatMessages = (chatId: string) => {
  return useInfiniteQuery({
    queryKey: ["chat-message", chatId],

    queryFn: ({ pageParam = 0 }) => fetchChatMessages(chatId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
};
