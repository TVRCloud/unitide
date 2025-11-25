import { createChat, fetchChats, fetchSingleChat } from "@/lib/api-client";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

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
