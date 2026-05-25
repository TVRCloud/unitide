import { fetchSessions, terminateSession } from "@/lib/api-client";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useInfiniteSessions = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["all-sessions", search],
    queryFn: ({ pageParam = 0 }) =>
      fetchSessions({
        skip: pageParam,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
};

export const useTerminateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: terminateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-sessions"] });
    },
  });
};
