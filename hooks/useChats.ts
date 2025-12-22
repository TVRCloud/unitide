import { createPrivateChat, fetchChats } from "@/lib/api-client";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrivateChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-chats"] });
    },
  });
};
