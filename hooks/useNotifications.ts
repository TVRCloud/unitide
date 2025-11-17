"use client";
import { fetchAlerts, fetchSingleAlert } from "@/lib/api-client";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useNotifications(user: { id: string; roles: string[] }) {
  useEffect(() => {
    const ev = new EventSource("/api/notifications/stream");

    ev.onmessage = (msg) => {
      if (msg.data === "ping") return;

      const event = JSON.parse(msg.data);

      if (event.type === "NEW") {
        const n = event.payload;

        let shouldReceive = false;

        if (n.audienceType === "ALL") shouldReceive = true;
        if (n.audienceType === "ROLE" && n.roles?.includes(user.roles[0]))
          shouldReceive = true;
        if (n.audienceType === "USER" && n.users?.includes(user.id))
          shouldReceive = true;

        if (shouldReceive) {
          toast(n.title, { description: n.body });
        }
      }
    };

    return () => ev.close();
  }, [user]);
}

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
