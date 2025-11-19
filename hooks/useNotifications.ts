"use client";
import {
  createNotification,
  fetchAlerts,
  fetchSingleAlert,
} from "@/lib/api-client";
import { useNotificationStore } from "@/store/useNotificationStore";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useNotificationAlerts = () => {
  const setAll = useNotificationStore((s) => s.setAll);

  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications/list");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const notifications = data.map((n: any) => ({
        id: n._id,
        title: n.title,
        body: n.body,
        createdAt: n.createdAt,
        read: n.read,
      }));

      setAll(notifications);
      return notifications;
    },
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteAlerts = ({
  search = "",
  type,
  audienceType,
  role,
  sortField = "createdAt",
  sortOrder = "desc",
}: {
  search?: string;
  type?: string;
  audienceType?: string;
  role?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteQuery({
    queryKey: [
      "all-alerts",
      search,
      type,
      audienceType,
      role,
      sortField,
      sortOrder,
    ],
    queryFn: ({ pageParam = 0 }) =>
      fetchAlerts({
        skip: pageParam,
        search,
        type,
        audienceType,
        role,
        sortField,
        sortOrder,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
};

export const useViewAlert = (id: string) => {
  return useQuery({
    queryKey: ["alert", id],
    queryFn: () => fetchSingleAlert(id),
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
