import { createChat, fetchChats } from "@/lib/api-client";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

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
