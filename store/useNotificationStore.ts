"use client";
import { useAuth } from "@/hooks/useUser";
import { useEffect } from "react";
import { toast } from "sonner";
import { create } from "zustand";

export interface NotificationItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type(type: any): unknown;
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (n: NotificationItem) => void;
  markAsRead: (id: string) => void;
  setAll: (items: NotificationItem[]) => void;
  clearAll: () => void;
}
const MAX_NOTIFICATIONS = 20;

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications].slice(0, MAX_NOTIFICATIONS),
    })),
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
    fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
  },
  setAll: (items) =>
    set({
      notifications: items
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, MAX_NOTIFICATIONS),
    }),

  clearAll: () => set({ notifications: [] }),
}));

export const useNotificationStream = () => {
  const { user } = useAuth();

  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    const es = new EventSource("/api/notifications/stream");

    es.onmessage = (event) => {
      const n = JSON.parse(event.data);

      const roles = Array.isArray(user.roles)
        ? user.roles
        : user.role
        ? [user.role]
        : [];

      let shouldReceive = false;

      if (n.audienceType === "ALL") shouldReceive = true;

      if (
        n.audienceType === "ROLE" &&
        n.roles?.some((r: string) => roles.includes(r))
      ) {
        shouldReceive = true;
      }

      if (n.audienceType === "USER" && n.users?.includes(user._id)) {
        shouldReceive = true;
      }

      if (shouldReceive) {
        addNotification({
          id: n._id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt,
          read: false,
          type: n.type,
        });

        toast.success(n.title, { description: n.body });
      }
    };

    es.onerror = () => console.error("Notification stream error");

    return () => es.close();
  }, [user, addNotification]);
};
