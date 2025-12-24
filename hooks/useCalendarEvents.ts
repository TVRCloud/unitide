"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/api-client";
import { useCalendarStore } from "@/store/useCalender";

export const useCalendarEvents = () => {
  const { setEvents, selectedDate, selectedUserId } = useCalendarStore();

  const query = useQuery({
    queryKey: ["events", selectedUserId, selectedDate],
    queryFn: () =>
      fetchEvents({
        skip: 0,
        search: "",
        userId: selectedUserId === "all" ? undefined : selectedUserId,
        date: selectedDate.toISOString(),
      }),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!query.data) return;
    setEvents(query.data);
  }, [query.data, setEvents]);

  return query;
};
