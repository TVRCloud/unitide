"use client";

import { create } from "zustand";
import type { Dispatch, SetStateAction } from "react";
import {
  IEvent,
  IUser,
  TBadgeVariant,
  TVisibleHours,
  TWorkingHours,
} from "@/types/calender";

const WORKING_HOURS: TWorkingHours = {
  0: { from: 0, to: 0 },
  1: { from: 8, to: 17 },
  2: { from: 8, to: 17 },
  3: { from: 8, to: 17 },
  4: { from: 8, to: 17 },
  5: { from: 8, to: 17 },
  6: { from: 8, to: 12 },
};

const VISIBLE_HOURS: TVisibleHours = { from: 7, to: 18 };

interface CalendarState {
  selectedDate: Date;
  selectedUserId: IUser["id"] | "all";
  badgeVariant: TBadgeVariant;
  users: IUser[];
  visibleHours: TVisibleHours;
  workingHours: TWorkingHours;
  events: IEvent[];

  setSelectedDate: (date: Date | undefined) => void;
  setSelectedUserId: (userId: IUser["id"] | "all") => void;
  setBadgeVariant: (variant: TBadgeVariant) => void;
  setUsers: (users: IUser[]) => void;
  setVisibleHours: Dispatch<SetStateAction<TVisibleHours>>;
  setWorkingHours: Dispatch<SetStateAction<TWorkingHours>>;
  setEvents: Dispatch<SetStateAction<IEvent[]>>;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: new Date(),
  selectedUserId: "all",
  badgeVariant: "colored",
  users: [],
  visibleHours: VISIBLE_HOURS,
  workingHours: WORKING_HOURS,
  events: [],

  setSelectedDate: (date) => {
    if (!date) return;
    set({ selectedDate: date });
  },

  setSelectedUserId: (userId) => {
    set({ selectedUserId: userId });
  },

  setBadgeVariant: (variant) => {
    set({ badgeVariant: variant });
  },

  setUsers: (users) => {
    set({ users });
  },

  setVisibleHours: (updater) =>
    set((state) => ({
      visibleHours:
        typeof updater === "function" ? updater(state.visibleHours) : updater,
    })),

  setWorkingHours: (updater) =>
    set((state) => ({
      workingHours:
        typeof updater === "function" ? updater(state.workingHours) : updater,
    })),

  setEvents: (updater) =>
    set((state) => ({
      events: typeof updater === "function" ? updater(state.events) : updater,
    })),
}));
